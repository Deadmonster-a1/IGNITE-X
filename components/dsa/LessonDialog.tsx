"use client"

import { useState, useEffect } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Code2, PlayCircle, BookOpen, Terminal, Cpu, ChevronRight, GraduationCap } from "lucide-react"
import { Lesson } from "@/lib/dsa-course-data"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { java } from "@codemirror/lang-java"
import DataVisualizer from "./DataVisualizer"
import QuizComponent from "./QuizComponent"
import CallStackDive from "./call-stack-dive"
import ArrayShifter from "./array-shifter"
import SearchRace from "./search-race"
import TwoPointerString from "./two-pointer-string"
import BigORacer from "./big-o-racer"
import SortingMatrix from "./sorting-matrix"
import RamInspector from "./ram-inspector"
import AlgoRouter from "./algo-router"

interface LessonDialogProps {
    lesson: Lesson | null
    partColor: string
    onClose: () => void
}

export default function SimulationChamber({ lesson, partColor, onClose }: LessonDialogProps) {
    const [code, setCode] = useState(lesson?.code || "")
    const [visualizerData, setVisualizerData] = useState([12, 45, 7, 23, 56, 89, 32, 10])
    const [pointers, setPointers] = useState({ "i": 2, "j": 5 })
    const [highlights, setHighlights] = useState([2, 5])
    const [mentorFeedback, setMentorFeedback] = useState("Sequence initialized, Operator. Focus on the memory distribution. The schematic will update as you execute.")
    const [viewMode, setViewMode] = useState<"briefing" | "quiz">("briefing")
    const [showXpGain, setShowXpGain] = useState<number | null>(null)

    useEffect(() => {
        if (lesson) {
            // Simulate AI Mentor "typing" after a short delay
            const timer = setTimeout(() => {
                setMentorFeedback(`Mission: ${lesson.title}. Objective: Analyze the current data state and optimize the pointer alignment. Terminal link secure.`)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [lesson])
    
    if (!lesson) return null

    const Icon = lesson.icon || BookOpen

    const getLanguageExtension = () => {
        // Simple heuristic for demo
        if (code.includes('def ') || code.includes('print(')) return [python()]
        if (code.includes('class ') && code.includes('public ')) return [java()]
        return [javascript()]
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden"
        >
            {/* ─── CHAMBER HUD HEADER ─── */}
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#050508] shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                    <div className="h-6 w-px bg-white/10" />
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center border"
                            style={{ borderColor: `${partColor}30`, backgroundColor: `${partColor}10` }}
                        >
                            <Icon size={16} style={{ color: partColor }} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 leading-none mb-1">
                                {lesson.type} Sequence
                            </span>
                            <h2 className="text-sm font-black uppercase tracking-tight">{lesson.title}</h2>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6 px-4 py-1.5 bg-white/5 border border-white/5 rounded-full">
                        <div className="flex items-center gap-2">
                            <Cpu size={12} className="text-accent animate-pulse" />
                            <span className="font-mono text-[9px] font-bold text-white/40 uppercase">Sync Status: 100%</span>
                        </div>
                        <div className="h-3 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Terminal size={12} className="text-blue-400" />
                            <span className="font-mono text-[9px] font-bold text-white/40 uppercase">Neural Link: Active</span>
                        </div>
                    </div>
                    <button className="px-6 py-2 bg-accent/20 border border-accent/40 rounded-xl text-accent text-xs font-black uppercase tracking-widest hover:bg-accent/30 transition-all shadow-[0_0_20px_rgba(0,255,204,0.1)] hover:shadow-[0_0_30px_rgba(0,255,204,0.2)]">
                        Execute Mission
                    </button>
                </div>
            </header>

            {/* ─── SPLIT PANE WORKSPACE ─── */}
            <main className="flex-1 relative">
                <PanelGroup direction="horizontal">
                    {/* LEFT PANEL: THE BRIEFING */}
                        <div className="absolute inset-0 flex flex-col bg-[#08080c]">
                            {/* Panel Tabs */}
                            <div className="flex border-b border-white/5 bg-black/20 shrink-0">
                                <button 
                                    onClick={() => setViewMode("briefing")}
                                    className={`flex-1 py-4 px-6 text-[10px] font-mono font-black uppercase tracking-[0.2em] transition-all border-b-2 ${viewMode === "briefing" ? "border-accent text-accent bg-accent/5" : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/5"}`}
                                >
                                    Briefing
                                </button>
                                <button 
                                    onClick={() => setViewMode("quiz")}
                                    className={`flex-1 py-4 px-6 text-[10px] font-mono font-black uppercase tracking-[0.2em] transition-all border-b-2 ${viewMode === "quiz" ? "border-accent text-accent bg-accent/5" : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/5"}`}
                                >
                                    Assessment
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                                <AnimatePresence mode="wait">
                                    {viewMode === "briefing" ? (
                                        <motion.div 
                                            key="briefing"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="max-w-prose mx-auto"
                                        >
                                            <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-4">
                                                <Sparkles className="shrink-0 mt-1" style={{ color: partColor }} />
                                                <p className="text-sm font-medium text-white/80 italic leading-relaxed">
                                                    {lesson.tldr}
                                                </p>
                                            </div>
                                                <div className="text-white/60 space-y-6 leading-relaxed">
                                                    {lesson.description.split('\n\n').map((para: string, i: number) => (
                                                        <p key={i}>{para}</p>
                                                    ))}
                                                </div>

                                                <button 
                                                    onClick={() => setViewMode("quiz")}
                                                    className="mt-12 w-full py-4 bg-accent/10 border border-accent/30 rounded-2xl flex items-center justify-center gap-3 group hover:bg-accent/20 transition-all text-accent"
                                                >
                                                    <GraduationCap size={20} className="group-hover:scale-110 transition-transform" />
                                                    <span className="font-black font-mono uppercase tracking-[0.2em] text-xs">Initialize Assessment Sync</span>
                                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="quiz"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="max-w-prose mx-auto"
                                        >
                                            {lesson.quiz && lesson.quiz.length > 0 ? (
                                                <QuizComponent 
                                                    questions={lesson.quiz} 
                                                    onComplete={(score) => {
                                                        const xp = score * 50
                                                        setMentorFeedback(`Assessment complete. Synchronization verified. ${xp} XP modules ready for injection.`)
                                                        setShowXpGain(xp)
                                                        setTimeout(() => setShowXpGain(null), 3000)
                                                    }} 
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                                                        <GraduationCap size={32} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="text-white/60 font-bold font-mono uppercase tracking-tighter">No Assessment Available</h4>
                                                        <p className="text-white/30 text-xs font-mono">This lesson is purely informational.</p>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                    <PanelResizeHandle className="w-px bg-white/10 hover:bg-accent/50 transition-colors" />

                    {/* DYNAMIC SIMULATOR AREA */}
                    {lesson.id === "call_stack" || lesson.id === "factorial" || lesson.id === "what_is_recursion" || lesson.id === "base_case_vs_recursive" ? (
                        <Panel defaultSize={70} minSize={50} className="relative bg-[#050505] overflow-hidden">
                            <div className="absolute inset-0 flex flex-col">
                                <CallStackDive />
                            </div>
                        </Panel>
                    ) : ["array_structure", "indexing", "traversal", "insertions", "deletions", "multidimensional_arrays", "find_max_min", "reverse_array"].includes(lesson.id) ? (
                        <Panel defaultSize={70} minSize={50} className="relative bg-[#050505] overflow-hidden">
                            <div className="absolute inset-0 flex flex-col">
                                <ArrayShifter />
                            </div>
                        </Panel>
                    ) : ["linear_search", "binary_search", "recursive_binary_search", "binary_search_variations", "find_element", "first_occurrence", "square_root_binary"].includes(lesson.id) ? (
                        <Panel defaultSize={70} minSize={50} className="relative bg-[#050505] overflow-hidden">
                            <div className="absolute inset-0 flex flex-col">
                                <SearchRace />
                            </div>
                        </Panel>
                    ) : ["string_representation", "character_encoding", "traversal_strings", "manipulation_techniques", "reverse_string", "palindrome_check", "count_vowels", "check_anagram"].includes(lesson.id) ? (
                        <Panel defaultSize={70} minSize={50} className="relative bg-[#050505] overflow-hidden">
                            <div className="absolute inset-0 flex flex-col">
                                <TwoPointerString />
                            </div>
                        </Panel>
                    ) : ["why_efficiency_matters", "counting_operations", "big_o_notation", "common_complexities", "log_n", "space_complexity", "analyze_loop", "compare_algorithms", "nested_loop", "writing-pseudocode", "time-complexity-mapping", "big-o-notation", "space-complexity"].includes(lesson.id) ? (
                        <Panel defaultSize={70} minSize={50} className="relative bg-[#050505] overflow-hidden">
                            <div className="absolute inset-0 flex flex-col">
                                <BigORacer />
                            </div>
                        </Panel>
                    ) : ["selection_sort", "bubble_sort", "insertion_sort", "sorting_comparisons", "implement_bubble_sort", "sort_descending", "second_largest"].includes(lesson.id) ? (
                        <Panel defaultSize={70} minSize={50} className="relative bg-[#050505] overflow-hidden">
                            <div className="absolute inset-0 flex flex-col">
                                <SortingMatrix />
                            </div>
                        </Panel>
                    ) : ["data_types", "variables", "binary_representation", "number_systems", "unit_converter", "simple_calculator", "binary_to_decimal"].includes(lesson.id) ? (
                        <Panel defaultSize={70} minSize={50} className="relative bg-[#050505] overflow-hidden">
                            <div className="absolute inset-0 flex flex-col">
                                <RamInspector />
                            </div>
                        </Panel>
                    ) : ["what_is_algorithm", "everyday_algorithms", "input_process_output", "constraints", "breaking_problems", "pseudocode", "flowcharts", "flowchart_largest", "temp_converter"].includes(lesson.id) ? (
                        <Panel defaultSize={70} minSize={50} className="relative bg-[#050505] overflow-hidden">
                            <div className="absolute inset-0 flex flex-col">
                                <AlgoRouter />
                            </div>
                        </Panel>
                    ) : (
                        <>
                            {/* CENTER PANEL: THE VISUALIZER */}
                            <Panel defaultSize={40} minSize={30} className="relative">
                                <div className="absolute inset-0 bg-[#020205] border-x border-white/5">
                                    <DataVisualizer 
                                        type="array"
                                        data={visualizerData}
                                        highlightIndices={highlights}
                                        pointerIndices={pointers}
                                    />
                                </div>
                            </Panel>

                            <PanelResizeHandle className="w-px bg-white/10 hover:bg-accent/50 transition-colors" />

                            {/* RIGHT PANEL: THE TERMINAL */}
                            <Panel defaultSize={30} minSize={20} className="relative">
                                <div className="absolute inset-0 flex flex-col bg-[#0d0d14]">
                                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                        </div>
                                        <span className="font-mono text-[10px] uppercase font-black text-white/30 tracking-widest">mission_control.sh</span>
                                        <div className="w-12" />
                                    </div>
                                    <div className="flex-1 overflow-hidden flex flex-col">
                                        <CodeMirror
                                            value={code}
                                            height="100%"
                                            extensions={getLanguageExtension()}
                                            onChange={(value) => setCode(value)}
                                            className="flex-1 text-sm overflow-auto custom-scrollbar"
                                            basicSetup={{
                                                lineNumbers: true,
                                                foldGutter: true,
                                                dropCursor: true,
                                                allowMultipleSelections: false,
                                                indentOnInput: true,
                                            }}
                                        />
                                    </div>

                                    {/* AI MENTOR SLIDE-UP */}
                                    <div className="h-24 bg-accent/10 border-t border-accent/20 p-4 flex items-start gap-4 backdrop-blur-md">
                                        <Activity className="text-accent shrink-0" size={16} />
                                        <div className="flex-1">
                                            <span className="font-mono text-[9px] uppercase font-black text-accent block mb-1">AI Mentor Link</span>
                                            <motion.p 
                                                key={mentorFeedback}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-[11px] text-white/70 leading-relaxed"
                                            >
                                                {mentorFeedback}
                                            </motion.p>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </>
                    )}
                </PanelGroup>
            </main>

            {/* XP Gain Overlay */}
            <AnimatePresence>
                {showXpGain !== null && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.5, y: -100 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-32 h-32 rounded-full border-2 border-dashed border-accent opacity-20 absolute" 
                            />
                            <div className="text-6xl font-black italic tracking-tighter text-accent drop-shadow-[0_0_20px_#00ffcc]">
                                +{showXpGain} XP
                            </div>
                            <div className="px-4 py-1 bg-accent/20 border border-accent/40 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-accent">
                                Modules Synced
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

const Activity = ({ size, className }: { size: number, className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
)
