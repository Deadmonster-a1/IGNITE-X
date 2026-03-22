"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, ChevronRight, ChevronLeft, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

type FramePhase = "calling" | "waiting" | "resolving";

interface StackFrame {
  id: string; // e.g. "fact-4"
  n: number;
  phase: FramePhase;
  returnValue?: number;
}

interface TraceStep {
  activeLine: number | null;
  stack: StackFrame[];
  logMsg: string;
}

// Generates the trace snapshots linearly for fact(n)
function buildTrace(nStart: number): TraceStep[] {
  const trace: TraceStep[] = [];
  let currentStack: StackFrame[] = [];

  function logTrace(line: number | null, msg: string) {
    trace.push({
      activeLine: line,
      stack: JSON.parse(JSON.stringify(currentStack)),
      logMsg: msg,
    });
  }

  // Initial state push
  logTrace(null, `> SYSTEM READY. Awaiting execution of fact(${nStart})...`);

  function fact(n: number): number {
    const frameId = `fact-${n}`;
    currentStack.push({ id: frameId, n, phase: "calling" });
    logTrace(1, `> PUSH: fact(${n}) allocated on stack.`);

    logTrace(2, `> CHECK: is ${n} == 1 ?`);
    if (n === 1) {
      logTrace(3, `> BASE CASE MET: fact(1) returns 1`);
      // Update top frame to resolving
      currentStack[currentStack.length - 1].phase = "resolving";
      currentStack[currentStack.length - 1].returnValue = 1;
      logTrace(3, `> RESOLVED: fact(1) returning 1. Commencing POP.`);

      currentStack.pop();
      return 1;
    }

    logTrace(4, `> RECURSE: fact(${n}) requires fact(${n - 1}). Halting execution.`);
    currentStack[currentStack.length - 1].phase = "waiting";
    logTrace(4, `> WAITING: fact(${n}) paused on stack.`);

    const childVal = fact(n - 1);

    const returnVal = n * childVal;
    currentStack.push({ id: frameId, n, phase: "resolving", returnValue: returnVal }); // temporarily push back on stack for visual return phase
    logTrace(4, `> RESUMED: fact(${n}) receives ${childVal}`);
    logTrace(4, `> RESOLVED: fact(${n}) computes ${n} * ${childVal} = ${returnVal}`);

    currentStack.pop();
    logTrace(null, `> POP: removing fact(${n}) from stack.`);
    return returnVal;
  }

  fact(nStart);
  logTrace(null, `> EXECUTION COMPLETE. Call stack empty.`);
  return trace;
}

const PYTHON_CODE = `def fact(n):
    if n == 1:
        return 1
    return n * fact(n - 1)`;

