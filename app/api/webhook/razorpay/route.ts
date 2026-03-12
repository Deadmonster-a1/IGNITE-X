import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"
import { headers } from "next/headers"

// Mark as dynamic to ensure environment variables are available at runtime
export const dynamic = 'force-dynamic'

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "whsec_placeholder"

export async function POST(req: Request) {
    try {
        // Initialize Supabase client inside the handler
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        
        if (!supabaseUrl) {
            console.error("[RAZORPAY_WEBHOOK_ERROR] Missing Supabase URL")
            return new NextResponse("Configuration error", { status: 500 })
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)
    try {
        const body = await req.text()
        const signature = (await headers()).get("X-Razorpay-Signature")

        if (!signature) {
            return new NextResponse("Missing signature", { status: 400 })
        }

        // Verify Razorpay signature securely
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(body)
            .digest("hex")

        if (expectedSignature !== signature) {
            console.error("[RAZORPAY_WEBHOOK_ERROR] Invalid signature")
            return new NextResponse("Invalid signature", { status: 400 })
        }

        const event = JSON.parse(body)

        // Webhook events: subscription.charged, subscription.authenticated, subscription.cancelled
        if (event.event === "subscription.charged") {
            const subscription = event.payload.subscription.entity
            const payment = event.payload.payment?.entity

            // We passed user_id in the subscription notes during creation
            const userId = subscription.notes?.user_id

            if (!userId) {
                console.error("No user ID found in subscription notes")
                return new NextResponse("Missing user_id", { status: 200 })
            }

            const customerId = payment?.customer_id || subscription.customer_id
            const subscriptionId = subscription.id

            await supabase
                .from("profiles")
                .update({
                    razorpay_customer_id: customerId,
                    razorpay_subscription_id: subscriptionId,
                    subscription_status: subscription.status,
                    subscription_tier: "architect",
                    current_period_end: new Date(subscription.current_end * 1000).toISOString(),
                })
                .eq("id", userId)
        }
        else if (event.event === "subscription.cancelled" || event.event === "subscription.halted") {
            const subscription = event.payload.subscription.entity
            const subscriptionId = subscription.id

            await supabase
                .from("profiles")
                .update({
                    subscription_status: subscription.status,
                    current_period_end: new Date(subscription.current_end * 1000).toISOString(),
                    // Revert to free if the subscription is no longer active
                    subscription_tier: "free"
                })
                .eq("razorpay_subscription_id", subscriptionId)
        }

        return new NextResponse("Webhook processed successfully", { status: 200 })
    } catch (error: any) {
        console.error("[RAZORPAY_WEBHOOK_INTERNAL_ERROR]", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}
