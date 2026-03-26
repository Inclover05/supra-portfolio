import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float, Sparkles } from '@react-three/drei';

// THE ARCHITECT FIX: Preload the 3D asset so Vercel doesn't crash on initial render
useGLTF.preload('/hitem3d.glb');

function TheArchitect() {
  // Loading your specific 3D model from the public folder using the absolute path
  const { scene } = useGLTF('/hitem3d.glb');
  
  // THE ARCHITECT VRAM PROFILER
  // This calculates the exact uncompressed GPU memory weight of your model's textures
  React.useEffect(() => {
    let textureBytes = 0;
    
    scene.traverse((obj) => {
      if (!obj.isMesh) return;
      
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      
      materials.forEach((mat) => {
        for (const key in mat) {
          const tex = mat[key];
          if (tex?.isTexture && tex.image) {
            const w = tex.image.width || 0;
            const h = tex.image.height || 0;
            // 4 bytes per pixel (RGBA) + roughly 33% overhead for mipmap chains
            textureBytes += w * h * 4 * 1.33; 
          }
        }
      });
    });

    console.log(`%c🚨 [STORM TERMINAL VRAM PROFILER]`, 'color: #00f6ff; font-size: 16px; font-weight: bold;');
    console.log(`%cEstimated Uncompressed Texture Memory: ${(textureBytes / 1024 / 1024).toFixed(2)} MB`, 'color: #ff0055; font-size: 14px; font-weight: bold;');
    console.log(`%cNote: If this number is > 100MB, iOS Safari will likely kill the WebGL context.`, 'color: #888888; font-size: 12px; font-style: italic;');
  }, [scene]);
  
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
    // Added pointer-events-none so the 3D canvas doesn't block UI clicks
    <div className="h-screen w-full absolute inset-0 z-0 bg-[#030303] pointer-events-none">
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

          {/* OrbitControls need pointer-events-auto to work if the parent div is pointer-events-none */}
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
      
      {/* Sleek fade at the bottom to blend into the dark website */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/40 to-[#030303] pointer-events-none" />
    </div>
  );
}