"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedBids, BidItem } from "../bids";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [bids, setBids] = useState<BidItem[]>([]);
  const [selectedBid, setSelectedBid] = useState<BidItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAgencyFilter, setSelectedAgencyFilter] = useState<string>("All");
  const [activeModalTab, setActiveModalTab] = useState<"overview" | "pricing" | "scaffolding">("overview");
  const [copied, setCopied] = useState(false);

  // Financial Modeling State
  const [laborPct, setLaborPct] = useState<number>(60);
  const [supplyPct, setSupplyPct] = useState<number>(12);
  const [marginPct, setMarginPct] = useState<number>(15);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("bidpulse_admin_auth");
    if (authStatus === "granted") {
      setIsAuthenticated(true);
    }
    setBids(getSavedBids());
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || "1234";
    if (pinInput === correctPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem("bidpulse_admin_auth", "granted");
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const handleLockSession = () => {
    sessionStorage.removeItem("bidpulse_admin_auth");
    setIsAuthenticated(false);
    setPinInput("");
  };

  const handleStatusChange = (bidId: string, newStatus: BidItem["status"]) => {
    const updated = bids.map((b) => (b.id === bidId ? { ...b, status: newStatus } : b));
    setBids(updated);
    localStorage.setItem("bidpulse_bids", JSON.stringify(updated));
    if (selectedBid?.id === bidId) {
      setSelectedBid({ ...selectedBid, status: newStatus });
    }
  };

  const handleClear = () => {
    if (confirm("Reset queue to sample proposals?")) {
      localStorage.removeItem("bidpulse_bids");
      setBids(getSavedBids());
      setSelectedBid(null);
    }
  };

  const agencyCounts = bids.reduce((acc, bid) => {
    acc[bid.agency] = (acc[bid.agency] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalPipelineCapital = bids.reduce((acc, bid) => {
    const num = parseInt((bid.estimatedValue || "").replace(/[^0-9]/g, ""), 10) || 0;
    return acc + num;
  }, 0);

  const targetValNum = selectedBid
    ? parseInt((selectedBid.estimatedValue || "").replace(/[^0-9]/g, ""), 10) || 0
    : 0;

  const laborDollar = Math.round(targetValNum * (laborPct / 100));
  const supplyDollar = Math.round(targetValNum * (supplyPct / 100));
  const marginDollar = Math.round(targetValNum * (marginPct / 100));
  const overheadDollar = Math.max(0, targetValNum - (laborDollar + supplyDollar + marginDollar));
  const overheadPct = targetValNum > 0 ? Math.round((overheadDollar / targetValNum) * 100) : 13;

  const handleExportCSV = () => {
    const headers = ["RFP ID", "Project Title", "Issuing Agency", "Target Value", "Fit Score", "Due Date", "Status", "Scope Summary"];
    const rows = bids.map((b) => [
      `"${b.id}"`,
      `"${(b.title || "").replace(/"/g, '""')}"`,
      `"${(b.agency || "").replace(/"/g, '""')}"`,
      `"${(b.estimatedValue || "TBD").replace(/"/g, '""')}"`,
      `"${b.fitScore}%"`,
      `"${b.dueDate}"`,
      `"${b.status}"`,
      `"${(b.scope || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bidpulse_proposals_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateScaffolding = (bid: BidItem): string => {
    return `================================================================================
BID PROPOSAL SCAFFOLDING & DRAFT OUTLINE
================================================================================
PROJECT / RFP ID:    ${bid.id}
SOLICITATION TITLE:  ${bid.title}
ISSUING AGENCY:      ${bid.agency}
SUBMISSION DEADLINE: ${bid.dueDate}
TARGET CONTRACT VAL: ${bid.estimatedValue || "To Be Finalized"}
FIT-SCORE VIABILITY: ${bid.fitScore}%
================================================================================

1. EXECUTIVE SUMMARY & STATEMENT OF UNDERSTANDING
--------------------------------------------------------------------------------
1.1 Executive Overview:
    [Company Name] is pleased to present this comprehensive proposal in direct response 
    to the solicitation issued by ${bid.agency} for "${bid.title}". Our team brings 
    proven operational capability, stringent compliance, and qualified personnel.

1.2 Scope Comprehension:
    Scope Overview: ${bid.scope || "Full scope execution in accordance with municipal/commercial RFP specifications."}

1.3 Value Proposition:
    - Zero-disruption operational transitions.
    - Verified quality control protocols and supervisor auditing.
    - Full alignment with local administrative and safety compliances.

2. TECHNICAL APPROACH & METHODOLOGY
--------------------------------------------------------------------------------
2.1 Execution Framework:
    - Phase I: Rapid Onboarding & Site Audit (Days 1–15)
    - Phase II: Full Operational Deployment & Baseline Service Delivery (Days 16+)
    - Phase III: Continuous Quality Assurance & Periodic Deep-Clean Cycles

2.2 Core Deliverables & Task Matrix:
    - Routine Service Cycles: Daily, weekly, and quarterly task distribution.
    - Chemical, Material & Equipment Management: Commercial-grade tooling and eco-friendly standards.
    - Emergency Response: Rapid deployment readiness for unscheduled service calls.

3. STAFFING, SUPERVISION & QUALITY CONTROL
--------------------------------------------------------------------------------
3.1 Organizational Hierarchy:
    - Project Executive / Operations Director (Contract Oversight)
    - Site Lead Supervisor (Daily Quality Audits & Staff Scheduling)
    - Field Operational Technicians / Custodial Team

3.2 Quality Assurance Program (QAP):
    - Weekly documented supervisory inspections.
    - Monthly reporting and scorecards submitted to ${bid.agency}.
    - Dedicated escalation contact for SLA resolution within 2 hours.

4. COMPLIANCE, LICENSURE & RISK MITIGATION
--------------------------------------------------------------------------------
4.1 Required Documentation:
    [X] General Liability & Workers' Compensation Insurance Verification
    [X] Applicable State/Local Business Licenses & DBPR Certifications
    [X] Background Check & Staff Vetting Certifications
    [X] OSHA Safety Plan & Hazardous Communications Protocol

5. DYNAMIC PRICING & COST SCHEDULE MATRIX
--------------------------------------------------------------------------------
Itemized Category                  Allocation (%)    Projected Capital ($)
--------------------------------------------------------------------------------
1. Direct Field Labor & Wages      ${laborPct}%              $${laborDollar.toLocaleString()}
2. Machinery, Tools & Chemicals    ${supplyPct}%              $${supplyDollar.toLocaleString()}
3. Quality, Bond & Overhead        ${overheadPct}%              $${overheadDollar.toLocaleString()}
4. Target Net Profit Margin        ${marginPct}%              $${marginDollar.toLocaleString()}
--------------------------------------------------------------------------------
TOTAL PROPOSAL CONTRACT TARGET:    100%             $${targetValNum > 0 ? targetValNum.toLocaleString() : (bid.estimatedValue || "TBD")}

================================================================================
Generated via BidPulse Procurement Intelligence Engine
================================================================================`;
  };

  const handleCopyScaffolding = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDoc = () => {
    if (!selectedBid) return;
    const content = generateScaffolding(selectedBid);
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedBid.id}_Proposal_Scaffolding.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredBids = bids.filter((bid) => {
    const matchesSearch =
      bid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || bid.status === statusFilter;
    const matchesAgency = selectedAgencyFilter === "All" || bid.agency === selectedAgencyFilter;
    return matchesSearch && matchesStatus && matchesAgency;
  });

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-sm w-full space-y-5 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="h-10 w-10 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl flex items-center justify-center mx-auto text-lg font-bold">
              🔒
            </div>
            <h1 className="text-xl font-bold text-slate-100">Admin Security Gate</h1>
            <p className="text-xs text-slate-400">
              Enter authorized PIN to unlock pipeline controls and margin calculators.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter PIN (Default: 1234)"
                className={`w-full bg-slate-950 border rounded-xl p-3 text-center text-lg tracking-widest text-slate-100 placeholder-slate-600 focus:outline-none ${
                  pinError ? "border-rose-500 focus:border-rose-500" : "border-slate-800 focus:border-emerald-500"
                }`}
                autoFocus
              />
              {pinError && (
                <div className="text-[11px] text-rose-400 text-center font-medium mt-1.5">
                  Invalid authorization code. Try default `1234`.
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition text-sm cursor-pointer shadow-md"
            >
              Unlock Dashboard →
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition">
              ← Return to Mission Control
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 relative">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
          <div>
            <Link href="/" className="text-xs text-slate-400 hover:text-emerald-400 transition flex items-center gap-1 mb-1">
              ← Mission Control
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-400">Operations Pipeline</h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Active Pipeline Capital: <span className="text-slate-200 font-bold font-mono">${totalPipelineCapital.toLocaleString()}</span> across {bids.length} solicitations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3.5 py-2.5 rounded-lg text-sm transition border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <span>📥 Export CSV</span>
            </button>
            <Link
              href="/intake"
              className="text-center bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition shadow-sm"
            >
              + New RFP Intake
            </Link>
            <Link
              href="/fit-score"
              className="text-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-lg text-sm transition border border-slate-700"
            >
              Fit Scorer
            </Link>
            <button
              type="button"
              onClick={handleLockSession}
              title="Lock Admin Session"
              className="bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 font-medium p-2.5 rounded-lg text-sm transition border border-slate-800 hover:border-rose-800/60 cursor-pointer"
            >
              🔒 Lock
            </button>
          </div>
        </header>

        {/* Agency Concentration Rollup Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap text-[11px] mr-1">
            Agency Focus:
          </span>
          <button
            type="button"
            onClick={() => setSelectedAgencyFilter("All")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
              selectedAgencyFilter === "All"
                ? "bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm"
                : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            All Agencies ({bids.length})
          </button>
          {Object.entries(agencyCounts).map(([agencyName, count]) => (
            <button
              key={agencyName}
              type="button"
              onClick={() => setSelectedAgencyFilter(agencyName)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap cursor-pointer ${
                selectedAgencyFilter === agencyName
                  ? "bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-sm"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
              }`}
            >
              {agencyName} ({count})
            </button>
          ))}
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <input
            type="text"
            placeholder="Search by title, agency, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["All", "Drafting", "Review", "Submitted"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === status
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Proposals Table */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm font-semibold text-slate-200">Active Proposals Queue ({filteredBids.length})</h2>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-rose-400 transition cursor-pointer"
            >
              Reset Queue
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">RFP ID / Project Title</th>
                  <th className="p-4">Agency</th>
                  <th className="p-4">Target Value</th>
                  <th className="p-4">Fit Score</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBids.map((bid) => (
                  <tr
                    key={bid.id}
                    onClick={() => {
                      setSelectedBid(bid);
                      setActiveModalTab("overview");
                      setCopied(false);
                    }}
                    className="hover:bg-slate-800/50 transition cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-slate-100">{bid.title}</div>
                      <span className="text-xs font-mono text-slate-500">{bid.id}</span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{bid.agency}</td>
                    <td className="p-4 font-mono text-slate-300">{bid.estimatedValue || "TBD"}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold font-mono inline-block ${
                          bid.fitScore >= 85
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-700/50"
                            : "bg-amber-950 text-amber-300 border border-amber-700/50"
                        }`}
                      >
                        {bid.fitScore}%
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 text-xs font-mono">{bid.dueDate}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 inline-block">
                        {bid.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded border border-emerald-800/60 hover:bg-emerald-900 transition">
                        Inspect →
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredBids.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                      No matching solicitations found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Centered Modal with Tabbed Overview, Financial Matrix & Scaffolding */}
      {selectedBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedBid(null)}
          />

          <div className="relative z-10 bg-slate-900 w-full max-w-3xl max-h-[92vh] border border-slate-700/80 rounded-2xl p-5 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl space-y-5">
            
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  {selectedBid.id}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100 mt-0.5">{selectedBid.title}</h3>
                <p className="text-xs text-slate-400">{selectedBid.agency}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/fit-score?bidId=${selectedBid.id}`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg transition shadow-md flex items-center gap-1.5 whitespace-nowrap"
                >
                  ⚡ Run Fit Matrix
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedBid(null)}
                  className="text-slate-400 hover:text-slate-100 text-lg font-bold px-3 py-1 bg-slate-800 rounded-lg hover:bg-slate-700 transition cursor-pointer"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Subnav Tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setActiveModalTab("overview")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeModalTab === "overview"
                    ? "bg-slate-800 text-emerald-400 border border-slate-700"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                📊 Proposal Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("pricing")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeModalTab === "pricing"
                    ? "bg-slate-800 text-emerald-400 border border-slate-700"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                💰 Cost & Margin Modeler
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("scaffolding")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeModalTab === "scaffolding"
                    ? "bg-slate-800 text-emerald-400 border border-slate-700"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                📋 Proposal SOW
              </button>
            </div>

            {/* Modal Body: Tab 1 - Overview */}
            {activeModalTab === "overview" && (
              <div className="space-y-4 overflow-y-auto pr-1 max-h-[50vh]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Target Value</div>
                    <div className="text-sm sm:text-base font-bold text-slate-200 mt-0.5">{selectedBid.estimatedValue || "Undisclosed"}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Due Date</div>
                    <div className="text-sm sm:text-base font-bold text-slate-200 mt-0.5 font-mono">{selectedBid.dueDate}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Fit Viability</div>
                    <div className="text-sm sm:text-base font-extrabold text-emerald-400 mt-0.5">{selectedBid.fitScore}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Stage</div>
                    <div className="text-sm sm:text-base font-bold text-slate-200 mt-0.5">{selectedBid.status}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Scope Summary & Solicitations</h4>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-32 overflow-y-auto">
                    {selectedBid.scope || "No custom scope criteria specified during initial intake."}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Update Proposal Stage</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {(["Drafting", "Review", "Submitted"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(selectedBid.id, st)}
                        className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
                          selectedBid.status === st
                            ? "bg-emerald-600 border-emerald-500 text-white shadow-lg ring-2 ring-emerald-500/30"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Body: Tab 2 - Cost & Margin Modeler */}
            {activeModalTab === "pricing" && (
              <div className="space-y-4 overflow-y-auto pr-1 max-h-[50vh]">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Direct Labor ($)</div>
                    <div className="text-base sm:text-lg font-bold text-slate-100 font-mono mt-0.5">${laborDollar.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">{laborPct}% allocation</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Tools & Supplies ($)</div>
                    <div className="text-base sm:text-lg font-bold text-slate-100 font-mono mt-0.5">${supplyDollar.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">{supplyPct}% allocation</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Overhead & Safety ($)</div>
                    <div className="text-base sm:text-lg font-bold text-slate-100 font-mono mt-0.5">${overheadDollar.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">{overheadPct}% allocation</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase font-semibold">Target Margin ($)</div>
                    <div className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono mt-0.5">${marginDollar.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-500/80 font-semibold">{marginPct}% Net Profit</div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Direct Labor & Wages</span>
                      <span className="text-emerald-400 font-mono font-bold">{laborPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="75"
                      value={laborPct}
                      onChange={(e) => setLaborPct(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Machinery, Tools & Chemicals</span>
                      <span className="text-emerald-400 font-mono font-bold">{supplyPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      value={supplyPct}
                      onChange={(e) => setSupplyPct(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">Target Net Margin</span>
                      <span className="text-emerald-400 font-mono font-bold">{marginPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={marginPct}
                      onChange={(e) => setMarginPct(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <span>💡</span>
                  <span>Adjusting these sliders immediately updates the itemized pricing section inside the <strong>Proposal SOW</strong> tab.</span>
                </div>
              </div>
            )}

            {/* Modal Body: Tab 3 - Proposal Scaffolding */}
            {activeModalTab === "scaffolding" && (
              <div className="space-y-3 overflow-y-auto pr-1 max-h-[50vh]">
                <div className="flex justify-between items-center bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800">
                  <span className="text-xs text-slate-400 font-mono">
                    Structured SOW & Proposal Draft Scaffolding
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadDoc}
                      className="text-xs font-bold px-3 py-1.5 rounded transition bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>📥 Download Draft (.txt)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyScaffolding(generateScaffolding(selectedBid))}
                      className={`text-xs font-bold px-3 py-1.5 rounded transition cursor-pointer ${
                        copied
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {copied ? "✓ Copied!" : "Copy Full Draft"}
                    </button>
                  </div>
                </div>

                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-[11px] sm:text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[38vh] overflow-y-auto select-text">
                  {generateScaffolding(selectedBid)}
                </pre>
              </div>
            )}

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <div className="text-[11px] text-slate-500">
                BidPulse Proposal Acceleration Engine
              </div>
              <button
                type="button"
                onClick={() => setSelectedBid(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}