"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyPlus, ArrowRight, X, Play, RefreshCw, Cpu, FastForward, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

type SlotStatus = "idle" | "shifting" | "target" | "inserted" | "empty";

interface MemoryBlock {
  id: string;
  value: string;
}

export default function ArrayShifter() {
  // We simulate a fixed-size memory array of 10 slots.
  const MAX_SLOTS = 8;
  const [array, setArray] = useState<MemoryBlock[]>([
    { id: "blk-1", value: "🍎" },
    { id: "blk-2", value: "🥑" },
    { id: "blk-3", value: "🍉" },
    { id: "blk-4", value: "🍇" },
    { id: "blk-5", value: "🍍" },
  ]);
  
  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [operationCount, setOperationCount] = useState(0);
  const [activeShiftIndex, setActiveShiftIndex] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const pushLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const handleInsertFront = async () => {
    if (isSimulating) return;
    if (array.length >= MAX_SLOTS) {
      pushLog("ERROR: Buffer Overflow. Memory capacity reached.");
      return;
    }

    setIsSimulating(true);
    setOperationCount(0);
    pushLog("INIT: Executing O(n) insertion at index 0...");

    const newBlock: MemoryBlock = { id: `blk-${Date.now()}`, value: "⭐" };
    let currentArray = [...array];
    
    // We physically shift each element from Right to Left to demonstrate CPU work
    for (let i = currentArray.length - 1; i >= 0; i--) {
      setActiveShiftIndex(i);
      setOperationCount(prev => prev + 1);
      pushLog(`OP: Moving block [${currentArray[i].value}] index ${i} -> ${i + 1}`);
      
      // Await next frame simulation delay
      await new Promise(r => setTimeout(r, 600)); 
    }

    // Finally insert at 0
    setActiveShiftIndex(null);
    setOperationCount(prev => prev + 1);
    pushLog(`OP: Inserting [⭐] at index 0`);
    
    setArray([newBlock, ...currentArray]);
    pushLog(`SUCCESS: Insertion complete. Total Operations: ${currentArray.length + 1}`);
    setIsSimulating(false);
  };

  const handleAppendEnd = async () => {
    if (isSimulating) return;
    if (array.length >= MAX_SLOTS) {
      pushLog("ERROR: Buffer Overflow. Memory capacity reached.");
      return;
    }

    setIsSimulating(true);
    setOperationCount(0);
    pushLog("INIT: Executing O(1) appending at end...");

    const newBlock: MemoryBlock = { id: `blk-${Date.now()}`, value: "💎" };
    
    await new Promise(r => setTimeout(r, 600)); 
    setOperationCount(1);
    pushLog(`OP: Inserting [💎] at index ${array.length}`);
    
    setArray([...array, newBlock]);
    pushLog(`SUCCESS: Append complete. Total Operations: 1`);
    setIsSimulating(false);
  };

  const handleReset = () => {
    setArray([
      { id: "blk-1", value: "🍎" },
      { id: "blk-2", value: "🥑" },
      { id: "blk-3", value: "🍉" },
      { id: "blk-4", value: "🍇" },
      { id: "blk-5", value: "🍍" },
    ]);
    setOperationCount(0);
    setActiveShiftIndex(null);
    setLogs(["System reset. Memory restored to initial state."]);
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-[#050505] bg-grid-cyber bg-[size:40px_40px] text-zinc-100 font-sans overflow-hidden">
      
      <div className="p-4 border-b border-white/5 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-between shrink-0">
         <div className="flex items-center gap-3">
            <Cpu className="text-yellow-500" size={20} />
            <h2 className="font-mono text-sm uppercase tracking-widest font-black text-zinc-100 cyber-glitch">The Array Shifter</h2>
         </div>
         <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              Operations: <span className="text-yellow-500 font-bold text-lg">{operationCount}</span>
            </span>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-px bg-white/5 overflow-hidden">
        
        {/* PANEL 1: Simulation Visualizer (70%) */}
        <div className="lg:col-span-7 bg-[#09090b]/90 flex flex-col relative cyber-corner">
          
          <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center bg-black/40">
             <button 
               onClick={handleInsertFront}
               disabled={isSimulating || array.length >= MAX_SLOTS}
               className="flexItems-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 transition-all uppercase font-mono text-xs font-bold tracking-widest cyber-corner"
             >
               <SkipForward size={16} />
               Insert Front O(n)
             </button>
             <button 
               onClick={handleAppendEnd}
               disabled={isSimulating || array.length >= MAX_SLOTS}
               className="flex items-center gap-2 px-6 py-3 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e] hover:text-black disabled:opacity-50 transition-all uppercase font-mono text-xs font-bold tracking-widest cyber-corner"
             >
               <FastForward size={16} />
               Append End O(1)
             </button>
             <div className="flex-1" />
             <button 
               onClick={handleReset}
               disabled={isSimulating}
               className="p-3 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition-all cyber-corner"
             >
               <RefreshCw size={16} />
             </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* The Memory Array Track */}
            <div className="relative w-full max-w-4xl h-32 border-b-2 border-white/10 flex items-end pb-4 gap-2">
                
                {/* Fixed Background Slots mapped out */}
                {Array.from({ length: MAX_SLOTS }).map((_, i) => (
                    <div 
                      key={i} 
                      className="flex-1 h-24 border-2 border-dashed border-zinc-800/50 rounded-lg flex items-center justify-center relative bg-black/20"
                    >
                        <span className="absolute -bottom-8 font-mono text-zinc-600 text-[10px] uppercase font-bold tracking-widest">Idx {i}</span>
                        {/* If simulating and this slot is the target of the current shift, highlight it */}
                        {isSimulating && activeShiftIndex !== null && i === activeShiftIndex + 1 && (
                            <div className="absolute inset-0 border-2 border-yellow-500/50 bg-yellow-500/10 animate-pulse rounded-lg" />
                        )}
                    </div>
                ))}

                {/* The Physical Blocks (Absolute positioning simulated via layout layoutId) */}
                <div className="absolute inset-0 flex items-end pb-4 gap-2 px-0">
                    <AnimatePresence>
                        {array.map((block, index) => {
                            const isShifting = index === activeShiftIndex;
                            const isNewlyInserted = !isSimulating && index === 0 && operationCount > 1; // Slight hack to highlight the front inserted block
                            
                            let blockStyle = "bg-[#111113] border-zinc-700";
                            let glow = "";
                            
                            if (isShifting) {
                                blockStyle = "bg-yellow-500/20 border-yellow-500 text-yellow-500";
                                glow = "shadow-[0_0_20px_rgba(234,179,8,0.3)]";
                            } else if (isNewlyInserted) {
                                blockStyle = "bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e] border-2";
                                glow = "shadow-[0_0_20px_rgba(34,197,94,0.3)]";
                            } else if (index === array.length - 1 && operationCount === 1) { // Appended End
                                blockStyle = "bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e] border-2";
                                glow = "shadow-[0_0_20px_rgba(34,197,94,0.3)]";
                            }

                            // Calculate fake X offset based on shift state for the active block
                            // This gives the visual of the block sliding right DURING the artificial delay before React commits the real array change
                            const shiftXOffset = isShifting ? "100%" : 0; 
                            
                            return (
                                <motion.div
                                    key={block.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.5, y: -50 }}
                                    animate={{ 
                                        opacity: 1, 
                                        scale: 1, 
                                        y: 0,
                                        x: shiftXOffset, // apply simulated physical push
                                    }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: isShifting ? 100 : 300, 
                                        damping: 20 
                                    }}
                                    className={cn(
                                        "flex-1 h-24 border rounded-lg flex items-center justify-center text-4xl shadow-lg relative z-10 transition-colors duration-300 backdrop-blur-md",
                                        blockStyle, glow
                                    )}
                                    style={{ 
                                        marginRight: isShifting ? "0.5rem" : 0 // Ensure gap is maintained visually during simulated shift
                                    }}
                                >
                                    {block.value}
                                    {isShifting && (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="absolute -right-8 top-1/2 -translate-y-1/2 z-20 text-yellow-500"
                                        >
                                            <ArrowRight />
                                        </motion.div>
                                    )}
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

            </div>

            {/* Explanation Overlay */}
            <div className="absolute bottom-8 left-8 right-8 bg-black/60 backdrop-blur-xl border border-white/10 p-6 cyber-corner">
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#22c55e] mb-2 font-black">Performance Analysis</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                   When inserting at <span className="text-white font-mono">Index 0</span> (the front), the computer must individually physically shift 
                   every single existing element one slot to the right to make room. This takes <span className="text-red-400 font-mono font-bold font-italic">O(n) Linear Time</span>.
                   <br/><br/>
                   When appending to the <span className="text-white font-mono">End</span>, the computer simply drops the item into the next available empty continuous address.
                   This takes <span className="text-green-400 font-mono font-bold font-italic">O(1) Constant Time</span>.
                </p>
            </div>
          </div>
        </div>

        {/* PANEL 2: Operations Log (30%) */}
        <div className="lg:col-span-3 bg-[#09090b]/90 backdrop-blur flex flex-col relative">
           <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-green-500/50" />
              <span className="font-mono text-[10px] uppercase font-black tracking-widest text-zinc-500 ml-4">Terminal.log</span>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-zinc-500 custom-scrollbar space-y-2 relative">
                <style dangerouslySetInnerHTML={{__html: `
                  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                  .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
                  .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #52525b; }
                `}} />
                
                {logs.map((log, i) => {
                    const isFocus = i === logs.length - 1;
                    let color = isFocus ? "text-zinc-200" : "text-zinc-600";
                    if (log.includes("OP:")) color = "text-yellow-500/80";
                    if (log.includes("SUCCESS:")) color = "text-[#22c55e]";
                    if (log.includes("ERROR:")) color = "text-red-500";
                    
                    return (
                        <div key={i} className={cn("leading-relaxed break-words", color)}>
                            <span className="opacity-30 mr-2">{'>'}</span> {log}
                        </div>
                    );
                })}
                <div ref={terminalEndRef} />
             </div>
        </div>

      </div>
    </div>
  );
}
