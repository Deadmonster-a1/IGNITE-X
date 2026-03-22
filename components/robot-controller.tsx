"use client"

import React, { useRef, useEffect, useState, Component, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, useAnimations, Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

/* ── Error boundary ── */
class ErrorBoundaryCanvas extends Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: Error) { console.error("RobotController Error:", error); this.props.onError() }
  render() { if (this.state.hasError) return null; return this.props.children }
}

const MODEL_URL = "/RobotExpressive.glb"

/* ── Dock config per section ── */
interface DockConfig {
  id: string
  rotY: number
  expression: string
  expressionVal: number
  animation?: string
}

const DOCK_ORDER: DockConfig[] = [
  { id: "hero", rotY: -0.15, expression: "Happy", expressionVal: 0.6, animation: "Wave" },
  { id: "courses", rotY: 0.25, expression: "Smile", expressionVal: 0.8 },
  { id: "features", rotY: -0.2, expression: "Surprised", expressionVal: 0.4 },
  { id: "dsa", rotY: 0.3, expression: "Happy", expressionVal: 0.7, animation: "ThumbsUp" },
  { id: "paths", rotY: 0, expression: "Smile", expressionVal: 0.6 },
  { id: "testimonials", rotY: -0.25, expression: "Happy", expressionVal: 0.9, animation: "Dance" },
  { id: "footer", rotY: 0, expression: "Smile", expressionVal: 0.5 },
]

/* ── Shared external state for scroll tracking ── */
interface ScrollState {
  x: number; y: number; w: number; h: number
  velocity: number
  activeDockId: string
  travelAngle: number
}

