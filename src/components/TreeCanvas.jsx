import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

const Branch = ({ position, rotation, length, thickness, depth, maxDepth }) => {
    const meshRef = useRef();
    const [grown, setGrown] = useState(false);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        // Simple growth animation
        if (meshRef.current.scale.y < 1) {
            meshRef.current.scale.y += delta * 2; // Growth speed
        } else {
            if (!grown) setGrown(true);
        }
    });

    // If we haven't reached max depth, verify if we should render children
    // (Only render children after parent has grown a bit to simulate "growth up")
    const showChildren = true; // simplifying for performance, can gate with 'grown'

    if (depth >= maxDepth) {
        // Render a "leaf" or fruit at the end
        return (
            <group position={position} rotation={rotation}>
                <group position={[0, length / 2, 0]}>
                    <mesh scale={[1, 1, 1]}>
                        <sphereGeometry args={[thickness * 4, 16, 16]} />
                        <meshStandardMaterial color="#ee9821" emissive="#ee9821" emissiveIntensity={0.5} />
                    </mesh>
                </group>
            </group>
        );
    }

    const nextLength = length * 0.7;
    const nextThickness = thickness * 0.7;

    return (
        <group position={position} rotation={rotation}>
            {/* Pivot point at bottom for scaling up */}
            <mesh ref={meshRef} position={[0, length / 2, 0]} scale={[1, 0, 1]}>
                <cylinderGeometry args={[nextThickness, thickness, length, 8]} />
                <meshStandardMaterial color="#8B4513" roughness={0.8} />
            </mesh>

            {showChildren && (
                <group position={[0, length, 0]}>
                    <Branch
                        position={[0, 0, 0]}
                        rotation={[0, 0, Math.PI / 5]}
                        length={nextLength}
                        thickness={nextThickness}
                        depth={depth + 1}
                        maxDepth={maxDepth}
                    />
                    <Branch
                        position={[0, 0, 0]}
                        rotation={[0, 0, -Math.PI / 5]}
                        length={nextLength}
                        thickness={nextThickness}
                        depth={depth + 1}
                        maxDepth={maxDepth}
                    />
                    {/* 3D branching for volume */}
                    <Branch
                        position={[0, 0, 0]}
                        rotation={[Math.PI / 5, 0, 0]}
                        length={nextLength}
                        thickness={nextThickness}
                        depth={depth + 1}
                        maxDepth={maxDepth}
                    />
                    <Branch
                        position={[0, 0, 0]}
                        rotation={[-Math.PI / 5, 0, 0]}
                        length={nextLength}
                        thickness={nextThickness}
                        depth={depth + 1}
                        maxDepth={maxDepth}
                    />
                </group>
            )}
        </group>
    );
};

const TreeCanvas = () => {
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Canvas
                camera={{ position: [0, 5, 10], fov: 45 }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1.5} color="#fcf6ba" />
                <pointLight position={[-5, 5, -5]} intensity={1} color="#ee9821" />

                <group position={[0, -2, 0]}>
                    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
                        <Branch
                            position={[0, 0, 0]}
                            rotation={[0, 0, 0]}
                            length={2.5}
                            thickness={0.2}
                            depth={0}
                            maxDepth={4}
                        />
                    </Float>
                </group>

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
            </Canvas>
        </div>
    );
};

export default TreeCanvas;
