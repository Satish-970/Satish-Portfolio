import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, ContactShadows } from '@react-three/drei';

function GeometricShape(props) {
    const mesh = useRef();
    useFrame((state) => {
        mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2;
        mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    });

    return (
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={mesh} {...props}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#FFD700" wireframe />
            </mesh>
        </Float>
    );
}

function FloatingCube(props) {
    const mesh = useRef();
    useFrame((state, delta) => {
        mesh.current.rotation.x += delta * 0.5;
        mesh.current.rotation.y += delta * 0.6;
    });
    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={1}>
            <mesh ref={mesh} {...props}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="#FFA500" wireframe />
            </mesh>
        </Float>
    )
}

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#030610' }}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <GeometricShape position={[0, 0, 0]} scale={[1.5, 1.5, 1.5]} />
                <FloatingCube position={[-2, 1, -1]} />
                <FloatingCube position={[2, -1, -2]} />
                <FloatingCube position={[-1.5, -2, -0.5]} />
                <FloatingCube position={[1.5, 1.5, -1]} />

                <ContactShadows opacity={0.4} scale={20} blur={2.5} far={4} color="#000000" />
            </Canvas>

            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: '#fff',
                pointerEvents: 'none' // Let clicks pass through to canvas if needed, but button needs pointer-events-auto
            }}>
                <h1 style={{
                    fontSize: '8rem',
                    fontWeight: '900',
                    margin: 0,
                    lineHeight: 1,
                    textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
                    background: 'linear-gradient(to right, #FFD700, #FFA500)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>404</h1>
                <h2 style={{ fontSize: '2rem', margin: '1rem 0' }}>Lost in Space?</h2>
                <div style={{ pointerEvents: 'auto', marginTop: '2rem' }}>
                    <button
                        className="btn"
                        onClick={() => navigate('/')}
                        style={{ padding: '0.8rem 2.5rem', fontSize: '1.2rem' }}
                    >
                        Return Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
