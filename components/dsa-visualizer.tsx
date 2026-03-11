"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { gsap } from "gsap"
import { useScrollReveal } from "@/hooks/use-gsap"
import { SectionBot } from "@/components/section-bot"
import { RobotDock } from "@/components/robot-dock"
import { Play, RotateCcw, Braces, ArrowRight } from "lucide-react"

const algorithms = [
  { label: "Bubble Sort", id: "bubble" },
  { label: "Quick Sort", id: "quick" },
  { label: "Merge Sort", id: "merge" },
  { label: "Selection Sort", id: "selection" },
  { label: "Insertion Sort", id: "insertion" },
]

function generateArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 15)
}

export function DSAVisualizer() {
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.7 })
  const vizRef = useRef<HTMLDivElement>(null)
  const [array, setArray] = useState(() => generateArray(24))
  const [sorting, setSorting] = useState(false)
  const [activeAlgo, setActiveAlgo] = useState("bubble")
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())
  const [sortedIndices, setSortedIndices] = useState<Set<number>>(new Set())
  const [customInput, setCustomInput] = useState("")
  const cancelRef = useRef(false)

  const reset = useCallback(() => {
    cancelRef.current = true
    setTimeout(() => {
      cancelRef.current = false
      setSorting(false)
      setActiveIndices(new Set())
      setSortedIndices(new Set())
      setArray(generateArray(24))
      setCustomInput("")
    }, 50)
  }, [])

  const applyCustomArray = useCallback(() => {
    if (sorting) return
    const parsed = customInput
      .split(/[\s,]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0)

    if (parsed.length > 0) {
      // Normalize to percentages (15-95%) for display purposes
      const max = Math.max(...parsed)
      const min = Math.min(...parsed)
      const range = max === min ? 1 : max - min

      const displayArray = parsed.map(val =>
        Math.floor(((val - min) / range) * 80) + 15
      )

      setArray(displayArray)
      setSortedIndices(new Set())
      setActiveIndices(new Set())
    } else {
      // Fallback to random if invalid
      reset()
    }
  }, [customInput, sorting, reset])

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const bubbleSort = useCallback(async () => {
    const arr = [...array]
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (cancelRef.current) return
        setActiveIndices(new Set([j, j + 1]))
        await sleep(40)
        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          setArray([...arr])
        }
      }
      setSortedIndices((prev) => new Set([...prev, arr.length - 1 - i]))
    }
    setSortedIndices(new Set(arr.map((_, i) => i)))
    setActiveIndices(new Set())
  }, [array])

  const selectionSort = useCallback(async () => {
    const arr = [...array]
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i
      for (let j = i + 1; j < arr.length; j++) {
        if (cancelRef.current) return
        setActiveIndices(new Set([minIdx, j]))
        await sleep(40)
        if (arr[j] < arr[minIdx]) minIdx = j
      }
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      setArray([...arr])
      setSortedIndices((prev) => new Set([...prev, i]))
    }
    setSortedIndices(new Set(arr.map((_, i) => i)))
    setActiveIndices(new Set())
  }, [array])

  const quickSort = useCallback(async () => {
    const arr = [...array]
    const sort = async (low: number, high: number) => {
      if (low >= high || cancelRef.current) return
      const pivot = arr[high]
      let i = low - 1
      for (let j = low; j < high; j++) {
        if (cancelRef.current) return
        setActiveIndices(new Set([j, high]))
        await sleep(50)
        if (arr[j] < pivot) {
          i++
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
          setArray([...arr])
        }
      }
      ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
      setArray([...arr])
      setSortedIndices((prev) => new Set([...prev, i + 1]))
      await sort(low, i)
      await sort(i + 2, high)
    }
    await sort(0, arr.length - 1)
    setSortedIndices(new Set(arr.map((_, i) => i)))
    setActiveIndices(new Set())
  }, [array])

  const mergeSort = useCallback(async () => {
    const arr = [...array]
    const sort = async (start: number, end: number) => {
      if (start >= end || cancelRef.current) return
      const mid = Math.floor((start + end) / 2)
      await sort(start, mid)
      await sort(mid + 1, end)
      const left = arr.slice(start, mid + 1)
      const right = arr.slice(mid + 1, end + 1)
      let i = 0, j = 0, k = start
      while (i < left.length && j < right.length) {
        if (cancelRef.current) return
        setActiveIndices(new Set([k]))
        await sleep(40)
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++]
        setArray([...arr])
      }
      while (i < left.length) { arr[k++] = left[i++]; setArray([...arr]) }
      while (j < right.length) { arr[k++] = right[j++]; setArray([...arr]) }
    }
    await sort(0, arr.length - 1)
    setSortedIndices(new Set(arr.map((_, i) => i)))
    setActiveIndices(new Set())
  }, [array])

  const insertionSort = useCallback(async () => {
    const arr = [...array]
    for (let i = 1; i < arr.length; i++) {
      if (cancelRef.current) return
      let key = arr[i]
      let j = i - 1

      setActiveIndices(new Set([i]))
      await sleep(40)

      while (j >= 0 && arr[j] > key) {
        if (cancelRef.current) return
        setActiveIndices(new Set([j, j + 1]))
        await sleep(40)

        arr[j + 1] = arr[j]
        j = j - 1
        setArray([...arr])
      }
      arr[j + 1] = key
      setArray([...arr])
      setSortedIndices(new Set(Array.from({ length: i + 1 }, (_, idx) => idx)))
    }
    setSortedIndices(new Set(arr.map((_, i) => i)))
    setActiveIndices(new Set())
  }, [array])

  const runSort = useCallback(async () => {
    setSorting(true)
    setSortedIndices(new Set())
    cancelRef.current = false
    switch (activeAlgo) {
      case "bubble": await bubbleSort(); break
      case "selection": await selectionSort(); break
      case "quick": await quickSort(); break
      case "merge": await mergeSort(); break
      case "insertion": await insertionSort(); break
    }
    if (!cancelRef.current) setSorting(false)
  }, [activeAlgo, bubbleSort, selectionSort, quickSort, mergeSort, insertionSort])

  useEffect(() => {
    if (!vizRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(vizRef.current, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: vizRef.current, start: "top 85%", toggleActions: "play none none none" },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="dsa-visualizer" className="scan-line relative border-y border-accent/10 bg-secondary/30 py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid-cyber opacity-20" aria-hidden="true" />
      {/* Cyberpunk corners */}
      <div className="pointer-events-none absolute left-4 top-4 h-10 w-10 border-l-2 border-t-2 border-accent/20" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-4 right-4 h-10 w-10 border-b-2 border-r-2 border-accent/20" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-10">
          <div className="flex items-center gap-2 text-accent">
            <Braces className="h-4 w-4" />
            <span className="font-mono text-sm font-semibold uppercase tracking-wider">Interactive</span>
          </div>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <h2 className="cyber-glitch text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                DSA Visualizer
              </h2>
              <SectionBot variant="dsa" className="hidden md:inline-flex mb-1" />
              <RobotDock
                id="dsa"
                label="SORT-BOT"
                className="hidden lg:flex h-[200px] w-[160px] shrink-0 mb-1"
              />
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Watch algorithms come alive. Step through sorting algorithms in real-time to build deep intuition.
            </p>
          </div>
        </div>

        {/* Visualizer Card */}
        <div ref={vizRef} className="cyber-corner relative overflow-hidden border border-border bg-card">
          {/* Controls -- suppressHydrationWarning avoids noise from browser extensions injecting attributes */}
          <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4" suppressHydrationWarning>
            <div className="flex flex-wrap gap-2" suppressHydrationWarning>
              {algorithms.map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => { if (!sorting) setActiveAlgo(algo.id) }}
                  disabled={sorting}
                  suppressHydrationWarning
                  className={`px-3.5 py-1.5 font-mono text-xs font-medium transition-all ${activeAlgo === algo.id
                      ? "bg-accent text-accent-foreground shadow-sm shadow-accent/20"
                      : "border border-border bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-50"
                    }`}
                >
                  {algo.label}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2" suppressHydrationWarning>
              <button
                onClick={reset}
                suppressHydrationWarning
                className="flex items-center gap-1.5 border border-border px-3.5 py-1.5 font-mono text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Reset"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                onClick={runSort}
                disabled={sorting}
                suppressHydrationWarning
                className="flex items-center gap-1.5 bg-accent px-4 py-1.5 font-mono text-xs font-semibold text-accent-foreground transition-all hover:brightness-110 disabled:opacity-50"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)" }}
              >
                <Play className="h-3 w-3" />
                {sorting ? "Sorting..." : "Execute"}
              </button>
            </div>
          </div>

          {/* Custom Input Row */}
          <div className="flex items-center gap-3 border-b border-border/50 bg-secondary/10 px-5 py-3" suppressHydrationWarning>
            <span className="font-mono text-[10px] uppercase text-muted-foreground hidden sm:inline">CUSTOM ARRAY:</span>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              disabled={sorting}
              placeholder="e.g. 50, 20, 80, 10, 30"
              className="flex-1 bg-background border border-border px-3 py-1.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
            />
            <button
              onClick={applyCustomArray}
              disabled={sorting || !customInput.trim()}
              className="px-3 py-1.5 border border-accent/50 bg-accent/10 font-mono text-xs text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
            >
              Set Array
            </button>
          </div>

          {/* Bars */}
          <div className="flex items-end justify-center gap-[3px] px-5 py-8 sm:gap-1 sm:px-8 sm:py-12" style={{ height: "280px" }}>
            {array.map((val, i) => {
              const isActive = activeIndices.has(i)
              const isSorted = sortedIndices.has(i)
              return (
                <div
                  key={i}
                  className="flex-1 transition-all duration-100"
                  style={{
                    height: `${val}%`,
                    background: isSorted
                      ? "var(--success)"
                      : isActive
                        ? "var(--accent)"
                        : "var(--border)",
                    boxShadow: isActive ? "0 0 12px rgba(242,103,34,0.4)" : "none",
                  }}
                />
              )
            })}
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <span className="font-mono text-[11px] text-muted-foreground">
              {algorithms.find((a) => a.id === activeAlgo)?.label} | {array.length} elements
            </span>
            <a href="#courses" className="flex items-center gap-1 font-mono text-xs font-semibold text-accent hover:underline">
              Learn more about DSA
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
