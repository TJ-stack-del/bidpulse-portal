import Link from "next/link";

export default function HomePage() {
  const modules = [
    {
      title: "Operations Pipeline",
      href: "/admin",
      badge: "Core Workflow",
      desc: "Monitor active bids, track proposal deadlines, review overall statuses, and audit pipeline capacity.",
      action: "Launch Admin →",
      accent: "border-emerald-500/40 hover:border-emerald-400 bg-slate-900/90",
    },
    {
      title: "RFP Intake Engine",
      href: "/intake",
      badge: "Data Capture",
      desc: "Log commercial & institutional solicitations, scope details, agency requirements, and target contract values.",
      action: "Start Intake →",
      accent: "border-blue-500/40 hover:border-blue-400 bg-slate-900/90",
    },
    {
      title: "Bid Fit-Score Scorer",
      href: "/fit-score",
      badge: "Decision Matrix",
      desc: "Evaluate procurement alignment across past performance, certifications, labor capacity, and readiness.",
      action: "Run Scorer →",
      accent: "border-indigo-500/40 hover:border-indigo-400 bg-slate-900/90",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-12">
      <div className="max-w-6xl mx-auto w-full space-y-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
                BidPulse <span className="text-emerald-400">Portal</span>
              </h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Procurement pipeline intelligence & contract qualification engine
            </p>
          </div>
          <span className="text-xs font-mono uppercase bg-slate-900 border border-slate-700 px-3 py-1.5 rounded text-slate-300">
            Status: Systems Operational
          </span>
        </header>

        {/* Action Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((m) => (
            <div
              key={m.title}
              className={`border rounded-xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-lg ${m.accent}`}
            >
              <div className="space-y-3">
                <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 inline-block">
                  {m.badge}
                </span>
                <h2 className="text-xl font-bold text-slate-100">{m.title}</h2>
                <p className="text-sm text-slate-400 leading-relaxed">{m.desc}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/80">
                <Link
                  href={m.href}
                  className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
                >
                  {m.action}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
          <div>
            <div className="text-xs uppercase text-slate-400 font-semibold">Active Solicitations</div>
            <div className="text-2xl font-bold text-slate-100 mt-1">3 Queue</div>
          </div>
          <div>
            <div className="text-xs uppercase text-slate-400 font-semibold">Avg Fit Viability</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">86.3%</div>
          </div>
          <div>
            <div className="text-xs uppercase text-slate-400 font-semibold">Submission Target</div>
            <div className="text-2xl font-bold text-slate-100 mt-1">Q3 2026</div>
          </div>
          <div>
            <div className="text-xs uppercase text-slate-400 font-semibold">Pipeline Velocity</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">Optimal</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full pt-8 text-center sm:text-left text-xs text-slate-500 border-t border-slate-900 mt-12">
        BidPulse Portal Engine • Built for Contract Proposal Workflows
      </footer>
    </main>
  );
}