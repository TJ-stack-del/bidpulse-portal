'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ContractorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [profile, setProfile] = useState({
    full_name: '',
    company_name: '',
    fein: '',
    sunbiz_number: '',
    license_number: '',
    primary_trade: 'Commercial Janitorial',
    phone: '',
    insurance_coverage: '$1,000,000 / $2,000,000 Aggregate',
    bonding_capacity: '$500,000'
  });

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user) return;

        setUserEmail(authData.user.email || '');

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (data) {
          setProfile({
            full_name: data.full_name || authData.user.user_metadata?.full_name || '',
            company_name: data.company_name || authData.user.user_metadata?.company_name || '',
            fein: data.fein || '',
            sunbiz_number: data.sunbiz_number || '',
            license_number: data.license_number || '',
            primary_trade: data.primary_trade || 'Commercial Janitorial',
            phone: data.phone || '',
            insurance_coverage: data.insurance_coverage || '$1,000,000 / $2,000,000 Aggregate',
            bonding_capacity: data.bonding_capacity || '$500,000'
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: userEmail,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Contractor profile saved. All future proposal requests will auto-populate with these credentials.');
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading contractor profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
          Contractor Entity Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Save your statutory registration once. All 5-tab proposal binders will automatically compile with this data.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Statutory & Legal Identity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Legal Business Name
            </label>
            <input 
              required
              name="company_name"
              value={profile.company_name}
              onChange={handleChange}
              placeholder="e.g. First Coast Grounds LLC"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Signatory / Contact Name
            </label>
            <input 
              required
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              placeholder="e.g. Michael Coleman"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Federal Employer ID (FEIN)
            </label>
            <input 
              name="fein"
              value={profile.fein}
              onChange={handleChange}
              placeholder="XX-XXXXXXX"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Florida Sunbiz Document #
            </label>
            <input 
              name="sunbiz_number"
              value={profile.sunbiz_number}
              onChange={handleChange}
              placeholder="e.g. L24000123456"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              State Trade License / Cert #
            </label>
            <input 
              name="license_number"
              value={profile.license_number}
              onChange={handleChange}
              placeholder="e.g. CBC-1234567"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Primary Trade Domain
            </label>
            <select 
              name="primary_trade"
              value={profile.primary_trade}
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
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Phone Contact
            </label>
            <input 
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="(904) 555-0199"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              General Liability Coverage
            </label>
            <input 
              name="insurance_coverage"
              value={profile.insurance_coverage}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" 
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Entity Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
