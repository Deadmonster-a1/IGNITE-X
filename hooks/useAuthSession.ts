/**
 * useAuthSession — Persistent session hook
 *
 * Fixes two problems:
 * 1. Auto-logout when pressing browser Back (bfcache restores stale state)
 * 2. Session not re-checked after navigating away and back
 *
 * Usage:
 *   const { user, loading } = useAuthSession({ redirectTo: "/login" })
 */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

interface Options {
    /** Where to redirect if not authenticated. Defaults to /login */
    redirectTo?: string
}

export function useAuthSession({ redirectTo = "/login" }: Options = {}) {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const supabase = createClient()

        // 1. Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session?.user) {
                router.replace(redirectTo)
                return
            }
            setUser(session.user)
            setLoading(false)
        })

        // 2. Listen for auth state changes (logout in another tab, token refresh, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session?.user) {
                // Only redirect if we previously had a user (avoid redirect on initial load)
                setUser(prev => {
                    if (prev) router.replace(redirectTo)
                    return null
                })
                setLoading(false)
                return
            }
            setUser(session.user)
            setLoading(false)
        })

        // 3. Fix bfcache: re-validate session when user presses Back/Forward
        const handlePageShow = async (e: PageTransitionEvent) => {
            if (e.persisted) {
                // Page was restored from bfcache — re-check session
                const { data: { session } } = await supabase.auth.getSession()
                if (!session?.user) {
                    router.replace(redirectTo)
                    return
                }
                setUser(session.user)
            }
        }

        window.addEventListener("pageshow", handlePageShow)

        return () => {
            subscription.unsubscribe()
            window.removeEventListener("pageshow", handlePageShow)
        }
    }, [router, redirectTo])

    return { user, loading }
}
