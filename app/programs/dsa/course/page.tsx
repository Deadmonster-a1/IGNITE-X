"use client"

import Link from "next/link"
import { useState } from "react"
import { Sparkles, Code2, ChevronRight, ChevronLeft, ChevronDown, Brain, CheckCircle, ArrowLeft, Lock, BookOpen } from "lucide-react"

import { chapterInfo, lessons, courseCurriculum } from "@/lib/dsa-course-data"

/* ───────── Rich Text & Code Highlighters ───────── */

function RichText({ text }: { text: string }) {
    const lines = text.split('\n');
    const elements = [];
    let inList = false;
    let listItems = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Handle bolding: replace **text** with <strong>text</strong>
        const processLine = (str: string) => {
            const parts = str.split(/(\*\*.*?\*\*)/g);
            return parts.map((part, idx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={idx} className="text-foreground font-bold">{part.slice(2, -2)}</strong>
                }
                return part;
            });
        };

        if (line.startsWith('• ') || line.startsWith('- ')) {
            inList = true;
            listItems.push(<li className="mb-2 ml-6 list-disc pl-2 marker:text-accent" key={i}>{processLine(line.substring(2))}</li>);
        } else {
            if (inList) {
                elements.push(<ul key={`ul-${i}`} className="mb-6 opacity-90">{listItems}</ul>);
                listItems = [];
                inList = false;
            }
            
            if (line.trim() === '') {
                elements.push(<div key={`br-${i}`} className="h-5" />);
            } else if (line.startsWith('### ')) {
                 elements.push(<h3 key={`h3-${i}`} className="text-xl font-semibold mt-10 mb-4 text-foreground tracking-tight">{processLine(line.substring(4))}</h3>);
            } else if (line.startsWith('## ')) {
                 elements.push(
                    <div key={`h2-${i}`} className="mt-12 mb-6">
                        <h2 className="text-2xl font-bold text-foreground tracking-tight mb-3">{processLine(line.substring(3))}</h2>
                        <div className="h-[2px] w-full bg-gradient-to-r from-accent/50 via-accent/10 to-transparent" />
                    </div>
                );
            } else if (line.startsWith('# ')) {
                 elements.push(<h1 key={`h1-${i}`} className="text-4xl font-black mt-16 mb-6 text-foreground tracking-tighter">{processLine(line.substring(2))}</h1>);
            } else {
                elements.push(<p key={`p-${i}`} className="mb-6 leading-relaxed text-[1.05rem] lg:text-[1.15rem] text-muted-foreground/80 font-normal">{processLine(line)}</p>);
            }
        }
    }
    if (inList) {
        elements.push(<ul key="ul-end" className="mb-6 opacity-90">{listItems}</ul>);
    }

    return <div className="rich-text-container font-sans text-muted-foreground">{elements}</div>
}

function PseudocodeLine({ line, index }: { line: string; index: number }) {
    const trimmed = line.trim()

    const isKeyword = /^(START|END|INPUT|OUTPUT|PROCESS|SET|IF|ELSE|ENDIF|THEN|ELSE IF)(\b|:| |$)/.test(trimmed)
    const isComment = trimmed.startsWith('#') || trimmed.startsWith('//')
    const isHeading = trimmed.endsWith(':') && !trimmed.startsWith('Step') && !isKeyword
    const isResult = trimmed.startsWith('Result:') || trimmed.startsWith('Answer:') || trimmed.startsWith('Status:') || trimmed.startsWith('Tip:')
    const isYesNo = trimmed.startsWith('Yes') || trimmed.startsWith('No')
    const isSymbol = trimmed.startsWith('(') || trimmed.startsWith('/') || trimmed.startsWith('[') || trimmed.startsWith('<')

    if (isComment) return <div key={index} className="text-[#8b949e] italic">{line}</div>
    if (isHeading) return <div key={index} className="text-[#d2a8ff] font-bold mt-2">{line}</div>
    if (isKeyword) {
        const match = trimmed.match(/^(START|END|INPUT|OUTPUT|PROCESS|SET|IF|ELSE IF|ELSE|ENDIF|THEN)(.*)/)
        if (match) {
            const indent = line.length - line.trimStart().length
            return (
                <div key={index}>
                    {' '.repeat(indent)}
                    <span className="text-[#ff7b72] font-bold">{match[1]}</span>
                    <span className="text-[#c9d1d9]">{match[2]}</span>
                </div>
            )
        }
    }
    if (isResult) return <div key={index} className="text-[#a5d6ff] font-bold mt-1">{line}</div>
    if (isYesNo) return <div key={index} className="text-[#7ee787]">{line}</div>
    if (isSymbol) return <div key={index} className="text-[#79c0ff]">{line}</div>
    return <div key={index}>{line || '\u00A0'}</div>
}

