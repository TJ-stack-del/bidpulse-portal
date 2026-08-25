import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!stripeSecretKey || !webhookSecret) {
    console.error('Missing Stripe server secrets');
    return NextResponse.json({ error: 'Stripe configuration missing on server' }, { status: 500 });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase server credentials');
    return NextResponse.json({ error: 'Database configuration missing on server' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16' as any,
  });

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const body = await req.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    const clientId = metadata.client_id || session.customer_email || 'client@bidpulse.local';
    const tier = metadata.selected_tier || 'single_bid_pass';
    const rfpIntakeId = metadata.rfp_intake_id;

    const { error: insertError } = await supabaseAdmin.from('rfp_intakes').insert({
      id: rfpIntakeId || undefined,
      client_email: clientId,
      tier: tier,
      status: 'in_review',
      solicitation_title: session.amount_total === 49500 ? 'Single RFP Pilot Pass' : 'Turnkey Proposal Package',
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('Failed to insert rfp_intake from webhook:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}