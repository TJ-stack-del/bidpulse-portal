"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveBid, calculateHeuristicScore, BidItem } from "../bids";

export default function IntakePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    agency: "",
    dueDate: "",
    estimatedValue: "",
    scope: "",
  });

  const predicted = calculateHeuristicScore(formData.scope, formData.estimatedValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBid: BidItem = {
      id: `BID-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title,
      agency: formData.agency,
      dueDate: formData.dueDate,
      status: "Drafting",
      fitScore: predicted.composite,
      estimatedValue: formData.estimatedValue,
      scope: formData.scope,
      scoringBreakdown: predicted.breakdown,
    };

    saveBid(newBid);
    router.push("/admin");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 sm:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <Link href="/admin" className="text-xs text-slate-400 hover:text-emerald-400 transition mb-1 inline-block">
              ← Back to Admin Pipeline
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-400">RFP Document Intake</h1>
            <p className="text-xs sm:text-sm text-slate-400">Log procurement solicitations with real-time heuristic viability prediction.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-xl">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Contract / Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              placeholder="e.g., Regional Transit Terminal Janitorial Services"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Issuing Agency / Entity *
              </label>
              <input
                type="text"
                required
                value={formData.agency}
                onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                placeholder="e.g., Duval County Public Schools"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Submission Deadline *
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Target Contract Value ($)
            </label>
            <input
              type="text"
              value={formData.estimatedValue}
              onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              placeholder="e.g., $185,000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Scope Summary & Deliverables
            </label>
            <textarea
              rows={4}
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed"
              placeholder="Describe tasks (e.g., daily sanitation, floor stripping, equipment needs, OSHA safety compliance)..."
            />
          </div>

          {/* Real-Time Heuristic Scoring Readout */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Predicted Viability Score
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Computed dynamically from scope keywords and target value
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold font-mono text-emerald-400">
                {predicted.composite}%
              </span>
              <span
                className={`text-[11px] px-2.5 py-1 rounded font-bold border ${
                  predicted.composite >= 85
                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                    : "bg-amber-950 text-amber-300 border-amber-800"
                }`}
              >
                {predicted.composite >= 85 ? "High Fit" : "Standard Fit"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg text-sm cursor-pointer"
          >
            Save & Add to Operations Queue →
          </button>
        </form>
      </div>
    </main>
  );
}