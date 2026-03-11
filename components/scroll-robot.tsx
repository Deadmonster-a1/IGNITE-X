"use client"

import React, { useRef, useEffect, useState, useMemo, Component } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  useGLTF,
  useAnimations,
  Environment,
  ContactShadows,
} from "@react-three/drei"
import * as THREE from "three"

/* ── Error boundary to prevent 3D crashes from breaking the page ── */

class ErrorBoundaryCanvas extends Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: Error) {
    console.error("[v0] ScrollRobot 3D error caught:", error.message)
    this.props.onError()
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

const MODEL_URL = "/RobotExpressive.glb"

/* ── Robot mesh ─────────────────────────────────── */

function Robot({
  onReady,
  targetRotY,
}: {
  onReady?: (box: THREE.Box3) => void
  targetRotY: React.MutableRefObject<number>
}) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(MODEL_URL)
  const { actions, mixer } = useAnimations(animations, group)
  const headBone = useRef<THREE.Object3D | null>(null)
  const pointer = useRef(new THREE.Vector2(0, 0))

  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === "Head_4") headBone.current = child

      // Apply premium dark materials to the mesh
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh

        // Ensure it casts and receives shadows
        mesh.castShadow = true
        mesh.receiveShadow = true

        // Upgrade material to PhysicalMaterial for a premium look
        if (mesh.material) {
          const oldMat = mesh.material as THREE.MeshStandardMaterial

          // If it's the main body (usually white/grey in the default model)
          // we make it a sleek dark metal.
          const newMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#111111"), // Dark graphite
            metalness: 0.8,
            roughness: 0.2,
            clearcoat: 0.5,
            clearcoatRoughness: 0.2,
            envMapIntensity: 1.5,
          })

          // If the original material was black (like joints/eyes), keep it dark but glossier
          if (oldMat.name.toLowerCase().includes("black") || oldMat.color.getHex() < 0x222222) {
            newMat.color.setHex(0x050505)
            newMat.roughness = 0.1
            newMat.metalness = 0.9
          }

          // If the original material was the screen/face, give it a subtle neon green emission
          if (oldMat.name.toLowerCase().includes("screen") || child.name.toLowerCase().includes("face")) {
            newMat.color.setHex(0x222222)
            newMat.emissive = new THREE.Color("#00ff00")
            newMat.emissiveIntensity = 0.5
          }

          mesh.material = newMat
        }
      }
    })
  }, [scene])

  useEffect(() => {
    if (!group.current || !onReady) return
    requestAnimationFrame(() => {
      if (group.current) {
        const box = new THREE.Box3().setFromObject(group.current)
        onReady(box)
      }
    })
  }, [scene, onReady])

  // Animation cycle
  useEffect(() => {
    if (!actions) return
    const idle = actions["Idle"]
    if (idle) idle.reset().fadeIn(0.5).play()

    const cycle = ["Idle", "Wave", "Idle", "Dance", "Idle", "ThumbsUp"]
    let idx = 0
    let current = "Idle"

    const timer = setInterval(() => {
      idx = (idx + 1) % cycle.length
      const nextName = cycle[idx]
      const next = actions[nextName]
      const prev = actions[current]

      if (next && prev) {
        prev.fadeOut(0.4)
        next.reset().fadeIn(0.4).play()

        if (nextName !== "Idle") {
          next.clampWhenFinished = true
          next.setLoop(THREE.LoopOnce, 1)
          const onDone = () => {
            mixer.removeEventListener("finished", onDone)
            next.fadeOut(0.4)
            const idleAction = actions["Idle"]
            if (idleAction) {
              idleAction.reset().fadeIn(0.4).play()
              current = "Idle"
            }
          }
          mixer.addEventListener("finished", onDone)
        }
        current = nextName
      }
    }, 6000)

    return () => clearInterval(timer)
  }, [actions, mixer])

  // Facial expression
  useEffect(() => {
    scene.traverse((child) => {
      if (
        (child as THREE.Mesh).isMesh &&
        (child as THREE.Mesh).morphTargetInfluences
      ) {
        const mesh = child as THREE.Mesh
        const dict = mesh.morphTargetDictionary
        if (dict && mesh.morphTargetInfluences) {
          if (dict["Smile"] !== undefined)
            mesh.morphTargetInfluences[dict["Smile"]] = 0.7
          if (dict["Happy"] !== undefined)
            mesh.morphTargetInfluences[dict["Happy"]] = 0.5
        }
      }
    })
  }, [scene])

  useFrame(({ pointer: ptr }) => {
    pointer.current.lerp(ptr, 0.05)

    if (headBone.current) {
      headBone.current.rotation.y = THREE.MathUtils.lerp(
        headBone.current.rotation.y,
        pointer.current.x * 0.4,
        0.06
      )
      headBone.current.rotation.x = THREE.MathUtils.lerp(
        headBone.current.rotation.x,
        pointer.current.y * -0.15,
        0.06
      )
    }

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetRotY.current,
        0.04
      )
    }
  })

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

