'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SampleOpportunity {
  trade: string;
  title: string;
  agency: string;
  solicitation: string;
  value: string;
  deadline: string;
}

const SAMPLE_BIDS: Record<string, SampleOpportunity[]> = {
  commercial_janitorial: [
    {
      trade: 'Commercial Janitorial',
      title: 'Custodial & Day Porter Services for Public Facilities',
      agency: 'Duval County Public Facilities',
      solicitation: 'RFP-0245-26',
      value: '$520,000/yr',
      deadline: '18 Days Left',
    },
    {
      trade: 'Commercial Janitorial',
      title: 'Multi-Site Clinic Sanitization & Floor Maintenance',
      agency: 'Florida Dept. of Health - Duval',
      solicitation: 'DOH-JAX-7712',
      value: '$180,000/yr',
      deadline: '24 Days Left',
    },
  ],
  landscaping_grounds: [
    {
      trade: 'Landscaping & Grounds',
      title: 'Right-of-Way Mowing & Stormwater Retention Maintenance',
      agency: 'City of Jacksonville - Public Works',
      solicitation: 'COJ-PW-9921',
      value: '$440,000/yr',
      deadline: '14 Days Left',
    },
  ],
  pressure_washing: [
    {
      trade: 'Pressure Washing',
      title: 'Quarterly Garage & Pedestrian Walkway Pressure Washing',
      agency: 'Downtown Investment Authority (DIA)',
      solicitation: 'DIA-PW-3304',
      value: '$95,000 total',
      deadline: '11 Days Left',
    },
  ],
  painting_coatings: [
    {
      trade: 'Commercial Painting',
      title: 'Exterior Facility Repainting & Waterproof Coating',
      agency: 'JEA Regional Operations Facility',
      solicitation: 'JEA-FAC-1109',
      value: '$140,000 total',
      deadline: '21 Days Left',
    },
  ],
  security_guard: [
    {
      trade: 'Security Guard',
      title: 'Unarmed 24/7 Gate & Facility Access Control',
      agency: 'Jacksonville Transportation Authority',
      solicitation: 'JTA-SEC-5520',
      value: '$380,000/yr',
      deadline: '16 Days Left',
    },
  ],
  hvac_mechanical: [
    {
      trade: 'HVAC Maintenance',
      title: 'Preventative HVAC Chiller & Air Handler Service Contract',
      agency: 'Duval County Courthouse Complex',
      solicitation: 'DCC-HVAC-8840',
      value: '$490,000/yr',
      deadline: '28 Days Left',
    },
  ],
  hauling_waste: [
    {
      trade: 'Hauling & Waste',
      title: 'Roll-Off Debris Removal & Municipal Hauling Services',
      agency: 'City of Jacksonville Solid Waste',
      solicitation: 'COJ-SW-2291',
      value: '$350,000/yr',
      deadline: '19 Days Left',
    },
  ],
};

const TRADES = [
  { id: 'commercial_janitorial', name: 'Janitorial', icon: '🧹' },
  { id: 'landscaping_grounds', name: 'Landscaping', icon: '🚜' },
  { id: 'pressure_washing', name: 'Pressure Wash', icon: '💧' },
  { id: 'painting_coatings', name: 'Painting', icon: '🎨' },
  { id: 'security_guard', name: 'Security', icon: '🛡️' },
  { id: 'hvac_mechanical', name: 'HVAC', icon: '❄️' },
  { id: 'hauling_waste', name: 'Hauling', icon: '🚛' },
];

export default function HomePage() {
  const [activeTrade, setActiveTrade] = useState('commercial_janitorial');
  const activeBids = SAMPLE_BIDS[activeTrade] || SAMPLE_BIDS.commercial_janitorial;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-16">
      {/* Hero: High-Contrast Split Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Col: The Exact Differentiator & Value */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 px-3.5 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
            <span>📍</span> Jacksonville & Regional Florida Solicitations
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Stop scrolling lead alerts. <br />
            <span className="text-blue-600 dark:text-blue-400">
              We write your entire government bid packet.
            </span>
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Other sites charge you $100/month just to view links. <strong className="text-slate-900 dark:text-white font-semibold">BidPulse is your on-demand proposal department:</strong> select any local municipal RFP, and we assemble a completed, agency-compliant proposal binder in 48 hours for a flat $495.
          </p>

          {/* Concrete Breakdown of the $495 Packet */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              What’s Included in Your Turnkey Proposal Binder ($495 Flat):
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200">
              <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><span className="text-slate-900 dark:text-white">✓ Formatted Scope of Work</span></li>
              <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><span className="text-slate-900 dark:text-white">✓ Staffing & Labor Matrix</span></li>
              <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><span className="text-slate-900 dark:text-white">✓ Mandatory Compliance Forms</span></li>
              <li className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><span className="text-slate-900 dark:text-white">✓ Ready-to-Sign Pricing Sheet</span></li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link
              href="/opportunities"
              className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              Browse Open Solicitations &rarr;
            </Link>
            <Link
              href="/dashboard/requests"
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Check My Existing Proposals
            </Link>
          </div>
        </div>

        {/* Right Col: Instant Interactive RFP Showcase */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              1. Select Your Trade To Preview Open Contracts
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
              {TRADES.map((trade) => (
                <button
                  key={trade.id}
                  onClick={() => setActiveTrade(trade.id)}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 text-xs font-bold transition text-center ${
                    activeTrade === trade.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent dark:border-slate-700/50'
                  }`}
                >
                  <span>{trade.icon}</span>
                  <span>{trade.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              2. Open Local Opportunities
            </h3>
            {activeBids.map((bid, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {bid.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {bid.agency} • Ref: {bid.solicitation}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-2 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
                    {bid.deadline}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800/80 pt-3">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Est. Value: </span>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">{bid.value}</span>
                  </div>
                  <Link
                    href="/opportunities"
                    className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                  >
                    Request Proposal Binder ($495) &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Comparison Section */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 space-y-6 shadow-xs">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            How BidPulse Compares to Other Options
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            We built this because lead databases waste your time and traditional agencies charge too much.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-left">
          {/* Option 1 */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 bg-slate-50/50 dark:bg-slate-950/30">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Other Lead Sites</span>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">$100 – $300 / Month</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              They send you an email alert with a link to an 80-page PDF. You still have to spend 25 hours writing and formatting the submission yourself.
            </p>
          </div>

          {/* Option 2 */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 bg-slate-50/50 dark:bg-slate-950/30">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hiring a Proposal Writer</span>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">$3,000 – $6,000 / Bid</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              High upfront retainers and 2-week turnaround cycles that cause subcontractors to miss tight municipal submission deadlines.
            </p>
          </div>

          {/* Option 3: BidPulse */}
          <div className="rounded-xl border-2 border-blue-600 dark:border-blue-500 p-5 space-y-3 bg-blue-50/30 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">BidPulse Model</span>
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded">The Smart Choice</span>
            </div>
            <p className="text-base font-bold text-blue-900 dark:text-blue-100">$495 Flat / One-Time</p>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              You pick the opportunity, and we assemble the complete proposal binder in 48 hours. No subscriptions, no software to learn, ready for signature.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
