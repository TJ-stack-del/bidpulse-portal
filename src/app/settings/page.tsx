"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getClientProfile, saveClientProfile, ClientProfile } from "../profile";

const COMMON_AGENCIES = [
  "City of Jacksonville",
  "Duval County Public Schools",
  "Jacksonville Transportation Authority (JTA)",
  "Department of the Navy",
  "JEA (Jacksonville Electric Authority)",
  "St. Johns County",
  "Clay County School District"
];

const COMMON_CAPABILITIES = [
  "Daily Commercial Janitorial",
  "Floor Stripping & Waxing",
  "Carpet Extraction",
  "Medical & Biohazard Sanitization",
  "Green Cleaning (CIMS-GB)",
  "Day Porter Services",
  "Exterior Pressure Washing",
  "Post-Construction Rough Clean"
];

export default function SettingsPage() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setProfile(getClientProfile());
  }, []);

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Loading criteria preferences...
      </div>
    );
  }

  const toggleAgency = (agency: string) => {
    const exists = profile.preferredAgencies.includes(agency);
    const updated = exists
      ? profile.preferredAgencies.filter((a) => a !== agency)
      : [...profile.preferredAgencies, agency];
    setProfile({ ...profile, preferredAgencies: updated });
  };

  const toggleCapability = (cap: string) => {
    const exists = profile.capabilities.includes(cap);
    const updated = exists
      ? profile.capabilities.filter((c) => c !== cap)
      : [...profile.capabilities, cap];
    setProfile({ ...profile, capabilities: updated });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveClientProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
          Client Profile Configuration
        </span>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
          Target Bidding Criteria & Capacity
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Configure your company profile to automatically match and prioritize public solicitations on the search feed.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Company / Vendor Legal Name
          </label>
          <input
            type="text"
            required
            value={profile.companyName}
            onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Primary NAICS Industry Codes (Comma Separated)
          </label>
          <input
            type="text"
            value={profile.naicsCodes.join(", ")}
            onChange={(e) =>
              setProfile({
                ...profile,
                naicsCodes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              })
            }
            placeholder="561720, 561730, 238990"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <p className="text-xs text-slate-500 mt-1">Default: 561720 (Janitorial Services), 561730 (Landscaping/Grounds)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Minimum Annual Contract Value ($)
            </label>
            <input
              type="number"
              value={profile.minBudget}
              onChange={(e) => setProfile({ ...profile, minBudget: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Maximum Bonding / Contract Cap ($)
            </label>
            <input
              type="number"
              value={profile.maxBudget}
              onChange={(e) => setProfile({ ...profile, maxBudget: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Preferred Target Agencies
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COMMON_AGENCIES.map((agency) => {
              const isSelected = profile.preferredAgencies.includes(agency);
              return (
                <button
                  type="button"
                  key={agency}
                  onClick={() => toggleAgency(agency)}
                  className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "} {agency}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            Operational Capabilities & Specializations
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COMMON_CAPABILITIES.map((cap) => {
              const isSelected = profile.capabilities.includes(cap);
              return (
                <button
                  type="button"
                  key={cap}
                  onClick={() => toggleCapability(cap)}
                  className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-700 dark:text-indigo-300"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "} {cap}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/search"
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:underline"
          >
            &larr; Return to Live Search
          </Link>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all cursor-pointer"
          >
            Save Profile Criteria
          </button>
        </div>

        {savedSuccess && (
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 text-right">
            ✓ Client preferences saved successfully! Search feeds will now match your criteria.
          </p>
        )}
      </form>
    </main>
  );
}
