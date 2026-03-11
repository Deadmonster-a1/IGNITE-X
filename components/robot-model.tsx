"use client"

import { useRef, useEffect, useState, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  useGLTF,
  useAnimations,
  Environment,
  ContactShadows,
} from "@react-three/drei"
import * as THREE from "three"

const MODEL_URL = "/RobotExpressive.glb"

/* ─────────────────────────────────────────────────
   Robot character — Three.js RobotExpressive (CC0)
   Animated with facial expressions & pointer tracking
   ───────────────────────────────────────────────── */

function Robot({ onReady }: { onReady?: (box: THREE.Box3) => void }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(MODEL_URL)
  const { actions, mixer } = useAnimations(animations, group)
  const [currentAction, setCurrentAction] = useState("Idle")
  const headBone = useRef<THREE.Object3D | null>(null)
  const pointer = useRef(new THREE.Vector2(0, 0))

  // Find the head bone for look-at tracking and assign premium materials
  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === "Head_4") headBone.current = child

      // Apply premium dark materials to the mesh
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh

        mesh.castShadow = true
        mesh.receiveShadow = true

        // Upgrade material to PhysicalMaterial for a premium look
        if (mesh.material) {
          const oldMat = mesh.material as THREE.MeshStandardMaterial
          const newMat = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#111111"), // Dark graphite
            metalness: 0.8,
            roughness: 0.2,
            clearcoat: 0.5,
            clearcoatRoughness: 0.2,
            envMapIntensity: 1.5,
          })

          if (oldMat.name.toLowerCase().includes("black") || oldMat.color.getHex() < 0x222222) {
            newMat.color.setHex(0x050505)
            newMat.roughness = 0.1
            newMat.metalness = 0.9
          }

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

  // Compute bounding box and notify parent for camera framing
  useEffect(() => {
    if (!group.current || !onReady) return
    // Wait a tick for the scene to settle
    requestAnimationFrame(() => {
      const box = new THREE.Box3().setFromObject(group.current!)
      onReady(box)
    })
  }, [scene, onReady])

  // Play Idle on load, then cycle animations
  useEffect(() => {
    if (!actions) return

    const idle = actions["Idle"]
    if (idle) idle.reset().fadeIn(0.5).play()

    const cycle = ["Idle", "Wave", "Idle", "Dance", "Idle", "ThumbsUp"]
    let idx = 0

    const timer = setInterval(() => {
      idx = (idx + 1) % cycle.length
      const nextName = cycle[idx]
      const next = actions[nextName]
      const prev = actions[currentAction]

      if (next && prev) {
        prev.fadeOut(0.4)
        next.reset().fadeIn(0.4).play()

        if (nextName !== "Idle") {
          next.clampWhenFinished = true
          next.setLoop(THREE.LoopOnce, 1)

          const onDone = () => {
            mixer.removeEventListener("finished", onDone)
            next.fadeOut(0.4)
            const idleA = actions["Idle"]
            if (idleA) {
              idleA.reset().fadeIn(0.4).play()
              setCurrentAction("Idle")
            }
          }
          mixer.addEventListener("finished", onDone)
        }
        setCurrentAction(nextName)
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [actions, mixer]) // eslint-disable-line react-hooks/exhaustive-deps

  // Set happy facial expression
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).morphTargetInfluences) {
        const mesh = child as THREE.Mesh
        const dict = mesh.morphTargetDictionary
        if (dict && mesh.morphTargetInfluences) {
          if (dict["Smile"] !== undefined) mesh.morphTargetInfluences[dict["Smile"]] = 0.7
          if (dict["Happy"] !== undefined) mesh.morphTargetInfluences[dict["Happy"]] = 0.5
        }
      }
    })
  }, [scene])

  // Per-frame pointer tracking for head and subtle body sway
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
        pointer.current.x * 0.08,
        0.03
      )
    }
  })

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

/* ─────────────────────────────────────────────────
   Auto-framing camera: computes the perfect distance
   to show the robot fully, centered, with padding
   ───────────────────────────────────────────────── */

function AutoFrameCamera({ boundingBox }: { boundingBox: THREE.Box3 | null }) {
  const { camera, size } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 0, 5))
  const targetLook = useRef(new THREE.Vector3(0, 0.5, 0))

  // Compute ideal camera position from bounding box
  useEffect(() => {
    if (!boundingBox) return

    const center = new THREE.Vector3()
    boundingBox.getCenter(center)
    const bSize = new THREE.Vector3()
    boundingBox.getSize(bSize)

    // The robot's vertical extent
    const maxDim = Math.max(bSize.x, bSize.y, bSize.z)
    const fov = (camera as THREE.PerspectiveCamera).fov
    const fovRad = (fov * Math.PI) / 180
    // Distance needed to fit the model with 20% padding
    const distance = (maxDim * 1.2) / (2 * Math.tan(fovRad / 2))

    targetPos.current.set(0, center.y + 0.1, distance)
    targetLook.current.copy(center)
    targetLook.current.y += 0.05 // Slightly above center for a heroic angle
  }, [boundingBox, camera])

  // Responsive adjustments based on aspect ratio
  useFrame(() => {
    const aspect = size.width / size.height

    // Scale the Z distance for narrower viewports
    let zMultiplier = 1
    if (aspect < 0.7) {
      zMultiplier = 1.35
    } else if (aspect < 1.0) {
      zMultiplier = 1.2
    } else if (aspect < 1.3) {
      zMultiplier = 1.05
    }

    const finalZ = targetPos.current.z * zMultiplier
    const finalY = targetPos.current.y

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, finalY, 0.05)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, finalZ, 0.05)
    camera.lookAt(targetLook.current)
  })

  return null
}

/* ─────────────────────────────────────────────────
   Scene content: lighting, shadows, robot, camera
   ───────────────────────────────────────────────── */

function SceneContent() {
  const [boundingBox, setBoundingBox] = useState<THREE.Box3 | null>(null)

  const handleReady = useMemo(
    () => (box: THREE.Box3) => {
      setBoundingBox(box)
    },
    []
  )

  // Get the bottom of the bounding box for shadow placement
  const shadowY = boundingBox ? boundingBox.min.y : -1

  return (
    <>
      <ambientLight intensity={0.6} />

      {/* Key light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color="#fff5ee"
      />

      {/* Fill light */}
      <directionalLight position={[-4, 4, -2]} intensity={0.4} color="#e0e8ff" />

      {/* Rim / accent from behind */}
      <pointLight position={[0, 3, -4]} intensity={0.5} color="#f26722" distance={10} decay={2} />

      <Environment preset="studio" />

      <ContactShadows
        position={[0, shadowY, 0]}
        opacity={0.3}
        scale={6}
        blur={2.5}
        far={4}
        color="#000000"
      />

      <Robot onReady={handleReady} />
      <AutoFrameCamera boundingBox={boundingBox} />
    </>
  )
}

/* ─────────────────────────────────────────────────
   Exported scene component
   ───────────────────────────────────────────────── */

export function RobotScene() {
  return (
    <div className="canvas-container h-full w-full">
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
        shadows
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_URL)
