"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Terminal, Lock, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [validSession, setValidSession] = useState<boolean | null>(null)

    useEffect(() => {
        // Supabase redirects here with session tokens in the URL hash
        const supabase = createClient()
        supabase.auth.getSession().then(({ data }) => {
            setValidSession(!!data.session)
        })
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        if (password.length < 6) {
            setError("Password must be at least 6 characters.")
            return
        }
        if (password !== confirm) {
            setError("Passwords do not match.")
            return
        }

        setIsLoading(true)
        const supabase = createClient()
        const { error } = await supabase.auth.updateUser({ password })

        setIsLoading(false)
        if (error) {
            setError(error.message)
        } else {
            // Notify user via email that their password changed
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email) {
                fetch("/api/notify/password-changed", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: user.email }),
                }).catch(() => { })
            }
            setSuccess(true)
            setTimeout(() => router.push("/dashboard"), 2000)
        }
    }

    if (validSession === null) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </main>
        )
    }

    if (!validSession) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h1 className="text-xl font-bold mb-2">Invalid or Expired Link</h1>
                <p className="text-sm text-muted-foreground mb-6">This reset link has expired or already been used.</p>
                <Link href="/forgot-password" className="text-accent hover:underline text-sm">
                    Request a new reset link →
                </Link>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-8 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none flex items-center justify-center">
                <div className="w-[800px] h-[800px] bg-accent/30 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-sm relative z-10">
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

                    {success ? (
                        <div className="flex flex-col items-center gap-4 py-4 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
                                <CheckCircle2 className="h-7 w-7 text-green-500" />
                            </div>
                            <h1 className="text-xl font-bold">Password Updated</h1>
                            <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
                            <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center mb-5">
                                <div className="flex h-14 w-14 items-center justify-center bg-accent/10 border border-accent/30">
                                    <Lock className="h-6 w-6 text-accent" />
                                </div>
                            </div>
                            <h1 className="text-2xl font-bold mb-2 text-center">New Password</h1>
                            <p className="text-sm text-muted-foreground mb-6 text-center">
                                Choose a strong new password for your account.
                            </p>

                            {error && (
                                <div className="mb-5 flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">New Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type={showPass ? "text" : "password"}
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="w-full bg-secondary/50 border border-border px-10 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                            placeholder="Min. 6 characters + uppercase + number"
                                        />
                                        <button type="button" onClick={() => setShowPass(s => !s)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground">
                                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Confirm Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type={showPass ? "text" : "password"}
                                            required
                                            value={confirm}
                                            onChange={e => setConfirm(e.target.value)}
                                            className="w-full bg-secondary/50 border border-border px-10 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                            placeholder="Repeat your new password"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-accent text-accent-foreground font-semibold py-2.5 text-sm hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 75%, 95% 100%, 0 100%)" }}
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}
