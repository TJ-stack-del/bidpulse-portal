"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getSavedBids, updateBidDetails, addSupportTicket, BidItem } from "../bids";

export default function ClientPortalPage() {
  const [bids, setBids] = useState<BidItem[]>([]);
  const [selectedBid, setSelectedBid] = useState<BidItem | null>(null);

  // Edit Modal State (Stage-Gated)
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editAgency, setEditAgency] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editEstimatedValue, setEditEstimatedValue] = useState("");
  const [editScope, setEditScope] = useState("");

  // Support Dispatch Modal State
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [ticketType, setTicketType] = useState<"Addendum Upload" | "Timeline Clarification" | "Pricing Adjustment" | "General">("Addendum Upload");
  const [ticketMessage, setTicketMessage] = useState("");
  const [supportSuccess, setSupportSuccess] = useState(false);

  useEffect(() => {
    setBids(getSavedBids());
  }, []);

  const handleOpenEdit = (bid: BidItem) => {
    setSelectedBid(bid);
    setEditTitle(bid.title);
    setEditAgency(bid.agency);
    setEditDueDate(bid.dueDate);
    setEditEstimatedValue(bid.estimatedValue || "");
    setEditScope(bid.scope || "");
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBid) return;

    const updates = {
      title: editTitle,
      agency: editAgency,
      dueDate: editDueDate,
      estimatedValue: editEstimatedValue,
      scope: editScope
    };

    updateBidDetails(selectedBid.id, updates);
    const refreshed = getSavedBids();
    setBids(refreshed);
    setSelectedBid({ ...selectedBid, ...updates });
    setIsEditing(false);
  };

  const handleOpenSupport = (bid: BidItem) => {
    setSelectedBid(bid);
    setTicketMessage("");
    setSupportSuccess(false);
    setIsSupportOpen(true);
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBid || !ticketMessage) return;

    addSupportTicket(selectedBid.id, {
      type: ticketType,
      message: ticketMessage
    });

    const refreshed = getSavedBids();
    setBids(refreshed);
    setSelectedBid(refreshed.find((b) => b.id === selectedBid.id) || null);
    setSupportSuccess(true);
    setTimeout(() => {
      setIsSupportOpen(false);
      setSupportSuccess(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Universal Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-extrabold text-slate-900 tracking-tight text-base flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block" />
              BidPulse
            </Link>
            <div className="hidden md:flex items-center gap-5 text-slate-600 font-medium">
              <Link href="/portal" className="text-slate-950 font-bold">My Submittals</Link>
              <Link href="/intake" className="hover:text-slate-950 transition">Send us a bid</Link>
              <Link href="/fit-score" className="hover:text-slate-950 transition">Fit Scorer</Link>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/intake"
              className="bg-slate-950 hover:bg-slate-800 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs transition shadow-sm"
            >
              + Submit New Bid
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* Page Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="text-[10px] font-mono uppercase font-bold text-slate-400">Client Workspace</div>
            <h1 className="text-3xl font-black text-slate-950 tracking-tight mt-0.5">My Bid Submittals</h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Track real-time drafting milestones, edit active drafts, and submit RFP addenda.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/intake"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
            >
              + Submit New RFP
            </Link>
          </div>
        </div>

        {/* Submittals List */}
        {bids.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4">
            <div className="text-3xl">📂</div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No active solicitations logged yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Submit an RFP package to begin scope analysis, margin modeling, and compliance drafting.
              </p>
            </div>
            <Link
              href="/intake"
              className="inline-block bg-slate-950 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm"
            >
              Start First Intake →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => {
              const isEditable = bid.status === "Drafting";
              return (
                <div
                  key={bid.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition space-y-5"
                >
                  {/* Top Row: Meta and Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="font-bold text-slate-900">{bid.id}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">{bid.agency}</span>
                      </div>
                      <h2 className="text-lg font-black text-slate-950 mt-0.5">{bid.title}</h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        bid.status === "Drafting"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : bid.status === "Review"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}>
                        {bid.status === "Drafting" && "Phase 1: Intake & Scope Extraction"}
                        {bid.status === "Review" && "Phase 2: Compliance & Narrative Drafting"}
                        {bid.status === "Submitted" && "Phase 3: Proposal Sealed & Ready"}
                      </span>
                    </div>
                  </div>

                  {/* Middle Row: Progress Stepper */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className={`p-2.5 rounded-xl border ${
                      bid.status === "Drafting" || bid.status === "Review" || bid.status === "Submitted"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}>
                      1. Staged & Scored ({bid.fitScore}%)
                    </div>
                    <div className={`p-2.5 rounded-xl border ${
                      bid.status === "Review" || bid.status === "Submitted"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}>
                      2. SOW Assembly
                    </div>
                    <div className={`p-2.5 rounded-xl border ${
                      bid.status === "Submitted"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}>
                      3. Sealed Package
                    </div>
                  </div>

                  {/* Bottom Row: Metrics & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-6 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-mono block">Target Value</span>
                        <span className="font-bold text-slate-900">{bid.estimatedValue || "TBD"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-mono block">Deadline</span>
                        <span className="font-bold text-slate-900">{bid.dueDate}</span>
                      </div>
                      {bid.tickets && bid.tickets.length > 0 && (
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-mono block">Support Tickets</span>
                          <span className="font-bold text-emerald-700">{bid.tickets.length} Active</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {isEditable ? (
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(bid)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs transition border border-slate-300 cursor-pointer"
                        >
                          ✏️ Edit Submittal
                        </button>
                      ) : (
                        <span
                          title="Proposal narrative is locked in active production. Submit an addendum ticket below for scope updates."
                          className="bg-slate-100 text-slate-400 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-200 cursor-not-allowed flex items-center gap-1"
                        >
                          🔒 Edits Locked
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenSupport(bid)}
                        className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-3.5 py-2 rounded-xl text-xs transition border border-slate-300 cursor-pointer"
                      >
                        💬 RFP Support & Addendum
                      </button>

                      <Link
                        href={`/intake/confirmation?id=${bid.id}`}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition"
                      >
                        View Receipt →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* STAGE-GATED EDIT MODAL */}
      {isEditing && selectedBid && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">{selectedBid.id}</span>
                <h3 className="text-lg font-black text-slate-900">Edit Submittal Parameters</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Agency</label>
                  <input
                    type="text"
                    required
                    value={editAgency}
                    onChange={(e) => setEditAgency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Target Value</label>
                <input
                  type="text"
                  value={editEstimatedValue}
                  onChange={(e) => setEditEstimatedValue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Scope Details</label>
                <textarea
                  rows={3}
                  value={editScope}
                  onChange={(e) => setEditScope(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPPORT & ADDENDUM DISPATCH MODAL */}
      {isSupportOpen && selectedBid && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">{selectedBid.id}</span>
                <h3 className="text-lg font-black text-slate-900">RFP Support & Addendum Desk</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSupportOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {supportSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center text-xs text-emerald-900 font-bold space-y-1">
                <div className="text-lg">✓</div>
                <div>Inquiry Logged Successfully!</div>
                <div className="text-slate-500 font-normal">Our proposal team has been notified.</div>
              </div>
            ) : (
              <form onSubmit={handleSendTicket} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Inquiry Type</label>
                  <select
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-medium"
                  >
                    <option value="Addendum Upload">📄 Addendum / Scope Amendment</option>
                    <option value="Timeline Clarification">⏱️ Timeline Clarification / Expedited Delivery</option>
                    <option value="Pricing Adjustment">💲 Pricing & Margin Guidance</option>
                    <option value="General">💬 General Proposal Question</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Message / Note</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details, paste new addendum text, or describe your timeline inquiry..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                {selectedBid.tickets && selectedBid.tickets.length > 0 && (
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2 max-h-32 overflow-y-auto">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Previous Inquiries</span>
                    {selectedBid.tickets.map((t) => (
                      <div key={t.id} className="text-[11px] border-b border-slate-200/60 pb-1.5 last:border-0 last:pb-0">
                        <span className="font-bold text-slate-800">[{t.type}]</span> <span className="text-slate-500 font-mono text-[10px]">{t.createdAt}</span>
                        <p className="text-slate-600 mt-0.5">{t.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsSupportOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl"
                  >
                    Submit Inquiry →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
