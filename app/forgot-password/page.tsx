"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"
import { Terminal, Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const supabase = createClient()
        const siteUrl = window.location.origin

        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
            redirectTo: `${siteUrl}/reset-password`,
        })

        setIsLoading(false)
        if (error) {
            setError(error.message)
        } else {
            setSent(true)
        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-8 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
                <div className="w-[800px] h-[800px] bg-accent/30 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-sm relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="group flex items-center gap-2.5">
                        <div
                            className="relative flex h-10 w-10 items-center justify-center bg-accent transition-transform group-hover:scale-105"
                            style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 75% 100%, 0 100%)" }}
                        >
                            <Terminal className="h-5 w-5 text-accent-foreground" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-foreground cyber-glitch">ASCI</span>
                    </Link>
                </div>

                <div className="bg-card border border-border/50 p-8 shadow-2xl relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/0 via-accent to-accent/0" />

                    {sent ? (
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
                                <CheckCircle2 className="h-7 w-7 text-green-500" />
                            </div>
                            <h1 className="text-xl font-bold">Reset Link Sent</h1>
                            <p className="text-sm text-muted-foreground">
                                Check <span className="text-accent font-medium">{email}</span> for a password reset link. It expires in 1 hour.
                            </p>
                            <Link href="/login" className="mt-2 text-sm text-accent hover:underline flex items-center gap-1.5">
                                <ArrowLeft className="h-3 w-3" /> Back to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center mb-5">
                                <div className="flex h-14 w-14 items-center justify-center bg-accent/10 border border-accent/30">
                                    <Mail className="h-6 w-6 text-accent" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold mb-2 text-center">Reset Password</h1>
                            <p className="text-sm text-muted-foreground mb-6 text-center">
                                Enter your email and we'll send you a secure reset link.
                            </p>

                            {error && (
                                <div className="mb-5 flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full bg-secondary/50 border border-border px-10 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-accent text-accent-foreground font-semibold py-2.5 text-sm hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 75%, 95% 100%, 0 100%)" }}
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                                </button>
                            </form>

                            <p className="text-center mt-6 text-sm text-muted-foreground">
                                Remembered it? <Link href="/login" className="text-accent hover:underline">Back to Login</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}
