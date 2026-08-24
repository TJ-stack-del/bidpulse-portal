'use client';

import { useState } from 'react';
import Link from 'next/link';

const opportunitiesData = [
  {
    id: 1,
    trade: 'Commercial Janitorial',
    title: 'Custodial & Day Porter Services for Public Facilities',
    agency: 'Duval County Public Facilities - Ref. RFP-2026-28',
    deadline: '16 Days Left',
    badgeColor: 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
    estValue: 'Est. Value: $520,000/yr',
  },
  {
    id: 2,
    trade: 'Commercial Janitorial',
    title: 'Multi-Site Clinic Sanitization & Floor Maintenance',
    agency: 'Florida Dept. of Health - Duval - Ref. DOH-882-7712',
    deadline: '24 Days Left',
    badgeColor: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
    estValue: 'Est. Value: $180,000/yr',
  },
  {
    id: 3,
    trade: 'HVAC Maintenance',
    title: 'County Courthouse Chiller Plant & Air Handler Upkeep',
    agency: 'City of Jacksonville Facilities - Ref. JAX-HVAC-99',
    deadline: '12 Days Left',
    badgeColor: 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30',
    estValue: 'Est. Value: $340,000/yr',
  },
  {
    id: 4,
    trade: 'Landscaping & Grounds',
    title: 'Public Parks & Retention Pond Vegetation Management',
    agency: 'Jacksonville Parks & Recreation - Ref. PARK-2026-04',
    deadline: '30 Days Left',
    badgeColor: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    estValue: 'Est. Value: $210,000/yr',
  },
];

const trades = [
  'Commercial Janitorial',
  'Landscaping & Grounds',
  'Pressure Washing',
  'Commercial Painting',
  'Security Guard',
  'HVAC Maintenance',
  'Hauling & Waste',
];

export default function HomePage() {
  const [selectedTrade, setSelectedTrade] = useState('Commercial Janitorial');

  const filteredOpportunities = opportunitiesData.filter(
    (opp) => opp.trade === selectedTrade
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans transition-colors duration-200">
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-500/20">
              <span>⚡ One bid, one flat fee. No monthly bill.</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              We write the bid paperwork so you can do the work.
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
              Stop scrolling endless lead alerts. <strong className="text-slate-900 dark:text-white">BidPulse</strong> is your on-demand proposal department for Duval County and Florida municipal contracts: choose your solicitation, and we deliver a completed, agency-compliant binder in 10 to 14 business days.
            </p>

            {/* Flat Fee & Pricing Callout Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Turnkey Proposal Package</span>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">$1,500 &ndash; $3,000 <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/bid</span></div>
                </div>
                <span className="bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-1 rounded-full">
                  10&ndash;14 Days
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">What You Get in Your Inbox:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">✓ Clean one-page company overview</div>
                  <div className="flex items-center gap-2">✓ Requirement compliance checklist</div>
                  <div className="flex items-center gap-2">✓ Plain-English plan of work</div>
                  <div className="flex items-center gap-2">✓ Right forms & proof, ready to-sign</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link 
                href="/opportunities"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition text-center text-sm shadow-lg shadow-blue-600/20"
              >
                Explore Active RFPs &rarr;
              </Link>
              <Link 
                href="/dashboard/proposals"
                className="w-full sm:w-auto bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-bold px-8 py-4 rounded-xl transition text-center text-sm shadow-sm"
              >
                View Proposal Binders
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Trade Selector & Filtered Opportunities */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Step 1: Interactive Trade Selector */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase font-bold tracking-wider">
                1. Select your trade to view open contracts
              </div>
              <div className="flex flex-wrap gap-2">
                {trades.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTrade(t)}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer ${
                      selectedTrade === t
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50'
                    }`}
                  >
                    {t === 'Commercial Janitorial' && '🛠️ '}
                    {t === 'Landscaping & Grounds' && '🌿 '}
                    {t === 'Pressure Washing' && '⚡ '}
                    {t === 'Commercial Painting' && '🏢 '}
                    {t === 'Security Guard' && '🛡️ '}
                    {t === 'HVAC Maintenance' && '🔧 '}
                    {t === 'Hauling & Waste' && '🚛 '}
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Filtered Local Opportunities */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                  2. Open Florida Opportunities ({selectedTrade})
                </div>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                  {filteredOpportunities.length} match(es)
                </span>
              </div>

              {filteredOpportunities.length > 0 ? (
                filteredOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{opp.title}</h3>
                        <span className={`border text-[10px] font-bold px-2 py-0.5 rounded ${opp.badgeColor}`}>
                          {opp.deadline}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{opp.agency}</p>
                      <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold pt-1">{opp.estValue}</div>
                    </div>
                    <Link
                      href="/opportunities"
                      className="w-full sm:w-auto bg-blue-500/10 hover:bg-blue-600 text-blue-600 hover:text-white dark:text-blue-400 dark:hover:text-white border border-blue-500/30 font-semibold px-4 py-2 rounded-xl text-xs transition text-center shrink-0"
                    >
                      Request Proposal Binder &rarr;
                    </Link>
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl text-center space-y-2">
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">No active solicitations listed for {selectedTrade} today.</div>
                  <p className="text-xs text-slate-500">Click &apos;Explore Active RFPs&apos; above or request a custom watcher for this trade.</p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Target Trades Section */}
        <div className="mt-24 border-t border-slate-200 dark:border-slate-900 pt-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-8 text-center">
            Built for the crew on a roof, in a server room, or with a buffer on the floor.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
              <div className="text-blue-600 dark:text-blue-400 font-mono text-xs font-bold uppercase mb-2">Trade Profile</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">HVAC & Mechanical</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">Service, install, and controls work for schools, city buildings, campuses, and facility portfolios.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
              <div className="text-blue-600 dark:text-blue-400 font-mono text-xs font-bold uppercase mb-2">Trade Profile</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Commercial Cleaning</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">Janitorial, floor care, and post-construction cleaning for buildings that score bids strictly.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
              <div className="text-blue-600 dark:text-blue-400 font-mono text-xs font-bold uppercase mb-2">Trade Profile</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">IT Subcontractors</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">Cabling, low-voltage, help desk, and device support for businesses and public agencies.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
              <div className="text-blue-600 dark:text-blue-400 font-mono text-xs font-bold uppercase mb-2">Trade Profile</div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">Regional Trades</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">Electrical, plumbing, landscaping, and staffing anyone bidding or working for cities, counties, or large companies.</p>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-900">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white text-center mb-8">How BidPulse Compares to Other Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-3 shadow-sm">
              <div className="text-xs font-bold uppercase text-slate-500">Other Lead Sites</div>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-300">$100 &ndash; $300 / Month</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                They send you an email alert with a link to an 80-page PDF. You still have to spend 20 hours writing and formatting the submission yourself.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-3 shadow-sm">
              <div className="text-xs font-bold uppercase text-slate-500">Hiring a Proposal Writer</div>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-300">$3,000 &ndash; $8,000 / Bid</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                High upfront retainer and 3-week turnaround cycles that make it clear invoices to miss tight municipal submission deadlines.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/40 p-6 rounded-2xl space-y-3 relative shadow-md">
              <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">The Smart Choice</div>
              <div className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">BidPulse Model</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">$1,500 &ndash; $3,000 Flat</div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                You pick the opportunity, and we assemble the complete proposal binder in 10 to 14 days. No recurring monthly software fees, ready for signature.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-6 text-center text-xs text-slate-500 bg-white dark:bg-slate-950 transition-colors">
        BidPulse Portal &copy; 2026 &middot; Automated Government Contracting Solutions
      </footer>
    </div>
  );
}
