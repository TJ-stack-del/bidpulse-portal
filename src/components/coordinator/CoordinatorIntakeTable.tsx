'use client';

import React, { useState, useTransition } from 'react';
import { updateIntakeStatus, IntakeStatus } from '@/app/actions/coordinator';

interface IntakeRecord {
  id: string;
  created_at: string;
  status: IntakeStatus;
  tier: string;
  opportunity_id?: string | null;
  target_date?: string | null;
  notes?: string | null;
  raw_payload?: any;
}

const TIER_METADATA: Record<string, { label: string; price: string }> = {
  single_bid_pass: { label: 'Single Bid Pass', price: '$299.00' },
  contract_radar: { label: 'Contract Radar', price: '$99.00/mo' },
};

export default function CoordinatorIntakeTable({
  initialIntakes,
}: {
  initialIntakes: IntakeRecord[];
}) {
  const [selectedId, setSelectedId] = useState<string>(initialIntakes[0]?.id || '');
  const [isPending, startTransition] = useTransition();

  const selectedIntake = initialIntakes.find((item) => item.id === selectedId) || null;

  const handleStatusChange = (id: string, newStatus: IntakeStatus) => {
    startTransition(async () => {
      try {
        await updateIntakeStatus(id, newStatus);
      } catch (err: any) {
        alert(err.message || 'Failed to update status');
      }
    });
  };

  const getStatusBadge = (status: IntakeStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  const payload = selectedIntake?.raw_payload || {};
  const customerEmail =
    payload.customer_details?.email ||
    payload.customer_email ||
    'stripe@example.com';
  const customerName =
    payload.customer_details?.name ||
    'Direct Checkout';

  const tierKey = selectedIntake?.tier || 'single_bid_pass';
  const tierInfo = TIER_METADATA[tierKey] || {
    label: tierKey.replace(/_/g, ' '),
    price: '$299.00',
  };

  const paymentStatus = payload.payment_status || 'Paid';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Submissions Feed */}
      <div className="lg:col-span-7 bg-[#0b1329]/80 border border-slate-800 rounded-xl overflow-hidden shadow-lg backdrop-blur">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <h2 className="text-xs font-semibold tracking-wide text-slate-100 uppercase">
              Incoming RFP Submissions
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {initialIntakes.length} {initialIntakes.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Submission Date</th>
                <th className="px-6 py-3.5">Tier Plan</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {initialIntakes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-xs">
                    No intake submissions recorded.
                  </td>
                </tr>
              ) : (
                initialIntakes.map((item) => {
                  const isSelected = item.id === selectedId;
                  const itemTier = TIER_METADATA[item.tier]?.label || item.tier?.replace(/_/g, ' ') || 'Single Bid Pass';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`cursor-pointer transition-colors duration-150 ${
                        isSelected
                          ? 'bg-cyan-950/25 border-l-2 border-cyan-400'
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-200 font-medium" suppressHydrationWarning>
                          {item.created_at ? item.created_at.slice(0, 10) : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-200">
                          {itemTier}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedId(item.id);
                          }}
                          className={`text-xs px-3 py-1.5 rounded font-medium border transition ${
                            isSelected
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {isSelected ? 'Viewing' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overview Card */}
      <div className="lg:col-span-5 bg-[#0b1329]/80 border border-slate-800 rounded-xl p-6 shadow-lg backdrop-blur space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <h2 className="text-xs font-semibold tracking-wide text-slate-100 uppercase">
            Submission Details
          </h2>
          {selectedIntake && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusBadge(
                selectedIntake.status
              )}`}
            >
              {selectedIntake.status.replace(/_/g, ' ')}
            </span>
          )}
        </div>

        {selectedIntake ? (
          <div className="space-y-6 text-xs">
            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                  Customer Email
                </span>
                <span className="font-medium text-slate-200 mt-1 block truncate">
                  {customerEmail}
                </span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                  Customer Name
                </span>
                <span className="font-medium text-slate-200 mt-1 block truncate">
                  {customerName}
                </span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                  Payment Status
                </span>
                <span className="font-semibold text-emerald-400 mt-1 block capitalize">
                  {paymentStatus} ({tierInfo.price})
                </span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5">
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
                  Selected Tier
                </span>
                <span className="font-medium text-slate-200 mt-1 block">
                  {tierInfo.label}
                </span>
              </div>
            </div>

            {/* Ingestion Workflow Actions */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
              <span className="text-slate-400 block text-[11px] font-medium">
                Update Ingestion State:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={isPending || selectedIntake.status === 'in_review'}
                  onClick={() => handleStatusChange(selectedIntake.id, 'in_review')}
                  className="py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  In Review
                </button>
                <button
                  type="button"
                  disabled={isPending || selectedIntake.status === 'rejected'}
                  onClick={() => handleStatusChange(selectedIntake.id, 'rejected')}
                  className="py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-medium transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={isPending || selectedIntake.status === 'approved'}
                  onClick={() => handleStatusChange(selectedIntake.id, 'approved')}
                  className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 text-xs py-16 text-center">
            <p>Select a submission from the queue to view details and update workflow status.</p>
          </div>
        )}
      </div>
    </div>
  );
}