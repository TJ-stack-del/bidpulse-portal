"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getBidById, updateBidScore, BidItem } from "../bids";

function FitScorerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bidId = searchParams.get("bidId");

  const [activeBid, setActiveBid] = useState<BidItem | null>(null);
  const [scores, setScores] = useState({
    certifications: 85,
    pastPerformance: 90,
    laborCapacity: 80,
    equipmentReadiness: 95,
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (bidId) {
      const found = getBidById(bidId);
      if (found) {
        setActiveBid(found);
        if (found.scoringBreakdown) {
          setScores(found.scoringBreakdown);
        }
      }
    }
  }, [bidId]);

  const overallScore = Math.round(
    (scores.certifications + scores.pastPerformance + scores.laborCapacity + scores.equipmentReadiness) / 4
  );

  const handleApplyScore = () => {
    if (bidId) {
      updateBidScore(bidId, overallScore, scores);
      setIsSaved(true);
      setTimeout(() => {
        router.push("/admin");
      }, 700);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Navigation & Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <Link href="/admin" className="text-xs text-slate-400 hover:text-emerald-400 transition mb-1 inline-block">
            ← Back to Operations Pipeline
          </Link>
          <h1 className="text-2xl font-bold text-emerald-400">Bid Fit-Score Engine</h1>
          <p className="text-sm text-slate-400">
            {activeBid
              ? `Evaluating Target: ${activeBid.title} (${activeBid.id})`
              : "Standard Procurement Alignment Matrix"}
          </p>
        </div>
        {activeBid && (
          <span className="text-xs font-mono bg-slate-900 border border-slate-700 px-3 py-1 rounded text-slate-300">
            {activeBid.agency}
          </span>
        )}
      </div>

      {/* Main Scoring Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
        {/* Score Readout Header */}
        <div className="flex items-center justify-between p-5 bg-slate-950 rounded-xl border border-slate-800">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Composite Readiness</div>
            <div className="text-4xl font-extrabold text-emerald-400 mt-1">{overallScore}%</div>
          </div>
          <span
            className={`text-xs px-3.5 py-1.5 rounded-full font-bold border ${
              overallScore >= 85
                ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                : overallScore >= 75
                ? "bg-amber-950 text-amber-300 border-amber-800"
                : "bg-rose-950 text-rose-300 border-rose-800"
            }`}
          >
            {overallScore >= 85
              ? "High Viability (Pursue)"
              : overallScore >= 75
              ? "Moderate (Mitigate Gaps)"
              : "High Risk (Do Not Bid)"}
          </span>
        </div>

        {/* Sliders */}
        <div className="space-y-5 pt-2">
          {[
            { key: "certifications", label: "Mandatory Certifications & Licensure", desc: "Alignment with municipal/commercial standards & safety compliances." },
            { key: "pastPerformance", label: "Past Performance & References", desc: "Similar contract scopes executed within the past 36 months." },
            { key: "laborCapacity", label: "Labor & Staffing Capacity", desc: "Immediate availability of custodial staff and operational supervisors." },
            { key: "equipmentReadiness", label: "Equipment & Tooling Readiness", desc: "Commercial machinery, buffer readiness, and chemical inventory." },
          ].map(({ key, label, desc }) => {
            const val = scores[key as keyof typeof scores];
            return (
              <div key={key} className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-semibold text-slate-200 block">{label}</span>
                    <span className="text-xs text-slate-500">{desc}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-base">{val}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => {
                    setIsSaved(false);
                    setScores({ ...scores, [key]: Number(e.target.value) });
                  }}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer h-2"
                />
              </div>
            );
          })}
        </div>

        {/* Actions */}
        {activeBid ? (
          <button
            onClick={handleApplyScore}
            className={`w-full py-3 rounded-lg text-sm font-semibold transition ${
              isSaved
                ? "bg-emerald-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {isSaved ? "✓ Score Synced to Pipeline! Redirecting..." : `Save ${overallScore}% to ${activeBid.id} & Return →`}
          </button>
        ) : (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center text-xs text-slate-400">
            Evaluating standalone model. To attach to a specific RFP, select <span className="text-emerald-400">Run Fit Matrix</span> inside the Admin Pipeline.
          </div>
        )}
      </div>
    </div>
  );
}

export default function FitScorePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <Suspense fallback={<div className="text-center text-slate-500 text-sm">Loading scoring engine...</div>}>
        <FitScorerContent />
      </Suspense>
    </main>
  );
}