'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function IntakePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    legalName: '',
    fein: '',
    sunbizNumber: '',
    licenseNumber: '',
    primaryTrade: 'Commercial Janitorial',
    yearsInBusiness: '3',
    insuranceCoverage: '$1,000,000 / $2,000,000 Aggregate',
    bondingCapacity: '$500,000',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    selectedSolicitation: 'Citywide Turnkey Janitorial & Daily Custodial Services'
  });

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setFormData(prev => ({
          ...prev,
          contactEmail: data.user.email || prev.contactEmail,
          legalName: data.user.user_metadata?.company_name || prev.legalName,
          contactName: data.user.user_metadata?.full_name || prev.contactName
        }));
      }
    }
    loadUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || '00000000-0000-0000-0000-000000000000';

      const payload = {
        contractor: {
          legalName: formData.legalName,
          fein: formData.fein,
          sunbizNumber: formData.sunbizNumber,
          licenseNumber: formData.licenseNumber,
          yearsInBusiness: formData.yearsInBusiness,
          insuranceCoverage: formData.insuranceCoverage,
          bondingCapacity: formData.bondingCapacity,
          contactName: formData.contactName,
          contactPhone: formData.contactPhone,
          email: formData.contactEmail,
        },
        metadata: {
          solicitationTitle: formData.selectedSolicitation,
          trade: formData.primaryTrade,
          issuingAgency: 'City of Jacksonville / Duval County Public Facilities',
          refNumber: 'RFP-0132-26'
        }
      };

      const { error } = await supabase
        .from('proposal_requests')
        .insert({
          user_id: userId,
          solicitation_title: formData.selectedSolicitation,
          issuing_agency: 'City of Jacksonville / Duval County Public Facilities',
          status: 'Requested',
          current_step_index: 0,
          raw_payload: payload
        });

      if (error) throw error;

      router.push('/dashboard/proposals');
    } catch (err: any) {
      alert(`Submission note: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Contractor Intake & Profile Onboarding</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Provide your statutory entity details to populate Tabs 1–5 of your turnkey proposal binders.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Tab 1: Entity & Compliance Credentials</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Legal Business Name</label>
            <input 
              required 
              name="legalName"
              value={formData.legalName}
              onChange={handleChange}
              placeholder="e.g. First Coast Grounds LLC"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Federal Employer ID (FEIN / EIN)</label>
            <input 
              required 
              name="fein"
              value={formData.fein}
              onChange={handleChange}
              placeholder="XX-XXXXXXX"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Florida Sunbiz Document #</label>
            <input 
              name="sunbizNumber"
              value={formData.sunbizNumber}
              onChange={handleChange}
              placeholder="e.g. L24000123456"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Trade License / Certification #</label>
            <input 
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="e.g. CBC-1234567"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Primary Trade Category</label>
            <select 
              name="primaryTrade"
              value={formData.primaryTrade}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Commercial Janitorial">Commercial Janitorial</option>
              <option value="Pressure Washing / Facades">Pressure Washing / Facades</option>
              <option value="Landscaping / Grounds">Landscaping / Grounds</option>
              <option value="Hauling / Waste Removal">Hauling / Waste Removal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Target Solicitation</label>
            <input 
              name="selectedSolicitation"
              value={formData.selectedSolicitation}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Submitting Intake...' : 'Save & Submit Proposal Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
