import { createClient } from '@supabase/supabase-js';
import BinderCard, { BinderProposal } from '@/components/binders/BinderCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BindersPage() {
  const { data: proposals, error } = await supabaseAdmin
    .from('proposal_requests')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              My Proposal Binders
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Review live progress, milestone timelines, and download completed proposal deliverables.
            </p>
          </div>
          <Link
            href="/portal/coordinator"
            className="text-xs px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition self-start md:self-auto"
          >
            Coordinator Portal →
          </Link>
        </header>

        {error && (
          <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-lg text-xs">
            Failed to load binders: {error.message}
          </div>
        )}

        <div className="space-y-4">
          {proposals && proposals.length > 0 ? (
            proposals.map((item) => (
              <BinderCard key={item.id} proposal={item as BinderProposal} />
            ))
          ) : (
            <div className="text-center py-16 bg-[#0b1329]/40 border border-slate-800 rounded-xl space-y-3">
              <p className="text-slate-400 text-sm">No proposal binders active yet.</p>
              <p className="text-xs text-slate-500">
                Submit an RFP or check out with Single Bid Pass to start drafting.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}