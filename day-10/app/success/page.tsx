import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth.until';
import { prisma } from '@/lib/prisma';
import { stripeClient } from '@/lib/stripe';

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const session = await requireAuth();
  if (!session) redirect('/login');

  const { session_id } = await searchParams;

  if (session_id && stripeClient) {
    try {
      const checkoutSession = await stripeClient.checkout.sessions.retrieve(session_id);
      if (checkoutSession.payment_status === 'paid') {
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            plan: 'PREMIUM',
            stripeSubscriptionId: checkoutSession.subscription as string,
          },
        });
      }
    } catch (error) {
      console.error('Error verifying Stripe session:', error);
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl border border-violet-500/30 bg-zinc-900/80 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-600/20 text-violet-400 text-4xl">
          🎉
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Payment Successful!
        </h1>
        <p className="text-zinc-400 text-sm mb-6">
          Thank you for subscribing! Your account has been upgraded to the{' '}
          <span className="font-semibold text-violet-400">PREMIUM</span> plan.
        </p>

        <Link
          href="/dashboard"
          className="inline-block w-full rounded-xl bg-violet-600 py-3 text-center font-semibold text-white transition hover:bg-violet-500 shadow-lg shadow-violet-600/30"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
