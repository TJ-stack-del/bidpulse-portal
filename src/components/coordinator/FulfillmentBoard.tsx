'use client';

import React, { useState, useTransition } from 'react';
import { updateProposalStage, FulfillmentStatus } from '@/app/actions/fulfillment';

export interface ProposalRecord {
  id: string;
  created_at: string;
  solicitation_title?: string | null;
  issuing_agency?: string | null;
  status: FulfillmentStatus;
  tier?: string | null;
  client_email?: string | null;
  target_date?: string | null;
  notes?: string | null;
}

const STAGES: { id: FulfillmentStatus; label: string; color: string }[] = [
  { id: 'drafting', label: 'Drafting', color: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
  { id: 'qa_review', label: 'QA Review', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
  { id: 'ready_for_export', label: 'Ready for Export', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10' },
  { id: 'delivered', label: 'Delivered', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
];

export default function FulfillmentBoard({
  initialProposals,
}: {
  initialProposals: ProposalRecord[];
}) {
  const [proposals, setProposals] = useState<ProposalRecord[]>(initialProposals);
  const [activeStage, setActiveStage] = useState<FulfillmentStatus | 'all'>('all');
  const [isPending, startTransition] = useTransition();

  const handleStageChange = (id: string, newStage: FulfillmentStatus) => {
    startTransition(async () => {
      try {
        await updateProposalStage(id, newStage);
        setProposals((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStage } : p))
        );
      } catch (err: any) {
        alert(err.message || 'Failed to update proposal stage');
      }
    });
  };

  const filteredProposals =
    activeStage === 'all'
      ? proposals
      : proposals.filter((p) => p.status === activeStage);

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveStage('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            activeStage === 'all'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All ({proposals.length})
        </button>
        {STAGES.map((stage) => {
          const count = proposals.filter((p) => p.status === stage.id).length;
          const isActive = activeStage === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(stage.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 border ${
                isActive
                  ? stage.color
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{stage.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-900/80">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProposals.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-xs bg-[#0b1329]/40 border border-slate-800 rounded-xl">
            No proposal packages found in this stage.
          </div>
        ) : (
          filteredProposals.map((item) => {
            const stageMeta = STAGES.find((s) => s.id === item.status) || STAGES[0];

            return (
              <div
                key={item.id}
                className="bg-[#0b1329]/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${stageMeta.color}`}
                    >
                      {stageMeta.label}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono" suppressHydrationWarning>
                      {item.created_at ? item.created_at.slice(0, 10) : ''}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-100 line-clamp-1">
                      {item.solicitation_title || 'Untitled Proposal'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.issuing_agency || 'Unspecified Agency'}
                    </p>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Client:</span>
                      <span className="text-slate-300 truncate max-w-[180px]">
                        {item.client_email || 'No email'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tier:</span>
                      <span className="text-slate-300 capitalize">
                        {item.tier ? item.tier.replace(/_/g, ' ') : 'Single Bid Pass'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stage Advancement Controls */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold block">
                    Advance Stage:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {STAGES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        disabled={isPending || item.status === s.id}
                        onClick={() => handleStageChange(item.id, s.id)}
                        className={`py-1.5 px-2 rounded font-medium border text-center transition ${
                          item.status === s.id
                            ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {s.label}
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
}