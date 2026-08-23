'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface ClientRequest {
  id: string; status: string; package_fee: number; delivered_packet_url: string | null; created_at: string;
  solicitations: { id: string; title: string; agency: string; solicitation_number: string; submission_deadline: string; trade: string; } | null;
}

export default function ContractorRequestsPage() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMyRequests() {
    setLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user) {
      const { data } = await supabase.from('package_requests').select(`
        id, status, package_fee, delivered_packet_url, created_at,
        solicitations (id, title, agency, solicitation_number, submission_deadline, trade)
      `).eq('user_id', authData.user.id).order('created_at', { ascending: false });
      if (data) setRequests(data as any);
    }
    setLoading(false);
  }

  useEffect(() => { loadMyRequests(); }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested': return <span className="inline-flex rounded-full bg-amber-50 dark:bg-amber-900/30 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-400">⏳ Order Placed</span>;
      case 'in_assembly': return <span className="inline-flex rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-bold text-blue-800 dark:text-blue-400">⚙️ In Assembly</span>;
      case 'ready_for_pricing': return <span className="inline-flex rounded-full bg-purple-50 dark:bg-purple-900/30 px-3 py-1 text-xs font-bold text-purple-800 dark:text-purple-400">📋 Finalizing Pricing</span>;
      case 'delivered': return <span className="inline-flex rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-400">✓ Packet Ready</span>;
      default: return <span className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300">{status}</span>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Proposal Packets</h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Track real-time assembly progress for your requested solicitation binders.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-base text-slate-500 dark:text-slate-400 font-medium">Loading your proposal requests...</div>
        ) : requests.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <p className="text-base text-slate-600 dark:text-slate-400 font-medium">You haven't requested any proposal packages yet.</p>
            <Link href="/opportunities" className="inline-block text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Browse open RFP opportunities &rarr;</Link>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-300">
              <tr>
                <th className="px-5 py-3.5">Contract / Opportunity</th>
                <th className="px-5 py-3.5">Trade</th>
                <th className="px-5 py-3.5">Deadline</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Delivered Packet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900 dark:text-white text-base">{req.solicitations?.title || 'Contract Solicitation'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{req.solicitations?.agency} • Ref: {req.solicitations?.solicitation_number}</p>
                  </td>
                  <td className="px-5 py-4"><span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-800 dark:text-slate-300 capitalize">{req.solicitations?.trade ? req.solicitations.trade.replace(/_/g, ' ') : 'General'}</span></td>
                  <td className="px-5 py-4 text-sm font-bold text-red-600 dark:text-red-400">{req.solicitations?.submission_deadline ? new Date(req.solicitations.submission_deadline).toLocaleDateString() : '—'}</td>
                  <td className="px-5 py-4">{getStatusBadge(req.status)}</td>
                  <td className="px-5 py-4 text-right">
                    {req.delivered_packet_url ? (
                      <a href={req.delivered_packet_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition">📥 Open Packet</a>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Assembly in progress</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
