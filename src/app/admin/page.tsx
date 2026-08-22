"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSavedBids, fetchAllBidsFromCloud, addSupportTicket, purgeAllTestData, resetToSampleData, BidItem } from "../bids";
import { getCurrentUser, signOutUser } from "../auth";
import { User } from "@supabase/supabase-js";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [bids, setBids] = useState<BidItem[]>([]);
  const [selectedBidId, setSelectedBidId] = useState<string>("");
  const [ticketType, setTicketType] = useState<"Addendum Upload" | "Timeline Clarification" | "Pricing Adjustment" | "General">("Addendum Upload");
  const [ticketMessage, setTicketMessage] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuthAndLoad() {
      setAuthChecking(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      const cached = getSavedBids();
      if (cached && cached.length > 0) {
        setBids(cached);
        setSelectedBidId(cached[0].id);
      }
      
      const cloud = await fetchAllBidsFromCloud();
      if (cloud && cloud.length > 0) {
        setBids(cloud);
        if (!selectedBidId) setSelectedBidId(cloud[0].id);
      }
      setAuthChecking(false);
    }
    checkAuthAndLoad();
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    router.push("/login");
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBidId || !ticketMessage) return;

    addSupportTicket(selectedBidId, {
      type: ticketType,
      message: ticketMessage
    });

    setTicketMessage("");
    setActionNotice("Support ticket dispatched and recorded.");
    setTimeout(() => setActionNotice(null), 3500);

    const refreshed = getSavedBids();
    setBids(refreshed);
  };

  const handlePurge = () => {
    if (confirm("Are you sure you want to purge all bids and tickets? This clears local & cloud records.")) {
      purgeAllTestData();
      setBids([]);
      setActionNotice("All test data has been purged.");
      setTimeout(() => setActionNotice(null), 3500);
    }
  };

  const handleReset = () => {
    resetToSampleData();
    const refreshed = getSavedBids();
    setBids(refreshed);
    if (refreshed.length > 0) setSelectedBidId(refreshed[0].id);
    setActionNotice("Reset database to standard sample bids.");
    setTimeout(() => setActionNotice(null), 3500);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 text-sm">
        Verifying administrator session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              B
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              BidPulse <span className="text-xs text-rose-500 font-bold uppercase tracking-widest ml-1">Admin</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Home</Link>
            <Link href="/portal" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Workspace</Link>
            {user ? (
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Sign Out ({user.email?.split("@")[0]})
              </button>
            ) : (
              <Link
                href="/login"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Admin Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {!user && (
          <div className="mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 flex items-center justify-between">
            <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
              🔒 You are in guest preview mode. Sign in to lock down administrative changes.
            </span>
            <Link href="/login" className="text-xs font-bold text-blue-600 underline">
              Sign In Now &rarr;
            </Link>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-full">
              Operations Control
            </span>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              System Administration & Tickets
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Dispatch RFP addenda updates, log clarifying tickets, and maintain pipeline integrity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Reset Sample Bids
            </button>
            <button
              onClick={handlePurge}
              className="px-3.5 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm cursor-pointer"
            >
              Purge All Data
            </button>
          </div>
        </div>

        {actionNotice && (
          <div className="mb-6 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            ✓ {actionNotice}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dispatch Ticket Module */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Log Solicitation Ticket / Addendum
            </h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Target Solicitation Record
                </label>
                <select
                  value={selectedBidId}
                  onChange={(e) => setSelectedBidId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium outline-none"
                >
                  {bids.map((b) => (
                    <option key={b.id} value={b.id}>
                      [{b.id}] {b.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Ticket Category
                </label>
                <select
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value as typeof ticketType)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium outline-none"
                >
                  <option value="Addendum Upload">Addendum Upload</option>
                  <option value="Timeline Clarification">Timeline Clarification</option>
                  <option value="Pricing Adjustment">Pricing Adjustment</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Message / Modification Scope
                </label>
                <textarea
                  rows={4}
                  required
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Detail changes from the issuing authority..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
              >
                Log Ticket to Solicitation
              </button>
            </form>
          </div>

          {/* Active Solicitation Audits */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Database Audit Record ({bids.length} Active)
            </h3>
            <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
              {bids.map((b) => (
                <div key={b.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{b.id}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{b.status}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{b.title}</h4>
                  <p className="text-xs text-slate-500">{b.agency} &bull; Due: {b.dueDate}</p>
                  {(b.tickets?.length ?? 0) > 0 && (
                    <div className="mt-2 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      ⚡ {b.tickets?.length} Support / Addenda Tickets Logged
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
