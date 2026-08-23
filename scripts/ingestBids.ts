import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Trade Classification Keyword Rules
const TRADE_RULES: Record<string, string[]> = {
  commercial_janitorial: ['janitorial', 'custodial', 'cleaning', 'day porter', 'sanitization', 'floor care', 'disinfection'],
  landscaping_grounds: ['landscaping', 'mowing', 'grounds maintenance', 'turf', 'tree trimming', 'irrigation', 'lawn care', 'retention pond'],
  pressure_washing_facades: ['pressure washing', 'power washing', 'exterior cleaning', 'facade cleaning', 'surface cleaning'],
  commercial_painting: ['painting', 'coating', 'paint', 'wall covering', 'sealant'],
  security_guard_services: ['security guard', 'security officer', 'patrol', 'surveillance', 'armed guard', 'unarmed guard'],
  hvac_preventative_maintenance: ['hvac', 'chiller', 'air conditioning', 'boiler', 'mechanical maintenance', 'refrigeration'],
  hauling_waste_removal: ['hauling', 'waste removal', 'debris removal', 'trash collection', 'roll-off', 'dumpster'],
};

function classifyTrade(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [trade, keywords] of Object.entries(TRADE_RULES)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return trade;
    }
  }
  return null;
}

interface RawBid {
  title: string;
  agency: string;
  solicitation_number: string;
  submission_deadline: string;
  pre_bid_date?: string;
  estimated_value?: string;
  portal_url: string;
}

// Target public feed parser (Florida / Regional Public Procurement Feeds)
async function fetchPublicBids(): Promise<RawBid[]> {
  console.log('Fetching public solicitation feeds...');

  // Sample feed integration payload simulating Florida Vendor Bid & Regional Municipal Portal ingestion
  const simulatedFeed: RawBid[] = [
    {
      title: 'Annual Facilities Janitorial Services for Duval Health Department Clinics',
      agency: 'Florida Department of Health - Duval County',
      solicitation_number: `DOH-JAX-${Math.floor(1000 + Math.random() * 9000)}`,
      submission_deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_value: '$180,000/year',
      portal_url: 'https://vendor.myfloridamarketplace.com',
    },
    {
      title: 'Grounds Maintenance & Right-of-Way Mowing Services - North District',
      agency: 'FDOT District 2 (Jacksonville)',
      solicitation_number: `FDOT-E2-${Math.floor(1000 + Math.random() * 9000)}`,
      submission_deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_value: '$420,000/year',
      portal_url: 'https://vendor.myfloridamarketplace.com',
    },
    {
      title: 'Quarterly High-Pressure Washing & Parking Deck Maintenance',
      agency: 'Downtown Investment Authority (DIA) - Jacksonville',
      solicitation_number: `DIA-PW-${Math.floor(1000 + Math.random() * 9000)}`,
      submission_deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_value: '$95,000 total',
      portal_url: 'https://procurement.coj.net',
    },
    {
      title: 'Commercial Interior & Exterior Painting for Community Center Facilities',
      agency: 'City of Jacksonville - Parks & Recreation',
      solicitation_number: `COJ-PNT-${Math.floor(1000 + Math.random() * 9000)}`,
      submission_deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_value: '$140,000 total',
      portal_url: 'https://procurement.coj.net',
    },
    {
      title: 'Unarmed Security Guard & Access Control Services for Fleet Operations Facility',
      agency: 'JEA (Jacksonville Electric Authority)',
      solicitation_number: `JEA-SEC-${Math.floor(1000 + Math.random() * 9000)}`,
      submission_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_value: '$290,000/year',
      portal_url: 'https://www.jea.com/about/procurement',
    },
  ];

  return simulatedFeed;
}

async function runIngestion() {
  const bids = await fetchPublicBids();
  console.log(`Discovered ${bids.length} potential solicitations.`);

  let insertedCount = 0;

  for (const bid of bids) {
    const trade = classifyTrade(bid.title);
    if (!trade) {
      console.log(`Skipping: "${bid.title}" (Does not match active 7 trade categories)`);
      continue;
    }

    // Upsert into Supabase (avoids duplicate solicitation numbers)
    const { data: existing } = await supabase
      .from('solicitations')
      .select('id')
      .eq('solicitation_number', bid.solicitation_number)
      .single();

    if (existing) {
      console.log(`Exists: ${bid.solicitation_number} already in catalog.`);
      continue;
    }

    const { error } = await supabase.from('solicitations').insert({
      title: bid.title,
      agency: bid.agency,
      solicitation_number: bid.solicitation_number,
      trade: trade,
      estimated_value: bid.estimated_value || null,
      submission_deadline: bid.submission_deadline,
      portal_url: bid.portal_url,
      status: 'open',
    });

    if (error) {
      console.error(`Error inserting ${bid.solicitation_number}:`, error.message);
    } else {
      console.log(`✓ Inserted [${trade}]: ${bid.title} (${bid.solicitation_number})`);
      insertedCount++;
    }
  }

  console.log(`Ingestion completed. ${insertedCount} new contracts posted.`);
}

runIngestion();
