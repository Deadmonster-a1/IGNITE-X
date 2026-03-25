"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronRight, 
  TerminalSquare, 
  Zap, 
  Trophy, 
  ArrowLeft, 
  Coffee,
  Menu,
  X,
  BookOpen,
  Cpu,
  Database
} from "lucide-react"

import { javaAdvancedCourseCurriculum, Lesson, Chapter, Part } from "@/lib/java-advanced-course-data"
import LessonDialog from "@/components/dsa/LessonDialog"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"

export default function JavaAdvancedDocsLayout() {
  const [activeLesson, setActiveLesson] = useState<any>(javaAdvancedCourseCurriculum[0].chapters[0].concepts[0])
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({
    [javaAdvancedCourseCurriculum[0].chapters[0].id]: true
  })
  const [simulationLesson, setSimulationLesson] = useState<{lesson: any, color: string} | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleChapter = (chapterId: string) => {
    setOpenChapters(prev => ({ ...prev, [chapterId]: !prev[chapterId] }))
  }

  // Find the hierarchy context for the current lesson
  let currentPartTitle = ""
  let currentChapterTitle = ""

  for (const part of javaAdvancedCourseCurriculum) {
    for (const chapter of part.chapters) {
      const allLessons = [...chapter.concepts, ...(chapter.missions || []), ...(chapter.problems || [])]
      if (allLessons.some(l => (l as any).title === activeLesson.title)) {
        currentPartTitle = part.title
        currentChapterTitle = chapter.title
        break
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#05000a] text-foreground overflow-hidden selection:bg-[#d946ef]/30 font-sans" style={{ '--accent': '#d946ef' } as React.CSSProperties}>
      {/* GLOBAL NAVBAR */}
      <div className="relative z-50">
         <Navbar />
      </div>

      {/* BACKGROUND FX FOR THE JAVA JVM THEME */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-[#1a051d]/40 via-transparent to-transparent pointer-events-none" />

      {/* 2-PANE LAYOUT BELOW NAVBAR */}
      <div className="flex flex-1 overflow-hidden pt-[68px] relative z-40">
        
        {/* MOBILE HEADER & MENU TOGGLE */}
        <div className="lg:hidden absolute top-[68px] left-0 right-0 h-14 border-b border-white/10 bg-[#07010a]/90 backdrop-blur-xl z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-white/50">
              <Cpu size={16} className="text-[#d946ef]" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#f0abfc]">
                JVM_Masterclass
              </span>
          </div>
          <button className="text-foreground p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className={cn(
          "w-[320px] shrink-0 border-r border-[#d946ef]/20 bg-[#0a020f]/95 backdrop-blur-xl flex flex-col z-40 transition-transform duration-300 absolute lg:relative h-full",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          {/* Header - Desktop */}
          <div className="hidden lg:flex h-14 border-b border-[#d946ef]/20 items-center px-6 gap-3 shrink-0 bg-[#0d0314]">
            <Cpu size={18} className="text-[#d946ef]" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-white/80">
              JVM_Masterclass
            </span>
          </div>

          {/* Navigation Tree */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 mt-14 lg:mt-0">
            {javaAdvancedCourseCurriculum.map((part) => (
              <div key={part.id} className="space-y-2">
                <h3 className="text-[10px] font-black uppercase text-[#d946ef] tracking-[0.2em] px-2 mb-3 mt-2 flex items-center gap-2">
                  <Database size={12} /> {part.title}
                </h3>
                <div className="space-y-1">
                  {part.chapters.map(chapter => {
                    const hasMissions = (chapter.missions || chapter.problems || []).length > 0;
                    return (
                      <div key={chapter.id} className="space-y-0.5">
                        <button 
                          onClick={() => toggleChapter(chapter.id)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 text-[13px] font-bold hover:text-white transition-colors text-white/60"
                        >
                          <ChevronRight size={14} className={cn("transition-transform", openChapters[chapter.id] && "rotate-90")} />
                          <span className="truncate text-left">{chapter.title}</span>
                        </button>
                        
                        <AnimatePresence>
                          {openChapters[chapter.id] && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-l border-[#d946ef]/30 ml-4 pl-2 space-y-0.5"
                            >
                              {/* Concepts */}
                              {chapter.concepts.map((lesson: any) => (
                                <LessonNavItem 
                                  key={lesson.title} 
                                  lesson={{...lesson, id: lesson.title}} 
                                  isActive={activeLesson.title === lesson.title} 
                                  onClick={() => {
                                    setActiveLesson(lesson)
                                    setIsMobileMenuOpen(false)
                                  }} 
                                />
                              ))}
                              {/* Practice/Missions */}
                              {hasMissions && (
                                  <div className="pt-3 pb-1">
                                      <span className="text-[9px] font-mono font-bold uppercase text-[#d946ef]/70 pl-3 tracking-widest flex items-center gap-2">
                                        <TerminalSquare size={10} /> Architecture Missions
                                      </span>
                                  </div>
                              )}
                              {(chapter.missions || chapter.problems || []).map((lesson: any) => (
                                <LessonNavItem 
                                  key={lesson.title} 
                                  lesson={{...lesson, id: lesson.title, type: 'practice'}} 
                                  isActive={activeLesson.title === lesson.title} 
                                  onClick={() => {
                                    setActiveLesson({...lesson, type: 'practice'})
                                    setIsMobileMenuOpen(false)
                                  }} 
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer HUD -> Advanced Node specific */}
          <div className="p-4 border-t border-[#d946ef]/20 bg-[#0d0314] shrink-0">
            <div className="flex flex-col gap-2">
               <div className="flex items-center justify-between">
                 <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">ZGC Latency</span>
                 <span className="font-mono text-[9px] text-[#d946ef]">&lt; 1ms MAX</span>
               </div>
               <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                 <div className="bg-[#d946ef] h-full w-[15%] animate-pulse" />
               </div>
               <div className="flex items-center gap-2 mt-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
                 <span className="font-mono text-[8px] uppercase tracking-widest text-white/40">Spring Context: ONLINE</span>
               </div>
            </div>
          </div>
        </aside>

        {/* OVERLAY FOR MOBILE */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 relative z-10 flex flex-col bg-transparent overflow-y-auto custom-scrollbar pt-14 lg:pt-0">
           {/* Top Action Bar */}
           <header className="hidden lg:flex h-14 border-b border-[#d946ef]/10 items-center justify-between px-8 sticky top-0 bg-[#0a020f]/80 backdrop-blur-md z-30">
              <div className="flex items-center gap-2 text-[11px] font-mono text-white/40 uppercase tracking-wider truncate max-w-lg">
                 <span className="truncate">{currentPartTitle.split('—')[0]?.trim() || currentPartTitle}</span>
                 <span className="text-[#d946ef]">::</span>
                 <span className="truncate text-white/70">{currentChapterTitle}</span>
                 <span className="text-[#d946ef]">::</span>
                 <span className="text-[#d946ef] shrink-0">Architecture.java</span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                 <div className="flex items-center gap-2 px-3 py-1 rounded-md border border-[#d946ef]/30 bg-[#d946ef]/10">
                   <Trophy size={12} className="text-[#d946ef]" />
                   <span className="font-mono text-[10px] font-bold text-[#f0abfc]">25,900 XP</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 rounded-md border border-white/10 bg-black">
                   <Zap size={12} className="text-yellow-500" />
                   <span className="font-mono text-[10px] font-bold text-white">Mastery Rank</span>
                 </div>
              </div>
           </header>

           {/* Content Container */}
           <div className="max-w-4xl mx-auto w-full p-6 lg:p-12 pb-32">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeLesson.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-10"
                >
                   {/* Breadcrumbs for Mobile */}
                   <div className="lg:hidden flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-wider truncate pb-4 border-b border-white/10 mb-6">
                     <span className="truncate">{currentChapterTitle}</span>
                   </div>

                   {/* Title & Badges */}
                   <div className="space-y-6">
                      <div className="flex items-center gap-5">
                          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#d946ef]/20 to-transparent border border-[#d946ef]/40 shadow-[0_0_20px_rgba(217,70,239,0.2)]">
                              <Database size={28} className="text-[#f0abfc]" />
                          </div>
                          <div>
                              <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-black block mb-1 text-[#d946ef]">
                                {activeLesson.type === 'practice' ? '@Configuration' : '@Service'} {activeLesson.title.replace(/ /g, '')}
                              </span>
                              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-white">
                                  {activeLesson.title}
                              </h1>
                          </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 pt-2">
                          {activeLesson.difficulty && (
                              <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-full border border-red-500/40 bg-red-500/10 text-red-400">
                              Level: {activeLesson.difficulty}
                              </span>
                          )}
                          <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-full border border-[#d946ef]/40 bg-[#d946ef]/10 text-[#f0abfc]">
                              +500 XP Return
                          </span>
                      </div>
                   </div>

                   {/* TL;DR Box (Java Doc Style) */}
                   <div className="p-6 border border-[#d946ef]/20 bg-[#d946ef]/5 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#d946ef] to-[#a21caf]" />
                      <div className="flex items-start gap-4">
                        <Cpu className="text-[#d946ef] mt-1 shrink-0" size={20} />
                        <div>
                          <p className="font-mono text-xs text-[#d946ef] mb-2">/** System Design Specs */</p>
                          <p className="text-lg font-medium text-white/90 leading-relaxed">
                              {activeLesson.description}
                          </p>
                        </div>
                      </div>
                   </div>
                   
                   {/* Tasks / Instructions if Mission */}
                   {activeLesson.tasks && (
                     <div className="space-y-4">
                       <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">Implementation Requirements</h3>
                       <ul className="space-y-3 pl-4">
                         {activeLesson.tasks.map((task: string, i: number) => (
                           <li key={i} className="text-white/70 list-decimal pl-2 marker:text-[#d946ef]">{task}</li>
                         ))}
                       </ul>
                     </div>
                   )}

                   {/* Code Example Block (IntelliJ / IDEA Vibe) */}
                   {activeLesson.codeSnippet && (
                     <div className="mt-12 space-y-4 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
                       <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                         <TerminalSquare size={16} className="text-[#d946ef]" />
                         Core_Architect.java
                       </h3>
                       <div className="relative rounded-xl border border-[#d946ef]/20 bg-[#1e1e1e] overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                         {/* IDEA-style mock window header for code block */}
                         <div className="px-4 py-2 border-b border-[#333] bg-[#2d2d2d] flex items-center gap-2">
                              <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                              </div>
                              <span className="ml-4 font-mono text-[11px] text-[#ccc]">Implementation.java</span>
                         </div>

                         <pre className="p-6 text-[13px] sm:text-sm font-mono text-[#d4d4d4] overflow-x-auto whitespace-pre-wrap leading-relaxed custom-scrollbar">
                           <code dangerouslySetInnerHTML={{
                             // Syntax highlighting matching standard Java + Spring Annotations
                             __html: activeLesson.codeSnippet
                               .replace(/(@[A-Z][a-zA-Z0-9_]*)/g, "<span class='text-[#e5c07b] font-bold'>$1</span>") // Annotations like @Service
                               .replace(/\b(public|private|protected|class|interface|record|static|final|void|int|double|boolean|char|if|else|switch|case|break|continue|for|while|do|return|import|new|extends|implements|throws|try|catch|finally|synchronized|volatile)\b/g, "<span class='text-[#c678dd]'>$1</span>")
                               .replace(/\b(String|System|Console|Thread|Runnable|Callable|Future|ExecutorService|ReentrantLock|List|Set|Map|ArrayList|HashMap|Arrays|Optional|Stream)\b/g, "<span class='text-[#61afef]'>$1</span>")
                               .replace(/(".*?")/g, "<span class='text-[#98c379]'>$1</span>")
                               .replace(/(\/\/.*)/g, "<span class='text-[#5c6370] italic'>$1</span>")
                           }} />
                         </pre>
                       </div>
                     </div>
                   )}

                   {/* Action Bar (Launch IDE) */}
                   <div className="pt-12 mt-12 border-t border-white/10 flex flex-col sm:flex-row gap-6 items-center justify-between animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
                     <div className="flex flex-col text-center sm:text-left">
                       <span className="text-[10px] font-mono text-[#d946ef] uppercase tracking-widest mb-1">Deployment Readiness</span>
                       <span className="font-bold text-lg text-white">Execute Subroutine</span>
                     </div>
                     <button 
                       onClick={() => setSimulationLesson({ lesson: activeLesson, color: "#d946ef" })}
                       className="w-full sm:w-auto relative flex items-center justify-center gap-3 bg-white text-[#05000a] rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] px-8 py-4 text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] hover:bg-[#d946ef] hover:text-white hover:shadow-[0_0_40px_rgba(217,70,239,0.5)] group overflow-hidden"
                     >
                       <TerminalSquare size={18} className="relative z-10" />
                       <span className="relative z-10">Deploy & Execute</span>
                     </button>
                   </div>
                </motion.div>
              </AnimatePresence>
           </div>
        </main>
      </div> {/* END 2-PANE LAYOUT */}

      {/* Lesson Dialog (Simulation Chamber Overlay) */}
      <AnimatePresence>
        {simulationLesson && (
          <LessonDialog 
            lesson={simulationLesson.lesson as any}
            partColor={simulationLesson.color}
            onClose={() => setSimulationLesson(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function LessonNavItem({ lesson, isActive, onClick }: { lesson: any, isActive: boolean, onClick: () => void }) {
  const Icon = lesson.icon || BookOpen
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 px-3 py-2 text-left transition-all rounded-md group relative",
        isActive ? "bg-[#d946ef]/15 text-white shadow-[inset_0_0_10px_rgba(217,70,239,0.15)]" : "hover:bg-white/5 text-white/50 hover:text-white/90"
      )}
    >
      {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#d946ef] rounded-r-md shadow-[0_0_10px_#d946ef]" />
      )}
      <Icon size={14} className={cn("mt-0.5 shrink-0 transition-colors", isActive ? "text-[#f0abfc]" : "text-white/30 group-hover:text-white/60")} />
      <div className="flex flex-col overflow-hidden">
        <span className={cn("text-xs font-medium leading-tight truncate", isActive && "font-bold text-white")}>{lesson.title}</span>
        {lesson.type === 'practice' && <span className={cn("text-[8px] font-mono mt-0.5 uppercase tracking-widest", isActive ? "text-[#d946ef]" : "text-white/30")}>Task.java</span>}
      </div>
    </button>
  )
}
