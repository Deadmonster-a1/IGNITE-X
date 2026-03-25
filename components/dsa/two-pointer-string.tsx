"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, CheckCircle2, XCircle, Zap, Type } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESETS = [
  { word: "RACECAR", isPalindrome: true },
  { word: "RADAR", isPalindrome: true },
  { word: "LEVEL", isPalindrome: true },
  { word: "HELLO", isPalindrome: false },
  { word: "MADAM", isPalindrome: true },
  { word: "WORLD", isPalindrome: false },
];

interface PointerState {
  left: number;
  right: number;
  status: "idle" | "scanning" | "match" | "mismatch" | "done";
  matchedPairs: [number, number][];
  result: "pending" | "palindrome" | "not_palindrome";
}

export default function TwoPointerString() {
  const [word, setWord] = useState("RACECAR");
  const [inputVal, setInputVal] = useState("RACECAR");
  const [pointers, setPointers] = useState<PointerState>({
    left: 0,
    right: 6,
    status: "idle",
    matchedPairs: [],
    result: "pending",
  });
  const [logs, setLogs] = useState<string[]>(["SYSTEM: Two-pointer analyzer ready."]);
  const [isRunning, setIsRunning] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const pushLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  const handleSetWord = (w: string) => {
    const cleaned = w.toUpperCase().replace(/[^A-Z]/g, "");
    setInputVal(cleaned);
    setWord(cleaned);
    setPointers({
      left: 0,
      right: cleaned.length - 1,
      status: "idle",
      matchedPairs: [],
      result: "pending",
    });
    setLogs([`SYSTEM: Word set to "${cleaned}". Ready to scan.`]);
  };

  const runScan = async () => {
    if (isRunning || word.length < 2) return;
    setIsRunning(true);

    const chars = word.split("");
    let l = 0;
    let r = chars.length - 1;
    const pairs: [number, number][] = [];

    setPointers({ left: l, right: r, status: "scanning", matchedPairs: [], result: "pending" });
    setLogs([`SCAN: Initiating palindrome check on "${word}"...`]);
    pushLog(`INIT: L=0 (${chars[0]}), R=${r} (${chars[r]})`);

    await new Promise((res) => setTimeout(res, 800));

    while (l < r) {
      setPointers((prev) => ({ ...prev, left: l, right: r, status: "scanning" }));
      pushLog(`CHECK: Comparing [${l}]="${chars[l]}" with [${r}]="${chars[r]}"`);
      await new Promise((res) => setTimeout(res, 900));

      if (chars[l] === chars[r]) {
        pairs.push([l, r]);
        setPointers((prev) => ({ ...prev, status: "match", matchedPairs: [...pairs] }));
        pushLog(`MATCH: "${chars[l]}" === "${chars[r]}" ✓`);
        await new Promise((res) => setTimeout(res, 700));
        l++;
        r--;
      } else {
        setPointers((prev) => ({ ...prev, status: "mismatch", result: "not_palindrome" }));
        pushLog(`FAIL: "${chars[l]}" !== "${chars[r]}" ✗`);
        pushLog(`RESULT: "${word}" is NOT a palindrome.`);
        setIsRunning(false);
        return;
      }
    }

    // If l === r, center character
    if (l === r) {
      pairs.push([l, r]);
      pushLog(`CENTER: Character [${l}]="${chars[l]}" is the middle. Auto-pass.`);
    }

    setPointers((prev) => ({
      ...prev,
      left: l,
      right: r,
      status: "done",
      matchedPairs: [...pairs],
      result: "palindrome",
    }));
    pushLog(`RESULT: "${word}" IS a palindrome! ✓`);
    setIsRunning(false);
  };

  const handleReset = () => {
    setPointers({
      left: 0,
      right: word.length - 1,
      status: "idle",
      matchedPairs: [],
      result: "pending",
    });
    setLogs(["SYSTEM: Scanner reset."]);
    setIsRunning(false);
  };

  const chars = word.split("");

  return (
    <div className="flex-1 w-full flex flex-col bg-[#050505] text-zinc-100 font-sans overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Type className="text-[#a855f7]" size={20} />
          <h2 className="font-mono text-sm uppercase tracking-widest font-black text-zinc-100">
            Two-Pointer Analyzer
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {pointers.result === "palindrome" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-mono uppercase"
            >
              <CheckCircle2 size={14} /> Palindrome
            </motion.div>
          )}
          {pointers.result === "not_palindrome" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-mono uppercase"
            >
              <XCircle size={14} /> Not Palindrome
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-px bg-white/5 overflow-hidden">
        {/* MAIN VISUALIZER (70%) */}
        <div className="lg:col-span-7 bg-[#09090b]/90 flex flex-col relative">
          {/* Controls Bar */}
          <div className="p-5 border-b border-white/5 flex flex-wrap gap-4 items-center bg-black/40 shrink-0">
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Word:</label>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => handleSetWord(e.target.value)}
                disabled={isRunning}
                maxLength={15}
                className="px-3 py-2 bg-[#111113] border border-zinc-700 font-mono text-sm text-[#a855f7] focus:outline-none focus:border-[#a855f7] w-40 uppercase"
              />
            </div>

            <div className="flex gap-1 flex-wrap">
              {PRESETS.map((p) => (
                <button
                  key={p.word}
                  onClick={() => handleSetWord(p.word)}
                  disabled={isRunning}
                  className={cn(
                    "px-2 py-1 text-[10px] font-mono uppercase tracking-wider border transition-all",
                    word === p.word
                      ? "bg-[#a855f7]/20 border-[#a855f7]/50 text-[#a855f7]"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600"
                  )}
                >
                  {p.word}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            <div className="flex gap-2">
              <button
                onClick={runScan}
                disabled={isRunning || word.length < 2}
                className="flex items-center gap-2 px-5 py-2 bg-[#a855f7]/10 border border-[#a855f7]/30 text-[#a855f7] hover:bg-[#a855f7] hover:text-white disabled:opacity-50 transition-all uppercase font-mono text-xs font-bold tracking-widest"
              >
                <Play size={14} /> Scan
              </button>
              <button
                onClick={handleReset}
                disabled={isRunning}
                className="p-2 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition-all"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Character Grid */}
          <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
            <div className="flex gap-3 sm:gap-4 items-center relative">
              {chars.map((char, idx) => {
                const isLeft = pointers.status !== "idle" && idx === pointers.left;
                const isRight = pointers.status !== "idle" && idx === pointers.right;
                const isMatched = pointers.matchedPairs.some(
                  ([a, b]) => idx === a || idx === b
                );
                const isMismatchChar =
                  pointers.status === "mismatch" && (idx === pointers.left || idx === pointers.right);

                let charStyle = "bg-[#111113] border-zinc-700 text-zinc-400";
                let glow = "";

                if (isMismatchChar) {
                  charStyle = "bg-red-500/20 border-red-500 text-red-400";
                  glow = "shadow-[0_0_25px_rgba(239,68,68,0.4)]";
                } else if (isMatched) {
                  charStyle = "bg-green-500/10 border-green-500/60 text-green-400";
                  glow = "shadow-[0_0_15px_rgba(34,197,94,0.2)]";
                } else if (isLeft || isRight) {
                  charStyle = "bg-[#a855f7]/20 border-[#a855f7] text-[#a855f7]";
                  glow = "shadow-[0_0_25px_rgba(168,85,247,0.4)]";
                }

                return (
                  <motion.div
                    key={`char-${idx}`}
                    layout
                    className={cn(
                      "w-12 h-16 sm:w-16 sm:h-20 border-2 flex flex-col items-center justify-center font-mono text-2xl sm:text-3xl font-black transition-all duration-300 relative rounded-lg",
                      charStyle,
                      glow
                    )}
                  >
                    <span>{char}</span>
                    <span className="text-[9px] text-zinc-600 font-normal mt-1">{idx}</span>

                    {/* Pointer Labels */}
                    {isLeft && (
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute -top-8 text-[10px] font-black text-[#a855f7] uppercase tracking-widest"
                      >
                        ▼ L
                      </motion.div>
                    )}
                    {isRight && (
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute -top-8 text-[10px] font-black text-[#a855f7] uppercase tracking-widest"
                      >
                        ▼ R
                      </motion.div>
                    )}

                    {/* Connection line for matched pairs */}
                    {isMatched && !isMismatchChar && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-6 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Explanation Panel */}
          <div className="p-6 border-t border-white/5 bg-black/40 shrink-0">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#a855f7] mb-2 font-black">
              How Two-Pointer Works
            </h3>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Place pointer <span className="text-[#a855f7] font-bold">L</span> at the start and{" "}
              <span className="text-[#a855f7] font-bold">R</span> at the end. Compare the characters.
              If they match, move both inward. If they ever{" "}
              <span className="text-red-400 font-bold">don&apos;t match</span>, the string is not a
              palindrome. Complexity:{" "}
              <span className="text-white font-mono font-bold">O(n/2) → O(n)</span>.
            </p>
          </div>
        </div>

        {/* TERMINAL (30%) */}
        <div className="lg:col-span-3 bg-[#09090b]/90 backdrop-blur flex flex-col relative border-l border-zinc-800">
          <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-3">
            <Zap className="text-yellow-500" size={14} />
            <span className="font-mono text-[10px] uppercase font-black tracking-widest text-zinc-500">
              Scan Log
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] text-zinc-500 space-y-2">
            {logs.map((log, i) => {
              let color = "text-zinc-600";
              if (log.includes("MATCH:")) color = "text-green-400";
              if (log.includes("FAIL:")) color = "text-red-400";
              if (log.includes("RESULT:") && log.includes("IS")) color = "text-green-400 font-bold";
              if (log.includes("NOT")) color = "text-red-400 font-bold";
              if (log.includes("CHECK:")) color = "text-[#a855f7]";
              if (log.includes("CENTER:")) color = "text-yellow-500";

              return (
                <div key={i} className={cn("leading-relaxed break-words", color)}>
                  <span className="opacity-30 mr-2">{">"}</span> {log}
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
