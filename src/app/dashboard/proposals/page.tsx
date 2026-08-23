'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function MyProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    
    let query = supabase.from('proposal_requests').select('*').order('created_at', { ascending: false });
    if (userData?.user) {
      query = query.eq('user_id', userData.user.id);
    }
    
    const { data } = await query;
    if (data) setProposals(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <div className="max-w-7xl w-full mx-auto p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">My Proposal Packets</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Track your 5-tab turnkey proposal generation, review drafts, and download completed submissions.</p>
        </div>
        <a 
          href="/opportunities"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-md transition"
        >
          + Request New Proposal
        </a>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4">Solicitation / Agency</th>
              <th className="p-4">Status</th>
              <th className="p-4">5-Tab Proposal Packet</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {loading ? (
              <tr><td colSpan={4} className="p-6 text-center text-slate-400">Loading your proposal packets...</td></tr>
            ) : proposals.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  You haven't requested any proposal binders yet. 
                  <div className="mt-2">
                    <a href="/opportunities" className="text-blue-500 font-semibold hover:underline">Explore Active RFP Solicitations</a>
                  </div>
                </td>
              </tr>
            ) : (
              proposals.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{item.solicitation_title || 'Commercial Bid Packet'}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.issuing_agency || 'Municipal Agency'}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'Delivered' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                    }`}>
                      {item.status || 'Requested'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <a 
                        href={`/api/proposals/download?id=${item.id}&inline=true`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      >
                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview PDF ↗
                      </a>
                      <a 
                        href={`/api/proposals/download?id=${item.id}`}
                        className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                      </a>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="text-xs text-slate-400">Ready</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
