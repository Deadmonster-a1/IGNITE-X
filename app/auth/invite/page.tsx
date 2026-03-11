"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Terminal, Lock, User, Mail, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react"

function AcceptInviteForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [showPass, setShowPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState("")
    const [validSession, setValidSession] = useState<boolean | null>(null)

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getSession().then(({ data }) => {
            if (data.session?.user) {
                setEmail(data.session.user.email || "")
                setValidSession(true)
            } else {
                setValidSession(false)
            }
        })
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        if (!name.trim()) { setError("Full name is required."); return }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return }
        if (password !== confirm) { setError("Passwords do not match."); return }

        setIsLoading(true)
        const supabase = createClient()

        const { error } = await supabase.auth.updateUser({
            password,
            data: { full_name: name, name }
        })

        setIsLoading(false)
        if (error) {
            setError(error.message)
        } else {
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
                <h1 className="text-xl font-bold mb-2">Invitation Expired</h1>
                <p className="text-sm text-muted-foreground mb-6">This invite link is invalid or has already been used.</p>
                <Link href="/signup" className="text-accent hover:underline text-sm">
                    Create an account instead →
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
                            <h1 className="text-xl font-bold">Account Activated!</h1>
                            <p className="text-sm text-muted-foreground">Routing to your dashboard...</p>
                            <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold mb-1">You're Invited</h1>
                            <p className="text-sm text-muted-foreground mb-1">Complete your profile to activate:</p>
                            {email && <p className="text-sm font-medium text-accent mb-6 truncate">{email}</p>}

                            {error && (
                                <div className="mb-5 flex items-center gap-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            className="w-full bg-secondary/50 border border-border px-10 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Set Password</label>
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
                                            placeholder="Create a strong password"
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
                                            placeholder="Repeat password"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-accent text-accent-foreground font-semibold py-2.5 text-sm hover:bg-accent/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 75%, 95% 100%, 0 100%)" }}
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Activate Account"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}

export default function AcceptInvitePage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </main>
        }>
            <AcceptInviteForm />
        </Suspense>
    )
}
