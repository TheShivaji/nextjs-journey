import Stripe from "stripe";

export const stripeClient =
    typeof window === "undefined" && process.env.STRIPE_SECRET_KEY
        ? new Stripe(process.env.STRIPE_SECRET_KEY)
        : (null as unknown as Stripe);

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;

export const STRIPE_PRICE_IDs = {
    premium: "price_1TvaPp1pcF3w2aX9vLSu7M1v"
} as const;