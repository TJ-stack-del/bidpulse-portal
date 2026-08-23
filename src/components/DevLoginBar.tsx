'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function DevLoginBar() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const quickSignIn = async (email: string, targetPath: string, role: string) => {
    setLoadingRole(role);
    setStatusMsg(`Signing in as ${role}...`);

    try {
      // 1. Try Signing In
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: 'TestPassword123!',
      });

      // 2. If user doesn't exist, sign them up automatically
      if (error && (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed'))) {
        setStatusMsg('Creating account on the fly...');
        const signUpRes = await supabase.auth.signUp({
          email,
          password: 'TestPassword123!',
        });

        if (signUpRes.error) {
          throw new Error(signUpRes.error.message);
        }

        // Retry sign in after signup
        const retry = await supabase.auth.signInWithPassword({
          email,
          password: 'TestPassword123!',
        });
        if (retry.error) throw new Error(retry.error.message);
        data = retry.data;
      } else if (error) {
        throw new Error(error.message);
      }

      setStatusMsg('Success! Redirecting...');
      router.push(targetPath);
      router.refresh();
    } catch (err: any) {
      alert(`Login Error: ${err.message}`);
      setStatusMsg(null);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-xl border border-amber-300 bg-amber-50/95 p-3 shadow-lg backdrop-blur-sm text-xs space-y-2">
      <div className="flex items-center justify-between gap-2 font-semibold text-amber-900 border-b border-amber-200 pb-1">
        <span>⚡ Dev Fast-Login</span>
        {statusMsg && <span className="text-[10px] text-amber-700 font-normal">{statusMsg}</span>}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => quickSignIn('admin@test.com', '/admin/opportunities', 'admin')}
          disabled={loadingRole !== null}
          className="rounded-lg bg-amber-600 px-2.5 py-1.5 font-medium text-white shadow-sm hover:bg-amber-700 disabled:opacity-50"
        >
          {loadingRole === 'admin' ? 'Working...' : 'Login as Admin'}
        </button>

        <button
          onClick={() => quickSignIn('contractor@test.com', '/opportunities', 'contractor')}
          disabled={loadingRole !== null}
          className="rounded-lg bg-slate-800 px-2.5 py-1.5 font-medium text-white shadow-sm hover:bg-slate-900 disabled:opacity-50"
        >
          {loadingRole === 'contractor' ? 'Working...' : 'Login as Contractor'}
        </button>
      </div>
    </div>
  );
}
