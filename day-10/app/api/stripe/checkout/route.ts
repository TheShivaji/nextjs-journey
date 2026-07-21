import { PrismaClient } from "@/lib/generated/prisma/client";

import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth.until";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe";

export async function POST(request: NextRequest) {
    try{
const session = await requireAuth();

if(!session) {
    return NextResponse.json({error:"Unauthorized"},{status:401})
}
const {priceId} = await request.json();

if(!priceId) {
    return NextResponse.json({error:"Price ID is required"},{status:400})
}

const user = await prisma.user.findUnique({
    where:{id:session.user.id}
})

if(!user) {
    return NextResponse.json({error:"User not found"},{status:404})
}

let customerId = user.stripeCustomerId
if(!customerId){
    const customer = await stripeClient.customers.create({
        email:user.email,
        metadata:{
            userId:user.id,
        }
    })
    customerId = customer.id

    await prisma.user.update({
        where:{id:user.id},
        data:{stripeCustomerId:customerId}
    })
    
}

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";

    const checkoutSession = await stripeClient.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            }
        ],
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/payment-plan`,
    metadata:{
        userId:user.id,
        plan:"premium",
    }
})
return NextResponse.json({url:checkoutSession.url})


}catch(error){
    console.error("Error creating checkout session:", error);
    return NextResponse.json({error:"Failed to create checkout session"},{status:500})
}
}