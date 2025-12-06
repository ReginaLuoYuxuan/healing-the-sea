
export interface TrashItem {
  id: string;
  type: 'bottle'; // All trash is now bottles
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  rotation: number;
}

export enum GamePhase {
  POLLUTED = 0,
  RECOVERING = 1,
  THRIVING = 2,
  RESTORED = 3,
}

export interface OceanState {
  trashItems: TrashItem[];
  cleanedCount: number;
  phase: GamePhase;
  isGameComplete: boolean;
}

export type FishSpecies = 
  | 'silver-school' 
  | 'teal-single' 
  | 'purple-crescent' 
  | 'round-yellow' 
  | 'mint-small' 
  | 'pink-round' 
  | 'turtle' 
  | 'whale';

export interface FishData {
  id: number;
  type: FishSpecies;
  depth: number; // Y position %
  x: number; // Initial X position %
  speed: number; // Duration of one lap (lower = faster)
  patrolRange: [number, number]; // [startX, endX] in %
  verticalRange: number; // Amplitude of sine wave bobbing
  scale: number;
  zIndex: number; // To swim behind/in-front of coral
  startDelay: number;
}
