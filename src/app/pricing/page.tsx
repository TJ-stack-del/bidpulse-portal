import { PricingTiers } from '@/components/PricingTiers';

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ rfp_intake_id?: string; canceled?: string }>;
}) {
  const params = await searchParams;
  const rfpIntakeId = params?.rfp_intake_id;
  const isCanceled = params?.canceled === 'true';

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Choose Your BidPulse Access Tier
        </h1>
        <p className="text-lg text-gray-600 mt-3">
          Select a single-use pass for an immediate proposal or activate continuous monitoring with our risk-free trial.
        </p>

        {isCanceled && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm max-w-md mx-auto">
            Checkout was canceled. Feel free to select a tier whenever you're ready.
          </div>
        )}
      </div>

      <PricingTiers rfpIntakeId={rfpIntakeId} />
    </main>
  );
}