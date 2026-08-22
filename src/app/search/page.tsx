"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveNewBid, BidItem } from "../bids";
import { getClientProfile, calculateMatchScore, ClientProfile } from "../profile";
import { getCurrentUser } from "../auth";
import { getDeadlineUrgency } from "../utils";
import { User } from "@supabase/supabase-js";

interface SearchResult {
  id: string;
  title: string;
  agency: string;
  postedDate: string;
  dueDate: string;
  naicsCode: string;
  estimatedValue: string;
  scope: string;
  source: string;
  setAside?: string;
}

const SAMPLE_PUBLIC_FEEDS: SearchResult[] = [
  {
    id: "FL-COJ-2026-992",
    title: "Comprehensive Custodial Services - Ed Ball Building & City Hall",
    agency: "City of Jacksonville - Procurement Division",
    postedDate: "2026-08-18",
    dueDate: "2026-08-28",
    naicsCode: "561720 (Janitorial)",
    estimatedValue: "$340,000",
    scope: "Daily commercial janitorial, high-traffic restroom sanitization, night floor maintenance, polymer waxing, and window cleaning for downtown municipal headquarters.",
    source: "City of Jacksonville",
    setAside: "Small Business Enterprise"
  },
  {
    id: "DCPS-RFP-042-26",
    title: "District-Wide High School Floor Stripping & Machine Scrubbing",
    agency: "Duval County Public Schools",
    postedDate: "2026-08-15",
    dueDate: "2026-09-02",
    naicsCode: "561720 (Janitorial)",
    estimatedValue: "$175,000",
    scope: "Annual machine scrubbing, stripping, and high-gloss polymer waxing across 14 high school campuses within Duval County.",
    source: "Duval County Schools",
    setAside: "Open Competitive"
  },
  {
    id: "SAM-FED-88412",
    title: "Base Facilities Custodial & Biohazard Disinfection Support",
    agency: "Department of the Navy - NAS Jacksonville",
    postedDate: "2026-08-20",
    dueDate: "2026-08-24",
    naicsCode: "561720 (Janitorial)",
    estimatedValue: "$820,000",
    scope: "Complete administrative custodial operations, green cleaning compliance (CIMS-GB standard), and secure facility refuse removal.",
    source: "SAM.gov Federal",
    setAside: "Total Small Business"
  },
  {
    id: "JTA-PROC-2026-19",
    title: "Transit Center Passenger Terminal Sanitization & Power Washing",
    agency: "Jacksonville Transportation Authority (JTA)",
    postedDate: "2026-08-10",
    dueDate: "2026-09-15",
    naicsCode: "561720 (Janitorial)",
    estimatedValue: "$210,000",
    scope: "High-frequency passenger terminal sanitization, exterior concourse pressure washing, and bus maintenance depot floor care.",
    source: "JTA Transit",
    setAside: "DBE Preferred"
  }
];

