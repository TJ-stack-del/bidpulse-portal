'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface PackageRequestItem {
  id: string;
  status: string;
  package_fee: number;
  delivered_packet_url: string | null;
  created_at: string;
  profiles: {
    email: string;
    company_name: string | null;
  } | null;
  solicitations: {
    title: string;
    agency: string;
    solicitation_number: string;
    submission_deadline: string;
  } | null;
}

const STATUS_OPTIONS = [
  { value: 'requested', label: 'Requested (New)' },
  { value: 'in_assembly', label: 'In Assembly' },
  { value: 'ready_for_pricing', label: 'Ready for Pricing' },
  { value: 'delivered', label: 'Delivered' },
];

export default function AdminRequestsQueuePage() {
  const [requests, setRequests] = useState<PackageRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [packetLinks, setPacketLinks] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  async function loadRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from('package_requests')
      .select(`
        id,
        status,
        package_fee,
        delivered_packet_url,
        created_at,
        profiles (
          email,
          company_name
        ),
        solicitations (
          title,
          agency,
          solicitation_number,
          submission_deadline
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRequests(data as any);
      const links: Record<string, string> = {};
      data.forEach((r: any) => {
        if (r.delivered_packet_url) links[r.id] = r.delivered_packet_url;
      });
      setPacketLinks(links);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = async (requestId: string, nextStatus: string) => {
    const { error } = await supabase
      .from('package_requests')
      .update({ status: nextStatus })
      .eq('id', requestId);

    if (error) {
      showToast('Unable to update status.');
    } else {
      showToast('Status updated successfully.');
      loadRequests();
    }
  };

  const handleSaveLink = async (requestId: string) => {
    const link = packetLinks[requestId] || '';
    const { error } = await supabase
      .from('package_requests')
      .update({ status: 'delivered', delivered_packet_url: link })
      .eq('id', requestId);

    if (error) {
      showToast('Unable to save packet link.');
    } else {
      showToast('Delivered packet link saved.');
      loadRequests();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      {/* Clean In-App Toast */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl transition-all">
          {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Proposal Fulfillment Queue</h1>
          <p className="text-base text-slate-600 mt-1">
            Manage incoming proposal requests, track assembly progress, and deliver completed packets.
          </p>
        </div>
        <button
          onClick={loadRequests}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          Refresh Queue
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-base text-slate-500 font-medium">Loading package requests...</div>
        ) : requests.length === 0 ? (
          <div className="p-16 text-center text-base text-slate-500">No proposal requests received yet.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 font-bold text-slate-700">
              <tr>
                <th className="px-5 py-3.5">Contract Requested</th>
                <th className="px-5 py-3.5">Contractor / Company</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Packet URL / Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900 text-base">{req.solicitations?.title || 'Unknown Contract'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {req.solicitations?.agency} • Ref: {req.solicitations?.solicitation_number}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900 text-sm">{req.profiles?.company_name || 'Individual Contractor'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{req.profiles?.email}</p>
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.id, e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={packetLinks[req.id] || ''}
                        onChange={(e) =>
                          setPacketLinks({ ...packetLinks, [req.id]: e.target.value })
                        }
                        className="w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-normal"
                      />
                      <button
                        onClick={() => handleSaveLink(req.id)}
                        className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-bold text-white hover:bg-slate-800 shadow-sm"
                      >
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
