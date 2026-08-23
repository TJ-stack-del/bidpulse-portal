'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Solicitation {
  id: string;
  title: string;
  agency: string;
  trade: string;
  deadline: string;
  ref_number: string;
  estimated_value: string;
}

const mockSolicitations: Solicitation[] = [
  {
    id: 'sol-1',
    title: 'Citywide Turnkey Janitorial & Daily Custodial Services for Municipal Facilities',
    agency: 'City of Jacksonville / Duval County Public Facilities',
    trade: 'Commercial Janitorial',
    deadline: '10/10/2026',
    ref_number: 'RFP-0132-26',
    estimated_value: '$285,000 / yr'
  },
  {
    id: 'sol-2',
    title: 'High-Pressure Washing & Concrete Surface Cleaning for Municipal Garages & Skyway Stations',
    agency: 'Jacksonville Transportation Authority (JTA)',
    trade: 'Pressure Washing / Facades',
    deadline: '10/15/2026',
    ref_number: 'JTA-RFP-25-0044',
    estimated_value: '$155,000 / year'
  },
  {
    id: 'sol-3',
    title: 'Citywide Retention Basin Mowing, Grounds Maintenance & Turf Management',
    agency: 'City of Jacksonville - Public Works & Parks',
    trade: 'Landscaping / Grounds',
    deadline: '10/18/2026',
    ref_number: 'RFP-LND-0312-26',
    estimated_value: '$440,000 / year'
  },
  {
    id: 'sol-4',
    title: 'District-Wide Turnkey Custodial & Sanitization Services for Region 2 Schools',
    agency: 'Duval County Public Schools (DCPS) - Purchasing Services',
    trade: 'Commercial Janitorial',
    deadline: '10/15/2026',
    ref_number: 'RFP-0245-26',
    estimated_value: '$520,000 / year'
  },
  {
    id: 'sol-5',
    title: 'Comprehensive Custodial, Floor Care & Day Porter Services for Duval County Public Schools',
    agency: 'Duval County Public Schools (DCPS) - Purchasing Services',
    trade: 'Commercial Janitorial',
    deadline: '10/15/2026',
    ref_number: 'RFP-0245-26',
    estimated_value: '$520,000 / yr'
  },
  {
    id: 'sol-6',
    title: 'On-Call Bulk Debris Removal, Roll-Off Container Hauling & Storm Waste Management',
    agency: 'Duval County Public Works',
    trade: 'Hauling / Waste Removal',
    deadline: '10/18/2026',
    ref_number: 'RFP-WST-2210-26',
    estimated_value: '$350,000 / year'
  }
];

export default function OpportunitiesPage() {
  const router = useRouter();
  const [selectedTrade, setSelectedTrade] = useState('All Trades');
  const [requestedTitles, setRequestedTitles] = useState<string[]>([]);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  // Load existing requests for the logged in user
  const loadExistingRequests = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from('proposal_requests')
      .select('solicitation_title')
      .eq('user_id', userData.user.id);

    if (data) {
      setRequestedTitles(data.map(d => d.solicitation_title));
    }
  };

  useEffect(() => {
    loadExistingRequests();
  }, []);

  const handleRequestAssembly = async (sol: Solicitation) => {
    setSubmittingId(sol.id);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const userId = userData?.user?.id || '00000000-0000-0000-0000-000000000000';
      const userEmail = userData?.user?.email || 'contractor@bidpulse.local';

      const payload = {
        metadata: {
          solicitationTitle: sol.title,
          issuingAgency: sol.agency,
          trade: sol.trade,
          refNumber: sol.ref_number,
          estValue: sol.estimated_value
        },
        contractor: {
          legalName: userData?.user?.user_metadata?.company_name || 'First Coast Grounds LLC',
          email: userEmail
        }
      };

      const { error } = await supabase
        .from('proposal_requests')
        .insert({
          user_id: userId,
          solicitation_title: sol.title,
          issuing_agency: sol.agency,
          status: 'Requested',
          current_step_index: 0,
          raw_payload: payload
        });

      if (error) throw error;

      setRequestedTitles(prev => [...prev, sol.title]);
      router.push('/dashboard/proposals');
    } catch (err: any) {
      alert(`Request notice: ${err.message}`);
    } finally {
      setSubmittingId(null);
    }
  };

  const filtered = selectedTrade === 'All Trades' 
    ? mockSolicitations 
    : mockSolicitations.filter(s => s.trade === selectedTrade);

  return (
    <div className="max-w-7xl w-full mx-auto p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Active RFP Opportunities</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Verified municipal solicitations. Select any opportunity to request a turnkey proposal binder.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-slate-400">Trade Filter:</span>
          <select 
            value={selectedTrade}
            onChange={(e) => setSelectedTrade(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="All Trades">All Trades</option>
            <option value="Commercial Janitorial">Commercial Janitorial</option>
            <option value="Pressure Washing / Facades">Pressure Washing</option>
            <option value="Landscaping / Grounds">Landscaping / Grounds</option>
            <option value="Hauling / Waste Removal">Hauling / Waste</option>
          </select>
        </div>
      </div>

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
                  {sol.agency} · Ref: {sol.ref_number}
                </p>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-mono mb-4">
                  Est. Value: <span className="font-semibold text-slate-900 dark:text-slate-100">{sol.estimated_value}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
                  Agency Portal
                </button>

                {isAlreadyRequested ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-3 py-1.5 rounded-lg font-semibold text-xs">
                    ✓ Requested
                  </span>
                ) : (
                  <button
                    onClick={() => handleRequestAssembly(sol)}
                    disabled={submittingId === sol.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-lg shadow-md transition disabled:opacity-50"
                  >
                    {submittingId === sol.id ? 'Ordering...' : 'Request Assembly ($495)'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
