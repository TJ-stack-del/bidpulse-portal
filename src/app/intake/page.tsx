'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function IntakePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

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
    async function loadSavedProfile() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user) return;

        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        setFormData(prev => ({
          ...prev,
          contactEmail: authData.user.email || prev.contactEmail,
          legalName: prof?.company_name || authData.user.user_metadata?.company_name || prev.legalName,
          contactName: prof?.full_name || authData.user.user_metadata?.full_name || prev.contactName,
          fein: prof?.fein || prev.fein,
          sunbizNumber: prof?.sunbiz_number || prev.sunbizNumber,
          licenseNumber: prof?.license_number || prev.licenseNumber,
          primaryTrade: prof?.primary_trade || prev.primaryTrade,
          contactPhone: prof?.phone || prev.contactPhone,
          insuranceCoverage: prof?.insurance_coverage || prev.insuranceCoverage,
          bondingCapacity: prof?.bonding_capacity || prev.bondingCapacity
        }));

        if (prof?.company_name) {
          setProfileLoaded(true);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadSavedProfile();
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
          issuingAgency: 'Duval County Public Procurement',
          refNumber: 'RFP-2026'
        }
      };

      const { error } = await supabase
        .from('proposal_requests')
        .insert({
          user_id: userId,
          solicitation_title: formData.selectedSolicitation,
          issuing_agency: 'Duval County Public Procurement',
          status: 'Requested',
          current_step_index: 0,
          raw_payload: payload
        });

      if (error) throw error;

      router.push('/dashboard/proposals');
    } catch (err: any) {
      alert(`Submission notice: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Turnkey Proposal Request
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Verify your entity parameters to compile the customized 5-tab proposal packet.
        </p>

        {profileLoaded && (
          <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-lg border border-emerald-500/20">
            ✓ Auto-filled from your Contractor Entity Profile
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Contractor Entity Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Legal Business Name</label>
            <input 
              required 
              name="legalName"
              value={formData.legalName}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">FEIN / Tax ID</label>
            <input 
              name="fein"
              value={formData.fein}
              onChange={handleChange}
              placeholder="XX-XXXXXXX"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Florida Sunbiz #</label>
            <input 
              name="sunbizNumber"
              value={formData.sunbizNumber}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Trade License / Cert #</label>
            <input 
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Primary Trade Domain</label>
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit & Compile Binder'}
          </button>
        </div>
      </form>
    </div>
  );
}
