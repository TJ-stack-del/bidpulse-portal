"use client";

import React, { useState } from "react";

export default function FitScorePage() {
  const [scores, setScores] = useState({
    certifications: 85,
    pastPerformance: 90,
    laborCapacity: 80,
    equipmentReadiness: 95,
  });

  const overallScore = Math.round(
    (scores.certifications + scores.pastPerformance + scores.laborCapacity + scores.equipmentReadiness) / 4
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-emerald-400">Bid Fit-Score Engine</h1>
            <p className="text-sm text-slate-400">Evaluate alignment with contract specifications and capacity.</p>
          </div>
          <a href="/admin" className="text-sm text-slate-400 hover:text-slate-200">
            ← Back to Admin
          </a>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Composite Readiness</div>
              <div className="text-3xl font-extrabold text-emerald-400">{overallScore}%</div>
            </div>
            <span className="text-xs px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-full font-semibold">
              {overallScore >= 80 ? "High Bid Viability" : "Requires Mitigation"}
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(scores).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize text-slate-300">{key.replace(/([A-Z])/g, " $1")}</span>
                  <span className="font-semibold text-slate-200">{val}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => setScores({ ...scores, [key]: Number(e.target.value) })}
                  className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}