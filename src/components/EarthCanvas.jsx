import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

const Earth = () => {
    return (
        <Sphere visible args={[1, 100, 200]} scale={1.8}>
            <MeshDistortMaterial
                color="#ee9821"
                attach="material"
                distort={0.3}
                speed={1.5}
                roughness={0.5}
                metalness={0.8}
            />
        </Sphere>
    );
};

const EarthCanvas = () => {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }} // Adjusted opacity to ambient light and directional light
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[0, 10, 5]} intensity={1.5} color="#f8f208" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
                    <Earth />
                    <OrbitControls
                        enableZoom={false}
                        autoRotate
                        autoRotateSpeed={2}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default EarthCanvas;
