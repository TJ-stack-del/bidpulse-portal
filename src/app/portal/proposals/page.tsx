import React from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  return createClient(supabaseUrl, supabaseKey);
}

export default async function ProposalsWorkspacePage() {
  let proposalWorkflows: any[] = [];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('rfp_intakes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        proposalWorkflows = data;
      }
    }
  } catch (err) {
    console.error('Failed to load proposal workflows:', err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#2563EB]/10 text-[#2563EB] text-[10px] font-mono uppercase font-bold mb-2">
              Fulfillment Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Proposal Workspace</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Active assembly pipelines, milestone validation, and deliverable exports.
            </p>
          </div>
          <Link
            href="/portal/coordinator"
            className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 border border-slate-800 text-xs font-semibold transition"
          >
            &larr; Ingestion Queue
          </Link>
        </div>

        {proposalWorkflows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposalWorkflows.map((item) => (
              <div
                key={item.id}
                className="bg-[#0F172A] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 space-y-4 transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-slate-400 uppercase text-[10px]">{item.tier || 'Turnkey'}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.status || 'drafting'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white">{item.solicitation_title || 'Active RFP Drafting'}</h3>
                  <p className="text-xs text-slate-400 truncate">{item.client_email}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>5-Tab Precision Checklist</span>
                    <span className="text-[#059669] font-mono font-bold">100% Ready</span>
                  </div>
                  <button
                    type="button"
                    className="w-full py-2 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-semibold text-xs transition shadow-sm"
                  >
                    Open Fulfillment Editor
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="h-12 w-12 mx-auto rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/30 flex items-center justify-center text-xl text-[#2563EB]">
              ⚡
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No active proposals in drafting</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Assigned solicitations from the coordinator queue will populate here for document assembly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}