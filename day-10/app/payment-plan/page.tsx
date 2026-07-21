import React from 'react';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth.until';
import { prisma } from '@/lib/prisma';
import { PricingCards } from '@/components/pricing-cards';

export default async function PaymentPlanPage() {
    const session = await requireAuth();

    if (!session) {
        redirect('/login');
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    const currentPlan = dbUser?.plan || 'FREE';

    return (
        <section className="min-h-screen bg-[#09090B] py-16 px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold tracking-tight text-white">
                        Choose Your Plan
                    </h2>
                    <p className="mt-3 text-zinc-400">
                        Start for free and upgrade anytime.
                    </p>
                </div>

                <PricingCards currentPlan={currentPlan} />
            </div>
        </section>
    );
}