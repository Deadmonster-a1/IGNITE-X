"use client"

import { useEffect, useState, useTransition } from "react"
import { getAnnouncements, createAnnouncement, deleteAnnouncement, toggleAnnouncement } from "@/app/actions/admin"
import { format } from "date-fns"
import {
    Megaphone, Plus, Trash2, Loader2, Check, X,
    ToggleLeft, ToggleRight, Zap, AlertTriangle, Info, Star
} from "lucide-react"

const TYPES = [
    { value: "info", label: "Info", color: "#60a5fa", icon: Info },
    { value: "warning", label: "Warning", color: "#f59e0b", icon: AlertTriangle },
    { value: "success", label: "Success", color: "#4ade80", icon: Check },
    { value: "promo", label: "Promo", color: "#f26722", icon: Star },
]

export default function AdminAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ title: "", content: "", type: "info", is_active: true })
    const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null)

    const notify = (type: "ok" | "err", msg: string) => {
        setToast({ type, msg })
        setTimeout(() => setToast(null), 3000)
    }

    const load = () => startTransition(async () => {
        const res = await getAnnouncements()
        if (res.success) setAnnouncements(res.announcements)
        setLoading(false)
    })

    useEffect(() => { load() }, [])

    const handleCreate = async () => {
        if (!form.title.trim() || !form.content.trim()) {
            notify("err", "Title and content are required")
            return
        }
        startTransition(async () => {
            const res = await createAnnouncement(form)
            if (res.success) {
                notify("ok", "Announcement published to dashboard")
                setShowForm(false)
                setForm({ title: "", content: "", type: "info", is_active: true })
                load()
            } else notify("err", res.error || "Failed")
        })
    }

    const handleToggle = async (id: string, isActive: boolean) => {
        startTransition(async () => {
            const res = await toggleAnnouncement(id, isActive)
            if (res.success) {
                setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, is_active: !isActive } : a))
                notify("ok", isActive ? "Announcement hidden" : "Announcement shown")
            } else notify("err", res.error || "Failed")
        })
    }

    const handleDelete = async (id: string) => {
        startTransition(async () => {
            const res = await deleteAnnouncement(id)
            if (res.success) {
                setAnnouncements(prev => prev.filter(a => a.id !== id))
                notify("ok", "Deleted")
            } else notify("err", res.error || "Failed")
        })
    }

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-[#f26722]" /></div>

    return (
        <div className="space-y-6 pt-2">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 border text-sm font-mono ${toast.type === "ok" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
                    {toast.type === "ok" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-1.5 w-6 bg-[#f26722]" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#f26722]/70">Announcements</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white">Site Announcements</h1>
                    <p className="text-[#555] text-xs mt-1 font-mono">Push banners and alerts that appear on users' dashboards instantly.</p>
                </div>
                <button onClick={() => setShowForm(v => !v)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#f26722] text-[#050505] text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all">
                    <Plus className="h-4 w-4" /> New Announcement
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-[#0a0a0a] border border-[#f26722]/30 overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-[#f26722]/0 via-[#f26722] to-[#f26722]/0" />
                    <div className="p-6 space-y-4">
                        <h2 className="text-xs font-mono uppercase tracking-widest text-[#f26722]">New Announcement</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-[#444] block mb-1.5">Title *</label>
                                <input value={form.title} onChange={e => setForm(v => ({ ...v, title: e.target.value }))}
                                    placeholder="e.g. New Python Module Available!"
                                    className="w-full bg-[#050505] border border-[#1a1a1a] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#f26722]/50 font-mono" />
                            </div>
                            <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-[#444] block mb-1.5">Type</label>
                                <div className="flex gap-2">
                                    {TYPES.map(t => (
                                        <button key={t.value} onClick={() => setForm(v => ({ ...v, type: t.value }))}
                                            className="flex-1 py-2.5 text-[10px] font-mono border transition-all"
                                            style={form.type === t.value
                                                ? { borderColor: `${t.color}60`, backgroundColor: `${t.color}10`, color: t.color }
                                                : { borderColor: "#1a1a1a", color: "#444" }}>
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-mono uppercase tracking-widest text-[#444] block mb-1.5">Content *</label>
                            <textarea value={form.content} onChange={e => setForm(v => ({ ...v, content: e.target.value }))}
                                rows={2} placeholder="Announcement message shown to all users..."
                                className="w-full bg-[#050505] border border-[#1a1a1a] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#f26722]/50 font-mono resize-none" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.is_active} onChange={e => setForm(v => ({ ...v, is_active: e.target.checked }))}
                                    className="accent-[#f26722]" />
                                <span className="text-xs font-mono text-[#EDEDED]">Publish immediately</span>
                            </label>
                            <div className="flex gap-2 ml-auto">
                                <button onClick={() => setShowForm(false)}
                                    className="px-4 py-2 border border-[#1a1a1a] text-[#555] text-xs font-mono uppercase tracking-wider hover:text-[#EDEDED] transition-all">
                                    Cancel
                                </button>
                                <button onClick={handleCreate} disabled={isPending}
                                    className="flex items-center gap-2 px-6 py-2 bg-[#f26722] text-[#050505] text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-60">
                                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Megaphone className="h-3.5 w-3.5" />}
                                    Publish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Announcement List */}
            {announcements.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-[#1a1a1a]">
                    <Megaphone className="h-10 w-10 text-[#222] mx-auto mb-3" />
                    <p className="text-[#333] text-xs font-mono">No announcements yet. Create one to push a banner to all users.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {announcements.map(a => {
                        const typeConfig = TYPES.find(t => t.value === a.type) || TYPES[0]
                        return (
                            <div key={a.id}
                                className={`relative bg-[#0a0a0a] border overflow-hidden transition-all ${a.is_active ? "border-[#1a1a1a]" : "border-[#0f0f0f] opacity-50"}`}>
                                <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: typeConfig.color }} />
                                <div className="pl-5 pr-4 py-4 flex items-start gap-4">
                                    <div className="flex h-8 w-8 items-center justify-center flex-shrink-0 border"
                                        style={{ borderColor: `${typeConfig.color}30`, backgroundColor: `${typeConfig.color}10`, color: typeConfig.color }}>
                                        <typeConfig.icon className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-[#EDEDED]">{a.title}</span>
                                            <span className="text-[9px] font-mono border px-1.5 py-0.5 uppercase tracking-wider"
                                                style={{ borderColor: `${typeConfig.color}30`, color: typeConfig.color }}>
                                                {typeConfig.label}
                                            </span>
                                            {a.is_active
                                                ? <span className="text-[9px] font-mono text-green-400 border border-green-500/20 px-1.5 py-0.5">LIVE</span>
                                                : <span className="text-[9px] font-mono text-[#333] border border-[#1a1a1a] px-1.5 py-0.5">HIDDEN</span>
                                            }
                                        </div>
                                        <p className="text-xs text-[#555] leading-relaxed">{a.content}</p>
                                        <p className="text-[10px] text-[#333] font-mono mt-2">{format(new Date(a.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button onClick={() => handleToggle(a.id, a.is_active)} disabled={isPending}
                                            title={a.is_active ? "Hide" : "Show"}
                                            className={`p-2 border transition-all ${a.is_active ? "border-green-500/30 text-green-400 hover:bg-green-500/10" : "border-[#1a1a1a] text-[#333] hover:text-green-400"}`}>
                                            {a.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                                        </button>
                                        <button onClick={() => handleDelete(a.id)} disabled={isPending}
                                            className="p-2 border border-[#1a1a1a] text-[#333] hover:text-red-400 hover:border-red-400/30 transition-all">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
