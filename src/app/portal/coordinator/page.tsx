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
    console.error('Failed to load coordinator queue:', err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-mono uppercase font-bold mb-2">
              Operations Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Coordinator Ingestion Queue</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review incoming client intakes, verify document attachments, and assign to writer fulfillment.
            </p>
          </div>
          <Link
            href="/portal/proposals"
            className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 border border-slate-800 text-xs font-semibold transition"
          >
            Open Fulfillment Workspace &rarr;
          </Link>
        </div>

        {queueItems.length > 0 ? (
          <div className="bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Client / Ingestion ID</th>
                    <th className="px-6 py-4">Solicitation Target</th>
                    <th className="px-6 py-4">Package Tier</th>
                    <th className="px-6 py-4">Intake Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {queueItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{item.client_email}</div>
                        <div className="font-mono text-[10px] text-slate-500 truncate max-w-[140px]">{item.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-200">{item.solicitation_title || 'Pending Ingestion'}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {item.created_at ? new Date(item.created_at).toLocaleString() : 'Recent'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono uppercase text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {item.tier || 'Standard'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {item.status || 'in_review'}
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
              <h3 className="text-base font-bold text-white">Ingestion Queue is Empty</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No paid proposal requests are currently awaiting coordinator assignment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}