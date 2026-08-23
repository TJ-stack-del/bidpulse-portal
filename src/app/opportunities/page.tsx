'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// ... (Interface and TRADES remain the same)
interface Solicitation {
  id: string; title: string; agency: string; solicitation_number: string;
  trade: string; estimated_value: string | null; submission_deadline: string;
  pre_bid_date: string | null; portal_url: string | null;
}
const TRADES = [
  { value: 'all', label: 'All Trades' }, { value: 'commercial_janitorial', label: 'Commercial Janitorial' },
  { value: 'landscaping_grounds', label: 'Landscaping & Grounds' }, { value: 'pressure_washing_facades', label: 'Pressure Washing & Facades' },
  { value: 'commercial_painting', label: 'Commercial Painting' }, { value: 'security_guard_services', label: 'Security & Guard Services' },
  { value: 'hvac_preventative_maintenance', label: 'HVAC Maintenance' }, { value: 'hauling_waste_removal', label: 'Hauling & Waste Removal' },
];

export default function OpportunitiesFeedPage() {
  const [opportunities, setOpportunities] = useState<Solicitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState('all');
  const [user, setUser] = useState<any>(null);
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function loadOpportunities() {
    setLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;
    setUser(currentUser);

    let query = supabase.from('solicitations').select('*').eq('status', 'open').order('submission_deadline', { ascending: true });
    if (selectedTrade !== 'all') query = query.eq('trade', selectedTrade);

    const { data, error } = await query;
    if (!error && data) setOpportunities(data as Solicitation[]);
    if (currentUser) {
      const { data: requests } = await supabase.from('package_requests').select('solicitation_id').eq('user_id', currentUser.id);
      if (requests) setRequestedIds(requests.map((r: any) => r.solicitation_id));
    }
    setLoading(false);
  }

  useEffect(() => { loadOpportunities(); }, [selectedTrade]);

  const showToast = (message: string) => { setToast(message); setTimeout(() => setToast(null), 4000); };

  const handleRequestPackage = async (solicitationId: string) => {
    if (!user) return showToast('Please sign in to submit a request.');
    setRequestingId(solicitationId);
    try {
      const { error } = await supabase.from('package_requests').insert({
        solicitation_id: solicitationId, user_id: user.id, status: 'requested', package_fee: 495.00,
      });
      if (error) {
        if (error.message.includes('duplicate') || error.code === '23505') return showToast('Request already submitted for this RFP.');
        return showToast('Unable to complete request.');
      }
      setRequestedIds((prev) => [...prev, solicitationId]);
      showToast('Package requested successfully.');
    } catch { showToast('Unable to complete request.'); } finally { setRequestingId(null); }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      {toast && <div className="fixed top-20 right-8 z-50 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div>}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Active RFP Opportunities</h1>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Verified local solicitations. No subscriptions, just one-time assembly fees.</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Trade Filter</label>
          <select value={selectedTrade} onChange={(e) => setSelectedTrade(e.target.value)} className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500">
            {TRADES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-base text-slate-500 dark:text-slate-400 font-medium">Loading open solicitations...</div>
      ) : opportunities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-16 text-center text-base text-slate-500">No solicitations found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => {
            const hasRequested = requestedIds.includes(opp.id);
            const deadlineDate = new Date(opp.submission_deadline).toLocaleDateString();

            return (
              <div key={opp.id} className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-400 capitalize">{opp.trade.replace(/_/g, ' ')}</span>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded">Due: {deadlineDate}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{opp.title}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{opp.agency} • Ref: {opp.solicitation_number}</p>
                  </div>
                  {opp.estimated_value && (
                    <div className="text-sm text-slate-700 dark:text-slate-300"><span className="font-bold text-slate-900 dark:text-white">Est. Value: </span>{opp.estimated_value}</div>
                  )}
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                  {opp.portal_url ? <a href={opp.portal_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 underline">Agency Portal</a> : <span />}
                  <button onClick={() => handleRequestPackage(opp.id)} disabled={hasRequested || requestingId === opp.id} className={`rounded-lg px-4 py-2.5 text-sm font-bold shadow-sm transition ${hasRequested ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'}`}>
                    {hasRequested ? '✓ Requested' : requestingId === opp.id ? 'Submitting...' : 'Request Assembly ($495 One-Time)'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
