"use client"

import { Suspense } from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Terminal, Mail, Loader2, AlertCircle, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react"

const OTP_LENGTH = 9

function VerifyOtpForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""
    const otpType = (searchParams.get("type") || "signup") as "signup" | "email"

    // Single array for individual digit inputs
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""))
    const [isVerifying, setIsVerifying] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Auto-focus first input
    useEffect(() => { inputRefs.current[0]?.focus() }, [])

    // Resend cooldown countdown
    useEffect(() => {
        if (resendCooldown > 0) {
            const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
            return () => clearTimeout(t)
        }
    }, [resendCooldown])

    const handleChange = (index: number, value: string) => {
        const cleaned = value.replace(/\D/g, "").slice(-1)
        const next = [...otp]
        next[index] = cleaned
        setOtp(next)
        setError(null)
        if (cleaned && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const next = [...otp]
                next[index] = ""
                setOtp(next)
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus()
            }
        }
        if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus()
        if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus()
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH)
        const next = Array(OTP_LENGTH).fill("")
        pasted.split("").forEach((c, i) => { next[i] = c })
        setOtp(next)
        const fi = Math.min(pasted.length, OTP_LENGTH - 1)
        inputRefs.current[fi]?.focus()
    }

    const handleVerify = useCallback(async (digits?: string[]) => {
        const token = (digits || otp).join("")
        if (token.length !== OTP_LENGTH) {
            setError(`Please enter all ${OTP_LENGTH} digits.`)
            return
        }
        setIsVerifying(true)
        setError(null)

        const supabase = createClient()
        const { data, error } = await supabase.auth.verifyOtp({ email, token, type: otpType })

        if (error) {
            const msg = error.message?.toLowerCase() || ""
            if (msg.includes("expired") || msg.includes("invalid") || msg.includes("otp")) {
                setError("Code is invalid or expired. Request a new one below.")
            } else if (msg.includes("already confirmed")) {
                router.push("/dashboard")
                return
            } else {
                setError(error.message)
            }
            setIsVerifying(false)
            return
        }

        // Check if admin → route to /admin dashboard
        const user = data?.user
        if (user) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single()

            setSuccess(true)
            const dest = (profile?.role === "admin" || profile?.role === "super_admin")
                ? "/admin"
                : "/dashboard"
            setTimeout(() => router.push(dest), 1500)
        } else {
            setSuccess(true)
            setTimeout(() => router.push("/dashboard"), 1500)
        }
    }, [otp, email, otpType, router])

    // Auto-submit when all digits are entered
    useEffect(() => {
        if (otp.every(d => d !== "") && !isVerifying && !success) {
            handleVerify(otp)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp])

    const handleResend = async () => {
        if (resendCooldown > 0 || isResending) return
        setIsResending(true)
        setError(null)

        const supabase = createClient()
        let resendError: any = null

        if (otpType === "email") {
            const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } })
            resendError = error
        } else {
            const { error } = await supabase.auth.resend({ type: "signup", email })
            resendError = error
        }

        setIsResending(false)
        if (resendError) {
            setError(resendError.message || "Failed to resend. Please wait and try again.")
        } else {
            setResendCooldown(60)
            setOtp(Array(OTP_LENGTH).fill(""))
            inputRefs.current[0]?.focus()
        }
    }

    const isComplete = otp.every(d => d !== "")
    // Contextual back link: login flow goes back to /login, signup goes to /signup
    const backHref = otpType === "email" ? "/login" : "/signup"
    const backLabel = otpType === "email" ? "Back to Login" : "Back to Sign Up"
    const pageTitle = otpType === "email" ? "Email Login Code" : "Confirm Your Email"
    const pageDesc = otpType === "email"
        ? "Enter the one-time login code we sent to:"
        : "Enter the code we sent to confirm your account:"

    if (!email) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center space-y-4">
                    <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
                    <p className="text-muted-foreground">No email address provided.</p>
                    <Link href={backHref} className="text-accent hover:underline text-sm">{backLabel}</Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-8 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10 space-y-6">
                {/* Logo */}
                <div className="flex justify-center">
                    <Link href="/" className="group flex items-center gap-2.5">
                        <div
                            className="relative flex h-10 w-10 items-center justify-center bg-accent transition-transform group-hover:scale-105"
                            style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 75% 100%, 0 100%)" }}
                        >
                            <Terminal className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-foreground">ASCI</span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-card border border-border/60 shadow-2xl relative overflow-hidden">
                    {/* Top accent bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-accent/0 via-accent to-accent/0" />

                    <div className="p-7 sm:p-10">
                        {success ? (
                            /* ── Success State ─────────────────── */
                            <div className="flex flex-col items-center gap-5 py-4 text-center">
                                <div className="relative flex h-20 w-20 items-center justify-center">
                                    <div className="absolute inset-0 rounded-full bg-green-500/10 border border-green-500/30 animate-pulse" />
                                    <CheckCircle2 className="h-9 w-9 text-green-500 relative z-10" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black tracking-tight mb-1">Identity Confirmed</h1>
                                    <p className="text-sm text-muted-foreground">Access granted. Routing to your dashboard...</p>
                                </div>
                                <Loader2 className="h-5 w-5 animate-spin text-accent" />
                            </div>
                        ) : (
                            <>
                                {/* ── Header ─────────────────────── */}
                                <div className="flex flex-col items-center text-center mb-8">
                                    <div className="flex h-16 w-16 items-center justify-center bg-accent/10 border border-accent/30 mb-5">
                                        <ShieldCheck className="h-7 w-7 text-accent" />
                                    </div>
                                    <h1 className="text-2xl font-black tracking-tight mb-2">{pageTitle}</h1>
                                    <p className="text-sm text-muted-foreground mb-1">{pageDesc}</p>
                                    <p className="text-sm font-semibold text-accent truncate max-w-full">{email}</p>
                                </div>

                                {/* ── Error ──────────────────────── */}
                                {error && (
                                    <div className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/30 text-destructive text-sm p-3.5 mb-6 rounded-sm">
                                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* ── OTP Digit Inputs ───────────── */}
                                <div
                                    className="flex gap-1.5 sm:gap-2 justify-center mb-7"
                                    onPaste={handlePaste}
                                    aria-label="One-time code input"
                                >
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={el => { inputRefs.current[i] = el }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            autoComplete="one-time-code"
                                            onChange={e => handleChange(i, e.target.value)}
                                            onKeyDown={e => handleKeyDown(i, e)}
                                            className={`
                                                flex-1 min-w-0 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold
                                                bg-secondary/50 border-2 transition-all duration-150
                                                focus:outline-none
                                                ${digit
                                                    ? "border-accent bg-accent/5 text-foreground"
                                                    : "border-border/60 text-muted-foreground"
                                                }
                                                focus:border-accent focus:bg-accent/5 focus:shadow-[0_0_0_3px_rgba(242,103,34,0.15)]
                                                ${isComplete && !error ? "border-green-500/50" : ""}
                                            `}
                                        />
                                    ))}
                                </div>

                                {/* ── Progress indicator ─────────── */}
                                <div className="flex gap-1 mb-7">
                                    {otp.map((d, i) => (
                                        <div
                                            key={i}
                                            className={`h-0.5 flex-1 rounded-full transition-all duration-200 ${d ? "bg-accent" : "bg-border"}`}
                                        />
                                    ))}
                                </div>

                                {/* ── Submit Button ──────────────── */}
                                <button
                                    onClick={() => handleVerify()}
                                    disabled={isVerifying || !isComplete}
                                    className="w-full bg-accent text-accent-foreground font-bold py-3 text-sm uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mb-5"
                                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 75%, 96% 100%, 0 100%)" }}
                                >
                                    {isVerifying
                                        ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
                                        : <><ShieldCheck className="h-4 w-4" /> Confirm Identity</>
                                    }
                                </button>

                                {/* ── Resend ─────────────────────── */}
                                <div className="text-center border-t border-border/40 pt-5">
                                    <p className="text-xs text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
                                    <button
                                        onClick={handleResend}
                                        disabled={isResending || resendCooldown > 0}
                                        className="text-sm font-medium text-accent hover:underline flex items-center gap-1.5 mx-auto disabled:opacity-40 disabled:no-underline transition-opacity"
                                    >
                                        {isResending
                                            ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending...</>
                                            : resendCooldown > 0
                                                ? <><RefreshCw className="h-3.5 w-3.5" /> Resend in {resendCooldown}s</>
                                                : <><RefreshCw className="h-3.5 w-3.5" /> Resend Code</>
                                        }
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom link — context-aware */}
                <p className="text-center text-sm text-muted-foreground">
                    Wrong email?{" "}
                    <Link href={backHref} className="text-accent hover:underline font-medium">{backLabel}</Link>
                </p>
            </div>
        </main>
    )
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center bg-background p-4">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </main>
        }>
            <VerifyOtpForm />
        </Suspense>
    )
}
