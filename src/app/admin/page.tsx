"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedBids, BidItem } from "../bids";

export default function AdminPage() {
  const [bids, setBids] = useState<BidItem[]>([]);

  useEffect(() => {
    setBids(getSavedBids());
  }, []);

  const handleClear = () => {
    if (confirm("Reset queue to sample proposals?")) {
      localStorage.removeItem("bidpulse_bids");
      setBids(getSavedBids());
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
          <div>
            <Link href="/" className="text-xs text-slate-400 hover:text-emerald-400 transition flex items-center gap-1 mb-1">
              ← Mission Control
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-emerald-400">Operations Pipeline</h1>
            <p className="text-sm text-slate-400">Track active solicitations, submission deadlines, and bid viability.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/intake"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
            >
              + New RFP Intake
            </Link>
            <Link
              href="/fit-score"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-lg text-sm transition border border-slate-700"
            >
              Fit Scorer
            </Link>
          </div>
        </header>

        {/* Proposals Table */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <h2 className="text-sm font-semibold text-slate-200">Active Proposals Queue ({bids.length})</h2>
            </div>
            <button
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-rose-400 transition"
            >
              Reset Queue
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">RFP ID / Project Title</th>
                  <th className="p-4">Agency</th>
                  <th className="p-4">Target Value</th>
                  <th className="p-4">Fit Score</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {bids.map((bid) => (
                  <tr key={bid.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="font-semibold text-slate-100">{bid.title}</div>
                      <span className="text-xs font-mono text-slate-500">{bid.id}</span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{bid.agency}</td>
                    <td className="p-4 font-mono text-slate-300">{bid.estimatedValue || "TBD"}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold font-mono inline-block ${
                          bid.fitScore >= 85
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-700/50"
                            : "bg-amber-950 text-amber-300 border border-amber-700/50"
                        }`}
                      >
                        {bid.fitScore}%
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 text-xs font-mono">{bid.dueDate}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 inline-block">
                        {bid.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}