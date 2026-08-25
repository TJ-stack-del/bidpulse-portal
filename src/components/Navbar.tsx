'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BidPulseLogo, BidPulseIcon, BPMonogram } from '@/components/brand/BidPulseLogo';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  group: 'pipeline' | 'profile';
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Browse Solicitations', href: '/', icon: '🔍', group: 'pipeline' },
  { label: 'My Proposal Binders', href: '/binders', icon: '📁', group: 'pipeline' },
  { label: 'Coordinator Ingestion', href: '/portal/coordinator', icon: '📥', badge: 'Ops', group: 'pipeline' },
  { label: 'Fulfillment Workspace', href: '/portal/proposals', icon: '⚡', badge: 'Ops', group: 'pipeline' },
  { label: 'Company Profile & NAICS', href: '/profile', icon: '🏢', group: 'profile' },
  { label: 'Past Performance Vault', href: '/profile/vault', icon: '🛡️', group: 'profile' },
  { label: 'Billing & Subscriptions', href: '/profile/billing', icon: '💳', group: 'profile' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#060b18]/90 backdrop-blur-md px-4 sm:px-8">
        <div className="w-full h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="px-3 py-1.5 rounded-lg text-slate-200 hover:text-white bg-[#0F172A] border border-slate-800 hover:border-[#2563EB]/50 transition flex items-center gap-2 text-xs font-medium"
              >
                <span className="text-sm leading-none">☰</span>
                <span>Workspace</span>
              </button>
            )}

            <Link href="/" className="flex items-center">
              <BidPulseLogo size={28} textSize="text-xl" />
            </Link>
          </div>

          {!isLoggedIn && (
            <button
              type="button"
              onClick={() => setIsLoggedIn(true)}
              className="text-xs px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-500 text-white font-semibold transition shadow-md shadow-blue-600/20"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Slide-out Drawer */}
      {drawerOpen && isLoggedIn && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-[#070d1d] border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          drawerOpen && isLoggedIn ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BPMonogram size={32} />
            <div className="flex flex-col">
              <span className="font-bold text-slate-100 text-xs tracking-tight">BidPulse Suite</span>
              <span className="text-[10px] text-[#2563EB] font-mono">Precision Bidding</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="h-7 w-7 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div className="space-y-1">
            <span className="px-3 text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              Workflow & Fulfillment
            </span>
            {NAV_ITEMS.filter((i) => i.group === 'pipeline').map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-sm shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0F172A] text-[#2563EB] border border-[#2563EB]/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="space-y-1">
            <span className="px-3 text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              Company Assets & Tools
            </span>
            {NAV_ITEMS.filter((i) => i.group === 'profile').map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <span className="text-sm shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0F172A] border border-slate-800">
            <div className="h-7 w-7 rounded-full bg-[#2563EB]/20 text-[#2563EB] border border-[#2563EB]/30 flex items-center justify-center text-xs font-bold shrink-0">
              U
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-medium text-slate-200 truncate">test2@bidpulse.local</span>
              <span className="text-[10px] text-[#059669] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" /> Compliance Verified
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsLoggedIn(false);
              setDrawerOpen(false);
            }}
            className="w-full py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg border border-slate-800/60 transition"
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}