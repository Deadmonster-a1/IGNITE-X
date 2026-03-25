"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Activity } from "lucide-react"
import { useState, useEffect } from "react"

interface DataVisualizerProps {
    type: string // "array" | "tree" | "graph" | "linked-list"
    data: any[]
    highlightIndices?: number[]
    pointerIndices?: { [key: string]: number }
    compareIndices?: [number, number]
}

export default function DataVisualizer({ 
    type, 
    data, 
    highlightIndices = [], 
    pointerIndices = {},
    compareIndices 
}: DataVisualizerProps) {

    const renderArray = () => {
        return (
            <div className="flex flex-wrap items-center justify-center gap-4 w-full">
                {data.map((val, idx) => {
                    const isHighlighted = highlightIndices.includes(idx)
                    const isComparing = compareIndices?.includes(idx)
                    const pointersAtThisIdx = Object.entries(pointerIndices)
                        .filter(([_, pos]) => pos === idx)
                        .map(([name]) => name)

                    return (
                        <div key={idx} className="relative flex flex-col items-center">
                            {/* Pointers */}
                            <div className="absolute -top-12 flex flex-col items-center gap-1 h-10 justify-end">
                                <AnimatePresence>
                                    {pointersAtThisIdx.map(name => (
                                        <motion.div 
                                            key={name}
                                            initial={{ y: -10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -10, opacity: 0 }}
                                            className="px-2 py-0.5 rounded bg-accent/20 border border-accent/40 text-[9px] font-mono font-bold text-accent uppercase tracking-tighter"
                                        >
                                            {name}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Cell */}
                            <motion.div 
                                layout
                                className={`
                                    w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center
                                    transition-all duration-300 font-mono text-xl sm:text-2xl font-black
                                    ${isComparing ? "border-blue-500 bg-blue-500/10 scale-110 shadow-[0_0_20px_rgba(59,130,246,0.3)] z-10" : 
                                      isHighlighted ? "border-accent bg-accent/20 shadow-[0_0_20px_rgba(0,255,204,0.3)] z-10" : 
                                      "border-white/10 bg-white/5"}
                                `}
                            >
                                <span className={isHighlighted || isComparing ? "text-white" : "text-white/40"}>
                                    {val}
                                </span>
                            </motion.div>

                            {/* Index Label */}
                            <span className="mt-2 font-mono text-[10px] text-white/20 font-bold">
                                [{idx}]
                            </span>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col">
            {/* Visualizer Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <Activity size={12} className="text-accent" />
                    <span className="font-mono text-[10px] uppercase font-black text-white/30 tracking-widest">
                        {type.toUpperCase()} VISUALIZER
                    </span>
                </div>
                
                {/* Control Bar */}
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                        <RotateCcw size={14} />
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent hover:bg-accent/30 transition-all">
                        <Play size={14} fill="currentColor" />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Visualizer Body */}
            <div className="flex-1 overflow-auto p-12 flex items-center justify-center">
                <AnimatePresence mode="popLayout">
                    {type === "array" && renderArray()}
                    {type !== "array" && (
                        <div className="text-white/20 font-mono text-xs uppercase tracking-[0.2em]">
                            Sequence Initialized... Rerouting visuals.
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
