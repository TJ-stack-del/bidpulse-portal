"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              B
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              BidPulse
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/search" className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1">
              🔍 Live Bid Search
            </Link>
            <Link href="/portal" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Workspace Pipeline
            </Link>
            <Link href="/fit-score" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Fit Evaluator
            </Link>
            <Link href="/intake" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Manual Intake
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin Tools
            </Link>
            <Link
              href="/search"
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              Scan Live Bids &rarr;
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Institutional Janitorial & Commercial Procurement Intelligence
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
          Accelerate & Win High-Value Institutional Contracts
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Scan municipal and federal opportunities, ingest RFP packets, evaluate win-probability fit scores, and export audit-ready procurement briefs.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/search"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all text-center text-base"
          >
            🔍 Search & Ingest Live Bids &rarr;
          </Link>
          <Link
            href="/portal"
            className="w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold rounded-xl border border-slate-300 dark:border-slate-700 transition-all text-center text-base"
          >
            Open Operations Workspace
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-slate-200 dark:border-slate-800 pt-12">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 font-bold mb-4">1</div>
            <h3 className="font-bold text-slate-900 dark:text-white">Live Procurement Search</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Aggregate active public solicitations across City of Jacksonville, DCPS, JTA, and federal feeds.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-bold mb-4">2</div>
            <h3 className="font-bold text-slate-900 dark:text-white">100-Point Fit Scoring</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Evaluate labor capacity, compliance certifications, past performance, and machine readiness.</p>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 font-bold mb-4">3</div>
            <h3 className="font-bold text-slate-900 dark:text-white">Executive PDF Briefs</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Export clean, 1-page procurement summary documents directly for review boards.</p>
          </div>
        </div>
      </header>
    </div>
  );
}
