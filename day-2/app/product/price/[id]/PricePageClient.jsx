"use client";

import React, { useState, useEffect } from 'react';

// Predefined add-ons
const ADD_ONS = [
  { id: 'sla', name: 'Priority 1h SLA Support', price: 19, description: 'Direct Slack channel & 1-hour response times guaranteed' },
  { id: 'gpu', name: 'Dedicated High-Perf GPU Node', price: 49, description: 'Access to high-throughput compute units for processing' },
  { id: 'logs', name: '30-Day Extended Logs', price: 9, description: 'Store and search history logs for auditing & debug operations' }
];

// Predefined FAQs
const FAQS = [
  { q: "How does the pricing scale?", a: "Your subscription includes a generous baseline quota. If you exceed your limit, we'll notify you and charge a nominal overage fee on a per-request basis." },
  { q: "Can I change my plan or cancel at any time?", a: "Absolutely. You can upgrade, downgrade, or cancel your subscription directly from your settings dashboard. Downgrades take effect at the end of the billing cycle." },
  { q: "Is there a free trial for the premium tiers?", a: "Yes, you can request a 14-day fully-featured trial of our Developer Pro plan. Contact our support or spin up a Starter Sandbox to test drive our APIs." },
  { q: "Do you offer discounts for open source or startups?", a: "We love supporting the developer community! Reach out to us with your project details to get a 50% discount for up to 12 months." }
];

