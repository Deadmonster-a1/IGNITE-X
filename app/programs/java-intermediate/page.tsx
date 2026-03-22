"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronRight, TerminalSquare, Code2, Database, Network, Activity } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { javaIntermediateCourseCurriculum } from "@/lib/java-intermediate-course-data"

export default function JavaIntermediateCourseLanding() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Collect all concepts across all chapters in the single part for the stats
  const allLessons = javaIntermediateCourseCurriculum.flatMap(part => 
    part.chapters.flatMap(chapter => [
        ...chapter.concepts, 
        ...(chapter.missions || []), 
        ...(chapter.problems || [])
    ])
  )
  
  const conceptCount = allLessons.filter(l => l.type === 'concept').length
  const missionCount = allLessons.filter(l => l.type === 'practice').length

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#0a0510] font-sans selection:bg-[#a855f7]/30" style={{ '--accent': '#a855f7' } as React.CSSProperties}>
      <Navbar />

      <main className="relative z-10 pt-[68px]"> {/* Space for fixed navbar */}
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[#a855f7]/20">
          
          {/* Parallax Background */}
          <motion.div 
            style={{ y, opacity }}
            className="absolute inset-0 z-0 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-[#0a0510]/50 to-[#0a0510]" />
            
            {/* Glowing Java/JVM Graphic Representation */}
            <div className="relative w-[120vw] h-[120vw] md:w-[60vw] md:h-[60vw] max-w-4xl max-h-4xl opacity-30 mt-32 md:mt-0 glow-effect overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_120s_linear_infinite]">
                    <defs>
                        <radialGradient id="jvmGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#0a0510" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#a855f7" strokeWidth="0.2" className="opacity-50" />
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#a855f7" strokeWidth="0.5" strokeDasharray="2 4" />
                    <circle cx="50" cy="50" r="25" fill="none" stroke="#c084fc" strokeWidth="0.2" className="animate-pulse" />
                    <rect x="40" y="40" width="20" height="20" fill="url(#jvmGlow)" />
                </svg>
            </div>
          </motion.div>

          <div className="container relative z-10 px-6 py-24 md:py-32">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8 animate-[fadeInUp_0.8s_ease-out_both] delay-100">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#a855f7]/40 bg-[#a855f7]/10 text-xs font-mono font-bold uppercase tracking-widest text-[#c084fc]">
                  <Activity size={14} /> JVM Core Internals
                </div>
                
                <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white">
                  Java <br className="sm:hidden" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] to-[#7e22ce] animate-pulse">
                      Intermediate
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/50 max-w-2xl font-medium leading-relaxed">
                  Go beyond the basics. Master Object-Oriented Architecture, JVM Memory Management, Generics, and Data Structures in Java.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 w-full sm:w-auto">
                   <Link 
                     href="/programs/java-intermediate/course"
                     className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-[#0a0510] rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] px-10 py-5 text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] hover:bg-[#a855f7] hover:text-white group"
                   >
                     <TerminalSquare size={20} className="transition-transform group-hover:rotate-12" />
                     <span>Resume Instance</span>
                   </Link>
                   
                   <div className="flex items-center gap-6 text-sm font-mono text-white/40">
                      <div className="flex flex-col items-center">
                          <span className="text-[#c084fc] font-bold text-xl">{conceptCount}</span>
                          <span className="uppercase tracking-widest text-[10px]">Architectures</span>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div className="flex flex-col items-center">
                          <span className="text-[#c084fc] font-bold text-xl">{missionCount}</span>
                          <span className="uppercase tracking-widest text-[10px]">Implementations</span>
                      </div>
                   </div>
                </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#a855f7]/50 to-transparent" />
        </section>

        {/* CURRICULUM SECTION */}
        <section className="py-24 md:py-32 relative bg-[#0a0510]">
           <div className="container px-6 max-w-5xl mx-auto">
             
             <div className="mb-16 md:mb-24">
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-white flex items-center gap-4">
                  <Database className="text-[#a855f7]" size={40} />
                  Curriculum <span className="text-[#a855f7] opacity-50">Map</span>
                </h2>
                <div className="h-1 w-24 bg-[#a855f7] mt-6" />
             </div>

             <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#a855f7]/0 before:via-[#a855f7] before:to-[#a855f7]/0">
               {javaIntermediateCourseCurriculum[0].chapters.map((chapter, index) => (
                 <div key={chapter.id} className="relative flex items-center justify-between md:justify-normal md:even:flex-row-reverse group animate-[fadeInUp_0.6s_ease-out_both]" style={{ animationDelay: `${index * 0.15}s` }}>
                   
                   {/* Timeline dot */}
                   <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0a0510] border-2 border-[#a855f7] shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10 shrink-0 md:order-1 md:group-odd:-ml-6 md:group-even:-mr-6 transition-transform group-hover:scale-110">
                      <span className="font-mono text-sm font-bold text-[#c084fc]">{index + 9}</span>
                   </div>

                   {/* Content Card */}
                   <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors group-hover:border-[#a855f7]/40 group-hover:bg-[#a855f7]/5">
                      <h3 className="text-xl font-bold text-white mb-4">{chapter.title}</h3>
                      <ul className="space-y-2">
                         {chapter.concepts.map(lesson => (
                           <li key={lesson.id} className="flex items-start gap-2 text-sm text-white/50">
                             <ChevronRight size={16} className="text-[#a855f7] shrink-0 mt-0.5" />
                             <span>{lesson.title}</span>
                           </li>
                         ))}
                         {chapter.missions?.map(lesson => (
                           <li key={lesson.id} className="flex items-start gap-2 text-sm text-yellow-500/70 font-mono mt-4 border-t border-white/5 pt-4">
                             <TerminalSquare size={16} className="text-yellow-500 shrink-0 mt-0.5" />
                             <span>Mission: {lesson.title}</span>
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
