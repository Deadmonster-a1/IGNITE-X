"use client"

import { useState, useEffect, useTransition } from "react"
import {
    getAdminCourses, toggleCoursePublish, toggleCoursePremium,
    updateCourseDetails, deleteCourse, createCourse, getAdminStats
} from "@/app/actions/admin"
import Link from "next/link"
import {
    BookOpen, Edit3, Eye, EyeOff, Star, Save, X,
    Loader2, Check, AlertCircle, Lock, Globe, RefreshCw,
    Trash2, Plus, Search, Users, PieChart, TrendingUp, Download
} from "lucide-react"

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"]

type CourseValues = { title: string; description: string; difficulty: string; duration_hours: string; thumbnail_url: string }
type NewCourseValues = { title: string; slug: string; description: string; difficulty: string; duration_hours: string; is_premium: boolean; template: string }
const EMPTY: CourseValues = { title: "", description: "", difficulty: "Beginner", duration_hours: "", thumbnail_url: "" }
const EMPTY_NEW: NewCourseValues = { title: "", slug: "", description: "", difficulty: "Beginner", duration_hours: "", is_premium: false, template: "blank" }

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [search, setSearch] = useState("")
    const [editModal, setEditModal] = useState<any | null>(null)
    const [editVal, setEditVal] = useState<CourseValues>(EMPTY)
    const [showCreate, setShowCreate] = useState(false)
    const [newVal, setNewVal] = useState<NewCourseValues>(EMPTY_NEW)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [stats, setStats] = useState<any>(null)
    const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null)

    const notify = (type: "ok" | "err", msg: string) => {
        setToast({ type, msg })
        setTimeout(() => setToast(null), 3000)
    }

    const load = () => startTransition(async () => {
        const [cRes, sRes] = await Promise.all([getAdminCourses(), getAdminStats()])
        if (cRes.success && cRes.courses) setCourses(cRes.courses)
        if (sRes.success) setStats(sRes.stats)
        setLoading(false)
    })

    useEffect(() => { load() }, [])

    const openEdit = (course: any) => {
        // Now redirects to the dedicated Course Builder page
    }

    // Removed handleSave for old modal

    const handleTogglePublish = async (courseId: string, isPublished: boolean) => {
        startTransition(async () => {
            const res = await toggleCoursePublish(courseId, isPublished)
            if (res.success) {
                setCourses(prev => prev.map(c => c.id === courseId ? { ...c, is_published: !isPublished } : c))
                notify("ok", `Course ${isPublished ? "unpublished" : "published"}`)
            } else notify("err", res.error || "Failed")
        })
    }

    const handleTogglePremium = async (courseId: string, isPremium: boolean) => {
        startTransition(async () => {
            const res = await toggleCoursePremium(courseId, isPremium)
            if (res.success) {
                setCourses(prev => prev.map(c => c.id === courseId ? { ...c, is_premium: !isPremium } : c))
                notify("ok", `Set to ${isPremium ? "free" : "premium"}`)
            } else notify("err", res.error || "Failed")
        })
    }

    const handleDelete = async (courseId: string) => {
        startTransition(async () => {
            const res = await deleteCourse(courseId)
            if (res.success) {
                setCourses(prev => prev.filter(c => c.id !== courseId))
                notify("ok", "Course deleted")
            } else notify("err", res.error || "Failed")
            setDeleteConfirm(null)
        })
    }

    const handleCreate = async () => {
        if (!newVal.title.trim() || !newVal.slug.trim()) {
            notify("err", "Title and slug are required")
            return
        }
        startTransition(async () => {
            const res = await createCourse({
                title: newVal.title,
                slug: newVal.slug,
                description: newVal.description,
                difficulty: newVal.difficulty,
                duration_hours: parseFloat(newVal.duration_hours) || 0,
                is_premium: newVal.is_premium,
                template: newVal.template,
            })
            if (res.success) {
                notify("ok", "Course created! Refresh to see it.")
                setShowCreate(false)
                setNewVal(EMPTY_NEW)
                load()
            } else notify("err", res.error || "Failed to create course")
        })
    }

    const filtered = courses.filter(c =>
        !search || c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="h-8 w-8 animate-spin text-[#f26722]" /></div>

    return (
        <div className="space-y-6 pt-2">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 border text-sm font-mono ${toast.type === "ok" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
                    {toast.type === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {toast.msg}
                </div>
            )}

            {/* Removed Edit Modal - using full page builder instead */}

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-1.5 w-6 bg-[#f26722]" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#f26722]/70">Course Management</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white">Courses <span className="text-[#333] text-lg">({filtered.length})</span></h1>
                    <p className="text-[#555] text-xs mt-1 font-mono">Edit details, publish/unpublish, change tier — updates appear live on the site.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={async () => {
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courses, null, 2));
                        const downloadAnchorNode = document.createElement('a');
                        downloadAnchorNode.setAttribute("href", dataStr);
                        downloadAnchorNode.setAttribute("download", "courses_export.json");
                        document.body.appendChild(downloadAnchorNode);
                        downloadAnchorNode.click();
                        downloadAnchorNode.remove();
                    }} className="flex items-center gap-2 px-3 py-2 border border-[#1a1a1a] text-xs text-[#555] hover:text-white hover:border-[#333] transition-all font-mono uppercase tracking-wider">
                        <Download className="h-3.5 w-3.5" /> Export JSON
                    </button>
                    <button onClick={load} disabled={isPending}
                        className="flex items-center gap-2 px-3 py-2 border border-[#1a1a1a] text-xs text-[#555] hover:text-[#f26722] hover:border-[#f26722]/30 transition-all font-mono uppercase tracking-wider">
                        <RefreshCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} /> Refresh
                    </button>
                    <button onClick={() => { setShowCreate(v => !v); setNewVal(EMPTY_NEW) }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#f26722] text-[#050505] text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all">
                        <Plus className="h-3.5 w-3.5" /> New Course
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-1 opacity-5 group-hover:opacity-10 transition-opacity"><Users className="h-12 w-12" /></div>
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#444]">Total Users</span>
                        <div className="text-xl font-black text-white mt-1">{stats.totalUsers}</div>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-1 opacity-5 group-hover:opacity-10 transition-opacity"><BookOpen className="h-12 w-12" /></div>
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#444]">Courses</span>
                        <div className="text-xl font-black text-white mt-1">{stats.totalCourses}</div>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-1 opacity-5 group-hover:opacity-10 transition-opacity"><TrendingUp className="h-12 w-12" /></div>
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#444]">Enrollments</span>
                        <div className="text-xl font-black text-[#f26722] mt-1">{stats.totalEnrollments}</div>
                    </div>
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-1 opacity-5 group-hover:opacity-10 transition-opacity"><PieChart className="h-12 w-12" /></div>
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#444]">New (Today)</span>
                        <div className="text-xl font-black text-info mt-1">+{stats.newUsersToday}</div>
                    </div>
                </div>
            )}

            {/* Create Form */}
            {showCreate && (
                <div className="bg-[#0a0a0a] border border-[#f26722]/30 overflow-hidden">
                    <div className="h-0.5 bg-gradient-to-r from-[#f26722]/0 via-[#f26722] to-[#f26722]/0" />
                    <div className="p-6 space-y-4">
                        <h2 className="text-xs font-mono uppercase tracking-widest text-[#f26722]">New Course</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-[#444] block mb-1.5">Title *</label>
                                <input value={newVal.title}
                                    onChange={e => setNewVal(v => ({ ...v, title: e.target.value }))}
                                    placeholder="e.g. Python for Z — Architect Edition"
                                    className="w-full bg-[#050505] border border-[#1a1a1a] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#f26722]/50 font-mono" />
                            </div>
                            <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-[#444] block mb-1.5">Slug * <span className="text-[#333] normal-case">(URL key, e.g. python)</span></label>
                                <input value={newVal.slug}
                                    onChange={e => setNewVal(v => ({ ...v, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                                    placeholder="e.g. python"
                                    className="w-full bg-[#050505] border border-[#1a1a1a] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#f26722]/50 font-mono" />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-[#444] block mb-1.5">Description</label>
                                <textarea value={newVal.description}
                                    onChange={e => setNewVal(v => ({ ...v, description: e.target.value }))}
                                    rows={2} placeholder="Brief course description..."
                                    className="w-full bg-[#050505] border border-[#1a1a1a] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#f26722]/50 font-mono resize-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-[#444] block mb-1.5">Starting Template</label>
                                <select value={newVal.template}
                                    onChange={e => setNewVal(v => ({ ...v, template: e.target.value }))}
                                    className="w-full bg-[#050505] border border-[#1a1a1a] text-[#f26722] px-3 py-2.5 text-sm focus:outline-none focus:border-[#f26722]/50 font-mono font-bold">
                                    <option value="blank">Blank Course</option>
                                    <option value="crash_course">Crash Course (1 Module, 3 Lessons)</option>
                                    <option value="masterclass">Masterclass (4 Modules, 12 Lessons)</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-[#444] block mb-1.5">Difficulty</label>
                                <select value={newVal.difficulty}
                                    onChange={e => setNewVal(v => ({ ...v, difficulty: e.target.value }))}
                                    className="w-full bg-[#050505] border border-[#1a1a1a] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#f26722]/50 font-mono">
                                    {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-[#444] block mb-1.5">Duration (hrs)</label>
                                <input type="number" value={newVal.duration_hours}
                                    onChange={e => setNewVal(v => ({ ...v, duration_hours: e.target.value }))}
                                    placeholder="e.g. 40"
                                    className="w-full bg-[#050505] border border-[#1a1a1a] text-[#EDEDED] px-3 py-2.5 text-sm focus:outline-none focus:border-[#f26722]/50 font-mono" />
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                                    <input type="checkbox" checked={newVal.is_premium}
                                        onChange={e => setNewVal(v => ({ ...v, is_premium: e.target.checked }))}
                                        className="accent-[#f26722]" />
                                    <span className="text-xs font-mono text-[#EDEDED]">Premium Course</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button onClick={() => setShowCreate(false)}
                                className="px-4 py-2 border border-[#1a1a1a] text-[#555] text-xs font-mono uppercase tracking-wider hover:text-[#EDEDED] transition-all">
                                Cancel
                            </button>
                            <button onClick={handleCreate} disabled={isPending}
                                className="flex items-center gap-2 px-6 py-2 bg-[#f26722] text-[#050505] text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-60">
                                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                                Create Course
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#333]" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#1a1a1a] text-sm text-[#EDEDED] focus:outline-none focus:border-[#f26722]/40 transition-all font-mono placeholder:text-[#333]" />
            </div>

            {/* Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map(course => (
                    <div key={course.id}
                        className="relative bg-[#0a0a0a] border border-[#1a1a1a] overflow-hidden group hover:border-[#f26722]/20 transition-all">
                        {/* Status bar */}
                        <div className={`h-1 w-full ${course.is_published ? "bg-green-500" : "bg-amber-500/60"}`} />

                        <div className="p-5">
                            {/* Title */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-[15px] font-bold text-[#EDEDED] leading-snug flex-1">{course.title}</h3>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-[#555] mb-4 line-clamp-2 leading-relaxed">
                                {course.description || <span className="italic">No description</span>}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-[10px] text-[#333] font-mono mb-5">
                                <span>{course.module_count ?? 0} modules</span>
                                <span>·</span>
                                <span className="text-[#f26722]/80 font-bold">{course.enrollment_count ?? 0} students</span>
                                {course.difficulty && <><span>·</span><span>{course.difficulty}</span></>}
                                {course.duration_hours > 0 && <><span>·</span><span>{course.duration_hours}h</span></>}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Publish toggle */}
                                <button onClick={() => handleTogglePublish(course.id, course.is_published)} disabled={isPending}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono font-bold border transition-all ${course.is_published
                                        ? "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                                        : "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"}`}>
                                    {course.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                    {course.is_published ? "Published" : "Draft"}
                                </button>

                                {/* Premium toggle */}
                                <button onClick={() => handleTogglePremium(course.id, course.is_premium)} disabled={isPending}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono font-bold border transition-all ${course.is_premium
                                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
                                        : "bg-[#0d0d0d] border-[#1a1a1a] text-[#555] hover:text-[#aaa] hover:border-[#333]"}`}>
                                    {course.is_premium ? <Lock className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                                    {course.is_premium ? "Premium" : "Free"}
                                </button>

                                {/* Edit Settings */}
                                <Link href={`/admin/courses/${course.id}/edit?tab=settings`}
                                    className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono font-bold border border-[#f26722]/20 text-[#f26722]/70 hover:text-[#f26722] hover:border-[#f26722]/40 hover:bg-[#f26722]/5 transition-all">
                                    <Edit3 className="h-3 w-3" /> Settings
                                </Link>

                                {/* Edit Syllabus */}
                                <Link href={`/admin/courses/${course.id}/edit?tab=syllabus`}
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono font-bold border border-[#a855f7]/20 text-[#a855f7]/70 hover:text-[#a855f7] hover:border-[#a855f7]/40 hover:bg-[#a855f7]/5 transition-all">
                                    <BookOpen className="h-3 w-3" /> Syllabus
                                </Link>

                                {/* Delete */}
                                {deleteConfirm === course.id ? (
                                    <>
                                        <button onClick={() => handleDelete(course.id)} disabled={isPending}
                                            className="px-2.5 py-1.5 text-[10px] font-mono bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all">
                                            {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
                                        </button>
                                        <button onClick={() => setDeleteConfirm(null)}
                                            className="px-2.5 py-1.5 text-[10px] font-mono border border-[#1a1a1a] text-[#444] hover:text-[#EDEDED] transition-all">Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={() => setDeleteConfirm(course.id)}
                                        className="p-1.5 border border-[#1a1a1a] text-[#333] hover:text-red-400 hover:border-red-400/30 transition-all">
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-3 p-12 text-center text-[#333] border border-dashed border-[#1a1a1a]">
                        <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-20" />
                        <p className="font-mono text-xs">No courses found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
