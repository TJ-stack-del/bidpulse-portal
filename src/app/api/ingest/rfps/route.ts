import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

// Normalized sample feed for Florida municipal & regional agencies
const regionalMunicipalFeed = [
  {
    source: 'City of Jacksonville',
    external_id: 'COJ-RFP-0144-26',
    title: 'Citywide Turnkey Janitorial & Daily Custodial Services for Municipal Facilities',
    agency: 'City of Jacksonville / Duval County Public Facilities',
    trade: 'Commercial Janitorial',
    deadline: '10/10/2026',
    ref_number: 'RFP-0132-26',
    estimated_value: '$285,000 / yr',
    description: 'Comprehensive 7-day facility maintenance, floor stripping, sanitization, and trash removal.',
    portal_url: 'https://procurement.coj.net',
    state: 'FL'
  },
  {
    source: 'JTA',
    external_id: 'JTA-2026-0089',
    title: 'High-Pressure Washing & Concrete Surface Cleaning for Municipal Garages & Skyway Stations',
    agency: 'Jacksonville Transportation Authority (JTA)',
    trade: 'Pressure Washing / Facades',
    deadline: '10/15/2026',
    ref_number: 'JTA-RFP-25-0044',
    estimated_value: '$155,000 / year',
    description: 'Quarterly hot-water surface degreasing and platform pressure washing.',
    portal_url: 'https://jtafla.com/procurement',
    state: 'FL'
  },
  {
    source: 'City of Jacksonville',
    external_id: 'COJ-LND-0992',
    title: 'Citywide Retention Basin Mowing, Grounds Maintenance & Turf Management',
    agency: 'City of Jacksonville - Public Works & Parks',
    trade: 'Landscaping / Grounds',
    deadline: '10/18/2026',
    ref_number: 'RFP-LND-0312-26',
    estimated_value: '$440,000 / year',
    description: 'Routine vegetative management, bush hogging retention areas, and edge trimming.',
    portal_url: 'https://procurement.coj.net',
    state: 'FL'
  },
  {
    source: 'DCPS',
    external_id: 'DCPS-2026-901',
    title: 'District-Wide Turnkey Custodial & Sanitization Services for Region 2 Schools',
    agency: 'Duval County Public Schools (DCPS) - Purchasing Services',
    trade: 'Commercial Janitorial',
    deadline: '10/15/2026',
    ref_number: 'RFP-0245-26',
    estimated_value: '$520,000 / year',
    description: 'Nightly sanitization and day-porter staffing for primary education centers.',
    portal_url: 'https://dcps.duvalschools.org/purchasing',
    state: 'FL'
  },
  {
    source: 'Duval Public Works',
    external_id: 'DPW-WST-4401',
    title: 'On-Call Bulk Debris Removal, Roll-Off Container Hauling & Storm Waste Management',
    agency: 'Duval County Public Works',
    trade: 'Hauling / Waste Removal',
    deadline: '10/18/2026',
    ref_number: 'RFP-WST-2210-26',
    estimated_value: '$350,000 / year',
    description: 'Emergency debris clearing and scheduled dumpster roll-off hauls.',
    portal_url: 'https://procurement.coj.net',
    state: 'FL'
  },
  {
    source: 'SAM.gov',
    external_id: 'SAM-NAV-2026-001',
    title: 'Naval Station Mayport & NAS JAX Administrative Facilities Janitorial Services',
    agency: 'Department of the Navy - NAVFAC Southeast',
    trade: 'Commercial Janitorial',
    deadline: '11/02/2026',
    ref_number: 'N69450-26-R-0012',
    estimated_value: '$890,000 / year',
    description: 'Federal custodial contract requiring active SAM registration and CAGE code verification.',
    portal_url: 'https://sam.gov',
    state: 'FL'
  }
];

export async function POST(req: Request) {
  try {
    const supabase = getAdminClient();
    const samApiKey = process.env.SAM_GOV_API_KEY;

    let itemsToUpsert = [...regionalMunicipalFeed];

    // If a live SAM.gov API key is configured, pull live opportunities
    if (samApiKey) {
      try {
        const samRes = await fetch(
          `https://api.sam.gov/opportunities/v2/search?api_key=${samApiKey}&limit=10&postedFrom=01/01/2026&state=FL&ptype=p,k,o`,
          { headers: { 'Accept': 'application/json' } }
        );
        if (samRes.ok) {
          const samData = await samRes.json();
          if (samData.opportunitiesData) {
            const parsed = samData.opportunitiesData.map((opp: any) => ({
              source: 'SAM.gov Live',
              external_id: opp.noticeId || opp.solicitationNumber,
              title: opp.title,
              agency: opp.department || 'Federal Agency',
              trade: opp.naicsCode === '561720' ? 'Commercial Janitorial' : 'Commercial Services',
              deadline: opp.responseDeadLine ? new Date(opp.responseDeadLine).toLocaleDateString() : 'Rolling',
              ref_number: opp.solicitationNumber || opp.noticeId,
              estimated_value: '$500,000+ (Est)',
              description: opp.description || 'Federal procurement opportunity.',
              portal_url: opp.uiLink || 'https://sam.gov',
              state: 'FL'
            }));
            itemsToUpsert = [...itemsToUpsert, ...parsed];
          }
        }
      } catch (samErr) {
        console.warn('SAM.gov live pull skipped, using regional feed:', samErr);
      }
    }

    // Upsert items by external_id
    const { data, error } = await supabase
      .from('solicitations')
      .upsert(itemsToUpsert, { onConflict: 'external_id' })
      .select('id, title, trade');

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: `Ingested & synced ${data?.length || 0} solicitations into active database feed.`,
      records: data
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('solicitations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ solicitations: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, solicitations: [] }, { status: 500 });
  }
}
