"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { ScrollControls, useScroll, Html, Edges, Stars } from "@react-three/drei"
import * as THREE from "three"

import Robot from "./Robot"
import { courseCurriculum, Lesson, Chapter } from "@/lib/dsa-course-data"

const Y_SPACING = 25 // vertical distance between chapters
const ORBIT_RADIUS = 14 // distance from center core
const ANGLE_STEP = Math.PI / 1.5 // 120 degrees between chapters
const CORE_RADIUS = 2.5

const EMOTE_CYCLE = ["🚀", "💡", "💻", "🤔", "⚙️", "🔥", "✨", "🎯"]

interface SceneContentProps {
    onLessonSelect: (lesson: Lesson, partColor: string) => void
}

function ChapterNode({ 
    chapter, 
    partColor, 
    theta,
    yPos,
    partTitle,
    isFirstInPart,
    onLessonSelect 
}: { 
    chapter: Chapter, 
    partColor: string, 
    theta: number,
    yPos: number,
    partTitle?: string,
    isFirstInPart: boolean,
    onLessonSelect: (lesson: Lesson, partColor: string) => void 
}) {
    const scaleRef = useRef<THREE.Group>(null)
    const { camera } = useThree()
    
    useFrame((state, delta) => {
        if (!scaleRef.current) return
        
        // World Y position of the node
        const worldY = yPos
        
        // Distance in Y from the camera
        const distY = Math.abs(camera.position.y - worldY)
        
        // Node pops in when within 40 units of vertical distance
        let targetScale = 0
        if (distY < 40) {
            targetScale = 1
        }
        
        const currentScale = scaleRef.current.scale.x
        const s = THREE.MathUtils.damp(currentScale, targetScale, 6, delta)
        scaleRef.current.scale.set(s, s, s)
        
        // Float effect on the node group
        scaleRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5 + theta) * 0.8
    })

    const chapNum = chapter.title.split(' — ')[0] || "Module"
    const chapName = chapter.title.split(' — ')[1] || chapter.title

    return (
        // Place node around the core using rotation
        <group position={[0, yPos, 0]} rotation={[0, theta, 0]}>
            <group ref={scaleRef}>
                {/* Bridge connecting node to the core */}
                <mesh position={[0, 0, (ORBIT_RADIUS + CORE_RADIUS) / 2]}>
                    <boxGeometry args={[0.2, 0.1, ORBIT_RADIUS - CORE_RADIUS]} />
                    <meshStandardMaterial color={partColor} emissive={partColor} emissiveIntensity={1} />
                </mesh>

                {/* The Node Platform, placed at ORBIT_RADIUS away from center */}
                <group position={[0, 0, ORBIT_RADIUS]}>
                    {/* Glowing base platform */}
                    <mesh receiveShadow castShadow>
                        <cylinderGeometry args={[3, 2.5, 0.4, 6]} />
                        <meshStandardMaterial color="#0c0c0f" roughness={0.2} metalness={0.9}/>
                        <Edges scale={1.0} threshold={15} color={partColor} />
                    </mesh>

                    {/* Part Title floating above if it's the first in part */}
                    {isFirstInPart && partTitle && (
                        <Html transform distanceFactor={15} position={[0, 5, 0]} className="pointer-events-none w-80 text-center"
                              rotation={[0, Math.PI, 0]}>
                            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 mb-1 uppercase tracking-widest leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                {partTitle.split(' — ')[0]}
                            </h1>
                            <p className="text-lg font-bold text-muted-foreground">
                                {partTitle.split(' — ')[1]}
                            </p>
                        </Html>
                    )}

                    {/* Interactive HTML Card - Rotated to face outwards */}
                    <Html transform distanceFactor={12} position={[0, 1.5, 0]} rotation={[0, Math.PI, 0]} className="w-[340px]" zIndexRange={[100, 0]}>
                         <div className="bg-black/80 backdrop-blur-md border border-white/10 p-5 rounded-2xl shadow-2xl relative overflow-hidden group">
                             {/* Hover ambient glow */}
                             <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${partColor}, transparent)` }} />
                             
                             <div className="flex flex-col mb-4 pb-4 border-b border-white/10 relative z-10 hover:pr-4">
                                 <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-1" style={{ color: partColor }}>
                                     {chapNum}
                                 </span>
                                 <h3 className="text-xl font-bold text-white leading-tight">
                                     {chapName}
                                 </h3>
                             </div>

                             <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-2 cursor-pointer pointer-events-auto relative z-10">
                                 {[...chapter.concepts, ...chapter.problems].map((lesson) => {
                                     const isLocked = lesson.isLocked;
                                     return (
                                         <button 
                                             key={lesson.id}
                                             onClick={(e) => {
                                                 e.stopPropagation();
                                                 if(!isLocked) onLessonSelect(lesson, lesson.color || partColor)
                                             }}
                                             disabled={isLocked}
                                             className={`w-full text-left p-2.5 rounded-lg flex items-center gap-3 transition-colors ${
                                                 isLocked ? 'opacity-50 cursor-not-allowed bg-black/20' : 'hover:bg-white/5 hover:border hover:border-white/10 active:bg-white/10'
                                             }`}
                                         >
                                             <div className="w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0"
                                                  style={{ color: isLocked ? '#666' : lesson.color || partColor }}
                                             >
                                                 <lesson.icon size={16} />
                                             </div>
                                             <div className="flex flex-col flex-1 truncate">
                                                 <span className={`text-[13px] font-medium truncate ${isLocked ? 'text-white/50' : 'text-white'}`}>{lesson.title}</span>
                                                 <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                                                     {lesson.type}
                                                 </span>
                                             </div>
                                         </button>
                                     )
                                 })}
                             </div>
                         </div>
                    </Html>
                </group>
            </group>
        </group>
    )
}

// Separate component for the fixed overlay that needs access to useScroll
function ProgressHUD() {
    const scroll = useScroll()
    const [progress, setProgress] = useState(0)
    
    useFrame(() => {
        setProgress(scroll.offset * 100)
    })
    
    return (
        <Html className="pointer-events-none select-none" style={{ position: 'fixed', top: '20vh', right: '4vw', height: '60vh' }}>
            <div className="flex flex-col items-center justify-between h-full py-4 opacity-60">
                <span className="text-accent font-mono text-[9px] uppercase tracking-widest origin-center -rotate-90 whitespace-nowrap mb-8" style={{ transform: "rotate(-90deg) translateX(-50%)" }}>
                    Decoding Status
                </span>
                
                <div className="relative flex-1 w-1 bg-white/10 rounded-full overflow-hidden my-4 border border-white/5">
                    <div 
                        className="absolute top-0 w-full bg-accent shadow-[0_0_10px_#f26722]"
                        style={{ height: `${progress}%` }}
                    />
                </div>
                
                <span className="text-white font-mono text-xs font-bold pt-4">
                    {Math.round(progress)}%
                </span>
            </div>
        </Html>
    )
}

function SceneContent({ onLessonSelect }: SceneContentProps) {
    const scroll = useScroll()
    const { camera } = useThree()
    
    const totalChapters = courseCurriculum.reduce((acc, part) => acc + part.chapters.length, 0)
    const totalDepth = totalChapters * Y_SPACING

    const robotGroupRef = useRef<THREE.Group>(null)
    const [currentEmote, setCurrentEmote] = useState("🚀")
    
    useFrame((state, delta) => {
        const offset = scroll.offset // 0 to 1
        
        // Target Y for camera: it plunges down the core.
        const startY = 15
        const endY = -totalDepth - 15
        const targetY = THREE.MathUtils.lerp(startY, endY, offset)
        
        // Camera spirals around the core. (totalChapters / 3) rotations.
        const rotations = totalChapters / 3
        const targetTheta = offset * (Math.PI * 2) * rotations
        
        const CAM_RADIUS = 32 // Camera push back so nodes are well in view
        
        // Target positions for camera
        const idealX = Math.sin(targetTheta) * CAM_RADIUS
        const idealZ = Math.cos(targetTheta) * CAM_RADIUS
        
        // Smoothly move camera
        camera.position.x = THREE.MathUtils.damp(camera.position.x, idealX, 3, delta)
        camera.position.z = THREE.MathUtils.damp(camera.position.z, idealZ, 3, delta)
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 4, delta)
        
        // Let the camera look slightly downwards at the core
        camera.lookAt(0, camera.position.y - 12, 0)
        
        // Move the robot to follow slightly ahead of the camera's rotation
        if (robotGroupRef.current) {
            const robotTheta = targetTheta + 0.6 // Robot is visually 'ahead' of camera rotation
            const ROBOT_RADIUS = 16 
            
            const rX = Math.sin(robotTheta) * ROBOT_RADIUS
            const rZ = Math.cos(robotTheta) * ROBOT_RADIUS
            const rY = camera.position.y - 2 // Robot is slightly below eye-level
            
            robotGroupRef.current.position.x = THREE.MathUtils.damp(robotGroupRef.current.position.x, rX, 5, delta)
            robotGroupRef.current.position.y = THREE.MathUtils.damp(robotGroupRef.current.position.y, rY, 5, delta)
            robotGroupRef.current.position.z = THREE.MathUtils.damp(robotGroupRef.current.position.z, rZ, 5, delta)
            
            // Robot faces the core
            robotGroupRef.current.lookAt(0, rY, 0)
            
            // Determine emoji to display based on progress
            const cycleIndex = Math.floor(offset * totalChapters) % EMOTE_CYCLE.length
            setCurrentEmote(EMOTE_CYCLE[cycleIndex] || "🚀")
        }
    })

    // Track generating coordinates
    let currentY = 0
    let currentTheta = 0
    const pillarHeight = totalDepth + 80 // Extra tall core so we don't see ends
    
    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[20, 30, 20]} intensity={1.5} castShadow />
            {/* Core inner illumination */}
            <pointLight position={[0, -totalDepth/2, 0]} intensity={4} color="#00ffcc" distance={200} decay={1.5} />

            <fog attach="fog" args={["#050508", 30, 90]} />
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

            <ProgressHUD />

            {/* The Central Knowledge Core */}
            <mesh position={[0, -totalDepth/2, 0]}>
                <cylinderGeometry args={[CORE_RADIUS, CORE_RADIUS, pillarHeight, 32]} />
                <meshStandardMaterial color="#020202" metalness={1} roughness={0.1} />
                <Edges scale={1.0} threshold={10} color="#00ffcc" />
            </mesh>
            
            {/* Glowing Holographic Shell of the Core */}
            <mesh position={[0, -totalDepth/2, 0]}>
                <cylinderGeometry args={[CORE_RADIUS + 0.2, CORE_RADIUS + 0.2, pillarHeight, 16, 100, true]} />
                <meshBasicMaterial color="#00ffcc" wireframe transparent opacity={0.08} />
            </mesh>

            {/* The Robot Character */}
            <group ref={robotGroupRef}>
                 <Robot emoji={currentEmote} isMoving={true} />
                 {/* Floating Emote HTML relative to the Robot */}
                 <Html position={[0, 4, 0]} center as="div" className="pointer-events-none select-none">
                     <div className="flex items-center justify-center w-12 h-12 rounded-full bg-black/60 border border-white/20 backdrop-blur-md text-2xl shadow-[0_0_20px_rgba(0,255,204,0.4)] animate-bounce">
                         {currentEmote}
                     </div>
                 </Html>
            </group>

            {/* Render Nodes sequentially downward */}
            {courseCurriculum.map((part, partIndex) => {
                const partColor = partIndex % 2 === 0 ? "#f26722" : "#00ffcc"
                
                return part.chapters.map((chapter, chapIndex) => {
                    const yPos = currentY
                    const theta = currentTheta
                    
                    // Advance coordinates for the next chapter
                    currentY -= Y_SPACING
                    currentTheta += ANGLE_STEP
                    
                    return (
                        <ChapterNode 
                            key={chapter.id}
                            chapter={chapter}
                            partColor={partColor}
                            theta={theta}
                            yPos={yPos}
                            partTitle={chapIndex === 0 ? part.title : undefined}
                            isFirstInPart={chapIndex === 0}
                            onLessonSelect={onLessonSelect}
                        />
                    )
                })
            })}
        </>
    )
}

export default function CourseScene({ onLessonSelect }: SceneContentProps) {
    const totalChapters = courseCurriculum.reduce((acc, part) => acc + part.chapters.length, 0)
    
    return (
        <div className="w-full h-screen fixed inset-0 bg-[#050508] z-0">
             <div className="pointer-events-none fixed inset-0 bg-grid-cyber opacity-10 z-0" aria-hidden="true" />
             <div className="noise-overlay pointer-events-none fixed inset-0 mix-blend-overlay z-0" aria-hidden="true" />

            <Canvas shadows camera={{ position: [0, 20, 35], fov: 60 }}>
                {/* Length of the scroll experience mapped to number of chapters */}
                <ScrollControls pages={totalChapters * 0.9} damping={0.2} maxSpeed={0.5}>
                    <SceneContent onLessonSelect={onLessonSelect} />
                </ScrollControls>
            </Canvas>
        </div>
    )
}
