import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float, Sparkles } from '@react-three/drei';

function TheArchitect() {
  // Loading your specific 3D model from the public folder
  const { scene } = useGLTF('/hitem3d.glb');
  
  return (
    <Float 
      speed={2} 
      rotationIntensity={0.3} 
      floatIntensity={0.6}
    >
      <primitive object={scene} scale={2} position={[0, -1, 0]} />
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div className="h-screen w-full absolute inset-0 z-0 bg-[#030303]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Suspense fallback={null}>
          {/* Base shadow light (Very dark blue) */}
          <ambientLight intensity={0.2} color="#0a192f" />
          
          {/* Main Key Light: Bright Cyan/Ice Blue to make the model pop */}
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00f6ff" />
          
          {/* Fill Light: Deep Ocean Blue coming from the bottom left */}
          <directionalLight position={[-10, -10, -5]} intensity={1.2} color="#1d4ed8" />
          
          {/* Keeps reflections moody and dark */}
          <Environment preset="night" />

          {/* Glowing Cyan particles */}
          <Sparkles count={150} scale={12} size={2.5} speed={0.5} opacity={0.4} color="#00f6ff" />

          <TheArchitect />

          <OrbitControls 
            enableZoom={false} 
            maxPolarAngle={Math.PI / 2 + 0.1} 
            minPolarAngle={Math.PI / 2 - 0.5} 
            autoRotate 
            autoRotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>
      
      {/* Sleek fade at the bottom to blend into the dark website */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/40 to-[#030303] pointer-events-none" />
    </div>
  );
}