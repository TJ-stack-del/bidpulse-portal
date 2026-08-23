"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getSavedBids, fetchUserBidsFromCloud, updateBidDetails, BidItem } from "../bids";
import { getCurrentUser } from "../auth";
import { getDeadlineUrgency } from "../utils";
import { User } from "@supabase/supabase-js";

const STAGES: Array<BidItem["status"]> = ["Drafting", "Review", "Submitted"];

export default function PortalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [bids, setBids] = useState<BidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"urgency" | "fitScore" | "value">("urgency");

  useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const local = getSavedBids(currentUser.id);
        if (local && local.length > 0) {
          setBids(local);
        }
        const cloud = await fetchUserBidsFromCloud(currentUser.id);
        if (cloud) {
          setBids(cloud);
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleStageMove = (id: string, newStatus: BidItem["status"]) => {
    if (!user) return;
    updateBidDetails(id, { status: newStatus }, user.id);
    setBids((prev) =>
      prev.map((bid) => (bid.id === id ? { ...bid, status: newStatus } : bid))
    );
  };

  const calculateTotalPipelineValue = () => {
    return bids.reduce((acc, bid) => {
      const num = parseInt((bid.estimatedValue || "$0").replace(/[^0-9]/g, ""), 10);
      return acc + (isNaN(num) ? 0 : num);
    }, 0);
  };

  const filteredBids = useMemo(() => {
    return bids
      .filter((bid) => {
        const matchesSearch =
          bid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bid.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bid.id.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStage =
          selectedStageFilter === "All" || bid.status === selectedStageFilter;

        return matchesSearch && matchesStage;
      })
      .sort((a, b) => {
        if (sortBy === "fitScore") {
          return (b.fitScore || 0) - (a.fitScore || 0);
        }
        if (sortBy === "value") {
          const valA = parseInt((a.estimatedValue || "$0").replace(/[^0-9]/g, ""), 10) || 0;
          const valB = parseInt((b.estimatedValue || "$0").replace(/[^0-9]/g, ""), 10) || 0;
          return valB - valA;
        }
        const urgA = getDeadlineUrgency(a.dueDate).daysRemaining;
        const urgB = getDeadlineUrgency(b.dueDate).daysRemaining;
        return urgA - urgB;
      });
  }, [bids, searchQuery, selectedStageFilter, sortBy]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-slate-500 text-sm">
        Verifying contractor credentials...
      </div>
    );
  }

  if (!user) {
    return (
      <main className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-4 font-bold text-2xl shadow-sm">
          🔒
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Sign In to Access Your Workspace
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Your active pipeline, proposal drafts, and internal fit evaluations are private to your contractor account.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/login"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow transition-all"
          >
            Sign In to Workspace &rarr;
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition-all"
          >
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Metric Pipeline Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            Pipeline Control &bull; {user.email}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1.5">
            Operations Workspace
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              📊 Kanban Board
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              📋 Table Grid
            </button>
          </div>

          <Link
            href="/intake"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition-colors"
          >
            + New Intake
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Active Pipeline</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            ${calculateTotalPipelineValue().toLocaleString()}
          </p>
        </div>
        {STAGES.map((stage) => {
          const count = bids.filter((b) => b.status === stage).length;
          return (
            <div key={stage} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stage} Stage</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{count} Solicitations</p>
            </div>
          );
        })}
      </div>

      {/* Filter, Search & Sort Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search by title, agency, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {["All", ...STAGES].map((stage) => (
            <button
              key={stage}
              onClick={() => setSelectedStageFilter(stage)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedStageFilter === stage
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {stage} {stage !== "All" ? `(${bids.filter((b) => b.status === stage).length})` : `(${bids.length})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "urgency" | "fitScore" | "value")}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="urgency">Submission Deadline</option>
            <option value="fitScore">Fit Score (High to Low)</option>
            <option value="value">Est. Value (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STAGES.map((stage) => {
            const stageBids = filteredBids.filter((b) => b.status === stage);
            return (
              <div
                key={stage}
                className="bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 min-h-[520px] flex flex-col"
              >
                <div className="flex justify-between items-center pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      stage === "Drafting" ? "bg-slate-400" : stage === "Review" ? "bg-amber-500" : "bg-emerald-500"
                    }`} />
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                      {stage}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {stageBids.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageBids.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-400 font-medium">
                      No matching solicitations in {stage.toLowerCase()}
                    </div>
                  ) : (
                    stageBids.map((bid) => {
                      const urgency = getDeadlineUrgency(bid.dueDate);
                      return (
                        <div
                          key={bid.id}
                          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-700 transition-all space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              {bid.id}
                            </span>
                            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              🎯 {bid.fitScore}/100
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                            {bid.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-semibold">{bid.agency}</p>

                          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${urgency.badgeClass}`}>
                              {urgency.label}
                            </span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{bid.estimatedValue}</span>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-2">
                            <Link
                              href={`/fit-score?bidId=${bid.id}`}
                              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                            >
                              Scorer & Brief &rarr;
                            </Link>

                            <div className="flex items-center gap-1">
                              {STAGES.filter((s) => s !== stage).map((targetStage) => (
                                <button
                                  key={targetStage}
                                  onClick={() => handleStageMove(bid.id, targetStage)}
                                  className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-600 dark:text-slate-300 hover:text-emerald-600 rounded transition-colors cursor-pointer"
                                >
                                  &rarr; {targetStage}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Mode */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Solicitation & Agency</th>
                <th className="p-4">Fit Score</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Est. Value</th>
                <th className="p-4">Submission Deadline</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBids.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No matching bids found.
                  </td>
                </tr>
              ) : (
                filteredBids.map((bid) => {
                  const urgency = getDeadlineUrgency(bid.dueDate);
                  return (
                    <tr key={bid.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{bid.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">{bid.title}</div>
                        <div className="text-[11px] text-slate-500">{bid.agency}</div>
                      </td>
                      <td className="p-4 font-black">{bid.fitScore}/100</td>
                      <td className="p-4">
                        <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {bid.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold">{bid.estimatedValue}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${urgency.badgeClass}`}>
                          {urgency.label}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/fit-score?bidId=${bid.id}`}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                        >
                          Evaluate &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
