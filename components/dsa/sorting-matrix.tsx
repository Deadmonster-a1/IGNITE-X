"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Zap, BarChart3, StepForward } from "lucide-react";
import { cn } from "@/lib/utils";

type SortAlgo = "bubble" | "selection" | "insertion";

interface SortStep {
  array: number[];
  comparing: [number, number] | null;
  swapping: [number, number] | null;
  sorted: number[];
  message: string;
}

function generateSteps(arr: number[], algo: SortAlgo): SortStep[] {
  const steps: SortStep[] = [];
  const a = [...arr];
  const sorted: number[] = [];

  steps.push({ array: [...a], comparing: null, swapping: null, sorted: [], message: `Starting ${algo} sort...` });

  if (algo === "bubble") {
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        steps.push({ array: [...a], comparing: [j, j + 1], swapping: null, sorted: [...sorted], message: `Comparing [${j}]=${a[j]} and [${j + 1}]=${a[j + 1]}` });
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          steps.push({ array: [...a], comparing: null, swapping: [j, j + 1], sorted: [...sorted], message: `Swapped! ${a[j + 1]} > ${a[j]}` });
        }
      }
      sorted.push(a.length - i - 1);
      steps.push({ array: [...a], comparing: null, swapping: null, sorted: [...sorted], message: `Pass ${i + 1} complete. Element ${a[a.length - i - 1]} locked.` });
    }
  } else if (algo === "selection") {
    for (let i = 0; i < a.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < a.length; j++) {
        steps.push({ array: [...a], comparing: [minIdx, j], swapping: null, sorted: [...sorted], message: `Finding minimum: comparing [${minIdx}]=${a[minIdx]} and [${j}]=${a[j]}` });
        if (a[j] < a[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
        steps.push({ array: [...a], comparing: null, swapping: [i, minIdx], sorted: [...sorted], message: `Swapped [${i}] and [${minIdx}]. Min=${a[i]}` });
      }
      sorted.push(i);
      steps.push({ array: [...a], comparing: null, swapping: null, sorted: [...sorted], message: `Position ${i} locked with value ${a[i]}.` });
    }
  } else {
    sorted.push(0);
    steps.push({ array: [...a], comparing: null, swapping: null, sorted: [0], message: `First element ${a[0]} is trivially sorted.` });
    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;
      steps.push({ array: [...a], comparing: [i, j], swapping: null, sorted: [...sorted], message: `Inserting ${key} into sorted portion.` });
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        steps.push({ array: [...a], comparing: null, swapping: [j, j + 1], sorted: [...sorted], message: `Shifting ${a[j]} right.` });
        j--;
      }
      a[j + 1] = key;
      sorted.push(i);
      steps.push({ array: [...a], comparing: null, swapping: null, sorted: [...sorted], message: `Inserted ${key} at position ${j + 1}.` });
    }
  }

  steps.push({ array: [...a], comparing: null, swapping: null, sorted: a.map((_, i) => i), message: "Sort complete!" });
  return steps;
}

const DEFAULT_ARRAY = [38, 27, 43, 3, 9, 82, 10, 64, 15, 50];

