
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GamePhase, FishData } from './types';
import { DisorderLines } from './DisorderLines';
import { FishFlock } from './FishFlock';
import { FISH_TIERS } from './constants';

interface OceanBackgroundProps {
  phase: GamePhase;
  cleanedCount: number;
}

export const OceanBackground: React.FC<OceanBackgroundProps> = ({ phase, cleanedCount }) => {
  // Accumulate fish based on cleanedCount
  // FISH_TIERS is an array where index 0 is start, index 1 is after 1 cleaned, etc.
  const currentFish: FishData[] = useMemo(() => {
    let fish: FishData[] = [];
    // Always add base tier (0)
    fish = [...fish, ...FISH_TIERS[0]];
    
    // Add subsequent tiers based on cleaned count
    // If cleanedCount is 1, we add TIER[1].
    // If cleanedCount is 2, we add TIER[1] and TIER[2].
    for (let i = 1; i <= cleanedCount; i++) {
        if (FISH_TIERS[i]) {
            fish = [...fish, ...FISH_TIERS[i]];
        }
    }
    return fish;
  }, [cleanedCount]);

  // Enriched Gradients with Depth
  const gradients = {
    [GamePhase.POLLUTED]: "linear-gradient(to bottom, #475569 0%, #334155 40%, #1e293b 100%)",
    [GamePhase.RECOVERING]: "linear-gradient(to bottom, #2dd4bf 0%, #0f766e 50%, #134e4a 100%)",
    [GamePhase.THRIVING]: "linear-gradient(to bottom, #22d3ee 0%, #0ea5e9 40%, #0369a1 100%)",
    [GamePhase.RESTORED]: "linear-gradient(to bottom, #7dd3fc 0%, #38bdf8 30%, #0284c7 70%, #0c4a6e 100%)"
  };

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden transition-all duration-[3000ms]"
      style={{ background: gradients[phase] }}
    >
      {/* 1. Background Layers */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      <SunRays phase={phase} />
      <Particles phase={phase} />
      <DistantFish phase={phase} />
      <DisorderLines phase={phase} />

      {/* 2. Sea Floor (Base Layer) */}
      <SeaFloor phase={phase} />

      {/* 3. Coral Reef (Z-Index 10) */}
      <div className="relative z-10 w-full h-full pointer-events-none">
         <CoralReef phase={phase} />
      </div>

      {/* 4. Fish Flock (Mixed Z-Indices) */}
      <FishFlock fishList={currentFish} />

      {/* 5. Foreground Bubbles */}
      <Bubbles phase={phase} />

    </motion.div>
  );
};

// --- Environmental Components ---

const SeaFloor: React.FC<{ phase: GamePhase }> = ({ phase }) => {
    const isPolluted = phase === GamePhase.POLLUTED;
    
    return (
        <motion.div 
            className="absolute bottom-0 w-full h-[25%] z-0"
            initial={false}
            animate={{ backgroundColor: isPolluted ? '#4b5563' : '#fde68a' }}
            transition={{ duration: 3 }}
        >
             {/* Sand Texture Overlay */}
             <div className="absolute inset-0 opacity-30 mix-blend-multiply" 
                style={{ 
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.6\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' 
                }} 
             />
             
             {/* Sand Ripples */}
             <svg className="absolute bottom-0 w-full h-full opacity-20 pointer-events-none" preserveAspectRatio="none">
                 <path d="M0,80 Q20,70 40,80 T80,80 T120,80 T160,80 T200,80" fill="none" stroke="#000" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
                 <path d="M0,40 Q30,30 60,40 T120,40 T180,40" fill="none" stroke="#000" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
             </svg>
        </motion.div>
    );
};

