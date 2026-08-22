"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getSavedBids, BidItem } from "../../bids";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bidId = searchParams.get("id");
  const [bid, setBid] = useState<BidItem | null>(null);

  useEffect(() => {
    if (bidId) {
      const allBids = getSavedBids();
      const match = allBids.find((b) => b.id === bidId);
      if (match) {
        setBid(match);
      }
    }
  }, [bidId]);

  const handleDownloadReceipt = () => {
    if (!bid) return;
    const content = `================================================================================
BID SUBMISSION RECEIPT & INTAKE CONFIRMATION
================================================================================
Tracking ID:         ${bid.id}
Project Title:       ${bid.title}
Issuing Agency:      ${bid.agency}
Target Value:        ${bid.estimatedValue || "Undisclosed / TBD"}
Submission Deadline: ${bid.dueDate}
Fit Viability Score: ${bid.fitScore}%
Received Timestamp:  ${new Date().toLocaleString()}
================================================================================

Scope Summary:
${bid.scope || "No additional scope details provided during initial intake."}

Status: IN REVIEW
Next Step: Our estimation and proposal team will evaluate requirements, verify 
compliance, and prepare the draft proposal package within 1 business day.
================================================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${bid.id}_Intake_Receipt.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
        <div className="h-10 w-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-lg">
          ✓
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Bid Package Received</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Your solicitation is locked in. Our team is generating the compliance and draft package.
          </p>
        </div>
      </div>

      {bid ? (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Reference ID</span>
              <div className="font-mono font-bold text-slate-900 mt-0.5">{bid.id}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Target Value</span>
              <div className="font-mono font-bold text-slate-900 mt-0.5">{bid.estimatedValue || "TBD"}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Deadline</span>
              <div className="font-mono font-bold text-slate-900 mt-0.5">{bid.dueDate}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Viability Score</span>
              <div className="font-mono font-bold text-emerald-600 mt-0.5">{bid.fitScore}%</div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Project Title & Agency</span>
            <div className="text-sm font-bold text-slate-900">{bid.title}</div>
            <div className="text-xs text-slate-500">{bid.agency}</div>
          </div>

          {bid.scope && (
            <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Submitted Scope</span>
              <p className="text-xs text-slate-600 leading-relaxed max-h-24 overflow-y-auto">{bid.scope}</p>
            </div>
          )}

          <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2 text-xs">
            <div className="font-bold flex items-center gap-1.5 text-emerald-400">
              <span>⏱️</span>
              <span>What happens next?</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              We review the agency&apos;s scope requirements, evaluate compliance against past performance and capacity, and prepare an agency-ready proposal draft outline.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition border border-slate-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span>📥 Download Submission Receipt</span>
            </button>
            <div className="flex items-center gap-2">
              <Link
                href="/intake"
                className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition"
              >
                + Submit Another Bid
              </Link>
              <Link
                href="/"
                className="text-slate-600 hover:text-slate-950 font-semibold px-3 py-2.5 text-xs transition"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-3">
          <p className="text-xs text-slate-500">No active submission ID found.</p>
          <Link
            href="/intake"
            className="inline-block bg-slate-950 text-white text-xs font-bold px-4 py-2 rounded-lg"
          >
            Go to Intake Form
          </Link>
        </div>
      )}
    </div>
  );
}

export default function IntakeConfirmationPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <Suspense fallback={<div className="text-center text-xs text-slate-400">Loading receipt...</div>}>
          <ConfirmationContent />
        </Suspense>
      </div>
    </main>
  );
}
