import React, { useState, useEffect } from 'react';
import { supabase } from './Supabase'; 
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPanel({ onGridUpdate }) {
  const [tweetText, setTweetText] = useState('');
  const [status, setStatus] = useState('');
  const [activeProjects, setActiveProjects] = useState([]);
  
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [purgeError, setPurgeError] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchActiveProjects();
  }, []);

  const fetchActiveProjects = async () => {
    const { data, error } = await supabase
      .from('weekly_intelligence')
      .select('*');
      
    if (data) {
      setActiveProjects(data);
    } else if (error) {
      console.error("Admin Fetch Error:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tweetText.trim()) return;

    setIsProcessing(true);
    setStatus('⚡ Pushing to staging vault...');

    // 1. Push raw text to Supabase
    const { error: insertError } = await supabase
      .from('raw_tweets')
      .insert([{ content: tweetText }]);

    if (insertError) {
      console.error(insertError);
      setStatus('❌ FAILED: Database rejected the payload.');
      setIsProcessing(false);
      return;
    }

    setStatus('🧠 Triggering Gemini Cloud Intelligence...');

    // 2. Trigger the new Vercel Serverless Function
    try {
      const apiResponse = await fetch('/api/process-alpha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: 'alpha2026' }) 
      });

      // UPGRADE: Read the raw text first before assuming it is JSON
      const rawText = await apiResponse.text();
      
      let apiResult;
      try {
        apiResult = JSON.parse(rawText);
      } catch (parseErr) {
        console.error("RAW SERVER RESPONSE:", rawText);
        throw new Error("Server returned a blank page or HTML instead of JSON. Are you using 'npm run dev' instead of 'vercel dev'?");
      }

      if (!apiResponse.ok) {
        throw new Error(apiResult.error || 'Serverless pipeline failed.');
      }

      // 3. Success! Update UI and refresh the grid.
      setStatus(`✅ SUCCESS: ${apiResult.message}`);
      setTweetText('');
      fetchActiveProjects();
      if (onGridUpdate) {
        onGridUpdate(); 
      }

    } catch (err) {
      console.error(err);
      setStatus(`❌ CLOUD ERROR: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const initiateDelete = (id, name) => {
    setPurgeError(''); 
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    setIsDeleting(true);
    setPurgeError('');
    
    const { error } = await supabase.rpc('purge_intel', {
      project_id: deleteTarget.id,
      secret_token: 'alpha2026'
    });

    setIsDeleting(false);

    if (error) {
      setPurgeError(error.message);
      console.error(error);
    } else {
      fetchActiveProjects(); 
      if (onGridUpdate) {
        onGridUpdate();
      }
      setDeleteTarget(null); 
    }
  };

  return (
    <>
      <div className="bg-[#020817]/90 text-blue-400 font-space border border-cyan-500/40 rounded-xl w-full p-6 md:p-8 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden">
        
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white font-syne tracking-tight">COMMAND CENTER</h2>
              <p className="text-xs text-cyan-500/70 tracking-[0.2em] uppercase mt-1">Staging Vault Protocol</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <textarea 
              rows="5"
              placeholder="Paste raw unstructured alpha here. The AI will parse it at midnight..." 
              className="p-4 bg-black/60 border border-cyan-900 text-cyan-50 focus:outline-none focus:border-cyan-500 rounded resize-none transition-colors font-mono text-sm leading-relaxed custom-scrollbar disabled:opacity-50"
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              disabled={isProcessing}
            />
            <button 
              type="submit" 
              disabled={isProcessing || !tweetText.trim()}
              className={`font-bold py-3 rounded uppercase tracking-[0.2em] text-sm transition-all duration-300 ${
                isProcessing 
                  ? 'bg-cyan-900 text-cyan-500 cursor-not-allowed border border-cyan-900'
                  : 'bg-cyan-600 border border-cyan-400 text-black hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              }`}
            >
              {isProcessing ? 'Processing Alpha...' : 'Deploy to Vault'}
            </button>
          </form>
          {status && (
            <p className={`mt-5 text-sm tracking-wide text-center font-mono ${
              status.includes('❌') ? 'text-red-400' : 'text-cyan-300'
            }`}>
              {status}
            </p>
          )}
        </div>

        <div className="border-l-0 md:border-l border-cyan-900/50 pl-0 md:pl-8 pt-8 md:pt-0 border-t md:border-t-0 mt-8 md:mt-0">
          <h2 className="text-xl font-bold text-white font-syne mb-1">GRID MANAGER</h2>
          <p className="text-xs text-red-400/70 tracking-[0.2em] uppercase mb-4">Surgical Deletion Active</p>
          
          <div className="h-64 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {activeProjects.map(p => (
              <div key={p.id} className="flex justify-between items-center p-3 bg-black/40 border border-cyan-900/30 rounded group hover:border-red-900/50 transition-colors">
                <div>
                  <span className="text-white font-bold text-sm block">{p.project_name}</span>
                  <span className="text-cyan-600 text-[10px] uppercase tracking-wider">{p.card_type}</span>
                </div>
                <button 
                  onClick={() => initiateDelete(p.id, p.project_name)} 
                  className="text-red-500 opacity-70 group-hover:opacity-100 hover:text-red-400 font-bold px-3 py-2 bg-red-950/30 hover:bg-red-900/50 rounded transition"
                  title="Delete Project"
                >
                  [X]
                </button>
              </div>
            ))}
            
            {activeProjects.length === 0 && (
              <p className="text-gray-600 text-sm italic mt-4">The live grid is empty.</p>
            )}
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.3); border-radius: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.6); }
        `}} />
      </div>

      {/* --- CUSTOM DELETION MODAL --- */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#010205] border border-red-500/50 p-6 md:p-8 rounded-xl shadow-[0_0_40px_rgba(239,68,68,0.2)] max-w-md w-full relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
              
              <h3 className="text-2xl font-syne font-bold text-white mb-2">Confirm Purge</h3>
              
              <p className="text-gray-400 font-space text-sm leading-relaxed mb-4">
                Are you sure you want to permanently delete <span className="text-red-400 font-bold">"{deleteTarget.name}"</span> from the intelligence grid? This action drops the data from the Supabase mainnet and cannot be undone.
              </p>

              {purgeError && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="mb-6 p-3 bg-red-950/30 border border-red-500/50 rounded text-red-400 text-xs font-mono"
                >
                  ERROR: {purgeError}
                </motion.div>
              )}
              
              <div className={`flex gap-4 justify-end font-space ${!purgeError ? 'mt-8' : ''}`}>
                <button 
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="px-5 py-2.5 text-xs tracking-widest uppercase font-bold text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className={`px-5 py-2.5 text-xs tracking-widest uppercase font-bold text-black rounded transition-all duration-300 ${
                    isDeleting 
                      ? 'bg-red-800 cursor-not-allowed opacity-80' 
                      : 'bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  }`}
                >
                  {isDeleting ? 'PURGING...' : 'Execute Purge'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}