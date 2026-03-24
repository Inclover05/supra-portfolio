import AdminDashboard from './AdminDashboard';
import AdminPanel from './AdminPanel'; 
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Send, Zap, Loader2, Database as DbIcon, PowerOff, Search, Users } from 'lucide-react';
import Hero3D from './Hero3D';
import { supabase } from './Supabase'; 

/* --- SECURE DATA INJECTION: SPREADSHEET EXTRACT --- */
const DISCORD_COMMUNITIES = [
  { name: "NFT HUB", members: "85,549", link: "https://x.com/NFTSHUB_" },
  { name: "Y+U", members: "1,232", link: "https://twitter.com/yplusu_" },
  { name: "Dinero", members: "1,074", link: "https://twitter.com/Dineroxyz" },
  { name: "Alpha Empire", members: "18,571", link: "https://x.com/AlphaEmpire__" },
  { name: "VYBZ", members: "604", link: "https://x.com/Vybz_Gr" },
  { name: "EKO", members: "1,276", link: "https://x.com/EkoWeb3" },
  { name: "JIGEN LABS", members: "18,187", link: "https://x.com/JigenLabs" },
  { name: "NFTFriendsAlpha", members: "2,089", link: "https://twitter.com/NFTFRIENDSALPHA" },
  { name: "DFAM", members: "11,674", link: "https://twitter.com/dfam_alpha" },
  { name: "Whale3", members: "145,486", link: "https://twitter.com/WhaleWeb3_" },
  { name: "HexagonFi", members: "9,797", link: "https://twitter.com/Hexagonfi" },
  { name: "Bolt Radar", members: "2,077", link: "https://twitter.com/BoltRadar" },
  { name: "ElixirHQ", members: "222", link: "https://x.com/thegreatola" },
  { name: "Whispers", members: "864", link: "https://x.com/Whispers_Web3" },
  { name: "GrindHub", members: "918", link: "https://x.com/grind_hub" },
  { name: "legacy Web3", members: "3,142", link: "https://x.com/LegacyWeb3io" },
  { name: "Lumex", members: "35,540", link: "https://twitter.com/web3lumex" },
  { name: "Raiders Lab", members: "88,950", link: "https://twitter.com/RaidersLab" },
  { name: "WGBA cult", members: "2,769", link: "https://x.com/WGBAcult" },
  { name: "TropaDaDrih", members: "55,326", link: "https://twitter.com/TropadaDrih" },
  { name: "TNC Alpha", members: "44,475", link: "https://twitter.com/TNC_Alpha" },
  { name: "HoneyRat DAO", members: "49,640", link: "https://x.com/HoneyRatDAO" },
  { name: "Rune Guardian", members: "9,719", link: "https://twitter.com/runeguardians" },
  { name: "Orbyt", members: "2,337", link: "https://x.com/Orbyt_off" },
  { name: "Quantum", members: "1,867", link: "https://x.com/quantumcircle_" },
  { name: "Colorful rebels", members: "435", link: "https://twitter.com/colorfulrebels" },
  { name: "Meraki", members: "5,188", link: "https://x.com/Meraki_Web3" },
  { name: "Uejicom", members: "120,000", link: "https://twitter.com/uejjcom" },
  { name: "Milkshake Labs", members: "7,724", link: "https://x.com/MSLabs_" },
  { name: "The origin", members: "150", link: "https://x.com/0xSumitt" },
  { name: "The Pioneer", members: "608", link: "https://x.com/The_PioneerX" },
  { name: "world of Alpha", members: "2,892", link: "https://twitter.com/worldofalpha" },
  { name: "Jer'sNFT World", members: "30,511", link: "https://x.com/Jer_NFTworld" },
  { name: "Virtu Nook", members: "2,293", link: "https://twitter.com/VirtuNook" },
  { name: "Extraordinals", members: "25,079", link: "https://twitter.com/ExtraordinalBTC" },
  { name: "Royale Web3", members: "68,603", link: "https://twitter.com/RoyaleWeb3" },
  { name: "The Chill Room", members: "282", link: "https://x.com/thechillsroom" },
  { name: "Surge Alpha", members: "6,212", link: "https://twitter.com/surge_alphaa" },
  { name: "Royal Kingdom", members: "10,750", link: "https://twitter.com/rahul19_rahul" },
  { name: "Encore Web3", members: "800", link: "https://twitter.com/EncoreWeb3" },
  { name: "BOREAU", members: "10,000", link: "https://x.com/Web3Boreau" },
  { name: "Hunter Alpha", members: "28,000", link: "https://x.com/TheHuntersAlpha" },
  { name: "Aliv3Labs", members: "3,371", link: "https://x.com/Aliv3Labs" },
  { name: "Mintify", members: "34,153", link: "https://x.com/Mintify" },
  { name: "NiggasWithAlpha", members: "3,459", link: "https://x.com/NiggasWithAlpha" },
  { name: "Saudi", members: "80,556", link: "https://twitter.com/TheSaudisNFT" },
  { name: "habibi", members: "17,173", link: "https://twitter.com/habibialphaxyz" },
  { name: "Syndicate", members: "39,322", link: "https://twitter.com/syndicate_hub" },
  { name: "next-gen", members: "400", link: "https://x.com/nextgen696" },
  { name: "Legacy Circle", members: "865", link: "https://x.com/LegacyCircle_" },
  { name: "Zentrix Alpha", members: "122", link: "https://x.com/ZentrixAlpha" },
  { name: "Elite Alpha", members: "2,347", link: "https://x.com/elitealphaxyz" },
  { name: "W3AB", members: "22,513", link: "https://twitter.com/W3AB_" },
  { name: "Exos.Lab", members: "1,674", link: "https://x.com/exoslab" },
  { name: "Alpha Aplus", members: "200", link: "https://twitter.com/alphaAplus" },
  { name: "Cobra's Core", members: "2,567", link: "https://x.com/0xCobra_" },
  { name: "The Valley", members: "400", link: "https://x.com/The_Valley__" },
  { name: "The Core", members: "2,003", link: "https://twitter.com/corenesthq" },
  { name: "northbound", members: "4,000", link: "https://x.com/NorthBoundNFT" },
  { name: "TheBoysalpha", members: "20,000", link: "https://x.com/TheB0ysLabs" },
  { name: "EgoDao", members: "150", link: "https://x.com/0x_egodao" },
  { name: "Haven Alpha", members: "65", link: "https://x.com/HavenAlpha" },
  { name: "bruhslabs", members: "200", link: "https://x.com/bruhslabs" },
  { name: "Mortal CK", members: "7,212", link: "https://x.com/MortalCK" }
];

