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
              <Link href="/intake" className="hover:text-slate-950 transition">Send us a bid</Link>
              <Link href="/fit-score" className="hover:text-slate-950 transition">Is this a fit?</Link>
              <a href="#who-we-help" className="hover:text-slate-950 transition">Who we help</a>
              <a href="#how-it-works" className="hover:text-slate-950 transition">How it works</a>
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
              <Link
                href="/fit-score"
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold px-5 py-3.5 rounded-xl text-sm transition border border-slate-300 shadow-xs"
              >
                Is this bid a fit? (90 sec)
              </Link>
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
                  <div className="text-slate-500 mt-0.5">Onboarding schedules, shift distribution, and quality assurance checkpoints.</div>
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

      {/* Grid Features: Four Documents Section */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 font-mono">
              DOCUMENT ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Standardized documents the agency can read, score, and pass on.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every proposal follows an intentional structure regardless of trade size. Short sentences, no filler, structured for evaluators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-600">01</span>
              <h3 className="font-bold text-slate-900 text-sm">Company Overview</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                One page that states operational capacity, past performance track record, and core values.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-600">02</span>
              <h3 className="font-bold text-slate-900 text-sm">Requirements Checklist</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every requirement matched line-by-line to your proposal to eliminate disqualifications.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-600">03</span>
              <h3 className="font-bold text-slate-900 text-sm">Plan of Work & QA</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear technical methodology, staffing hierarchy, and weekly quality control audits.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-600">04</span>
              <h3 className="font-bold text-slate-900 text-sm">Pricing & Proof</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Labor rate breakdowns, margin modeling, insurance binders, and references ready for review.
              </p>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
            <div>
              <div className="text-[10px] uppercase font-mono font-bold text-slate-400">TRADES COVERED</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">Commercial Facilities & Trades</div>
              <div className="text-xs text-slate-500">Janitorial, maintenance, transit</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono font-bold text-slate-400">PIPELINE VALUE</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">${totalValue.toLocaleString()} Tracked</div>
              <div className="text-xs text-slate-500">Across active municipal solicitations</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono font-bold text-slate-400">OUTPUT FORMAT</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">Structured SOW & CSV</div>
              <div className="text-xs text-slate-500">Direct download & local backup</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono font-bold text-slate-400">COMPLIANCE ENGINE</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">4-Pillar Fit Scoring</div>
              <div className="text-xs text-slate-500">Capacity, certs, and equipment</div>
            </div>
          </div>

        </div>
      </section>

      {/* Who We Help Section */}
      <section id="who-we-help" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 border-t border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 font-mono">
              TARGET AUDIENCE
            </span>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight leading-snug">
              Built for the contractor doing real field work.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When your operational capabilities are strong but bidding paperwork slows you down, this platform bridges the gap to institutional contract wins.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Trade Profile</span>
              <h3 className="font-bold text-slate-900 text-sm">Commercial Janitorial</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Daily custodial, municipal facilities, district schools, and floor restoration programs.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Trade Profile</span>
              <h3 className="font-bold text-slate-900 text-sm">Facilities Maintenance</h3>
              <p className="text-xs text-slate-500 leading-relaxed">HVAC preventative maintenance, electrical servicing, and public works infrastructure.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Trade Profile</span>
              <h3 className="font-bold text-slate-900 text-sm">Regional Subcontractors</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Prime subcontractor bidding for county, municipal authorities, and enterprise packages.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Trade Profile</span>
              <h3 className="font-bold text-slate-900 text-sm">Specialty Field Services</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Grounds keeping, pressure washing, high-frequency disinfection, and emergency dispatch.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Four Steps Section (Dark Contrast Band) */}
      <section id="how-it-works" className="bg-slate-950 text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
              WORKFLOW EXECUTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Four short steps from solicitation intake to a sealed bid.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Accelerate through discovery, compliance verification, financial modeling, and formal SOW generation in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="text-2xl font-black text-emerald-400 font-mono">01</span>
              <h3 className="font-bold text-slate-100 text-sm">Send us the bid</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log contract title, target value, and scope criteria into the Intake form.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="text-2xl font-black text-emerald-400 font-mono">02</span>
              <h3 className="font-bold text-slate-100 text-sm">Run the fit matrix</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluate feasibility across past performance, insurance, and labor capabilities.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="text-2xl font-black text-emerald-400 font-mono">03</span>
              <h3 className="font-bold text-slate-100 text-sm">Model your margins</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adjust sliders to automatically balance direct labor wages, supplies, and net margin.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="text-2xl font-black text-emerald-400 font-mono">04</span>
              <h3 className="font-bold text-slate-100 text-sm">Export & submit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download the standardized 5-section proposal outline and submit with confidence.
              </p>
            </div>
          </div>

          {/* CTA Banner inside dark band */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Ready to qualify and draft your next opportunity?</h3>
              <p className="text-xs text-slate-400">Launch an intake or access the operations pipeline dashboard.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/intake"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition"
              >
                + Start New Intake
              </Link>
              <Link
                href="/admin"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition border border-slate-700"
              >
                Open Dashboard →
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