import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { solicitationTitle, issuingAgency, trade, refNumber, userEmail, bidId } = body;

    if (!solicitationTitle) {
      return NextResponse.json(
        { error: 'Missing solicitation title.' },
        { status: 400 }
      );
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    console.log('[Checkout] Secret key present:', !!secretKey);

    if (secretKey) {
      const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' as any });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Turnkey Proposal Assembly: ${solicitationTitle}`,
                description: `5-Tab Municipal Compliance Binder for ${issuingAgency || 'Contracting Agency'} (Ref #${refNumber || 'N/A'})`,
              },
              unit_amount: 49500, // $495.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: userEmail && userEmail.includes('@') ? userEmail : undefined,
        metadata: {
          solicitationTitle: solicitationTitle || '',
          issuingAgency: issuingAgency || '',
          trade: trade || '',
          refNumber: refNumber || '',
          bidId: bidId || '',
        },
        success_url: `${appUrl}/dashboard/proposals?session_id={CHECKOUT_SESSION_ID}&ordered=${encodeURIComponent(solicitationTitle)}`,
        cancel_url: `${appUrl}/opportunities?canceled=true`,
      });

      return NextResponse.json({
        url: session.url,
        success: true,
      });
    }

    // Fallback if no secret key is present
    return NextResponse.json({
      url: `/dashboard/proposals?ordered=${encodeURIComponent(solicitationTitle)}&simulated=true`,
      success: true,
    });
  } catch (err: any) {
    console.error('[Stripe Checkout Error]:', err);
    return NextResponse.json(
      { error: err.message || 'Could not process assembly checkout.' },
      { status: 500 }
    );
  }
}
