"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { getBidById, BidItem } from "../../../bids";

export default function ProposalDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [bid, setBid] = useState<BidItem | null>(null);

  useEffect(() => {
    if (resolvedParams.id) {
      const match = getBidById(resolvedParams.id);
      if (match) setBid(match);
    }
  }, [resolvedParams.id]);

  const handlePrint = () => {
    window.print();
  };

  if (!bid) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl border border-slate-300 text-center space-y-3">
          <p className="text-xs text-slate-500">Solicitation record not found.</p>
          <Link href="/admin" className="text-xs font-bold text-slate-900 underline">
            Return to Operations Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 text-slate-900 font-sans p-4 sm:p-8 print:p-0 print:bg-white">
      
      {/* Top Action Bar (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link
          href="/admin"
          className="text-xs font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1.5 transition"
        >
          ← Return to Admin Pipeline
        </Link>
        <button
          type="button"
          onClick={handlePrint}
          className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <span>🖨️ Print / Save to PDF</span>
        </button>
      </div>

      {/* Official Proposal Document Sheet */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-300 rounded-xl shadow-2xl p-8 sm:p-12 print:border-0 print:shadow-none print:p-6 print:rounded-none space-y-8">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex justify-between items-start gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700">
              FORMAL PROCUREMENT PROPOSAL & SOW
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">{bid.title}</h1>
            <div className="text-xs font-mono text-slate-500 mt-1">
              REF ID: <strong>{bid.id}</strong> | ISSUING ENTITY: <strong>{bid.agency}</strong>
            </div>
          </div>
          <div className="text-right text-xs shrink-0 font-mono">
            <div className="text-[10px] uppercase text-slate-400 font-bold">Proposal Date</div>
            <div className="font-bold text-slate-900">{new Date().toLocaleDateString()}</div>
            <div className="text-[10px] uppercase text-slate-400 font-bold mt-2">Due Date</div>
            <div className="font-bold text-slate-900">{bid.dueDate}</div>
          </div>
        </div>

        {/* Prime Contractor Info Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Prime Vendor</span>
            <div className="font-bold text-slate-900 mt-0.5">Coleman Solutions LLC</div>
          </div>
          <div>
            <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">UEI Number</span>
            <div className="font-mono font-bold text-slate-900 mt-0.5">NC89X2KLM451</div>
          </div>
          <div>
            <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">CAGE Code</span>
            <div className="font-mono font-bold text-slate-900 mt-0.5">9K8B2</div>
          </div>
          <div>
            <span className="text-[9px] uppercase font-mono text-slate-400 font-bold block">Primary NAICS</span>
            <div className="font-mono font-bold text-slate-900 mt-0.5">561720</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-2 text-xs leading-relaxed text-slate-700">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1">
            1. Executive Summary & Operational Capability
          </h2>
          <p>
            Coleman Facilities & Janitorial Solutions LLC is pleased to submit this comprehensive technical response for {bid.title} on behalf of {bid.agency}. Our firm provides dedicated custodial operations, safety compliance protocols, and rigorous quality assurance programs designed to exceed agency sanitation benchmarks.
          </p>
        </div>

        {/* Section 2: Statement of Work & Technical Approach */}
        <div className="space-y-2 text-xs leading-relaxed text-slate-700">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1">
            2. Scope Execution & Technical Methodology
          </h2>
          <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800">
            {bid.scope || "Daily custodial operations, floor maintenance, and sanitation across facilities as specified."}
          </p>
          <ul className="list-disc pl-4 space-y-1 pt-1">
            <li><strong>Staffing & Supervision:</strong> Fully vetted, bonded personnel with mandatory OSHA standard compliance.</li>
            <li><strong>Inspection Cadence:</strong> Weekly supervisory audits with automated digital reporting provided to the agency.</li>
            <li><strong>Supplies & Green Cleaning:</strong> EPA-approved disinfectants and commercial equipment staged on-site.</li>
          </ul>
        </div>

        {/* Section 3: Cost Schedule Matrix */}
        <div className="space-y-3 text-xs">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-950 border-b border-slate-200 pb-1">
            3. Cost Schedule & Direct Price Breakdown
          </h2>
          <table className="w-full text-left border-collapse border border-slate-200 font-mono text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-2 border border-slate-200">Deliverable / Cost Item</th>
                <th className="p-2 border border-slate-200 text-center">Frequency</th>
                <th className="p-2 border border-slate-200 text-right">Allocation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-slate-200 font-sans">Direct Operational Labor & Supervision</td>
                <td className="p-2 border border-slate-200 text-center font-sans">Scheduled</td>
                <td className="p-2 border border-slate-200 text-right font-bold">$142,000</td>
              </tr>
              <tr>
                <td className="p-2 border border-slate-200 font-sans">Commercial Equipment, Consumables & PPE</td>
                <td className="p-2 border border-slate-200 text-center font-sans">Monthly</td>
                <td className="p-2 border border-slate-200 text-right font-bold">$18,000</td>
              </tr>
              <tr>
                <td className="p-2 border border-slate-200 font-sans">Quality Assurance & Management Oversight</td>
                <td className="p-2 border border-slate-200 text-center font-sans">Continuous</td>
                <td className="p-2 border border-slate-200 text-right font-bold">$20,000</td>
              </tr>
              <tr className="bg-slate-50 font-bold">
                <td colSpan={2} className="p-2 border border-slate-200 text-slate-900 font-sans uppercase">Total Firm Fixed Offer</td>
                <td className="p-2 border border-slate-200 text-right text-emerald-800 text-sm font-black">{bid.estimatedValue || "$180,000"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Compliance & Signature */}
        <div className="space-y-4 text-xs pt-4 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Authorized Contractor Signature</span>
              <div className="font-serif italic text-base text-slate-900 pt-3 border-b border-slate-400 pb-1">
                Michael Coleman Sr.
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Managing Principal / Systems Analyst</div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Date Signed</span>
              <div className="font-mono text-slate-900 pt-3 border-b border-slate-400 pb-1">
                {new Date().toLocaleDateString()}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Compliance Validated & Sealed</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
