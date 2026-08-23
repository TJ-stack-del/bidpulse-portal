'use client';

import React from 'react';

export default function AdminOpportunitiesPage() {
  return (
    <div className="max-w-7xl w-full mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">RFP Opportunity Manager</h1>
        <p className="text-slate-400 text-sm">Publish and manage active municipal and commercial solicitations.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 border-b border-slate-800 pb-3">Post New Solicitation</h2>
        
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Contract Title *</label>
              <input placeholder="e.g. Citywide Custodial Services" className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Trade Category *</label>
              <input placeholder="e.g. Commercial Janitorial" className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Issuing Agency *</label>
              <input placeholder="e.g. Duval County Public Schools" className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Solicitation # *</label>
              <input placeholder="e.g. RFP-0132-26" className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Submission Deadline *</label>
              <input type="date" className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Est. Contract Value</label>
              <input placeholder="e.g. $285,000 / year" className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-md transition">
              Publish RFP to Feed
            </button>
          </div>
        </form>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-sm">Active Solicitations</h3>
          <button className="text-xs text-blue-400 hover:text-blue-300 transition">Refresh</button>
        </div>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <th className="p-4">Contract / Agency</th>
              <th className="p-4">Trade</th>
              <th className="p-4">Est. Value</th>
              <th className="p-4">Deadline</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            <tr className="hover:bg-slate-800/30 transition">
              <td className="p-4">
                <div className="font-bold text-white text-sm">Citywide Turnkey Janitorial & Daily Custodial Services</div>
                <div className="text-slate-400">City of Jacksonville / Duval County Public Facilities · Ref: RFP-0132-26</div>
              </td>
              <td className="p-4"><span className="bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300">Commercial Janitorial</span></td>
              <td className="p-4 text-slate-300 font-mono">$285,000/yr</td>
              <td className="p-4 text-rose-400 font-medium">10/10/2026</td>
              <td className="p-4 text-right space-x-2">
                <span className="text-blue-400 cursor-pointer hover:underline">Portal</span>
                <span className="text-rose-400 cursor-pointer hover:underline">Delete</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
