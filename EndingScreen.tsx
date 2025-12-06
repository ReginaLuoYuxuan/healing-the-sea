import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ENDING_MESSAGES } from '../../constants';
import { getOceanFact } from '../../services/geminiService';
import { Sparkles, ArrowRight } from 'lucide-react';

export const EndingScreen: React.FC = () => {
  const [randomMessage] = useState(() => ENDING_MESSAGES[Math.floor(Math.random() * ENDING_MESSAGES.length)]);
  const [fact, setFact] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLearnMore = async () => {
    setLoading(true);
    const result = await getOceanFact("coral reef restoration");
    setFact(result);
    setLoading(false);
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-sky-950/40 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <div className="max-w-2xl p-10 text-center text-white relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10" />
        
        <motion.div
          className="relative z-10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <Sparkles className="w-8 h-8 mx-auto mb-6 text-cyan-200 animate-pulse opacity-70" />
          
          <p className="text-3xl font-serif leading-relaxed mb-8 drop-shadow-lg text-cyan-50">
            {randomMessage}
          </p>
          
          <div className="w-16 h-0.5 bg-cyan-400/50 mx-auto mb-8"></div>
        </motion.div>
        
        <div className="relative z-10 min-h-[100px] flex flex-col items-center justify-center">
            {!fact ? (
                <button 
                    onClick={handleLearnMore}
                    disabled={loading}
                    className="px-8 py-3 bg-cyan-900/40 hover:bg-cyan-800/60 hover:scale-105 border border-cyan-300/30 rounded-full transition-all flex items-center justify-center gap-3 group text-sm tracking-widest uppercase font-light"
                >
                    {loading ? "Listening to the waves..." : "Ask the Ocean"}
                    {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-black/20 p-6 rounded-lg border border-white/10"
                >
                    <p className="text-lg font-light italic text-cyan-100">{fact}</p>
                </motion.div>
            )}
        </div>
      </div>
    </motion.div>
  );
};