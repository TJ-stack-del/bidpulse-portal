"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getSavedBids, fetchAllBidsFromCloud, updateBidDetails, BidItem } from "../bids";

export default function PortalPage() {
  const [bids, setBids] = useState<BidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | "Drafting" | "Review" | "Submitted">("All");

  useEffect(() => {
    async function loadData() {
      const local = getSavedBids();
      if (local && local.length > 0) {
        setBids(local);
      }
      const cloud = await fetchAllBidsFromCloud();
      if (cloud && cloud.length > 0) {
        setBids(cloud);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleStatusChange = (id: string, newStatus: BidItem["status"]) => {
    updateBidDetails(id, { status: newStatus });
    setBids((prev) =>
      prev.map((bid) => (bid.id === id ? { ...bid, status: newStatus } : bid))
    );
  };

  const filteredBids = bids.filter((b) => {
    if (activeTab === "All") return true;
    return b.status === activeTab;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 text-sm">
        Loading operations workspace...
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Surface Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
            Pipeline Management
          </span>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            Contractor Operations Workspace
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track active proposals, monitor submission deadlines, and evaluate win probabilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
          >
            🔍 Live Search Feed
          </Link>
          <Link
            href="/intake"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
          >
            + New Intake
          </Link>
        </div>
      </div>

      {/* Pipeline Stage Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
        {(["All", "Drafting", "Review", "Submitted"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {tab} ({tab === "All" ? bids.length : bids.filter((b) => b.status === tab).length})
          </button>
        ))}
      </div>

      {/* Bid Opportunity Cards */}
      <div className="space-y-4">
        {filteredBids.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-slate-600 dark:text-slate-400">No active solicitations in this pipeline stage.</p>
          </div>
        ) : (
          filteredBids.map((bid) => (
            <div
              key={bid.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {bid.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      bid.status === "Submitted"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                        : bid.status === "Review"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {bid.status}
                  </span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    🎯 Fit Score: {bid.fitScore}/100
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {bid.title}
                </h3>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {bid.agency}
                </p>
                {bid.scope && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {bid.scope}
                  </p>
                )}

                {bid.documentUrl && (
                  <div className="pt-1">
                    <a
                      href={bid.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      📎 View Attached Packet ({bid.documentName || "RFP Document"}) &rarr;
                    </a>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>📅 Submission Due: <strong className="text-slate-800 dark:text-slate-200">{bid.dueDate}</strong></span>
                  {bid.estimatedValue && (
                    <span>💰 Est. Value: <strong className="text-slate-800 dark:text-slate-200">{bid.estimatedValue}</strong></span>
                  )}
                  {(bid.tickets?.length ?? 0) > 0 && (
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      ⚡ {bid.tickets?.length} Active Addenda/Tickets
                    </span>
                  )}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0">
                <Link
                  href={`/fit-score?bidId=${bid.id}`}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold text-center shadow-sm transition-all"
                >
                  Evaluate Fit Rubric &rarr;
                </Link>

                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-500 mr-1">Stage:</span>
                  {(["Drafting", "Review", "Submitted"] as const).map((stage) => (
                    <button
                      key={stage}
                      onClick={() => handleStatusChange(bid.id, stage)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        bid.status === stage
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