/* ── Auto-frame camera ─────────────────────────── */

function AutoFrameCamera({ boundingBox }: { boundingBox: THREE.Box3 | null }) {
  const { camera, size } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 0.5, 4.5))
  const targetLook = useRef(new THREE.Vector3(0, 0.5, 0))

  useEffect(() => {
    if (!boundingBox) return
    const center = new THREE.Vector3()
    boundingBox.getCenter(center)
    const bSize = new THREE.Vector3()
    boundingBox.getSize(bSize)
    const maxDim = Math.max(bSize.x, bSize.y, bSize.z)
    const fov = (camera as THREE.PerspectiveCamera).fov
    const fovRad = (fov * Math.PI) / 180
    const distance = (maxDim * 1.15) / (2 * Math.tan(fovRad / 2))
    targetPos.current.set(0, center.y + 0.1, distance)
    targetLook.current.copy(center)
    targetLook.current.y += 0.05
  }, [boundingBox, camera])

  useFrame(() => {
    const aspect = size.width / size.height
    let zMul = 1
    if (aspect < 0.7) zMul = 1.3
    else if (aspect < 1.0) zMul = 1.15

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetPos.current.y, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetPos.current.z * zMul, 0.05)
    camera.lookAt(targetLook.current)
  })

  return null
}

/* ── Scene ─────────────────────────────────────── */

function SceneContent({ targetRotY }: { targetRotY: React.MutableRefObject<number> }) {
  const [bb, setBB] = useState<THREE.Box3 | null>(null)
  const handleReady = useMemo(() => (box: THREE.Box3) => setBB(box), [])
  const shadowY = bb ? bb.min.y : -1

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow color="#fff5ee" />
      <directionalLight position={[-4, 4, -2]} intensity={0.4} color="#e0e8ff" />
      <pointLight position={[0, 3, -4]} intensity={0.5} color="#f26722" distance={10} decay={2} />
      <Environment preset="studio" />
      <ContactShadows position={[0, shadowY, 0]} opacity={0.3} scale={6} blur={2.5} far={4} color="#000" />
      <Robot onReady={handleReady} targetRotY={targetRotY} />
      <AutoFrameCamera boundingBox={bb} />
    </>
  )
}

/* ── Scroll positions ──────────────────────────── */

// Section scroll positions: the robot moves between these positions based on which
// section the user is currently viewing. Uses CSS translate for reliable animation.

interface Keyframe {
  section: string // CSS selector
  x: number // vw offset from center (negative = left, positive = right)
  y: number // px offset from bottom
  scale: number
  rotY: number
  opacity: number
}

const desktopKeyframes: Keyframe[] = [
  { section: "#hero-section", x: 32, y: 0, scale: 1, rotY: -0.15, opacity: 1 },
  { section: "#courses", x: -30, y: -10, scale: 0.85, rotY: 0.25, opacity: 0.9 },
  { section: "#features", x: 30, y: -5, scale: 0.8, rotY: -0.2, opacity: 0.85 },
  { section: "#dsa-visualizer", x: -28, y: -10, scale: 0.75, rotY: 0.3, opacity: 0.8 },
  { section: "#learning-paths", x: 32, y: -5, scale: 0.8, rotY: -0.2, opacity: 0.85 },
  { section: "#testimonials", x: -30, y: -5, scale: 0.8, rotY: 0.2, opacity: 0.85 },
  { section: "#footer", x: 0, y: -20, scale: 0.65, rotY: 0, opacity: 0.5 },
]

const mobileKeyframes: Keyframe[] = [
  { section: "#hero-section", x: 0, y: 10, scale: 0.65, rotY: 0, opacity: 0.75 },
  { section: "#courses", x: 0, y: 0, scale: 0.5, rotY: 0.1, opacity: 0.5 },
  { section: "#features", x: 0, y: 0, scale: 0.5, rotY: -0.05, opacity: 0.45 },
  { section: "#dsa-visualizer", x: 0, y: 0, scale: 0.45, rotY: 0, opacity: 0.35 },
  { section: "#learning-paths", x: 0, y: 0, scale: 0.5, rotY: -0.05, opacity: 0.45 },
  { section: "#testimonials", x: 0, y: 0, scale: 0.5, rotY: 0.05, opacity: 0.5 },
  { section: "#footer", x: 0, y: -15, scale: 0.4, rotY: 0, opacity: 0.3 },
]

