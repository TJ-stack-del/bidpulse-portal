import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateTurnkeyProposalPdf } from '@/lib/pdf/proposalGenerator';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const isInline = searchParams.get('inline') === 'true';

    const supabase = getAdminClient();

    let requestRecord: any = null;

    if (id) {
      const { data } = await supabase
        .from('proposal_requests')
        .select('*')
        .eq('id', id)
        .single();
      requestRecord = data;
    }

    // If no specific record, generate fallback mock for immediate testing
    const payload = requestRecord?.raw_payload || {};

    const pdfBytes = await generateTurnkeyProposalPdf({
      contractor: {
        legalName: payload.contractor?.legalName || 'First Coast Grounds LLC',
        fein: payload.contractor?.fein || 'XX-XXXXXXX',
        sunbizNumber: payload.contractor?.sunbizNumber || 'L2400012345',
        licenseNumber: payload.contractor?.licenseNumber || 'CBC-1234567',
      },
      solicitation: {
        title: requestRecord?.solicitation_title || 'Citywide Turnkey Janitorial Services',
        agency: requestRecord?.issuing_agency || 'City of Jacksonville / Duval County',
        trade: payload.metadata?.trade || 'Commercial Janitorial',
        refNumber: payload.metadata?.refNumber || 'RFP-0132-26',
      }
    });

    const buffer = Buffer.from(pdfBytes);
    const dispositionType = isInline ? 'inline' : 'attachment';
    const filename = `BidPulse-5Tab-Binder-${(id || 'sample').substring(0, 8)}.pdf`;

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${dispositionType}; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error('PDF generation error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
