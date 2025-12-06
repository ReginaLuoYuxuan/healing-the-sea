import React from 'react';
import { motion } from 'framer-motion';
import { TrashItem as TrashItemType } from '../../types';

interface TrashItemProps {
  item: TrashItemType;
  containerRef: React.RefObject<HTMLDivElement>;
  onDragEnd: (item: TrashItemType, info: any) => void;
}

export const TrashItem: React.FC<TrashItemProps> = ({
  item,
  containerRef,
  onDragEnd,
}) => {
  // 根据 id 做一点点随机变化（颜色、旋转），让每个瓶子不一样
  const idNum = parseInt(item.id.replace(/\D/g, '')) || 0;
  const rotationOffset = (idNum * 17) % 360;
  const scaleVar = 0.9 + ((idNum % 4) * 0.1); // 0.9 ~ 1.2

  const tints = ['#e0f2fe', '#bae6fd', '#e0e7ff'];
  const tint = tints[idNum % tints.length];

  return (
    <motion.div
      // === 核心改动：保留拖拽，但去掉约束，避免第一次拖动被“卡住” ===
      drag
      dragElastic={0.2}
      dragMomentum={false}
      // 防止浏览器把第一次拖拽当成滚动/选中文字
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        zIndex: 40,
        touchAction: 'none',
      }}
      className="absolute flex items-center justify-center pointer-events-auto"
      whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 100 }}
      whileHover={{ scale: 1.05, cursor: 'grab' }}
      onDragEnd={(e, info) => onDragEnd(item, info)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: scaleVar,
        y: [0, 5, 0],
        rotate: [item.rotation, item.rotation + 5, item.rotation],
      }}
      transition={{
        opacity: { duration: 0.5 },
        y: { duration: 3 + (idNum % 2), repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 4 + (idNum % 3), repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {/* 塑料瓶插画 */}
      <svg
        width="40"
        height="80"
        viewBox="0 0 40 80"
        className="overflow-visible drop-shadow-md"
      >
        <g transform={`rotate(${rotationOffset} 20 40)`}>
          {/* 瓶身 */}
          <path
            d="M12,10 L28,10 L30,20 L32,25 L32,70 Q32,78 20,78 Q8,78 8,70 L8,25 L10,20 Z"
            fill={tint}
            fillOpacity="0.4"
            stroke="#7dd3fc"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* 瓶盖 */}
          <path d="M12,10 L28,10 L28,5 L12,5 Z" fill="#fca5a5" opacity="0.9" />
          {/* 高光 */}
          <path d="M14,30 L26,30" stroke="white" strokeWidth="1" opacity="0.4" />
          <path d="M14,50 L26,50" stroke="white" strokeWidth="1" opacity="0.3" />
          <path
            d="M30,35 L30,60"
            stroke="white"
            strokeWidth="2"
            opacity="0.2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </motion.div>
  );
};
