import { createClient } from '@supabase/supabase-js';
import CoordinatorIntakeTable from '@/components/coordinator/CoordinatorIntakeTable';

export const dynamic = 'force-dynamic';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CoordinatorPortalPage() {
  const { data: intakes, error } = await supabaseAdmin
    .from('rfp_intakes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading intake requests: {error.message}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Coordinator Intake Queue
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Review incoming RFP submissions, update statuses, and assign target turnaround dates.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {intakes?.length || 0} Total Submissions
            </span>
          </div>
        </header>

        <CoordinatorIntakeTable initialIntakes={intakes || []} />
      </div>
    </main>
  );
}