import React from 'react';
import { motion } from 'framer-motion';
import { GamePhase } from './types';

interface RestorationBarProps {
  cleanedCount: number;
  totalItems: number;
  phase: GamePhase;
}

export const RestorationBar: React.FC<RestorationBarProps> = ({ cleanedCount, totalItems, phase }) => {
  const percentage = Math.min(100, Math.round((cleanedCount / totalItems) * 100));

  return (
    <div className="absolute top-0 left-0 right-0 pt-8 pb-12 flex flex-col items-center z-50 pointer-events-none bg-gradient-to-b from-black/50 to-transparent">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-white text-3xl font-serif tracking-widest mb-4 drop-shadow-lg text-center text-opacity-90"
      >
        Healing the Sea
      </motion.h1>
      
      <div className="w-64 h-1 bg-white/10 rounded-full backdrop-blur-sm overflow-hidden">
        <motion.div
          className="h-full bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      </div>

      <motion.p 
        key={phase}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="mt-3 text-cyan-50 text-xs font-light tracking-[0.2em] uppercase drop-shadow-md opacity-80"
      >
        {phase === GamePhase.POLLUTED && "Polluted Waters"}
        {phase === GamePhase.RECOVERING && "Life Returning"}
        {phase === GamePhase.THRIVING && "Restoring Balance"}
        {phase === GamePhase.RESTORED && "Ocean Restored"}
      </motion.p>
    </div>
  );
};
