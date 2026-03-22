"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Target, Cpu, Zap, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const ARRAY_SIZE = 31;
const DEFAULT_ARRAY = Array.from({ length: ARRAY_SIZE }, (_, i) => (i + 1) * 3); // [3, 6, 9, ... 93]

interface RaceState {
  status: "idle" | "racing" | "finished";
  targetScore: number;
}

interface LinearState {
  activeIndex: number;
  ops: number;
  found: boolean;
}

interface BinaryState {
  left: number;
  right: number;
  mid: number;
  ops: number;
  found: boolean;
}

export default function SearchRace() {
  const [targetVal, setTargetVal] = useState<number>(DEFAULT_ARRAY[ARRAY_SIZE - 2]); // default to 90 (near end)
  const [race, setRace] = useState<RaceState>({ status: "idle", targetScore: 0 });
  
  const [linear, setLinear] = useState<LinearState>({ activeIndex: -1, ops: 0, found: false });
  const [binary, setBinary] = useState<BinaryState>({ left: 0, right: ARRAY_SIZE - 1, mid: -1, ops: 0, found: false });
  
  const [logs, setLogs] = useState<string[]>(["SYSTEM: Search modules initialized."]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const pushLog = (msg: string) => setLogs(prev => [...prev, msg]);

  // The Race Engine
  const executeRace = async () => {
    if (race.status === "racing") return;
    
    setRace({ status: "racing", targetScore: 0 });
    setLinear({ activeIndex: -1, ops: 0, found: false });
    setBinary({ left: 0, right: ARRAY_SIZE - 1, mid: -1, ops: 0, found: false });
    setLogs(["RACE: Commencing search protocol...", `TARGET: ${targetVal}`]);

    let linOps = 0;
    let linIdx = 0;
    let linFound = false;

    let binL = 0;
    let binR = ARRAY_SIZE - 1;
    let binM = -1;
    let binOps = 0;
    let binFound = false;

    // Simulation Loop
    while (!linFound || !binFound) {
      let didWork = false;

      // LINEAR STEP
      if (!linFound && linIdx < ARRAY_SIZE) {
        setLinear(prev => ({ ...prev, activeIndex: linIdx, ops: linOps + 1 }));
        linOps++;
        
        if (DEFAULT_ARRAY[linIdx] === targetVal) {
          linFound = true;
          setLinear(prev => ({ ...prev, found: true }));
          pushLog(`LINEAR: Target found at index ${linIdx} in ${linOps} ops.`);
        } else if (DEFAULT_ARRAY[linIdx] > targetVal) {
           // We can optimize linear search slightly since it's sorted, but let's just let it run or stop if overshoot
           linFound = true; // "Item not in array"
           pushLog(`LINEAR: Target not found (overshot) in ${linOps} ops.`);
        } else {
          linIdx++;
        }
        didWork = true;
      }

      // BINARY STEP (Binary is much faster, so it will finish in fewer loop ticks)
      if (!binFound && binL <= binR) {
        binM = Math.floor((binL + binR) / 2);
        setBinary(prev => ({ ...prev, left: binL, right: binR, mid: binM, ops: binOps + 1 }));
        binOps++;
        
        if (DEFAULT_ARRAY[binM] === targetVal) {
          binFound = true;
          setBinary(prev => ({ ...prev, found: true }));
          pushLog(`BINARY: Target found at index ${binM} in ${binOps} ops.`);
        } else if (DEFAULT_ARRAY[binM] < targetVal) {
          binL = binM + 1;
        } else {
          binR = binM - 1;
        }
        didWork = true;
      } else if (!binFound && binL > binR) {
         binFound = true;
         pushLog(`BINARY: Target not found in ${binOps} ops.`);
      }

      if (!didWork && linIdx >= ARRAY_SIZE) {
         linFound = true;
      }

      // Tick Delay (Wait for next frame)
      await new Promise(r => setTimeout(r, 200));
    }

    setRace({ status: "finished", targetScore: 0 });
    pushLog("RACE: Complete. Binary search vastly mathematically superior.");
  };

  const handleReset = () => {
    setRace({ status: "idle", targetScore: 0 });
    setLinear({ activeIndex: -1, ops: 0, found: false });
    setBinary({ left: 0, right: ARRAY_SIZE - 1, mid: -1, ops: 0, found: false });
    setLogs(["SYSTEM: Diagnostics reset."]);
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-[#050505] bg-grid-cyber bg-[size:40px_40px] text-zinc-100 font-sans overflow-hidden">
      
      {/* Header HUD */}
      <div className="p-4 border-b border-white/5 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-between shrink-0">
         <div className="flex items-center gap-3">
            <Search className="text-[#06b6d4]" size={20} />
            <h2 className="font-mono text-sm uppercase tracking-widest font-black text-zinc-100 cyber-glitch">The Great Search Race</h2>
         </div>
         <div className="flex items-center gap-3 hidden sm:flex">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Algorithm Engine Online</span>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-px bg-white/5 overflow-hidden">
        
        {/* MAIN VISUALIZER (75%) */}
        <div className="lg:col-span-3 bg-[#09090b]/90 flex flex-col relative cyber-corner overflow-y-auto custom-scrollbar">
          
          {/* Controls Bar */}
          <div className="p-6 border-b border-white/5 flex flex-wrap gap-6 items-center bg-black/40 shrink-0">
             <div className="flex items-center gap-4">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Target Value:</label>
                <div className="relative">
                    <Target className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    <select 
                        value={targetVal}
                        onChange={(e) => setTargetVal(Number(e.target.value))}
                        disabled={race.status === "racing"}
                        className="pl-8 pr-4 py-2 bg-[#111113] border border-zinc-700 font-mono text-sm text-[#06b6d4] focus:outline-none focus:border-[#06b6d4] cyber-corner appearance-none cursor-pointer"
                    >
                        {DEFAULT_ARRAY.map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                        {/* Option not in array to demonstrate miss */}
                        <option value={88}>88 (Not Present)</option>
                    </select>
                </div>
             </div>

             <div className="flex gap-2">
                 <button 
                   onClick={executeRace}
                   disabled={race.status === "racing"}
                   className="flex items-center gap-2 px-6 py-2 bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#06b6d4] hover:bg-[#06b6d4] hover:text-black disabled:opacity-50 transition-all uppercase font-mono text-xs font-bold tracking-widest cyber-corner"
                 >
                   <Play size={16} />
                   Engage Race
                 </button>
                 <button 
                   onClick={handleReset}
                   disabled={race.status === "racing"}
                   className="p-2 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition-all cyber-corner"
                 >
                   <RotateCcw size={16} />
                 </button>
             </div>
          </div>

          <div className="flex-1 p-8 space-y-12">
             
             {/* TRACK 1: LINEAR SEARCH */}
             <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[10px] font-mono font-bold uppercase tracking-widest border border-red-500/30">O(n)</span>
                        <h3 className="text-sm font-black uppercase tracking-tight text-white/80">Linear Search</h3>
                    </div>
                    <div className="font-mono text-xs text-zinc-500 uppercase">
                        Operations: <span className="text-red-400 font-bold ml-1">{linear.ops}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1">
                    {DEFAULT_ARRAY.map((val, idx) => {
                        const isCurrent = linear.activeIndex === idx;
                        const isFound = linear.found && isCurrent && val === targetVal;
                        const isPassed = linear.activeIndex > idx;

                        let style = "bg-zinc-900 border-zinc-800 text-zinc-500";
                        if (isFound) style = "bg-green-500/20 border-green-500 text-green-400 scale-110 z-10 shadow-[0_0_15px_#22c55e]";
                        else if (isCurrent) style = "bg-red-500/20 border-red-500 text-red-400 scale-110 z-10 shadow-[0_0_15px_#ef4444]";
                        else if (isPassed) style = "bg-black border-zinc-900 text-zinc-700 opacity-50";

                        return (
                           <motion.div 
                              key={`lin-${idx}`}
                              layout
                              transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              className={cn(
                                "w-8 h-8 sm:w-10 sm:h-10 border flex items-center justify-center font-mono text-[10px] sm:text-xs transition-all duration-200 cyber-corner",
                                style
                              )}
                           >
                               {val}
                           </motion.div>
                        )
                    })}
                </div>
             </div>

             {/* TRACK 2: BINARY SEARCH */}
             <div className="space-y-4 pt-8">
                <div className="flex justify-between items-end border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#06b6d4]/20 text-[#06b6d4] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#06b6d4]/30">O(log n)</span>
                        <h3 className="text-sm font-black uppercase tracking-tight text-white/80">Binary Search</h3>
                    </div>
                    <div className="font-mono text-xs text-zinc-500 uppercase">
                        Operations: <span className="text-[#06b6d4] font-bold ml-1">{binary.ops}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1">
                    {DEFAULT_ARRAY.map((val, idx) => {
                        // Binary visual logic
                        const inRange = idx >= binary.left && idx <= binary.right;
                        const isMid = binary.mid === idx;
                        const isFound = binary.found && isMid && val === targetVal;
                        
                        let style = "bg-zinc-900 border-zinc-800 text-zinc-500";
                        
                        if (race.status !== "idle" && !inRange && !binary.found) {
                            style = "bg-black border-zinc-900 text-zinc-800 opacity-20 scale-95"; // discarded
                        } else if (isFound) {
                            style = "bg-green-500/20 border-green-500 text-green-400 scale-110 z-10 shadow-[0_0_15px_#22c55e]";
                        } else if (isMid) {
                            style = "bg-[#06b6d4]/20 border-[#06b6d4] text-[#06b6d4] scale-110 z-10 shadow-[0_0_15px_#06b6d4]";
                        } else if (inRange && race.status !== "idle") {
                            style = "bg-zinc-800 border-zinc-700 text-zinc-300"; // active search area
                            if (idx === binary.left) style += " border-l-2 border-l-[#06b6d4]";
                            if (idx === binary.right) style += " border-r-2 border-r-[#06b6d4]";
                        }

                        return (
                           <motion.div 
                              key={`bin-${idx}`}
                              layout
                              transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              className={cn(
                                "w-8 h-8 sm:w-10 sm:h-10 border flex items-center justify-center font-mono text-[10px] sm:text-xs transition-all duration-300 cyber-corner relative",
                                style
                              )}
                           >
                               {val}
                               {isMid && !isFound && (
                                   <div className="absolute -top-4 text-[8px] text-[#06b6d4] font-black">MID</div>
                               )}
                               {idx === binary.left && inRange && !isFound && !isMid && (
                                   <div className="absolute -bottom-4 text-[8px] text-zinc-500 font-black">L</div>
                               )}
                               {idx === binary.right && inRange && !isFound && !isMid && (
                                   <div className="absolute -bottom-4 text-[8px] text-zinc-500 font-black">R</div>
                               )}
                           </motion.div>
                        )
                    })}
                </div>
             </div>

          </div>
        </div>

        {/* TERMINAL LOGS (25%) */}
        <div className="lg:col-span-1 bg-[#09090b]/90 backdrop-blur flex flex-col relative border-l border-zinc-800">
           <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-3">
              <Zap className="text-yellow-500" size={14} />
              <span className="font-mono text-[10px] uppercase font-black tracking-widest text-zinc-500">Syslog</span>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] text-zinc-500 custom-scrollbar space-y-2">
                {logs.map((log, i) => {
                    let color = "text-zinc-500";
                    if (log.includes("LINEAR:")) color = "text-red-400";
                    if (log.includes("BINARY:")) color = "text-[#06b6d4]";
                    if (log.includes("found")) color = "text-green-400";
                    if (log.includes("superior")) color = "text-accent font-bold";
                    
                    return (
                        <div key={i} className={cn("leading-relaxed break-words", color)}>
                            <span className="opacity-30 mr-2">{'>'}</span> {log}
                        </div>
                    );
                })}
                <div ref={terminalRef} />
             </div>
        </div>

      </div>
    </div>
  );
}
