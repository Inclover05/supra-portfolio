import React, { useState } from 'react';
import { supabase } from './Supabase';
import { ShieldAlert, Send, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    metric_value: '',
    metric_label: '',
    card_type: 'High Funding'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('weekly_intelligence')
        .insert([formData]);

      if (error) throw error;
      
      setSuccess(true);
      setFormData({
        project_name: '', description: '', metric_value: '', metric_label: '', card_type: 'High Funding'
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Error pushing to database: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-cyan-50 font-space flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-[#020817] border-2 border-cyan-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
        
        <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-6 mb-6">
          <ShieldAlert className="text-cyan-400" size={24} />
          <div>
            <h2 className="text-xl font-syne font-bold text-white tracking-widest">ARCHITECT TERMINAL</h2>
            <p className="text-[10px] text-cyan-500/70 tracking-[0.3em] uppercase">Secure Uplink Established</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-gray-400 mb-1 tracking-widest uppercase">Project Name</label>
            <input required type="text" name="project_name" value={formData.project_name} onChange={handleChange} className="w-full bg-[#02040a] border border-cyan-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" placeholder="e.g. GenLayer" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 tracking-widest uppercase">Description</label>
            <input required type="text" name="description" value={formData.description} onChange={handleChange} className="w-full bg-[#02040a] border border-cyan-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" placeholder="e.g. Intelligent Execution Environment" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1 tracking-widest uppercase">Metric Value</label>
              <input required type="text" name="metric_value" value={formData.metric_value} onChange={handleChange} className="w-full bg-[#02040a] border border-cyan-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" placeholder="e.g. $12.5M" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 tracking-widest uppercase">Metric Label</label>
              <input required type="text" name="metric_label" value={formData.metric_label} onChange={handleChange} className="w-full bg-[#02040a] border border-cyan-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors" placeholder="e.g. RAISED" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 tracking-widest uppercase">Card Category</label>
            <select name="card_type" value={formData.card_type} onChange={handleChange} className="w-full bg-[#02040a] border border-cyan-500/20 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-400 transition-colors appearance-none cursor-pointer">
              <option value="High Funding">High Funding</option>
              <option value="Top Engagement">Top Engagement</option>
              <option value="Live Now">Live Now</option>
            </select>
          </div>

          <button disabled={loading} type="submit" className="w-full mt-4 bg-cyan-950/50 hover:bg-cyan-900 border border-cyan-400/50 text-cyan-300 font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {loading ? 'PUSHING TO CHAIN...' : 'PUBLISH INTEL'}
          </button>
        </form>

        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#020817]/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <CheckCircle className="text-green-400 mb-4" size={48} />
              <h3 className="text-xl font-syne font-bold text-white">Upload Successful</h3>
              <p className="text-sm text-cyan-200/70 mt-2 font-mono">Mainnet updated.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}