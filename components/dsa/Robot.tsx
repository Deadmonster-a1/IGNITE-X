"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Text3D, Center, Float } from "@react-three/drei"
import * as THREE from "three"

interface RobotProps {
    emoji: string
    isMoving: boolean
}

export default function Robot({ emoji, isMoving }: RobotProps) {
    const groupRef = useRef<THREE.Group>(null)
    const headRef = useRef<THREE.Mesh>(null)
    const leftArmRef = useRef<THREE.Mesh>(null)
    const rightArmRef = useRef<THREE.Mesh>(null)
    
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        
        if (groupRef.current) {
            // Gentle hovering
            groupRef.current.position.y = Math.sin(time * 2) * 0.1
        }

        if (headRef.current) {
            // Subtle head bob
            headRef.current.rotation.y = Math.sin(time) * 0.1
            headRef.current.rotation.z = Math.cos(time * 0.8) * 0.05
        }

        if (isMoving) {
            // Walking/Movement animation
            if (leftArmRef.current && rightArmRef.current) {
                leftArmRef.current.rotation.x = Math.sin(time * 10) * 0.5
                rightArmRef.current.rotation.x = -Math.sin(time * 10) * 0.5
            }
        } else {
            // Idle animation
            if (leftArmRef.current && rightArmRef.current) {
                leftArmRef.current.rotation.x = Math.sin(time * 2) * 0.1
                rightArmRef.current.rotation.x = Math.sin(time * 2 + Math.PI) * 0.1
            }
        }
    })

    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: "#f26722", 
        roughness: 0.2, 
        metalness: 0.8 
    })
    
    const darkMaterial = new THREE.MeshStandardMaterial({ 
        color: "#0a0a0d", 
        roughness: 0.5, 
        metalness: 0.9 
    })
    
    // Fallback simple sprite for emoji if Text3D doesn't work well
    return (
        <group ref={groupRef}>
            {/* Emote/Emoji Floating Above */}
            <Float
                speed={4}
                rotationIntensity={0.2}
                floatIntensity={0.5}
                position={[0, 1.8, 0]}
            >
                <Center>
                     <mesh>
                         {/* Using a simple planes with emoji as texture could work, or just native HTML if preferred, but doing 3D text/shapes is nicer. We'll use a simple placeholder text for now using plain text if it's emoji */}
                         {/* Native emojis don't render well in Text3D without proper font, so we'll use Html component from drei in the parent, or a basic sprite here. Actually we'll let the parent handle the HTML emote for perfect emoji rendering */}
                     </mesh>
                </Center>
            </Float>

            {/* Head */}
            <mesh ref={headRef} position={[0, 1.2, 0]} castShadow>
                <boxGeometry args={[0.8, 0.6, 0.6]} />
                <primitive object={bodyMaterial} />
                
                {/* Eyes */}
                <mesh position={[-0.2, 0.1, 0.31]}>
                    <planeGeometry args={[0.15, 0.1]} />
                    <meshBasicMaterial color="#00ffcc" toneMapped={false} />
                </mesh>
                <mesh position={[0.2, 0.1, 0.31]}>
                    <planeGeometry args={[0.15, 0.1]} />
                    <meshBasicMaterial color="#00ffcc" toneMapped={false} />
                </mesh>

                {/* Antenna */}
                <mesh position={[0, 0.4, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                    <primitive object={darkMaterial} />
                </mesh>
                <mesh position={[0, 0.6, 0]}>
                    <sphereGeometry args={[0.08]} />
                    <meshBasicMaterial color="#f26722" toneMapped={false} />
                </mesh>
            </mesh>

            {/* Neck */}
            <mesh position={[0, 0.8, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.2]} />
                <primitive object={darkMaterial} />
            </mesh>

            {/* Torso */}
            <mesh position={[0, 0.3, 0]} castShadow>
                <boxGeometry args={[0.9, 0.8, 0.5]} />
                <primitive object={bodyMaterial} />
                
                {/* Chest light */}
                <mesh position={[0, 0, 0.26]}>
                    <circleGeometry args={[0.15, 32]} />
                    <meshBasicMaterial color="#00ffcc" toneMapped={false} />
                </mesh>
            </mesh>

            {/* Left Arm */}
            <group position={[-0.6, 0.6, 0]}>
                <mesh ref={leftArmRef} position={[0, -0.3, 0]} castShadow>
                    <cylinderGeometry args={[0.1, 0.08, 0.6]} />
                    <primitive object={darkMaterial} />
                </mesh>
            </group>

            {/* Right Arm */}
            <group position={[0.6, 0.6, 0]}>
                <mesh ref={rightArmRef} position={[0, -0.3, 0]} castShadow>
                    <cylinderGeometry args={[0.1, 0.08, 0.6]} />
                    <primitive object={darkMaterial} />
                </mesh>
            </group>

            {/* Single "Wheel"/Hover Base */}
            <mesh position={[0, -0.3, 0]} castShadow>
                <sphereGeometry args={[0.3, 32, 32]} />
                <primitive object={darkMaterial} />
                <meshBasicMaterial color="#0a0a0d" wireframe={true} transparent opacity={0.3}/>
            </mesh>
            
            {/* Hover exhaust glow */}
            <mesh position={[0, -0.5, 0]}>
                 <cylinderGeometry args={[0.2, 0.4, 0.2]} />
                 <meshBasicMaterial color="#00ffcc" transparent opacity={0.5} toneMapped={false} />
            </mesh>

        </group>
    )
}
