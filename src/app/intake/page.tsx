"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveNewBid } from "../bids";

export default function IntakePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [agency, setAgency] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [scope, setScope] = useState("");

  const calculateHeuristicScore = (val: string, scopeText: string): number => {
    let score = 70;
    const num = parseInt(val.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(num)) {
      if (num >= 50000 && num <= 500000) score += 15;
      else if (num > 500000) score += 10;
    }
    const keywords = ["daily", "custodial", "floor", "maintenance", "restroom", "trash", "scheduled", "janitorial"];
    const text = scopeText.toLowerCase();
    const hits = keywords.filter((k) => text.includes(k)).length;
    score += Math.min(hits * 3, 15);
    return Math.min(Math.max(score, 60), 98);
  };

  const previewScore = calculateHeuristicScore(estimatedValue, scope);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !agency || !dueDate) {
      alert("Please fill in Title, Agency, and Due Date.");
      return;
    }

    const calculatedFit = calculateHeuristicScore(estimatedValue, scope);

    const newBid = {
      id: `BID-${Math.floor(100 + Math.random() * 900)}`,
      title,
      agency,
      dueDate,
      status: "Drafting" as const,
      fitScore: calculatedFit,
      estimatedValue: estimatedValue || "TBD",
      scope: scope || "Standard procurement scope pending full technical narrative."
    };

    saveNewBid(newBid);
    router.push(`/intake/confirmation?id=${newBid.id}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-5">
          <div>
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 font-medium transition flex items-center gap-1 mb-1">
              ← Return Home
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950">Send Us a Bid</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Submit solicitation details to begin compliance analysis and SOW drafting.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-right">
            <div className="text-[10px] font-mono uppercase font-bold text-emerald-800">Initial Viability</div>
            <div className="text-lg font-black text-emerald-600 font-mono">{previewScore}%</div>
          </div>
        </div>

        {/* Intake Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Solicitation / Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Commercial Janitorial & Daily Custodial Services"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Issuing Agency / Entity *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., City of Jacksonville"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Submission Deadline *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Target Contract Value ($)
            </label>
            <input
              type="text"
              placeholder="e.g., $150,000"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Scope Summary / Solicitations
            </label>
            <textarea
              rows={4}
              placeholder="Paste relevant scope requirements, shift frequencies, facility size, or key deliverables..."
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition text-sm cursor-pointer shadow-md"
            >
              Submit Bid for Proposal Packaging →
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}
