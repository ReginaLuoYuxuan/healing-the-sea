import React from 'react';
import { motion } from 'framer-motion';

interface TrashBinProps {
  isHovered: boolean;
  binRef: React.RefObject<HTMLDivElement>;
}

export const TrashBin: React.FC<TrashBinProps> = ({ isHovered, binRef }) => {
  return (
    <motion.div
      ref={binRef}
      className="absolute bottom-8 right-8 z-40 flex flex-col items-center justify-center"
      animate={{ scale: isHovered ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="relative w-32 h-32 flex items-center justify-center">
         {/* Back glow */}
         <motion.div 
            className="absolute inset-0 bg-cyan-400 rounded-full blur-2xl opacity-20"
            animate={{ opacity: isHovered ? 0.4 : 0.2 }}
         />

         {/* The Collection Net Visual */}
         <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl overflow-visible">
            {/* The Ring */}
            <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="10 5" />
            
            {/* The Net Mesh */}
            <motion.path 
                d="M15,50 Q50,90 85,50" 
                fill="none" 
                stroke="#cbd5e1" 
                strokeWidth="1" 
                strokeOpacity="0.5"
            />
            <defs>
                <pattern id="binNet" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M0,0 L10,10 M10,0 L0,10" stroke="#f1f5f9" strokeWidth="0.5" />
                </pattern>
            </defs>
            <motion.circle 
                cx="50" 
                cy="50" 
                r="38" 
                fill="url(#binNet)" 
                opacity="0.3"
                animate={{ scale: isHovered ? 1.1 : 1 }}
            />
         </svg>

         <div className="absolute text-xs tracking-widest text-cyan-100 font-light opacity-80 mt-1">
             COLLECT
         </div>
      </div>
    </motion.div>
  );
};