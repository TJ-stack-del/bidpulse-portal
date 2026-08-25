'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabaseClient';

export default function MyProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchProposals() {
      try {
        const { data, error } = await supabase
          .from('proposal_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching proposals:', error);
        } else {
          setProposals(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, [supabase]);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            My Proposal Packets
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Track and monitor the status of your submitted turn-key proposal requests.
          </p>
        </div>
        <a
          href="/portal/intake"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-md transition"
        >
          + New Proposal Request
        </a>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading your proposals...</div>
        ) : proposals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Solicitation Title</th>
                  <th className="p-4">Issuing Agency</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {proposals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4 font-medium text-slate-900 dark:text-white">
                      {item.solicitation_title}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">{item.issuing_agency}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-sm">
            No proposal requests found. Click the button above to compile your first binder!
          </div>
        )}
      </div>
    </div>
  );
}