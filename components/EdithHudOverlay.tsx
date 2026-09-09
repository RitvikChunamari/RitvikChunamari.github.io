import React, { useState, useEffect } from 'react';
import { playEdithSound, toggleEdithSound } from '../src/utils/edithSound';

interface EdithHudOverlayProps {
  scrollProgress: number;
  isEdithMode: boolean;
  onToggleEdithMode: () => void;
  activeTargetName?: string | null;
}

const EdithHudOverlay: React.FC<EdithHudOverlayProps> = ({
  scrollProgress,
  isEdithMode,
  onToggleEdithMode,
  activeTargetName
}) => {
  const [audioActive, setAudioActive] = useState(true);
  const [pitch, setPitch] = useState(12.4);
  const [yaw, setYaw] = useState(-42.1);
  const [heading, setHeading] = useState(180);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetLock, setTargetLock] = useState<{ x: number; y: number; visible: boolean; label: string }>({
    x: 0,
    y: 0,
    visible: false,
    label: ''
  });

  // Track Mouse & Update HUD Telemetry
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const xPct = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
      
      setPitch(Number((yPct * 18 + scrollProgress * 90).toFixed(1)));
      setYaw(Number((xPct * 35).toFixed(1)));
      setHeading(Math.floor(((xPct + 1) * 180 + scrollProgress * 360) % 360));

      // Target Lock Acquisition check
      const targetElement = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const edithTarget = targetElement?.closest('[data-edith-target]')?.getAttribute('data-edith-target');

      if (edithTarget) {
        setTargetLock({
          x: e.clientX,
          y: e.clientY,
          visible: true,
          label: edithTarget
        });
      } else if (activeTargetName) {
        setTargetLock({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          visible: true,
          label: activeTargetName
        });
      } else {
        setTargetLock(prev => ({ ...prev, visible: false }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [scrollProgress, activeTargetName]);

  const handleAudioToggle = () => {
    const newState = toggleEdithSound();
    setAudioActive(newState);
    if (newState) playEdithSound('toggle');
  };

  const handleModeClick = () => {
    playEdithSound('boot');
    onToggleEdithMode();
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[8500] select-none font-mono text-cinema-white">
      {/* 2. Side Tactical Pitch Ladders & Scale Ticks */}
      {isEdithMode && (
        <>
          {/* Left Vertical Pitch Scale */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col space-y-3 text-[8px] text-neutral-500 pointer-events-none">
            <div className="flex items-center space-x-1.5"><div className="w-2 h-[1px] bg-white/30"></div><span>+30°</span></div>
            <div className="flex items-center space-x-1.5"><div className="w-1.5 h-[1px] bg-white/20"></div><span>+15°</span></div>
            <div className="flex items-center space-x-1.5"><div className="w-3.5 h-[1px] bg-white"></div><span className="text-white font-bold">00° RAD</span></div>
            <div className="flex items-center space-x-1.5"><div className="w-1.5 h-[1px] bg-white/20"></div><span>-15°</span></div>
            <div className="flex items-center space-x-1.5"><div className="w-2 h-[1px] bg-white/30"></div><span>-30°</span></div>
          </div>

          {/* Right Vertical Roll Scale */}
          <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col space-y-3 text-[8px] text-neutral-500 items-end pointer-events-none">
            <div className="flex items-center space-x-1.5"><span>[GRID 01]</span><div className="w-2 h-[1px] bg-white/30"></div></div>
            <div className="flex items-center space-x-1.5"><span>[GRID 02]</span><div className="w-1.5 h-[1px] bg-white/20"></div></div>
            <div className="flex items-center space-x-1.5"><span className="text-white font-bold">[(3D MATRIX)]</span><div className="w-3.5 h-[1px] bg-white"></div></div>
            <div className="flex items-center space-x-1.5"><span>[GRID 03]</span><div className="w-1.5 h-[1px] bg-white/20"></div></div>
            <div className="flex items-center space-x-1.5"><span>[GRID 04]</span><div className="w-2 h-[1px] bg-white/30"></div></div>
          </div>

          {/* Frame Corner Precision Brackets */}
          <div className="absolute top-20 left-6 flex flex-col space-y-1 pointer-events-none">
            <div className="w-8 h-8 border-t border-l border-white/30"></div>
          </div>

          <div className="absolute top-20 right-6 flex flex-col items-end space-y-1 pointer-events-none">
            <div className="w-8 h-8 border-t border-r border-white/30"></div>
          </div>

          <div className="absolute bottom-12 left-6 flex flex-col space-y-1 pointer-events-none">
            <div className="w-8 h-8 border-b border-l border-white/30"></div>
          </div>

          <div className="absolute bottom-12 right-6 flex flex-col items-end space-y-1 pointer-events-none">
            <div className="w-8 h-8 border-b border-r border-white/30"></div>
          </div>
        </>
      )}

      {/* 3. Sleek Target Lock Reticle */}
      {targetLock.visible && isEdithMode && (
        <div
          className="fixed pointer-events-none z-[9900] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${targetLock.x}px`, top: `${targetLock.y}px` }}
        >
          <div className="w-14 h-14 border border-white/50 relative rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center">
            {/* Center Reticle Point */}
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
            
            {/* Corner Bracket Accents */}
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white"></div>

            {/* Rangefinder Distance Data Callout */}
            <div className="absolute -right-24 top-0 bg-black/90 border border-white/20 text-white text-[8px] font-mono px-2 py-1 rounded whitespace-nowrap tracking-wider shadow-xl flex flex-col space-y-0.5">
              <span className="font-bold text-[#FFB700]">LOCKED // {targetLock.label.toUpperCase()}</span>
              <span className="text-neutral-400 text-[7px]">RANGE: {(1.2 + (targetLock.x % 50) * 0.08).toFixed(2)}m</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bottom Status Bar */}
      <div className="absolute bottom-3 left-6 right-6 flex items-center justify-between text-[8px] text-neutral-500 border-t border-white/10 pt-1.5 bg-black/30 backdrop-blur-sm px-4 pointer-events-auto">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1"><span className="w-1 h-1 bg-emerald-400 rounded-full inline-block"></span><span>STATUS: NOMINAL</span></span>
          <span>•</span>
          <span>PITCH: {pitch}°</span>
          <span>YAW: {yaw}°</span>
        </div>

        <div className="flex items-center space-x-3 font-mono">
          <button
            onClick={handleAudioToggle}
            onMouseEnter={() => playEdithSound('hover')}
            className="px-2 py-0.5 bg-white/5 border border-white/15 text-neutral-300 hover:text-white hover:border-white transition-colors rounded text-[8px] uppercase tracking-wider"
          >
            SFX: {audioActive ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={handleModeClick}
            onMouseEnter={() => playEdithSound('hover')}
            className={`px-2 py-0.5 border transition-all rounded text-[8px] uppercase tracking-wider ${
              isEdithMode
                ? 'bg-white text-black border-white font-bold'
                : 'bg-white/5 text-neutral-300 border-white/15 hover:bg-white/10'
            }`}
          >
            {isEdithMode ? 'HUD ON' : 'HUD OFF'}
          </button>

          <span className="text-neutral-400 font-mono">
            INDEX: {(scrollProgress * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default EdithHudOverlay;
