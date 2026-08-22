"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getSavedBids, saveNewBid, BidItem, SupportTicket } from "../bids";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [bids, setBids] = useState<BidItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [agencyFilter, setAgencyFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBid, setSelectedBid] = useState<BidItem | null>(null);
  const [activeTab, setActiveTab] = useState<"pricing" | "sow" | "tickets">("pricing");

  // Pricing Matrix State
  const [laborHours, setLaborHours] = useState(120);
  const [hourlyRate, setHourlyRate] = useState(28);
  const [materialsCost, setMaterialsCost] = useState(1500);
  const [subcontractorCost, setSubcontractorCost] = useState(0);
  const [overheadPercent, setOverheadPercent] = useState(15);
  const [marginPercent, setMarginPercent] = useState(20);

  // Proposal SOW Generator State
  const [contractorName, setContractorName] = useState("Coleman Facilities & Janitorial Solutions LLC");
  const [vendorUei, setVendorUei] = useState("NC89X2KLM451");
  const [vendorCage, setVendorCage] = useState("9K8B2");
  const [naicsCode, setNaicsCode] = useState("561720 (Janitorial Services)");
  const [sowNotes, setSowNotes] = useState("Standard night-shift commercial cleaning, floor sanitization, and waste disposal per RFP requirements.");

  // Reply Support State
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    setBids(getSavedBids());
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "1234") {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const calculateTotals = () => {
    const directLabor = laborHours * hourlyRate;
    const directCosts = directLabor + materialsCost + subcontractorCost;
    const overhead = directCosts * (overheadPercent / 100);
    const subtotal = directCosts + overhead;
    const profit = subtotal * (marginPercent / 100);
    const totalPrice = subtotal + profit;
    return { directLabor, directCosts, overhead, subtotal, profit, totalPrice };
  };

  const totals = calculateTotals();

  const handleUpdateStatus = (newStatus: "Drafting" | "Review" | "Submitted") => {
    if (!selectedBid) return;
    const updated = bids.map((b) => (b.id === selectedBid.id ? { ...b, status: newStatus } : b));
    setBids(updated);
    setSelectedBid({ ...selectedBid, status: newStatus });
    if (typeof window !== "undefined") {
      localStorage.setItem("bidpulse_bids", JSON.stringify(updated));
    }
  };

  const handleResolveTicket = (ticketId: string) => {
    if (!selectedBid) return;
    const updatedTickets = (selectedBid.tickets || []).filter((t) => t.id !== ticketId);
    const updatedBid = { ...selectedBid, tickets: updatedTickets };
    const updatedBids = bids.map((b) => (b.id === selectedBid.id ? updatedBid : b));
    setBids(updatedBids);
    setSelectedBid(updatedBid);
    if (typeof window !== "undefined") {
      localStorage.setItem("bidpulse_bids", JSON.stringify(updatedBids));
    }
  };

  const filteredBids = bids.filter((b) => {
    const matchStatus = statusFilter === "All" || b.status === statusFilter;
    const matchAgency = agencyFilter === "All" || b.agency === agencyFilter;
    const matchSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchAgency && matchSearch;
  });

  const agencies = ["All", ...Array.from(new Set(bids.map((b) => b.agency)))];
  const totalPipeline = bids.reduce((acc, b) => {
    const val = parseInt((b.estimatedValue || "").replace(/[^0-9]/g, ""), 10) || 0;
    return acc + val;
  }, 0);

  const totalInboundTickets = bids.reduce((acc, b) => acc + (b.tickets?.length || 0), 0);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 text-center shadow-2xl">
          <div className="h-12 w-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-emerald-500/20">
            🔒
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black">Operations Command Gate</h1>
            <p className="text-xs text-slate-400">Enter operations security PIN to access the pipeline dashboard.</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input
              type="password"
              placeholder="Enter PIN (Default: 1234)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-center font-mono tracking-widest text-sm focus:outline-none focus:border-emerald-500 text-white"
            />
            {pinError && <p className="text-xs text-red-400 font-medium">Invalid security PIN.</p>}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              Unlock Dashboard →
            </button>
          </form>
          <Link href="/" className="text-[11px] text-slate-500 hover:text-slate-300 block">
            ← Return to Public Portal
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-4 sm:p-8 space-y-6">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
              OPERATIONS INTERNAL
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Pipeline: ${totalPipeline.toLocaleString()} across {bids.length} bids
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Proposal Command & Dispatch</h1>
        </div>

        <div className="flex items-center gap-2">
          {totalInboundTickets > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold">
              <span>⚠️</span>
              <span>{totalInboundTickets} Inbound Addenda/Inquiries</span>
            </div>
          )}
          <Link
            href="/portal"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-xl text-xs transition border border-slate-700"
          >
            Client Portal
          </Link>
          <button
            type="button"
            onClick={() => setIsAuthenticated(false)}
            className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white px-3 py-1.5 rounded-xl text-xs transition border border-slate-800 cursor-pointer"
          >
            Lock Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Master Solicitations Queue */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Controls */}
          <div className="flex flex-wrap gap-2 items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-2xl">
            <input
              type="text"
              placeholder="Search by title, agency, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 w-full sm:w-64"
            />
            <div className="flex items-center gap-1.5 text-xs overflow-x-auto">
              {["All", "Drafting", "Review", "Submitted"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition cursor-pointer ${
                    statusFilter === status
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Active Solicitations Queue ({filteredBids.length})</span>
            </div>
            <div className="divide-y divide-slate-800/60">
              {filteredBids.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">No matching bids found.</div>
              ) : (
                filteredBids.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBid(b)}
                    className={`p-4 hover:bg-slate-800/50 transition cursor-pointer flex items-center justify-between gap-4 ${
                      selectedBid?.id === b.id ? "bg-slate-800/80 border-l-4 border-emerald-500" : ""
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-300">{b.id}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-400">{b.agency}</span>
                        {b.tickets && b.tickets.length > 0 && (
                          <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                            {b.tickets.length} Inquiry
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-white leading-snug">{b.title}</div>
                      <div className="text-xs text-slate-400">
                        Due: <span className="font-mono text-slate-300">{b.dueDate}</span> | Value:{" "}
                        <span className="font-mono text-emerald-400 font-bold">{b.estimatedValue || "TBD"}</span>
                      </div>
                    </div>

                    <div className="text-right space-y-1 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        b.status === "Drafting"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : b.status === "Review"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      }`}>
                        {b.status}
                      </span>
                      <div className="text-xs font-mono font-bold text-emerald-400">{b.fitScore}% Fit</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Inspection & Action Drawer */}
        <div className="lg:col-span-5 space-y-4">
          {selectedBid ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-2xl">
              
              {/* Drawer Header */}
              <div className="border-b border-slate-800 pb-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">{selectedBid.id}</span>
                    <h3 className="text-lg font-black text-white leading-tight">{selectedBid.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBid(null)}
                    className="text-slate-500 hover:text-slate-300 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Stage Controls */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 mr-1">Stage:</span>
                  {(["Drafting", "Review", "Submitted"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(st)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                        selectedBid.status === st
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Tabs inside Inspector */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("pricing")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === "pricing" ? "bg-slate-800 text-emerald-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  💲 Pricing Modeler
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("sow")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    activeTab === "sow" ? "bg-slate-800 text-emerald-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  📄 SOW Proposal
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("tickets")}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "tickets" ? "bg-slate-800 text-amber-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>💬 Addenda & Inquiries</span>
                  {selectedBid.tickets && selectedBid.tickets.length > 0 && (
                    <span className="h-4 w-4 bg-amber-500 text-slate-950 rounded-full text-[10px] flex items-center justify-center font-black">
                      {selectedBid.tickets.length}
                    </span>
                  )}
                </button>
              </div>

              {/* TAB 1: PRICING MODELER */}
              {activeTab === "pricing" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Direct Labor Hours</label>
                      <input
                        type="number"
                        value={laborHours}
                        onChange={(e) => setLaborHours(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Hourly Rate ($/hr)</label>
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Equipment / Materials ($)</label>
                      <input
                        type="number"
                        value={materialsCost}
                        onChange={(e) => setMaterialsCost(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Target Net Margin (%)</label>
                      <input
                        type="number"
                        value={marginPercent}
                        onChange={(e) => setMarginPercent(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  {/* Calculations Output */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Direct Labor Cost:</span>
                      <span className="text-white">${totals.directLabor.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Direct Material / Subs:</span>
                      <span className="text-white">${(materialsCost + subcontractorCost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Overhead ({overheadPercent}%):</span>
                      <span className="text-white">${totals.overhead.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Net Profit ({marginPercent}%):</span>
                      <span className="text-emerald-400 font-bold">+${totals.profit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-slate-800 pt-2 text-white">
                      <span>Target Submittal Price:</span>
                      <span className="text-emerald-400 font-mono font-black">${totals.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SOW PROPOSAL BUILDER */}
              {activeTab === "sow" && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-2">
                    <label className="text-slate-400 block">Prime Contractor Credentials</label>
                    <input
                      type="text"
                      value={contractorName}
                      onChange={(e) => setContractorName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="UEI Number"
                        value={vendorUei}
                        onChange={(e) => setVendorUei(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs"
                      />
                      <input
                        type="text"
                        placeholder="CAGE Code"
                        value={vendorCage}
                        onChange={(e) => setVendorCage(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Scope & Technical Deliverables</label>
                    <textarea
                      rows={4}
                      value={sowNotes}
                      onChange={(e) => setSowNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const sowText = `================================================================================
STATEMENT OF WORK & FORMAL PROPOSAL
================================================================================
SOLICITATION: ${selectedBid.title} (${selectedBid.id})
ISSUING AGENCY: ${selectedBid.agency}
SUBMISSION DEADLINE: ${selectedBid.dueDate}

PRIME CONTRACTOR: ${contractorName}
UEI: ${vendorUei} | CAGE: ${vendorCage} | NAICS: ${naicsCode}
================================================================================

1. EXECUTIVE SUMMARY & TECHNICAL APPROACH
${sowNotes}

2. SCOPE SPECIFICATIONS
${selectedBid.scope || "Daily janitorial, custodial and floor care operations."}

3. PRICING & COST SCHEDULE
Direct Labor:       $${totals.directLabor.toLocaleString()}
Equipment/Supplies: $${(materialsCost + subcontractorCost).toLocaleString()}
Overhead (15%):     $${totals.overhead.toLocaleString()}
Total Bid Price:    $${totals.totalPrice.toLocaleString()}

================================================================================
SEALED AND PREPARED FOR SUBMISSION
================================================================================`;

                      const blob = new Blob([sowText], { type: "text/plain;charset=utf-8;" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `${selectedBid.id}_Official_SOW_Proposal.txt`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                  >
                    📥 Export Complete SOW Document (.txt)
                  </button>
                </div>
              )}

              {/* TAB 3: SUPPORT & ADDENDA INBOX */}
              {activeTab === "tickets" && (
                <div className="space-y-4 text-xs">
                  {selectedBid.tickets && selectedBid.tickets.length > 0 ? (
                    <div className="space-y-3">
                      {selectedBid.tickets.map((t) => (
                        <div key={t.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                              {t.type}
                            </span>
                            <span className="text-slate-500 font-mono text-[10px]">{t.createdAt}</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed text-xs">{t.message}</p>
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => handleResolveTicket(t.id)}
                              className="bg-slate-800 hover:bg-emerald-950 hover:text-emerald-400 text-slate-400 text-[11px] font-bold px-3 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
                            >
                              ✓ Mark Addendum Incorporated
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center text-slate-500 space-y-1">
                      <div>✓</div>
                      <div>No pending addenda or support inquiries for this solicitation.</div>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-500 space-y-2">
              <div className="text-2xl">📋</div>
              <p>Select any solicitation from the queue to inspect pricing, generate SOW packages, or review client addenda.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