/* ── Robot mesh ── */
function Robot({ scrollState, targetRotY }: {
  scrollState: React.MutableRefObject<ScrollState>
  targetRotY: React.MutableRefObject<number>
}) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(MODEL_URL)
  const { actions, mixer } = useAnimations(animations, group)
  const headBone = useRef<THREE.Object3D | null>(null)
  const pointer = useRef(new THREE.Vector2(0, 0))
  const currentExpr = useRef<{ name: string; val: number }>({ name: "Happy", val: 0.6 })
  const meshesWithMorphs = useRef<THREE.Mesh[]>([])
  const lastDockId = useRef("")
  const currentAnim = useRef("Idle")
  const bobPhase = useRef(0)

  // Viewport mapping dimensions
  const { size, viewport } = useThree()

  // Calculate bounding box height once
  const bbRef = useRef<THREE.Box3 | null>(null)
  const bbSizeRef = useRef<THREE.Vector3 | null>(null)

  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === "Head_4") headBone.current = child

      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = false
        mesh.receiveShadow = false

        if (mesh.material) {
          const oldMat = mesh.material as THREE.MeshStandardMaterial
          const newMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#111111"), metalness: 0.8, roughness: 0.2, clearcoat: 0.5, clearcoatRoughness: 0.2, envMapIntensity: 1.5,
          })
          if (oldMat.name.toLowerCase().includes("black") || oldMat.color.getHex() < 0x222222) {
            newMat.color.setHex(0x050505); newMat.roughness = 0.1; newMat.metalness = 0.9
          }
          if (oldMat.name.toLowerCase().includes("screen") || child.name.toLowerCase().includes("face")) {
            newMat.color.setHex(0x222222); newMat.emissive = new THREE.Color("#00ff00"); newMat.emissiveIntensity = 0.5
          }
          mesh.material = newMat
        }
      }

      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).morphTargetInfluences) {
        meshesWithMorphs.current.push(child as THREE.Mesh)
      }
    })

    // Get bounding box
    const box = new THREE.Box3().setFromObject(scene)
    const sz = new THREE.Vector3()
    box.getSize(sz)
    bbRef.current = box
    bbSizeRef.current = sz
  }, [scene])

  // Play animation loader
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return
    const firstAnimName = Object.keys(actions)[0]
    if (actions[firstAnimName]) actions[firstAnimName].reset().fadeIn(0.5).play()
  }, [actions])

  const playAnimation = useCallback((name: string) => {
    if (!actions || !actions[name] || currentAnim.current === name) return
    const prev = actions[currentAnim.current]
    const next = actions[name]
    if (prev) prev.fadeOut(0.35)
    if (next) {
      next.reset().fadeIn(0.35).play()
      next.clampWhenFinished = true
      next.setLoop(THREE.LoopOnce, 1)
      currentAnim.current = name
      const onDone = () => {
        mixer.removeEventListener("finished", onDone)
        next.fadeOut(0.35)
        const idle = actions["Idle"]
        if (idle) { idle.reset().fadeIn(0.35).play(); currentAnim.current = "Idle" }
      }
      mixer.addEventListener("finished", onDone)
    }
  }, [actions, mixer])

  useFrame(({ pointer: ptr }, delta) => {
    pointer.current.lerp(ptr, 0.05)
    const { x, y, w, h, velocity, activeDockId } = scrollState.current

    // Dock transitions
    if (activeDockId !== lastDockId.current) {
      lastDockId.current = activeDockId
      const config = DOCK_ORDER.find((d) => d.id === activeDockId)
      if (config) {
        currentExpr.current = { name: config.expression, val: config.expressionVal }
        if (config.animation && currentAnim.current === "Idle") playAnimation(config.animation)
      }
    }

    // Expressions
    for (const mesh of meshesWithMorphs.current) {
      const dict = mesh.morphTargetDictionary!
      const inf = mesh.morphTargetInfluences!
      for (const key of Object.keys(dict)) {
        const idx = dict[key]
        const target = key === currentExpr.current.name ? currentExpr.current.val : 0
        inf[idx] = THREE.MathUtils.lerp(inf[idx], target, 0.04)
      }
    }

    // Head tracking
    if (headBone.current) {
      headBone.current.rotation.y = THREE.MathUtils.lerp(headBone.current.rotation.y, pointer.current.x * 0.4, 0.06)
      headBone.current.rotation.x = THREE.MathUtils.lerp(headBone.current.rotation.x, pointer.current.y * -0.15, 0.06)
    }

    // --- FULLSCREEN MAPPING ---
    if (group.current && bbSizeRef.current && bbRef.current) {
      // 1. Map center px to [-0.5, 0.5] then multiply by viewport size
      const cx = (x - size.width / 2) / size.width
      const cy = (size.height / 2 - y) / size.height

      const targetWorldX = cx * viewport.width
      const targetWorldY = cy * viewport.height

      // 2. Map scale: If dock height is `h` pixels, what is that in world height?
      const targetWorldH = (h / size.height) * viewport.height
      // Scale model so its bounding box height equals target world height
      const s = targetWorldH / bbSizeRef.current.y
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, s, 0.1))

      // 3. Move group so the CENTER of bounding box aligns with targetWorldY
      // Center Y relative to origin is bbCenter.y * scale
      // The box returned by getCenter corresponds to unscaled bounds.
      const bbCenter = bbRef.current.getCenter(new THREE.Vector3())
      const adjustedWorldY = targetWorldY - (bbCenter.y * s)

      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetWorldX, 0.1)
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, adjustedWorldY, 0.1)

      // 4. Rotations & Bobbing
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY.current, 0.04)
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, THREE.MathUtils.clamp(velocity * -0.0004, -0.06, 0.06), 0.05)

      bobPhase.current += delta * 1.5
      // apply bob directly to the y pos
      const bob = Math.sin(bobPhase.current) * 0.015 * s
      group.current.position.y += bob
    }
  })

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

