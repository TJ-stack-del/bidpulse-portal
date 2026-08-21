"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedBids, BidItem } from "../bids";

export default function AdminPage() {
  const [bids, setBids] = useState<BidItem[]>([]);
  const [selectedBid, setSelectedBid] = useState<BidItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    setBids(getSavedBids());
  }, []);

  const handleStatusChange = (bidId: string, newStatus: BidItem["status"]) => {
    const updated = bids.map((b) => (b.id === bidId ? { ...b, status: newStatus } : b));
    setBids(updated);
    localStorage.setItem("bidpulse_bids", JSON.stringify(updated));
    if (selectedBid?.id === bidId) {
      setSelectedBid({ ...selectedBid, status: newStatus });
    }
  };

  const handleClear = () => {
    if (confirm("Reset queue to sample proposals?")) {
      localStorage.removeItem("bidpulse_bids");
      setBids(getSavedBids());
      setSelectedBid(null);
    }
  };

  const filteredBids = bids.filter((bid) => {
    const matchesSearch =
      bid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || bid.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
          <div>
            <Link href="/" className="text-xs text-slate-400 hover:text-emerald-400 transition flex items-center gap-1 mb-1">
              ← Mission Control
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400">Operations Pipeline</h1>
            <p className="text-xs sm:text-sm text-slate-400">Track active solicitations, submission deadlines, and bid viability.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/intake"
              className="flex-1 sm:flex-initial text-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition shadow-sm"
            >
              + New RFP Intake
            </Link>
            <Link
              href="/fit-score"
              className="flex-1 sm:flex-initial text-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-lg text-sm transition border border-slate-700"
            >
              Fit Scorer
            </Link>
          </div>
        </header>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <input
            type="text"
            placeholder="Search by title, agency, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["All", "Drafting", "Review", "Submitted"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Proposals Table */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm font-semibold text-slate-200">Active Proposals Queue ({filteredBids.length})</h2>
            </div>
            <button
              type="button"
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
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBids.map((bid) => (
                  <tr
                    key={bid.id}
                    onClick={() => setSelectedBid(bid)}
                    className="hover:bg-slate-800/50 transition cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-slate-100">{bid.title}</div>
                      <span className="text-xs font-mono text-slate-500">{bid.id}</span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{bid.agency}</td>
                    <td className="p-4 font-mono text-slate-300">{bid.estimatedValue || "TBD"}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold font-mono inline-block ${
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
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 inline-block">
                        {bid.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded border border-emerald-800/60 hover:bg-emerald-900 transition">
                        Inspect →
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredBids.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                      No matching solicitations found in the queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Centered High-Visibility Inspection Modal */}
      {selectedBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedBid(null)}
          />

          {/* Modal Card */}
          <div className="relative z-10 bg-slate-900 w-full max-w-2xl max-h-[90vh] border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between overflow-y-auto shadow-2xl space-y-6">
            
            {/* Header with High-Priority Call to Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  {selectedBid.id}
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-0.5">{selectedBid.title}</h3>
                <p className="text-xs text-slate-400">{selectedBid.agency}</p>
              </div>

              {/* Prominent Action Button Top Right */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/fit-score?bidId=${selectedBid.id}`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg transition shadow-md flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>⚡ Run Fit Matrix</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedBid(null)}
                  className="text-slate-400 hover:text-slate-100 text-xl font-bold px-3 py-1 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <div className="text-[11px] text-slate-500 uppercase font-semibold">Target Value</div>
                <div className="text-sm sm:text-base font-bold text-slate-200 mt-0.5">{selectedBid.estimatedValue || "Undisclosed"}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 uppercase font-semibold">Due Date</div>
                <div className="text-sm sm:text-base font-bold text-slate-200 mt-0.5 font-mono">{selectedBid.dueDate}</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 uppercase font-semibold">Fit Viability</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-400 mt-0.5">{selectedBid.fitScore}%</div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500 uppercase font-semibold">Stage</div>
                <div className="text-sm sm:text-base font-bold text-slate-200 mt-0.5">{selectedBid.status}</div>
              </div>
            </div>

            {/* SOW & Notes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scope Summary & Specifications</h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-36 overflow-y-auto">
                {selectedBid.scope || "No custom scope criteria specified during initial intake."}
              </div>
            </div>

            {/* Large Stage Update Buttons */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Proposal Workflow Status</h4>
              <div className="grid grid-cols-3 gap-3">
                {(["Drafting", "Review", "Submitted"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selectedBid.id, st)}
                    className={`py-3 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
                      selectedBid.status === st
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-lg ring-2 ring-emerald-500/30"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Close */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBid(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}