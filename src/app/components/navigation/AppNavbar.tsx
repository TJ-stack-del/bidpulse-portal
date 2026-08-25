'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Browse RFPs', href: '/' },
  { label: 'My Proposal Binders', href: '/binders', role: 'Client' },
  { label: 'Coordinator Intake', href: '/portal/coordinator', role: 'Staff' },
  { label: 'Fulfillment Workspace', href: '/portal/proposals', role: 'Staff' },
];

export default function AppNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#060b18]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-white">
            <span className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              ⚡
            </span>
            <span className="tracking-tight">BidPulse</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.role === 'Staff' && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Ops
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Session Indicators */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] text-slate-300">test2@bidpulse.local</span>
          </div>

          <button
            type="button"
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}