/* ── Scene ── */
function SceneContent({ targetRotY, scrollState }: {
  targetRotY: React.MutableRefObject<number>
  scrollState: React.MutableRefObject<ScrollState>
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#fff5ee" />
      <directionalLight position={[-4, 4, -2]} intensity={0.4} color="#e0e8ff" />
      <pointLight position={[0, 3, -4]} intensity={0.5} color="#00ff00" distance={10} decay={2} />
      <Environment key="custom-env">
        <mesh position={[0, 5, -10]} scale={[10, 10, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-10, 5, 0]} rotation={[0, Math.PI / 2, 0]} scale={[10, 10, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
        <mesh position={[10, 5, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 10, 1]}>
          <planeGeometry />
          <meshBasicMaterial color="#a855f7" />
        </mesh>
      </Environment>
      <Robot targetRotY={targetRotY} scrollState={scrollState} />
    </>
  )
}

/* ── Main Controller ── */
export function RobotController() {
  const targetRotY = useRef(0)
  const glowRef = useRef<HTMLDivElement>(null)

  // Provide defaults outside of render loop
  const scrollState = useRef<ScrollState>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 500,
    w: 200,
    h: 250,
    velocity: 0,
    activeDockId: "hero",
    travelAngle: 0
  })
  const [mounted, setMounted] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return

    let animFrame = 0
    let prevX = scrollState.current.x
    let prevY = scrollState.current.y
    let hasInit = false

    function tick() {
      const docks = Array.from(document.querySelectorAll("[data-robot-dock]")) as HTMLElement[]
      if (docks.length > 0) {
        const viewportCenter = window.innerHeight / 2
        let activeIdx = 0
        let minDist = Infinity

        for (let i = 0; i < docks.length; i++) {
          const rect = docks[i].getBoundingClientRect()
          const center = rect.top + rect.height / 2
          const dist = Math.abs(center - viewportCenter)
          if (dist < minDist) { minDist = dist; activeIdx = i }
        }

        const activeDock = docks[activeIdx]
        const activeRect = activeDock.getBoundingClientRect()
        const activeId = activeDock.getAttribute("data-robot-dock") || "hero"

        const targetX = activeRect.left + activeRect.width / 2
        const targetY = activeRect.top + activeRect.height / 2
        const targetW = activeRect.width
        const targetH = activeRect.height

        // Initialize immediately to prevent fly-in on load
        if (!hasInit) {
          scrollState.current.x = targetX
          scrollState.current.y = targetY
          scrollState.current.w = targetW
          scrollState.current.h = targetH
          hasInit = true
        }

        const config = DOCK_ORDER.find((d) => d.id === activeId)
        targetRotY.current = config?.rotY ?? 0

        const dx = targetX - scrollState.current.x
        const dy = targetY - scrollState.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const speed = dist > 200 ? 0.15 : dist > 50 ? 0.08 : 0.05

        scrollState.current.x += dx * speed
        scrollState.current.y += dy * speed
        scrollState.current.w += (targetW - scrollState.current.w) * speed
        scrollState.current.h += (targetH - scrollState.current.h) * speed

        const vx = scrollState.current.x - prevX
        const vy = scrollState.current.y - prevY
        const vel = Math.sqrt(vx * vx + vy * vy)

        scrollState.current.velocity = vel
        scrollState.current.activeDockId = activeId
        scrollState.current.travelAngle = Math.atan2(vy, vx)

        prevX = scrollState.current.x
        prevY = scrollState.current.y

        // Render 2D glow on top of the DOM
        if (glowRef.current) {
          glowRef.current.style.transform = `translate(${scrollState.current.x}px, ${scrollState.current.y}px)`
          glowRef.current.style.opacity = "0"
        }
      }
      animFrame = requestAnimationFrame(tick)
    }

    animFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrame)
  }, [mounted])

  if (!mounted || hasError) return null

  return (
    <>
      <div
        ref={glowRef}
        className="pointer-events-none fixed left-0 top-0 z-20 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-none"
        style={{ background: "radial-gradient(circle, rgba(0,255,0,0.3) 0%, transparent 60%)", opacity: 0 }}
      />

      <div className="pointer-events-none fixed inset-0 z-30">
        <ErrorBoundaryCanvas onError={() => setHasError(true)}>
          <Canvas
            style={{ pointerEvents: "none" }}
            camera={{ position: [0, 0, 5], fov: 35 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          >
            <SceneContent targetRotY={targetRotY} scrollState={scrollState} />
          </Canvas>
        </ErrorBoundaryCanvas>
      </div>
    </>
  )
}

useGLTF.preload(MODEL_URL)
