'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';

export const Navbar = ({ userEmail = 'michael@test.com', isAdmin = true }: { userEmail?: string; isAdmin?: boolean }) => {
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Desktop Navigation */}
        <div className="flex items-center gap-8">
          <BrandLogo />
          
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <Link href="/opportunities" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
              RFP Opportunities
            </Link>
            <Link href="/dashboard/proposals" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
              My Proposals
            </Link>

            {isAdmin && (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                <span className="bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  Admin
                </span>
                <Link href="/admin/opportunities" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition text-xs font-semibold">
                  Manage RFPs
                </Link>
                <Link href="/admin/fulfillment" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition text-xs font-semibold">
                  Fulfillment
                </Link>
                <Link href="/admin/users" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition text-xs font-semibold">
                  Manage Users
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Right Actions & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
          >
            {isDark ? (
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User Badge (hidden on smallest screens to preserve layout) */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full text-slate-700 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono">{userEmail}</span>
          </div>

          <button className="hidden sm:inline-block bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 px-3 py-1.5 rounded transition font-medium">
            Sign Out
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open Navigation Menu"
            className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 focus:outline-none"
          >
            {mobileMenuOpen ? (
              // Close Icon (X)
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger Icon
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-5 space-y-3 shadow-2xl">
          {/* User Account Info on Mobile */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono">{userEmail}</span>
            </div>
            <button className="text-rose-500 font-semibold hover:underline">
              Sign Out
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-2 py-1">
              General
            </div>
            <Link
              href="/opportunities"
              onClick={closeMenu}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            >
              RFP Opportunities
            </Link>
            <Link
              href="/dashboard/proposals"
              onClick={closeMenu}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
            >
              My Proposals
            </Link>
          </div>

          {isAdmin && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 px-2 py-1">
                <span className="bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider">
                  Admin
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Operations
                </span>
              </div>
              <Link
                href="/admin/opportunities"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              >
                Manage RFPs
              </Link>
              <Link
                href="/admin/fulfillment"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              >
                Fulfillment Queue
              </Link>
              <Link
                href="/admin/users"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              >
                Manage Users
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
