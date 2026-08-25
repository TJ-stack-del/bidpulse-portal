'use client';

import React, { useState } from 'react';

export interface BinderProposal {
  id: string;
  created_at: string;
  solicitation_title?: string | null;
  issuing_agency?: string | null;
  status: 'drafting' | 'qa_review' | 'ready_for_export' | 'delivered';
  tier?: string | null;
  target_date?: string | null;
  notes?: string | null;
}

const MILESTONES = [
  { key: 'intake', label: 'Upload Confirmed' },
  { key: 'drafting', label: 'Drafting' },
  { key: 'qa_review', label: 'Review' },
  { key: 'ready_for_export', label: 'Ready' },
];

export default function BinderCard({ proposal }: { proposal: BinderProposal }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const getStepIndex = (status: BinderProposal['status']) => {
    switch (status) {
      case 'drafting':
        return 1;
      case 'qa_review':
        return 2;
      case 'ready_for_export':
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(proposal.status);
  const isReady = proposal.status === 'ready_for_export' || proposal.status === 'delivered';

  const handleDownload = () => {
    setDownloading(true);
    setDownloadToast('Preparing your bid package download...');

    setTimeout(() => {
      setDownloading(false);
      setDownloadToast('Bid package downloaded successfully.');
      setTimeout(() => setDownloadToast(null), 4000);
    }, 1200);
  };

  return (
    <div className="bg-[#0b1329]/80 border border-slate-800 rounded-xl p-6 shadow-lg backdrop-blur space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1.5 max-w-xl">
          <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
            {proposal.tier ? proposal.tier.replace(/_/g, ' ') : 'Single Bid Pass'}
          </span>
          <h3 className="text-base font-bold text-white leading-snug pt-1">
            {proposal.solicitation_title || 'Active Bid Opportunity'}
          </h3>
          <p className="text-xs text-slate-300 font-medium">
            {proposal.issuing_agency || 'Project Office'}
          </p>
        </div>

        <div className="sm:text-right bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 self-start">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
            Target Completion
          </span>
          <span className="text-xs font-mono font-bold text-white mt-0.5 block" suppressHydrationWarning>
            {proposal.target_date ? proposal.target_date.slice(0, 10) : 'Standard Turnaround'}
          </span>
        </div>
      </div>

      {/* Progress Stepper with High-Contrast Green */}
      <div className="space-y-4 px-2">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-400 transition-all duration-500 -z-0"
            style={{ width: `${(currentStep / (MILESTONES.length - 1)) * 100}%` }}
          />

          {MILESTONES.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-md shadow-black'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  } ${isCurrent && !isReady ? 'ring-2 ring-emerald-400' : ''}`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                {/* Sunlight Contrast: Bold light emerald/slate text */}
                <span
                  className={`absolute top-8 whitespace-nowrap text-[11px] font-bold transition-colors ${
                    isCompleted ? 'text-emerald-300' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer Banner */}
      <div className="pt-6 space-y-3">
        {isReady ? (
          <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <h4 className="text-xs font-bold text-emerald-300">Bid Package Ready</h4>
              <p className="text-[11px] text-slate-200">
                Your completed proposal files and submission documents are ready.
              </p>
            </div>
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownload}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow-md transition whitespace-nowrap disabled:opacity-50"
            >
              {downloading ? 'Preparing Files...' : 'Download Bid Package'}
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-3.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-200">
              Our team is currently preparing your bid package.
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-400/40 whitespace-nowrap">
              In Progress
            </span>
          </div>
        )}

        {/* In-App Toast Notification (Zero Popup Blocking) */}
        {downloadToast && (
          <div className="bg-slate-900 border border-emerald-400/60 text-emerald-300 px-4 py-2.5 rounded-lg text-xs flex items-center justify-between shadow-xl animate-in fade-in">
            <span className="font-semibold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {downloadToast}
            </span>
            <button
              type="button"
              onClick={() => setDownloadToast(null)}
              className="text-slate-400 hover:text-white font-bold ml-3"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}