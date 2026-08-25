import { createClient } from '@supabase/supabase-js';
import FulfillmentBoard from '@/components/coordinator/FulfillmentBoard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ProposalsPortalPage() {
  const { data: proposals, error } = await supabaseAdmin
    .from('proposal_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-rose-500">
        Error loading fulfillment proposals: {error.message}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Proposal Fulfillment Workspace
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track active proposal drafting stages, quality assurance review, and client deliveries.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/portal/coordinator"
              className="text-xs px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              ← Back to Intake Queue
            </Link>
          </div>
        </header>

        <FulfillmentBoard initialProposals={proposals || []} />
      </div>
    </main>
  );
}