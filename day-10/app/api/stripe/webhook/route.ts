import { stripeClient } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { STRIPE_PRICE_IDs } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    if (!webhookSecret) {
        return NextResponse.json(
            { error: "Missing Stripe webhook secret" },
            { status: 500 }
        );
    }

    console.log("🔔 Webhook received! Event type:" );


    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing Stripe signature" },
            { status: 400 }
        );
    }

    const rawBody = await req.text();

    let event: Stripe.Event;

    try {
        event = stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
        return NextResponse.json(
            { error: "Invalid Stripe signature" },
            { status: 400 }
        );
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;

                const userId = session.metadata?.userId;
                
                if (!userId || !session.subscription) {
                    console.error("Missing metadata", session);
                    return NextResponse.json(
                        { error: "Missing metadata" },
                        { status: 400 }
                    );
                }

                const subscription = await stripeClient.subscriptions.retrieve(session.subscription as string);

                // Retrieve the actual price ID from the subscription items
                const priceId = subscription.items.data[0]?.price.id;

                let plan = "FREE";
                if (priceId === STRIPE_PRICE_IDs.premium) {
                    plan = "PREMIUM";
                }

                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        stripeCustomerId: subscription.customer as string,
                        stripeSubscriptionId: subscription.id,
                        stripePriceId: priceId,
                        stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
                        plan: plan as any,
                    }
                });

                break;
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const user = await prisma.user.findFirst({
                    where: { stripeCustomerId: customerId },
                });

                if (!user) break;

                // 🔥 derive plan from STRIPE (not DB)
                const priceId = subscription.items.data[0]?.price.id;

                const isActive = subscription.status === "active";

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        stripePriceId: priceId,
                        stripeCurrentPeriodEnd: new Date(
                            subscription.items.data[0].current_period_end * 1000,
                        ),
                        plan: isActive && priceId === STRIPE_PRICE_IDs.premium ? "PREMIUM" : "FREE",
                    },
                });

                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const user = await prisma.user.findFirst({
                    where: { stripeCustomerId: customerId },
                });

                if (!user) break;

                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        stripeSubscriptionId: null,
                        stripePriceId: null,
                        stripeCurrentPeriodEnd: null,
                        plan: "FREE",
                    },
                });

                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            { error: "Error processing webhook" },
            { status: 500 },
        );
    }
}