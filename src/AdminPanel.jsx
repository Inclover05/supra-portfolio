import React, { useState, useEffect } from 'react';
import { supabase } from './supabase'; 

export default function AdminPanel() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tweetText, setTweetText] = useState('');
  const [status, setStatus] = useState('');
  const [activeProjects, setActiveProjects] = useState([]);

  const SECRET_PASSCODE = 'alpha2026'; 

  useEffect(() => {
    if (isAuthenticated) fetchActiveProjects();
  }, [isAuthenticated]);

  const fetchActiveProjects = async () => {
    const { data } = await supabase.from('weekly_intelligence').select('*').order('created_at', { ascending: false });
    if (data) setActiveProjects(data);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === SECRET_PASSCODE) setIsAuthenticated(true);
    else setStatus('❌ Access Denied.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tweetText.trim()) return;
    setStatus('⚡ Encrypting and pushing to staging vault...');
    const { error } = await supabase.from('raw_tweets').insert([{ content: tweetText }]);
    if (error) setStatus('❌ FAILED: Database rejected the payload.');
    else {
      setStatus('✅ SUCCESS: Alpha secured in the vault.');
      setTweetText(''); 
    }
  };

  const handleDelete = async (id, name) => {
    if(!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    const { error } = await supabase.from('weekly_intelligence').delete().eq('id', id);
    if (!error) fetchActiveProjects(); // Refresh the list
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-[#020817]/80 text-cyan-500 font-space border border-cyan-500/50 rounded-xl w-full max-w-md mx-auto mt-10 mb-10 shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-md">
        <h2 className="text-xl mb-4 tracking-widest uppercase text-center font-bold">System Access Required</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="password" placeholder="Enter Override Code..." 
            className="p-3 bg-black/50 border border-cyan-500/30 text-cyan-300 focus:outline-none focus:border-cyan-400 rounded transition-colors text-center tracking-widest"
            value={passcode} onChange={(e) => setPasscode(e.target.value)}
          />
          <button type="submit" className="bg-cyan-600/20 border border-cyan-500 text-cyan-400 font-bold py-3 hover:bg-cyan-500 hover:text-black transition-all duration-300 rounded uppercase tracking-widest">
            Unlock Terminal
          </button>
        </form>
        {status && <p className="mt-4 text-red-400 text-center text-sm">{status}</p>}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-[#020817]/90 text-blue-400 font-space border border-cyan-500/40 rounded-xl w-full max-w-4xl mx-auto mt-10 mb-10 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* INJECTION VAULT */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white font-syne tracking-tight">COMMAND CENTER</h2>
            <p className="text-xs text-cyan-500/70 tracking-[0.2em] uppercase mt-1">Staging Vault Protocol</p>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <textarea 
            rows="5" placeholder="Paste raw text here..." 
            className="p-4 bg-black/60 border border-cyan-900 text-cyan-50 focus:outline-none focus:border-cyan-500 rounded resize-none transition-colors font-mono text-sm leading-relaxed"
            value={tweetText} onChange={(e) => setTweetText(e.target.value)}
          />
          <button type="submit" className="bg-cyan-600 border border-cyan-400 text-black font-bold py-3 hover:bg-cyan-500 transition-all duration-300 rounded uppercase tracking-[0.2em] text-sm">
            Deploy to Vault
          </button>
        </form>
        {status && <p className="mt-5 text-cyan-300 text-sm tracking-wide text-center">{status}</p>}
      </div>

      {/* GRID MANAGER */}
      <div className="border-l border-cyan-900/50 pl-0 md:pl-8">
        <h2 className="text-xl font-bold text-white font-syne mb-1">GRID MANAGER</h2>
        <p className="text-xs text-red-400/70 tracking-[0.2em] uppercase mb-4">Surgical Deletion Active</p>
        
        <div className="h-64 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          {activeProjects.map(p => (
            <div key={p.id} className="flex justify-between items-center p-3 bg-black/40 border border-cyan-900/30 rounded">
              <div>
                <span className="text-white font-bold text-sm block">{p.project_name}</span>
                <span className="text-cyan-600 text-[10px] uppercase tracking-wider">{p.card_type}</span>
              </div>
              <button onClick={() => handleDelete(p.id, p.project_name)} className="text-red-500 hover:text-red-400 font-bold p-2 bg-red-950/30 hover:bg-red-900/50 rounded transition">
                [X]
              </button>
            </div>
          ))}
          {activeProjects.length === 0 && <p className="text-gray-600 text-sm">Grid is empty.</p>}
        </div>
      </div>

    </div>
  );
}