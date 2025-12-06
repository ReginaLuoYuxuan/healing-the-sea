import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FishData, FishSpecies } from './types';

interface FishFlockProps {
  fishList: FishData[];
}

export const FishFlock: React.FC<FishFlockProps> = ({ fishList }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {fishList.map((fish) => (
        <Fish key={fish.id} data={fish} />
      ))}
    </div>
  );
};

const Fish: React.FC<{ data: FishData }> = ({ data }) => {
  const isWhale = data.type === 'whale';

  if (isWhale) {
    return <WhaleVisual data={data} />;
  }

  // 基本参数
  const vRange = data.verticalRange || 10;
  const wiggleDuration = Math.max(0.4, data.speed / 30);
  const rotateSequence = [0, -5, 0, 5, 0];

  // ✅ 随机“出生点”：让每条鱼出现在不同位置
  const basePosition = useMemo(() => {
    // 左右 10%–90% 之间
    const x = 10 + Math.random() * 80;
    // 上下 10%–85% 之间
    const depth = 10 + Math.random() * 75;
    return { x, depth };
  }, [data.id]);

  // ✅ 每条鱼自己的游动宽度（px）
  const swimWidth = useMemo(
    () => 150 + Math.random() * 200, // 150–350px 左右摆动
    [data.id]
  );

  // ✅ 随机决定这条鱼初始是向左还是向右游
  const movingRightFirst = useMemo(() => Math.random() > 0.5, [data.id]);
  const facingDir = movingRightFirst ? 1 : -1;

  // ✅ 负延迟：一进画面就处在不同位置，不会排成整齐队伍
  const negativeDelay = useMemo(() => {
    const idVal = parseInt(data.id.toString().replace(/\D/g, ''), 10) || 0;
    const randomFactor = (idVal % 100) / 100; // 0–0.99
    return -(randomFactor * data.speed);
  }, [data.id, data.speed]);

  return (
    <motion.div
      className="absolute"
      style={{
        top: `${basePosition.depth}%`,
        left: `${basePosition.x}%`,
        width: 100,
        height: 100,
        zIndex: data.zIndex,
        scale: data.scale,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        // 在自己这一小块区域内左右往返游动
        x: movingRightFirst ? [-swimWidth / 2, swimWidth / 2] : [swimWidth / 2, -swimWidth / 2],
        y: [0, -vRange, 0, vRange, 0],
      }}
      transition={{
        opacity: { duration: 1.5, ease: 'easeOut' },
        x: {
          duration: data.speed,        // 用你原来的 speed 控制快慢
          repeat: Infinity,
          repeatType: 'reverse',       // ❗左右来回游
          ease: 'linear',
          delay: negativeDelay,
        },
        y: {
          duration: 5 + Math.random() * 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: negativeDelay,
        },
      }}
    >
      {/* 内层控制鱼的朝向 + 摆动 */}
      <motion.div
        className="w-full h-full flex items-center justify-center origin-center"
        animate={{
          scaleX: facingDir,
          rotate: rotateSequence,
        }}
        transition={{
          scaleX: { duration: 0 },
          rotate: {
            duration: wiggleDuration,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        <FishVisual type={data.type} />
      </motion.div>
    </motion.div>
  );
};

const WhaleVisual: React.FC<{ data: FishData }> = ({ data }) => (
  <motion.div
    className="absolute z-0 opacity-10 blur-[3px]"
    initial={{ x: '-100%', opacity: 0 }}
    animate={{
      x: '200%',
      opacity: [0, 0.15, 0.15, 0],
    }}
    transition={{
      duration: 60,
      repeat: Infinity,
      repeatDelay: 30,
      delay: 0,
      ease: 'linear',
    }}
    style={{ top: `${data.depth}%`, width: '800px', height: '400px' }}
  >
    <svg viewBox="0 0 500 200" className="w-full h-full fill-indigo-900">
      <path d="M20,100 C80,20 200,20 300,60 C380,90 450,80 480,75 C450,70 380,60 300,90 C200,130 80,130 20,100 Z" />
    </svg>
  </motion.div>
);

// —————————— 鱼的外观（保持你原来的样子） ——————————
const FishVisual: React.FC<{ type: FishSpecies }> = ({ type }) => {
  switch (type) {
    case 'silver-school': // Species 1
      return (
        <div className="w-9 h-5">
          <svg viewBox="0 0 20 10" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="silverGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#f8fafc" />
              </linearGradient>
            </defs>
            <path
              d="M19,5 Q10,0 2,3 L0,1 L0,9 L2,7 Q10,10 19,5 Z"
              fill="url(#silverGrad)"
              opacity="0.9"
            />
            <path d="M5,5 L16,5" stroke="#94a3b8" strokeWidth="0.8" opacity="0.6" />
            <circle cx="16" cy="4" r="0.8" fill="#334155" />
          </svg>
        </div>
      );
    case 'teal-single': // Species 2
      return (
        <div className="w-16 h-8">
          <svg viewBox="0 0 50 25" className="w-full h-full overflow-visible drop-shadow-sm">
            <defs>
              <linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0f766e" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
            <path
              d="M48,12.5 Q30,0 12,6 Q5,9 0,7 L0,18 Q5,16 12,19 Q30,25 48,12.5 Z"
              fill="url(#tealGrad)"
              opacity="0.9"
            />
            <path d="M22,6 Q26,0 32,6 Z" fill="#115e59" />
            <path d="M22,19 Q26,25 32,19 Z" fill="#115e59" />
            <circle cx="42" cy="11" r="1.5" fill="#134e4a" />
            <circle cx="43" cy="10" r="0.5" fill="white" />
          </svg>
        </div>
      );
    case 'round-yellow': // Species 3
      return (
        <div className="w-12 h-12">
          <svg viewBox="0 0 40 40" className="w-full h-full overflow-visible drop-shadow-sm">
            <circle cx="20" cy="20" r="15" fill="#fcd34d" />
            <path d="M5,20 L-2,14 L-2,26 Z" fill="#fbbf24" />
            <circle cx="14" cy="16" r="1.5" fill="#f97316" opacity="0.7" />
            <circle cx="24" cy="23" r="1.5" fill="#f97316" opacity="0.7" />
            <circle cx="22" cy="13" r="1.2" fill="#f97316" opacity="0.7" />
            <circle cx="28" cy="19" r="1.5" fill="#78350f" />
          </svg>
        </div>
      );
    case 'purple-crescent': // Species 4
      return (
        <div className="w-14 h-9">
          <svg viewBox="0 0 45 30" className="w-full h-full overflow-visible drop-shadow-sm">
            <path d="M42,15 Q30,2 10,6 L0,2 L0,28 L10,24 Q30,28 42,15 Z" fill="#a78bfa" />
            <path
              d="M8,12 Q12,15 8,18"
              fill="none"
              stroke="#4c1d95"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="36" cy="12" r="2" fill="#4c1d95" />
          </svg>
        </div>
      );
    case 'mint-small': // Species 5
      return (
        <div className="w-10 h-6">
          <svg viewBox="0 0 25 15" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="mintGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#a7f3d0" />
              </linearGradient>
            </defs>
            <path d="M22,7.5 Q15,0 5,3 L0,0 L0,15 L5,12 Q15,15 22,7.5 Z" fill="url(#mintGrad)" />
            <circle cx="18" cy="6" r="1.5" fill="white" />
          </svg>
        </div>
      );
    case 'pink-round': // Species 6
      return (
        <div className="w-14 h-10">
          <svg viewBox="0 0 35 25" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="pinkGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#fce7f3" />
              </linearGradient>
            </defs>
            <ellipse cx="20" cy="12.5" rx="14" ry="10" fill="url(#pinkGrad)" />
            <path d="M6,12.5 L0,5 L0,20 Z" fill="#f9a8d4" />
            <circle cx="28" cy="10" r="1.5" fill="#be185d" />
          </svg>
        </div>
      );
    case 'turtle': // Species 7
      return (
        <div className="w-24 h-16">
          <svg viewBox="0 0 90 60" className="w-full h-full overflow-visible drop-shadow-lg">
            {/* Back Flippers */}
            <motion.path
              d="M20,40 Q10,50 5,45 Q15,35 25,38"
              fill="#4d7c0f"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <path d="M20,20 Q10,10 5,15 Q15,25 25,22" fill="#4d7c0f" />
            {/* Front Flippers */}
            <motion.path
              d="M60,45 Q50,65 40,55 Q50,45 65,42"
              fill="#84cc16"
              animate={{
                rotate: [0, 15, 0],
                d: [
                  'M60,45 Q50,65 40,55 Q50,45 65,42',
                  'M60,45 Q40,65 35,55 Q50,45 65,42',
                  'M60,45 Q50,65 40,55 Q50,45 65,42',
                ],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: 1, originY: 0 }}
            />
            <motion.path
              d="M60,15 Q50,-5 40,5 Q50,15 65,18"
              fill="#84cc16"
              animate={{ rotate: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: 1, originY: 1 }}
            />
            {/* Head */}
            <ellipse cx="80" cy="30" rx="9" ry="7" fill="#84cc16" />
            <circle cx="83" cy="28" r="1.5" fill="#1a2e05" />
            {/* Shell */}
            <path d="M25,30 C25,10 55,10 65,30 C65,50 55,50 25,50 C20,40 20,30 25,30 Z" fill="#3f6212" />
            <g opacity="0.6">
              <path d="M35,30 L45,20 L55,30 L55,40 L45,50 L35,40 Z" fill="#ecfccb" opacity="0.3" />
              <path d="M45,20 L55,30" stroke="#bef264" strokeWidth="1" />
            </g>
          </svg>
        </div>
      );
    default:
      return null;
  }
};