export default function SortingMatrix() {
  const [algo, setAlgo] = useState<SortAlgo>("bubble");
  const [steps, setSteps] = useState<SortStep[]>(() => generateSteps([...DEFAULT_ARRAY], "bubble"));
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const current = steps[stepIdx] || steps[0];
  const maxVal = Math.max(...DEFAULT_ARRAY);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [stepIdx]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  const handleAlgoChange = (a: SortAlgo) => {
    setAlgo(a);
    const newSteps = generateSteps([...DEFAULT_ARRAY], a);
    setSteps(newSteps);
    setStepIdx(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setSteps(generateSteps([...DEFAULT_ARRAY], algo));
    setStepIdx(0);
    setIsPlaying(false);
  };

  const handleStep = () => {
    if (stepIdx < steps.length - 1) setStepIdx((p) => p + 1);
  };

  const togglePlay = () => setIsPlaying((p) => !p);

  const algos: { key: SortAlgo; label: string; complexity: string }[] = [
    { key: "bubble", label: "Bubble Sort", complexity: "O(n²)" },
    { key: "selection", label: "Selection Sort", complexity: "O(n²)" },
    { key: "insertion", label: "Insertion Sort", complexity: "O(n²)" },
  ];

  return (
    <div className="flex-1 w-full flex flex-col bg-[#050505] text-zinc-100 font-sans overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-[#f26722]" size={20} />
          <h2 className="font-mono text-sm uppercase tracking-widest font-black text-zinc-100">
            The Sorting Matrix
          </h2>
        </div>
        <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
          Step {stepIdx + 1} / {steps.length}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-px bg-white/5 overflow-hidden">
        {/* VISUALIZER (70%) */}
        <div className="lg:col-span-7 bg-[#09090b]/90 flex flex-col relative">
          {/* Controls */}
          <div className="p-5 border-b border-white/5 flex flex-wrap gap-4 items-center bg-black/40 shrink-0">
            <div className="flex gap-1">
              {algos.map((a) => (
                <button
                  key={a.key}
                  onClick={() => handleAlgoChange(a.key)}
                  disabled={isPlaying}
                  className={cn(
                    "px-3 py-2 text-[10px] font-mono uppercase tracking-wider border transition-all",
                    algo === a.key
                      ? "bg-[#f26722]/20 border-[#f26722]/50 text-[#f26722]"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600"
                  )}
                >
                  {a.label}
                  <span className="ml-1 opacity-50">{a.complexity}</span>
                </button>
              ))}
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <label className="text-[10px] font-mono text-zinc-600 uppercase">Speed:</label>
              <input
                type="range"
                min={50}
                max={800}
                value={800 - speed}
                onChange={(e) => setSpeed(800 - Number(e.target.value))}
                className="w-20 h-1 bg-zinc-800 appearance-none cursor-pointer accent-[#f26722]"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={togglePlay}
                className="flex items-center gap-1 px-4 py-2 bg-[#f26722]/10 border border-[#f26722]/30 text-[#f26722] hover:bg-[#f26722] hover:text-white transition-all uppercase font-mono text-xs font-bold tracking-widest"
              >
                <Play size={14} /> {isPlaying ? "Pause" : "Play"}
              </button>
              <button
                onClick={handleStep}
                disabled={isPlaying || stepIdx >= steps.length - 1}
                className="p-2 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition-all disabled:opacity-30"
              >
                <StepForward size={14} />
              </button>
              <button
                onClick={handleReset}
                disabled={isPlaying}
                className="p-2 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition-all"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex-1 flex items-end justify-center p-8 gap-2 relative">
            {current.array.map((val, idx) => {
              const height = (val / maxVal) * 100;
              const isComparing = current.comparing?.includes(idx);
              const isSwapping = current.swapping?.includes(idx);
              const isSorted = current.sorted.includes(idx);

              let barColor = "bg-zinc-700";
              let glow = "";

              if (isSwapping) {
                barColor = "bg-[#f26722]";
                glow = "shadow-[0_0_20px_rgba(242,103,34,0.5)]";
              } else if (isComparing) {
                barColor = "bg-yellow-500";
                glow = "shadow-[0_0_15px_rgba(234,179,8,0.3)]";
              } else if (isSorted) {
                barColor = "bg-[#22c55e]";
                glow = "shadow-[0_0_10px_rgba(34,197,94,0.2)]";
              }

              return (
                <motion.div
                  key={idx}
                  className={cn(
                    "flex-1 max-w-12 rounded-t-sm relative transition-colors duration-200",
                    barColor,
                    glow
                  )}
                  initial={false}
                  animate={{ height: `${height}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-400 font-bold">
                    {val}
                  </span>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-zinc-600">
                    {idx}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="p-4 border-t border-white/5 bg-black/40 flex gap-6 shrink-0 flex-wrap">
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase">
              <div className="w-3 h-3 rounded-sm bg-yellow-500" /> Comparing
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase">
              <div className="w-3 h-3 rounded-sm bg-[#f26722]" /> Swapping
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase">
              <div className="w-3 h-3 rounded-sm bg-[#22c55e]" /> Sorted
            </div>
          </div>
        </div>

        {/* TERMINAL (30%) */}
        <div className="lg:col-span-3 bg-[#09090b]/90 backdrop-blur flex flex-col relative border-l border-zinc-800">
          <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-3">
            <Zap className="text-yellow-500" size={14} />
            <span className="font-mono text-[10px] uppercase font-black tracking-widest text-zinc-500">
              Sort Log
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] text-zinc-500 space-y-1">
            {steps.slice(0, stepIdx + 1).map((s, i) => {
              let color = "text-zinc-600";
              if (s.swapping) color = "text-[#f26722]";
              else if (s.comparing) color = "text-yellow-500/80";
              if (s.message.includes("complete") || s.message.includes("locked")) color = "text-[#22c55e]";
              if (s.message.includes("Sort complete")) color = "text-green-400 font-bold";

              return (
                <div key={i} className={cn("leading-relaxed break-words", color)}>
                  <span className="opacity-30 mr-1">{">"}</span> {s.message}
                </div>
              );
            })}
            <div ref={logRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
