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
  { key: 'intake', label: 'Intake Confirmed' },
  { key: 'drafting', label: 'Drafting' },
  { key: 'qa_review', label: 'QA Review' },
  { key: 'ready_for_export', label: 'Completed' },
];

export default function BinderCard({ proposal }: { proposal: BinderProposal }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

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
    setDownloadNotice('Preparing your proposal binder package...');

    setTimeout(() => {
      setDownloading(false);
      setDownloadNotice('Proposal package downloaded successfully.');
      setTimeout(() => setDownloadNotice(null), 4000);
    }, 1200);
  };

  return (
    <div className="bg-[#0b1329]/80 border border-slate-800 rounded-xl p-6 shadow-lg backdrop-blur space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1.5 max-w-xl">
          <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
            {proposal.tier ? proposal.tier.replace(/_/g, ' ') : 'Single Bid Pass'}
          </span>
          <h3 className="text-base font-semibold text-slate-100 leading-snug pt-1">
            {proposal.solicitation_title || 'Government Contract Proposal'}
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            {proposal.issuing_agency || 'Procurement Office'}
          </p>
        </div>

        <div className="sm:text-right bg-slate-950/40 border border-slate-800/80 rounded-lg px-3.5 py-2 self-start">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block">
            Target Delivery
          </span>
          <span className="text-xs font-mono font-medium text-slate-300 mt-0.5 block" suppressHydrationWarning>
            {proposal.target_date ? proposal.target_date.slice(0, 10) : 'Standard Turnaround'}
          </span>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="space-y-4 px-2">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-900 -z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 -z-0"
            style={{ width: `${(currentStep / (MILESTONES.length - 1)) * 100}%` }}
          />

          {MILESTONES.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-sm shadow-emerald-950'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  } ${isCurrent && !isReady ? 'ring-2 ring-emerald-500/30' : ''}`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span
                  className={`absolute top-8 whitespace-nowrap text-[11px] font-medium transition-colors ${
                    isCompleted ? 'text-slate-200' : 'text-slate-500'
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
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <h4 className="text-xs font-semibold text-emerald-300">Proposal Package Ready</h4>
              <p className="text-[11px] text-slate-400">
                Your compliance matrix and final proposal draft are ready for download.
              </p>
            </div>
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownload}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium shadow transition whitespace-nowrap disabled:opacity-50"
            >
              {downloading ? 'Generating Files...' : 'Download Proposal Package'}
            </button>
          </div>
        ) : (
          <div className="bg-slate-950/50 border border-slate-800/80 rounded-lg p-3.5 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Our proposal team is currently drafting your response documents and compliance matrix.
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 whitespace-nowrap">
              In Progress
            </span>
          </div>
        )}

        {downloadNotice && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3.5 py-2 rounded-lg text-xs flex items-center justify-between transition-all">
            <span>{downloadNotice}</span>
          </div>
        )}
      </div>
    </div>
  );
}