const CoralReef: React.FC<{ phase: GamePhase }> = ({ phase }) => {
    return (
        <div className="absolute bottom-0 w-full h-[40%] flex justify-between items-end px-4 max-w-screen-xl mx-auto left-0 right-0">
             {/* Left Group */}
             <div className="relative w-1/4 h-full">
                <Rock x="10%" scale={1.1} />
                <CoralBranching x="20%" scale={1.2} phase={phase} color="#fda4af" /> {/* Pink Branch */}
                <Seaweed x="5%" height={280} phase={phase} delay={0} />
             </div>

             {/* Middle Left */}
             <div className="relative w-1/4 h-full">
                <CoralFan x="40%" scale={0.9} phase={phase} color="#d8b4fe" /> {/* Lavender Fan */}
                <CoralBush x="70%" scale={1.0} phase={phase} color="#fdba74" /> {/* Orange Bush */}
             </div>

             {/* Middle Right */}
             <div className="relative w-1/4 h-full">
                 <Rock x="20%" scale={0.8} />
                 <Seaweed x="50%" height={250} phase={phase} delay={1} />
                 <CoralBranching x="80%" scale={0.9} phase={phase} color="#fca5a5" /> {/* Peach Branch */}
             </div>

             {/* Right Group */}
             <div className="relative w-1/4 h-full">
                 <CoralBush x="10%" scale={1.1} phase={phase} color="#fde047" /> {/* Yellow Bush */}
                 <CoralFan x="60%" scale={1.2} phase={phase} color="#f9a8d4" /> {/* Pink Fan */}
                 <Seaweed x="90%" height={320} phase={phase} delay={0.5} />
             </div>
        </div>
    );
};

// --- Coral SVGs (Organic Shapes) ---

const CoralBase = ({ phase, children, color }: any) => {
    const isDead = phase === GamePhase.POLLUTED;
    const finalColor = isDead ? '#78716c' : color;
    
    // Breathing animation for living coral
    const breathing = isDead ? {} : {
        scale: [1, 1.02, 1],
    };

    return (
        <motion.g 
            stroke={finalColor} 
            fill={isDead ? 'none' : finalColor} 
            fillOpacity={0.4}
            strokeWidth={isDead ? 2 : 0}
            animate={{ 
                fill: isDead ? 'transparent' : finalColor, 
                stroke: finalColor,
                ...breathing
            }}
            transition={{ 
                duration: 2,
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
        >
            {children}
        </motion.g>
    );
};

const CoralBranching: React.FC<any> = ({ x, scale, phase, color }) => (
    <div className="absolute bottom-0 origin-bottom" style={{ left: x, width: 90, height: 120, transform: `scale(${scale})` }}>
        <svg viewBox="0 0 90 120" className="w-full h-full overflow-visible">
            <CoralBase phase={phase} color={color}>
                {/* Main Stem splitting into arms */}
                <path d="M45,120 C45,100 45,80 45,70 
                         C45,60 20,50 15,30 
                         C15,20 20,15 25,15
                         C30,15 35,30 40,50 
                         C40,40 40,20 45,10
                         C50,0 55,0 60,10
                         C65,30 65,40 65,50
                         C70,40 85,30 85,20" 
                      strokeLinecap="round" strokeWidth={phase === GamePhase.POLLUTED ? 4 : 12} />
            </CoralBase>
        </svg>
    </div>
);

const CoralBush: React.FC<any> = ({ x, scale, phase, color }) => (
    <div className="absolute bottom-0 origin-bottom" style={{ left: x, width: 80, height: 60, transform: `scale(${scale})` }}>
         <svg viewBox="0 0 80 60" className="w-full h-full overflow-visible">
            <CoralBase phase={phase} color={color}>
                <circle cx="20" cy="40" r="15" />
                <circle cx="40" cy="30" r="18" />
                <circle cx="60" cy="40" r="15" />
                <circle cx="30" cy="50" r="12" />
                <circle cx="50" cy="50" r="12" />
            </CoralBase>
         </svg>
    </div>
);

const CoralFan: React.FC<any> = ({ x, scale, phase, color }) => (
    <div className="absolute bottom-0 origin-bottom" style={{ left: x, width: 100, height: 100, transform: `scale(${scale})` }}>
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
             <CoralBase phase={phase} color={color}>
                 <path d="M50,100 Q10,80 10,40 Q10,10 50,10 Q90,10 90,40 Q90,80 50,100" strokeLinejoin="round" />
                 {/* Internal veins */}
                 <path d="M50,100 L50,20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                 <path d="M50,100 Q30,60 20,30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                 <path d="M50,100 Q70,60 80,30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
             </CoralBase>
        </svg>
    </div>
);

const Rock: React.FC<any> = ({ x, scale }) => (
    <div className="absolute bottom-0" style={{ left: x, width: 100, height: 60, transform: `scale(${scale})`, zIndex: 1 }}>
        <svg viewBox="0 0 100 60" className="w-full h-full fill-slate-700 opacity-80">
            <path d="M10,60 C10,30 30,10 50,15 C70,20 90,40 90,60 Z" />
        </svg>
    </div>
);

// --- Particles ---

const Particles: React.FC<{ phase: GamePhase }> = ({ phase }) => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
             {[...Array(20)].map((_, i) => (
                 <motion.div
                    key={i}
                    className="absolute rounded-full bg-white opacity-40"
                    style={{ 
                        width: Math.random() * 3 + 1, 
                        height: Math.random() * 3 + 1,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                    }}
                    animate={{ 
                        y: [0, 20, 0],
                        x: [0, Math.random() * 10 - 5, 0],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        duration: 5 + Math.random() * 5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5
                    }}
                 />
             ))}
        </div>
    )
}

