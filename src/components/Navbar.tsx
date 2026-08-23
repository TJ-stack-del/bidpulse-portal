'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system setting
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        if (profile?.is_admin) setIsAdmin(true);
      }
    }
    checkUser();
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (pathname === '/login') return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-8">
          <Link href="/opportunities" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-base">B</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">BidPulse</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link href="/opportunities" className={`${pathname === '/opportunities' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>
              RFP Opportunities
            </Link>
            <Link href="/dashboard/requests" className={`${pathname === '/dashboard/requests' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}>
              My Proposals
            </Link>
            {isAdmin && (
              <>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="text-xs uppercase font-bold text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">Admin</span>
                <Link href="/admin/opportunities" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Manage RFPs</Link>
                <Link href="/admin/requests" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Fulfillment</Link>
              </>
            )}
          </nav>
        </div>
        
        {/* Actions (Theme Toggle & Sign Out) */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          {userEmail && <span className="hidden sm:inline-block text-xs font-medium text-slate-500 dark:text-slate-400">{userEmail}</span>}
          <button onClick={handleSignOut} className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
