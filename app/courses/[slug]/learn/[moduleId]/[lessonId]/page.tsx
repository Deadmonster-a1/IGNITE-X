"use client"

import { useState, useEffect } from "react"
import { getLessonContent } from "@/app/actions/courses"
import { createClient } from "@/utils/supabase/client"
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"
import { Play, CheckCircle2, XCircle, ChevronRight, Terminal, Loader2, ShieldCheck, Activity, Cpu, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePython } from "@/hooks/use-python"
import { TerminalHud } from "@/components/terminal-hud"
import { CodeFlow } from "@/components/code-flow"
import { useParams } from "next/navigation"

export default function LessonPage() {
    const params = useParams()
    const slug = params.slug as string
    const moduleId = params.moduleId as string
    const lessonId = params.lessonId as string

    const [code, setCode] = useState("")
    const [output, setOutput] = useState<{ type: "success" | "error" | "info" | "running", text: string } | null>(null)
    const [isClient, setIsClient] = useState(false)

    const { isReady: pythonReady, runPython } = usePython()

    const [lesson, setLesson] = useState<any>(null)
    const [moduleInfo, setModuleInfo] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsClient(true)
        const fetchContent = async () => {
            setIsLoading(true)
            const data = await getLessonContent(lessonId)
            if (data) {
                setLesson(data)
                setModuleInfo(data.modules)
                if (data.challenge_data) {
                    setCode(data.challenge_data.initialCode)
                }
            }
            setIsLoading(false)
        }
        if (lessonId) {
            fetchContent()
        }
    }, [lessonId])

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8 text-accent font-mono text-sm animate-pulse uppercase tracking-widest">
                Establishing uplink to Node: {lessonId}...
            </div>
        )
    }

    if (!lesson) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-center">
                    <Terminal className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h2 className="text-xl font-bold">Lesson Not Found</h2>
                    <p className="text-muted-foreground mt-2">The requested active lesson does not exist or has been archived.</p>
                </div>
            </div>
        )
    }

    const handleComplete = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            window.location.href = "/login"
            return
        }

        // Call the RPC to mark complete and award XP securely
        const { error } = await supabase.rpc('complete_lesson_and_award_xp', {
            p_user_id: user.id,
            p_course_id: moduleInfo.courses.id,
            p_lesson_id: lesson.id,
            p_xp_amount: lesson.xp_reward || 50
        })

        if (!error) {
            // Ideally we evaluate what the next lesson is.
            // For now, redirect back to course view.
            window.location.href = `/courses/${slug}/learn`
        }
    }

    const handleRunCode = async () => {
        if (!lesson.challenge_data) return

        setOutput({ type: "running", text: "> SYSTEM READY.\n> INITIALIZING PYODIDE RUNTIME...\n> ALLOCATING MEMORY NODES..." })
        await new Promise(resolve => setTimeout(resolve, 800))
        setOutput({ type: "running", text: "> SYSTEM READY.\n> RUNTIME ONLINE.\n> EXECUTING SOURCE..." })

        const result = await runPython(code)
        const { expectedOutput } = lesson.challenge_data

        if (!result || !result.success) {
            setOutput({
                type: "error",
                text: `> CRITICAL ERROR DETECTED.\n> TRACEBACK (MOST RECENT CALL LAST):\n${result?.error || 'Unknown System Failure'}`
            })
            return
        }

        // Capture standard output
        const consoleOutput = result.output.trim()
        const expected = expectedOutput ? expectedOutput.trim() : null

        // Validate if it matches the expected challenge output
        if (expected && consoleOutput === expected) {
            setOutput({
                type: "success",
                text: `> EXECUTION SUCCESSFUL.\n\nOUTPUT:\n${consoleOutput}\n\n[ MISSION ACCOMPLISHED ]\n+100 XP REWARDED.`
            })
        } else if (expected && consoleOutput !== expected) {
            setOutput({
                type: "error",
                text: `> EXECUTION FINISHED.\n\nOUTPUT:\n${consoleOutput}\n\n> VALIDATION FAILED.\n> EXPECTED: "${expected}"\n> ATTEMPT RELOAD.`
            })
        } else {
            // Just run it if there's no specific expected output
            setOutput({
                type: "info",
                text: `> EXECUTION FINISHED.\n\nOUTPUT:\n${consoleOutput || '(NULL)'}`
            })
        }
    }

    return (
        <div className="flex h-full flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border/50 bg-[#050505]">

            {/* Tutorial Content Area */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 order-1 lg:order-none relative">
                {/* Background subtle noise/grid */}
                <div className="pointer-events-none absolute inset-0 bg-grid-cyber opacity-[0.03]" aria-hidden="true" />

                <div className="mx-auto max-w-2xl relative z-10">
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-3.5 w-3.5 text-accent" />
                            <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-accent/70">
                                {moduleInfo?.title || 'Unknown Module'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter leading-none mb-4">
                            {lesson.title.split(':').pop()?.trim() || lesson.title}
                        </h1>
                        <div className="h-1 w-20 bg-gradient-to-r from-accent to-transparent" />
                    </div>

                    <div
                        className="prose prose-invert max-w-none prose-pre:bg-[#090c10] prose-pre:border prose-pre:border-[#30363d] prose-pre:shadow-inner text-muted-foreground/80 font-sans tracking-wide leading-[1.8]
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-foreground/90 
                        prose-h3:text-accent prose-h3:uppercase prose-h3:text-xs prose-h3:tracking-[0.2em]
                        prose-strong:text-foreground prose-strong:font-bold prose-blockquote:border-accent/30 prose-blockquote:bg-accent/5 prose-blockquote:py-1 prose-blockquote:px-6"
                        dangerouslySetInnerHTML={{
                            __html: (lesson.content || "No content provided.")
                                .replace(/\n/g, '<br/>')
                                .replace(/```python<br\/>([\s\S]*?)<br\/>```/g, '<div class="relative group my-8"><div class="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-info/20 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div><div class="relative bg-[#090c10] border border-[#30363d] rounded-md overflow-hidden shadow-2xl"><div class="flex items-center justify-between px-4 py-2 border-b border-[#30363d] bg-black/20"><span class="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50">code_snippet.py</span><div class="flex gap-1"><div class="h-2 w-2 rounded-full bg-red-900/40"></div><div class="h-2 w-2 rounded-full bg-yellow-900/40"></div><div class="h-2 w-2 rounded-full bg-green-900/40"></div></div></div><pre class="p-5 font-mono text-sm text-[#c9d1d9] overflow-x-auto"><code>$1</code></pre></div></div>')
                                .replace(/`([^`]+)`/g, '<code class="text-accent bg-accent/10 border border-accent/20 px-1.5 py-0.5 rounded-sm text-[0.85em] tracking-wide font-mono">$1</code>')
                                .replace(/\[FLOWCHART: (.*?)\]/g, (match: string, p1: string) => {
                                    return '<div id="flowchart-root"></div>'
                                })
                        }}
                    />
                    {lesson.title.includes('Hello') && (
                        <CodeFlow
                            nodes={[
                                { id: 's1', label: 'Idea Conceived', type: 'start' },
                                { id: 'c1', label: 'Use Python?', type: 'condition' },
                                { id: 'a1', label: 'Rapid Prototype', type: 'action' },
                                { id: 'e1', label: 'Deployment Ready', type: 'end' }
                            ]}
                            activeNodeId="c1"
                        />
                    )}
                </div>
            </div>

            {/* Editor / Challenge Area */}
            <div className="flex flex-col bg-[#050505] lg:w-[45%] xl:w-[50%] shrink-0 border-t lg:border-t-0 border-border/50 order-2 lg:order-none min-h-[500px] lg:min-h-0 relative">

                {/* HUD Header */}
                <TerminalHud status={output?.type || "idle"} title={lesson.challenge_data ? "Mission Terminal" : "Dev Console"} />

                {lesson.challenge_data ? (
                    <>
                        {/* Status Bar / Sub-HUD */}
                        <div className="flex items-center justify-between px-6 py-3 border-b border-border/20 bg-secondary/5">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="font-mono text-[8px] uppercase text-muted-foreground/40 leading-none mb-1">Objective</span>
                                    <span className="font-mono text-[10px] font-bold text-accent tracking-wide uppercase">Interactive Sandbox</span>
                                </div>
                                <div className="h-6 w-[1px] bg-border/20" />
                                <div className="flex flex-col">
                                    <span className="font-mono text-[8px] uppercase text-muted-foreground/40 leading-none mb-1">Language</span>
                                    <span className="font-mono text-[10px] font-bold text-info tracking-wide uppercase">Python 3.11</span>
                                </div>
                            </div>

                            <button
                                onClick={handleRunCode}
                                disabled={!pythonReady || output?.type === "running"}
                                className={`flex items-center gap-2 rounded-sm px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${output?.type === "running"
                                    ? "bg-muted cursor-not-allowed opacity-50"
                                    : "bg-success text-success-foreground hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                                    }`}
                            >
                                {output?.type === "running" ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Play className="h-3.5 w-3.5" fill="currentColor" />
                                )}
                                {pythonReady ? (output?.type === "running" ? "Crunching..." : "Initialize") : "Booting..."}
                            </button>
                        </div>

                        {/* Challenge Instructions Panel */}
                        <div className="bg-accent/5 mx-6 mt-6 px-5 py-4 border border-accent/20 rounded-sm relative group overflow-hidden">
                            <div className="absolute left-0 top-0 h-full w-1 bg-accent" />
                            <div className="absolute right-0 top-0 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                <Cpu className="h-16 w-16 text-accent" />
                            </div>
                            <div className="relative z-10">
                                <span className="font-mono text-[9px] font-black uppercase text-accent tracking-[0.2em] mb-1 block">Protocols: Challenge_Instruction</span>
                                <p className="text-sm font-bold text-foreground leading-relaxed tracking-tight group-hover:text-white transition-colors">
                                    {lesson.challenge_data.instructions}
                                </p>
                            </div>
                        </div>

                        {/* CodeMirror Editor container */}
                        <div className="flex-1 overflow-hidden relative mx-6 mt-4 mb-6 rounded-sm border border-border/30 shadow-2xl bg-[#090c10] group/editor">
                            {/* Glass overlay effect on top edge */}
                            <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10" />

                            {/* Scanline effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30" />

                            {isClient ? (
                                <CodeMirror
                                    value={code}
                                    height="100%"
                                    theme="dark"
                                    extensions={[python()]}
                                    onChange={(val) => setCode(val)}
                                    className="h-full text-base [&_.cm-editor]:h-full [&_.cm-scroller]:font-mono [&_.cm-gutters]:bg-black/40 [&_.cm-gutters]:border-r [&_.cm-gutters]:border-border/30 [&_.cm-content]:px-4"
                                    basicSetup={{
                                        lineNumbers: true,
                                        highlightActiveLineGutter: true,
                                        foldGutter: true,
                                    }}
                                />
                            ) : (
                                <div className="h-full w-full bg-[#0d1117] animate-pulse" />
                            )}

                            {/* Bottom corner accent */}
                            <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-accent/30 group-hover/editor:border-accent transition-colors" />
                        </div>

                        {/* Simulated Console Output HUD */}
                        <div className="border-t border-border/30 bg-black h-64 shrink-0 flex flex-col relative overflow-hidden group/output">
                            {/* CRT Scanline / Noise effect */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-40" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.02)_0%,transparent_70%)] pointer-events-none z-10" />

                            <div className="flex items-center justify-between px-6 py-3 border-b border-border/20 bg-black relative z-20">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-3 w-3 text-muted-foreground/50" />
                                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Execution_Output (stdout)</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-1 w-3 bg-muted-foreground/20 rounded-full" />
                                    <div className="h-1 w-3 bg-muted-foreground/10 rounded-full" />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 font-mono text-sm relative z-20 scrollbar-thin scrollbar-thumb-accent/20">
                                {!output ? (
                                    <div className="flex flex-col gap-2 opacity-30">
                                        <span className="flex items-center gap-2">{'>'} <div className="h-2 w-24 bg-muted-foreground/20 rounded-full animate-pulse" /></span>
                                        <span className="flex items-center gap-2 animate-pulse" style={{ animationDelay: '200ms' }}>{'>'} <div className="h-2 w-32 bg-muted-foreground/20 rounded-full" /></span>
                                        <span className="font-mono text-[10px] uppercase tracking-widest mt-4">Awaiting Signal...</span>
                                    </div>
                                ) : (
                                    <div className={
                                        output.type === "success" ? "text-success drop-shadow-[0_0_8px_rgba(34,197,94,0.3)] font-medium" :
                                            output.type === "error" ? "text-error drop-shadow-[0_0_8px_rgba(239,68,68,0.3)] font-medium" :
                                                "text-info drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]"
                                    }>
                                        <div className="mb-4 opacity-50 flex items-center gap-2 text-[10px] uppercase tracking-widest border-b border-current/10 pb-1 w-fit">
                                            {output.type === "running" ? <Activity className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                                            Log_Status: {output.type === "success" ? "Valid" : output.type === "error" ? "Corrupted" : "Info"}
                                        </div>
                                        <span className="block whitespace-pre-wrap leading-relaxed tracking-tight" dangerouslySetInnerHTML={{ __html: output.text.replace(/\\n/g, '<br/>') }} />
                                    </div>
                                )}
                            </div>

                            {/* Next Lesson Button (only shows on success) */}
                            {output?.type === "success" && (
                                <div className="p-4 border-t border-success/30 bg-success/10 flex justify-end shrink-0 relative z-20">
                                    <button
                                        onClick={handleComplete}
                                        className="group flex items-center gap-2 text-xs font-black text-success hover:text-white transition-all uppercase tracking-widest px-6 py-2 border border-success/40 rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] bg-success/5 hover:bg-success"
                                    >
                                        Complete & Continue
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
                        <p>No interactive challenge available for this lesson.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
