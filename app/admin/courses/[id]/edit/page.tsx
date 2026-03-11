"use client"

import { useState, useEffect, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import { getCourseContent } from "@/app/actions/courses"
import { createModule, updateModule, deleteModule, createLesson, updateLesson, deleteLesson, reorderModule, reorderLesson } from "@/app/actions/curriculum"
import {
    ChevronLeft, Plus, Edit3, Trash2, GripVertical, Settings,
    FileText, Terminal, AlignLeft, Check, AlertCircle, Loader2, Play,
    ArrowUp, ArrowDown, Eye, Code, Image as ImageIcon, Link as LinkIcon, Bold, Italic, Type, FileCode2,
    MonitorPlay
} from "lucide-react"

export default function EditCourseDashboard() {
    const params = useParams()
    const router = useRouter()
    const courseId = params.id as string

    const [course, setCourse] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null)

    // Editing States
    const [activeLesson, setActiveLesson] = useState<any | null>(null)
    const [lessonEditForm, setLessonEditForm] = useState<any>({})

    const [activeModule, setActiveModule] = useState<any | null>(null)
    const [moduleEditForm, setModuleEditForm] = useState<any>({})

    const [previewMode, setPreviewMode] = useState(false)

    const notify = (type: "ok" | "err", msg: string) => {
        setToast({ type, msg })
        setTimeout(() => setToast(null), 3000)
    }

    const handleSaveLesson = async () => {
        if (!activeLesson) return
        startTransition(async () => {
            const res = await updateLesson(activeLesson.id, lessonEditForm)
            if (res.success) {
                notify("ok", "Lesson updated successfully!")
                loadData() // Refresh the sidebar data
            } else {
                notify("err", res.error || "Failed to save lesson details")
            }
        })
    }

    const handleSaveModule = async () => {
        if (!activeModule) return
        startTransition(async () => {
            const res = await updateModule(activeModule.id, moduleEditForm.title, activeModule.sequence_order)
            if (res.success) {
                notify("ok", "Module updated successfully!")
                loadData()
            } else notify("err", res.error || "Failed to save module")
        })
    }

    const handleAddModule = async () => {
        const title = prompt("Enter Module Title:")
        if (!title) return

        startTransition(async () => {
            const sequence = (course?.modules?.length || 0) + 1
            const res = await createModule(courseId, title, sequence)
            if (res.success) {
                notify("ok", "Module added")
                loadData()
            } else notify("err", res.error || "Error adding module")
        })
    }

    const handleAddLesson = async (moduleId: string, currentLessonsCount: number) => {
        const title = prompt("Enter Lesson Title:")
        if (!title) return

        const isInteractive = confirm("Should this be an interactive terminal challenge?\n\nOK for Yes, Cancel for Standard Text")

        startTransition(async () => {
            const res = await createLesson(moduleId, {
                title,
                sequence_order: currentLessonsCount + 1,
                content_type: isInteractive ? "interactive" : "text"
            })
            if (res.success) {
                notify("ok", "Lesson added")
                loadData()
            } else notify("err", res.error || "Error adding lesson")
        })
    }

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm("Are you sure you want to delete this module and ALL its lessons?")) return
        startTransition(async () => {
            const res = await deleteModule(moduleId)
            if (res.success) {
                notify("ok", "Module deleted")
                if (activeLesson?.module_id === moduleId) setActiveLesson(null)
                loadData()
            } else notify("err", res.error || "Failed to delete module")
        })
    }

    const handleDeleteLesson = async (lessonId: string, event: React.MouseEvent) => {
        event.stopPropagation()
        if (!confirm("Are you sure you want to delete this lesson?")) return
        startTransition(async () => {
            const res = await deleteLesson(lessonId)
            if (res.success) {
                notify("ok", "Lesson deleted")
                if (activeLesson?.id === lessonId) setActiveLesson(null)
                loadData()
            } else notify("err", res.error || "Failed to delete lesson")
        })
    }

    const handleReorderModule = async (moduleId: string, direction: "up" | "down", event: React.MouseEvent) => {
        event.stopPropagation()
        startTransition(async () => {
            const res = await reorderModule(courseId, moduleId, direction)
            if (res.success) loadData()
            else notify("err", res.error || "Failed to reorder module")
        })
    }

    const handleReorderLesson = async (moduleId: string, lessonId: string, direction: "up" | "down", event: React.MouseEvent) => {
        event.stopPropagation()
        startTransition(async () => {
            const res = await reorderLesson(moduleId, lessonId, direction)
            if (res.success) loadData()
            else notify("err", res.error || "Failed to reorder lesson")
        })
    }

    const loadData = () => {
        startTransition(async () => {
            const data = await getCourseContent(courseId)
            setCourse(data)
            setLoading(false)
        })
    }

    useEffect(() => { loadData() }, [courseId])

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>

    if (!course) return <div className="p-12 text-center font-mono text-muted-foreground uppercase">Course Error. Data Corrupted.</div>

    return (
        <div className="flex h-screen bg-background overflow-hidden relative selection:bg-accent/30 selection:text-accent">
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 border text-sm font-mono ${toast.type === "ok" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
                    {toast.type === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {toast.msg}
                </div>
            )}

            {/* Sidebar Syllabus Tree */}
            <div className="w-80 border-r border-border bg-[#050505] flex flex-col shrink-0">
                <div className="p-4 border-b border-border flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <button onClick={() => router.push('/admin/courses')} className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-white shrink-0">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="flex-1 truncate">
                            <h2 className="font-bold text-sm truncate">{course.title}</h2>
                            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Syllabus Editor</span>
                        </div>
                    </div>
                    <button onClick={handleAddModule} title="Add New Module" className="p-1.5 bg-accent/20 text-accent hover:bg-accent hover:text-white rounded-md transition-colors shrink-0">
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                    {course.modules?.map((m: any, mIdx: number) => (
                        <div key={m.id} className="border border-border/50 bg-card rounded-md overflow-hidden">
                            <div
                                className={`bg-secondary/30 p-2.5 flex items-center justify-between border-b border-border/30 group cursor-pointer transition-colors ${activeModule?.id === m.id ? 'bg-accent/10 border-accent/30' : 'hover:bg-secondary/40'}`}
                                onClick={() => {
                                    setActiveLesson(null)
                                    setActiveModule(m)
                                    setModuleEditForm({ title: m.title || "" })
                                }}
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div className="flex flex-col gap-0.5 opacity-30 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => handleReorderModule(m.id, "up", e)} disabled={mIdx === 0} className="hover:text-accent disabled:opacity-20"><ArrowUp className="h-2.5 w-2.5" /></button>
                                        <button onClick={(e) => handleReorderModule(m.id, "down", e)} disabled={mIdx === course.modules.length - 1} className="hover:text-accent disabled:opacity-20"><ArrowDown className="h-2.5 w-2.5" /></button>
                                    </div>
                                    <span className={`text-[11px] font-bold uppercase tracking-widest font-mono truncate ${activeModule?.id === m.id ? 'text-accent' : 'text-foreground'}`} title={m.title}>
                                        M{m.sequence_order}: {m.title}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                    <button onClick={(e) => { e.stopPropagation(); handleAddLesson(m.id, m.lessons?.length || 0) }} className="text-muted-foreground hover:text-accent p-1">
                                        <Plus className="h-3.5 w-3.5" />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteModule(m.id) }} className="text-muted-foreground hover:text-red-400 p-1">
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-1.5 space-y-1">
                                {m.lessons?.map((l: any, lIdx: number) => (
                                    <button
                                        key={l.id}
                                        onClick={() => {
                                            setActiveModule(null)
                                            setActiveLesson(l)
                                            setLessonEditForm({
                                                title: l.title || "",
                                                description: l.description || "",
                                                content_type: l.content_type || "text",
                                                content: l.content || "",
                                                xp_reward: l.xp_reward || 0,
                                                challenge_data: l.challenge_data || null
                                            })
                                        }}
                                        className={`w-full text-left p-2 rounded-sm text-xs flex items-center justify-between group transition-colors ${activeLesson?.id === l.id ? 'bg-accent/10 text-foreground border border-accent/20' : 'hover:bg-white/5 text-muted-foreground'}`}
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden flex-1">
                                            <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={(e) => handleReorderLesson(m.id, l.id, "up", e)} disabled={lIdx === 0} className="hover:text-accent disabled:opacity-20"><ArrowUp className="h-2 w-2" /></button>
                                                <button onClick={(e) => handleReorderLesson(m.id, l.id, "down", e)} disabled={lIdx === m.lessons.length - 1} className="hover:text-accent disabled:opacity-20"><ArrowDown className="h-2 w-2" /></button>
                                            </div>
                                            {l.content_type === "interactive" ? <Terminal className="h-3.5 w-3.5 text-accent shrink-0" /> : <FileText className="h-3.5 w-3.5 shrink-0" />}
                                            <span className="truncate font-medium">{l.title}</span>
                                        </div>
                                        <div onClick={(e) => handleDeleteLesson(l.id, e)} className="p-1 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                            <Trash2 className="h-3 w-3" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Editor Space */}
            <div className="flex-1 overflow-y-auto bg-background p-8">
                {(!activeLesson && !activeModule) ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 max-w-sm mx-auto text-center">
                        <Settings className="h-12 w-12 mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">Select an Item</h3>
                        <p className="text-sm">Click on a module or lesson from the sidebar to edit its text contents and configurations.</p>
                    </div>
                ) : activeModule ? (
                    <div className="max-w-4xl mx-auto space-y-8 pb-24">
                        <div className="flex items-center justify-between border-b border-border/50 pb-6">
                            <div>
                                <span className="text-[10px] font-mono text-accent uppercase tracking-widest bg-accent/10 px-2 py-1 rounded-sm border border-accent/20">
                                    Module Settings
                                </span>
                                <h1 className="text-3xl font-black mt-4 text-foreground">Editing Module</h1>
                            </div>
                            <button
                                onClick={handleSaveModule}
                                disabled={isPending}
                                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white text-xs font-mono font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center gap-2"
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                Save Module
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Module Title</label>
                                <input
                                    type="text"
                                    value={moduleEditForm.title}
                                    onChange={(e) => setModuleEditForm({ ...moduleEditForm, title: e.target.value })}
                                    className="w-full bg-[#0a0a0a] border border-border/50 rounded-sm p-4 text-sm font-medium focus:border-accent outline-none text-foreground"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-8 pb-24">
                        <div className="flex items-center justify-between border-b border-border/50 pb-6">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-accent uppercase tracking-widest bg-accent/10 px-2 py-1 rounded-sm border border-accent/20">
                                        {activeLesson.content_type === "interactive" ? "Terminal Challenge" : "Standard Lesson"}
                                    </span>
                                    <button
                                        onClick={() => {
                                            const newType = lessonEditForm.content_type === 'interactive' ? 'text' : 'interactive'
                                            setLessonEditForm({
                                                ...lessonEditForm,
                                                content_type: newType,
                                                challenge_data: newType === 'interactive' ? { initialCode: '# Code here', expectedOutput: '', instructions: 'Follow instructions' } : null
                                            })
                                        }}
                                        className="text-[10px] font-mono hover:text-accent text-muted-foreground flex items-center gap-1 transition-colors bg-white/5 px-2 py-1 rounded-sm"
                                    >
                                        <MonitorPlay className="h-3 w-3" /> Toggle Type
                                    </button>
                                </div>
                                <h1 className="text-3xl font-black mt-4 text-foreground">{activeLesson.title}</h1>
                            </div>
                            <button
                                onClick={handleSaveLesson}
                                disabled={isPending}
                                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white text-xs font-mono font-bold uppercase tracking-widest rounded-sm transition-colors flex items-center gap-2"
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                Save Changes
                            </button>
                        </div>

                        {/* Title & Description */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Lesson Title</label>
                                <input
                                    type="text"
                                    value={lessonEditForm.title}
                                    onChange={(e) => setLessonEditForm({ ...lessonEditForm, title: e.target.value })}
                                    className="w-full bg-[#0a0a0a] border border-border/50 rounded-sm p-3 text-sm font-medium focus:border-accent outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">XP Reward</label>
                                <input
                                    type="number"
                                    value={lessonEditForm.xp_reward}
                                    onChange={(e) => setLessonEditForm({ ...lessonEditForm, xp_reward: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-[#0a0a0a] border border-border/50 rounded-sm p-3 text-sm font-mono focus:border-accent outline-none"
                                />
                            </div>
                        </div>

                        {/* Main Content (Markdown) */}
                        <div className="space-y-2 pt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex bg-[#0a0a0a] border border-border/50 rounded-md p-1">
                                    <button onClick={() => setPreviewMode(false)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-widest transition-colors ${!previewMode ? "bg-accent/20 text-accent font-bold" : "text-muted-foreground hover:text-white"}`}><Edit3 className="h-3 w-3" /> Edit</button>
                                    <button onClick={() => setPreviewMode(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono uppercase tracking-widest transition-colors ${previewMode ? "bg-info/20 text-info font-bold" : "text-muted-foreground hover:text-white"}`}><Eye className="h-3 w-3" /> Preview</button>
                                </div>
                            </div>

                            {!previewMode && (
                                <div className="bg-[#050505] border border-border/50 rounded-md overflow-hidden flex flex-col focus-within:border-accent/60 transition-colors">
                                    <div className="bg-[#0a0a0a] border-b border-border/50 p-2 flex items-center gap-2 overflow-x-auto hide-scrollbar">
                                        <button onClick={() => setLessonEditForm({ ...lessonEditForm, content: lessonEditForm.content + "\n**Bold**" })} className="p-1.5 hover:bg-white/10 rounded text-muted-foreground hover:text-white" title="Bold"><Bold className="h-3.5 w-3.5" /></button>
                                        <button onClick={() => setLessonEditForm({ ...lessonEditForm, content: lessonEditForm.content + "\n*Italic*" })} className="p-1.5 hover:bg-white/10 rounded text-muted-foreground hover:text-white" title="Italic"><Italic className="h-3.5 w-3.5" /></button>
                                        <div className="w-[1px] h-4 bg-border/50 mx-1" />
                                        <button onClick={() => setLessonEditForm({ ...lessonEditForm, content: lessonEditForm.content + "\n[Link Text](url)" })} className="p-1.5 hover:bg-white/10 rounded text-muted-foreground hover:text-white" title="Link"><LinkIcon className="h-3.5 w-3.5" /></button>
                                        <button onClick={() => setLessonEditForm({ ...lessonEditForm, content: lessonEditForm.content + "\n![Image Description](url)" })} className="p-1.5 hover:bg-white/10 rounded text-muted-foreground hover:text-white" title="Image"><ImageIcon className="h-3.5 w-3.5" /></button>
                                        <div className="w-[1px] h-4 bg-border/50 mx-1" />
                                        <button onClick={() => setLessonEditForm({ ...lessonEditForm, content: lessonEditForm.content + "\n`inline code`" })} className="p-1.5 hover:bg-white/10 rounded text-muted-foreground hover:text-white" title="Inline Text Code"><Code className="h-3.5 w-3.5" /></button>
                                        <button onClick={() => setLessonEditForm({ ...lessonEditForm, content: lessonEditForm.content + "\n```python\n# Terminal card code...\n```" })} className="flex items-center gap-1.5 p-1.5 px-2 hover:bg-accent/10 rounded-sm text-accent hover:text-accent font-mono text-[10px] font-bold uppercase" title="Large Terminal Block"><FileCode2 className="h-3 w-3" /> Terminal Block</button>
                                        <button onClick={() => setLessonEditForm({ ...lessonEditForm, content: lessonEditForm.content + "\n[FLOWCHART: ID]" })} className="ml-auto text-muted-foreground/50 text-[10px] font-mono hover:text-white">Insert Logic Flow</button>
                                    </div>
                                    <textarea
                                        value={lessonEditForm.content}
                                        onChange={(e) => setLessonEditForm({ ...lessonEditForm, content: e.target.value })}
                                        className="w-full bg-transparent p-5 text-sm font-mono outline-none min-h-[350px] resize-y text-muted-foreground/90 leading-relaxed"
                                        placeholder="Type instruction steps here using standard markdown..."
                                    />
                                </div>
                            )}

                            {previewMode && (
                                <div className="bg-[#050505] border border-info/30 rounded-md p-8 min-h-[350px] overflow-x-auto shadow-inner">
                                    <div
                                        className="prose prose-invert max-w-none prose-pre:bg-[#090c10] prose-pre:border prose-pre:border-[#30363d] prose-pre:shadow-inner text-muted-foreground/80 font-sans tracking-wide leading-[1.8]
                                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground/90 
                                        prose-h3:text-accent prose-h3:uppercase prose-h3:text-xs prose-h3:tracking-[0.2em]
                                        prose-strong:text-foreground prose-strong:font-bold prose-blockquote:border-accent/30 prose-blockquote:bg-accent/5 prose-blockquote:py-1 prose-blockquote:px-6"
                                        dangerouslySetInnerHTML={{
                                            __html: (lessonEditForm.content || "No content provided.")
                                                .replace(/\n/g, '<br/>')
                                                .replace(/```python<br\/>([\s\S]*?)<br\/>```/g, '<div class="relative group my-8"><div class="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-info/20 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div><div class="relative bg-[#090c10] border border-[#30363d] rounded-md overflow-hidden shadow-2xl"><div class="flex items-center justify-between px-4 py-2 border-b border-[#30363d] bg-black/20"><span class="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50">code_snippet.py</span><div class="flex gap-1"><div class="h-2 w-2 rounded-full bg-red-900/40"></div><div class="h-2 w-2 rounded-full bg-yellow-900/40"></div><div class="h-2 w-2 rounded-full bg-green-900/40"></div></div></div><pre class="p-5 font-mono text-sm text-[#c9d1d9] overflow-x-auto"><code>$1</code></pre></div></div>')
                                                .replace(/`([^`]+)`/g, '<code class="text-accent bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded-sm text-[0.85em] tracking-wide font-mono">$1</code>')
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Interactive Challenge Data */}
                        {lessonEditForm.content_type === "interactive" && (
                            <div className="space-y-6 pt-6 mt-12 border-t border-border/30 relative">
                                <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-info flex items-center gap-2">
                                    <Terminal className="h-4 w-4" /> Terminal Sandboxing Config
                                </h3>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Challenge Instructions (HUD text)</label>
                                    <textarea
                                        value={lessonEditForm.challenge_data?.instructions || ""}
                                        onChange={(e) => setLessonEditForm({
                                            ...lessonEditForm,
                                            challenge_data: { ...(lessonEditForm.challenge_data || {}), instructions: e.target.value }
                                        })}
                                        className="w-full bg-[#050505] border border-border/50 rounded-sm p-4 text-sm font-sans focus:border-accent outline-none min-h-[80px]"
                                    />
                                </div>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Initial Console Code</label>
                                        <textarea
                                            value={lessonEditForm.challenge_data?.initialCode || ""}
                                            onChange={(e) => setLessonEditForm({
                                                ...lessonEditForm,
                                                challenge_data: { ...(lessonEditForm.challenge_data || {}), initialCode: e.target.value }
                                            })}
                                            className="w-full bg-[#000] border border-border/50 rounded-sm p-4 text-sm font-mono focus:border-accent outline-none min-h-[150px] text-info"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Expected Validation Output</label>
                                        <input
                                            type="text"
                                            value={lessonEditForm.challenge_data?.expectedOutput || ""}
                                            onChange={(e) => setLessonEditForm({
                                                ...lessonEditForm,
                                                challenge_data: { ...(lessonEditForm.challenge_data || {}), expectedOutput: e.target.value }
                                            })}
                                            className="w-full bg-[#000] border border-border/50 rounded-sm p-3 text-sm font-mono focus:border-accent outline-none text-success"
                                            placeholder="e.g. HELLO_WORLD"
                                        />
                                        <p className="text-[10px] text-muted-foreground/50">Used by the backend execution engine to grant XP.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
