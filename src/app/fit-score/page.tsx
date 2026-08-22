"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSavedBids, fetchAllBidsFromCloud, updateBidScore, BidItem, ScoringBreakdown } from "../bids";
import { exportBidToPdf } from "../pdfExport";

function FitScorerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlBidId = searchParams.get("id") || "";

  const [allBids, setAllBids] = useState<BidItem[]>([]);
  const [selectedBidId, setSelectedBidId] = useState<string>(urlBidId);
  const [currentBid, setCurrentBid] = useState<BidItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Rubric Sliders (0 - 25 pts each = 100 max)
  const [certifications, setCertifications] = useState(20);
  const [pastPerformance, setPastPerformance] = useState(20);
  const [laborCapacity, setLaborCapacity] = useState(20);
  const [equipmentReadiness, setEquipmentReadiness] = useState(20);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load all available bids
  useEffect(() => {
    async function initBids() {
      setLoading(true);
      const cached = getSavedBids();
      if (cached && cached.length > 0) {
        setAllBids(cached);
      }
      const cloud = await fetchAllBidsFromCloud();
      if (cloud && cloud.length > 0) {
        setAllBids(cloud);
      }
      setLoading(false);
    }
    initBids();
  }, []);

  // Determine active bid
  useEffect(() => {
    if (allBids.length === 0) return;

    let target = allBids.find((b) => b.id === (selectedBidId || urlBidId));
    if (!target) {
      target = allBids[0];
    }

    if (target) {
      setSelectedBidId(target.id);
      setCurrentBid(target);
      if (target.scoringBreakdown) {
        setCertifications(target.scoringBreakdown.certifications ?? 20);
        setPastPerformance(target.scoringBreakdown.pastPerformance ?? 20);
        setLaborCapacity(target.scoringBreakdown.laborCapacity ?? 20);
        setEquipmentReadiness(target.scoringBreakdown.equipmentReadiness ?? 20);
      } else {
        setCertifications(20);
        setPastPerformance(20);
        setLaborCapacity(20);
        setEquipmentReadiness(20);
      }
    }
  }, [allBids, urlBidId, selectedBidId]);

  const totalScore = certifications + pastPerformance + laborCapacity + equipmentReadiness;

  const handleSelectBid = (newId: string) => {
    setSelectedBidId(newId);
    router.replace(`/fit-score?id=${newId}`);
  };

  const handleSaveScore = () => {
    if (!currentBid) return;
    const breakdown: ScoringBreakdown = {
      certifications,
      pastPerformance,
      laborCapacity,
      equipmentReadiness
    };
    updateBidScore(currentBid.id, totalScore, breakdown);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportPdf = () => {
    if (!currentBid) return;
    const breakdown: ScoringBreakdown = {
      certifications,
      pastPerformance,
      laborCapacity,
      equipmentReadiness
    };
    exportBidToPdf({
      ...currentBid,
      fitScore: totalScore,
      scoringBreakdown: breakdown
    });
  };

  if (loading && allBids.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-slate-500 mt-4 text-sm font-medium">Loading procurement rubric...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header & Bid Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
            Fit Evaluator Rubric
          </span>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {currentBid ? currentBid.title : "Contract Fit Assessment"}
          </h1>
          {currentBid && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Agency: <span className="font-semibold text-slate-800 dark:text-slate-200">{currentBid.agency}</span> | Due: {currentBid.dueDate} | Est: {currentBid.estimatedValue || "N/A"}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {allBids.length > 0 && (
            <select
              value={selectedBidId}
              onChange={(e) => handleSelectBid(e.target.value)}
              aria-label="Select Solicitation"
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              {allBids.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} - {b.title.substring(0, 24)}...
                </option>
              ))}
            </select>
          )}
          {currentBid && (
            <button
              onClick={handleExportPdf}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold shadow transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF Brief
            </button>
          )}
          <Link
            href="/portal"
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Workspace
          </Link>
        </div>
      </div>

      {/* Rubric Evaluation Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Institutional Evaluation Rubric (0 - 25 pts each)
            </h2>

            {/* Criteria 1 */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                <span>1. Technical Certifications & Compliance</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{certifications} / 25</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={certifications}
                onChange={(e) => setCertifications(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-slate-500 mt-1">CIMS-GB, OSHA training records, bondability, and municipal vendor licensure.</p>
            </div>

            {/* Criteria 2 */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                <span>2. Past Performance & Direct Contract History</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{pastPerformance} / 25</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={pastPerformance}
                onChange={(e) => setPastPerformance(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-slate-500 mt-1">Demonstrated past performance on similar square footage or government agencies.</p>
            </div>

            {/* Criteria 3 */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                <span>3. Labor & Staffing Availability</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{laborCapacity} / 25</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={laborCapacity}
                onChange={(e) => setLaborCapacity(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-slate-500 mt-1">Day porter availability, shift supervisors, and background-checked labor pool.</p>
            </div>

            {/* Criteria 4 */}
            <div>
              <div className="flex justify-between text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                <span>4. Equipment & Material Readiness</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{equipmentReadiness} / 25</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={equipmentReadiness}
                onChange={(e) => setEquipmentReadiness(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-slate-500 mt-1">Floor machines, ride-on auto scrubbers, HEPA extractors, and chemical stock.</p>
            </div>
          </div>
        </div>

        {/* Score Summary Box */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Composite Fit Index</h3>
            <div className="text-5xl font-black text-blue-600 dark:text-blue-400 my-4">{totalScore}%</div>
            
            <div className="text-xs font-medium px-3 py-2 rounded-lg mb-6 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
              {totalScore >= 80 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">🔥 Prime Opportunity — Highly Recommended to Bid</span>
              ) : totalScore >= 60 ? (
                <span className="text-amber-600 dark:text-amber-400 font-bold">⚠️ Conditional Fit — Review Risk & Margin</span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 font-bold">⛔ High Risk Friction — Avoid Submittal</span>
              )}
            </div>

            <button
              onClick={handleSaveScore}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Save Score to Cloud
            </button>

            {savedSuccess && (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                ✓ Saved & Synced to Database!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FitScorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Fit Evaluator...</div>}>
      <FitScorerContent />
    </Suspense>
  );
}
