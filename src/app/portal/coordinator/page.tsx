import React from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  return createClient(supabaseUrl, supabaseKey);
}

export default async function CoordinatorPage() {
  let queueItems: any[] = [];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('rfp_intakes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        queueItems = data;
      }
    }
  } catch (err) {
    console.error('Failed to load job queue:', err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#2563EB]/10 text-blue-400 text-[10px] font-mono uppercase font-bold mb-2">
              Operations Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Job & Upload Queue</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review new client uploads, verify bid specifications, and assign team writers.
            </p>
          </div>
          <Link
            href="/portal/proposals"
            className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 border border-slate-800 text-xs font-semibold transition"
          >
            Open Bid Workspace &rarr;
          </Link>
        </div>

        {queueItems.length > 0 ? (
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-300 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Client / Upload ID</th>
                    <th className="px-6 py-4">Target Job</th>
                    <th className="px-6 py-4">Package</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {queueItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{item.client_email}</div>
                        <div className="font-mono text-[10px] text-slate-400 truncate max-w-[140px]">{item.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-100">{item.solicitation_title || 'New Job Upload'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.created_at ? new Date(item.created_at).toLocaleString() : 'Recent'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono uppercase text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200">
                          {item.tier || 'Standard'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {/* High-Contrast Status Pill */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/90 text-amber-300 border border-amber-400/40">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                          {item.status === 'in_review' ? 'In Review' : (item.status || 'Active')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/portal/proposals`}
                          className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-500 text-white font-semibold text-[11px] transition shadow-sm"
                        >
                          Assign & Draft
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="h-12 w-12 mx-auto rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/30 flex items-center justify-center text-xl text-[#2563EB]">
              📥
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Upload Queue is Empty</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No new client bid requests are currently awaiting assignment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}