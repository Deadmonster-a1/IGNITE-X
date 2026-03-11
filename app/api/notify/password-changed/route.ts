import { NextRequest, NextResponse } from "next/server"
import { sendMail, passwordChangedEmail } from "@/lib/mailer"

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()
        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 })
        }

        const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        await sendMail(passwordChangedEmail({ email, time: `${time} IST` }))

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error("[notify/password-changed]", err)
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
    }
}
