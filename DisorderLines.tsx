import React from 'react';
import { motion } from 'framer-motion';
import { GamePhase } from './types';

interface DisorderLinesProps {
  phase: GamePhase;
}

export const DisorderLines: React.FC<DisorderLinesProps> = ({ phase }) => {
  const isPolluted = phase === GamePhase.POLLUTED;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-plus-lighter">
      <svg className="w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="softGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isPolluted ? "#bef264" : "#22d3ee"} stopOpacity="0" />
            <stop offset="50%" stopColor={isPolluted ? "#eab308" : "#67e8f9"} stopOpacity="0.5" />
            <stop offset="100%" stopColor={isPolluted ? "#bef264" : "#22d3ee"} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Soft Flow Lines */}
        {[0, 1].map((i) => (
          <motion.path
            key={i}
            fill="none"
            stroke="url(#softGlow)"
            strokeWidth={isPolluted ? 1.5 : 2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0.1, 0.4, 0.1],
              d: isPolluted 
                  ? [
                      `M0,${35 + i * 20} C30,${30 + i * 20} 60,${40 + i * 20} 100,${35 + i * 20}`,
                      `M0,${35 + i * 20} C30,${40 + i * 20} 60,${30 + i * 20} 100,${35 + i * 20}`,
                      `M0,${35 + i * 20} C30,${30 + i * 20} 60,${40 + i * 20} 100,${35 + i * 20}`
                    ] 
                  : [
                      `M0,${40 + i * 15} C40,${20 + i * 15} 60,${60 + i * 15} 100,${40 + i * 15}`,
                      `M0,${40 + i * 15} C40,${60 + i * 15} 60,${20 + i * 15} 100,${40 + i * 15}`,
                      `M0,${40 + i * 15} C40,${20 + i * 15} 60,${60 + i * 15} 100,${40 + i * 15}`
                    ]
            }}
            transition={{
              duration: 12 + i * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>
    </div>
  );
};
