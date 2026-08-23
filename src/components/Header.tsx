'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('client');

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        const { data: prof } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        if (prof?.role) setUserRole(prof.role);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base">
              B
            </div>
            <span className="font-bold text-white tracking-tight text-lg">BidPulse</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-300">
            <Link href="/opportunities" className={`hover:text-white transition ${pathname === '/opportunities' ? 'text-blue-400 font-semibold' : ''}`}>
              RFP Opportunities
            </Link>
            <Link href="/dashboard/proposals" className={`hover:text-white transition ${pathname.includes('/proposals') ? 'text-blue-400 font-semibold' : ''}`}>
              My Proposals
            </Link>
            <Link href="/dashboard/profile" className={`hover:text-white transition ${pathname.includes('/profile') ? 'text-blue-400 font-semibold' : ''}`}>
              Entity Profile
            </Link>
            {userRole === 'admin' && (
              <div className="flex items-center gap-4 pl-3 border-l border-slate-800">
                <Link href="/admin/fulfillment" className={`text-slate-400 hover:text-white transition ${pathname.includes('/admin/fulfillment') ? 'text-amber-400 font-semibold' : ''}`}>
                  Fulfillment
                </Link>
                <Link href="/admin/users" className={`text-slate-400 hover:text-white transition ${pathname.includes('/admin/users') ? 'text-amber-400 font-semibold' : ''}`}>
                  Manage Users
                </Link>
              </div>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">{user.email}</span>
              <button 
                onClick={handleSignOut}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-lg transition shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
