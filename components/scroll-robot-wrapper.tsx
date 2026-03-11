"use client"

import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"

const RobotController = dynamic(
  () =>
    import("@/components/robot-controller").then((m) => ({
      default: m.RobotController,
    })),
  { ssr: false }
)

export function ScrollRobotWrapper() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Wait for all sections/docks to be in the DOM before mounting
    // Wait for dock elements to be in the DOM before mounting
    const timer = setTimeout(() => setReady(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (!ready) return null

  return (
    <Suspense fallback={null}>
      <RobotController />
    </Suspense>
  )
}
