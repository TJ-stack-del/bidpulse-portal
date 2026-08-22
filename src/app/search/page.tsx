"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveNewBid, BidItem } from "../bids";

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
}

const SAMPLE_PUBLIC_FEEDS: SearchResult[] = [
  {
    id: "FL-COJ-2026-992",
    title: "Comprehensive Custodial Services - Ed Ball Building & City Hall",
    agency: "City of Jacksonville - Procurement Division",
    postedDate: "2026-08-18",
    dueDate: "2026-09-28",
    naicsCode: "561720 (Janitorial Services)",
    estimatedValue: "$340,000",
    scope: "Daily commercial janitorial, restroom sanitation, night floor care, and window cleaning for municipal downtown facilities.",
    source: "COJ Procurement Portal"
  },
  {
    id: "DCPS-RFP-042-26",
    title: "District-Wide High School Floor Stripping & Waxing Contract",
    agency: "Duval County Public Schools",
    postedDate: "2026-08-15",
    dueDate: "2026-09-30",
    naicsCode: "561720 (Janitorial Services)",
    estimatedValue: "$175,000",
    scope: "Annual machine scrubbing, stripping, and high-gloss polymer waxing across 14 high school campuses.",
    source: "DCPS Purchasing"
  },
  {
    id: "SAM-FED-88412",
    title: "Base Facilities Janitorial & Refuse Removal Support",
    agency: "Department of the Navy - NAS Jacksonville",
    postedDate: "2026-08-20",
    dueDate: "2026-10-14",
    naicsCode: "561720 (Janitorial Services)",
    estimatedValue: "$820,000",
    scope: "Complete custodial operations, green cleaning compliance, and secure facility trash removal.",
    source: "SAM.gov Federal Opportunities"
  },
  {
    id: "JTA-PROC-2026-19",
    title: "Transit Center Passenger Terminal Sanitation & Power Washing",
    agency: "Jacksonville Transportation Authority (JTA)",
    postedDate: "2026-08-10",
    dueDate: "2026-09-20",
    naicsCode: "561720 (Janitorial Services)",
    estimatedValue: "$210,000",
    scope: "High-frequency terminal sanitization, exterior concourse pressure washing, and bus depot custodial care.",
    source: "JTA Vendor Network"
  }
];

export default function BidSearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("All");
  const [results, setResults] = useState<SearchResult[]>(SAMPLE_PUBLIC_FEEDS);
  const [importingId, setImportingId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = SAMPLE_PUBLIC_FEEDS.filter((item) => {
      const matchesText =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.scope.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSource = selectedSource === "All" || item.source.includes(selectedSource);
      return matchesText && matchesSource;
    });
    setResults(filtered);
  };

  const handleImportToPipeline = (item: SearchResult) => {
    setImportingId(item.id);

    const newBid: BidItem = {
      id: `BID-${Math.floor(200 + Math.random() * 800)}`,
      title: item.title,
      agency: item.agency,
      dueDate: item.dueDate,
      estimatedValue: item.estimatedValue,
      scope: item.scope,
      status: "Drafting",
      fitScore: 80,
      scoringBreakdown: {
        certifications: 20,
        pastPerformance: 20,
        laborCapacity: 20,
        equipmentReadiness: 20
      },
      tickets: []
    };

    saveNewBid(newBid);

    setTimeout(() => {
      setImportingId(null);
      router.push("/portal");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Global Navigation Bar */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              B
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              BidPulse
            </span>
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link href="/portal" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Workspace
            </Link>
            <Link href="/fit-score" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Fit Evaluator
            </Link>
            <Link
              href="/intake"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors"
            >
              + Manual Intake
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
              Procurement Aggregator & Live Search
            </span>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              Search Public & Municipal Solicitations
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Scan active Florida municipal, institutional, and federal janitorial solicitations and import directly into your pipeline.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by keywords (e.g. 'Janitorial', 'Custodial', 'Duval', 'Floor Care')..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            aria-label="Filter by Procurement Feed Source"
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium outline-none"
          >
            <option value="All">All Sources</option>
            <option value="City of Jacksonville">City of Jacksonville (COJ)</option>
            <option value="Duval County">Duval County Schools (DCPS)</option>
            <option value="JTA">JTA Transit</option>
            <option value="SAM.gov">SAM.gov Federal</option>
          </select>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm cursor-pointer"
          >
            Search Bids
          </button>
        </form>

        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <p className="text-slate-600 dark:text-slate-400">No active solicitations matched your search criteria.</p>
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                      {item.source}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">NAICS: {item.naicsCode}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {item.agency}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.scope}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>📅 Due Date: <strong className="text-slate-800 dark:text-slate-200">{item.dueDate}</strong></span>
                    <span>💰 Est. Value: <strong className="text-slate-800 dark:text-slate-200">{item.estimatedValue}</strong></span>
                    <span>🗓️ Posted: {item.postedDate}</span>
                  </div>
                </div>

                <div className="flex md:flex-col items-center gap-3">
                  <button
                    onClick={() => handleImportToPipeline(item)}
                    disabled={importingId === item.id}
                    className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {importingId === item.id ? (
                      <span>Importing...</span>
                    ) : (
                      <>
                        <span>+ Ingest to Pipeline</span>
                        <span className="text-sm">&rarr;</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