/* ───────── Course Viewer Page ───────── */

export default function DSACourseViewer() {
    const [activeLesson, setActiveLesson] = useState(0)
    const [expandedChapters, setExpandedChapters] = useState<string[]>(["chap-1"])
    const lesson = lessons[activeLesson]

    const goNext = () => setActiveLesson(i => {
        const nextIdx = Math.min(i + 1, lessons.length - 1);
        // Automatically expand the chapter of the new lesson
        const nextChapterId = lessons[nextIdx]?.chapterTitle.toLowerCase().replace(/[\s\W]+/g, '_').substring(0, 15); 
        // We can just rely on ensuring the proper chapter is open by finding it from courseCurriculum
        let foundChapterId = "chap-1";
        courseCurriculum.forEach(part => {
             part.chapters.forEach(chap => {
                  if(chap.title === lessons[nextIdx]?.chapterTitle) foundChapterId = chap.id;
             })
        })
        if (!expandedChapters.includes(foundChapterId)) {
            setExpandedChapters(prev => [...prev, foundChapterId])
        }
        return nextIdx;
    })
    const goPrev = () => setActiveLesson(i => {
        const prevIdx = Math.max(i - 1, 0)
        let foundChapterId = "chap-1";
        courseCurriculum.forEach(part => {
             part.chapters.forEach(chap => {
                  if(chap.title === lessons[prevIdx]?.chapterTitle) foundChapterId = chap.id;
             })
        })
        if (!expandedChapters.includes(foundChapterId)) {
            setExpandedChapters(prev => [...prev, foundChapterId])
        }
        return prevIdx;
    })

    const setLessonById = (id: string) => {
        const index = lessons.findIndex((l: any) => l.id === id);
        if (index !== -1) {
            setActiveLesson(index);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const renderSidebarButton = (l: any) => {
        const isLocked = l.isLocked;
        const isCurrent = l.id === lesson.id;
        const flatLesson = lessons.find((flat: any) => flat.id === l.id);
        const lessonNum = flatLesson?.number;
        const isCompleted = activeLesson > (lessonNum ? lessonNum - 1 : 0);

        return (
            <button
                key={l.id}
                onClick={() => !isLocked && setLessonById(l.id)}
                disabled={isLocked}
                className={`group relative flex items-center gap-4 w-full px-5 py-3 text-left transition-all duration-200 border-l-[3px] ${
                    isCurrent ? "bg-accent/5 border-accent shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]" : 
                    isLocked ? "opacity-40 cursor-not-allowed border-transparent" : 
                    "hover:bg-white/[0.02] border-transparent hover:border-white/10"
                }`}
            >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold transition-all duration-300 ${
                    isCurrent ? "bg-accent text-[#050505] shadow-[0_0_12px_rgba(242,103,34,0.4)]" : 
                    (isCompleted && !isLocked) ? "bg-success/20 text-success" : 
                    "bg-secondary text-muted-foreground border border-white/5"
                }`}>
                   {isLocked ? <Lock className="h-2.5 w-2.5" /> : (isCompleted && !isCurrent ? <CheckCircle className="h-3 w-3" /> : lessonNum)}
                </div>

                <div className="flex flex-col justify-center overflow-hidden">
                    <span className={`text-[13px] font-medium tracking-tight transition-colors line-clamp-1 ${
                        isCurrent ? "text-foreground" : 
                        "text-muted-foreground group-hover:text-foreground/90"
                    }`}>
                        {l.title}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest mt-0.5">
                        {l.type === 'concept' ? 'Concept' : 'Practice'}
                    </span>
                </div>
            </button>
        )
    }
    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            {/* ════════ DEEP HERO BACKGROUND LAYERS ════════ */}
            <div className="pointer-events-none fixed inset-0 bg-grid-cyber opacity-30 z-0" aria-hidden="true" />
            <div className="noise-overlay pointer-events-none fixed inset-0 mix-blend-overlay z-0" aria-hidden="true" />
            
            {/* ════════ TOP NAVIGATION BAR ════════ */}
            <div className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
                <div className="mx-auto w-full px-4 lg:px-8 py-3 flex items-center justify-between">
                    <Link href="/programs/dsa" className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="font-mono text-[11px] font-bold uppercase tracking-widest hidden sm:inline">Back to Syllabus</span>
                        <span className="font-mono text-[11px] font-bold uppercase tracking-widest sm:hidden">Back</span>
                    </Link>

                    {/* Progress Desktop */}
                    <div className="hidden lg:flex flex-col gap-1.5 w-64 lg:w-80">
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold">
                            <span>Course Progress</span>
                            <span className="text-accent">{Math.round(((activeLesson + 1) / lessons.length) * 100)}%</span>
                        </div>
                        <div 
                            className="cyber-corner h-2 w-full bg-secondary hidden lg:block overflow-hidden border border-white/5 relative shadow-inner"
                            style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 98% 100%, 0 100%)" }}
                        >
                            <div 
                                className="h-full bg-accent transition-all duration-700 ease-out relative"
                                style={{ width: `${((activeLesson + 1) / lessons.length) * 100}%` }}
                            >
                                <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-r from-transparent to-white/40" />
                            </div>
                        </div>
                    </div>

                    {/* Progress Mobile */}
                    <div className="lg:hidden flex items-center gap-2">
                         <span className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold">
                            {Math.round(((activeLesson + 1) / lessons.length) * 100)}%
                         </span>
                    </div>
                </div>
            </div>

            {/* ════════ COURSE CONTENT SECTION ════════ */}
            <section className="relative flex-1 flex z-10">

                <div className="relative mx-auto w-full max-w-7xl px-4 lg:px-8 flex flex-col lg:flex-row gap-8 lg:gap-12 py-8 lg:py-12 flex-1">
                    
                    {/* ── Sidebar: Lesson List ── */}
                    <aside className="lg:w-80 shrink-0 border-b border-border/50 pb-8 lg:border-none lg:pb-0">
                        <div className="lg:sticky lg:top-[80px]">
                            
                            <nav className="flex flex-col gap-6 max-h-[50vh] lg:max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                                {courseCurriculum.map((part) => (
                                    <div key={part.id} className="mb-4">
                                        <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-4 pl-2">
                                            {part.title}
                                        </h3>
                                        <div className="flex flex-col gap-2">
                                            {part.chapters.map((chapter) => {
                                                const isExpanded = expandedChapters.includes(chapter.id);
                                                
                                                // Extract "Chapter X" and "Title" reliably, defaulting to original if format changes
                                                const splitTitle = chapter.title.split(' — ');
                                                const chapNum = splitTitle.length > 1 ? splitTitle[0] : "Module";
                                                const chapName = splitTitle.length > 1 ? splitTitle[1] : chapter.title;

                                                return (
                                                <div key={chapter.id} className="flex flex-col mb-2 border border-border/40 bg-[#0a0a0d] shadow-sm rounded-xl overflow-hidden transition-all duration-300">
                                                    <button 
                                                        onClick={() => {
                                                            setExpandedChapters(prev => 
                                                                prev.includes(chapter.id) ? prev.filter(id => id !== chapter.id) : [...prev, chapter.id]
                                                            )
                                                        }}
                                                        className={`flex items-center justify-between w-full text-left py-4 px-5 transition-colors group ${isExpanded ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"}`}
                                                    >
                                                        <div className="flex flex-col gap-1.5 pr-4">
                                                            <span className="font-mono text-[9px] text-accent font-bold uppercase tracking-[0.2em] opacity-90">{chapNum}</span>
                                                            <span className="text-[14px] font-bold text-foreground leading-snug group-hover:text-accent transition-colors">{chapName}</span>
                                                        </div>
                                                        <div className={`p-1.5 shrink-0 rounded-md transition-all duration-300 ${isExpanded ? "bg-accent/10 text-accent" : "bg-white/5 text-muted-foreground"}`}>
                                                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`} />
                                                        </div>
                                                    </button>
                                                    
                                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"}`}>
                                                        <div className="bg-black/40 pb-2">
                                                            {chapter.concepts.length > 0 && (
                                                                <div className="flex flex-col pt-2">
                                                                    {chapter.concepts.map(l => renderSidebarButton(l))}
                                                                </div>
                                                            )}

                                                            {chapter.problems.length > 0 && (
                                                                <div className="flex flex-col pt-2 mt-2 border-t border-white/5 relative">
                                                                    <div className="absolute top-0 left-5 w-4 h-[1px] bg-accent/30" />
                                                                    {chapter.problems.map(l => renderSidebarButton(l))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )})}
                                        </div>
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* ── Main Content ── */}
                    <div className="flex-1 min-w-0 pb-32 lg:pb-12 max-w-4xl xl:pl-8">
                        <div className="relative transition-all duration-500">
                            {/* Dynamic Glow Effect */}
                            <div 
                                className="absolute -top-40 -right-40 w-96 h-96 opacity-20 blur-[100px] pointer-events-none transition-colors duration-1000" 
                                style={{ background: lesson.color }} 
                            />

                            <div className="mb-12 relative z-10 animate-[fadeInUp_0.5s_ease-out]" key={lesson.id + '-header'}>
                                <div className="flex flex-col gap-6 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="flex h-12 w-12 lg:h-14 lg:w-14 shrink-0 items-center justify-center border transition-all rounded-xl shadow-lg"
                                            style={{
                                                borderColor: `${lesson.color}30`,
                                                background: `linear-gradient(135deg, ${lesson.color}15 0%, ${lesson.color}05 100%)`,
                                                boxShadow: `0 8px 32px ${lesson.color}20`
                                            }}
                                        >
                                            <lesson.icon className="h-6 w-6 lg:h-7 lg:w-7" style={{ color: lesson.color }} />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-bold block mb-1"
                                                style={{ color: lesson.color }}>
                                                {/* @ts-ignore */}
                                                {lesson.chapterTitle} <span className="text-muted-foreground/50 mx-2">/</span> {lesson.sectionTitle}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15] mb-6 drop-shadow-sm">
                                            <span className="cyber-glitch">{lesson.title}</span>
                                        </h2>
                                        {/* TL;DR Badge */}
                                        <div className="inline-flex items-start sm:items-center gap-3 px-5 py-3 bg-accent/10 border border-accent/20 rounded-lg">
                                            <Sparkles className="h-4 w-4 text-accent shrink-0 mt-0.5 sm:mt-0" />
                                            <span className="text-sm font-medium text-accent tracking-wide leading-snug">
                                                {lesson.tldr}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lesson Body */}
                            <div className="relative z-10 animate-[fadeInUp_0.6s_ease-out_0.1s_both]" key={lesson.id + '-body'}>
                                {/* Description via Rich Text */}
                                <div className="mb-12">
                                    <RichText text={lesson.description} />
                                </div>

                                {/* Code Block */}
                                {lesson.code && (
                                <div className="overflow-hidden border border-white/10 bg-[#0d1117] shadow-xl rounded-2xl my-10 relative">
                                    {/* Terminal header */}
                                    <div className="flex items-center justify-between border-b border-white/10 bg-[#161b22] px-5 py-3">
                                        <div className="flex gap-2">
                                            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                                            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                                            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                                        </div>
                                        <span className="font-mono text-[11px] sm:text-xs uppercase text-muted-foreground/60 tracking-widest flex items-center gap-2 font-semibold">
                                            <Code2 className="h-4 w-4" />
                                            pseudocode.txt
                                        </span>
                                        <div className="w-12" />
                                    </div>
                                    {/* Code content */}
                                    <div className="p-6 lg:p-8 overflow-x-auto min-h-[200px]">
                                        <pre className="font-mono text-[13px] sm:text-[14px] leading-relaxed text-[#c9d1d9]">
                                            {lesson.code.split('\n').map((line, i) => (
                                                <PseudocodeLine key={i} line={line} index={i} />
                                            ))}
                                        </pre>
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation buttons */}
                        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 w-full">
                            <button
                                onClick={() => {
                                    goPrev()
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                                disabled={activeLesson === 0}
                                className="group flex items-center justify-center gap-3 px-6 py-4 border border-white/5 bg-background/50 font-mono text-[13px] font-bold uppercase tracking-widest text-muted-foreground transition-all hover:bg-white/[0.02] hover:text-foreground disabled:opacity-0 w-full sm:w-auto"
                                style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 30%)" }}
                            >
                                <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                                Previous
                            </button>

                            {activeLesson < lessons.length - 1 ? (
                                <button
                                    onClick={() => {
                                        goNext()
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
                                    }}
                                    className="group relative flex items-center justify-center gap-3 bg-accent px-10 py-5 font-mono text-sm font-black uppercase tracking-widest text-[#050505] transition-all hover:scale-[1.02] w-full sm:w-auto"
                                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}
                                >
                                    Next Lesson
                                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </button>
                            ) : (
                                <div 
                                    className="flex flex-1 sm:flex-none justify-center items-center gap-3 px-10 py-5 bg-success/20 w-full sm:w-auto border border-success/30"
                                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%)" }}
                                >
                                    <CheckCircle className="h-5 w-5 text-success" />
                                    <span className="font-mono text-[13px] font-bold text-success uppercase tracking-widest text-center">
                                        Course Complete!
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
