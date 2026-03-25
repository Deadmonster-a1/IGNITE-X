"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronRight, 
  MonitorPlay, 
  Zap, 
  Trophy, 
  ArrowLeft, 
  Terminal, 
  Menu,
  X,
  BookOpen
} from "lucide-react"

import { courseCurriculum, Lesson, Chapter, Part } from "@/lib/dsa-course-data"
import LessonDialog from "@/components/dsa/LessonDialog"
import { cn } from "@/lib/utils"

export default function DSACourseDocsLayout() {
  const [activeLesson, setActiveLesson] = useState<Lesson>(courseCurriculum[0].chapters[0].concepts[0])
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({
    [courseCurriculum[0].chapters[0].id]: true
  })
  const [simulationLesson, setSimulationLesson] = useState<{lesson: Lesson, color: string} | null>(null)
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

  for (const part of courseCurriculum) {
    for (const chapter of part.chapters) {
      const allLessons = [...chapter.concepts, ...(chapter.missions || []), ...(chapter.problems || [])]
      if (allLessons.some(l => l.id === activeLesson.id)) {
        currentPartTitle = part.title
        currentChapterTitle = chapter.title
        break
      }
    }
  }

  if (!mounted) return null // avoid hydration mismatch on browser

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-accent/30 font-sans">
      {/* BACKGROUND FX */}
      <div className="fixed inset-0 bg-grid-cyber opacity-20 pointer-events-none" />
      <div className="noise-overlay fixed inset-0 opacity-40 pointer-events-none mix-blend-overlay" />
      
      {/* MOBILE HEADER & MENU TOGGLE */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-16 border-b border-border bg-[#050505]/90 backdrop-blur-xl z-50 flex items-center justify-between px-4">
        <Link href="/programs/dsa" className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2">
            <ArrowLeft size={18} />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent cyber-glitch">
              Archive_Core
            </span>
        </Link>
        <button className="text-foreground p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className={cn(
        "w-[300px] shrink-0 border-r border-border bg-[#050505]/95 backdrop-blur-xl flex flex-col z-40 transition-transform duration-300 absolute lg:relative h-full",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header - Desktop */}
        <div className="hidden lg:flex h-16 border-b border-border items-center px-6 gap-3 shrink-0">
          <Link href="/programs/dsa" className="text-muted-foreground hover:text-accent transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent cyber-glitch">
            Archive_Core
          </span>
        </div>

        {/* Navigation Tree */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6 mt-16 lg:mt-0">
          {courseCurriculum.map((part) => (
            <div key={part.id} className="space-y-2">
              <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] px-2 mb-3 mt-4">
                {part.title}
              </h3>
              <div className="space-y-1">
                {part.chapters.map(chapter => {
                  const hasMissions = (chapter.missions || chapter.problems || []).length > 0;
                  return (
                    <div key={chapter.id} className="space-y-0.5">
                      <button 
                        onClick={() => toggleChapter(chapter.id)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-bold hover:text-accent transition-colors text-white/80"
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
                            className="overflow-hidden border-l border-border/50 ml-4 pl-2 space-y-0.5"
                          >
                            {/* Concepts */}
                            {chapter.concepts.map(lesson => (
                              <LessonNavItem 
                                key={lesson.id} 
                                lesson={lesson} 
                                isActive={activeLesson.id === lesson.id} 
                                onClick={() => {
                                  setActiveLesson(lesson)
                                  setIsMobileMenuOpen(false)
                                }} 
                              />
                            ))}
                            {/* Practice/Missions */}
                            {hasMissions && (
                                <div className="pt-2 pb-1">
                                    <span className="text-[9px] font-mono font-bold uppercase text-muted-foreground pl-3 tracking-widest">Missions</span>
                                </div>
                            )}
                            {(chapter.missions || chapter.problems || []).map(lesson => (
                              <LessonNavItem 
                                key={lesson.id} 
                                lesson={lesson} 
                                isActive={activeLesson.id === lesson.id} 
                                onClick={() => {
                                  setActiveLesson(lesson)
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

        {/* Footer HUD */}
        <div className="p-4 border-t border-border bg-black/40 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
             <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">System Online: STABLE</span>
          </div>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative z-10 flex flex-col bg-[#020202]/90 backdrop-blur-3xl overflow-y-auto custom-scrollbar pt-16 lg:pt-0">
         {/* Top Action Bar */}
         <header className="hidden lg:flex h-16 border-b border-border items-center justify-between px-8 sticky top-0 bg-[#020202]/80 backdrop-blur-md z-30">
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider truncate max-w-lg">
               <span className="truncate">{currentPartTitle.split('—')[0]?.trim() || currentPartTitle}</span>
               <ChevronRight size={12} className="shrink-0" />
               <span className="truncate text-white/70">{currentChapterTitle}</span>
               <ChevronRight size={12} className="shrink-0" />
               <span className="text-accent shrink-0">Module Viewer</span>
            </div>

            <div className="flex items-center gap-4 shrink-0">
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-accent/30 bg-accent/10" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}>
                 <Trophy size={14} className="text-accent" />
                 <span className="font-mono text-[10px] font-bold text-accent">14,250 XP</span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-border bg-background" style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}>
                 <Zap size={14} className="text-yellow-500" />
                 <span className="font-mono text-[10px] font-bold text-white">3 Day Streak</span>
               </div>
            </div>
         </header>

         {/* Content Container */}
         <div className="max-w-4xl mx-auto w-full p-6 lg:p-12 pb-32">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeLesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="space-y-10"
              >
                 {/* Breadcrumbs for Mobile */}
                 <div className="lg:hidden flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider truncate pb-4 border-b border-border/50 mb-6">
                   <span className="truncate">{currentChapterTitle}</span>
                 </div>

                 {/* Title & Badges */}
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center border bg-white/5" style={{ borderColor: `${activeLesson.color}30` }}>
                            {activeLesson.icon ? <activeLesson.icon size={24} style={{ color: activeLesson.color }} /> : <BookOpen size={24} style={{ color: activeLesson.color }} />}
                        </div>
                        <div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-black block mb-1" style={{ color: activeLesson.color }}>
                            {activeLesson.type} payload
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none text-foreground">
                                {activeLesson.title}
                            </h1>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {activeLesson.difficulty && (
                            <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase border border-border bg-white/5 cyber-corner">
                            {activeLesson.difficulty}
                            </span>
                        )}
                        <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase border border-accent/40 bg-accent/10 text-accent cyber-corner">
                            +{activeLesson.xpReward || (activeLesson.type === 'concept' ? 50 : 150)} XP
                        </span>
                        {activeLesson.type === 'practice' && (
                            <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase border border-yellow-500/40 bg-yellow-500/10 text-yellow-500 cyber-corner">
                                Practical Mission
                            </span>
                        )}
                    </div>
                 </div>

                 {/* TL;DR Box */}
                 <div className="p-5 border border-white/10 bg-white/5 rounded-none relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: activeLesson.color }} />
                    <p className="text-lg font-medium text-white/90 italic leading-relaxed pl-2">
                        {activeLesson.tldr}
                    </p>
                    <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        {activeLesson.icon ? <activeLesson.icon size={120} /> : <BookOpen size={120} />}
                    </div>
                 </div>

                 {/* Main Content Body */}
                 <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-base prose-strong:text-white prose-li:text-muted-foreground prose-ul:list-disc prose-ul:pl-6 space-y-6">
                   {activeLesson.description.split('\n\n').map((para, i) => {
                     // Check if it looks like a list
                     if (para.includes('\n•') || para.includes('\n- ') || para.includes('\n1. ')) {
                        const lines = para.split('\n');
                        const intro = lines[0] && !lines[0].match(/^[•\-1-9]/) ? lines[0] : null;
                        const listItems = intro ? lines.slice(1) : lines;
                        
                        return (
                            <div key={i} className="space-y-4">
                                {intro && <p>{intro}</p>}
                                <ul className="space-y-2 mt-2">
                                    {listItems.map((item, j) => {
                                        const cleanItem = item.replace(/^[•\-\d\.]+\s*/, '');
                                        // Handle bolding within lists (e.g. **Text**)
                                        const formattedItem = cleanItem.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                        return <li key={j} dangerouslySetInnerHTML={{ __html: formattedItem }} />;
                                    })}
                                </ul>
                            </div>
                        )
                     }
                     // Check if standard text has bolding
                     const formattedPara = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                     return <p key={i} dangerouslySetInnerHTML={{ __html: formattedPara }} />
                   })}
                 </div>

                 {/* Code Example Block */}
                 {activeLesson.code && (
                   <div className="mt-12 space-y-4 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
                     <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                       <Terminal size={16} className="text-accent" />
                       {activeLesson.type === 'concept' ? 'Reference Code / Pseudocode' : 'Mission Briefing / Starter Code'}
                     </h3>
                     <div className="relative border border-white/10 bg-[#0a0a0c] overflow-hidden group">
                       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-50" />
                       <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent" />
                       
                       {/* Mac-style mock window header for code block */}
                       <div className="px-4 py-2 border-b border-white/5 bg-black/50 flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                            <span className="ml-4 font-mono text-[10px] text-white/30 uppercase tracking-widest">{activeLesson.id}.txt</span>
                       </div>

                       <pre className="p-6 text-[13px] sm:text-sm font-mono text-white/70 overflow-x-auto whitespace-pre-wrap leading-relaxed custom-scrollbar">
                         <code>{activeLesson.code}</code>
                       </pre>
                     </div>
                   </div>
                 )}

                 {/* Action Bar (Launch Simulation) */}
                 <div className="pt-12 mt-12 border-t border-border flex flex-col sm:flex-row gap-6 items-center justify-between animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
                   <div className="flex flex-col text-center sm:text-left">
                     <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">Interactive Sandbox</span>
                     <span className="font-bold text-lg text-white">Engage Simulation Chamber</span>
                   </div>
                   <button 
                     onClick={() => setSimulationLesson({ lesson: activeLesson, color: activeLesson.color || "#06b6d4" })}
                     className="w-full sm:w-auto relative flex items-center justify-center gap-3 bg-accent px-8 py-5 text-sm font-black uppercase tracking-widest text-[#050505] transition-all hover:scale-[1.02] overflow-hidden group"
                     style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 93% 100%, 0 100%)" }}
                   >
                     {/* Glitch overlay on hover */}
                     <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[slide-in-left_0.4s_forwards]" />
                     <MonitorPlay size={18} className="relative z-10" />
                     <span className="relative z-10">Launch Environment</span>
                   </button>
                 </div>
              </motion.div>
            </AnimatePresence>
         </div>
      </main>

      {/* Lesson Dialog (Simulation Chamber Overlay) */}
      <AnimatePresence>
        {simulationLesson && (
          <LessonDialog 
            lesson={simulationLesson.lesson}
            partColor={simulationLesson.color}
            onClose={() => setSimulationLesson(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function LessonNavItem({ lesson, isActive, onClick }: { lesson: Lesson, isActive: boolean, onClick: () => void }) {
  const Icon = lesson.icon || BookOpen
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 px-3 py-2 text-left transition-all border border-transparent cyber-corner-hover group relative",
        isActive ? "bg-accent/10 border-accent/20 text-accent" : "hover:bg-white/5 text-muted-foreground hover:text-white"
      )}
    >
      {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-accent rounded-r-full" />
      )}
      <Icon size={14} className={cn("mt-0.5 shrink-0 transition-colors", isActive ? "text-accent" : "text-white/40 group-hover:text-white/80")} />
      <div className="flex flex-col overflow-hidden">
        <span className={cn("text-xs font-medium leading-tight truncate", isActive && "font-bold text-accent cyber-glitch-hover")}>{lesson.title}</span>
        {lesson.type === 'practice' && <span className={cn("text-[8px] font-mono mt-0.5 uppercase tracking-widest", isActive ? "text-accent/80" : "text-yellow-500/80")}>Mission</span>}
      </div>
    </button>
  )
}
