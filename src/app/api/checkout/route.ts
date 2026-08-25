import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY is not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16' as any,
    });

    const { tier, clientId, rfpIntakeId, successUrl, cancelUrl } = await req.json();
    const unitAmount = tier === 'pilot' ? 49500 : 150000;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `BidPulse Proposal Package (${tier || 'Standard'})`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        client_id: clientId || 'client@bidpulse.local',
        selected_tier: tier || 'single_bid_pass',
        rfp_intake_id: rfpIntakeId || '',
      },
      success_url: successUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/binders?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}