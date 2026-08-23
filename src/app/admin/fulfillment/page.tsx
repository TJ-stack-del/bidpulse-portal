'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function AdminFulfillmentPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUrls, setEditingUrls] = useState<{ [id: string]: string }>({});
  const [editingStatuses, setEditingStatuses] = useState<{ [id: string]: string }>({});

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('proposal_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setRequests(data);
      const urls: any = {};
      const statuses: any = {};
      data.forEach((r) => {
        urls[r.id] = r.binder_url || '';
        statuses[r.id] = r.status || 'Requested';
      });
      setEditingUrls(urls);
      setEditingStatuses(statuses);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('proposal_requests')
      .update({
        status: editingStatuses[id],
        binder_url: editingUrls[id]
      })
      .eq('id', id);

    if (error) {
      alert(`Update failed: ${error.message}`);
    } else {
      alert('Packet status & deliverable link updated!');
      fetchRequests();
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Proposal Fulfillment Queue</h1>
          <p className="text-slate-400 text-sm">Manage incoming proposal requests, track assembly progress, and deliver completed packets.</p>
        </div>
        <button 
          onClick={fetchRequests} 
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3.5 py-2 rounded-lg border border-slate-700 transition"
        >
          Refresh Queue
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4">Contract Requested</th>
              <th className="p-4">Contractor / Company</th>
              <th className="p-4">Status</th>
              <th className="p-4">Packet URL / Delivery</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-500">Loading fulfillment queue...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-slate-500">No proposal requests logged yet.</td></tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-4">
                    <div className="font-bold text-white">{req.solicitation_title || 'Untitled Request'}</div>
                    <div className="text-xs text-slate-400">{req.issuing_agency || 'Municipal Agency'}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="font-semibold text-slate-200">{req.raw_payload?.contractor?.legalName || 'First Coast Grounds LLC'}</div>
                    <div className="text-slate-500 font-mono">{req.raw_payload?.contractor?.fein || req.user_id}</div>
                  </td>
                  <td className="p-4">
                    <select 
                      value={editingStatuses[req.id] || req.status}
                      onChange={(e) => setEditingStatuses({ ...editingStatuses, [req.id]: e.target.value })}
                      className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded px-2.5 py-1.5 focus:outline-none"
                    >
                      <option value="Requested">Requested (New)</option>
                      <option value="In Review">In Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <input 
                      placeholder="Paste binder download link..." 
                      value={editingUrls[req.id] ?? ''}
                      onChange={(e) => setEditingUrls({ ...editingUrls, [req.id]: e.target.value })}
                      className="w-full max-w-xs bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleUpdate(req.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded transition"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
