import { requireAuth } from "@/lib/auth.until";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"
import { stripeClient } from "@/lib/stripe";
export async function POST(request: NextRequest) {

    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    try {
        const session = await requireAuth()

        if (!session) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 })
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!dbUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }
        if (!dbUser.stripeCustomerId) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }
        const cancelSession = await stripeClient.billingPortal.sessions.create({
            customer: dbUser.stripeCustomerId,
            return_url: `${baseURL}/payment-plan`
        })
        return NextResponse.json({ url: cancelSession.url })


    } catch (error) {
        console.error("Error in stripe portal:", error)
        return NextResponse.json({ error: "Error in stripe portal" }, { status: 500 })
    }
}