'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  section: 'workflow' | 'profile';
}

const NAV_ITEMS: NavItem[] = [
  // Core Workflow
  { label: 'Browse RFPs', href: '/', icon: '🔍', section: 'workflow' },
  { label: 'My Proposal Binders', href: '/binders', icon: '📁', section: 'workflow' },
  { label: 'Coordinator Intake', href: '/portal/coordinator', icon: '📥', badge: 'Ops', section: 'workflow' },
  { label: 'Fulfillment Workspace', href: '/portal/proposals', icon: '⚡', badge: 'Ops', section: 'workflow' },

  // Profile & Workspace Tools
  { label: 'Company Profile & NAICS', href: '/profile', icon: '🏢', section: 'profile' },
  { label: 'Past Performance Vault', href: '/profile/vault', icon: '🛡️', section: 'profile' },
  { label: 'Billing & Plan Access', href: '/profile/billing', icon: '💳', section: 'profile' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  
  // Simulated authenticated user check (replace with your supabase session hook if dynamic)
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Slide-out Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-[#070d1d] border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand & Toggle Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <span className="h-9 w-9 shrink-0 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
              ⚡
            </span>
            {isOpen && (
              <div className="flex flex-col">
                <span className="font-bold text-slate-100 text-sm tracking-tight">BidPulse</span>
                <span className="text-[10px] text-cyan-400 font-mono">Workspace Suite</span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition hidden lg:flex items-center justify-center"
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Pipeline Navigation */}
          <div className="space-y-1">
            {isOpen && (
              <span className="px-3 text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Pipeline
              </span>
            )}
            {NAV_ITEMS.filter((i) => i.section === 'workflow').map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <span className="text-base shrink-0">{item.icon}</span>
                  {isOpen && (
                    <div className="flex items-center justify-between w-full truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Profile & Business Tools */}
          <div className="space-y-1">
            {isOpen && (
              <span className="px-3 text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                Profile & Assets
              </span>
            )}
            {NAV_ITEMS.filter((i) => i.section === 'profile').map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <span className="text-base shrink-0">{item.icon}</span>
                  {isOpen && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Status & Sign Out Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <div className="h-7 w-7 shrink-0 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-bold">
              U
            </div>
            {isOpen && (
              <div className="flex flex-col truncate flex-1">
                <span className="text-xs font-medium text-slate-200 truncate">
                  test2@bidpulse.local
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Active Session
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            className={`w-full mt-2 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent transition`}
            title={!isOpen ? 'Sign Out' : undefined}
          >
            <span>🚪</span>
            {isOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}