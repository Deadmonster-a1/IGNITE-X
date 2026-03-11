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

        const { plan_id } = await req.json()

        if (!plan_id) {
            return new NextResponse("Missing plan_id", { status: 400 })
        }

        // 1. Create a Razorpay subscription
        // Optional: you can create a customer first and attach it, 
        // but passing just the plan is the fastest way to get a subscription checkout.
        const subscription = await razorpay.subscriptions.create({
            plan_id: plan_id,
            total_count: 120, // max billing cycles (e.g. 10 years for monthly)
            customer_notify: 1, // Razorpay handles email receipts
            notes: {
                user_id: user.id, // Pass Supabase ID to be caught by the webhook 
            }
        })

        return NextResponse.json({ subscriptionId: subscription.id })
    } catch (error: any) {
        console.error("[RAZORPAY_CREATE_SUBSCRIPTION_ERROR]", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}
