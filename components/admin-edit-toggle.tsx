"use client"

import { useAdmin } from "@/context/admin-context"
import { Edit3, CheckCircle, ShieldAlert } from "lucide-react"
import { useEffect, useState } from "react"

export function AdminEditToggle() {
    const { isAdmin, isEditMode, toggleEditMode, isLoading } = useAdmin()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || isLoading || !isAdmin) return null

    return (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5">
            <button
                onClick={toggleEditMode}
                className={`group flex items-center gap-3 rounded-full border px-5 py-3 shadow-2xl transition-all hover:scale-105 ${isEditMode
                        ? "border-success bg-success/10 text-success shadow-success/20 backdrop-blur-md"
                        : "border-accent bg-accent/10 text-accent shadow-accent/20 backdrop-blur-md"
                    }`}
            >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background/50">
                    {isEditMode ? (
                        <CheckCircle className="h-4 w-4" />
                    ) : (
                        <Edit3 className="h-4 w-4" />
                    )}
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest">
                    {isEditMode ? "Live Edit Active" : "Enable Edit Mode"}
                </span>

                <div className="absolute -top-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-card border border-border text-xs px-2 py-1 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-destructive" />
                    Admin Overlay
                </div>
            </button>
        </div>
    )
}
