import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

// Use service role for backend webhook ingestion to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const rfpIntakeId = session.metadata?.rfp_intake_id;
    const tier = session.metadata?.tier;

    if (rfpIntakeId) {
      await supabaseAdmin
        .from('rfp_intakes')
        .update({
          status: 'in_review',
          tier: tier || 'single_bid_pass',
          raw_payload: session,
        })
        .eq('id', rfpIntakeId);
    } else {
      await supabaseAdmin.from('rfp_intakes').insert({
        status: 'in_review',
        tier: tier || 'single_bid_pass',
        raw_payload: session,
      });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}