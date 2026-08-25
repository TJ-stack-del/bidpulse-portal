'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { createCheckoutSession } from '@/app/actions/checkout';

function SubmitButton({ label, isPrimary }: { label: string; isPrimary?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all shadow-sm ${
        isPrimary
          ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
          : 'bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-600'
      }`}
    >
      {pending ? 'Redirecting to Secure Checkout...' : label}
    </button>
  );
}

export function PricingTiers({ rfpIntakeId }: { rfpIntakeId?: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto py-12 px-4">
      
      {/* Tier 1: Single Bid Pass */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">On-Demand</span>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">BidPulse: Single Bid Pass</h3>
          <p className="text-gray-600 mt-2 text-sm">
            On-demand, single-use RFP report, parsing, and analysis pass. Ideal for targeting a specific contract.
          </p>
          <div className="mt-6 mb-8">
            <span className="text-4xl font-extrabold text-gray-900">$297</span>
            <span className="text-gray-500 ml-2">one-time payment</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-700 mb-8">
            <li className="flex items-center">✓ 1 Full RFP Intake & Parsing</li>
            <li className="flex items-center">✓ Interactive Compliance Checklist</li>
            <li className="flex items-center">✓ Capability Statement & Narrative Export</li>
          </ul>
        </div>

        <form action={createCheckoutSession}>
          <input type="hidden" name="tier" value="single_bid_pass" />
          {rfpIntakeId && <input type="hidden" name="rfp_intake_id" value={rfpIntakeId} />}
          <SubmitButton label="Get Single Pass" />
        </form>
      </div>

      {/* Tier 2: Contract Radar */}
      <div className="bg-white border-2 border-blue-600 rounded-2xl p-8 shadow-md flex flex-col justify-between relative">
        <div className="absolute -top-3 right-8 bg-blue-600 text-white text-xs font-bold uppercase py-1 px-3 rounded-full tracking-wide">
          Most Popular
        </div>
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">Recurring Pipeline</span>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">BidPulse: Contract Radar</h3>
          <p className="text-gray-600 mt-2 text-sm">
            Continuous automated pipeline tracking, RFP monitoring, and alerts with a risk-free trial.
          </p>
          <div className="mt-6 mb-8">
            <span className="text-4xl font-extrabold text-gray-900">$399</span>
            <span className="text-gray-500 ml-2">/ month after 14-day trial</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-700 mb-8">
            <li className="flex items-center">✓ 14-Day Free Trial (No charge today)</li>
            <li className="flex items-center">✓ Continuous Automated Opportunity Matching</li>
            <li className="flex items-center">✓ Multi-RFP Pipeline Tracking & Alerts</li>
            <li className="flex items-center">✓ Priority Admin Review & Audit Support</li>
          </ul>
        </div>

        <form action={createCheckoutSession}>
          <input type="hidden" name="tier" value="contract_radar" />
          {rfpIntakeId && <input type="hidden" name="rfp_intake_id" value={rfpIntakeId} />}
          <SubmitButton label="Start 14-Day Free Trial" isPrimary />
        </form>
      </div>

    </div>
  );
}