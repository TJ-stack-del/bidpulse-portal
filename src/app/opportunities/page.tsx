'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

interface Solicitation {
  id: string;
  trade: string;
  title: string;
  agency: string;
  deadline: string;
  ref_number: string;
  estimated_value: string;
}

const fallbackSolicitations: Solicitation[] = [
  {
    id: '1',
    trade: 'Commercial Janitorial',
    title: 'District-Wide Custodial, Floor Waxing & Environmental Sanitization',
    agency: 'Duval County Public Schools (DCPS)',
    deadline: '7 Days Left',
    ref_number: 'DCPS-ITB-014-26',
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

function OpportunitiesContent() {
  const [solicitations, setSolicitations] = useState<Solicitation[]>(fallbackSolicitations);
  const [selectedTrade, setSelectedTrade] = useState('All Trades');
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [requestedKeys, setRequestedKeys] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const searchParams = useSearchParams();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let saved: string[] = [];
    try {
      const stored = localStorage.getItem('bidpulse_requested_assemblies');
      if (stored) {
        saved = JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    // Check if returned from Stripe with an ordered parameter
    const orderedParam = searchParams?.get('ordered');
    const sessionId = searchParams?.get('session_id');

    if (orderedParam) {
      saved = Array.from(new Set([...saved, orderedParam.toLowerCase().trim()]));
      setNotification({
        type: 'success',
        message: `Proposal assembly request confirmed for "${orderedParam}". Our team is preparing your 5-tab binder.`,
      });
    }

    if (sessionId && !orderedParam) {
      setNotification({
        type: 'success',
        message: 'Payment received! Your proposal assembly is now in progress.',
      });
    }

    if (searchParams?.get('canceled')) {
      setNotification({
        type: 'error',
        message: 'Assembly request was canceled. You have not been charged.',
      });
    }

    setRequestedKeys(saved);
    try {
      localStorage.setItem('bidpulse_requested_assemblies', JSON.stringify(saved));
    } catch {
      // ignore
    }
  }, [searchParams]);

  const handleRequestAssembly = async (sol: Solicitation) => {
    setSubmittingId(sol.id);
    setNotification(null);
    try {
      const { data: userData } = await supabase.auth.getUser();

      // Persist across id, title, and ref_number
      const newKeys = Array.from(new Set([
        ...requestedKeys,
        sol.id.toLowerCase().trim(),
        sol.ref_number.toLowerCase().trim(),
        sol.title.toLowerCase().trim(),
      ]));
      setRequestedKeys(newKeys);
      try {
        localStorage.setItem('bidpulse_requested_assemblies', JSON.stringify(newKeys));
      } catch {
        // ignore
      }

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

  const isSolicitationRequested = (sol: Solicitation) => {
    const titleKey = sol.title.toLowerCase().trim();
    const idKey = sol.id.toLowerCase().trim();
    const refKey = sol.ref_number.toLowerCase().trim();

    return (
      requestedKeys.includes(titleKey) ||
      requestedKeys.includes(idKey) ||
      requestedKeys.includes(refKey) ||
      requestedKeys.some((k) => titleKey.includes(k) || k.includes(titleKey))
    );
  };

  const filtered = solicitations.filter((sol) => {
    if (selectedTrade === 'All Trades') return true;
    const solTrade = (sol.trade || '').toLowerCase();
    return solTrade.includes(selectedTrade.toLowerCase());
  });

  const trades = [
    'All Trades',
    'Commercial Janitorial',
    'HVAC Maintenance',
    'Landscaping / Grounds',
    'Hauling / Waste Removal',
    'Pressure Washing / Facades',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Live Procurement Feed
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Municipal Bid Opportunities
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Verified Florida public works and institutional solicitations with turnkey 5-tab proposal assembly.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/portal"
              className="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700"
            >
              Workspace Pipeline
            </Link>
          </div>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div
            className={`p-4 rounded-lg text-sm border flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-xs underline hover:opacity-80 ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Trade Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {trades.map((trade) => (
            <button
              key={trade}
              onClick={() => setSelectedTrade(trade)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                selectedTrade === trade
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {trade}
            </button>
          ))}
        </div>

        {/* Solicitations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((sol) => {
            const isRequested = isSolicitationRequested(sol);
            const isSubmitting = submittingId === sol.id;

            return (
              <div
                key={sol.id}
                className="flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-6 transition group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-800 text-blue-400 border border-slate-700">
                      {sol.trade.replace(/[\s/]/g, '_').toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {sol.deadline}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-300 transition line-clamp-2">
                      {sol.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">{sol.agency}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Ref #{sol.ref_number}</p>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs font-semibold text-emerald-400">
                      Est. Value: <span className="font-bold">{sol.estimated_value}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-end">
                  {isRequested ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      ✓ Assembly In Progress
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRequestAssembly(sol)}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 active:scale-95 text-white transition shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Connecting...' : 'Request Assembly ($495)'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-sm">Loading opportunities...</div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
