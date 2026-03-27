import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float, Sparkles, Html, useProgress } from '@react-three/drei';
import { getGPUTier } from 'detect-gpu';

// The Decryption Loader - Prevents the "frozen" feeling while 42MB parses
function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-[#02040a]/90 border border-cyan-500/30 rounded-xl backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.2)]">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-cyan-400 font-space text-xs tracking-[0.2em] uppercase font-bold">
          Decrypting Asset {progress.toFixed(0)}%
        </span>
      </div>
    </Html>
  );
}

// The 3D Engine - Only boots if the GPU is cleared for heavy lifting
function TheArchitect3D() {
  const { scene } = useGLTF('/hitem3d.glb');

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
      <primitive object={scene} scale={2} position={[0, -1, 0]} />
    </Float>
  );
}

// The Mobile Fallback - Instant load, zero VRAM cost
function MobileFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-0">
      <img
        src="/samurai.jpg"
        alt="Storm Warrior"
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
      />
      {/* Cinematic lighting overlay to match the 3D scene's mood */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/90 via-transparent to-[#030303]" />
      
      {/* Simulated 3D Sparkles using basic CSS for mobile */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, #00f6ff 1px, transparent 2px)', backgroundSize: '40px 40px' }} />
    </div>
  );
}

export default function Hero3D() {
  const [gpuTier, setGpuTier] = useState(null);

  useEffect(() => {
    (async () => {
      const tier = await getGPUTier();
      setGpuTier(tier);
    })();
  }, []);

  // Render a dark void while the system interrogates the hardware
  if (!gpuTier) {
    return <div className="h-screen w-full absolute inset-0 z-0 bg-[#030303]" />;
  }

  // THE LOGIC GATE: Only route to the fallback if it is strictly a mobile device.
  // We trust all desktop setups (even laptops on integrated graphics) to handle the load.
  const isMobile = gpuTier.isMobile;

  return (
    <div className="h-screen w-full absolute inset-0 z-0 bg-[#030303] pointer-events-none">
      
      {isMobile ? (
        <MobileFallback />
      ) : (
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          {/* Replaced 'null' with our custom CanvasLoader */}
          <Suspense fallback={<CanvasLoader />}>
            <ambientLight intensity={0.2} color="#0a192f" />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00f6ff" />
            <directionalLight position={[-10, -10, -5]} intensity={1.2} color="#1d4ed8" />
            <Environment preset="night" />
            <Sparkles count={150} scale={12} size={2.5} speed={0.5} opacity={0.4} color="#00f6ff" />
            
            <TheArchitect3D />
            
            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 2 + 0.1}
              minPolarAngle={Math.PI / 2 - 0.5}
              autoRotate
              autoRotateSpeed={0.8}
              makeDefault
            />
          </Suspense>
        </Canvas>
      )}

      {/* Sleek fade at the bottom to blend into the dark website */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/40 to-[#030303] pointer-events-none" />
    </div>
  );
}