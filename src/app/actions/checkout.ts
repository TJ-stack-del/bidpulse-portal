'use server';

import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabaseServer'; 


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-28.acacia' as any,
});

export async function createCheckoutSession(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized: You must be logged in to checkout.');
  }

  const tier = formData.get('tier')?.toString() || 'single_bid_pass';
  const rfpIntakeId = formData.get('rfp_intake_id')?.toString();

  const priceMap: Record<string, string> = {
    single_bid_pass: process.env.STRIPE_PRICE_SINGLE_BID_PASS!,     // $297 One-Time
    contract_radar: process.env.STRIPE_PRICE_CONTRACT_RADAR!,       // $399 / mo with 14-day trial
  };

  const priceId = priceMap[tier];
  if (!priceId) {
    throw new Error(`Invalid pricing tier selected: ${tier}`);
  }

  const isSubscription = tier === 'contract_radar';

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: isSubscription ? 'subscription' : 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/proposals?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
    customer_email: user.email,
    metadata: {
      client_id: user.id,
      selected_tier: tier,
      ...(rfpIntakeId && { rfp_intake_id: rfpIntakeId }),
    },
  };

  // Configure 14-day trial dynamically for the Contract Radar subscription tier
  if (isSubscription) {
    sessionParams.subscription_data = {
      trial_period_days: 14,
      metadata: {
        client_id: user.id,
        selected_tier: tier,
      },
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.url) {
    throw new Error('Failed to create Stripe checkout session URL.');
  }

  redirect(session.url);
}