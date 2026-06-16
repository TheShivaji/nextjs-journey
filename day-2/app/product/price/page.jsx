"use client";

import React from 'react'
import Link from 'next/link'


const PricingPage = () => {
  const plans = [
    {
      id: 'free',
      name: 'Starter Sandbox',
      price: '$0',
      period: 'forever',
      description: 'Perfect for learning, prototyping, and testing dynamic next routes in sandbox environment.',
      color: 'from-slate-700 to-slate-800',
      badge: 'Sandbox Mode',
      btnText: 'Launch Sandbox',
      features: [
        '5,000 API requests/mo',
        '3 active projects & databases',
        'Community support forum',
        'Basic telemetry logs',
      ]
    },
    {
      id: 'pro',
      name: 'Developer Pro',
      price: '$49',
      period: 'per month',
      description: 'Advanced capabilities, higher quotas, and dedicated compute for growing developers and teams.',
      color: 'from-purple-600 to-indigo-600',
      badge: 'Most Popular',
      btnText: 'Select Developer Pro',
      features: [
        '250,000 API requests/mo',
        '50 active projects & repositories',
        'Standard 24h SLA support',
        'Advanced performance dashboard',
        'Up to 5 collaborative members',
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Elite',
      price: '$299',
      period: 'per month',
      description: 'Maximum throughput, guaranteed SLA uptime, custom compliance, and dedicated GPU resources.',
      color: 'from-cyan-500 to-blue-600',
      badge: 'Dedicated Scale',
      btnText: 'Configure Enterprise',
      features: [
        'Unlimited API requests/mo',
        'Unlimited active projects',
        'Dedicated 1h SLA support',
        'SSO / SAML authentication',
        'High-Performance GPU node',
      ]
    }
  ]

  return (
    <div className="relative min-h-screen text-slate-100 bg-[#090b11] overflow-hidden selection:bg-purple-500/30 selection:text-purple-200 flex flex-col justify-between">
      
      {/* Background Neon Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] rounded-full bg-gradient-to-tr from-purple-600/10 to-indigo-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-gradient-to-bl from-cyan-500/10 to-blue-600/10 blur-[130px] pointer-events-none" />

      {/* Modern Header */}
      <header className="w-full border-b border-slate-900 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-black text-white text-lg">
              ⚡
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white">NEXUS</span>
              <span className="text-[10px] block font-mono text-cyan-400 leading-none">ROUTING PORTAL</span>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Route: /product/price
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 flex-1 flex flex-col justify-center">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/30 border border-cyan-800/30 px-3.5 py-1 rounded-full uppercase tracking-wider">
            Step 1: Select Your Node Tier
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-4 tracking-tight leading-tight">
            Flexible Power For <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">Every Developer</span>
          </h1>
          <p className="text-slate-400 mt-4 text-lg">
            Choose a deployment environment. The link dynamic router will pass your selection code directly to the checkout cluster builder.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto w-full">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 relative ${
                plan.popular
                  ? 'bg-slate-900/80 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.15)] scale-100 md:scale-105 z-10'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700/80 hover:bg-slate-900/60'
              }`}
            >
              {/* Card Ribbon / Badge */}
              <div className="absolute top-5 right-5">
                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border ${
                  plan.popular
                    ? 'bg-purple-950/80 text-purple-400 border-purple-800/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}>
                  {plan.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px] mb-6">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 mb-6 border-b border-slate-800 pb-6">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono">{plan.price}</span>
                  <span className="text-xs text-slate-500">/ {plan.period}</span>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm">
                      <span className="text-cyan-400 font-bold select-none text-xs mt-0.5">✔</span>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dynamic Route Button */}
              <Link 
                href={`/product/price/${plan.id}`}
                className={`w-full py-3.5 rounded-xl font-extrabold text-sm text-center transition-all duration-300 shadow-md ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-950/20 active:scale-98'
                    : 'bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-800 hover:border-slate-700 active:scale-98'
                }`}
              >
                {plan.btnText} →
              </Link>
            </div>
          ))}
        </div>

        {/* Dynamic Route Tester Card */}
        <div className="mt-16 max-w-md mx-auto p-5 rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 text-center relative">
          <h4 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-widest mb-1.5">🚀 Custom Route Playground</h4>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            Since this page uses dynamic segment routing, any value in the URL path is resolved. Enter a custom ID below to test the dynamic fallback:
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <span className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-500 font-mono flex items-center">
              /price/
            </span>
            <input
              type="text"
              id="custom-id-input"
              placeholder="e.g. shiv"
              defaultValue="shiv"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-purple-500 font-mono"
            />
            <button
              onClick={() => {
                const val = document.getElementById('custom-id-input')?.value || 'shiv';
                window.location.href = `/product/price/${val}`;
              }}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 rounded-lg transition-colors active:scale-95"
            >
              Go
            </button>
          </div>
        </div>

      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-slate-900/60 bg-slate-950/40 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Nexus Inc. Practicing dynamic next segments.</p>
      </footer>

    </div>
  )
}

export default PricingPage