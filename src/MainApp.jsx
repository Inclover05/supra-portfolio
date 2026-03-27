// src/MainApp.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, Send, Zap, Loader2, Database as DbIcon, PowerOff, Search, Users } from 'lucide-react';
import { supabase } from './Supabase'; 
import AdminPanel from './AdminPanel';
import AdminDashboard from './AdminDashboard';
import Hero3D from './Hero3D';

/* --- SECURE DATA INJECTION --- */
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
  // ARCHITECT FIX: Use flexbox centering instead of translate-x for perfect alignment
  <div className="fixed bottom-6 md:bottom-10 inset-x-0 z-[60] pointer-events-none flex justify-center">
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="pointer-events-auto w-[max-content] max-w-[95vw]"
    >
      <div className="flex items-center gap-2 md:gap-5 px-4 py-3 md:px-8 md:py-4 bg-[#020817]/90 backdrop-blur-md border-2 border-cyan-400 rounded-full shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:shadow-[0_0_60px_rgba(34,211,238,0.7)] transition-all duration-300 hover:-translate-y-1">
        <a href="https://x.com/supraEVM" target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center transition-all duration-300 hover:scale-110">
          <X size={18} className="text-white group-hover:text-cyan-300 transition-colors md:w-6 md:h-6" />
        </a>
        <a href="https://t.me/supraEVM" target="_blank" rel="noopener noreferrer" className="group relative flex items-center justify-center transition-all duration-300 hover:scale-110">
          <Send size={18} className="text-[#229ED9] group-hover:text-cyan-300 transition-colors -ml-0.5 mt-0.5 md:w-6 md:h-6" />
        </a>
        <div className="w-px h-5 md:h-8 bg-cyan-400/50 mx-1 md:mx-2" />
        <span className="text-[10px] md:text-sm font-bold font-space uppercase tracking-[0.2em] text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] whitespace-nowrap">
          Contact Supra
        </span>
      </div>
    </motion.div>
  </div>
);

/* --- COMPONENT: ABOUT SECTION --- */
const AboutSection = () => (
  <section className="relative py-20 md:py-32 px-6 md:px-12 max-w-5xl mx-auto pointer-events-auto">
    <div className="relative z-10 flex flex-col items-start">
      <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
        <div className="relative">
          <img src="/profile.jpg" alt="Supra Profile" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-cyan-400/40 shadow-[0_0_25px_rgba(6,182,212,0.3)]" />
          <div className="absolute bottom-1 right-1 w-4 h-4 md:w-5 md:h-5 bg-green-500 border-[2px] md:border-[3px] border-[#02040a] rounded-full"></div>
        </div>
        <div>
          <h2 className="text-xs md:text-sm font-space text-cyan-500 tracking-[0.3em] uppercase font-semibold">The Architect</h2>
          <div className="text-[9px] md:text-[10px] font-space text-gray-500 tracking-widest mt-1 uppercase">System Admin // Online</div>
        </div>
      </div>
      <h3 className="mt-8 text-4xl md:text-6xl font-syne font-extrabold text-white mb-6 md:mb-8 leading-[1.1] tracking-tight">
        Decoding the Signal <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">From the Noise.</span>
      </h3>
      <div className="space-y-4 md:space-y-6 text-gray-400 leading-relaxed max-w-2xl font-space text-sm md:text-lg">
        <p>I am <span className="text-white font-bold">Supra</span>. A researcher, early-market strategist, and on-chain analyst focused on high-asymmetry opportunities.</p>
        <p>My work sits at the exact intersection of deep data analysis, early-stage project discovery, and community distribution. Beyond sharing insights, I serve as a strategic bridge connecting emerging protocols with the agents, infrastructure, and key services they need to scale.</p>
        <p className="text-cyan-300 italic font-semibold pt-2">I don't just discover projects before the market does; I accelerate their journey.</p>
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

export default function MainApp({ isAdminMounted, isUnlocked, dismount }) {
  const [protocols, setProtocols] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchWeeklyIntelligence = async () => {
    if (!supabase) {
      console.error("Supabase client is not available.");
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.from('weekly_intelligence').select('*');
      if (error) throw error;
      setProtocols(data || []);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setProtocols([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyIntelligence();
  }, []);

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

  const filteredCommunities = useMemo(() => {
    return DISCORD_COMMUNITIES.filter(community => 
      community.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Hero3D />
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1.5 }} 
        className="relative z-10 pointer-events-none"
      >
        <nav className="fixed top-0 w-full px-6 md:px-8 py-6 flex justify-between items-center mix-blend-difference pointer-events-auto z-20">
          <div className="font-syne font-bold tracking-[0.2em] text-sm uppercase text-white">Supra.</div>
        </nav>

        <section className="h-screen flex flex-col justify-end px-6 md:px-8 pb-20 md:pb-24">
          {/* ARCHITECT FIX: Reduced text size on mobile to prevent overflow */}
          <h1 className="text-[17vw] md:text-[10vw] leading-[0.8] font-syne font-bold tracking-tighter text-white mix-blend-overlay opacity-90 break-words">
            THE <br /> ARCHITECT
          </h1>
        </section>

        <AboutSection />

        <section className="px-6 md:px-12 pb-[35vh] pt-10 md:pt-20 bg-gradient-to-b from-transparent via-[#02040a]/90 to-[#02040a] pointer-events-auto backdrop-blur-sm">
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
        
        {/* ARCHITECT FIX: Positioned slightly higher on mobile so it doesn't crowd the Contact Bar */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDossierOpen(true)}
          className="fixed bottom-28 right-4 md:bottom-8 md:right-8 z-50 bg-black/60 backdrop-blur-md border border-cyan-500/50 text-cyan-400 px-4 py-3 md:px-8 md:py-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.2),inset_0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4),inset_0_0_20px_rgba(6,182,212,0.2)] hover:border-cyan-300 hover:bg-cyan-950/40 transition-all duration-300 pointer-events-auto flex items-center justify-center gap-2 md:gap-3 group"
          title="View My Communities"
        >
          <Users size={16} className="group-hover:text-white transition-colors" />
          <span className="font-space font-bold text-[10px] md:text-sm tracking-[0.2em] uppercase mt-0.5 group-hover:text-white transition-colors">
            My Communities
          </span>
        </motion.button>

      </motion.div>

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
              <div className="flex justify-between items-center p-6 border-b border-cyan-900/50 bg-black/40">
                <div>
                  <h2 className="text-2xl font-syne font-bold text-white tracking-wide">My Communities</h2>
                  <p className="text-xs font-space text-cyan-500 tracking-[0.2em] uppercase mt-1">Alpha & Early Projects</p>
                </div>
                <button onClick={() => setIsDossierOpen(false)} className="text-gray-400 hover:text-cyan-400 transition-colors p-2">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col p-6 md:p-8">
                <p className="text-gray-400 font-space text-sm mb-6 leading-relaxed">
                  Here are all the Discord communities I am active in. This is where I post my alpha calls and highlight new, early-stage projects.
                </p>
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
                          <h4 className="text-white font-syne font-bold text-lg group-hover:text-cyan-300 transition-colors">{community.name}</h4>
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

      {isAdminMounted && isUnlocked && (
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
    </>
  );
}