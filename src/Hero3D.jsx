import React from 'react';
import { motion } from 'framer-motion';

export default function Hero3D() {
  return (
    <div className="h-screen w-full absolute inset-0 z-0 bg-[#02040a] overflow-hidden pointer-events-none">
      
      {/* 1. The Base Image: Slow, infinite scale (Ken Burns effect) for a 3D breathing feel */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.15 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
        className="absolute inset-0 w-full h-full"
      >
        <img 
          src="/samurai.jpg" 
          alt="Storm Warrior" 
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />
      </motion.div>

      {/* 2. The Atmospheric Gradients: Deep Ocean Blue to Void Black */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#02040a] via-blue-950/20 to-cyan-950/10 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#02040a]/80 to-[#02040a]" />

      {/* 3. The Digital Rain / Particle Overlay (Zero CPU cost CSS pattern) */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-screen"
        style={{ 
          backgroundImage: 'radial-gradient(circle at center, #00f6ff 1px, transparent 1px)', 
          backgroundSize: '48px 48px' 
        }} 
      />

      {/* 4. Scanning Line Animation for the terminal aesthetic */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20 blur-[2px]"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
    </div>
  );
}