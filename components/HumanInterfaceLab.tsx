import React, { useState } from 'react';

// Experiment 01: The Feel of an Interface
const FeelExperiment: React.FC = () => {
  const [activeSystem, setActiveSystem] = useState<'rigid' | 'kinetic'>('kinetic');
  const [actionCount, setActionCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [sliderValue, setSliderValue] = useState(65);
  const [switchOn, setSwitchOn] = useState(true);

  const handleTrigger = () => {
    setActionCount(prev => prev + 1);
  };

  return (
    <div className="bg-[#09090E] border border-white/10 rounded-sm p-6 sm:p-8 flex flex-col justify-between h-full">
      <div>
        {/* Header Telemetry */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
              EXP_01 // KINETIC DYNAMICS
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-white/50">
            HCI TELEMETRY
          </span>
        </div>

        <h4 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2">
          The Feel of an Interface
        </h4>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
          Compare how timing, visual damping, and tactile reaction thresholds govern the emotional ergonomics of an interaction.
        </p>

        {/* System Selector Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-black/40 p-1 rounded-sm border border-white/10 mb-8" role="tablist" aria-label="Interaction Systems">
          <button
            role="tab"
            aria-selected={activeSystem === 'rigid'}
            onClick={() => setActiveSystem('rigid')}
            data-testid="exp01-system-rigid"
            className={`py-2 px-3 text-xs font-mono uppercase tracking-wider rounded-sm transition-all duration-200 cursor-pointer ${
              activeSystem === 'rigid'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            System A: Linear / Rigid
          </button>
          <button
            role="tab"
            aria-selected={activeSystem === 'kinetic'}
            onClick={() => setActiveSystem('kinetic')}
            data-testid="exp01-system-kinetic"
            className={`py-2 px-3 text-xs font-mono uppercase tracking-wider rounded-sm transition-all duration-200 cursor-pointer ${
              activeSystem === 'kinetic'
                ? 'bg-[#FF3B30] text-white font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            System B: Kinetic / Tactile
          </button>
        </div>

        {/* Interactive Sandbox Area */}
        <div className="space-y-6 bg-white/[0.02] border border-white/[0.08] p-5 sm:p-6 rounded-sm mb-6">
          
          {/* 1. Tactile Action Trigger Button */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono text-white/40 uppercase mb-2">
              <span>01 / ACTUATION THRESHOLD</span>
              <span data-testid="exp01-click-counter">CLICKS: {actionCount}</span>
            </div>
            <button
              onClick={handleTrigger}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onMouseLeave={() => setIsPressed(false)}
              data-testid="exp01-trigger"
              className={`w-full py-3.5 px-6 rounded-sm font-mono text-xs font-bold uppercase tracking-widest cursor-pointer border select-none ${
                activeSystem === 'rigid'
                  ? 'bg-white/10 text-white border-white/20 active:bg-white active:text-black transition-none'
                  : 'bg-white/10 text-white border-white/30 hover:border-white hover:bg-white/[0.15] active:scale-[0.97] active:bg-[#FF3B30] active:text-white active:border-[#FF3B30] shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(255,255,255,0.12)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]'
              }`}
            >
              {activeSystem === 'rigid' ? 'Execute Command (0ms Instant)' : 'Engage Tactile Spring (Kinetic Damped)'}
            </button>
          </div>

          {/* 2. Feedback Toggle Switch */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="block font-mono text-xs text-white uppercase tracking-wider">Haptic State Reactor</span>
              <span className="block font-mono text-[10px] text-white/40">Visual threshold acknowledgment</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={switchOn}
              onClick={() => setSwitchOn(!switchOn)}
              data-testid="exp01-switch"
              className={`w-14 h-8 rounded-full border cursor-pointer relative p-0.5 ${
                switchOn ? (activeSystem === 'kinetic' ? 'bg-[#FF3B30] border-[#FF3B30]' : 'bg-white border-white') : 'bg-white/10 border-white/20'
              } ${activeSystem === 'rigid' ? 'transition-none' : 'transition-colors duration-300 ease-out'}`}
            >
              <span
                className={`block w-6 h-6 rounded-full bg-black shadow-md transform ${
                  switchOn ? 'translate-x-6' : 'translate-x-0'
                } ${activeSystem === 'rigid' ? 'transition-none' : 'transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]'}`}
              />
            </button>
          </div>

          {/* 3. Fluid Kinetic Slider */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono text-white/40 uppercase mb-2">
              <span>02 / CONTINUOUS VALUE SCRUB</span>
              <span className="text-white font-mono font-bold" data-testid="exp01-slider-val">{sliderValue}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step={activeSystem === 'rigid' ? 20 : 1}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              aria-label="Continuous Value Scrub"
              data-testid="exp01-slider"
              className="w-full accent-[#FF3B30] cursor-pointer bg-white/10 h-1.5 rounded-full appearance-none"
            />
          </div>

        </div>
      </div>

      {/* Comparative Specification Telemetry */}
      <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-4 font-mono text-[10px] text-white/50">
        <div>
          <span className="block text-white/30 uppercase">CURVE PROFILE</span>
          <span className="text-white font-bold">
            {activeSystem === 'rigid' ? 'Linear (step-start / 0ms)' : 'Cubic-Bezier(0.16, 1, 0.3, 1)'}
          </span>
        </div>
        <div>
          <span className="block text-white/30 uppercase">ERGONOMIC SENSATION</span>
          <span className="text-[#FF3B30] font-bold">
            {activeSystem === 'rigid' ? 'Mechanical / Abrupt' : 'Dignified / Tactile Fluid'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Experiment 02: Designed for Everyone (Radical Accessibility Engine)
const AccessibilityExperiment: React.FC = () => {
  const [targetSize, setTargetSize] = useState<'standard' | 'accessible'>('accessible');
  const [focusStyle, setFocusStyle] = useState<'none' | 'visible'>('visible');
  const [contrastMode, setContrastMode] = useState<'low' | 'high'>('high');
  const [reducedMotionSim, setReducedMotionSim] = useState(false);
  const [testScore, setTestScore] = useState<{ taps: number; misses: number }>({ taps: 0, misses: 0 });

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTestScore(prev => ({ ...prev, taps: prev.taps + 1 }));
  };

  const handleMiss = () => {
    setTestScore(prev => ({ ...prev, misses: prev.misses + 1 }));
  };

  return (
    <div className="bg-[#09090E] border border-white/10 rounded-sm p-6 sm:p-8 flex flex-col justify-between h-full">
      <div>
        {/* Header Telemetry */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
              EXP_02 // RADICAL ACCESSIBILITY
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-white/50">
            WCAG 2.2 AA
          </span>
        </div>

        <h4 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2">
          Designed for Everyone
        </h4>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
          Accessibility is not a cosmetic overlay. Experience how target ergonomics, focus indicators, and contrast boundaries eliminate human friction.
        </p>

        {/* Accessibility Dimension Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Target Size */}
          <div className="bg-white/[0.02] border border-white/[0.08] p-3 rounded-sm">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-white/40 mb-2">TARGET DIMENSION</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setTargetSize('standard')}
                data-testid="exp02-size-standard"
                className={`flex-1 py-1 px-2 text-[10px] font-mono uppercase rounded-sm border cursor-pointer ${
                  targetSize === 'standard' ? 'bg-white/20 border-white text-white font-bold' : 'border-white/10 text-white/40'
                }`}
              >
                Undersized (24px)
              </button>
              <button
                onClick={() => setTargetSize('accessible')}
                data-testid="exp02-size-accessible"
                className={`flex-1 py-1 px-2 text-[10px] font-mono uppercase rounded-sm border cursor-pointer ${
                  targetSize === 'accessible' ? 'bg-[#FF3B30] border-[#FF3B30] text-white font-bold' : 'border-white/10 text-white/40'
                }`}
              >
                WCAG (48px)
              </button>
            </div>
          </div>

          {/* Focus Visibility */}
          <div className="bg-white/[0.02] border border-white/[0.08] p-3 rounded-sm">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-white/40 mb-2">KEYBOARD FOCUS RING</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setFocusStyle('none')}
                data-testid="exp02-focus-none"
                className={`flex-1 py-1 px-2 text-[10px] font-mono uppercase rounded-sm border cursor-pointer ${
                  focusStyle === 'none' ? 'bg-white/20 border-white text-white font-bold' : 'border-white/10 text-white/40'
                }`}
              >
                Suppressed
              </button>
              <button
                onClick={() => setFocusStyle('visible')}
                data-testid="exp02-focus-visible"
                className={`flex-1 py-1 px-2 text-[10px] font-mono uppercase rounded-sm border cursor-pointer ${
                  focusStyle === 'visible' ? 'bg-[#FF3B30] border-[#FF3B30] text-white font-bold' : 'border-white/10 text-white/40'
                }`}
              >
                High-Contrast Ring
              </button>
            </div>
          </div>

          {/* Contrast Mode */}
          <div className="bg-white/[0.02] border border-white/[0.08] p-3 rounded-sm">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-white/40 mb-2">CONTRAST COMPLIANCE</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setContrastMode('low')}
                data-testid="exp02-contrast-low"
                className={`flex-1 py-1 px-2 text-[10px] font-mono uppercase rounded-sm border cursor-pointer ${
                  contrastMode === 'low' ? 'bg-white/20 border-white text-white font-bold' : 'border-white/10 text-white/40'
                }`}
              >
                Failing (2.2:1)
              </button>
              <button
                onClick={() => setContrastMode('high')}
                data-testid="exp02-contrast-high"
                className={`flex-1 py-1 px-2 text-[10px] font-mono uppercase rounded-sm border cursor-pointer ${
                  contrastMode === 'high' ? 'bg-[#FF3B30] border-[#FF3B30] text-white font-bold' : 'border-white/10 text-white/40'
                }`}
              >
                AAA (7.2:1)
              </button>
            </div>
          </div>

          {/* Reduced Motion Mode */}
          <div className="bg-white/[0.02] border border-white/[0.08] p-3 rounded-sm">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-white/40 mb-2">MOTION SENSITIVITY</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setReducedMotionSim(false)}
                data-testid="exp02-motion-full"
                className={`flex-1 py-1 px-2 text-[10px] font-mono uppercase rounded-sm border cursor-pointer ${
                  !reducedMotionSim ? 'bg-white/20 border-white text-white font-bold' : 'border-white/10 text-white/40'
                }`}
              >
                Full Motion
              </button>
              <button
                onClick={() => setReducedMotionSim(true)}
                data-testid="exp02-motion-reduced"
                className={`flex-1 py-1 px-2 text-[10px] font-mono uppercase rounded-sm border cursor-pointer ${
                  reducedMotionSim ? 'bg-[#FF3B30] border-[#FF3B30] text-white font-bold' : 'border-white/10 text-white/40'
                }`}
              >
                Reduced Motion
              </button>
            </div>
          </div>
        </div>

        {/* Live Interactive Target Sandbox */}
        <div 
          onClick={handleMiss}
          className="relative bg-black/60 border border-white/10 rounded-sm p-6 flex flex-col items-center justify-center min-h-[160px] cursor-crosshair select-none"
        >
          <span className="absolute top-2 left-3 font-mono text-[9px] text-white/30 uppercase">
            TAP ACCURACY BENCHMARK // CLICK THE TARGET
          </span>

          <div className="flex items-center gap-4 my-2">
            <button
              onClick={handleTargetClick}
              data-testid="exp02-target-button"
              data-suppress-focus={focusStyle === 'none' ? 'true' : 'false'}
              className={`font-mono text-xs font-bold uppercase rounded-sm cursor-pointer flex items-center justify-center ${
                targetSize === 'standard' ? 'w-6 h-6 text-[9px] p-0' : 'w-12 h-12 text-xs px-3'
              } ${
                contrastMode === 'low' 
                  ? 'bg-neutral-800 text-neutral-600 border border-neutral-700' 
                  : 'bg-white text-black border border-white shadow-lg'
              } ${
                focusStyle === 'visible' 
                  ? 'focus:outline-none focus:ring-4 focus:ring-[#FF3B30]' 
                  : 'focus:outline-none'
              } ${
                reducedMotionSim 
                  ? 'transition-none transform-none' 
                  : 'transition-all duration-300 hover:scale-105 active:scale-95'
              }`}
            >
              ✓
            </button>
            <div className="text-left font-mono text-xs">
              <div className={contrastMode === 'low' ? 'text-neutral-600' : 'text-white'}>
                {targetSize === 'standard' ? '24×24px Target' : '48×48px Dignified Target'}
              </div>
              <div className="text-[10px] text-white/40" data-testid="exp02-hit-rate">
                Hit Rate: {testScore.taps} Hits / {testScore.misses} Misses
              </div>
            </div>
          </div>

          <span className="text-[9px] font-mono text-white/30 mt-2">
            Use TAB key to verify focus visibility compliance
          </span>
        </div>
      </div>

      {/* Compliance Audit Result */}
      <div className="border-t border-white/10 pt-4 flex justify-between items-center font-mono text-[10px]">
        <span className="text-white/40">AUDIT STATUS:</span>
        <span 
          data-testid="exp02-audit-status"
          className={`font-bold px-2 py-0.5 rounded-sm ${
          targetSize === 'accessible' && focusStyle === 'visible' && contrastMode === 'high'
            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
            : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
        }`}>
          {targetSize === 'accessible' && focusStyle === 'visible' && contrastMode === 'high'
            ? '✓ FULL WCAG 2.2 AA CONFORMANCE'
            : '⚠ CONFORMANCE BOTTLENECK DETECTED'}
        </span>
      </div>
    </div>
  );
};

// Experiment 03: From Thought to Interface (Interactive Design System Engine)
const SystemExperiment: React.FC = () => {
  const [typography, setTypography] = useState<'grotesk' | 'mono' | 'editorial'>('grotesk');
  const [spacing, setSpacing] = useState<'compact' | 'balanced' | 'generous'>('balanced');
  const [radius, setRadius] = useState<'sharp' | 'swiss' | 'soft'>('swiss');
  const [density, setDensity] = useState<'minimal' | 'bold'>('bold');

  return (
    <div className="bg-[#09090E] border border-white/10 rounded-sm p-6 sm:p-8 flex flex-col justify-between h-full">
      <div>
        {/* Header Telemetry */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">
              EXP_03 // COMPUTATIONAL CRAFT
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-white/50">
            SYSTEM SYNTHESIZER
          </span>
        </div>

        <h4 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2">
          From Thought to Interface
        </h4>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
          Sculpt design tokens in real time. Manipulate typographic voice, structural padding, and architectural geometry to observe visual hierarchy transformation.
        </p>

        {/* Live Control Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Typography Selector */}
          <div className="bg-white/[0.02] border border-white/[0.08] p-3 rounded-sm">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-white/40 mb-2">TYPOGRAPHIC VOICE</span>
            <div className="flex gap-1">
              {(['grotesk', 'mono', 'editorial'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTypography(t)}
                  data-testid={`exp03-type-${t}`}
                  className={`flex-1 py-1 px-1.5 text-[9px] font-mono uppercase rounded-sm border cursor-pointer ${
                    typography === t ? 'bg-[#FF3B30] border-[#FF3B30] text-white font-bold' : 'border-white/10 text-white/40'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Spacing Selector */}
          <div className="bg-white/[0.02] border border-white/[0.08] p-3 rounded-sm">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-white/40 mb-2">SPATIAL RHYTHM</span>
            <div className="flex gap-1">
              {(['compact', 'balanced', 'generous'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSpacing(s)}
                  data-testid={`exp03-space-${s}`}
                  className={`flex-1 py-1 px-1.5 text-[9px] font-mono uppercase rounded-sm border cursor-pointer ${
                    spacing === s ? 'bg-[#FF3B30] border-[#FF3B30] text-white font-bold' : 'border-white/10 text-white/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Radius */}
          <div className="bg-white/[0.02] border border-white/[0.08] p-3 rounded-sm">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-white/40 mb-2">CORNER ARCHITECTURE</span>
            <div className="flex gap-1">
              {(['sharp', 'swiss', 'soft'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  data-testid={`exp03-radius-${r}`}
                  className={`flex-1 py-1 px-1.5 text-[9px] font-mono uppercase rounded-sm border cursor-pointer ${
                    radius === r ? 'bg-[#FF3B30] border-[#FF3B30] text-white font-bold' : 'border-white/10 text-white/40'
                  }`}
                >
                  {r === 'sharp' ? '0px' : r === 'swiss' ? '4px' : '16px'}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Density */}
          <div className="bg-white/[0.02] border border-white/[0.08] p-3 rounded-sm">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-white/40 mb-2">HIERARCHY WEIGHT</span>
            <div className="flex gap-1">
              {(['minimal', 'bold'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  data-testid={`exp03-density-${d}`}
                  className={`flex-1 py-1 px-1.5 text-[9px] font-mono uppercase rounded-sm border cursor-pointer ${
                    density === d ? 'bg-[#FF3B30] border-[#FF3B30] text-white font-bold' : 'border-white/10 text-white/40'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Transformed UI Artifact */}
        <div className="bg-black/60 border border-white/10 p-5 rounded-sm flex items-center justify-center">
          <div
            data-testid="exp03-preview-card"
            className={`w-full max-w-sm border transition-all duration-300 ${
              radius === 'sharp' ? 'rounded-none' : radius === 'swiss' ? 'rounded-[4px]' : 'rounded-2xl'
            } ${
              spacing === 'compact' ? 'p-3' : spacing === 'balanced' ? 'p-5' : 'p-7'
            } ${
              density === 'bold' ? 'bg-[#101018] border-white/30 shadow-xl' : 'bg-transparent border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <span className={`text-[10px] uppercase tracking-widest text-[#FF3B30] ${
                typography === 'mono' ? 'font-mono' : typography === 'editorial' ? 'font-serif italic' : 'font-sans font-bold'
              }`}>
                TELEMETRY // LIVE NODE
              </span>
              <span className="font-mono text-[9px] text-white/40">2026.10</span>
            </div>

            <h5 className={`uppercase mb-2 text-white ${
              typography === 'mono' ? 'font-mono text-base' : typography === 'editorial' ? 'font-serif text-xl tracking-normal' : 'font-sans text-lg font-black tracking-tight'
            }`}>
              Design for humans.
            </h5>

            <p className={`text-xs text-neutral-300 leading-relaxed mb-4 ${
              typography === 'mono' ? 'font-mono' : typography === 'editorial' ? 'font-serif' : 'font-sans'
            }`}>
              {density === 'bold' 
                ? 'High-contrast spatial rhythm balancing human intuition and computational precision.' 
                : 'Subtle low-contrast composition.'}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="font-mono text-[10px] text-white/50">WCAG BENCHMARK</span>
              <span className="font-mono text-[10px] text-[#FF3B30] font-bold">4.5:1 PASS</span>
            </div>
          </div>
        </div>

      </div>

      {/* Synthesis Active Token Manifest */}
      <div className="border-t border-white/10 pt-4 flex justify-between items-center font-mono text-[9px] text-white/40">
        <span>ACTIVE TOKENS:</span>
        <span className="text-white font-mono" data-testid="exp03-active-tokens">
          {typography.toUpperCase()} · {spacing.toUpperCase()} · {radius.toUpperCase()} · {density.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export const HumanInterfaceLab: React.FC = () => {
  return (
    <section id="experiments" className="relative py-24 md:py-32 bg-[#050508] border-t border-white/10 z-20 text-white select-none">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header Synchronized with Swiss Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-16 md:mb-20 border-b border-white/10 pb-6 items-end">
          <div className="md:col-span-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
              <h2 className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/80 font-medium">
                02 /// HUMAN INTERFACE LAB
              </h2>
            </div>
            <h3 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white">
              Experiments in how digital experiences feel.
            </h3>
          </div>

          <div className="md:col-span-6 flex flex-col md:items-end justify-end mt-4 md:mt-0">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40">
              SIGNATURE HCI PLAYGROUND
            </span>
            <p className="text-xs text-neutral-400 font-mono mt-1 max-w-md md:text-right">
              Interactive demonstrations of friction, radical accessibility, and real-time design systems.
            </p>
          </div>
        </div>

        {/* 3 Signature Experiments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <FeelExperiment />
          <AccessibilityExperiment />
          <SystemExperiment />
        </div>

      </div>
    </section>
  );
};

export default HumanInterfaceLab;