/* --- COMPONENT: CONTACT BAR --- */
const ContactBar = () => (
  <motion.div 
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 2, duration: 1 }}
    className="fixed bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-max max-w-[95vw] pointer-events-auto"
  >
    <div className="flex items-center gap-3 md:gap-5 px-5 md:px-8 py-3 md:py-4 bg-[#020817] border-2 border-cyan-400 rounded-full shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:shadow-[0_0_60px_rgba(34,211,238,0.7)] transition-all duration-300 hover:-translate-y-1">
      <a 
        href="https://x.com/supraEVM"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <X size={20} className="text-white group-hover:text-cyan-300 transition-colors md:w-6 md:h-6" />
      </a>
      <a 
        href="https://t.me/supraEVM"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center transition-all duration-300 hover:scale-110"
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

/* --- INTRO SCREEN (HEAVY RAIN UPGRADE) --- */
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

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId); 
    };
  }, []);

  return (
    <motion.div
      key="intro"
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#02040a]"
    >
      <div className="absolute inset-0 w-full h-full z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('/samurai.jpg')", filter: 'blur(50px) brightness(0.3)', transform: 'scale(1.1)' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-cyan-950/80 to-blue-950/90 mix-blend-soft-light" />
      </div>
      
      <div className="absolute inset-0 z-10 flex justify-end pointer-events-none">
        <motion.img 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/samurai.jpg" 
          alt="Storm Warrior" 
          className="h-full w-auto object-cover md:w-[65vw] relative"
          style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 60%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 60%)', filter: 'contrast(1.2) brightness(1.1) saturate(0.9)' }}
        />
      </div>
      
      <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none mix-blend-screen" />
      
      <div className="relative z-40 text-center p-4 w-full max-w-[95vw]">
        <div className="relative inline-block">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9, y: 15 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-5xl md:text-[8vw] font-black uppercase tracking-tight text-transparent bg-clip-text select-none relative z-10 leading-[0.9]"
            style={{ 
              fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif', 
              backgroundImage: `linear-gradient(90deg, rgba(6, 182, 212, 0.4), rgba(59, 130, 246, 0.5), rgba(147, 51, 234, 0.3), rgba(6, 182, 212, 0.4)), url('https://images.unsplash.com/photo-1594750017192-3e284a0d9e29?q=80&w=2940&auto=format&fit=crop')`, 
              backgroundSize: '200% 100%, 120%', 
              backgroundPosition: 'center', 
              backgroundBlendMode: 'overlay, normal', 
              animation: 'liquid-storm-flow 8s linear infinite', 
              WebkitTextStroke: '2px rgba(165, 243, 252, 0.5)', 
              filter: `brightness(1.5) contrast(1.2) saturate(1.4) drop-shadow(0 0 15px rgba(6, 182, 212, 0.6)) drop-shadow(0 0 40px rgba(59, 130, 246, 0.4))` 
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

/* --- MASTER APP --- */
export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [protocols, setProtocols] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { isAdminMounted, isUnlocked, attemptUnlock, dismount } = useAdminGate();
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const isArchitect = urlParams.get('access') === 'architect';

  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src = 'https://images.unsplash.com/photo-1594750017192-3e284a0d9e29?q=80&w=2940&auto=format&fit=crop';
  }, []);

  if (isArchitect) return <AdminDashboard />;

  const fetchWeeklyIntelligence = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_intelligence')
        .select('*');

      if (error) throw error;
      setProtocols(data || []);
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasEntered) fetchWeeklyIntelligence();
  }, [hasEntered]);

  const handleUnlockSubmit = () => {
    const success = attemptUnlock(passcodeInput);
    if (!success) {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 1500);
    }
  };

  const { highestFunded, otherProtocols, nfts } = useMemo(() => {
    const topFunding = protocols.filter(p => p.card_type === 'Top Funding');
    const nfts = protocols.filter(p => p.card_type === 'Early Alpha NFT');
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

    const otherProtocols = protocols.filter(p => p.id !== highestFunded?.id && p.card_type !== 'Early Alpha NFT');

    return { highestFunded, otherProtocols, nfts };
  }, [protocols]);

  // Dynamic filter for the Discord communities search bar
  const filteredCommunities = useMemo(() => {
    return DISCORD_COMMUNITIES.filter(community => 
      community.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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

      <AnimatePresence>
        {!hasEntered && <IntroScreen onEnter={() => setHasEntered(true)} />}
      </AnimatePresence>
      
      {hasEntered && (
        <div className="fixed inset-0 z-0 pointer-events-auto">
          <Hero3D />
        </div>
      )}
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: hasEntered ? 1 : 0 }} 
        transition={{ duration: 1.5, delay: 0.5 }} 
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

        <section className="px-6 md:px-12 pb-32 pt-10 md:pt-20 bg-gradient-to-b from-transparent via-[#02040a]/90 to-[#02040a] pointer-events-auto backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-10">
               <h2 className="text-[10px] md:text-sm font-space text-gray-500 mb-8 md:mb-12 tracking-[0.2em] uppercase border-b border-white/20 pb-4 flex justify-between items-center">
                 <span>// Weekly Intelligence [Resets Sunday 12AM UTC]</span>
                 {isLoading && <Loader2 className="animate-spin text-cyan-500" size={16} />}
               </h2>
               
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

               {!isLoading && protocols.length > 0 && (
                 <>
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

                   {nfts.length > 0 && (
                     <div className="mt-16">
                       <h2 className="text-[10px] md:text-sm font-space text-purple-400 mb-8 tracking-[0.2em] uppercase border-b border-purple-900/50 pb-4">
                         // Early Alpha NFTs
                       </h2>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {nfts.map((nft) => (
                           <div key={nft.id} className="p-6 bg-purple-950/10 border border-purple-500/20 rounded-xl hover:border-purple-500/50 transition-all cursor-pointer group hover:-translate-y-1">
                             <div className="flex justify-between items-start mb-4">
                               <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded text-purple-400 font-space text-[10px] tracking-wider uppercase">
                                 DIGITAL ASSET
                               </div>
                               <ArrowUpRight className="text-gray-600 group-hover:text-white transition-colors" size={20} />
                             </div>
                             <h3 className="text-2xl font-syne font-bold mb-1 text-white">{nft.project_name}</h3>
                             <p className="text-gray-400 text-sm mb-6 font-space">{nft.description}</p>
                             <div className="text-3xl font-light font-space text-white">
                               {nft.metric_value} <span className="text-xs text-gray-500 font-space align-middle ml-2">{nft.metric_label}</span>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                 </>
               )}

               {!isLoading && protocols.length === 0 && (
                 <div className="col-span-1 md:col-span-3 p-12 bg-[#020817]/80 border border-cyan-500/30 rounded-xl flex flex-col justify-center items-center text-center">
                   <DbIcon className="text-cyan-500/50 mb-4" size={32} />
                   <h3 className="text-xl font-syne font-bold text-white mb-2">Awaiting Intelligence</h3>
                   <p className="text-sm font-space text-gray-400">The Architect has not pushed any new protocols to the chain this week.</p>
                 </div>
               )}
            </div>
          </div>
        </section>

        <ContactBar />
        
        {/* DESIGN UPGRADE: Glassmorphic Glowing Cyber-Pill */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDossierOpen(true)}
          className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-40 bg-black/60 backdrop-blur-md border border-cyan-500/50 text-cyan-400 px-6 py-3.5 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2),inset_0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4),inset_0_0_20px_rgba(6,182,212,0.2)] hover:border-cyan-300 hover:bg-cyan-950/40 transition-all duration-300 pointer-events-auto flex items-center justify-center gap-3 group"
          title="View My Communities"
        >
          <Users size={20} className="group-hover:text-white transition-colors" />
          <span className="font-space font-bold text-xs md:text-sm tracking-[0.2em] uppercase mt-0.5 group-hover:text-white transition-colors">
            My Communities
          </span>
        </motion.button>

      </motion.div>

      {/* --- THE COMMUNITIES MODAL --- */}
      <AnimatePresence>
        {isDossierOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDossierOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()} 
              initial={{ scale: 0.5, y: 200, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.5, y: 200, opacity: 0 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="bg-[#020817]/95 border-2 border-cyan-500/50 rounded-2xl w-full max-w-3xl h-[75vh] flex flex-col shadow-[0_0_60px_rgba(6,182,212,0.3)] relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-cyan-900/50 bg-black/40">
                <div>
                  <h2 className="text-2xl font-syne font-bold text-white tracking-wide">My Communities</h2>
                  <p className="text-xs font-space text-cyan-500 tracking-[0.2em] uppercase mt-1">Alpha & Early Projects</p>
                </div>
                <button 
                  onClick={() => setIsDossierOpen(false)}
                  className="text-gray-400 hover:text-cyan-400 transition-colors p-2"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Data Content */}
              <div className="flex-1 overflow-hidden flex flex-col p-6 md:p-8">
                
                {/* Intro Copy */}
                <p className="text-gray-400 font-space text-sm mb-6 leading-relaxed">
                  Here are all the Discord communities I am active in. This is where I post my alpha calls and highlight new, early-stage projects.
                </p>

                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-500/50" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search communities by name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border border-cyan-900/50 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-cyan-400/50 transition-colors font-space text-sm"
                  />
                </div>

                {/* Staggered Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {filteredCommunities.map((community, i) => (
                      <motion.a 
                        key={i}
                        href={community.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-cyan-950/10 border border-cyan-900/40 p-4 rounded-xl flex items-center justify-between group hover:border-cyan-400/50 hover:bg-cyan-900/20 transition-all"
                      >
                        <div>
                          <h4 className="text-white font-syne font-bold text-lg group-hover:text-cyan-300 transition-colors">
                            {community.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                            <Users size={12} className="text-cyan-500/70" />
                            <span className="font-space text-xs tracking-wider">{community.members} Members</span>
                          </div>
                        </div>
                        <div className="bg-black/40 p-2 rounded-full text-cyan-500/50 group-hover:text-cyan-400 group-hover:bg-cyan-400/10 transition-colors">
                          <ArrowUpRight size={18} />
                        </div>
                      </motion.a>
                    ))}
                    
                    {filteredCommunities.length === 0 && (
                      <div className="col-span-1 md:col-span-2 text-center py-10 text-gray-500 font-space text-sm">
                        No communities found matching "{searchTerm}"
                      </div>
                    )}
                  </motion.div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* --- ADMIN TERMINAL --- */}
      {hasEntered && isAdminMounted && isUnlocked && (
        <section className="relative px-6 md:px-12 pb-40 pt-10 bg-gradient-to-b from-[#02040a] to-[#010205] pointer-events-auto z-50 border-t border-cyan-900">
          <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
            <h2 className="text-cyan-500 font-space tracking-widest uppercase text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              Secure Session Active
            </h2>
            <button 
              onClick={dismount} 
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition font-space text-xs tracking-widest uppercase border border-red-500/30 px-4 py-2 rounded bg-red-950/20 hover:bg-red-900/40"
            >
              <PowerOff size={14} /> Close Terminal
            </button>
          </div>
          <div className="max-w-4xl mx-auto">
            <AdminPanel onGridUpdate={fetchWeeklyIntelligence} />
          </div>
        </section>
      )}

    </div>
  );
}