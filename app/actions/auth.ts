"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { sendMail, loginAlertEmail, signupWelcomeEmail } from "@/lib/mailer"
import { headers } from "next/headers"

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    // Fire-and-forget login alert email
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "Unknown"
    const userAgent = headersList.get("user-agent") || "Unknown"
    const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })

    sendMail(loginAlertEmail({
        email: data.email,
        time: `${time} IST`,
        ip,
        device: userAgent.substring(0, 80),
    })).catch(() => { })

    revalidatePath("/", "layout")
    redirect("/dashboard")
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = (formData.get("email") as string)?.trim().toLowerCase()
    const password = formData.get("password") as string
    const name = (formData.get("name") as string)?.trim()

    if (!email || !password || !name) {
        return { error: "All fields are required." }
    }

    if (password.length < 6) {
        return { error: "Password must be at least 6 characters." }
    }

    // Step 1: Register the user (with email OTP confirmation enabled in Supabase)
    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: name, name },
            // Do NOT pass emailRedirectTo — this keeps it as OTP (token) not magic-link
        }
    })

    if (error) {
        console.error("SIGNUP ERROR:", error.status, error.message)
        if (error.message?.includes("already registered") || error.message?.includes("already exists")) {
            return { error: "An account with this email already exists. Please log in instead." }
        }
        if (error.status === 429 || error.message?.toLowerCase().includes("rate limit")) {
            return { error: "Too many signup attempts. Please wait a few minutes and try again." }
        }
        // Supabase 504 — their servers are slow, retry
        if (error.status === 504) {
            return { error: "Connection timed out. Please check your internet and try again." }
        }
        // weak_password — Supabase requires uppercase, lowercase, and numbers
        if ((error as any).code === 'weak_password' || error.message?.toLowerCase().includes("password should contain")) {
            return { error: "Password must contain uppercase (A-Z), lowercase (a-z), and a number (0-9). Example: MyPass123" }
        }
        // SMTP not configured — email sending failed (500)
        if (error.status === 500 || error.message?.toLowerCase().includes("sending confirmation email")) {
            return { error: "Email service not configured. Please set up SMTP in your Supabase project (Authentication → Email Settings → SMTP Settings)." }
        }
        return { error: error.message || "Signup failed. Please try again." }
    }

    console.log("SIGNUP SUCCESS:", authData?.user?.id, "confirmed:", authData?.user?.confirmed_at)

    // If session exists — email confirmation is disabled, user is auto-logged in
    if (authData?.session) {
        // Send welcome email
        sendMail(signupWelcomeEmail({ email, name })).catch(() => { })
        revalidatePath("/", "layout")
        return { redirectUrl: "/dashboard" }
    }

    // email_confirmed_at is null → user must confirm via OTP
    return { redirectUrl: `/verify-otp?email=${encodeURIComponent(email)}&type=signup` }
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath("/", "layout")
    redirect("/")
}

export async function signInWithGoogle() {
    const supabase = await createClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${siteUrl}/auth/callback`,
        },
    })

    if (error) {
        console.error(error)
        return { error: error.message }
    }

    if (data.url) {
        redirect(data.url)
    }
}
