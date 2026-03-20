import AdminDashboard from './AdminDashboard';
import AdminPanel from './AdminPanel'; 
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Send, Zap, Loader2, Database as DbIcon } from 'lucide-react';
import Hero3D from './Hero3D';
import { supabase } from './supabase'; 

/* --- FONTS & ANIMATIONS --- */
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&family=Syne:wght@600;800&display=swap');

  @keyframes liquid-storm-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .font-syne { font-family: 'Syne', sans-serif; }
  .font-space { font-family: 'Space Grotesk', sans-serif; }
`;
document.head.appendChild(styleSheet);

/* --- COMPONENT: CONTACT BAR --- */
const ContactBar = () => (
  <motion.div 
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 2, duration: 1 }}
    className="fixed bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-max max-w-[95vw] pointer-events-auto"
  >
    <div className="flex items-center gap-3 md:gap-5 px-5 md:px-8 py-3 md:py-4 bg-[#020817] border-2 border-cyan-400 rounded-full shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:shadow-[0_0_60px_rgba(34,211,238,0.7)] transition-all duration-300 hover:-translate-y-1">
      <a 
        href="https://x.com/supraEVM"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="X (Twitter)"
      >
        <X size={20} className="text-white group-hover:text-cyan-300 transition-colors md:w-6 md:h-6" />
      </a>
      <a 
        href="https://t.me/supraEVM"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center transition-all duration-300 hover:scale-110"
        title="Telegram"
      >
        <Send size={20} className="text-[#229ED9] group-hover:text-cyan-300 transition-colors -ml-0.5 mt-0.5 md:w-6 md:h-6" />
      </a>
      <div className="w-px h-6 md:h-8 bg-cyan-400/50 mx-1 md:mx-2" />
      <span className="text-xs md:text-sm font-bold font-space uppercase tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
        Contact Supra
      </span>
    </div>
  </motion.div>
);

/* --- COMPONENT: ABOUT SECTION --- */
const AboutSection = () => (
  <section className="relative py-20 md:py-32 px-6 md:px-12 max-w-5xl mx-auto pointer-events-auto">
    <div className="relative z-10 flex flex-col items-start">
      <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
        <div className="relative">
          <img 
            src="/profile.jpg" 
            alt="Supra Profile" 
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-cyan-400/40 shadow-[0_0_25px_rgba(6,182,212,0.3)]"
          />
          <div className="absolute bottom-1 right-1 w-4 h-4 md:w-5 md:h-5 bg-green-500 border-[2px] md:border-[3px] border-[#02040a] rounded-full"></div>
        </div>
        <div>
          <h2 className="text-xs md:text-sm font-space text-cyan-500 tracking-[0.3em] uppercase font-semibold">The Architect</h2>
          <div className="text-[9px] md:text-[10px] font-space text-gray-500 tracking-widest mt-1 uppercase">System Admin // Online</div>
        </div>
      </div>

      <h3 className="text-4xl md:text-6xl font-syne font-extrabold text-white mb-6 md:mb-8 leading-[1.1] tracking-tight">
        Decoding the Signal <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          From the Noise.
        </span>
      </h3>
      
      <div className="space-y-4 md:space-y-6 text-gray-400 leading-relaxed max-w-2xl font-space text-sm md:text-lg">
        <p>
          I am <span className="text-white font-bold">Supra</span>. A researcher, early-market strategist, and on-chain analyst focused on high-asymmetry opportunities.
        </p>
        <p>
          My work sits at the exact intersection of deep data analysis, early-stage project discovery, and community distribution. Beyond sharing insights, I serve as a strategic bridge connecting emerging protocols with the agents, infrastructure, and key services they need to scale.
        </p>
        <p className="text-cyan-300 italic font-semibold pt-2">
          I don't just discover projects before the market does; I accelerate their journey.
        </p>
      </div>
      
      <div className="mt-8 md:mt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-cyan-950/40 border border-cyan-500/30 rounded-full text-xs md:text-sm font-space text-cyan-200/90 shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-default">
          <Zap size={14} className="text-cyan-400 md:w-4 md:h-4" />
          Web3 On-Chain Analysis
        </div>
      </div>
    </div>
  </section>
);

/* --- INTRO SCREEN --- */
const IntroScreen = ({ onEnter }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let raindrops = [];
    let lensDrops = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createLensDrops();
    };

    const createLensDrops = () => {
      lensDrops = [];
      for (let i = 0; i < 40; i++) {
        lensDrops.push({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 2 + 1, opacity: Math.random() * 0.2 + 0.1 });
      }
    };

    const createRain = () => {
      for (let i = 0; i < 5; i++) {
        raindrops.push({ x: Math.random() * width, y: -50, length: Math.random() * 30 + 20, speed: Math.random() * 20 + 25, opacity: Math.random() * 0.3 + 0.1 });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      lensDrops.forEach(drop => { ctx.beginPath(); ctx.arc(drop.x, drop.y, drop.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(165, 243, 252, ${drop.opacity})`; ctx.fill(); });
      ctx.strokeStyle = 'rgba(196, 239, 255, 0.3)'; ctx.lineWidth = 1;
      createRain();
      raindrops.forEach((drop, index) => { drop.y += drop.speed; ctx.beginPath(); ctx.moveTo(drop.x, drop.y); ctx.lineTo(drop.x, drop.y + drop.length); ctx.stroke(); if (drop.y > height) raindrops.splice(index, 1); });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <motion.div
      key="intro"
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#02040a]"
    >
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/samurai.jpg')", filter: 'blur(50px) brightness(0.3)', transform: 'scale(1.1)' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-cyan-950/80 to-blue-950/90 mix-blend-soft-light" />
      </div>
      <div className="absolute inset-0 z-10 flex justify-end pointer-events-none">
        <motion.img 
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.5, ease: "easeOut" }}
          src="/samurai.jpg" alt="Storm Warrior" className="h-full w-auto object-cover md:w-[65vw] relative"
          style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 60%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 60%)', filter: 'contrast(1.2) brightness(1.1) saturate(0.9)' }}
        />
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none mix-blend-screen" />
      <div className="relative z-40 text-center p-4 w-full max-w-[95vw]">
        <div className="relative inline-block">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-5xl md:text-[8vw] font-black uppercase tracking-tight text-transparent bg-clip-text select-none relative z-10 leading-[0.9]"
            style={{ fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif', backgroundImage: `linear-gradient(90deg, rgba(6, 182, 212, 0.4), rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.3), rgba(6, 182, 212, 0.4)), url('https://images.unsplash.com/photo-1594750017192-3e284a0d9e29?q=80&w=2940&auto=format&fit=crop')`, backgroundSize: '200% 100%, 120%', backgroundPosition: 'center', backgroundBlendMode: 'overlay, normal', animation: 'liquid-storm-flow 8s linear infinite', WebkitTextStroke: '2px rgba(165, 243, 252, 0.5)', filter: `brightness(1.5) contrast(1.2) saturate(1.4) drop-shadow(0 0 15px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.4))` }}
          >
            Supra's<br className="md:hidden" />&nbsp;Coven
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8 text-cyan-100/70 font-space text-[10px] md:text-xs tracking-[0.6em] uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
            The Storm Terminal
          </motion.p>
        </div>
        <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1, ease: "easeOut" }} onClick={onEnter} className="block mx-auto mt-12 md:mt-16 px-10 md:px-12 py-3 md:py-4 border border-cyan-400/30 text-cyan-50 hover:text-white hover:bg-cyan-400/10 hover:border-cyan-200 transition-all duration-500 font-space text-xs tracking-[0.3em] uppercase cursor-pointer backdrop-blur-md pointer-events-auto shadow-[0_0_30px_rgba(6,182,212,0.2)] rounded-full">
          Welcome
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [protocols, setProtocols] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const isArchitect = urlParams.get('access') === 'architect';

  if (isArchitect) {
    return <AdminDashboard />;
  }

  useEffect(() => {
    async function fetchWeeklyIntelligence() {
      try {
        const { data, error } = await supabase
          .from('weekly_intelligence')
          .select('*')
          .order('mention_date', { ascending: false });

        if (error) throw error;
        setProtocols(data || []);
      } catch (error) {
        console.error("Error fetching data from Supabase:", error.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (hasEntered) {
      fetchWeeklyIntelligence();
    }
  }, [hasEntered]);

  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-cyan-400 selection:text-black overflow-x-hidden">
      <AnimatePresence>
        {!hasEntered && <IntroScreen onEnter={() => setHasEntered(true)} />}
      </AnimatePresence>
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Hero3D />
      </div>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: hasEntered ? 1 : 0 }} transition={{ duration: 1.5, delay: 0.5 }}
        className="relative z-10 pointer-events-none"
      >
        <nav className="fixed top-0 w-full px-6 md:px-8 py-6 flex justify-between items-center mix-blend-difference pointer-events-auto z-20">
          <div className="font-syne font-bold tracking-[0.2em] text-sm uppercase text-white">Supra.</div>
        </nav>

        <section className="h-screen flex flex-col justify-end px-6 md:px-8 pb-20 md:pb-24">
          <h1 className="text-[14vw] md:text-[10vw] leading-[0.8] font-syne font-bold tracking-tighter text-white mix-blend-overlay opacity-90">
            THE <br /> ARCHITECT
          </h1>
        </section>

        <AboutSection />

        <section className="px-6 md:px-12 pb-16 pt-10 md:pt-20 bg-gradient-to-b from-transparent via-[#02040a]/90 to-[#02040a] pointer-events-auto backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-10">
               <h2 className="text-[10px] md:text-sm font-space text-gray-500 mb-8 md:mb-12 tracking-[0.2em] uppercase border-b border-white/20 pb-4 flex justify-between items-center">
                 <span>// Weekly Intelligence [Resets Sunday 12AM UTC]</span>
                 {isLoading && <Loader2 className="animate-spin text-cyan-500" size={16} />}
               </h2>
               
               {/* SKELETON LOADERS */}
               {isLoading && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-6 bg-[#020817]/50 border border-white/5 rounded-xl flex flex-col justify-center items-center h-48 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                     <Loader2 className="text-cyan-500/50 animate-spin mb-4" size={24} />
                     <span className="text-xs font-space text-gray-500 tracking-widest uppercase">Fetching DB</span>
                   </div>
                   <div className="p-6 bg-[#020817]/50 border border-white/5 rounded-xl hidden md:flex flex-col justify-center items-center h-48 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" style={{ animationDelay: '0.2s' }} />
                     <Loader2 className="text-purple-500/50 animate-spin mb-4" size={24} />
                   </div>
                   <div className="p-6 bg-[#020817]/50 border border-white/5 rounded-xl hidden md:flex flex-col justify-center items-center h-48 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" style={{ animationDelay: '0.4s' }} />
                     <Loader2 className="text-blue-500/50 animate-spin mb-4" size={24} />
                   </div>
                 </div>
               )}

               {/* DATA RENDERING LOGIC */}
               {!isLoading && protocols.length > 0 && (() => {
                 // Sort logic to find the highest funded project
                 const topFunding = protocols.filter(p => p.card_type === 'Top Funding');
                 let highestFunded = null;

                 if (topFunding.length > 0) {
                   highestFunded = [...topFunding].sort((a, b) => {
                     const valA = parseFloat(a.metric_value.replace(/[^0-9.]/g, '')) || 0;
                     const valB = parseFloat(b.metric_value.replace(/[^0-9.]/g, '')) || 0;
                     const multiA = a.metric_value.toUpperCase().includes('B') ? 1000 : a.metric_value.toUpperCase().includes('M') ? 1 : 0.001;
                     const multiB = b.metric_value.toUpperCase().includes('B') ? 1000 : b.metric_value.toUpperCase().includes('M') ? 1 : 0.001;
                     return (valB * multiB) - (valA * multiA);
                   })[0];
                 }

                 // Everything else goes in the normal grid
                 const otherProtocols = protocols.filter(p => p.id !== highestFunded?.id);

                 return (
                   <>
                     {/* SPOTLIGHT: HIGHEST FUNDING */}
                     {highestFunded && (
                       <div className="mb-8 p-8 bg-gradient-to-br from-cyan-950/40 to-blue-900/20 border border-cyan-400/50 rounded-xl shadow-[0_0_40px_rgba(6,182,212,0.1)] relative overflow-hidden group">
                         <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400"></div>
                         <div className="flex justify-between items-start mb-4">
                           <div className="p-2 bg-cyan-500/20 border border-cyan-400 rounded text-cyan-300 font-space text-xs tracking-widest uppercase font-bold">
                             🏆 APEX FUNDING
                           </div>
                         </div>
                         <h3 className="text-4xl md:text-5xl font-syne font-bold mb-3 text-white">{highestFunded.project_name}</h3>
                         <p className="text-gray-300 text-lg mb-6 font-space max-w-3xl">{highestFunded.description}</p>
                         <div className="text-5xl font-bold font-space text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                           {highestFunded.metric_value} <span className="text-sm text-gray-400 font-space align-middle ml-2 tracking-widest uppercase">{highestFunded.metric_label}</span>
                         </div>
                       </div>
                     )}

                     {/* THE REST OF THE GRID */}
                     {otherProtocols.length > 0 && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {otherProtocols.map((protocol) => (
                           <div key={protocol.id} className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-all cursor-pointer group hover:-translate-y-1">
                             <div className="flex justify-between items-start mb-4">
                               <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-400 font-space text-[10px] tracking-wider uppercase">
                                 {protocol.card_type}
                               </div>
                               <ArrowUpRight className="text-gray-600 group-hover:text-white transition-colors" size={20} />
                             </div>
                             <h3 className="text-2xl font-syne font-bold mb-1 text-white">{protocol.project_name}</h3>
                             <p className="text-gray-400 text-sm mb-6 font-space">{protocol.description}</p>
                             <div className="text-3xl font-light font-space text-white">
                               {protocol.metric_value} <span className="text-xs text-gray-500 font-space align-middle ml-2">{protocol.metric_label}</span>
                             </div>
                           </div>
                         ))}
                       </div>
                     )}
                   </>
                 );
               })()}

               {/* EMPTY STATE */}
               {!isLoading && protocols.length === 0 && (
                 <div className="col-span-1 md:col-span-3 p-12 bg-[#020817]/80 border border-cyan-500/30 rounded-xl flex flex-col justify-center items-center text-center">
                   <DbIcon className="text-cyan-500/50 mb-4" size={32} />
                   <h3 className="text-xl font-syne font-bold text-white mb-2">Awaiting Intelligence</h3>
                   <p className="text-sm font-space text-gray-400">The Architect has not pushed any new protocols to the chain this week.</p>
                 </div>
               )}

               <style dangerouslySetInnerHTML={{__html: `
                 @keyframes shimmer { 100% { transform: translateX(100%); } }
               `}} />
            </div>

          </div>
        </section>

        {/* --- INJECTED: THE SECURE COMMAND TERMINAL --- */}
        <section className="relative px-6 md:px-12 pb-40 bg-gradient-to-b from-[#02040a] to-[#010205] pointer-events-auto z-20">
          <div className="max-w-4xl mx-auto">
            <AdminPanel />
          </div>
        </section>
        
        <ContactBar />
        
      </motion.div>
    </div>
  );
}