export default function BidSearchPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("All");
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [viewDensity, setViewDensity] = useState<"comfortable" | "compact">("comfortable");
  const [selectedBidDetail, setSelectedBidDetail] = useState<SearchResult | null>(null);
  const [importingId, setImportingId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
    setProfile(getClientProfile());
  }, []);

  const scoredResults = SAMPLE_PUBLIC_FEEDS.map((item) => {
    const match = profile
      ? calculateMatchScore(item, profile)
      : { score: 75, reasons: [] };
    return { ...item, matchScore: match.score, matchReasons: match.reasons };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const displayedResults = scoredResults.filter((item) => {
    const matchesText =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scope.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgency = selectedAgency === "All" || item.source.includes(selectedAgency);
    const matchesScore = item.matchScore >= minScoreFilter;
    return matchesText && matchesAgency && matchesScore;
  });

  const handleImportToPipeline = (item: SearchResult & { matchScore: number }) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setImportingId(item.id);

    const newBid: BidItem = {
      id: `BID-${Math.floor(200 + Math.random() * 800)}`,
      title: item.title,
      agency: item.agency,
      dueDate: item.dueDate,
      estimatedValue: item.estimatedValue,
      scope: item.scope,
      status: "Drafting",
      fitScore: item.matchScore,
      userId: user.id,
      scoringBreakdown: {
        certifications: 20,
        pastPerformance: 20,
        laborCapacity: 20,
        equipmentReadiness: 20
      },
      tickets: []
    };

    saveNewBid(newBid, user.id);

    setTimeout(() => {
      setImportingId(null);
      router.push("/portal");
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
              Intelligence Aggregator
            </span>
            {profile && (
              <span className="text-xs text-slate-500 font-medium">
                Active Criteria: <strong className="text-slate-800 dark:text-slate-200">{profile.companyName}</strong>
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1.5">
            Public Procurement Feed
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Real-time municipal, state, and federal contract opportunities matched to your trade capacity.
          </p>
        </div>

        {/* View Density Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewDensity("comfortable")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewDensity === "comfortable"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              🗂️ Cards
            </button>
            <button
              onClick={() => setViewDensity("compact")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewDensity === "compact"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              📋 Dense Grid
            </button>
          </div>
          <Link
            href="/settings"
            className="px-3.5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            ⚙️ Edit Criteria
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Facet Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Facet Filters
            </h3>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Keyword / Trade Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., stripping, floor, Navy"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Target Agency Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Issuing Agency
              </label>
              <select
                value={selectedAgency}
                onChange={(e) => setSelectedAgency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white outline-none"
              >
                <option value="All">All Agencies</option>
                <option value="City of Jacksonville">City of Jacksonville (COJ)</option>
                <option value="Duval County Schools">Duval County Schools (DCPS)</option>
                <option value="JTA Transit">JTA Transit</option>
                <option value="SAM.gov">SAM.gov Federal</option>
              </select>
            </div>

            {/* Minimum Fit Match Threshold */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Minimum Profile Match
                </label>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {minScoreFilter}%+
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={10}
                value={minScoreFilter}
                onChange={(e) => setMinScoreFilter(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>All Bids</span>
                <span>50%</span>
                <span>90%+ Tier</span>
              </div>
            </div>

            {/* Quick Status Chips */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 block mb-2">Quick Toggles</span>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setMinScoreFilter(minScoreFilter === 80 ? 0 : 80)}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    minScoreFilter === 80
                      ? "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  🎯 High Match Only (80%+)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Feed Results Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Showing <strong>{displayedResults.length}</strong> matching solicitations</span>
            <span>Sorted by <strong>Highest Compatibility</strong></span>
          </div>

          {displayedResults.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <p className="text-slate-500 text-sm font-medium">No solicitations match your active filters.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedAgency("All");
                  setMinScoreFilter(0);
                }}
                className="mt-3 text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Reset all filters &rarr;
              </button>
            </div>
          ) : viewDensity === "compact" ? (
            /* Compact Data Grid */
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3.5">Match</th>
                    <th className="p-3.5">Solicitation & Agency</th>
                    <th className="p-3.5">Est. Value</th>
                    <th className="p-3.5">Deadline</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {displayedResults.map((item) => {
                    const urgency = getDeadlineUrgency(item.dueDate);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-black text-[11px] ${
                            item.matchScore >= 85
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          }`}>
                            {item.matchScore}%
                          </span>
                        </td>
                        <td className="p-3.5">
                          <button
                            onClick={() => setSelectedBidDetail(item)}
                            className="font-bold text-slate-900 dark:text-white hover:text-emerald-600 text-left block"
                          >
                            {item.title}
                          </button>
                          <span className="text-[11px] text-slate-500">{item.agency}</span>
                        </td>
                        <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200">{item.estimatedValue}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] ${urgency.badgeClass}`}>
                            {urgency.label}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleImportToPipeline(item)}
                            disabled={importingId === item.id}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50"
                          >
                            {importingId === item.id ? "Ingesting..." : "+ Ingest"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Comfortable Card Layout */
            displayedResults.map((item) => {
              const urgency = getDeadlineUrgency(item.dueDate);
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.source}
                      </span>
                      {item.setAside && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {item.setAside}
                        </span>
                      )}
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          item.matchScore >= 85
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300"
                        }`}
                      >
                        🎯 {item.matchScore}% Match
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedBidDetail(item)}
                      className="text-lg font-bold text-slate-900 dark:text-white leading-tight cursor-pointer hover:text-emerald-600 transition-colors"
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {item.agency} &bull; <span className="font-mono text-slate-500">{item.naicsCode}</span>
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.scope}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs ${urgency.badgeClass}`}>
                        {urgency.label}
                      </span>
                      <span>💰 Est. Value: <strong className="text-slate-800 dark:text-slate-200">{item.estimatedValue}</strong></span>
                      <button
                        onClick={() => setSelectedBidDetail(item)}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline ml-auto"
                      >
                        Quick View Specs &rarr;
                      </button>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center gap-3">
                    <button
                      onClick={() => handleImportToPipeline(item)}
                      disabled={importingId === item.id}
                      className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {importingId === item.id ? (
                        <span>Ingesting...</span>
                      ) : (
                        <>
                          <span>+ Ingest to Pipeline</span>
                          <span className="text-sm">&rarr;</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Slide-Out Quick-View Specs Drawer */}
      {selectedBidDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full p-8 shadow-2xl overflow-y-auto border-l border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedBidDetail.id}</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{selectedBidDetail.title}</h2>
                <p className="text-xs text-slate-500 font-semibold">{selectedBidDetail.agency}</p>
              </div>
              <button
                onClick={() => setSelectedBidDetail(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Estimated Budget</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{selectedBidDetail.estimatedValue}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Submission Deadline</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{selectedBidDetail.dueDate}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Statement of Work Scope</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                {selectedBidDetail.scope}
              </p>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={() => {
                  const toImport = selectedBidDetail;
                  setSelectedBidDetail(null);
                  handleImportToPipeline(toImport as SearchResult & { matchScore: number });
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow cursor-pointer"
              >
                + Ingest Solicitation into Pipeline
              </button>
              <button
                onClick={() => setSelectedBidDetail(null)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
