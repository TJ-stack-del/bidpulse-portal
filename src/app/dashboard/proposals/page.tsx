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
          href="/intake"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-md transition"
        >
          + New Proposal Request
        </a>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4">Solicitation / Agency</th>
              <th className="p-4">Submission Status</th>
              <th className="p-4">Turnkey Deliverable</th>
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
                    <a href="/intake" className="text-blue-500 font-semibold hover:underline">Click here to start an intake packet</a>
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
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs">
                    {item.binder_url ? (
                      <a 
                        href={item.binder_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                      >
                        Download 5-Tab Binder (PDF) ↗
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Compiling tabs 1-5...</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white transition">
                      View Details
                    </button>
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
