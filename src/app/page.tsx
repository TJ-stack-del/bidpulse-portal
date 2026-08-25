'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BidPulseIcon, FiveTabPrecisionBar } from '@/components/brand/BidPulseLogo';

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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-[#2563EB] selection:text-white font-sans">
      <main className="w-full px-6 lg:px-12 py-10 flex-1">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Direct Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold px-3 py-1.5 rounded-full border border-[#2563EB]/30">
              <BidPulseIcon size={16} />
              <span>One bid, one flat fee. No monthly bill.</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
              We write the bid paperwork so you can do the work.
            </h1>

            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Stop scrolling endless lead alerts. <strong className="text-white">BidPulse</strong> is your on-demand proposal department for Duval County and Florida municipal contracts: choose your solicitation, and we deliver a completed, agency-compliant binder in 10 to 14 business days.
            </p>

            {/* 5-Tab Precision Bar Callout Card */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <FiveTabPrecisionBar activeTab="Transmittal" />
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                    Signature Standard Delivery Package
                  </span>
                  <span className="text-[#059669] font-bold text-[11px] bg-[#059669]/10 px-2 py-0.5 rounded border border-[#059669]/20">
                    Eligible to Bid
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>✓ Transmittal & Exec Letter</div>
                  <div>✓ Scope & Methodology</div>
                  <div>✓ Staffing & Key Personnel</div>
                  <div>✓ Unit Price Cost Matrix</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link 
                href="/opportunities"
                className="w-full sm:w-auto bg-[#2563EB] hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition text-center text-sm shadow-lg shadow-blue-600/30"
              >
                Explore Active RFPs &rarr;
              </Link>
              <Link 
                href="/binders"
                className="w-full sm:w-auto bg-[#0F172A] hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold px-8 py-4 rounded-xl transition text-center text-sm"
              >
                View Proposal Binders
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Trade Selector & Filtered Opportunities */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Step 1: Interactive Trade Selector */}
            <div className="bg-[#0F172A] border border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="text-xs font-mono text-[#2563EB] uppercase font-bold tracking-wider">
                1. Select your trade to view open contracts
              </div>
              <div className="flex flex-wrap gap-2">
                {trades.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTrade(t)}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer ${
                      selectedTrade === t
                        ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
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
                <div className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider">
                  2. Open Florida Opportunities ({selectedTrade})
                </div>
                <span className="text-[10px] text-[#2563EB] font-mono">
                  {filteredOpportunities.length} match(es)
                </span>
              </div>

              {filteredOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-[#0F172A] border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 shadow-sm transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-sm text-white">{opp.title}</h3>
                      <span className={`border text-[10px] font-bold px-2 py-0.5 rounded ${opp.badgeColor}`}>
                        {opp.deadline}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{opp.agency}</p>
                    <div className="text-xs font-mono text-[#059669] font-bold pt-1">{opp.estValue}</div>
                  </div>
                  <Link
                    href="/opportunities"
                    className="w-full sm:w-auto bg-[#2563EB]/10 hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-[#2563EB]/30 font-semibold px-4 py-2 rounded-xl text-xs transition text-center shrink-0"
                  >
                    Request Proposal Binder &rarr;
                  </Link>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Trade Profiles */}
        <div className="mt-24 border-t border-slate-800 pt-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8 text-center">
            Built for the crew on a roof, in a server room, or with a buffer on the floor.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0F172A] border border-slate-800 p-6 rounded-2xl shadow-sm">
              <div className="text-[#2563EB] font-mono text-xs font-bold uppercase mb-2">Trade Profile</div>
              <h3 className="font-bold text-white mb-1">HVAC & Mechanical</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Service, install, and controls work for schools, city buildings, campuses, and facility portfolios.</p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 p-6 rounded-2xl shadow-sm">
              <div className="text-[#2563EB] font-mono text-xs font-bold uppercase mb-2">Trade Profile</div>
              <h3 className="font-bold text-white mb-1">Commercial Cleaning</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Janitorial, floor care, and post-construction cleaning for buildings that score bids strictly.</p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 p-6 rounded-2xl shadow-sm">
              <div className="text-[#2563EB] font-mono text-xs font-bold uppercase mb-2">Trade Profile</div>
              <h3 className="font-bold text-white mb-1">IT Subcontractors</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Cabling, low-voltage, help desk, and device support for businesses and public agencies.</p>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 p-6 rounded-2xl shadow-sm">
              <div className="text-[#2563EB] font-mono text-xs font-bold uppercase mb-2">Trade Profile</div>
              <h3 className="font-bold text-white mb-1">Regional Trades</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Electrical, plumbing, landscaping, and staffing anyone bidding or working for cities, counties, or large companies.</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-[#020617]">
        BidPulse Portal &copy; 2026 &middot; Automated Government Contracting Solutions
      </footer>
    </div>
  );
}