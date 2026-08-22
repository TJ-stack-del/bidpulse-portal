import React from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      {/* Header / Nav */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-slate-800 tracking-tight">
            BidPulse <span className="text-blue-600">Portal</span>
          </div>
          <nav className="space-x-6 text-sm font-medium text-slate-600 hidden md:block">
            <a href="#services" className="hover:text-blue-600 transition">Services</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
            <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
            <a href="#testimonials" className="hover:text-blue-600 transition">Reviews</a>
          </nav>
          <a
            href="#pricing"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4 text-center max-w-4xl mx-auto">
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">
          Simple, Reliable Management
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Commercial Service Management Made Simple
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Get transparent pricing, reliable scheduling, and clean reporting for all your facility needs. No confusing contracts or hidden fees.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#pricing"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            Get an Instant Quote
          </a>
          <a
            href="#how-it-works"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            See How It Works
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900">What We Offer</h2>
            <p className="mt-2 text-slate-600">
              Clear, dependable solutions tailored to your building and daily schedule.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-slate-200 p-6 bg-slate-50 hover:shadow-md transition">
              <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900">Routine Maintenance</h3>
              <p className="mt-2 text-sm text-slate-600">
                Scheduled daily or weekly upkeep including trash disposal, surface disinfection, and floor care.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-6 bg-slate-50 hover:shadow-md transition">
              <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900">Deep Cleaning & Turnover</h3>
              <p className="mt-2 text-sm text-slate-600">
                Thorough sanitization, high-traffic floor buffing, and complete turnover cleaning between tenant shifts.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-6 bg-slate-50 hover:shadow-md transition">
              <div className="h-10 w-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900">Custom Facility Plans</h3>
              <p className="mt-2 text-sm text-slate-600">
                Tailored service checklists built specifically for commercial offices, warehouses, and municipal spaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          <p className="mt-2 text-slate-600">Three easy steps to get your services running smoothly.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 font-bold text-lg rounded-full flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h4 className="font-bold text-lg text-slate-900">Request a Plan</h4>
            <p className="mt-2 text-sm text-slate-600">
              Select your package or enter your facility specs to get transparent pricing.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 font-bold text-lg rounded-full flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h4 className="font-bold text-lg text-slate-900">Confirm Schedule</h4>
            <p className="mt-2 text-sm text-slate-600">
              We set up your custom checklist and assign a dedicated service schedule.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 font-bold text-lg rounded-full flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h4 className="font-bold text-lg text-slate-900">Track & Review</h4>
            <p className="mt-2 text-sm text-slate-600">
              Monitor completed work, verify logs, and manage requests directly through the portal.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section id="pricing" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Straightforward Pricing</h2>
            <p className="mt-2 text-slate-600">Choose the plan that matches the size of your facility.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="rounded-2xl border border-slate-200 p-8 flex flex-col justify-between hover:border-slate-300">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Starter</h3>
                <p className="text-sm text-slate-500 mt-1">Best for small teams and solo pros</p>
                <div className="mt-6 text-4xl font-extrabold text-slate-900">
                  $29 <span className="text-sm font-normal text-slate-500">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li>✓ Up to 3 team users</li>
                  <li>✓ Core portal access</li>
                  <li>✓ Standard weekly reports</li>
                  <li>✓ Email support</li>
                </ul>
              </div>
              <button className="mt-8 w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
                Select Starter
              </button>
            </div>

            {/* Professional */}
            <div className="rounded-2xl border-2 border-blue-600 p-8 flex flex-col justify-between shadow-lg relative bg-blue-50/20">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Professional</h3>
                <p className="text-sm text-slate-500 mt-1">For growing operations</p>
                <div className="mt-6 text-4xl font-extrabold text-slate-900">
                  $79 <span className="text-sm font-normal text-slate-500">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li>✓ Up to 15 team users</li>
                  <li>✓ Custom service workflows</li>
                  <li>✓ Full analytics & shift logs</li>
                  <li>✓ Priority email & phone support</li>
                </ul>
              </div>
              <button className="mt-8 w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
                Select Professional
              </button>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-slate-200 p-8 flex flex-col justify-between hover:border-slate-300">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Enterprise</h3>
                <p className="text-sm text-slate-500 mt-1">For large facilities & multi-sites</p>
                <div className="mt-6 text-4xl font-extrabold text-slate-900">
                  $199 <span className="text-sm font-normal text-slate-500">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li>✓ Unlimited team users</li>
                  <li>✓ Dedicated account manager</li>
                  <li>✓ API integrations & database export</li>
                  <li>✓ 24/7 priority support</li>
                </ul>
              </div>
              <button className="mt-8 w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition">
                Select Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">What Our Clients Say</h2>
          <p className="mt-2 text-slate-600">Real feedback from facility and business managers.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-200 p-6 bg-white shadow-sm">
            <p className="text-slate-700 text-sm leading-relaxed">
              "Switching to this portal cut our scheduling headaches in half. The setup was quick, and our entire team figured it out on day one."
            </p>
            <div className="mt-4 font-semibold text-slate-900 text-sm">Marcus R.</div>
            <div className="text-xs text-slate-500">Operations Lead</div>
          </div>

          <div className="rounded-xl border border-slate-200 p-6 bg-white shadow-sm">
            <p className="text-slate-700 text-sm leading-relaxed">
              "Clean, fast, and easy to use. It gives us exactly what we need without the extra clutter or confusion."
            </p>
            <div className="mt-4 font-semibold text-slate-900 text-sm">Sarah T.</div>
            <div className="text-xs text-slate-500">Small Business Owner</div>
          </div>

          <div className="rounded-xl border border-slate-200 p-6 bg-white shadow-sm">
            <p className="text-slate-700 text-sm leading-relaxed">
              "Customer support was responsive, and the pricing is straightforward with no hidden surprises."
            </p>
            <div className="mt-4 font-semibold text-slate-900 text-sm">David L.</div>
            <div className="text-xs text-slate-500">Facilities Manager</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} BidPulse Portal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}