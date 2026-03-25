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

import { javaCourseCurriculum, Lesson, Chapter, Part } from "@/lib/java-course-data"
import LessonDialog from "@/components/dsa/LessonDialog"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"

export default function JavaCourseDocsLayout() {
  const [activeLesson, setActiveLesson] = useState<Lesson>(javaCourseCurriculum[0].chapters[0].concepts[0])
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({
    [javaCourseCurriculum[0].chapters[0].id]: true
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

  for (const part of javaCourseCurriculum) {
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
    <div className="flex flex-col h-screen bg-[#0a0510] text-foreground overflow-hidden selection:bg-accent/30 font-sans" style={{ '--accent': '#a855f7' } as React.CSSProperties}>
      {/* GLOBAL NAVBAR */}
      <div className="relative z-50">
         <Navbar />
      </div>

      {/* BACKGROUND FX FOR THE JAVA JVM THEME */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-tr from-[#1a0b2e]/40 via-transparent to-transparent pointer-events-none" />

      {/* 2-PANE LAYOUT BELOW NAVBAR */}
      <div className="flex flex-1 overflow-hidden pt-[68px] relative z-40">
        
        {/* MOBILE HEADER & MENU TOGGLE (Below Navbar space) */}
        <div className="lg:hidden absolute top-[68px] left-0 right-0 h-14 border-b border-white/10 bg-[#0c0614]/90 backdrop-blur-xl z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2 text-white/50">
              <Coffee size={16} className="text-[#a855f7]" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest">
                JVM_Navigator
              </span>
          </div>
          <button className="text-foreground p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className={cn(
          "w-[320px] shrink-0 border-r border-[#a855f7]/20 bg-[#0c0614]/95 backdrop-blur-xl flex flex-col z-40 transition-transform duration-300 absolute lg:relative h-full",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          {/* Header - Desktop */}
          <div className="hidden lg:flex h-14 border-b border-[#a855f7]/20 items-center px-6 gap-3 shrink-0 bg-[#0f071a]">
            <Coffee size={18} className="text-[#a855f7]" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-white/80">
              Java_Virtual_Machine
            </span>
          </div>

          {/* Navigation Tree */}
          <nav className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 mt-14 lg:mt-0">
            {javaCourseCurriculum.map((part) => (
              <div key={part.id} className="space-y-2">
                <h3 className="text-[10px] font-black uppercase text-[#a855f7] tracking-[0.2em] px-2 mb-3 mt-2 flex items-center gap-2">
                  <Cpu size={12} /> {part.title}
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
                              className="overflow-hidden border-l border-[#a855f7]/30 ml-4 pl-2 space-y-0.5"
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
                                  <div className="pt-3 pb-1">
                                      <span className="text-[9px] font-mono font-bold uppercase text-[#a855f7]/70 pl-3 tracking-widest flex items-center gap-2">
                                        <TerminalSquare size={10} /> IDE Exercises
                                      </span>
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

          {/* Footer HUD -> Java specific */}
          <div className="p-4 border-t border-[#a855f7]/20 bg-[#0f071a] shrink-0">
            <div className="flex flex-col gap-2">
               <div className="flex items-center justify-between">
                 <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">JVM Heap</span>
                 <span className="font-mono text-[9px] text-[#a855f7]">128MB / 4GB</span>
               </div>
               <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                 <div className="bg-[#a855f7] h-full w-[15%] animate-pulse" />
               </div>
               <div className="flex items-center gap-2 mt-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <span className="font-mono text-[8px] uppercase tracking-widest text-white/40">Garbage Collector: Idle</span>
               </div>
            </div>
          </div>
        </aside>

        {/* OVERLAY FOR MOBILE */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 relative z-10 flex flex-col bg-transparent overflow-y-auto custom-scrollbar pt-14 lg:pt-0">
           {/* Top Action Bar */}
           <header className="hidden lg:flex h-14 border-b border-[#a855f7]/10 items-center justify-between px-8 sticky top-0 bg-[#0c0614]/80 backdrop-blur-md z-30">
              <div className="flex items-center gap-2 text-[11px] font-mono text-white/40 uppercase tracking-wider truncate max-w-lg">
                 <span className="truncate">{currentPartTitle.split('—')[0]?.trim() || currentPartTitle}</span>
                 <span className="text-[#a855f7]">::</span>
                 <span className="truncate text-white/70">{currentChapterTitle}</span>
                 <span className="text-[#a855f7]">::</span>
                 <span className="text-[#a855f7] shrink-0">ClassViewer.java</span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                 <div className="flex items-center gap-2 px-3 py-1 rounded-md border border-[#a855f7]/30 bg-[#a855f7]/10">
                   <Trophy size={12} className="text-[#a855f7]" />
                   <span className="font-mono text-[10px] font-bold text-[#a855f7]">2,450 XP</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 rounded-md border border-white/10 bg-black">
                   <Zap size={12} className="text-yellow-500" />
                   <span className="font-mono text-[10px] font-bold text-white">1 Day Streak</span>
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
                   <div className="lg:hidden flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-wider truncate pb-4 border-b border-white/10 mb-6">
                     <span className="truncate">{currentChapterTitle}</span>
                   </div>

                   {/* Title & Badges */}
                   <div className="space-y-6">
                      <div className="flex items-center gap-5">
                          <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#a855f7]/20 to-transparent border border-[#a855f7]/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                              {activeLesson.icon ? <activeLesson.icon size={28} className="text-[#c084fc]" /> : <Coffee size={28} className="text-[#c084fc]" />}
                          </div>
                          <div>
                              <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-black block mb-1 text-[#a855f7]">
                                public class {activeLesson.title.replace(/ /g, '')}
                              </span>
                              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-white">
                                  {activeLesson.title}
                              </h1>
                          </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 pt-2">
                          {activeLesson.difficulty && (
                              <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-full border border-white/10 bg-white/5">
                              Level: {activeLesson.difficulty}
                              </span>
                          )}
                          <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-full border border-[#a855f7]/40 bg-[#a855f7]/10 text-[#c084fc]">
                              +{activeLesson.xpReward || (activeLesson.type === 'concept' ? 50 : 150)} XP Return
                          </span>
                          {activeLesson.type === 'practice' && (
                              <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase rounded-full border border-yellow-500/40 bg-yellow-500/10 text-yellow-500">
                                  Action Required
                              </span>
                          )}
                      </div>
                   </div>

                   {/* TL;DR Box (Java Doc Style) */}
                   <div className="p-6 border border-[#a855f7]/20 bg-[#a855f7]/5 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#a855f7] to-[#7e22ce]" />
                      <div className="flex items-start gap-4">
                        <Database className="text-[#a855f7] mt-1 shrink-0" size={20} />
                        <div>
                          <p className="font-mono text-xs text-[#a855f7] mb-2">/** Method Summary */</p>
                          <p className="text-lg font-medium text-white/90 leading-relaxed">
                              {activeLesson.tldr}
                          </p>
                        </div>
                      </div>
                   </div>

                   {/* Main Content Body */}
                   <div className="prose prose-invert max-w-none prose-p:text-white/70 prose-p:leading-relaxed prose-p:text-base prose-strong:text-white prose-li:text-white/70 prose-ul:list-disc prose-ul:pl-6 space-y-6">
                     {activeLesson.description.split('\n\n').map((para, i) => {
                       // Check if it looks like a list
                       if (para.includes('\n•') || para.includes('\n- ') || para.includes('\n1. ')) {
                          const lines = para.split('\n');
                          const intro = lines[0] && !lines[0].match(/^[•\-1-9]/) ? lines[0] : null;
                          const listItems = intro ? lines.slice(1) : lines;
                          
                          return (
                              <div key={i} className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/5">
                                  {intro && <p className="font-semibold text-white/90">{intro}</p>}
                                  <ul className="space-y-2 mt-2">
                                      {listItems.map((item, j) => {
                                          const cleanItem = item.replace(/^[•\-\d\.]+\s*/, '');
                                          const formattedItem = cleanItem.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#c084fc]">$1</strong>');
                                          return <li key={j} dangerouslySetInnerHTML={{ __html: formattedItem }} />;
                                      })}
                                  </ul>
                              </div>
                          )
                       }
                       // Bolding mapped to Java purple
                       const formattedPara = para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
                       return <p key={i} dangerouslySetInnerHTML={{ __html: formattedPara }} />
                     })}
                   </div>

                   {/* Code Example Block (IntelliJ / IDEA Vibe) */}
                   {activeLesson.code && (
                     <div className="mt-12 space-y-4 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
                       <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                         <TerminalSquare size={16} className="text-[#a855f7]" />
                         {activeLesson.type === 'concept' ? 'Source.java' : 'Task.java'}
                       </h3>
                       <div className="relative rounded-xl border border-[#a855f7]/20 bg-[#1e1e1e] overflow-hidden shadow-2xl">
                         {/* IDEA-style mock window header for code block */}
                         <div className="px-4 py-2 border-b border-[#333] bg-[#2d2d2d] flex items-center gap-2">
                              <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                              </div>
                              <span className="ml-4 font-mono text-[11px] text-[#ccc]">{activeLesson.id.replace(/-/g, '_')}.java</span>
                         </div>

                         <pre className="p-6 text-[13px] sm:text-sm font-mono text-[#d4d4d4] overflow-x-auto whitespace-pre-wrap leading-relaxed custom-scrollbar">
                           <code dangerouslySetInnerHTML={{
                             // Extremely basic syntax highlighting hack for the demo
                             // Using single quotes for attributes to avoid the double quote regex clobbering it.
                             __html: activeLesson.code
                               .replace(/\b(public|private|protected|class|static|void|int|double|boolean|char|if|else|switch|case|break|continue|for|while|do|return|import|new)\b/g, "<span class='text-[#c678dd]'>$1</span>")
                               .replace(/\b(String|System|Scanner|StringBuilder|Math)\b/g, "<span class='text-[#e5c07b]'>$1</span>")
                               .replace(/(".*?")/g, "<span class='text-[#98c379]'>$1</span>")
                               .replace(/(\/\/.*)/g, "<span class='text-[#5c6370] italic'>$1</span>")
                               .replace(/([A-Z][a-zA-Z0-9_]*)/g, (match, p1) => {
                                  if (['String', 'System', 'Scanner', 'StringBuilder', 'Math'].includes(p1)) return match;
                                  return `<span class='text-[#e5c07b]'>${p1}</span>`;
                               })
                           }} />
                         </pre>
                       </div>
                     </div>
                   )}

                   {/* Action Bar (Launch IDE) */}
                   <div className="pt-12 mt-12 border-t border-white/10 flex flex-col sm:flex-row gap-6 items-center justify-between animate-[fadeInUp_0.6s_ease-out_0.4s_both]">
                     <div className="flex flex-col text-center sm:text-left">
                       <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">JVM Compiler Ready</span>
                       <span className="font-bold text-lg text-white">Open in IDE Simulation</span>
                     </div>
                     <button 
                       onClick={() => setSimulationLesson({ lesson: activeLesson, color: activeLesson.color || "#a855f7" })}
                       className="w-full sm:w-auto relative flex items-center justify-center gap-3 bg-white text-[#0a0510] rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] px-8 py-4 text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] hover:bg-[#a855f7] hover:text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] group overflow-hidden"
                     >
                       <TerminalSquare size={18} className="relative z-10" />
                       <span className="relative z-10">Compile & Run</span>
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
        "w-full flex items-start gap-3 px-3 py-2 text-left transition-all rounded-md group relative",
        isActive ? "bg-[#a855f7]/15 text-white shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]" : "hover:bg-white/5 text-white/50 hover:text-white/90"
      )}
    >
      {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#a855f7] rounded-r-md" />
      )}
      <Icon size={14} className={cn("mt-0.5 shrink-0 transition-colors", isActive ? "text-[#c084fc]" : "text-white/30 group-hover:text-white/60")} />
      <div className="flex flex-col overflow-hidden">
        <span className={cn("text-xs font-medium leading-tight truncate", isActive && "font-bold text-white")}>{lesson.title}</span>
        {lesson.type === 'practice' && <span className={cn("text-[8px] font-mono mt-0.5 uppercase tracking-widest", isActive ? "text-[#a855f7]" : "text-white/30")}>Task.java</span>}
      </div>
    </button>
  )
}
