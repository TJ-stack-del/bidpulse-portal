'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';

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

const fallbackSolicitations: Solicitation[] = [
  {
    id: '1',
    trade: 'Commercial Janitorial',
    title: 'Custodial & Day Porter Services for Public Facilities',
    agency: 'Duval County Public Facilities',
    deadline: '16 Days Left',
    ref_number: 'RFP-2026-28',
    estimated_value: '$520,000/year',
  },
  {
    id: '2',
    trade: 'Commercial Janitorial',
    title: 'Multi-Site Clinic Sanitization & Floor Maintenance',
    agency: 'Florida Dept. of Health - Duval',
    deadline: '24 Days Left',
    ref_number: 'DOH-882-7712',
    estimated_value: '$180,000/year',
  },
  {
    id: '3',
    trade: 'HVAC Maintenance',
    title: 'Chiller, Boiler & Comprehensive HVAC Preventative Maintenance',
    agency: 'Jacksonville Public Library System',
    deadline: '12 Days Left',
    ref_number: 'JAX-HVAC-99',
    estimated_value: '$340,000/year',
  },
  {
    id: '4',
    trade: 'Landscaping / Grounds',
    title: 'Citywide Retention Basin Mowing, Grounds Maintenance & Turf Management',
    agency: 'City of Jacksonville - Public Works & Parks',
    deadline: '30 Days Left',
    ref_number: 'PARK-2026-04',
    estimated_value: '$210,000/year',
  },
  {
    id: '5',
    trade: 'Hauling / Waste Removal',
    title: 'On-Call Bulk Debris Removal, Roll-Off Container Hauling & Storm Waste Management',
    agency: 'Duval County Public Works',
    deadline: '18 Days Left',
    ref_number: 'DPW-WASTE-2026',
    estimated_value: '$350,000/year',
  },
  {
    id: '6',
    trade: 'Pressure Washing / Facades',
    title: 'High-Pressure Washing & Concrete Surface Cleaning for Municipal Garages',
    agency: 'Jacksonville Transportation Authority (JTA)',
    deadline: '14 Days Left',
    ref_number: 'JTA-PW-2026',
    estimated_value: '$135,000/year',
  },
];

export default function OpportunitiesPage() {
  const [solicitations, setSolicitations] = useState<Solicitation[]>(fallbackSolicitations);
  const [syncing, setSyncing] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState('All Trades');
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchSolicitations = async () => {
    try {
      const res = await fetch('/api/ingest/rfps');
      if (res.ok) {
        const data = await res.json();
        if (data?.solicitations && data.solicitations.length > 0) {
          setSolicitations(data.solicitations);
        }
      }
    } catch {
      // Retain fallback data if sync fails
    }
  };

  useEffect(() => {
    fetchSolicitations();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setNotification(null);
    try {
      const res = await fetch('/api/ingest/rfps');
      if (res.ok) {
        const data = await res.json();
        if (data?.solicitations) setSolicitations(data.solicitations);
        setNotification({ type: 'success', message: 'Opportunities refreshed successfully.' });
      } else {
        setNotification({ type: 'error', message: 'Unable to update live feeds at this time.' });
      }
    } catch {
      setNotification({ type: 'error', message: 'Network connection issue. Displaying cached solicitations.' });
    } finally {
      setSyncing(false);
    }
  };

  const handleRequestAssembly = async (sol: Solicitation) => {
    setSubmittingId(sol.id);
    setNotification(null);
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
          userEmail: userData?.user?.email || 'contractor@bidpulse.local',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Please sign in or try again.');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Could not initiate assembly request. Please try again.',
      });
    } finally {
      setSubmittingId(null);
    }
  };

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
      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white ml-4">✕</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Active RFP Opportunities</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Live Florida municipal procurement solicitations. Order your turnkey 5-tab binder.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <svg className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {syncing ? 'Syncing Feeds...' : 'Sync Live Feeds'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Trade:</span>
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
              <option value="HVAC Maintenance">HVAC Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((sol) => (
          <div
            key={sol.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {sol.trade}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">{sol.deadline}</span>
              </div>

              <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                {sol.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{sol.agency}</p>
              <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                Est. Value: {sol.estimated_value}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{sol.ref_number}</span>
              <button
                onClick={() => handleRequestAssembly(sol)}
                disabled={submittingId === sol.id}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition cursor-pointer"
              >
                {submittingId === sol.id ? 'Processing...' : 'Request Assembly ($495)'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