export default function PricePageClient({ id }) {
  // 1. Resolve Plan Details based on dynamic ID
  const getPlanDetails = (planId) => {
    const cleanId = (planId || '').toLowerCase();
    if (cleanId === 'pro') {
      return {
        name: 'Developer Pro',
        badge: 'Most Popular',
        basePrice: 49,
        description: 'Advanced capabilities, higher quotas, and dedicated compute for growing developers and teams.',
        features: [
          'Up to 250,000 API requests/mo',
          '50 active projects & databases',
          'Standard Support (24h SLA)',
          'Advanced dashboard & logs',
          'Team collaborations (up to 5 members)',
        ],
        specs: { cpu: 85, ram: 70, speed: 90, storage: 80 }
      };
    } else if (cleanId === 'enterprise') {
      return {
        name: 'Enterprise Elite',
        badge: 'Custom Control',
        basePrice: 299,
        description: 'Maximum throughput, guaranteed SLA uptime, custom compliance and dedicated high-performance resources.',
        features: [
          'Unlimited API requests/mo',
          'Unlimited projects & custom clusters',
          'Premium Dedicated SLA (1h response)',
          'Real-time compliance audit logs',
          'Dedicated GPU compute instances',
          'SSO / SAML authentication integration',
        ],
        specs: { cpu: 99, ram: 95, speed: 99, storage: 99 }
      };
    } else if (cleanId === 'free' || cleanId === 'starter') {
      return {
        name: 'Starter Sandbox',
        badge: 'Free Tier',
        basePrice: 0,
        description: 'Get started, learn Next.js, and prototype applications in our sandbox cloud with zero billing.',
        features: [
          '5,000 free API requests/mo',
          '3 active sandbox projects',
          'Community support & discussions',
          'Basic logs (last 24 hours only)',
        ],
        specs: { cpu: 25, ram: 30, speed: 45, storage: 20 }
      };
    } else {
      // Dynamic fallback for custom IDs
      const hash = cleanId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 42;
      const calculatedPrice = (hash % 13) * 10 + 29; // $29 to $149
      return {
        name: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Premium`,
        badge: 'Custom Sandbox',
        basePrice: calculatedPrice,
        description: `A custom-tailored API runtime environment specifically generated for the '${planId}' node context.`,
        features: [
          `Custom dedicated cluster: ${planId}`,
          '50,000 default monthly credits',
          'Standard support channels',
          'Daily system snapshots',
          'Global Edge deployment network',
        ],
        specs: { 
          cpu: 50 + (hash % 30), 
          ram: 45 + (hash % 35), 
          speed: 60 + (hash % 25), 
          storage: 50 + (hash % 40) 
        }
      };
    }
  };

  const plan = getPlanDetails(id);

  // 2. States
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'features' | 'comparison'
  const [faqOpen, setFaqOpen] = useState(null);

  // Credit Card States
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardFlipped, setCardFlipped] = useState(false);

  // Payment Flow States
  const [paymentStep, setPaymentStep] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [loadingText, setLoadingText] = useState('');
  const [txnId, setTxnId] = useState('');

  // 3. Billing calculations
  const calculateTotal = () => {
    // 20% discount on base price for annual
    const base = isAnnual ? plan.basePrice * 0.8 : plan.basePrice;
    const addOnsTotal = selectedAddOns.reduce((acc, addOnId) => {
      const item = ADD_ONS.find(a => a.id === addOnId);
      return acc + (item ? item.price : 0);
    }, 0);
    return Math.round((base + addOnsTotal) * 100) / 100;
  };

  const toggleAddOn = (addOnId) => {
    if (selectedAddOns.includes(addOnId)) {
      setSelectedAddOns(selectedAddOns.filter(id => id !== addOnId));
    } else {
      setSelectedAddOns([...selectedAddOns, addOnId]);
    }
  };

  // Card input formatters
  const handleCardNumChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    // Format: 4444 4444 4444 4444
    const matches = value.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = value.length; i < len; i += 4) {
      parts.push(value.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNum(parts.join(' '));
    } else {
      setCardNum(value);
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCardCvv(value);
  };

  // Simulate premium payment
  const handlePayment = (e) => {
    e.preventDefault();
    if (plan.basePrice === 0 && selectedAddOns.length === 0) {
      // Free plan checkout
      setPaymentStep('processing');
      const processTexts = [
        'Connecting to Cluster Provisioner...',
        'Creating isolated virtual environments...',
        'Registering OAuth webhooks...',
        'Activating Starter Sandbox Workspace!'
      ];
      let stepIndex = 0;
      setLoadingText(processTexts[0]);

      const interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < processTexts.length) {
          setLoadingText(processTexts[stepIndex]);
        } else {
          clearInterval(interval);
          setTxnId(`TXN-SDBX-${Math.floor(Math.random() * 900000 + 100000)}`);
          setPaymentStep('success');
        }
      }, 900);
      return;
    }

    // Paid Plan validation check
    if (!cardNum || cardNum.length < 19 || !cardName || !cardExpiry || cardExpiry.length < 5 || !cardCvv || cardCvv.length < 3) {
      alert("Please fill out all card payment fields correctly before making a payment.");
      return;
    }

    setPaymentStep('processing');
    const paymentSteps = [
      'Establishing secure SSL/TLS connection...',
      'Tokenizing card details via AES-256 vault...',
      'Contacting card issuer network bank...',
      'Simulating smart contract authorization...',
      'Finalizing deployment quotas on Edge Server...',
      'Payment verified. Workspace Activated!'
    ];

    let index = 0;
    setLoadingText(paymentSteps[0]);

    const interval = setInterval(() => {
      index++;
      if (index < paymentSteps.length) {
        setLoadingText(paymentSteps[index]);
      } else {
        clearInterval(interval);
        setTxnId(`TXN-SEC-${Math.floor(Math.random() * 90000000 + 10000000)}`);
        setPaymentStep('success');
      }
    }, 800);
  };

  // Confetti particles for success state
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (paymentStep === 'success') {
      const colors = ['#a855f7', '#06b6d4', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];
      const newParticles = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage
        y: -10 - Math.random() * 20, // offset top
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 2,
        angle: Math.random() * 360,
      }));
      setParticles(newParticles);
    }
  }, [paymentStep]);

  return (
    <div className="relative min-h-screen text-slate-100 bg-[#090b11] overflow-hidden selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] rounded-full bg-gradient-to-tr from-purple-600/15 to-indigo-600/10 blur-[130px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] rounded-full bg-gradient-to-bl from-cyan-500/10 to-blue-600/15 blur-[130px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full bg-pink-500/5 blur-[100px] pointer-events-none" />

      {/* Embedded CSS for 3D Card Flipping & Custom Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .card-shadow {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fall {
          0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}} />

      {/* Success Confetti Overlay */}
      {paymentStep === 'success' && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute animate-fall"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                transform: `rotate(${p.angle}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Sleek Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-purple-500/20">
              ⚡
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                NEXUS
              </span>
              <span className="text-[10px] block font-mono text-cyan-400/90 tracking-widest leading-none">CLOUD DEPLOY</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400 font-medium">
            <a href="#" className="hover:text-purple-400 transition-colors">Products</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Templates</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Docs</a>
            <span className="text-slate-800">|</span>
            <span className="text-xs font-mono text-purple-400 bg-purple-950/50 border border-purple-500/20 px-2 py-0.5 rounded">
              Route: [id] = {id}
            </span>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono px-2 py-1 bg-slate-900 border border-slate-800 rounded text-slate-400">
              API STATUS: ONLINE
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Dynamic Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-mono mb-4 shadow-sm backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            Active Node Selection: <span className="font-bold text-white uppercase">{id}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            Deploy <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-200 to-cyan-400">{plan.name}</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            {plan.description} Configure add-ons, view specs, and activate your environment in seconds.
          </p>
        </div>

        {/* Dynamic Processing/Success Steps Overlays */}
        {paymentStep === 'processing' && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 animate-pulse" />
              
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-cyan-400 animate-spin" />
                <div className="absolute inset-2 bg-slate-950 rounded-full flex items-center justify-center text-2xl">
                  🔒
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Processing Sandbox Provisioning</h3>
              <p className="text-slate-400 text-sm font-mono mb-6 bg-slate-950 py-3 px-4 rounded-xl border border-slate-800">
                {loadingText}
              </p>
              
              <div className="flex gap-2 justify-center">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-200" />
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce delay-300" />
              </div>
            </div>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-xl bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
              
              {/* Glowing header */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-purple-600/20 to-transparent blur-xl rounded-full" />
              
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
                ✓
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-center text-white mb-1">Deployment Successful!</h2>
              <p className="text-center text-emerald-400 text-sm font-mono mb-6">Cluster provisioning code complete</p>

              {/* Receipt Body */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 mb-6 text-sm font-mono relative">
                
                {/* Visual side cuts */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900" />
                
                <div className="border-b border-dashed border-slate-800 pb-4 mb-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500">TRANSACTION ID</p>
                    <p className="text-white font-bold text-xs sm:text-sm">{txnId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">DATE & TIME</p>
                    <p className="text-white text-xs">{new Date().toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2.5 pb-4 mb-4 border-b border-dashed border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Selected Node Tier:</span>
                    <span className="text-purple-400 font-bold">{plan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Billing Interval:</span>
                    <span className="text-white">{isAnnual ? 'Annual (20% off)' : 'Monthly'}</span>
                  </div>
                  {selectedAddOns.map(addOnId => {
                    const item = ADD_ONS.find(a => a.id === addOnId);
                    return item ? (
                      <div key={addOnId} className="flex justify-between text-xs text-slate-400 pl-3">
                        <span>+ {item.name}:</span>
                        <span>${item.price}/mo</span>
                      </div>
                    ) : null;
                  })}
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs text-slate-500">CHARGED AMOUNT</span>
                    <p className="text-xs text-slate-400">{isAnnual ? 'Annually compiled rate' : 'Monthly bill'}</p>
                  </div>
                  <span className="text-2xl font-black text-cyan-400 bg-cyan-950/20 border border-cyan-500/10 px-3 py-1 rounded">
                    ${calculateTotal()}<span className="text-xs font-normal text-slate-500">/mo</span>
                  </span>
                </div>
              </div>

              {/* Success Actions */}
              <div className="space-y-3">
                <button 
                  onClick={() => window.print()}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-bold rounded-xl transition-all border border-slate-700/50 flex justify-center items-center gap-2 text-sm"
                >
                  🖨 Print Receipt
                </button>
                <button
                  onClick={() => setPaymentStep('idle')}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-98 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all text-sm"
                >
                  Go back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details, Specs & Features (8 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Tabs for Info Selection */}
            <div className="bg-slate-900/60 border border-slate-800/80 p-1.5 rounded-2xl flex gap-1 shadow-inner">
              <button
                onClick={() => setActiveTab('specs')}
                className={`flex-1 py-3 text-center text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                  activeTab === 'specs' 
                    ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 shadow border border-purple-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📊 Allocated Specs
              </button>
              <button
                onClick={() => setActiveTab('features')}
                className={`flex-1 py-3 text-center text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                  activeTab === 'features' 
                    ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 shadow border border-purple-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ✓ Included Features
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`flex-1 py-3 text-center text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                  activeTab === 'comparison' 
                    ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 shadow border border-purple-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ⇄ Tier Comparison
              </button>
            </div>

            {/* Tab 1: Specs View (Interactive visualizer) */}
            {activeTab === 'specs' && (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-slate-600">SPEC_METRIC_V1</div>
                
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>Resource Allocations</span>
                  <span className="text-xs bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/40 font-mono">Dynamic</span>
                </h3>

                <div className="space-y-6">
                  {/* CPU Metric */}
                  <div className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <span>💻</span> CPU Cluster Priority
                      </span>
                      <span className="text-sm font-mono font-bold text-purple-400">{plan.specs.cpu}% Capacity</span>
                    </div>
                    <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(168,85,247,0.4)]"
                        style={{ width: `${plan.specs.cpu}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 pl-1">Determines container execution priority and vCPU clock quota scale.</p>
                  </div>

                  {/* RAM Metric */}
                  <div className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <span>⚡</span> Isolated RAM Allocation
                      </span>
                      <span className="text-sm font-mono font-bold text-cyan-400">{plan.specs.ram}% Scaled</span>
                    </div>
                    <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                        style={{ width: `${plan.specs.ram}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 pl-1">Memory cache limits before garbage collection & swapping routines trigger.</p>
                  </div>

                  {/* Network Speed Metric */}
                  <div className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <span>🛜</span> Global Edge Bandwidth
                      </span>
                      <span className="text-sm font-mono font-bold text-pink-400">{plan.specs.speed} Gbps Peak</span>
                    </div>
                    <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
                      <div 
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(236,72,153,0.4)]"
                        style={{ width: `${plan.specs.speed}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 pl-1">Bandwidth prioritization across global network POPs and CDNs.</p>
                  </div>

                  {/* Storage IOPS Metric */}
                  <div className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <span>💾</span> NVMe Storage I/O Read/Write
                      </span>
                      <span className="text-sm font-mono font-bold text-amber-400">{plan.specs.storage}% IOPS</span>
                    </div>
                    <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                        style={{ width: `${plan.specs.storage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 pl-1">Guaranteed SSD disk operation speed for high-volume transactions.</p>
                  </div>

                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/80 bg-slate-950/40 -mx-6 -mb-6 p-6 flex flex-col sm:flex-row gap-4 justify-between items-center rounded-b-3xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">Edge Node Acceleration</p>
                      <p className="text-xs text-slate-400">Containers deploy globally within 180ms.</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 border border-cyan-800/30 px-3 py-1.5 rounded-full bg-cyan-950/20">
                    HTTP/3 SUPPORTED
                  </span>
                </div>
              </div>
            )}

            {/* Tab 2: Features List */}
            {activeTab === 'features' && (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6">What is included in this node</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plan.features.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 bg-slate-950/40 border border-slate-800/50 rounded-2xl flex items-start gap-3 hover:border-purple-500/20 hover:bg-slate-950/80 transition-all duration-300"
                    >
                      <span className="text-emerald-400 text-lg flex-shrink-0 mt-0.5">✔</span>
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-2xl border border-slate-800 bg-slate-950/30 flex items-center gap-4 text-xs text-slate-400">
                  <span className="text-xl">ℹ</span>
                  <p>All core runtime environments are continuously monitored and automatically restarted on node failures. Backups are snapshotted in multi-region secure zones.</p>
                </div>
              </div>
            )}

            {/* Tab 3: Detailed comparison table */}
            {activeTab === 'comparison' && (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md transition-all duration-300">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">Tier Comparison Table</h3>
                  <p className="text-xs text-slate-400 mt-1">Cross-check metrics to find the optimal deployment model.</p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/50">
                        <th className="p-4 font-semibold text-slate-400">Metric / Feature</th>
                        <th className="p-4 font-semibold text-slate-400">Sandbox</th>
                        <th className="p-4 font-semibold text-purple-400">Pro Developer</th>
                        <th className="p-4 font-semibold text-cyan-400">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      <tr>
                        <td className="p-4 font-medium text-slate-300">Base Price</td>
                        <td className="p-4 font-mono text-slate-400">$0/mo</td>
                        <td className="p-4 font-mono text-purple-300 font-bold">$49/mo</td>
                        <td className="p-4 font-mono text-cyan-300 font-bold">$299/mo</td>
                      </tr>
                      <tr className="bg-slate-950/20">
                        <td className="p-4 font-medium text-slate-300">API Limit</td>
                        <td className="p-4 text-slate-400">5k req/mo</td>
                        <td className="p-4 text-purple-300 font-semibold">250k req/mo</td>
                        <td className="p-4 text-cyan-300 font-bold">Unlimited</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-slate-300">Node Speed Limit</td>
                        <td className="p-4 text-slate-400">1 Gbps Shared</td>
                        <td className="p-4 text-white">5 Gbps Burst</td>
                        <td className="p-4 text-cyan-400 font-semibold">10 Gbps Dedicated</td>
                      </tr>
                      <tr className="bg-slate-950/20">
                        <td className="p-4 font-medium text-slate-300">SLA Support</td>
                        <td className="p-4 text-slate-500">None (Community)</td>
                        <td className="p-4 text-white">24-hour Response</td>
                        <td className="p-4 text-emerald-400 font-bold">1-hour Guaranteed</td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium text-slate-300">Compliance SSO</td>
                        <td className="p-4 text-slate-500">Not Available</td>
                        <td className="p-4 text-slate-500">Not Available</td>
                        <td className="p-4 text-emerald-400 font-bold">Included (SAML)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Custom Configuration Section: Addons & Upgrades */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              <h3 className="text-xl font-bold text-white mb-2">Enhance Node Environment</h3>
              <p className="text-slate-400 text-sm mb-6">Inject premium system extensions directly into your dynamic runtime.</p>
              
              <div className="space-y-4">
                {ADD_ONS.map(addOn => {
                  const isChecked = selectedAddOns.includes(addOn.id);
                  return (
                    <div 
                      key={addOn.id}
                      onClick={() => toggleAddOn(addOn.id)}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer select-none flex items-start gap-4 ${
                        isChecked 
                          ? 'border-purple-500 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.05)]' 
                          : 'border-slate-800 bg-slate-950/20 hover:border-slate-700/80 hover:bg-slate-950/40'
                      }`}
                    >
                      <div className="mt-1 flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by click on container
                          className="w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-slate-900 bg-slate-950 accent-purple-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-white">{addOn.name}</h4>
                          <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 border border-purple-500/20 px-2 py-0.5 rounded">
                            +${addOn.price}/mo
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{addOn.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive FAQs Accordion */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
              <h3 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h3>
              
              <div className="space-y-3">
                {FAQS.map((faq, index) => {
                  const isOpen = faqOpen === index;
                  return (
                    <div 
                      key={index}
                      className="border border-slate-800/80 rounded-2xl bg-slate-950/20 overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => setFaqOpen(isOpen ? null : index)}
                        className="w-full p-4 text-left flex justify-between items-center gap-4 text-slate-200 font-semibold hover:text-white transition-colors"
                      >
                        <span className="text-sm sm:text-base">{faq.q}</span>
                        <span className={`text-xl text-purple-400 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                          +
                        </span>
                      </button>
                      
                      <div 
                        className={`transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-40 border-t border-slate-800/60' : 'max-h-0'
                        } overflow-hidden`}
                      >
                        <p className="p-4 text-xs sm:text-sm text-slate-400 leading-relaxed bg-slate-950/40">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Checkout Card & Simulated 3D Payment Portal (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            
            {/* Realtime Pricing Preview & Payment Card */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              {/* Highlight ribbon for paid tiers */}
              {plan.basePrice > 0 && (
                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
                  <div className="bg-gradient-to-r from-purple-600 to-cyan-500 text-[10px] font-black text-white text-center py-1.5 w-[200px] absolute top-6 -right-[55px] rotate-45 uppercase tracking-wider shadow-sm">
                    SECURED NODE
                  </div>
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-6">Payment Configuration</h3>

              {/* Monthly/Annual Toggle Switch */}
              <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={() => setIsAnnual(false)}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    !isAnnual 
                      ? 'bg-slate-900 text-white border border-slate-800 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Monthly billing
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnnual(true)}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative flex justify-center items-center gap-1.5 ${
                    isAnnual 
                      ? 'bg-slate-900 text-white border border-slate-800 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Annual Billing
                  <span className="bg-purple-950 border border-purple-500/30 text-purple-400 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full">
                    SAVE 20%
                  </span>
                </button>
              </div>

              {/* Price Calculation details */}
              <div className="space-y-3.5 mb-6 text-sm">
                <div className="flex justify-between items-baseline text-slate-400">
                  <span>Base Plan ({plan.name})</span>
                  <span className="font-mono text-white">
                    {isAnnual ? (
                      <>
                        <span className="line-through text-slate-500 mr-2">${plan.basePrice}</span>
                        <span>${plan.basePrice * 0.8}</span>
                      </>
                    ) : (
                      `$${plan.basePrice}`
                    )}
                    /mo
                  </span>
                </div>

                {selectedAddOns.map(addOnId => {
                  const item = ADD_ONS.find(a => a.id === addOnId);
                  return item ? (
                    <div key={addOnId} className="flex justify-between items-baseline text-slate-400 text-xs sm:text-sm">
                      <span className="flex items-center gap-1.5 text-purple-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        {item.name}
                      </span>
                      <span className="font-mono text-white">+${item.price}/mo</span>
                    </div>
                  ) : null;
                })}

                <div className="border-t border-slate-800 pt-4 mt-2 flex justify-between items-end">
                  <div>
                    <span className="font-extrabold text-white text-base">Total billing cost</span>
                    <span className="text-xs block text-slate-500">
                      {isAnnual ? `Billed annually ($${calculateTotal() * 12}/yr)` : 'Renews monthly'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 font-mono">
                      ${calculateTotal()}
                    </span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Credit Card (Only displays when price > 0) */}
              {calculateTotal() > 0 ? (
                <div className="mb-6">
                  {/* Container for card perspective */}
                  <div className="w-full max-w-[340px] h-[200px] mx-auto perspective-1000 group cursor-pointer relative mb-6">
                    {/* The Flipping Inner Box */}
                    <div className={`w-full h-full preserve-3d transition-transform duration-700 ease-out relative ${
                      cardFlipped ? 'rotate-y-180' : ''
                    }`}>
                      
                      {/* CARD FRONT */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950 border border-slate-800/80 p-5 flex flex-col justify-between card-shadow backface-hidden overflow-hidden">
                        
                        {/* Futuristic circuits layout background */}
                        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />
                        <div className="absolute top-[-30%] right-[-20%] w-[160px] h-[160px] rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono text-cyan-400 tracking-widest leading-none block">SECURE GATEWAY</span>
                            <span className="text-xs font-black text-white">NEXUS BLACK</span>
                          </div>
                          
                          {/* Card Chip SVG */}
                          <div className="w-10 h-7 rounded bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 p-1 flex flex-col justify-between">
                            <div className="border border-amber-900/10 w-full h-1/3 rounded-sm opacity-60" />
                            <div className="border border-amber-900/10 w-full h-1/3 rounded-sm opacity-60" />
                          </div>
                        </div>

                        {/* Card Number display */}
                        <div className="my-auto">
                          <p className="text-lg sm:text-xl font-mono text-center tracking-widest text-slate-100 font-bold bg-slate-950/20 py-1 rounded">
                            {cardNum || '•••• •••• •••• ••••'}
                          </p>
                        </div>

                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[8px] text-slate-500 tracking-wider">CARD HOLDER</p>
                            <p className="text-xs font-mono font-bold text-slate-200 tracking-wide uppercase truncate max-w-[150px]">
                              {cardName || 'YOUR FULL NAME'}
                            </p>
                          </div>
                          
                          <div className="flex gap-4">
                            <div>
                              <p className="text-[8px] text-slate-500 tracking-wider">EXPIRES</p>
                              <p className="text-xs font-mono font-bold text-slate-200">
                                {cardExpiry || 'MM/YY'}
                              </p>
                            </div>
                            
                            {/* Card Brand (Mastercard style mockup) */}
                            <div className="flex items-center -space-x-2.5">
                              <div className="w-5.5 h-5.5 rounded-full bg-pink-500/90" />
                              <div className="w-5.5 h-5.5 rounded-full bg-purple-500/90" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CARD BACK */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-bl from-purple-950 via-slate-900 to-indigo-950 border border-slate-800 p-5 flex flex-col justify-between card-shadow backface-hidden rotate-y-180">
                        {/* Magnetic Strip */}
                        <div className="w-full h-10 bg-slate-950 -mx-5 mt-2" />
                        
                        {/* Signature Stripe & CVV box */}
                        <div className="flex items-center gap-3 mt-4">
                          <div className="flex-1 h-8 bg-slate-800/80 rounded px-3 flex items-center font-mono italic text-[11px] text-slate-400 select-none">
                            Nexus Security Auth
                          </div>
                          <div className="w-14 h-8 bg-amber-400 text-slate-950 rounded flex items-center justify-center font-mono font-bold text-sm shadow">
                            {cardCvv || '•••'}
                          </div>
                        </div>

                        <div className="text-[8px] text-slate-500 leading-tight">
                          This credit card simulation represents a dummy payment terminal. Do not enter real sensitive financial credentials; use fake mock values to test.
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Payment Form Fields */}
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Card Number</label>
                      <input
                        type="text"
                        required
                        value={cardNum}
                        onChange={handleCardNumChange}
                        placeholder="4444 4444 4444 4444"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Expiration Date</label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">CVV (3 Digits)</label>
                        <input
                          type="text"
                          required
                          value={cardCvv}
                          onChange={handleCvvChange}
                          onFocus={() => setCardFlipped(true)}
                          onBlur={() => setCardFlipped(false)}
                          placeholder="***"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm rounded-xl transition-all duration-300 transform active:scale-98 shadow-lg shadow-purple-600/20 hover:shadow-cyan-500/20 flex justify-center items-center gap-2 group relative overflow-hidden"
                    >
                      <span className="absolute inset-0 w-full h-full bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                      🔒 Confirm & Provision Environment
                    </button>
                  </form>
                </div>
              ) : (
                /* Free Tier Action Button */
                <div className="space-y-4">
                  <div className="p-4 bg-purple-950/20 border border-purple-500/10 rounded-2xl text-xs text-purple-300 leading-relaxed">
                    You have selected a free sandbox deployment environment. No billing credentials or card verification are required to activate this cluster.
                  </div>
                  
                  <button
                    onClick={handlePayment}
                    className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 active:scale-98 text-white font-extrabold text-sm rounded-xl transition-all border border-slate-700/60 shadow-md flex justify-center items-center gap-2"
                  >
                    🚀 Provision Sandbox Node
                  </button>
                </div>
              )}

              {/* Secure statement */}
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500">
                <span>🛡️</span>
                <span>PCI-DSS COMPLIANT AES-256 SECURED LINK</span>
              </div>

            </div>

            {/* Micro Trust badge / customer testimonial inside card */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 text-yellow-500/40 text-lg">★ ★ ★ ★ ★</div>
              <p className="text-slate-300 text-xs italic leading-relaxed mb-3">
                "We migrated our dynamic NextJS routing configurations over to Nexus Edge Clusters. The routing latency dropped by 70%, and resource pricing is the most competitive in the industry."
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-purple-400">
                  SK
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Shiva K.</p>
                  <p className="text-[10px] text-slate-500">Principal Architect, DevFlow Labs</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-900 bg-slate-950/80 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚡</span>
            <span>© {new Date().getFullYear()} Nexus Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">System Status</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
