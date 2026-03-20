import React, { useState } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  // REPLACE THIS with your actual Discord/Make webhook URL
  const WEBHOOK_URL = 'https://hook.eu1.make.com/hkdhfcq06565elc5mqh6lsbq1hbl49y3';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('sending');

    try {
      // If you haven't set a real URL yet, this will fail, which is expected.
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitor_message: message }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Webhook Error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-auto font-mono">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-80 bg-[#030303]/90 backdrop-blur-xl border border-white/20 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          >
            <div className="bg-white/5 p-4 border-b border-white/10 flex justify-between items-center">
              <span className="text-[#00f6ff] text-xs tracking-widest uppercase">
                Direct Line
              </span>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00f6ff] animate-pulse" />
                <span className="text-[10px] text-gray-400">ONLINE</span>
              </div>
            </div>

            <div className="p-4 h-48 flex flex-col justify-end">
              {status === 'success' ? (
                <div className="text-center text-green-400 text-sm animate-pulse">
                  // MESSAGE TRANSMITTED
                </div>
              ) : status === 'error' ? (
                <div className="text-center text-red-400 text-sm">
                  // TRANSMISSION FAILED
                </div>
              ) : (
                <p className="text-gray-500 text-xs mb-4 text-center">
                  Send a secure signal to the Architect.
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-2 border-t border-white/10 bg-black/20 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type signal..."
                className="flex-1 bg-transparent text-white text-sm px-3 py-2 outline-none placeholder:text-gray-700"
                disabled={status === 'sending' || status === 'success'}
              />
              <button
                type="submit"
                disabled={status === 'sending' || status === 'success'}
                className="p-2 bg-white/10 hover:bg-[#00f6ff]/20 text-white hover:text-[#00f6ff] transition-colors disabled:opacity-50"
              >
                {status === 'sending' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#030303] border border-white/20 text-white flex items-center justify-center hover:border-[#00f6ff] hover:shadow-[0_0_20px_rgba(0,246,255,0.3)] transition-all duration-300 group"
      >
        {isOpen ? (
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
        ) : (
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
}