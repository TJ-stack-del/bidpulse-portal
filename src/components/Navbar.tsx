'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useTheme } from './ThemeProvider';

const ADMIN_EMAILS = ['admin@bidpulse.com'];

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/login';
  };

  const isActive = (path: string) => pathname === path;
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  return (
    <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-8">
          {/* Brand Logo with Shield Icon */}
          <Link className="flex items-center gap-2.5 h-8" href="/">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto text-blue-500 shrink-0">
              <path d="M50 8L88 22V50C88 74 50 92 50 92C50 92 12 74 12 50V22L50 8Z" stroke="#2563EB" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" className="stroke-blue-500 fill-blue-950/20"></path>
              <path d="M20 50H36L44 32L54 68L64 42L72 50H80" stroke="#38BDF8" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="font-extrabold tracking-tight text-xl text-slate-900 dark:text-white font-sans">
              Bid<span className="text-blue-500">Pulse</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/opportunities"
              className={`px-3 py-1.5 rounded-lg transition text-xs font-semibold ${
                isActive('/opportunities')
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              Browse RFPs
            </Link>

            {!loading && user && (
              <Link
                href="/dashboard/proposals"
                className={`px-3 py-1.5 rounded-lg transition text-xs font-semibold ${
                  isActive('/dashboard/proposals')
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                My Proposal Binders
              </Link>
            )}

            {!loading && isAdmin && (
              <div className="flex items-center gap-1 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mr-1">
                  Admin
                </span>
                <Link
                  href="/admin/opportunities"
                  className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  RFPs
                </Link>
                <Link
                  href="/admin/fulfillment"
                  className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Fulfillment
                </Link>
                <Link
                  href="/admin/users"
                  className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Users
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Right Section: Theme Toggle & Auth */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer border border-slate-200 dark:border-slate-800"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {!loading && user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full text-xs text-slate-700 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-mono text-[11px] truncate max-w-[160px]">{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : !loading && !user ? (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 transition"
            >
              Sign In
            </Link>
          ) : (
            <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          )}
        </div>

      </div>
    </header>
  );
}
