import { TrashItem, GamePhase, FishData } from './types';

export const INITIAL_TRASH_ITEMS: TrashItem[] = [
  { id: 't1', type: 'bottle', x: 20, y: 60, rotation: 15 },
  { id: 't2', type: 'bottle', x: 70, y: 40, rotation: -10 },
  { id: 't3', type: 'bottle', x: 50, y: 80, rotation: 45 },
  { id: 't4', type: 'bottle', x: 30, y: 30, rotation: 90 },
  { id: 't5', type: 'bottle', x: 80, y: 70, rotation: -30 },
  { id: 't6', type: 'bottle', x: 40, y: 50, rotation: 0 },
  { id: 't7', type: 'bottle', x: 10, y: 85, rotation: 120 },
  { id: 't8', type: 'bottle', x: 60, y: 20, rotation: -45 },
];

export const PHASE_THRESHOLDS = {
  [GamePhase.POLLUTED]: 0,
  [GamePhase.RECOVERING]: 2,
  [GamePhase.THRIVING]: 5,
  [GamePhase.RESTORED]: 8,
};

/**
 * 🐟 createSchool()
 * 让鱼：
 *  - 随机上下深度分布
 *  - 随机从左到右或右到左
 *  - 整个屏幕范围内游动
 */
const createSchool = (
  baseId: number,
  count: number,
  type: any,
  baseDepth: number,
  zIndex: number,
  speedRange: [number, number]
): FishData[] => {
  return Array.from({ length: count }).map((_, i) => {
    const startLeft = Math.random() > 0.5;

    const leftEdge = -35 - Math.random() * 20;  // -35% ~ -55%
    const rightEdge = 135 + Math.random() * 20; // 135% ~ 155%

    const patrolRange: [number, number] = startLeft
      ? [leftEdge, rightEdge]
      : [rightEdge, leftEdge];

    const [minSpeed, maxSpeed] = speedRange;

    return {
      id: baseId + i,
      type,
      depth: 10 + Math.random() * 75, // ✔ 全屏随机深度分布
      x: 50,
      speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
      startDelay: 0,
      patrolRange,
      verticalRange: 5 + Math.random() * 15,
      scale: 0.45 + Math.random() * 0.45, // 大小微随机
      zIndex,
    };
  });
};

/**
 * 🐠 FISH TIERS
 * 清理更多瓶子后 → 增加更多鱼类与数量
 */
export const FISH_TIERS: FishData[][] = [
  // — TIER 0 — Only silver school
  [
    ...createSchool(100, 12, 'silver-school', 40, 20, [25, 40]),
  ],

  // — TIER 1 — Add Teal
  [
    { id: 201, type: 'teal-single', depth: 30, x: 20, speed: 32, startDelay: 0, patrolRange: [-30, 130], verticalRange: 15, scale: 0.9, zIndex: 15 },
    { id: 202, type: 'teal-single', depth: 60, x: 80, speed: 28, startDelay: 1, patrolRange: [130, -30], verticalRange: 12, scale: 0.85, zIndex: 10 },
    ...createSchool(210, 15, 'silver-school', 50, 10, [20, 35]),
  ],

  // — TIER 2 — Add Yellow Round
  [
    { id: 301, type: 'round-yellow', depth: 20 + Math.random() * 60, x: 10, speed: 30, startDelay: 0, patrolRange: [-30, 130], verticalRange: 5, scale: 0.9, zIndex: 25 },
    ...createSchool(310, 15, 'silver-school', 40, 15, [18, 30]),
  ],

  // — TIER 3 — Add Purple Crescent
  [
    { id: 401, type: 'purple-crescent', depth: 20 + Math.random() * 60, x: 50, speed: 22, startDelay: 0, patrolRange: [-30, 130], verticalRange: 20, scale: 1, zIndex: 18 },
    ...createSchool(420, 18, 'silver-school', 40, 20, [15, 25]),
  ],

  // — TIER 4 — Add Mint-fast small fish
  [
    ...createSchool(500, 10, 'mint-small', 30, 22, [12, 18]),
    ...createSchool(510, 12, 'silver-school', 80, 10, [14, 22]),
  ],

  // — TIER 5 — Add Pink Round
  [
    { id: 601, type: 'pink-round', depth: 20 + Math.random() * 60, x: 0, speed: 18, startDelay: 0, patrolRange: [-20, 120], verticalRange: 10, scale: 0.9, zIndex: 20 },
    ...createSchool(620, 14, 'mint-small', 50, 10, [10, 18]),
  ],

  // — TIER 6 — Add Turtle
  [
    { id: 700, type: 'turtle', depth: 20 + Math.random() * 60, x: -30, speed: 45, startDelay: 0, patrolRange: [-40, 140], verticalRange: 4, scale: 1.1, zIndex: 19 },
    ...createSchool(710, 14, 'silver-school', 40, 5, [8, 15]),
  ],

  // — TIER 7 —
  [
    ...createSchool(800, 10, 'teal-single', 60, 15, [10, 16]),
  ],

  // — TIER 8 —
  [
    ...createSchool(900, 10, 'pink-round', 40, 22, [10, 16]),
  ],
];

export const ENDING_MESSAGES = [
  "A healthy ocean begins with small human hands.",
  "Disorder can become balance again.",
  "When the trash disappears, the ocean finally speaks.",
];