/* ── Interpolation helper ──────────────────────── */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function getScrollProgress(sections: string[]): { index: number; t: number } {
  if (typeof window === "undefined") return { index: 0, t: 0 }
  const scrollY = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight <= 0) return { index: 0, t: 0 }

  // Find which section we're in by checking each section's position
  const sectionEls = sections.map((sel) => document.querySelector(sel))
  const valid = sectionEls.filter(Boolean) as HTMLElement[]

  if (valid.length === 0) return { index: 0, t: 0 }

  // Find which section the viewport center is in
  const viewCenter = scrollY + window.innerHeight / 2

  for (let i = valid.length - 1; i >= 0; i--) {
    const el = valid[i]
    const top = el.offsetTop
    if (viewCenter >= top) {
      // Calculate progress within this section
      const next = valid[i + 1]
      const sectionEnd = next ? next.offsetTop : docHeight + window.innerHeight
      const sectionProgress = Math.min(1, Math.max(0, (viewCenter - top) / (sectionEnd - top)))
      return { index: i, t: sectionProgress }
    }
  }

  return { index: 0, t: 0 }
}

/* ── ScrollRobot component ─────────────────────── */

export function ScrollRobot() {
  const containerRef = useRef<HTMLDivElement>(null)
  const targetRotY = useRef(0)
  const [mounted, setMounted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Smooth scroll-driven position updates using requestAnimationFrame
  useEffect(() => {
    if (!mounted || !containerRef.current) return

    const container = containerRef.current

    // Current animated values (smoothed)
    let currentX = 0
    let currentY = 0
    let currentScale = 1
    let currentOpacity = 1

    function tick() {
      const isDesktop = window.innerWidth >= 1024
      const keyframes = isDesktop ? desktopKeyframes : mobileKeyframes
      const sections = keyframes.map((k) => k.section)

      const { index, t } = getScrollProgress(sections)

      // Interpolate between current keyframe and next
      const current = keyframes[index]
      const next = keyframes[Math.min(index + 1, keyframes.length - 1)]

      if (!current) {
        animFrameRef.current = requestAnimationFrame(tick)
        return
      }

      const targetX = lerp(current.x, next.x, t)
      const targetY = lerp(current.y, next.y, t)
      const targetScale = lerp(current.scale, next.scale, t)
      const targetOpacity = lerp(current.opacity, next.opacity, t)
      const targetRot = lerp(current.rotY, next.rotY, t)

      // Smooth lerp towards targets
      const speed = 0.08
      currentX += (targetX - currentX) * speed
      currentY += (targetY - currentY) * speed
      currentScale += (targetScale - currentScale) * speed
      currentOpacity += (targetOpacity - currentOpacity) * speed
      targetRotY.current = targetRot

      container.style.transform = `translate(calc(-50% + ${currentX}vw), ${currentY}px) scale(${currentScale})`
      container.style.opacity = String(currentOpacity)

      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [mounted])

  if (!mounted || hasError) return null

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed z-40"
      style={{
        bottom: "2%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "clamp(140px, 20vw, 300px)",
        height: "clamp(180px, 25vw, 380px)",
      }}
    >
      {/* Glow aura */}
      <div
        className="absolute inset-0 -z-10 rounded-full opacity-15 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(242,103,34,0.5) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* HUD corners */}
      <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-accent/30" aria-hidden="true" />
      <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-accent/30" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-accent/30" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-accent/30" aria-hidden="true" />

      {/* HUD label -- desktop only */}
      <div className="absolute -top-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 lg:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-accent/60">
          ASCI-BOT v2.4
        </span>
      </div>

      {/* 3D Canvas with error fallback */}
      <div className="canvas-container h-full w-full">
        <ErrorBoundaryCanvas onError={() => setHasError(true)}>
          <Canvas
            camera={{ position: [0, 0.5, 4.5], fov: 40 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ background: "transparent" }}
            shadows
          >
            <SceneContent targetRotY={targetRotY} />
          </Canvas>
        </ErrorBoundaryCanvas>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-2 right-2 hidden h-px bg-accent/20 lg:block" aria-hidden="true" />
    </div>
  )
}

useGLTF.preload(MODEL_URL)
