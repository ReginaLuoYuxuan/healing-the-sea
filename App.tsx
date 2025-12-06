// App.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { OceanBackground } from './OceanBackground';
import { TrashItem } from './TrashItem';
import { TrashBin } from './TrashBin';
import { RestorationBar } from './RestorationBar';
import { EndingScreen } from './EndingScreen';
import { INITIAL_TRASH_ITEMS, PHASE_THRESHOLDS } from './constants';
import { GamePhase, OceanState, TrashItem as TrashItemType } from './types';
import { AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  // 新增：是否已经进入游戏
  const [hasStarted, setHasStarted] = useState(false);

  const [gameState, setGameState] = useState<OceanState>({
    trashItems: INITIAL_TRASH_ITEMS,
    cleanedCount: 0,
    phase: GamePhase.POLLUTED,
    isGameComplete: false,
  });

  const [isBinHovered, setIsBinHovered] = useState(false);
  
  // Refs for collision detection
  const containerRef = useRef<HTMLDivElement>(null);
  const binRef = useRef<HTMLDivElement>(null);

  // Update phase based on cleaned count
  useEffect(() => {
    let newPhase = GamePhase.POLLUTED;
    if (gameState.cleanedCount >= PHASE_THRESHOLDS[GamePhase.RESTORED]) {
      newPhase = GamePhase.RESTORED;
    } else if (gameState.cleanedCount >= PHASE_THRESHOLDS[GamePhase.THRIVING]) {
      newPhase = GamePhase.THRIVING;
    } else if (gameState.cleanedCount >= PHASE_THRESHOLDS[GamePhase.RECOVERING]) {
      newPhase = GamePhase.RECOVERING;
    }

    if (newPhase !== gameState.phase) {
      setGameState(prev => ({
        ...prev,
        phase: newPhase,
        isGameComplete: newPhase === GamePhase.RESTORED
      }));
    }
  }, [gameState.cleanedCount, gameState.phase]);

  const handleDragEnd = useCallback((item: TrashItemType, info: any) => {
    if (!binRef.current) return;

    const binRect = binRef.current.getBoundingClientRect();
    const point = info.point; // Absolute coordinates of pointer

    // Simple collision detection
    if (
      point.x >= binRect.left &&
      point.x <= binRect.right &&
      point.y >= binRect.top &&
      point.y <= binRect.bottom
    ) {
      // Success: Remove item
      setGameState(prev => ({
        ...prev,
        trashItems: prev.trashItems.filter(t => t.id !== item.id),
        cleanedCount: prev.cleanedCount + 1
      }));
      setIsBinHovered(false);
    } else {
      setIsBinHovered(false);
    }
  }, []);

  // 还没开始游戏时：显示首页
  if (!hasStarted) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-sky-900 to-emerald-800 text-slate-50 flex items-center justify-center">
        <div className="max-w-xl w-full mx-6 px-8 py-10 rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 text-center space-y-6">
          <h1 className="text-4xl font-semibold tracking-wide">
            Healing the Sea
          </h1>

          <p className="text-sm leading-relaxed text-sky-100">
            Drag the drifting plastic bottles into the glowing net.
            As the water clears, coral, fish, and turtles slowly return.
            Notice how a few small gestures can change the whole ocean.
          </p>

          <button
            onClick={() => setHasStarted(true)}
            className="mt-2 inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium tracking-wide bg-cyan-300 text-sky-900 hover:bg-cyan-200 shadow-lg shadow-cyan-900/30 transition"
          >
            Start Cleaning
          </button>
        </div>
      </div>
    );
  }

  // 已经点了“Start Cleaning”之后：正常进入游戏
  return (
    <div ref={containerRef} className="relative w-screen h-screen overflow-hidden bg-slate-900 select-none">
      
      {/* Background Visuals */}
      <OceanBackground 
        phase={gameState.phase} 
        cleanedCount={gameState.cleanedCount}
      />

      {/* UI Overlay */}
      <RestorationBar 
        cleanedCount={gameState.cleanedCount} 
        totalItems={INITIAL_TRASH_ITEMS.length} 
        phase={gameState.phase}
      />

      {/* Game Interactive Layer */}
      <AnimatePresence>
        {!gameState.isGameComplete && gameState.trashItems.map((item) => (
          <TrashItem 
            key={item.id} 
            item={item} 
            containerRef={containerRef}
            onDragEnd={handleDragEnd}
          />
        ))}
      </AnimatePresence>

      {!gameState.isGameComplete && (
        <TrashBin 
          isHovered={isBinHovered} 
          binRef={binRef}
        />
      )}

      {/* Ending Screen */}
      <AnimatePresence>
        {gameState.isGameComplete && <EndingScreen />}
      </AnimatePresence>
      
    </div>
  );
};

export default App;
