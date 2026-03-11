"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

type AdminContextType = {
    isAdmin: boolean
    isEditMode: boolean
    toggleEditMode: () => void
    isLoading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function checkAdminStatus() {
            const { data: { user }, error: userError } = await supabase.auth.getUser()

            if (userError || !user) {
                setIsAdmin(false)
                setIsLoading(false)
                return
            }

            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single()

            if (profile && (profile.role === "admin" || profile.role === "super_admin")) {
                setIsAdmin(true)
            } else {
                setIsAdmin(false)
            }

            setIsLoading(false)
        }

        checkAdminStatus()

        // Listen for auth changes to update admin status
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                checkAdminStatus()
            } else if (event === 'SIGNED_OUT') {
                setIsAdmin(false)
                setIsLoading(false)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase])

    const toggleEditMode = () => {
        if (isAdmin) {
            setIsEditMode((prev) => !prev)
        }
    }

    return (
        <AdminContext.Provider value={{ isAdmin, isEditMode, toggleEditMode, isLoading }}>
            {children}
        </AdminContext.Provider>
    )
}

export function useAdmin() {
    const context = useContext(AdminContext)
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider")
    }
    return context
}
