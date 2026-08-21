"use client";

import React, { useState } from "react";

interface BidItem {
  id: string;
  title: string;
  agency: string;
  dueDate: string;
  status: "Drafting" | "Review" | "Submitted";
  fitScore: number;
}

const initialBids: BidItem[] = [
  { id: "BID-101", title: "Facilities Maintenance & Sanitation Services", agency: "Duval County Public Schools", dueDate: "2026-09-15", status: "Drafting", fitScore: 92 },
  { id: "BID-102", title: "Commercial Janitorial & Daily Custodial", agency: "City of Jacksonville", dueDate: "2026-09-22", status: "Review", fitScore: 88 },
  { id: "BID-103", title: "Quarterly Deep Clean & Floor Care", agency: "JTA Transit Authority", dueDate: "2026-10-01", status: "Submitted", fitScore: 79 },
];

export default function AdminPage() {
  const [bids] = useState<BidItem[]>(initialBids);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-emerald-400">BidPulse Operations Pipeline</h1>
            <p className="text-sm text-slate-400">Manage procurement proposals, review scoring, and track deadlines.</p>
          </div>
          <div className="flex gap-3">
            <a href="/intake" className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition">
              + New RFP Intake
            </a>
            <a href="/fit-score" className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2 rounded-lg text-sm transition">
              Score Matrix
            </a>
          </div>
        </header>

        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-slate-200">Active Proposals Queue</h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-slate-400">
              <tr>
                <th className="p-4">RFP ID / Project</th>
                <th className="p-4">Agency</th>
                <th className="p-4">Fit Score</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {bids.map((bid) => (
                <tr key={bid.id} className="hover:bg-slate-800/30">
                  <td className="p-4 font-medium text-slate-100">
                    <div>{bid.title}</div>
                    <span className="text-xs text-slate-500">{bid.id}</span>
                  </td>
                  <td className="p-4 text-slate-300">{bid.agency}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${bid.fitScore >= 85 ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-amber-950 text-amber-300 border border-amber-800"}`}>
                      {bid.fitScore}%
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{bid.dueDate}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {bid.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}