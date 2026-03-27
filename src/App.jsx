// src/App.jsx
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminDashboard from './AdminDashboard';

// Lazy load the massive main application bundle
const MainApp = React.lazy(() => import('./MainApp'));

/* --- INTRO SCREEN (HYPER-OPTIMIZED CSS ONLY) --- */
const IntroScreen = ({ onEnter }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let raindrops = [];
    let lensDrops = [];
    let animationId; 

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createLensDrops();
    };

    const createLensDrops = () => {
      lensDrops = [];
      for (let i = 0; i < 40; i++) {
        lensDrops.push({ 
          x: Math.random() * width, 
          y: Math.random() * height, 
          size: Math.random() * 2 + 1, 
          opacity: Math.random() * 0.2 + 0.1 
        });
      }
    };

    const createRain = () => {
      for (let i = 0; i < 5; i++) {
        raindrops.push({ 
          x: Math.random() * width, 
          y: -50, 
          length: Math.random() * 30 + 20, 
          speed: Math.random() * 20 + 25, 
          opacity: Math.random() * 0.3 + 0.1 
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      lensDrops.forEach(drop => { 
        ctx.beginPath(); 
        ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2); 
        ctx.fillStyle = `rgba(165, 243, 252, ${drop.opacity})`; 
        ctx.fill(); 
      });
      
      ctx.strokeStyle = 'rgba(196, 239, 255, 0.3)'; 
      ctx.lineWidth = 1;

      createRain();
      
      raindrops.forEach((drop) => { 
        drop.y += drop.speed; 
        ctx.beginPath(); 
        ctx.moveTo(drop.x, drop.y); 
        ctx.lineTo(drop.x, drop.y + drop.length); 
        ctx.stroke(); 
      });

      raindrops = raindrops.filter(drop => drop.y <= height);
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animationId = requestAnimationFrame(animate);

    // ARCHITECT FIX: Warm the cache by quietly fetching the main app in the background
    const timer = setTimeout(() => {
      import('./MainApp');
    }, 1000);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId); 
      clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div
      key="intro"
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#010205]"
    >
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#010205] to-[#010205]" />
      </div>
      
      <div className="absolute inset-0 z-10 flex justify-end pointer-events-none">
        <motion.img 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/samurai.jpg" 
          alt="Storm Warrior" 
          className="h-full w-auto object-cover md:w-[65vw] relative"
          style={{ 
            maskImage: 'linear-gradient(to right, transparent 0%, black 60%)', 
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 60%)', 
            filter: 'contrast(1.2) brightness(1.1) saturate(0.9)',
            willChange: 'transform, opacity' 
          }}
        />
      </div>
      
      <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none mix-blend-screen" style={{ willChange: 'transform' }} />
      
      <div className="relative z-40 text-center p-4 w-full max-w-[95vw]">
        <div className="relative inline-block">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9, y: 15 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-5xl md:text-[8vw] font-black uppercase tracking-tight text-transparent bg-clip-text select-none relative z-10 leading-[0.9]"
            style={{ 
              fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif', 
              backgroundImage: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 30%, #9333ea 70%, #06b6d4 100%)',
              backgroundSize: '200% auto', 
              animation: 'liquid-storm-flow 4s linear infinite', 
              WebkitTextStroke: '2px rgba(165, 243, 252, 0.5)', 
              filter: `drop-shadow(0 0 15px rgba(6, 182, 212, 0.6))` 
            }}
          >
            Supra's<br className="md:hidden" />&nbsp;Coven
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1 }} 
            className="mt-8 text-cyan-100/70 font-space text-[10px] md:text-xs tracking-[0.6em] uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          >
            The Storm Terminal
          </motion.p>
        </div>
        
        <motion.button 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 1.2, duration: 1, ease: "easeOut" }} 
          onClick={onEnter} 
          className="block mx-auto mt-12 md:mt-16 px-10 md:px-12 py-3 md:py-4 border border-cyan-400/30 text-cyan-50 hover:text-white hover:bg-cyan-400/10 hover:border-cyan-200 transition-all duration-500 font-space text-xs tracking-[0.3em] uppercase cursor-pointer backdrop-blur-md pointer-events-auto shadow-[0_0_30px_rgba(6,182,212,0.2)] rounded-full"
        >
          Welcome
        </motion.button>
      </div>
    </motion.div>
  );
};

/* --- STEALTH LOGIC --- */
const PASSCODE = "alpha2026";
const SESSION_KEY = "supra_coven_unlocked";

function useAdminGate() {
  const [isAdminMounted, setIsAdminMounted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const triggered = params.get("admin") === "true";
    const sessionUnlocked = sessionStorage.getItem(SESSION_KEY) === "1";

    if (triggered || sessionUnlocked) {
      setIsAdminMounted(true);

      if (triggered) {
        const clean = window.location.pathname;
        window.history.replaceState({}, "", clean);
      }
      
      if (sessionUnlocked) {
        setIsUnlocked(true);
      }
    }
  }, []);

  function attemptUnlock(input) {
    if (input === PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setIsUnlocked(true);
      return true;
    }
    return false;
  }

  function dismount() {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAdminMounted(false);
    setIsUnlocked(false);
  }

  return { isAdminMounted, isUnlocked, attemptUnlock, dismount };
}

/* --- MASTER ROOT APP --- */
export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const { isAdminMounted, isUnlocked, attemptUnlock, dismount } = useAdminGate();
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const isArchitect = urlParams.get('access') === 'architect';

  if (isArchitect) return <AdminDashboard />;

  const handleUnlockSubmit = () => {
    const success = attemptUnlock(passcodeInput);
    if (!success) {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-cyan-400 selection:text-black overflow-x-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&family=Syne:wght@600;800&display=swap');
        @keyframes liquid-storm-flow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.3); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.6); }
      `}} />

      {/* THE LOGIC GATE: Only render the intro until the user clicks welcome */}
      <AnimatePresence>
        {!hasEntered && <IntroScreen onEnter={() => setHasEntered(true)} />}
      </AnimatePresence>
      
      {/* THE PAYLOAD: Lazy load the heavy DOM only after the intro is dismissed */}
      {hasEntered && (
        <Suspense fallback={<div className="fixed inset-0 bg-[#010205] z-0" />}>
          <MainApp 
            isAdminMounted={isAdminMounted} 
            isUnlocked={isUnlocked} 
            dismount={dismount} 
          />
        </Suspense>
      )}

      {/* --- STEALTH ADMIN GATE --- */}
      <AnimatePresence>
        {isAdminMounted && !isUnlocked && (
          <motion.div 
            key="stealth-gate" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center pointer-events-auto"
          >
            <motion.div 
              animate={passcodeError ? { x: [-8, 8, -8, 8, 0] } : {}} 
              transition={{ duration: 0.3 }} 
              className="flex flex-col gap-4 w-64"
            >
              <input 
                autoFocus 
                type="password" 
                value={passcodeInput} 
                onChange={(e) => setPasscodeInput(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleUnlockSubmit()}
                placeholder="—"
                className="bg-transparent border border-gray-800 text-white p-3 text-center tracking-widest focus:outline-none focus:border-cyan-500 transition-colors"
                style={{ borderColor: passcodeError ? "#ef4444" : undefined }}
              />
              <button 
                onClick={handleUnlockSubmit} 
                className="bg-white text-black py-2 text-xs tracking-[0.2em] uppercase font-bold hover:bg-gray-200 transition"
              >
                Execute
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}