import React, { useEffect } from 'react';

export type VibeMode = 'neural' | 'waves' | 'echo' | 'wireframe';

interface HeroModeSwitcherProps {
  currentMode: VibeMode;
  onModeChange: (mode: VibeMode) => void;
  offset?: number;
}

interface ModeOption {
  id: VibeMode;
  number: string;
  label: string;
  shortLabel: string;
}

const MODES: ModeOption[] = [
  { id: 'neural', number: '01', label: 'NEURAL FIELD', shortLabel: 'NEURAL' },
  { id: 'waves', number: '02', label: 'CYBER WAVES', shortLabel: 'WAVES' },
  { id: 'echo', number: '03', label: 'KINETIC ECHO', shortLabel: 'ECHO' },
  { id: 'wireframe', number: '04', label: '3D GEOMETRY', shortLabel: '3D' },
];

const HeroModeSwitcher: React.FC<HeroModeSwitcherProps> = ({
  currentMode,
  onModeChange,
  offset = 0,
}) => {
  // Support keyboard shortcuts 1, 2, 3, 4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === '1') onModeChange('neural');
      if (e.key === '2') onModeChange('waves');
      if (e.key === '3') onModeChange('echo');
      if (e.key === '4') onModeChange('wireframe');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onModeChange]);

  const scrollFade = Math.max(0, 1 - offset * 0.0035);

  return (
    <div
      className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto transition-all duration-300"
      style={{
        opacity: scrollFade,
        pointerEvents: scrollFade < 0.1 ? 'none' : 'auto',
      }}
    >
      <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-full backdrop-blur-xl bg-black/60 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-[95vw] overflow-x-auto">
        <span className="hidden sm:inline-block pl-3 pr-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 select-none">
          VIBE ENGINE:
        </span>

        {MODES.map((mode) => {
          const isActive = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-wider transition-all duration-300 ${
                isActive
                  ? 'bg-white/15 text-white border border-white/25 shadow-[0_0_16px_rgba(255,59,48,0.25)]'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent'
              }`}
              data-cursor-text={mode.label}
              title={`Switch to ${mode.label} (Press ${mode.number.slice(1)})`}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
              )}
              <span className="font-semibold text-neutral-400 group-hover:text-white">
                {mode.number}
              </span>
              <span className="hidden md:inline">{mode.label}</span>
              <span className="md:hidden">{mode.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeroModeSwitcher;
