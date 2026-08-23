'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Solicitation {
  id: string;
  title: string;
  agency: string;
  trade: string;
  deadline: string;
  ref_number: string;
  estimated_value: string;
  portal_url?: string;
}

export default function OpportunitiesPage() {
  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState('All Trades');
  const [requestedTitles, setRequestedTitles] = useState<string[]>([]);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const fetchSolicitations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ingest/rfps');
      const data = await res.json();
      if (data && Array.isArray(data.solicitations) && data.solicitations.length > 0) {
        setSolicitations(data.solicitations);
      } else {
        await handleSync();
      }
    } catch (e) {
      console.error('Failed to load solicitations:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/ingest/rfps', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        const getRes = await fetch('/api/ingest/rfps');
        const refreshed = await getRes.json();
        if (refreshed?.solicitations) setSolicitations(refreshed.solicitations);
      }
    } catch (e) {
      console.error('Sync failed:', e);
    } finally {
      setSyncing(false);
    }
  };

  const loadExistingRequests = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data } = await supabase
        .from('proposal_requests')
        .select('solicitation_title')
        .eq('user_id', userData.user.id);

      if (data) {
        setRequestedTitles(data.map(d => d.solicitation_title));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSolicitations();
    loadExistingRequests();
  }, []);

  const handleRequestAssembly = async (sol: Solicitation) => {
    setSubmittingId(sol.id);
    try {
      const { data: userData } = await supabase.auth.getUser();

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solicitationTitle: sol.title,
          issuingAgency: sol.agency,
          trade: sol.trade,
          refNumber: sol.ref_number,
          userId: userData?.user?.id || '',
          userEmail: userData?.user?.email || 'contractor@bidpulse.local'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment gateway');

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      alert(`Payment notice: ${err.message}`);
    } finally {
      setSubmittingId(null);
    }
  };

  // Robust flexible trade filtering
  const filtered = solicitations.filter((sol) => {
    if (selectedTrade === 'All Trades') return true;
    const solTrade = (sol.trade || '').toLowerCase();
    const filterKey = selectedTrade.toLowerCase();

    if (filterKey.includes('janitorial')) return solTrade.includes('janitorial');
    if (filterKey.includes('pressure')) return solTrade.includes('pressure') || solTrade.includes('washing');
    if (filterKey.includes('landscaping')) return solTrade.includes('landscaping') || solTrade.includes('grounds') || solTrade.includes('mowing');
    if (filterKey.includes('hauling')) return solTrade.includes('hauling') || solTrade.includes('waste') || solTrade.includes('debris');

    return solTrade.includes(filterKey);
  });

  return (
    <div className="max-w-7xl w-full mx-auto p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Active RFP Opportunities</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Live Florida municipal & federal procurement solicitations. Order your turnkey 5-tab binder.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <svg className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {syncing ? 'Syncing Feeds...' : 'Sync Live Feeds'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-slate-400">Trade:</span>
            <select 
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All Trades">All Trades</option>
              <option value="Commercial Janitorial">Commercial Janitorial</option>
              <option value="Pressure Washing / Facades">Pressure Washing</option>
              <option value="Landscaping / Grounds">Landscaping / Grounds</option>
              <option value="Hauling / Waste Removal">Hauling / Waste</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading municipal solicitation feed...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
          No active solicitations found for this filter. Try clicking "Sync Live Feeds".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sol) => {
            const isAlreadyRequested = requestedTitles.includes(sol.title);

            return (
              <div key={sol.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {sol.trade}
                    </span>
                    <span className="text-[11px] font-medium text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      Due: {sol.deadline}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5 leading-snug">
                    {sol.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {sol.agency} {sol.ref_number ? `· Ref: ${sol.ref_number}` : ''}
                  </p>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-mono mb-4">
                    Est. Value: <span className="font-semibold text-slate-900 dark:text-slate-100">{sol.estimated_value}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {sol.portal_url ? (
                    <a 
                      href={sol.portal_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition underline"
                    >
                      Agency Portal ↗
                    </a>
                  ) : (
                    <span className="text-slate-400">Direct Notice</span>
                  )}

                  {isAlreadyRequested ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-3 py-1.5 rounded-lg font-semibold text-xs">
                      ✓ Funded & Queued
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRequestAssembly(sol)}
                      disabled={submittingId === sol.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-lg shadow-md transition disabled:opacity-50 cursor-pointer"
                    >
                      {submittingId === sol.id ? 'Redirecting...' : 'Request Assembly ($495)'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
