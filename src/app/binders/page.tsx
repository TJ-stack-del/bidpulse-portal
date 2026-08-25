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
    console.error('Failed to load binders data:', err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">My Proposal Binders</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Active solicitations, compliance milestone tracking, and turnkey deliverables ready for export.
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-semibold text-xs transition shadow-md shadow-blue-600/30"
          >
            + New Proposal Request
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
                    <span className="font-mono text-slate-400 uppercase text-[10px]">{item.tier || 'Turnkey'}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#059669]/10 text-[#059669] border border-[#059669]/20">
                      {item.status || 'In Review'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white">{item.solicitation_title || 'Untitled Solicitation'}</h3>
                  <p className="text-xs text-slate-400">{item.client_email}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                  </span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-[#2563EB] hover:text-blue-400"
                  >
                    View Binder &rarr;
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
              <h3 className="text-base font-bold text-white">No active proposal binders yet</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Once an opportunity is selected and checked out, your completed compliance binder will appear here for download.
              </p>
            </div>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-semibold text-xs transition"
            >
              Browse Open Solicitations
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}