const SunRays: React.FC<{ phase: GamePhase }> = ({ phase }) => {
    const isBright = phase >= GamePhase.THRIVING;
    
    return (
        <motion.div 
            className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay"
            animate={{ opacity: isBright ? 0.3 : 0.1 }} // Softer light
            transition={{ duration: 3 }}
        >
             {[...Array(5)].map((_, i) => (
                 <motion.div
                    key={i}
                    className="absolute top-[-50%] h-[200%] w-[120px] bg-gradient-to-b from-white via-white/5 to-transparent blur-2xl transform origin-top"
                    style={{ left: `${10 + i * 20}%` }}
                    animate={{ 
                        rotate: [8, 12, 8],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 8 + i * 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                 />
             ))}
        </motion.div>
    );
};

const Bubbles: React.FC<{ phase: GamePhase }> = ({ phase }) => {
    const count = phase === GamePhase.POLLUTED ? 8 : 25;
    
    return (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {[...Array(count)].map((_, i) => {
                const size = Math.random() * 6 + 2; 
                return (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/10 backdrop-blur-[1px] border border-white/20"
                        style={{
                            width: size,
                            height: size,
                            left: `${Math.random() * 100}%`,
                            bottom: -20
                        }}
                        animate={{
                            y: [0, -1000], 
                            x: [0, Math.random() * 30 - 15], 
                            opacity: [0, 0.5, 0] 
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Infinity,
                            delay: Math.random() * 20,
                            ease: "linear"
                        }}
                    />
                );
            })}
        </div>
    );
};

const DistantFish: React.FC<{ phase: GamePhase }> = ({ phase }) => {
    if (phase < GamePhase.RECOVERING) return null;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
             {[...Array(3)].map((_, i) => (
                 <motion.div
                    key={i}
                    className="absolute w-16 h-6 rounded-full bg-slate-800/40 blur-[2px]"
                    style={{ 
                        top: `${30 + Math.random() * 40}%`,
                        left: -100
                    }}
                    animate={{ x: ['-20vw', '120vw'] }}
                    transition={{ 
                        duration: 40 + Math.random() * 20, 
                        repeat: Infinity, 
                        delay: Math.random() * 15,
                        ease: "linear"
                    }}
                 />
             ))}
        </div>
    );
};

const Seaweed: React.FC<{ x: string, height: number, delay?: number, phase: GamePhase }> = ({ x, height, delay = 0, phase }) => {
    const isDead = phase === GamePhase.POLLUTED;
    const color = isDead ? '#78716c' : '#10b981'; 
    
    return (
        <div className="absolute bottom-0 origin-bottom flex justify-center" style={{ left: x, width: '40px', height: `${height}px`, zIndex: 10 }}>
            <svg viewBox="0 0 40 300" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <motion.path 
                    fill="none"
                    stroke={color}
                    strokeWidth={isDead ? 5 : 8}
                    strokeLinecap="round"
                    strokeOpacity={0.8}
                    initial={{ d: "M20,300 Q20,150 20,0" }}
                    animate={{ 
                        d: [
                            "M20,300 Q15,150 10,0",   
                            "M20,300 Q25,150 30,0",  
                            "M20,300 Q15,150 10,0"    
                        ]
                    }}
                    transition={{ 
                        duration: 8, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: delay 
                    }}
                />
            </svg>
        </div>
    );
};
