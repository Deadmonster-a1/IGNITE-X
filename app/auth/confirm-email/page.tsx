"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Terminal, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export default function ConfirmEmailChangePage() {
    const router = useRouter()
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
        const supabase = createClient()
        // After clicking the change-email link, Supabase auto-updates the session
        supabase.auth.getSession().then(({ data, error }) => {
            if (error || !data.session) {
                setErrorMsg("This link is invalid or has expired.")
                setStatus("error")
            } else {
                setStatus("success")
                setTimeout(() => router.push("/profile"), 2500)
            }
        })
    }, [router])

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

                    {status === "loading" && (
                        <div className="flex flex-col items-center gap-4 py-6 text-center">
                            <div className="flex h-14 w-14 items-center justify-center bg-accent/10 border border-accent/30">
                                <Mail className="h-6 w-6 text-accent" />
                            </div>
                            <h1 className="text-xl font-bold">Confirming Email Change</h1>
                            <Loader2 className="h-5 w-5 animate-spin text-accent" />
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center gap-4 py-6 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
                                <CheckCircle2 className="h-7 w-7 text-green-500" />
                            </div>
                            <h1 className="text-xl font-bold">Email Updated!</h1>
                            <p className="text-sm text-muted-foreground">Your email address has been changed. Redirecting to profile...</p>
                            <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center gap-4 py-6 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
                                <AlertCircle className="h-7 w-7 text-destructive" />
                            </div>
                            <h1 className="text-xl font-bold">Confirmation Failed</h1>
                            <p className="text-sm text-muted-foreground">{errorMsg}</p>
                            <Link href="/profile" className="text-accent hover:underline text-sm">
                                Back to Profile
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
