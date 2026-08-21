"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { saveBid, BidItem } from "../bids";

export default function IntakePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    agency: "",
    dueDate: "",
    estimatedValue: "",
    scope: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const randomScore = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
    const newBid: BidItem = {
      id: `BID-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title,
      agency: formData.agency,
      dueDate: formData.dueDate,
      status: "Drafting",
      fitScore: randomScore,
      estimatedValue: formData.estimatedValue,
      scope: formData.scope,
    };

    saveBid(newBid);
    router.push("/admin");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-emerald-400">RFP Document Intake</h1>
            <p className="text-sm text-slate-400">Log procurement solicitations and sync directly to the operations queue.</p>
          </div>
          <a href="/admin" className="text-sm text-slate-400 hover:text-slate-200">
            ← Back to Admin
          </a>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contract / Project Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              placeholder="e.g., Municipal Custodial & Janitorial Services"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Issuing Agency / Entity</label>
              <input
                type="text"
                required
                value={formData.agency}
                onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                placeholder="e.g., City of Jacksonville"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Submission Deadline</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Estimated Contract Value ($)</label>
            <input
              type="text"
              value={formData.estimatedValue}
              onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              placeholder="e.g., $150,000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Scope Summary / Deliverables</label>
            <textarea
              rows={4}
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              placeholder="Enter facility square footage, staffing levels, special certifications..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition"
          >
            Save & Add to Pipeline Queue →
          </button>
        </form>
      </div>
    </main>
  );
}