export default function CallStackDive() {
  const [nInput, setNInput] = useState<number>(4);
  const [trace, setTrace] = useState<TraceStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [mounted, setMounted] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Generate fresh trace when nInput changes
    setTrace(buildTrace(nInput));
    setCurrentStep(0);
  }, [nInput]);

  useEffect(() => {
    // Auto scroll bottom when new logs appear in terminal
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentStep]);

  const activeState = trace[currentStep] || { activeLine: null, stack: [], logMsg: "" };
  const historyLogs = trace.slice(0, currentStep + 1);
  const reversedStack = [...activeState.stack].reverse();

  const handleNext = () => {
    if (currentStep < trace.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 w-full bg-[#050505] bg-grid-cyber bg-[size:40px_40px] text-zinc-100 font-sans overflow-hidden flex flex-col">
      <div className="p-4 border-b border-white/5 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-between shrink-0">
         <div className="flex items-center gap-3">
            <Terminal className="text-[#f26722]" size={20} />
            <h2 className="font-mono text-sm uppercase tracking-widest font-black text-zinc-100 cyber-glitch">Call Stack Dive</h2>
         </div>
         <div className="flexitems-center gap-3">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Memory Link Active</span>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-px bg-white/5 overflow-hidden">
        
        {/* PANEL 1: Code Viewer (30%) */}
        <div className="lg:col-span-3 bg-[#09090b]/90 backdrop-blur p-6 flex flex-col relative cyber-corner">
          <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-6">Execution Code</h3>
          <div className="bg-[#111113] border border-zinc-800 rounded-md p-4 font-mono text-sm overflow-x-auto relative shadow-inner">
            {PYTHON_CODE.split("\n").map((line, idx) => {
              const lineNum = idx + 1;
              const isActive = activeState.activeLine === lineNum;
              return (
                <div 
                  key={lineNum} 
                  className={cn(
                    "flex items-center px-2 py-1 transition-colors duration-200 border-l-2",
                    isActive ? "bg-[#f26722]/10 border-[#f26722] text-zinc-100" : "border-transparent text-zinc-400"
                  )}
                >
                  <span className="w-6 shrink-0 text-zinc-700 text-xs select-none">{lineNum}</span>
                  <span className={cn("whitespace-pre", isActive && "font-semibold")}>{line}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-line-indicator"
                      className="absolute right-2 text-[#f26722]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <ChevronLeft size={14} />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL 2: Vertical Call Stack (40%) */}
        <div className="lg:col-span-4 bg-[#09090b]/80 backdrop-blur flex flex-col border-r border-zinc-800 relative z-10 clip-chamfer min-h-[500px]">
          <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest p-6 pb-2 border-b border-zinc-800/50 bg-[#050505]">
            Call Stack Memory
          </h3>
          <div className="flex-1 p-6 flex flex-col gap-3 justify-end relative overflow-y-auto custom-scrollbar">
            {reversedStack.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
                    [ Stack Empty ]
                </div>
            )}
            <AnimatePresence mode="popLayout">
              {reversedStack.map((frame, index) => {
                // Determine frame style based on phase and stack position
                const isTop = index === 0;
                let colorClass = "border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.1)]"; // Info Blue by default
                let bgClass = "bg-[#3b82f6]/10";
                let textAccent = "text-[#3b82f6]";

                if (frame.phase === "resolving") {
                    colorClass = "border-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.3)]"; // Success Green
                    bgClass = "bg-[#22c55e]/15";
                    textAccent = "text-[#22c55e]";
                } else if (isTop) {
                    colorClass = "border-[#f26722] shadow-[0_0_20px_rgba(242,103,34,0.3)]"; // Fiery Orange
                    bgClass = "bg-[#f26722]/15 animate-pulse-slow"; // Slow pulse for top active frame
                    textAccent = "text-[#f26722]";
                }

                return (
                  <motion.div
                    key={`${frame.id}-${frame.phase}`} // Phase is uniquely keyed to re-trigger resolve animations
                    layout
                    initial={{ opacity: 0, y: -40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                      "flex flex-col p-4 border rounded-none cyber-corner", bgClass, colorClass
                    )}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <span className={cn("font-mono font-bold uppercase tracking-widest text-xs", textAccent)}>
                            fact({frame.n})
                        </span>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 bg-black/40 px-2 py-0.5 border border-white/5">
                            {frame.phase}
                        </span>
                     </div>
                     
                     <div className="font-mono text-xs text-zinc-300">
                        {frame.phase === "calling" && `Allocating context...`}
                        {frame.phase === "waiting" && `Awaiting fact(${frame.n - 1})`}
                        {frame.phase === "resolving" && (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-zinc-400">Return:</span>
                                <span className="text-[#22c55e] font-bold text-lg">{frame.returnValue}</span>
                            </div>
                        )}
                     </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* PANEL 3: Control Deck & Terminal (30%) */}
        <div className="lg:col-span-3 bg-[#09090b]/90 backdrop-blur flex flex-col cyber-border">
          {/* Controls */}
          <div className="p-6 border-b border-zinc-800 bg-[#050505]">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4">Command Link</h3>
            
            <div className="flex items-center gap-4 mb-6">
                <label className="text-xs font-mono text-zinc-400">n = </label>
                <input 
                    type="number" 
                    min={1} 
                    max={5} 
                    value={nInput}
                    onChange={(e) => {
                        const v = parseInt(e.target.value);
                        if(v >= 1 && v <= 5) setNInput(v);
                    }}
                    className="w-16 bg-[#111113] border border-zinc-700 p-2 font-mono text-center text-[#f26722] focus:outline-none focus:border-[#f26722] cyber-corner"
                />
            </div>

            <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="flex items-center justify-center p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={handleNext}
                  disabled={currentStep === trace.length - 1}
                  className="flex flex-col items-center justify-center p-3 sm:py-2 bg-[#f26722]/10 border border-[#f26722]/30 text-[#f26722] hover:bg-[#f26722] hover:text-black hover:shadow-[0_0_15px_#f26722] disabled:opacity-50 disabled:hover:bg-[#f26722]/10 disabled:hover:text-[#f26722] transition-all cyber-corner"
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest font-black hidden sm:block">Step FW</span>
                  <ChevronRight size={16} className="sm:hidden" />
                </button>
                <button 
                  onClick={handleReset}
                  className="flex items-center justify-center p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 transition-colors"
                >
                   <RotateCcw size={14} />
                </button>
            </div>
          </div>

          {/* Terminal */}
          <div className="flex-1 p-6 flex flex-col relative h-[300px] lg:h-auto">
             <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-[#f26722] rounded-full animate-pulse" />
               Syslog Output
             </h3>
             <div className="bg-[#050505] border border-zinc-800 flex-1 overflow-y-auto p-4 font-mono text-[11px] text-zinc-500 custom-scrollbar space-y-1 cyber-border shadow-inner relative">
                <style dangerouslySetInnerHTML={{__html: `
                  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                  .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
                  .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #52525b; }
                `}} />
                
                {historyLogs.map((log, i) => {
                    const isLatest = i === historyLogs.length - 1;
                    const isHighlight = log.logMsg.includes("BASE CASE") || log.logMsg.includes("RESOLVED");
                    const isReturn = log.logMsg.includes("POP");
                    
                    return (
                        <div key={i} className={cn(
                            "leading-relaxed transition-colors duration-300 break-words",
                            isLatest ? "text-zinc-100" : (isHighlight ? "text-[#22c55e]/70" : (isReturn ? "text-[#f26722]/70" : "text-zinc-600"))
                        )}>
                            {log.logMsg}
                        </div>
                    );
                })}
                <div ref={terminalEndRef} />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
