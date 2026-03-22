"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Zap, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

type NodeType = "start" | "input" | "process" | "decision" | "output" | "end";

interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  yes?: string;
  no?: string;
  next?: string;
}

const FLOWCHART: FlowNode[] = [
  { id: "start", type: "start", label: "START", next: "input" },
  { id: "input", type: "input", label: "Input A, B, C", next: "set_max" },
  { id: "set_max", type: "process", label: "max = A", next: "cmp_b" },
  { id: "cmp_b", type: "decision", label: "B > max?", yes: "max_b", no: "cmp_c" },
  { id: "max_b", type: "process", label: "max = B", next: "cmp_c" },
  { id: "cmp_c", type: "decision", label: "C > max?", yes: "max_c", no: "output" },
  { id: "max_c", type: "process", label: "max = C", next: "output" },
  { id: "output", type: "output", label: "Output max", next: "end" },
  { id: "end", type: "end", label: "END" },
];

export default function AlgoRouter() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(9);
  const [c, setC] = useState(5);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [logs, setLogs] = useState<string[]>(["SYSTEM: Algorithm Router loaded."]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const pushLog = (msg: string) => setLogs((p) => [...p, msg]);

  const runFlowchart = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResult(null);
    setVisitedNodes([]);
    setLogs([`ROUTE: Starting with A=${a}, B=${b}, C=${c}...`]);

    let currentId = "start";
    let maxVal = 0;
    const visited: string[] = [];

    while (currentId) {
      const node = FLOWCHART.find((n) => n.id === currentId);
      if (!node) break;

      visited.push(currentId);
      setVisitedNodes([...visited]);
      setActiveNode(currentId);
      pushLog(`NODE: ${node.label}`);

      await new Promise((r) => setTimeout(r, 900));

      if (node.type === "input") {
        pushLog(`DATA: A=${a}, B=${b}, C=${c}`);
      }

      if (node.id === "set_max") {
        maxVal = a;
        pushLog(`SET: max = ${maxVal}`);
      }

      if (node.type === "decision") {
        let condition = false;
        if (node.id === "cmp_b") {
          condition = b > maxVal;
          pushLog(`TEST: ${b} > ${maxVal}? → ${condition ? "YES" : "NO"}`);
        } else if (node.id === "cmp_c") {
          condition = c > maxVal;
          pushLog(`TEST: ${c} > ${maxVal}? → ${condition ? "YES" : "NO"}`);
        }
        await new Promise((r) => setTimeout(r, 600));
        currentId = condition ? node.yes! : node.no!;
        continue;
      }

      if (node.id === "max_b") {
        maxVal = b;
        pushLog(`UPDATE: max = ${maxVal}`);
      }
      if (node.id === "max_c") {
        maxVal = c;
        pushLog(`UPDATE: max = ${maxVal}`);
      }

      if (node.type === "output") {
        setResult(maxVal);
        pushLog(`RESULT: The largest number is ${maxVal}`);
      }

      if (node.next) {
        currentId = node.next;
      } else {
        break;
      }
    }

    setActiveNode(null);
    pushLog("ROUTE: Flowchart execution complete.");
    setIsRunning(false);
  };

  const handleReset = () => {
    setActiveNode(null);
    setVisitedNodes([]);
    setResult(null);
    setLogs(["SYSTEM: Router reset."]);
    setIsRunning(false);
  };

  const getNodeStyle = (node: FlowNode) => {
    const isActive = activeNode === node.id;
    const isVisited = visitedNodes.includes(node.id);

    const base = {
      start: "rounded-full",
      end: "rounded-full",
      input: "skew-x-[-5deg]",
      output: "skew-x-[-5deg]",
      process: "rounded",
      decision: "rotate-45",
    };

    let bg = "bg-zinc-900 border-zinc-700 text-zinc-500";
    let glow = "";

    if (isActive) {
      bg = "bg-[#f26722]/20 border-[#f26722] text-[#f26722]";
      glow = "shadow-[0_0_25px_rgba(242,103,34,0.4)]";
    } else if (isVisited) {
      bg = "bg-[#22c55e]/10 border-[#22c55e]/50 text-[#22c55e]";
      glow = "shadow-[0_0_10px_rgba(34,197,94,0.15)]";
    }

    return { shape: base[node.type], bg, glow };
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-[#050505] text-zinc-100 font-sans overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <GitBranch className="text-[#8b5cf6]" size={20} />
          <h2 className="font-mono text-sm uppercase tracking-widest font-black text-zinc-100">
            The Algorithm Router
          </h2>
        </div>
        {result !== null && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1 bg-[#22c55e]/20 border border-[#22c55e]/30 text-[#22c55e] text-xs font-mono uppercase font-bold"
          >
            Result: {result}
          </motion.div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-px bg-white/5 overflow-hidden">
        {/* VISUALIZER (70%) */}
        <div className="lg:col-span-7 bg-[#09090b]/90 flex flex-col relative">
          {/* Controls */}
          <div className="p-5 border-b border-white/5 flex flex-wrap gap-4 items-center bg-black/40 shrink-0">
            <div className="flex items-center gap-3">
              {[
                { label: "A", val: a, set: setA },
                { label: "B", val: b, set: setB },
                { label: "C", val: c, set: setC },
              ].map(({ label, val, set }) => (
                <div key={label} className="flex items-center gap-1">
                  <label className="text-xs font-mono text-zinc-500 font-bold">{label}=</label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => set(Number(e.target.value))}
                    disabled={isRunning}
                    className="w-16 px-2 py-1 bg-[#111113] border border-zinc-700 font-mono text-sm text-[#8b5cf6] focus:outline-none focus:border-[#8b5cf6] text-center"
                  />
                </div>
              ))}
            </div>
            <div className="flex-1" />
            <div className="flex gap-2">
              <button
                onClick={runFlowchart}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2 bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white disabled:opacity-50 transition-all uppercase font-mono text-xs font-bold tracking-widest"
              >
                <Play size={14} /> Route
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

          {/* Flowchart */}
          <div className="flex-1 flex flex-col items-center justify-start p-6 gap-3 overflow-y-auto">
            {FLOWCHART.map((node, idx) => {
              const { shape, bg, glow } = getNodeStyle(node);
              const isDiamond = node.type === "decision";

              return (
                <React.Fragment key={node.id}>
                  {idx > 0 && (
                    <div
                      className={cn(
                        "w-0.5 h-6 transition-colors duration-300",
                        visitedNodes.includes(node.id) ? "bg-[#22c55e]/50" : "bg-zinc-800"
                      )}
                    />
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "border-2 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 text-center min-w-[160px] relative",
                      shape,
                      bg,
                      glow
                    )}
                  >
                    <span className={isDiamond ? "-rotate-45 block" : ""}>{node.label}</span>
                    {isDiamond && (
                      <div className="absolute -right-20 top-1/2 -translate-y-1/2 flex items-center gap-1 -rotate-45">
                        <div className="w-8 h-0.5 bg-zinc-700" />
                        <span className="text-[9px] text-zinc-500">YES</span>
                      </div>
                    )}
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* TERMINAL (30%) */}
        <div className="lg:col-span-3 bg-[#09090b]/90 backdrop-blur flex flex-col relative border-l border-zinc-800">
          <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-3">
            <Zap className="text-yellow-500" size={14} />
            <span className="font-mono text-[10px] uppercase font-black tracking-widest text-zinc-500">
              Route Log
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[10px] text-zinc-500 space-y-1">
            {logs.map((log, i) => {
              let color = "text-zinc-600";
              if (log.includes("NODE:")) color = "text-[#8b5cf6]";
              if (log.includes("TEST:")) color = "text-yellow-500";
              if (log.includes("YES")) color = "text-green-400";
              if (log.includes("NO")) color = "text-red-400";
              if (log.includes("SET:") || log.includes("UPDATE:")) color = "text-[#f26722]";
              if (log.includes("RESULT:")) color = "text-green-400 font-bold";
              return (
                <div key={i} className={cn("leading-relaxed break-words", color)}>
                  <span className="opacity-30 mr-1">{">"}</span> {log}
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
