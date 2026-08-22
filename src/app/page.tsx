"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-16 pb-16 text-center">
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
    </div>
  );
}
