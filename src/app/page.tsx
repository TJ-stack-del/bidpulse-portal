"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedBids, BidItem } from "./bids";

export default function Home() {
  const [bids, setBids] = useState<BidItem[]>([]);

  useEffect(() => {
    setBids(getSavedBids());
  }, []);

  const totalValue = bids.reduce((acc, bid) => {
    const num = parseInt((bid.estimatedValue || "").replace(/[^0-9]/g, ""), 10) || 0;
    return acc + num;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* Top Universal Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-extrabold text-slate-900 tracking-tight text-base flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block" />
              BidPulse
            </Link>
            <div className="hidden md:flex items-center gap-5 text-slate-600 font-medium">
              <Link href="/portal" className="hover:text-slate-950 transition">My Submittals</Link>
              <Link href="/intake" className="hover:text-slate-950 transition">Send us a bid</Link>
              <a href="#pricing" className="text-slate-950 font-bold">Pricing & Tiers</a>
              <Link href="/fit-score" className="hover:text-slate-950 transition">Fit Scorer</Link>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs transition shadow-sm"
            >
              Operations Dashboard →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 font-mono">
              FOR COMMERCIAL & INSTITUTIONAL BIDDING
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-[1.08]">
              We write the bid paperwork so you can do the work.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Send us the solicitation. We turn your scope and operations into a clean, agency-ready proposal package with automated margin calculations and compliance scoring.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/intake"
                className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition shadow-sm"
              >
                Send us a bid
              </Link>
              <a
                href="#pricing"
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-5 py-3.5 rounded-xl text-sm transition border border-slate-300 shadow-xs"
              >
                View Transparent Pricing ↓
              </a>
            </div>

            <div className="text-xs text-slate-500 pt-1 flex items-center gap-2">
              <span>🔒 Admin Protected</span>
              <span>•</span>
              <span>${totalValue.toLocaleString()} active in pipeline</span>
            </div>
          </div>

          {/* Right Card: What Lands In Your Inbox */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xl shadow-slate-200/50 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Deliverables</span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">What lands in your hands</h3>
                <p className="text-xs text-slate-500">A first draft an evaluator can approve in one sitting.</p>
              </div>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-1 rounded font-bold border border-emerald-200">
                100% Agency Ready
              </span>
            </div>

            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-3">
                <span className="font-mono font-bold text-slate-400 text-xs mt-0.5">01</span>
                <div>
                  <div className="font-bold text-slate-900">A clean executive summary & statement of work</div>
                  <div className="text-slate-500 mt-0.5">Clear scope comprehension that positions your operational strengths.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono font-bold text-slate-400 text-xs mt-0.5">02</span>
                <div>
                  <div className="font-bold text-slate-900">Itemized technical deliverables & methodology</div>
                  <div className="text-slate-500 mt-0.5">Onboarding schedules, shift distribution, and QA checkpoints.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono font-bold text-slate-400 text-xs mt-0.5">03</span>
                <div>
                  <div className="font-bold text-slate-900">Dynamic pricing & cost schedule matrix</div>
                  <div className="text-slate-500 mt-0.5">Direct labor hours, equipment overhead, and target net profit margin.</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono font-bold text-slate-400 text-xs mt-0.5">04</span>
                <div>
                  <div className="font-bold text-slate-900">Compliance checklist & vetting verification</div>
                  <div className="text-slate-500 mt-0.5">Insurance, licenses, and safety standards mapped directly to RFP requirements.</div>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* SECTION: PRICING TIERS & FEE SCHEDULE */}
      <section id="pricing" className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 font-mono">
              CLEAR, PREDICTABLE PACKAGING FEES
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Flat-rate proposal packaging tailored to trade contractors.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              No bloated agency retainers. Choose the packaging depth your target solicitation requires and receive an evaluator-ready draft in 48–72 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Tier 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Pre-Bid Vetting</span>
                  <h3 className="text-lg font-black text-slate-900">Viability & Fit Audit</h3>
                  <p className="text-xs text-slate-500">Know whether you can win before writing a single page.</p>
                </div>
                <div className="text-3xl font-black text-slate-950 font-mono">$299 <span className="text-xs text-slate-500 font-normal font-sans">/ solicitation</span></div>
                <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2">✓ 4-Pillar Fit Score Matrix</li>
                  <li className="flex items-center gap-2">✓ Mandatory Disqualifier Check</li>
                  <li className="flex items-center gap-2">✓ Direct Labor Rate Sanity Check</li>
                  <li className="flex items-center gap-2">✓ Written "Go / No-Go" Verdict</li>
                </ul>
              </div>
              <Link
                href="/intake"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition text-center block shadow-xs"
              >
                Submit for Audit →
              </Link>
            </div>

            {/* Tier 2 (Featured) */}
            <div className="bg-white border-2 border-emerald-600 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative">
              <span className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-700">Small Commercial / RFQs</span>
                  <h3 className="text-lg font-black text-slate-900">Fast-Track Proposal</h3>
                  <p className="text-xs text-slate-500">For commercial quotes & RFQs under $150k.</p>
                </div>
                <div className="text-3xl font-black text-slate-950 font-mono">$850 <span className="text-xs text-slate-500 font-normal font-sans">/ submittal</span></div>
                <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2">✓ Complete Executive Summary</li>
                  <li className="flex items-center gap-2">✓ Technical SOW Methodology</li>
                  <li className="flex items-center gap-2">✓ Dynamic Labor & Margin Schedule</li>
                  <li className="flex items-center gap-2">✓ Formatted PDF Export</li>
                  <li className="flex items-center gap-2">✓ 48-Hour Rapid Delivery</li>
                </ul>
              </div>
              <Link
                href="/intake"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition text-center block shadow-md"
              >
                Start Fast-Track Package →
              </Link>
            </div>

            {/* Tier 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xs">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Formal Agency & Municipal</span>
                  <h3 className="text-lg font-black text-slate-900">Full RFP Compliance Binder</h3>
                  <p className="text-xs text-slate-500">For multi-year government & school district bids ($150k–$1M+).</p>
                </div>
                <div className="text-3xl font-black text-slate-950 font-mono">$2,850 <span className="text-xs text-slate-500 font-normal font-sans">/ proposal</span></div>
                <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                  <li className="flex items-center gap-2">✓ Multi-Section Compliance Binder</li>
                  <li className="flex items-center gap-2">✓ Staffing Hierarchy & QA Auditing Plan</li>
                  <li className="flex items-center gap-2">✓ Line-Item Cost Allocation Schedules</li>
                  <li className="flex items-center gap-2">✓ Addenda & Scope Revision Support</li>
                  <li className="flex items-center gap-2">✓ Dedicated Proposal Reviewer</li>
                </ul>
              </div>
              <Link
                href="/intake"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition text-center block shadow-xs"
              >
                Request Municipal Binder →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-semibold text-slate-800">BidPulse Procurement Systems</div>
          <div className="text-slate-400 text-[11px]">Proposal acceleration & contract qualification engine</div>
        </div>
      </footer>
    </div>
  );
}
