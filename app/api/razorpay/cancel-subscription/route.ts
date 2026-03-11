import { NextResponse } from "next/server"
import Razorpay from "razorpay"
import { createClient } from "@/utils/supabase/server"

const rzpKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder"
const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_secret_placeholder"
const razorpay = new Razorpay({ key_id: rzpKeyId, key_secret: rzpKeySecret })

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("razorpay_subscription_id")
            .eq("id", user.id)
            .single()

        const subscriptionId = profile?.razorpay_subscription_id

        if (!subscriptionId) {
            return new NextResponse("No active subscription found", { status: 404 })
        }

        // Cancel the subscription immediately 
        const cancelledSubscription = await razorpay.subscriptions.cancel(subscriptionId, false)

        // Webhook will also catch this and update the database, but we can do it proactively here
        await supabase
            .from("profiles")
            .update({
                subscription_status: cancelledSubscription.status, // "cancelled"
                subscription_tier: "free"
            })
            .eq("id", user.id)

        return NextResponse.json({ success: true, status: cancelledSubscription.status })
    } catch (error: any) {
        console.error("[RAZORPAY_CANCEL_SUBSCRIPTION_ERROR]", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}
