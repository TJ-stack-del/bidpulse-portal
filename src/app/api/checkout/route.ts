import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { solicitationTitle, issuingAgency, trade, refNumber, userEmail } = body;

    if (!solicitationTitle) {
      return NextResponse.json(
        { error: 'Missing solicitation title.' },
        { status: 400 }
      );
    }

    // In local development or pre-Stripe test environments, direct to success confirmation
    return NextResponse.json({
      url: `/dashboard/proposals?ordered=${encodeURIComponent(solicitationTitle)}`,
      success: true
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Could not process assembly request at this time.' },
      { status: 500 }
    );
  }
}
