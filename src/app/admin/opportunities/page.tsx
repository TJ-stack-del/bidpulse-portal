'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SolicitationItem {
  id: string;
  title: string;
  agency: string;
  solicitation_number: string;
  trade: string;
  estimated_value: string | null;
  submission_deadline: string;
  pre_bid_date?: string | null;
  portal_url: string | null;
  status: string;
}

const TRADES = [
  { value: 'commercial_janitorial', label: 'Commercial Janitorial' },
  { value: 'landscaping_grounds', label: 'Landscaping & Grounds' },
  { value: 'pressure_washing_facades', label: 'Pressure Washing & Facades' },
  { value: 'commercial_painting', label: 'Commercial Painting' },
  { value: 'security_guard_services', label: 'Security & Guard Services' },
  { value: 'hvac_preventative_maintenance', label: 'HVAC Maintenance' },
  { value: 'hauling_waste_removal', label: 'Hauling & Waste Removal' },
];

export default function AdminOpportunitiesPage() {
  const [solicitations, setSolicitations] = useState<SolicitationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    agency: '',
    solicitation_number: '',
    trade: 'commercial_janitorial',
    estimated_value: '',
    submission_deadline: '',
    pre_bid_date: '',
    portal_url: '',
  });

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  async function loadData() {
    setLoading(true);
    const { data, error } = await supabase
      .from('solicitations')
      .select('*')
      .order('submission_deadline', { ascending: true });

    if (!error && data) {
      setSolicitations(data as SolicitationItem[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.agency || !form.solicitation_number || !form.submission_deadline) {
      showToast('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('solicitations').insert({
        title: form.title,
        agency: form.agency,
        solicitation_number: form.solicitation_number,
        trade: form.trade,
        estimated_value: form.estimated_value || null,
        submission_deadline: new Date(form.submission_deadline).toISOString(),
        pre_bid_date: form.pre_bid_date ? new Date(form.pre_bid_date).toISOString() : null,
        portal_url: form.portal_url || null,
        status: 'open',
      });

      if (error) throw error;

      setForm({
        title: '',
        agency: '',
        solicitation_number: '',
        trade: 'commercial_janitorial',
        estimated_value: '',
        submission_deadline: '',
        pre_bid_date: '',
        portal_url: '',
      });
      loadData();
      showToast('Solicitation published successfully.');
    } catch {
      showToast('Unable to publish. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('solicitations').delete().eq('id', id);
    if (!error) {
      loadData();
      showToast('Solicitation removed.');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      {/* In-App Toast */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl transition-all">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">RFP Opportunity Manager</h1>
        <p className="text-base text-slate-600 mt-1">
          Publish and manage active municipal and commercial solicitations.
        </p>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-5">Post New Solicitation</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Contract Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Citywide Grounds Maintenance for Municipal Parks"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Trade Category *</label>
            <select
              value={form.trade}
              onChange={(e) => setForm({ ...form, trade: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TRADES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Issuing Agency *</label>
            <input
              type="text"
              required
              placeholder="e.g. City of Jacksonville"
              value={form.agency}
              onChange={(e) => setForm({ ...form, agency: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Solicitation # *</label>
            <input
              type="text"
              required
              placeholder="e.g. RFP-0182-26"
              value={form.solicitation_number}
              onChange={(e) => setForm({ ...form, solicitation_number: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Est. Value</label>
            <input
              type="text"
              placeholder="e.g. $150,000/yr"
              value={form.estimated_value}
              onChange={(e) => setForm({ ...form, estimated_value: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Submission Deadline *</label>
            <input
              type="datetime-local"
              required
              value={form.submission_deadline}
              onChange={(e) => setForm({ ...form, submission_deadline: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Pre-Bid Date</label>
            <input
              type="datetime-local"
              value={form.pre_bid_date}
              onChange={(e) => setForm({ ...form, pre_bid_date: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Portal Link</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.portal_url}
              onChange={(e) => setForm({ ...form, portal_url: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Publish RFP to Feed'}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-800">Active Solicitations ({solicitations.length})</h3>
          <button onClick={loadData} className="text-sm text-blue-600 font-bold hover:underline">Refresh</button>
        </div>

        {loading ? (
          <div className="p-8 text-sm text-slate-500 font-medium">Loading solicitations...</div>
        ) : solicitations.length === 0 ? (
          <div className="p-8 text-sm text-slate-500">No active solicitations found.</div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 font-bold text-slate-700">
              <tr>
                <th className="px-5 py-3.5">Contract / Agency</th>
                <th className="px-5 py-3.5">Trade</th>
                <th className="px-5 py-3.5">Est. Value</th>
                <th className="px-5 py-3.5">Deadline</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {solicitations.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900 text-base">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.agency} • Ref: {item.solicitation_number}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 capitalize">
                      {item.trade.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-700 text-sm font-semibold">
                    {item.estimated_value || '—'}
                  </td>
                  <td className="px-5 py-4 text-sm text-red-600 font-bold">
                    {new Date(item.submission_deadline).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right space-x-4">
                    {item.portal_url && (
                      <a
                        href={item.portal_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Portal
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
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
