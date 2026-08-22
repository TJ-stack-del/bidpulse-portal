"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveNewBid, getSavedDraft, saveDraft, clearSavedDraft } from "../bids";

export default function IntakePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [agency, setAgency] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [scope, setScope] = useState("");
  const [draftRecoveredTime, setDraftRecoveredTime] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("Ready");

  // Load existing draft if present
  useEffect(() => {
    const existing = getSavedDraft();
    if (existing && (existing.title || existing.agency || existing.scope)) {
      setTitle(existing.title || "");
      setAgency(existing.agency || "");
      setDueDate(existing.dueDate || "");
      setEstimatedValue(existing.estimatedValue || "");
      setScope(existing.scope || "");
      setDraftRecoveredTime(existing.savedAt);
    }
  }, []);

  // Auto-save on field changes
  useEffect(() => {
    if (!title && !agency && !dueDate && !estimatedValue && !scope) return;

    const timer = setTimeout(() => {
      saveDraft({ title, agency, dueDate, estimatedValue, scope });
      setAutoSaveStatus(`Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
    }, 600);

    return () => clearTimeout(timer);
  }, [title, agency, dueDate, estimatedValue, scope]);

  const handleDiscardDraft = () => {
    if (confirm("Are you sure you want to discard this draft and start clean?")) {
      clearSavedDraft();
      setTitle("");
      setAgency("");
      setDueDate("");
      setEstimatedValue("");
      setScope("");
      setDraftRecoveredTime(null);
      setAutoSaveStatus("Cleared");
    }
  };

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
      scope: scope || "Standard procurement scope pending full technical narrative.",
      tickets: []
    };

    saveNewBid(newBid);
    clearSavedDraft();
    router.push(`/intake/confirmation?id=${newBid.id}`);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/" className="text-xs text-slate-500 hover:text-slate-900 font-medium transition">
                ← Return Home
              </Link>
              <span className="text-slate-300">•</span>
              <Link href="/portal" className="text-xs text-emerald-600 hover:text-emerald-700 font-bold transition">
                Go to My Submittals →
              </Link>
            </div>
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

        {/* Draft Recovered Notification Banner */}
        {draftRecoveredTime && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="text-base">📝</span>
              <span>
                <strong>Restored active draft</strong> from earlier session ({draftRecoveredTime}).
              </span>
            </div>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="text-amber-800 hover:text-red-700 underline font-semibold text-[11px] cursor-pointer"
            >
              Discard Draft
            </button>
          </div>
        )}

        {/* Form */}
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

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
            <span>💾 Auto-save: {autoSaveStatus}</span>
            {(title || agency || scope) && (
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="text-slate-400 hover:text-red-500 transition cursor-pointer"
              >
                Clear all fields
              </button>
            )}
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
