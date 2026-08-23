'use client';

import React, { use } from 'react';

interface PageProps {
  searchParams?: Promise<{ session_id?: string }> | { session_id?: string };
}

export default function IntakeConfirmationPage(props: PageProps) {
  let sessionId = 'Standard';
  if (props.searchParams) {
    // Check if it's a promise or direct object
    const params = typeof (props.searchParams as any).then === 'function' 
      ? use(props.searchParams as Promise<{ session_id?: string }>) 
      : (props.searchParams as { session_id?: string });
    if (params?.session_id) sessionId = params.session_id;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-xl text-center">
        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          ✓
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Proposal Intake Queued</h2>
        <p className="text-slate-400 text-sm mb-6">Your entity details are locked in. Our operations team has initiated the 5-tab binder assembly.</p>
        <div className="bg-slate-950 p-3 rounded text-xs text-slate-400 border border-slate-800 font-mono">
          Ref: {sessionId}
        </div>
      </div>
    </div>
  );
}
