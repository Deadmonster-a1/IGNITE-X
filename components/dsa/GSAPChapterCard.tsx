"use client"

import { useRef, MouseEvent } from "react"
import { Chapter, Lesson } from "@/lib/dsa-course-data"

interface GSAPChapterCardProps {
    chapter: Chapter
    partColor: string
    index: number
    onLessonSelect: (lesson: Lesson, partColor: string) => void
}

export default function GSAPChapterCard({ chapter, partColor, index, onLessonSelect }: GSAPChapterCardProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    // Parse titles
    const chapNum = chapter.title.split(' — ')[0] || `Module ${index + 1}`
    const chapName = chapter.title.split(' — ')[1] || chapter.title

    // Elegant 3D perspective hover effect
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || !contentRef.current) return

        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -8 // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 8

        contentRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleMouseLeave = () => {
        if (!contentRef.current) return
        contentRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    }

    return (
        <div 
            ref={cardRef}
            className="group relative w-[380px] h-[500px] shrink-0"
            style={{ perspective: "1500px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Ambient Background Glow (tied to card position, not 3D transform) */}
            <div 
                className="absolute inset-x-8 -inset-y-4 opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-[80px] pointer-events-none rounded-full"
                style={{ background: partColor }}
            />

            {/* The 3D Movable Card Content */}
            <div 
                ref={contentRef}
                className="w-full h-full rounded-2xl border border-white/10 bg-[#0a0a0d]/80 backdrop-blur-xl flex flex-col overflow-hidden relative transition-transform duration-200 ease-out will-change-transform shadow-2xl"
            >
                {/* Thin top colored border */}
                <div className="h-1 shadow-[0_0_10px_currentcolor] z-10" style={{ backgroundColor: partColor, color: partColor }} />
                
                {/* Header */}
                <div className="px-6 pt-8 pb-6 border-b border-white/5 relative bg-gradient-to-b from-white/[0.03] to-transparent">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: partColor }}>
                        {chapNum}
                    </span>
                    <h3 className="text-2xl font-black text-white leading-tight tracking-tight">
                        {chapName}
                    </h3>

                    {/* Faint watermark number in background */}
                    <span className="absolute top-2 right-4 text-white/[0.02] font-black text-8xl font-mono select-none pointer-events-none">
                        {(index + 1).toString().padStart(2, '0')}
                    </span>
                </div>

                {/* Lessons List */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 custom-scrollbar relative z-10">
                    {[...chapter.concepts, ...chapter.problems].map((lesson) => {
                        const isLocked = lesson.isLocked
                        
                        return (
                            <button 
                                key={lesson.id}
                                onClick={() => {
                                    if(!isLocked) onLessonSelect(lesson, lesson.color || partColor)
                                }}
                                disabled={isLocked}
                                className={`w-full text-left p-3 rounded-xl flex items-center gap-4 transition-all duration-300 group/btn border border-transparent ${
                                    isLocked 
                                        ? 'opacity-40 cursor-not-allowed bg-black/20' 
                                        : 'hover:bg-white/5 hover:border-white/10 active:scale-[0.98]'
                                }`}
                            >
                                <div className="w-10 h-10 rounded-lg bg-[#111115] border border-white/10 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover/btn:bg-[#1a1a20]"
                                     style={{ color: isLocked ? '#666' : (lesson.color || partColor) }}
                                >
                                    <lesson.icon size={18} />
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className={`text-[14px] font-semibold truncate transition-colors duration-300 ${isLocked ? 'text-white/50' : 'text-white/90 group-hover/btn:text-white'}`}>
                                        {lesson.title}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono mt-0.5">
                                        {lesson.type}
                                    </span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
