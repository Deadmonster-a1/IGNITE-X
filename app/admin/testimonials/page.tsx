"use client"

import { useEffect, useState, useTransition } from "react"
import { format } from "date-fns"
import {
    MessageSquare, Star, CheckCircle2, XCircle, Trash2,
    RefreshCw, Loader2, Search, Filter, Quote, AlertTriangle,
    ThumbsUp, Clock, Eye
} from "lucide-react"
import {
    getAllTestimonialsAdmin,
    approveTestimonial,
    deleteTestimonial
} from "@/app/actions/admin"

type Testimonial = {
    id: string
    content: string
    rating: number
    cohort: string
    is_approved: boolean
    created_at: string
    profiles: { name: string; email: string } | null
}

type Filter = "all" | "approved" | "pending"

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState<Filter>("all")
    const [isPending, startTransition] = useTransition()
    const [actionId, setActionId] = useState<string | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

    const load = () => {
        startTransition(async () => {
            const res = await getAllTestimonialsAdmin()
            if (res.success && res.testimonials) {
                setTestimonials(res.testimonials as Testimonial[])
            }
            setLoading(false)
        })
    }

    useEffect(() => { load() }, [])

    const handleApprove = async (id: string, approve: boolean) => {
        setActionId(id)
        await approveTestimonial(id, approve)
        setTestimonials(prev =>
            prev.map(t => t.id === id ? { ...t, is_approved: approve } : t)
        )
        setActionId(null)
    }

    const handleDelete = async (id: string) => {
        setActionId(id)
        await deleteTestimonial(id)
        setTestimonials(prev => prev.filter(t => t.id !== id))
        setDeleteConfirmId(null)
        setActionId(null)
    }

    const filtered = testimonials.filter(t => {
        const matchesFilter =
            filter === "all" ? true :
                filter === "approved" ? t.is_approved :
                    !t.is_approved

        const q = search.toLowerCase()
        const matchesSearch = !q ||
            t.content.toLowerCase().includes(q) ||
            (t.profiles?.name || "").toLowerCase().includes(q) ||
            (t.profiles?.email || "").toLowerCase().includes(q)

        return matchesFilter && matchesSearch
    })

    const stats = {
        total: testimonials.length,
        approved: testimonials.filter(t => t.is_approved).length,
        pending: testimonials.filter(t => !t.is_approved).length,
        avgRating: testimonials.length
            ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
            : "—",
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-[#f26722]" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-1.5 w-6 bg-[#f26722]" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#f26722]/70">Testimonial Management</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white">Testimonials <span className="text-[#333] text-lg">({filtered.length})</span></h1>
                    <p className="text-[#555] text-xs mt-1 font-mono">Review, approve, and manage user reviews.</p>
                </div>
                <button
                    onClick={load}
                    disabled={isPending}
                    className="flex items-center gap-2 px-3 py-2 border border-[#1a1a1a] text-xs text-[#555] hover:text-[#f26722] hover:border-[#f26722]/30 transition-all font-mono uppercase tracking-wider"
                >
                    <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Reviews", value: stats.total, icon: MessageSquare, color: "#60a5fa", bg: "bg-[#60a5fa]/5 border-[#60a5fa]/20" },
                    { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "#4ade80", bg: "bg-[#4ade80]/5 border-[#4ade80]/20" },
                    { label: "Pending", value: stats.pending, icon: Clock, color: "#f59e0b", bg: "bg-amber-500/5 border-amber-500/20" },
                    { label: "Avg Rating", value: stats.avgRating, icon: Star, color: "#f26722", bg: "bg-[#f26722]/5 border-[#f26722]/20" },
                ].map(card => (
                    <div key={card.label} className={`bg-[#0a0a0a] border p-5 ${card.bg} relative overflow-hidden`}>
                        <div className="absolute -right-3 -bottom-3 opacity-10 pointer-events-none">
                            <card.icon className="w-16 h-16" style={{ color: card.color }} />
                        </div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[#444] mb-3">{card.label}</p>
                        <p className="text-4xl font-black" style={{ color: card.color }}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#333]" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by content, name, or email..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] text-sm text-[#EDEDED] focus:outline-none focus:border-[#f26722]/40 transition-all font-mono placeholder:text-[#333]"
                    />
                </div>
                <div className="flex border border-[#1a1a1a] overflow-hidden">
                    {(["all", "approved", "pending"] as Filter[]).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-1 sm:flex-none px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider capitalize transition-all ${filter === f
                                ? "bg-[#f26722] text-[#050505]"
                                : "text-[#444] hover:text-[#EDEDED]"
                                }`}
                        >
                            {f}
                            {f === "pending" && stats.pending > 0 && (
                                <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold ${filter === f ? "bg-[#050505]/20 text-[#050505]" : "bg-amber-500/20 text-amber-400"}`}>
                                    {stats.pending}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Testimonials List */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#1a1a1a]">
                    <MessageSquare className="h-10 w-10 text-[#222] mx-auto mb-3" />
                    <p className="text-[#333] text-xs font-mono">No testimonials found.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(t => (
                        <div
                            key={t.id}
                            className={`relative bg-[#0a0a0a] border p-5 transition-all ${t.is_approved
                                ? "border-[#1a1a1a]"
                                : "border-amber-500/30 bg-amber-500/5"
                                }`}
                        >
                            {/* Status badge */}
                            <div className="absolute top-4 right-4">
                                {t.is_approved ? (
                                    <span className="text-[10px] font-bold px-2 py-1 rounded-sm bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
                                        ✓ Approved
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-bold px-2 py-1 rounded-sm bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> Pending
                                    </span>
                                )}
                            </div>

                            {/* Author info */}
                            <div className="flex items-center gap-3 mb-3 pr-24">
                                <div className="flex h-9 w-9 items-center justify-center bg-[#f26722]/10 border border-[#f26722]/20 font-mono text-xs font-bold text-[#f26722] flex-shrink-0">
                                    {(t.profiles?.name || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#EDEDED] truncate">
                                        {t.profiles?.name || "Unknown User"}
                                    </p>
                                    <p className="text-xs text-[#555] font-mono truncate">
                                        {t.profiles?.email || "—"} · {t.cohort}
                                    </p>
                                </div>
                                <div className="flex items-center gap-0.5 ml-auto mr-4 flex-shrink-0">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-[#f26722] text-[#f26722]" : "text-[#222]"}`} />
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative pl-3 border-l-2 border-[#1a1a1a] mb-4">
                                <Quote className="absolute -top-1 -left-0.5 h-3 w-3 text-[#333]" />
                                <p className="text-sm text-[#666] leading-relaxed italic">
                                    {t.content}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-[#444] font-mono">
                                    {format(new Date(t.created_at), "MMM d, yyyy 'at' h:mm a")}
                                </span>

                                <div className="flex items-center gap-2">
                                    {/* Approve / Unapprove */}
                                    {t.is_approved ? (
                                        <button
                                            onClick={() => handleApprove(t.id, false)}
                                            disabled={actionId === t.id}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono border border-[#1a1a1a] text-[#555] hover:text-amber-400 hover:border-amber-400/30 transition-all"
                                        >
                                            {actionId === t.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3.5 w-3.5" />}
                                            Unpublish
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleApprove(t.id, true)}
                                            disabled={actionId === t.id}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all"
                                        >
                                            {actionId === t.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <ThumbsUp className="h-3.5 w-3.5" />}
                                            Approve
                                        </button>
                                    )}

                                    {/* Delete */}
                                    {deleteConfirmId === t.id ? (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] text-amber-400 font-mono">Confirm?</span>
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                disabled={actionId === t.id}
                                                className="px-2.5 py-1.5 text-[10px] font-mono bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                                            >
                                                {actionId === t.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Yes, Delete"}
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmId(null)}
                                                className="px-2.5 py-1.5 text-[10px] font-mono border border-[#1a1a1a] text-[#444] hover:text-[#EDEDED] transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirmId(t.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono border border-[#1a1a1a] text-[#444] hover:text-red-400 hover:border-red-400/30 transition-all"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
