"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = {
  o1: "#22c55e",
  ologn: "#3b82f6",
  on: "#f59e0b",
  on2: "#ef4444",
};

function computeOps(n: number) {
  return {
    o1: 1,
    ologn: n <= 0 ? 0 : Math.ceil(Math.log2(n || 1)),
    on: n,
    on2: n * n,
  };
}

export default function BigORacer() {
  const [n, setN] = useState(10);

  const ops = useMemo(() => computeOps(n), [n]);
  const maxOps = ops.on2 || 1;

  // Points for the mini graph
  const graphPoints = useMemo(() => {
    const steps = 20;
    const points: { x: number; o1: number; ologn: number; on: number; on2: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const val = Math.round((n / steps) * i) || 1;
      const c = computeOps(val);
      points.push({ x: val, ...c });
    }
    return points;
  }, [n]);

  const graphMax = graphPoints[graphPoints.length - 1]?.on2 || 1;

  const barWidth = (val: number) => {
    if (maxOps === 0) return 0;
    return Math.max(1, (val / maxOps) * 100);
  };

  const formatNum = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
    return v.toString();
  };

  // Build SVG path
  const buildPath = (key: "o1" | "ologn" | "on" | "on2") => {
    const w = 100;
    const h = 100;
    return graphPoints
      .map((p, i) => {
        const x = (i / (graphPoints.length - 1)) * w;
        const y = h - (graphMax > 0 ? (p[key] / graphMax) * h : 0);
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${Math.max(0, y).toFixed(2)}`;
      })
      .join(" ");
  };

  const algorithms = [
    { key: "o1" as const, label: "O(1)", subtitle: "Constant", color: COLORS.o1, ops: ops.o1 },
    { key: "ologn" as const, label: "O(log n)", subtitle: "Logarithmic", color: COLORS.ologn, ops: ops.ologn },
    { key: "on" as const, label: "O(n)", subtitle: "Linear", color: COLORS.on, ops: ops.on },
    { key: "on2" as const, label: "O(n²)", subtitle: "Quadratic", color: COLORS.on2, ops: ops.on2 },
  ];

  return (
    <div className="flex-1 w-full flex flex-col bg-[#050505] text-zinc-100 font-sans overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-[#050505]/95 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Activity className="text-[#f59e0b]" size={20} />
          <h2 className="font-mono text-sm uppercase tracking-widest font-black text-zinc-100">
            Big-O Graph Racer
          </h2>
        </div>
        <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          Input Size: <span className="text-[#f59e0b] font-bold text-lg">{n}</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-px bg-white/5 overflow-hidden">
        {/* VISUALIZER (70%) */}
        <div className="lg:col-span-7 bg-[#09090b]/90 flex flex-col relative overflow-y-auto">
          {/* Slider Control */}
          <div className="p-6 border-b border-white/5 bg-black/40 shrink-0">
            <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3 block">
              Drag to increase Input Size (N)
            </label>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-zinc-600">1</span>
              <input
                type="range"
                min={1}
                max={500}
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
                className="flex-1 h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[#f59e0b]"
              />
              <span className="text-xs font-mono text-zinc-600">500</span>
            </div>
          </div>

          {/* Race Bars */}
          <div className="p-6 space-y-5">
            {algorithms.map((algo) => {
              const width = barWidth(algo.ops);
              const isDanger = algo.key === "on2" && n > 50;

              return (
                <div key={algo.key} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: algo.color }}
                      />
                      <span className="font-mono text-xs font-bold" style={{ color: algo.color }}>
                        {algo.label}
                      </span>
                      <span className="text-[10px] text-zinc-600 uppercase">{algo.subtitle}</span>
                    </div>
                    <span
                      className={cn(
                        "font-mono text-xs font-bold transition-colors",
                        isDanger ? "text-red-500 animate-pulse" : "text-zinc-400"
                      )}
                    >
                      {formatNum(algo.ops)} ops
                    </span>
                  </div>

                  <div className="h-8 bg-zinc-900/50 border border-zinc-800 rounded overflow-hidden relative">
                    <motion.div
                      className="h-full rounded-r relative"
                      style={{ backgroundColor: algo.color + "30", borderRight: `3px solid ${algo.color}` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    >
                      {isDanger && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-red-500/20 animate-pulse" />
                      )}
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Line Graph */}
          <div className="p-6 flex-1">
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-4 font-black">
              Growth Curve (0 → {n})
            </h3>
            <div className="relative w-full h-48 bg-black/30 border border-zinc-800 rounded-lg p-4 overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="100"
                    y2={y}
                    stroke="#27272a"
                    strokeWidth="0.3"
                  />
                ))}

                {/* Lines */}
                {algorithms.map((algo) => (
                  <path
                    key={algo.key}
                    d={buildPath(algo.key)}
                    fill="none"
                    stroke={algo.color}
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.8}
                  />
                ))}
              </svg>

              {/* Labels */}
              <div className="absolute bottom-1 left-2 text-[8px] font-mono text-zinc-600">N=0</div>
              <div className="absolute bottom-1 right-2 text-[8px] font-mono text-zinc-600">
                N={n}
              </div>
              <div className="absolute top-1 left-2 text-[8px] font-mono text-zinc-600">
                {formatNum(graphMax)} ops
              </div>
            </div>
          </div>
        </div>

        {/* INFO PANEL (30%) */}
        <div className="lg:col-span-3 bg-[#09090b]/90 backdrop-blur flex flex-col relative border-l border-zinc-800">
          <div className="p-4 border-b border-white/5 bg-black/40 flex items-center gap-3">
            <Zap className="text-yellow-500" size={14} />
            <span className="font-mono text-[10px] uppercase font-black tracking-widest text-zinc-500">
              Analysis
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {algorithms.map((algo) => (
              <div key={algo.key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: algo.color }} />
                  <span className="font-mono text-xs font-bold" style={{ color: algo.color }}>
                    {algo.label}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed pl-4">
                  {algo.key === "o1" &&
                    "Constant time. No matter the input size, the algorithm does 1 operation. Accessing an array element by index."}
                  {algo.key === "ologn" &&
                    `Logarithmic time. Halves the problem each step. At N=${n}, only ${ops.ologn} operations needed. Binary search uses this.`}
                  {algo.key === "on" &&
                    `Linear time. Processes each element once. At N=${n}, exactly ${n} operations. Simple loops use this.`}
                  {algo.key === "on2" &&
                    `Quadratic time. Nested loops over the same data. At N=${n}, it takes ${formatNum(ops.on2)} operations!${
                      n > 100 ? " This is dangerously slow for large inputs." : ""
                    }`}
                </p>
              </div>
            ))}

            {/* Danger Warning */}
            {n > 100 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-[10px] font-mono leading-relaxed"
              >
                ⚠ WARNING: At N={n}, O(n²) performs {formatNum(ops.on2)} operations. Real-world algorithms at
                this scale would cause noticeable delays.
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
