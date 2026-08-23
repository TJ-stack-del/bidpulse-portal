export const dynamic = 'force-dynamic';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-blue-500/15 text-blue-400 text-xs font-bold px-4 py-2 rounded-full border border-blue-500/30 uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            Florida Municipal & Federal RFP Concierge Engine
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none text-white">
            Secure Government Contracts Faster with <span className="text-blue-500 underline decoration-blue-500/40 underline-offset-8">BidPulse</span>
          </h1>

          {/* Subheadline */}
          <p className="text-slate-300 text-lg sm:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
            Instantly ingest local Duval County and Florida state solicitations, match against your contractor entity credentials, and auto-generate compliant 5-tab proposal binders in minutes.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/opportunities"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/20 transition text-sm flex items-center justify-center gap-2"
            >
              Browse Active Florida RFPs &rarr;
            </Link>
            <Link 
              href="/dashboard/proposals"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold px-8 py-4 rounded-xl transition text-sm flex items-center justify-center gap-2"
            >
              My Proposal Binders
            </Link>
          </div>
        </div>

        {/* Feature Grid - Tailored to Gov Contracting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto">
          
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition">
            <div className="text-blue-400 font-mono text-xs uppercase font-bold tracking-wider mb-3">01 / Ingestion</div>
            <h3 className="text-xl font-bold text-white mb-2">Duplex & Florida Portals</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automated scraping and parsing of Jacksonville, Duval County, and Florida state procurement boards to catch RFPs the moment they drop.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition">
            <div className="text-emerald-400 font-mono text-xs uppercase font-bold tracking-wider mb-3">02 / Compliance</div>
            <h3 className="text-xl font-bold text-white mb-2">Automated Fit Scoring</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Instant AI evaluation matching solicitation scope requirements directly against your company past performance and NAICS credentials.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition">
            <div className="text-amber-400 font-mono text-xs uppercase font-bold tracking-wider mb-3">03 / Generation</div>
            <h3 className="text-xl font-bold text-white mb-2">5-Tab Proposal Binders</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Compile audit-ready technical volumes, pricing sheets, and compliance exhibits formatted specifically for government review boards.
            </p>
          </div>

        </div>

        {/* Live Metrics Ticker */}
        <div className="mt-20 bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900 border border-slate-800/80 rounded-3xl p-8 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-blue-400 mb-1">$42.8M+</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Contract Value Captured</div>
          </div>
          <div className="border-y sm:border-y-0 sm:border-x border-slate-800 py-4 sm:py-0">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-1">94.2%</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Average Compliance Score</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-amber-400 mb-1">320+</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active FL Municipal Solicitations</div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500 bg-slate-950/80">
        BidPulse Portal &copy; 2026 · Enterprise Government Contracting & Proposal Intelligence
      </footer>

    </div>
  );
}
