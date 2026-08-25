import React from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  return createClient(supabaseUrl, supabaseKey);
}

export default async function BindersPage() {
  let binders: any[] = [];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('rfp_intakes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        binders = data;
      }
    }
  } catch (err) {
    console.error('Failed to load bids:', err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">My Active Bids</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Track open jobs, review draft progress, and download completed bid packages.
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-semibold text-xs transition shadow-md shadow-blue-600/30"
          >
            + Start New Bid
          </Link>
        </div>

        {binders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {binders.map((item) => (
              <div
                key={item.id}
                className="bg-[#0F172A] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-4 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-slate-400 uppercase text-[10px]">{item.tier || 'Standard Bid'}</span>
                    {/* Contrast Fix: high-contrast emerald tag */}
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      {item.status === 'in_review' ? 'In Review' : (item.status || 'Active')}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white">{item.solicitation_title || 'Untitled Job'}</h3>
                  <p className="text-xs text-slate-400">{item.client_email}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-[#38BDF8] hover:text-sky-300"
                  >
                    View Job &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="h-12 w-12 mx-auto rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/30 flex items-center justify-center text-xl text-[#2563EB]">
              📁
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No active bids yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Once a job is selected, your full proposal package will appear here for download.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-semibold text-xs transition"
            >
              Browse Open Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}