"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { login } from "@/app/actions/auth"
import { createClient } from "@/utils/supabase/client"
import { Terminal, Lock, Mail, Loader2, AlertCircle, KeyRound } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const [resetSent, setResetSent] = useState(false)
    const [isSendingReset, setIsSendingReset] = useState(false)
    const [loginMode, setLoginMode] = useState<"password" | "otp">("password")
    const [otpEmail, setOtpEmail] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [isSendingOtp, setIsSendingOtp] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true)
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    const handleForgotPassword = async () => {
        const email = (document.querySelector('input[name="email"]') as HTMLInputElement)?.value
        if (!email) {
            setError("Enter your email address above, then click Forgot.")
            return
        }
        setIsSendingReset(true)
        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback`,
        })
        setIsSendingReset(false)
        if (error) {
            setError(error.message)
        } else {
            setResetSent(true)
        }
    }

    const handleSendOtp = async () => {
        if (!otpEmail) {
            setError("Please enter your email address.")
            return
        }
        setIsSendingOtp(true)
        setError(null)
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithOtp({
            email: otpEmail,
            options: { shouldCreateUser: false },
        })
        setIsSendingOtp(false)
        if (error) {
            if (error.message?.toLowerCase().includes("signups not allowed") ||
                error.message?.toLowerCase().includes("otp") && error.message?.toLowerCase().includes("not allowed")) {
                setError("No account found with this email. Please sign up first.")
            } else {
                setError(error.message)
            }
        } else {
            router.push(`/verify-otp?email=${encodeURIComponent(otpEmail)}&type=email`)
        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-8 relative overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
                <div className="w-[800px] h-[800px] bg-accent/30 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-sm relative z-10">
                <div className="flex justify-center mb-8">
                    <Link href="/" className="group flex items-center gap-2.5">
                        <div className="relative flex h-10 w-10 items-center justify-center bg-accent transition-transform group-hover:scale-105" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 75% 100%, 0 100%)" }}>
                            <Terminal className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black tracking-tight text-foreground cyber-glitch">ASCI</span>
                        </div>
                    </Link>
                </div>

                <div className="bg-card border border-border/50 p-8 shadow-2xl relative">
                    {/* Top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0" />

                    <h1 className="text-2xl font-bold mb-2">Initialize Session</h1>
                    <p className="text-sm text-muted-foreground mb-4">Enter your credentials to access the terminal.</p>

                    {/* Mode Toggle */}
                    <div className="flex border border-border mb-6">
                        <button
                            type="button"
                            onClick={() => { setLoginMode("password"); setError(null) }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${loginMode === "password"
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Lock className="h-3.5 w-3.5" />
                            Password
                        </button>
                        <button
                            type="button"
                            onClick={() => { setLoginMode("otp"); setError(null) }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${loginMode === "otp"
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <KeyRound className="h-3.5 w-3.5" />
                            Email OTP
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    {loginMode === "password" ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full bg-secondary/50 border border-border px-10 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                        placeholder="admin@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex justify-between">
                                    <span>Password</span>
                                    <Link
                                        href="/forgot-password"
                                        className="text-accent hover:underline normal-case font-normal text-[11px]"
                                    >
                                        Forgot password?
                                    </Link>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full bg-secondary/50 border border-border px-10 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || isGoogleLoading}
                                className="w-full bg-foreground text-background font-semibold py-2.5 text-sm hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                                style={{ clipPath: "polygon(0 0, 100% 0, 100% 75%, 95% 100%, 0 100%)" }}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "System Override (Login)"}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <input
                                        type="email"
                                        value={otpEmail}
                                        onChange={e => { setOtpEmail(e.target.value); setError(null) }}
                                        className="w-full bg-secondary/50 border border-border px-10 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                        placeholder="admin@example.com"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                We&apos;ll send a 6-digit code to your inbox. No password needed.
                            </p>
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isSendingOtp || isGoogleLoading}
                                className="w-full bg-accent text-accent-foreground font-semibold py-2.5 text-sm hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                                style={{ clipPath: "polygon(0 0, 100% 0, 100% 75%, 95% 100%, 0 100%)" }}
                            >
                                {isSendingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP Code"}
                            </button>
                        </div>
                    )}

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-card px-2 text-muted-foreground">Or bypass with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading || isGoogleLoading}
                        className="w-full border border-border bg-card hover:bg-secondary text-foreground font-medium py-2.5 text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isGoogleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span>Google SSO</span>
                            </>
                        )}
                    </button>
                </div>

                <p className="text-center mt-6 text-sm text-muted-foreground">
                    No access credentials? <Link href="/signup" className="text-accent hover:underline">Request Authorization</Link>
                </p>
            </div>
        </main>
    )
}
