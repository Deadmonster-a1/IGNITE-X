"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronRight, TerminalSquare, Database, Activity, Cpu } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { javaAdvancedCourseCurriculum } from "@/lib/java-advanced-course-data"

export default function JavaAdvancedCourseLanding() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const allLessons = javaAdvancedCourseCurriculum.flatMap(part => 
    part.chapters.flatMap(chapter => [
        ...chapter.concepts, 
        ...(chapter.missions || []), 
        ...(chapter.problems || [])
    ])
  )
  
  const conceptCount = allLessons.filter(l => !('tasks' in l) && !('difficulty' in l)).length
  const missionCount = allLessons.filter(l => 'tasks' in l || 'difficulty' in l).length

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#05000a] font-sans selection:bg-[#d946ef]/30" style={{ '--accent': '#d946ef' } as React.CSSProperties}>
      <Navbar />

      <main className="relative z-10 pt-[68px]"> {/* Space for fixed navbar */}
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[#d946ef]/20">
          
          {/* Parallax Background */}
          <motion.div 
            style={{ y, opacity }}
            className="absolute inset-0 z-0 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-[#05000a]/50 to-[#05000a]" />
            
            {/* Glowing Advanced JVM/Spring Graphic Representation */}
            <div className="relative w-[120vw] h-[120vw] md:w-[60vw] md:h-[60vw] max-w-4xl max-h-4xl opacity-40 mt-32 md:mt-0 glow-effect overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_60s_linear_infinite]">
                    <defs>
                        <radialGradient id="advancedGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#e879f9" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#05000a" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    {/* Hexagon Core representing Architecture */}
                    <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="none" stroke="#d946ef" strokeWidth="0.3" className="opacity-60" />
                    <polygon points="50,25 70,37 70,63 50,75 30,63 30,37" fill="none" stroke="#d946ef" strokeWidth="0.5" strokeDasharray="1 3" />
                    <polygon points="50,35 60,41 60,59 50,65 40,59 40,41" fill="none" stroke="#f0abfc" strokeWidth="0.2" className="animate-pulse" />
                    <circle cx="50" cy="50" r="10" fill="url(#advancedGlow)" />
                </svg>
            </div>
          </motion.div>

          <div className="container relative z-10 px-6 py-24 md:py-32">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8 animate-[fadeInUp_0.8s_ease-out_both] delay-100">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#d946ef]/40 bg-[#d946ef]/10 text-xs font-mono font-bold uppercase tracking-widest text-[#f0abfc]">
                  <Cpu size={14} /> Elite System Architecture
                </div>
                
                <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
                  Java <br className="sm:hidden" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d946ef] to-[#a21caf] animate-pulse drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                      Advanced
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/50 max-w-2xl font-medium leading-relaxed">
                  The Masterclass. Engineer high-performance systems with Design Patterns, Concurrency, JVM Tuning, and Spring Boot Microservices.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 w-full sm:w-auto">
                   <Link 
                     href="/programs/java-advanced/course"
                     className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-[#05000a] rounded-xl shadow-[0_0_30px_rgba(217,70,239,0.4)] px-10 py-5 text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] hover:bg-[#d946ef] hover:text-white group"
                   >
                     <TerminalSquare size={20} className="transition-transform group-hover:rotate-12" />
                     <span>Initialize Masterclass</span>
                   </Link>
                   
                   <div className="flex items-center gap-6 text-sm font-mono text-white/40">
                      <div className="flex flex-col items-center">
                          <span className="text-[#f0abfc] font-bold text-xl">{conceptCount}</span>
                          <span className="uppercase tracking-widest text-[10px]">Architectures</span>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div className="flex flex-col items-center">
                          <span className="text-[#f0abfc] font-bold text-xl">{missionCount}</span>
                          <span className="uppercase tracking-widest text-[10px]">Implementations</span>
                      </div>
                   </div>
                </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d946ef]/60 to-transparent" />
        </section>

        {/* CURRICULUM SECTION */}
        <section className="py-24 md:py-32 relative bg-[#05000a]">
           <div className="container px-6 max-w-5xl mx-auto">
             
             <div className="mb-16 md:mb-24">
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
                  <Database className="text-[#d946ef]" size={40} />
                  Master <span className="text-[#d946ef] opacity-50">Map</span>
                </h2>
                <div className="h-1 w-24 bg-[#d946ef] mt-6" />
             </div>

             <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#d946ef]/0 before:via-[#d946ef] before:to-[#d946ef]/0">
               {javaAdvancedCourseCurriculum[0].chapters.map((chapter, index) => (
                 <div key={chapter.id} className="relative flex items-center justify-between md:justify-normal md:even:flex-row-reverse group animate-[fadeInUp_0.6s_ease-out_both]" style={{ animationDelay: `${index * 0.15}s` }}>
                   
                   {/* Timeline dot */}
                   <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#05000a] border-2 border-[#d946ef] shadow-[0_0_20px_rgba(217,70,239,0.6)] z-10 shrink-0 md:order-1 md:group-odd:-ml-6 md:group-even:-mr-6 transition-transform group-hover:scale-110">
                      <span className="font-mono text-sm font-bold text-[#f0abfc]">{index + 22}</span>
                   </div>

                   {/* Content Card */}
                   <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors group-hover:border-[#d946ef]/40 group-hover:bg-[#d946ef]/5">
                      <h3 className="text-xl font-bold text-white mb-4">{chapter.title}</h3>
                      <ul className="space-y-2">
                         {chapter.concepts.map((lesson: any) => (
                           <li key={lesson.title} className="flex items-start gap-2 text-sm text-white/50">
                             <ChevronRight size={16} className="text-[#d946ef] shrink-0 mt-0.5" />
                             <span>{lesson.title}</span>
                           </li>
                         ))}
                         {chapter.missions?.map((lesson: any) => (
                           <li key={lesson.title} className="flex items-start gap-2 text-sm text-[#f0abfc]/90 font-mono mt-4 border-t border-white/5 pt-4">
                             <TerminalSquare size={16} className="text-[#f0abfc] shrink-0 mt-0.5" />
                             <span>Architect: {lesson.title}</span>
                           </li>
                         ))}
                         {chapter.problems?.map((lesson: any) => (
                           <li key={lesson.title} className="flex items-start gap-2 text-sm text-yellow-500/70 font-mono mt-4 border-t border-white/5 pt-4">
                             <TerminalSquare size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                             <span>Implement: {lesson.title}</span>
                           </li>
                         ))}
                      </ul>
                   </div>

                 </div>
               ))}
             </div>

           </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
