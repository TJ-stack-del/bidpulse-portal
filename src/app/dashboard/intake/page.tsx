'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function IntakePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    legalName: '',
    sunbizNumber: '',
    fein: '',
    licenseNumber: '',
    solicitationTitle: '',
    issuingAgency: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Please log in before submitting your intake profile.");

      const initialPayload = {
        metadata: {
          solicitationTitle: formData.solicitationTitle,
          issuingAgency: formData.issuingAgency,
        },
        contractor: {
          legalName: formData.legalName,
          sunbizNumber: formData.sunbizNumber,
          fein: formData.fein,
          licenseNumber: formData.licenseNumber,
        }
      };

      const { error } = await supabase
        .from('proposal_requests')
        .insert({
          user_id: userData.user.id,
          solicitation_title: formData.solicitationTitle,
          issuing_agency: formData.issuingAgency,
          status: 'Requested',
          current_step_index: 0,
          raw_payload: initialPayload
        });

      if (error) throw error;

      router.push('/intake/confirmation');
    } catch (err: any) {
      alert(`Intake submission notice: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
        <div className="flex justify-center mb-6 items-center gap-2">
          <span className="font-extrabold tracking-tight text-2xl text-white font-sans">
            Bid<span className="text-blue-600">Pulse</span>
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Contractor Intake Form</h2>
        <p className="text-slate-400 text-center mb-8 text-sm">Enter your business information to initiate your 5-tab proposal packet.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Solicitation / RFP Title</label>
              <input required name="solicitationTitle" placeholder="e.g. Duval Custodial Contract" onChange={handleChange} className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Issuing Agency</label>
              <input required name="issuingAgency" placeholder="e.g. Duval County Public Schools" onChange={handleChange} className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Business Legal Name</label>
              <input required name="legalName" placeholder="e.g. First Coast Janitorial LLC" onChange={handleChange} className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Federal FEIN / Tax ID</label>
              <input required name="fein" placeholder="XX-XXXXXXX" onChange={handleChange} className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">Florida Sunbiz Document #</label>
              <input required name="sunbizNumber" placeholder="e.g. L24000..." onChange={handleChange} className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">DBPR / Trade License #</label>
              <input required name="licenseNumber" placeholder="e.g. CBC1234567" onChange={handleChange} className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500 text-sm" />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-lg transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Registering Request...' : 'Submit Profile & Start Assembly'}
          </button>
        </form>
      </div>
    </div>
  );
}
