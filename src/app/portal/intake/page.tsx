'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createIntakeAction } from '../../actions/intake';

export default function IntakePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    legalName: '',
    fein: '',
    sunbizNumber: '',
    licenseNumber: '',
    primaryTrade: 'Commercial Janitorial',
    insuranceCoverage: '$1,000,000 / $2,000,000 Aggregate',
    bondingCapacity: '$500,000',
    selectedSolicitation: 'Citywide Turnkey Janitorial & Daily Custodial Services'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clientSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const rawFormData = new FormData(e.currentTarget);
      
      // Execute our highly secure Server Action
      await createIntakeAction(rawFormData);
      
      // Redirect to the dashboard upon successful database insertion
      router.push('/p/portal/coordinator');
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
      </div>

      <form onSubmit={clientSubmitHandler} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Contractor Entity Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Legal Business Name</label>
            <input required name="legalName" value={formData.legalName} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">FEIN / Tax ID</label>
            <input name="fein" value={formData.fein} onChange={handleChange} placeholder="XX-XXXXXXX" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Florida Sunbiz #</label>
            <input name="sunbizNumber" value={formData.sunbizNumber} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Trade License / Cert #</label>
            <input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Primary Trade Domain</label>
            <select name="primaryTrade" value={formData.primaryTrade} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none">
              <option value="Commercial Janitorial">Commercial Janitorial</option>
              <option value="Pressure Washing / Facades">Pressure Washing / Facades</option>
              <option value="Landscaping / Grounds">Landscaping / Grounds</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">Target Solicitation</label>
            <input name="selectedSolicitation" value={formData.selectedSolicitation} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
          </div>
          
          <input type="hidden" name="insuranceCoverage" value={formData.insuranceCoverage} />
          <input type="hidden" name="bondingCapacity" value={formData.bondingCapacity} />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-2.5 rounded-lg shadow-md transition disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit & Compile Binder'}
          </button>
        </div>
      </form>
    </div>
  );
}