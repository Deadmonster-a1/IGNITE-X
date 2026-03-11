"use client"

import { useEffect, useState, useTransition } from "react"
import { getAdminStats, getRecentActivity, getAdminCourses, updateCourseDetails, toggleCoursePublish, toggleCoursePremium } from "@/app/actions/admin"
import Link from "next/link"
import { format } from "date-fns"
import {
    Users, BookOpen, GraduationCap, MessageSquare,
    Shield, RefreshCw, Loader2, ArrowRight,
    Zap, Edit3, X, Save, Globe, EyeOff, Lock, Check,
    TerminalSquare, Clock
} from "lucide-react"

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Expert"]

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [recent, setRecent] = useState<any[]>([])
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    // Edit panel state
    const [editingCourse, setEditingCourse] = useState<any | null>(null)
    const [editVal, setEditVal] = useState<{ title: string; description: string; difficulty: string; duration_hours: string }>({ title: "", description: "", difficulty: "", duration_hours: "" })
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null)

    const notify = (type: "ok" | "err", msg: string) => {
        setToast({ type, msg })
        setTimeout(() => setToast(null), 3500)
    }

    const load = () => startTransition(async () => {
        const [statsRes, actRes, coursesRes] = await Promise.all([
            getAdminStats(),
            getRecentActivity(),
            getAdminCourses(),
        ])
        if (statsRes.success) setStats(statsRes.stats)
        if (actRes.success) setRecent(actRes.users)
        if (coursesRes.success) setCourses(coursesRes.courses ?? [])
        setLoading(false)
    })

    useEffect(() => { load() }, [])

    const openEdit = (course: any) => {
        setEditingCourse(course)
        setEditVal({
            title: course.title ?? "",
            description: course.description ?? "",
            difficulty: course.difficulty ?? "Beginner",
            duration_hours: course.duration_hours != null ? String(course.duration_hours) : "",
        })
    }

    const handleSave = async () => {
        if (!editingCourse) return
        setSaving(true)
        const res = await updateCourseDetails(editingCourse.id, {
            title: editVal.title,
            description: editVal.description,
            difficulty: editVal.difficulty || undefined,
            duration_hours: editVal.duration_hours ? parseFloat(editVal.duration_hours) : undefined,
        })
        setSaving(false)
        if (res.success) {
            setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, ...editVal, duration_hours: parseFloat(editVal.duration_hours) || c.duration_hours } : c))
            setEditingCourse((prev: any) => prev ? { ...prev, ...editVal } : null)
            notify("ok", "Course updated")
        } else notify("err", res.error || "Failed to save")
    }

    const handleTogglePublish = async (course: any) => {
        startTransition(async () => {
            const res = await toggleCoursePublish(course.id, course.is_published)
            if (res.success) {
                setCourses(prev => prev.map(c => c.id === course.id ? { ...c, is_published: !c.is_published } : c))
                if (editingCourse?.id === course.id) setEditingCourse((prev: any) => prev ? { ...prev, is_published: !prev.is_published } : null)
                notify("ok", course.is_published ? "Course unpublished" : "Course published!")
            } else notify("err", res.error || "Failed")
        })
    }

    const handleTogglePremium = async (course: any) => {
        startTransition(async () => {
            const res = await toggleCoursePremium(course.id, course.is_premium)
            if (res.success) {
                setCourses(prev => prev.map(c => c.id === course.id ? { ...c, is_premium: !c.is_premium } : c))
                if (editingCourse?.id === course.id) setEditingCourse((prev: any) => prev ? { ...prev, is_premium: !prev.is_premium } : null)
                notify("ok", course.is_premium ? "Set to Free" : "Set to Premium")
            } else notify("err", res.error || "Failed")
        })
    }

    if (loading) return (
        <div className="flex justify-center p-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#f26722]" />
        </div>
    )

    const statCards = [
        { name: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "#60a5fa", sub: `+${stats?.newUsersToday ?? 0} today` },
        { name: "Total Courses", value: stats?.totalCourses ?? 0, icon: BookOpen, color: "#a78bfa", sub: "Published & Draft" },
        { name: "Enrollments", value: stats?.totalEnrollments ?? 0, icon: GraduationCap, color: "#4ade80", sub: "Active members" },
        { name: "Testimonials", value: stats?.totalTestimonials ?? 0, icon: MessageSquare, color: "#f26722", sub: "Reviews collected" },
    ]

    const quickLinks = [
        { label: "Manage Users", href: "/admin/users", icon: Users, desc: "Roles, XP, ban/delete" },
        { label: "Manage Courses", href: "/admin/courses", icon: BookOpen, desc: "Publish, edit, delete" },
        { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare, desc: "Approve & moderate" },
        { label: "Announcements", href: "/admin/announcements", icon: Zap, desc: "Push site-wide alerts" },
        { label: "Settings", href: "/admin/settings", icon: Shield, desc: "Platform configuration" },
    ]

    return (
        <div className="space-y-8 pt-2">
            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 border font-mono text-xs uppercase tracking-wider shadow-xl ${toast.type === "ok" ? "bg-[#0a0a0a] border-green-500/40 text-green-400" : "bg-[#0a0a0a] border-red-500/40 text-red-400"}`}>
                    {toast.type === "ok" ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-1.5 w-6 bg-[#f26722]" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#f26722]/70">Command Center</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white cyber-glitch" data-text="Admin Overview">Admin Overview</h1>
                    <p className="text-[#666] text-sm mt-1 font-mono">Real-time platform monitoring and control.</p>
                </div>
                <button onClick={load} disabled={isPending}
                    className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a] text-sm text-[#666] hover:text-[#f26722] hover:border-[#f26722]/30 transition-all font-mono text-xs uppercase tracking-wider">
                    <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map(stat => (
                    <div key={stat.name} className="relative bg-[#0a0a0a] border border-[#1a1a1a] p-5 overflow-hidden group hover:border-[#f26722]/20 transition-all">
                        <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: `linear-gradient(to right, ${stat.color}40, transparent)` }} />
                        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                            <stat.icon className="w-20 h-20" style={{ color: stat.color }} />
                        </div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[#444] mb-3">{stat.name}</p>
                        <p className="text-4xl font-black" style={{ color: stat.color }}>{stat.value.toLocaleString()}</p>
                        <p className="text-[11px] text-[#444] mt-1 font-mono">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Quick Access + Recent Users */}
            <div className="grid lg:grid-cols-5 gap-6">
                {/* Quick Links */}
                <div className="lg:col-span-2 space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#444] mb-4">Quick Access</p>
                    {quickLinks.map(link => (
                        <Link key={link.href} href={link.href}
                            className="flex items-center gap-4 p-4 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#f26722]/30 hover:bg-[#f26722]/5 transition-all group">
                            <div className="flex h-9 w-9 items-center justify-center bg-[#f26722]/5 border border-[#f26722]/15 flex-shrink-0">
                                <link.icon className="h-4 w-4 text-[#f26722]/60 group-hover:text-[#f26722]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-[#EDEDED] font-mono">{link.label}</div>
                                <div className="text-[11px] text-[#444]">{link.desc}</div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[#333] group-hover:text-[#f26722] transition-colors flex-shrink-0" />
                        </Link>
                    ))}
                </div>

                {/* Recent Signups */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[#444]">Recent Signups</p>
                        <Link href="/admin/users" className="text-[10px] font-mono text-[#f26722]/60 hover:text-[#f26722] transition-colors uppercase tracking-wider flex items-center gap-1">
                            View All <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden">
                        {recent.length === 0 ? (
                            <div className="p-8 text-center text-[#444] font-mono text-xs">No users yet.</div>
                        ) : (
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-[#111]">
                                    {recent.map(u => (
                                        <tr key={u.id} className="hover:bg-[#f26722]/5 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center bg-[#f26722]/10 border border-[#f26722]/20 text-[#f26722] text-xs font-black flex-shrink-0">
                                                        {(u.name || u.email || "?")[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-medium text-[#EDEDED]">{u.name || "—"}</div>
                                                        <div className="text-[11px] text-[#555]">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] font-mono px-2 py-0.5 border uppercase tracking-wider ${u.role === "admin" || u.role === "super_admin"
                                                    ? "border-[#f26722]/30 text-[#f26722] bg-[#f26722]/5"
                                                    : "border-[#1a1a1a] text-[#555]"}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[11px] text-[#444] font-mono text-right">
                                                {format(new Date(u.created_at), "MMM d")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Courses Section ─────────────────────────────────── */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-[#444]">Courses</p>
                        <p className="text-[11px] text-[#333] font-mono mt-0.5">Click a card to edit it inline</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/courses"
                            className="flex items-center gap-1.5 text-[10px] font-mono text-[#f26722]/60 hover:text-[#f26722] transition-colors uppercase tracking-wider">
                            Full Editor <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                </div>

                {courses.length === 0 ? (
                    <div className="bg-[#0a0a0a] border border-dashed border-[#1a1a1a] p-12 text-center">
                        <BookOpen className="h-8 w-8 text-[#222] mx-auto mb-3" />
                        <p className="text-[#444] text-xs font-mono">No courses yet.</p>
                        <Link href="/admin/courses" className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono text-[#f26722]/60 hover:text-[#f26722] transition-colors uppercase tracking-wider">
                            Add your first course <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {courses.map(course => {
                            const isEditing = editingCourse?.id === course.id
                            const isPython = course.title?.toLowerCase().includes("py")
                            return (
                                <div key={course.id} className="flex flex-col">
                                    {/* Course Card */}
                                    <button
                                        onClick={() => isEditing ? setEditingCourse(null) : openEdit(course)}
                                        className={`relative text-left bg-[#0a0a0a] border transition-all group overflow-hidden ${isEditing
                                            ? "border-[#f26722]/60 shadow-[0_0_20px_rgba(242,103,34,0.1)]"
                                            : "border-[#1a1a1a] hover:border-[#f26722]/30 hover:bg-[#f26722]/[0.02]"
                                            }`}
                                    >
                                        {/* top accent */}
                                        <div className={`absolute top-0 left-0 right-0 h-0.5 ${isPython ? "bg-[#facc15]/60" : "bg-[#f26722]/40"} ${isEditing ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`} />

                                        <div className="p-5">
                                            {/* Header row */}
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className={`flex h-9 w-9 items-center justify-center flex-shrink-0 border ${isPython ? "border-[#facc15]/30 bg-[#facc15]/10" : "border-[#f26722]/20 bg-[#f26722]/5"}`}>
                                                    <TerminalSquare className={`h-4 w-4 ${isPython ? "text-[#facc15]" : "text-[#f26722]/70"}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-bold text-[#EDEDED] font-mono truncate">{course.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <span className={`text-[9px] font-mono px-1.5 py-0.5 border uppercase tracking-wider ${course.is_published
                                                            ? "border-green-500/30 text-green-400 bg-green-500/5"
                                                            : "border-[#1a1a1a] text-[#444]"}`}>
                                                            {course.is_published ? "Live" : "Draft"}
                                                        </span>
                                                        {course.is_premium && (
                                                            <span className="text-[9px] font-mono px-1.5 py-0.5 border border-[#f26722]/30 text-[#f26722] bg-[#f26722]/5 uppercase tracking-wider">Premium</span>
                                                        )}
                                                        {course.difficulty && (
                                                            <span className="text-[9px] font-mono text-[#444] uppercase tracking-wider">{course.difficulty}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <Edit3 className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 transition-colors ${isEditing ? "text-[#f26722]" : "text-[#333] group-hover:text-[#f26722]/60"}`} />
                                            </div>

                                            {course.description && (
                                                <p className="text-[11px] text-[#555] font-mono leading-relaxed line-clamp-2 mb-3">{course.description}</p>
                                            )}

                                            {/* Meta */}
                                            <div className="flex items-center gap-3 text-[10px] font-mono text-[#444]">
                                                {course.duration_hours > 0 && (
                                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{course.duration_hours}h</span>
                                                )}
                                                {course.lesson_count > 0 && (
                                                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{course.lesson_count} lessons</span>
                                                )}
                                            </div>
                                        </div>
                                    </button>

                                    {/* Inline Edit Panel */}
                                    {isEditing && (
                                        <div className="bg-[#070707] border border-[#f26722]/30 border-t-0 overflow-hidden">
                                            <div className="h-px bg-[#1a1a1a]" />
                                            <div className="p-5 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#f26722]">Editing Course</span>
                                                    <button onClick={() => setEditingCourse(null)} className="text-[#444] hover:text-[#EDEDED] transition-colors">
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Title */}
                                                <div>
                                                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#444] block mb-1.5">Title</label>
                                                    <input value={editVal.title}
                                                        onChange={e => setEditVal(v => ({ ...v, title: e.target.value }))}
                                                        className="w-full bg-[#050505] border border-[#1a1a1a] text-[#EDEDED] px-3 py-2 text-sm focus:outline-none focus:border-[#f26722]/50 font-mono" />
                                                </div>

                                                {/* Description */}
                                                <div>
                                                    <label className="text-[10px] font-mono uppercase tracking-widest text-[#444] block mb-1.5">Description</label>
                                                    <textarea value={editVal.description}
                                                        onChange={e => setEditVal(v => ({ ...v, description: e.target.value }))}
                                                        rows={3}
                                                        className="w-full bg-[#050505] border border-[#1a1a1a] text-[#EDEDED] px-3 py-2 text-sm focus:outline-none focus:border-[#f26722]/50 font-mono resize-none" />
                                                </div>

                                                {/* Difficulty + Duration */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[10px] font-mono uppercase tracking-widest text-[#444] block mb-1.5">Difficulty</label>
                                                        <select value={editVal.difficulty}
                                                            onChange={e => setEditVal(v => ({ ...v, difficulty: e.target.value }))}
                                                            className="w-full bg-[#050505] border border-[#1a1a1a] text-[#EDEDED] px-3 py-2 text-sm focus:outline-none focus:border-[#f26722]/50 font-mono">
                                                            {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-mono uppercase tracking-widest text-[#444] block mb-1.5">Duration (hrs)</label>
                                                        <input type="number" value={editVal.duration_hours}
                                                            onChange={e => setEditVal(v => ({ ...v, duration_hours: e.target.value }))}
                                                            placeholder="e.g. 40"
                                                            className="w-full bg-[#050505] border border-[#1a1a1a] text-[#EDEDED] px-3 py-2 text-sm focus:outline-none focus:border-[#f26722]/50 font-mono" />
                                                    </div>
                                                </div>

                                                {/* Toggles row */}
                                                <div className="flex items-center gap-3 pt-1">
                                                    <button
                                                        onClick={() => handleTogglePublish(editingCourse)}
                                                        disabled={isPending}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono border uppercase tracking-wider transition-all ${editingCourse.is_published
                                                            ? "border-green-500/30 text-green-400 bg-green-500/5 hover:bg-green-500/10"
                                                            : "border-[#1a1a1a] text-[#555] hover:text-[#EDEDED]"}`}>
                                                        {editingCourse.is_published ? <><Globe className="h-3 w-3" /> Live</> : <><EyeOff className="h-3 w-3" /> Draft</>}
                                                    </button>
                                                    <button
                                                        onClick={() => handleTogglePremium(editingCourse)}
                                                        disabled={isPending}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono border uppercase tracking-wider transition-all ${editingCourse.is_premium
                                                            ? "border-[#f26722]/30 text-[#f26722] bg-[#f26722]/5 hover:bg-[#f26722]/10"
                                                            : "border-[#1a1a1a] text-[#555] hover:text-[#EDEDED]"}`}>
                                                        <Lock className="h-3 w-3" />
                                                        {editingCourse.is_premium ? "Premium" : "Free"}
                                                    </button>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-3 pt-2 border-t border-[#111]">
                                                    <button onClick={handleSave} disabled={saving || isPending}
                                                        className="flex items-center gap-1.5 px-4 py-2 bg-[#f26722] text-[#050505] text-[10px] font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-60">
                                                        {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                                        Save Changes
                                                    </button>
                                                    <Link href="/admin/courses"
                                                        className="flex items-center gap-1 text-[10px] font-mono text-[#555] hover:text-[#f26722] transition-colors uppercase tracking-wider">
                                                        Full Editor <ArrowRight className="h-3 w-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
