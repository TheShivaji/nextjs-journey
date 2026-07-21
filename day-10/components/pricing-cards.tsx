"use client";

import React from 'react';
import { STRIPE_PRICE_IDs } from '@/lib/stripe';

interface PricingCardsProps {
    currentPlan: string;
}

export const PricingCards = ({ currentPlan }: PricingCardsProps) => {
    const isPremium = currentPlan === "PREMIUM";

    const pricingPlans = [
        {
            id: "free",
            name: "Free",
            price: 0,
            priceId: null,
            currency: "$",
            description: "Perfect for getting started.",
            buttonText: !isPremium ? "Current Plan" : "Free Tier",
            popular: false,
            disabled: !isPremium,
            features: [
                "Basic AI access",
                "5 requests per day",
                "Community support",
            ],
        },
        {
            id: "premium",
            name: "Premium",
            price: 10,
            priceId: STRIPE_PRICE_IDs.premium,
            currency: "$",
            description: "Best for developers and power users.",
            buttonText: isPremium ? "Current Active Plan ✨" : "Upgrade Now",
            popular: true,
            disabled: false,
            features: [
                "Unlimited AI requests",
                "Priority responses",
                "Premium AI models",
                "Email support",
                "Early access to new features",
            ],
        },
    ];

    const handleSubscribe = async (priceId: string | null) => {
        if (isPremium) {
            try {
                const res = await fetch("/api/stripe/portal", { method: "POST" });
                const data = await res.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    alert(data.error || data.message || "Failed to open portal");
                }
            } catch (err) {
                console.error("Portal error:", err);
                alert("Failed to open management portal");
            }
            return;
        }

        if (!priceId) {
            alert("This plan is free. No need to subscribe.");
            return;
        }

        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({ priceId }),
            });

            if (res.ok) {
                const data = await res.json();
                window.location.href = data.url;
            } else {
                throw new Error("Failed to create payment session");
            }
        } catch (error) {
            console.error("Error creating checkout session:", error);
            alert("Failed to create payment session");
        }
    };

    return (
        <div className="grid gap-8 md:grid-cols-2">
            {pricingPlans.map((plan) => (
                <div
                    key={plan.id}
                    className={`relative rounded-3xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                        plan.popular
                            ? "border-violet-500 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-violet-500/20"
                            : "border-zinc-800 bg-zinc-900/70"
                    }`}
                >
                    {plan.popular && (
                        <span className="absolute right-5 top-5 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                            Most Popular
                        </span>
                    )}

                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-white">
                            {plan.name}
                        </h3>

                        <div className="mt-6 flex items-end gap-1">
                            <span className="text-5xl font-bold text-white">
                                {plan.currency}
                                {plan.price}
                            </span>

                            <span className="mb-1 text-zinc-400">
                                /month
                            </span>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-zinc-400">
                            {plan.description}
                        </p>

                        <button
                            disabled={plan.disabled}
                            onClick={() => handleSubscribe(plan.priceId)}
                            className={`mt-8 w-full rounded-xl py-3 font-semibold transition ${
                                plan.disabled
                                    ? "bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-75 border border-zinc-700"
                                    : plan.popular
                                    ? "bg-violet-600 text-white hover:bg-violet-500 cursor-pointer shadow-lg shadow-violet-600/30"
                                    : "bg-zinc-800 text-white hover:bg-zinc-700 cursor-pointer"
                            }`}
                        >
                            {plan.buttonText}
                        </button>

                        <div className="my-8 h-px bg-zinc-800" />

                        <ul className="space-y-4">
                            {plan.features.map((feature) => (
                                <li
                                    key={feature}
                                    className="flex items-center gap-3 text-zinc-300"
                                >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600/20">
                                        <span className="text-sm text-violet-400">
                                            ✓
                                        </span>
                                    </div>

                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};
