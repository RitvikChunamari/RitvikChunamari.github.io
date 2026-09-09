import React, { useEffect, useState, useRef } from 'react';
import { playEdithSound } from '../src/utils/edithSound';

interface MinimalLoaderProps {
  onComplete: () => void;
}

interface TriadItem {
  step: string;
  word: string;
  descriptor: string;
  subtext: string;
  tag: string;
}

const TRIAD_STEPS: TriadItem[] = [
  {
    step: '01',
    word: 'Think.',
    descriptor: 'COGNITIVE ARCHITECTURE',
    subtext: 'Problem space deconstruction, human empathy & strategic inquiry.',
    tag: 'LOGIC'
  },
  {
    step: '02',
    word: 'Design.',
    descriptor: 'SENSORY HARMONY',
    subtext: 'Swiss spatial systems, radical accessibility & typographic precision.',
    tag: 'CRAFT'
  },
  {
    step: '03',
    word: 'Create.',
    descriptor: 'INTERACTIVE REALITY',
    subtext: 'Vibe coding, generative WebGL & living digital experiences.',
    tag: 'CODE'
  }
];

export const MinimalLoader: React.FC<MinimalLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [textDissolve, setTextDissolve] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isWordsMounted, setIsWordsMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const lastProgressTick = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mount animation for typography rows
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWordsMounted(true);
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  // Update active triad step based on progress
  useEffect(() => {
    if (progress < 34) {
      setActiveStep(0);
    } else if (progress < 67) {
      setActiveStep(1);
    } else if (progress < 96) {
      setActiveStep(2);
    } else {
      setActiveStep(3); // All 3 words illuminated in unison at 96-100%
    }
  }, [progress]);

  // Track mouse for ambient Awwwards spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  // Main Counter Interpolation & Sound triggers
  useEffect(() => {
    let animFrame: number;
    const startTime = Date.now();
    const duration = 2800; // 2.8s cinematic Awwwards pacing

    let current = 0;

    const update = () => {
      const elapsed = Date.now() - startTime;
      const linear = Math.min(elapsed / duration, 1);
      
      // Multi-stage cinematic ease: quick start, contemplative mid, swift finish
      const ease = linear < 0.5
        ? 4 * linear * linear * linear
        : 1 - Math.pow(-2 * linear + 2, 3) / 2;

      const target = ease * 100;
      current += (target - current) * 0.18;
      const rounded = Math.min(100, Math.floor(current));

      setProgress(rounded);

      // Sound blip at milestone transitions
      if (rounded - lastProgressTick.current >= 15 && rounded < 95) {
        lastProgressTick.current = rounded;
        playEdithSound('blip');
      }

      if (linear < 1 || current < 99.4) {
        animFrame = requestAnimationFrame(update);
      } else {
        setProgress(100);
        playEdithSound('boot');

        // Step 1: Text dissolve & flare
        setTextDissolve(true);

        // Step 2: 5-pillar architectural curtain lift
        setTimeout(() => {
          setIsFinishing(true);
        }, 260);

        // Step 3: Complete transition to reveal the portfolio hero
        setTimeout(() => {
          onComplete();
        }, 1150);
      }
    };

    animFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrame);
  }, [onComplete]);

  // Skip handler for instant accessibility
  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProgress(100);
    playEdithSound('boot');
    setTextDissolve(true);
    setTimeout(() => setIsFinishing(true), 150);
    setTimeout(() => onComplete(), 750);
  };

  // Rolling Odometer digits
  const hundreds = Math.floor(progress / 100);
  const tens = Math.floor((progress % 100) / 10);
  const units = progress % 10;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[10000] pointer-events-auto select-none overflow-hidden bg-[#070707] text-[#ededed]"
    >
      {/* 5-Pillar Architectural Shutter Panels (Awwwards Staggered Curtain Reveal) */}
      <div className="absolute inset-0 z-10 pointer-events-none flex">
        {[0, 1, 2, 3, 4].map((col) => (
          <div
            key={col}
            className="flex-1 h-full bg-[#070707] border-r border-white/[0.04] last:border-r-0 transition-transform duration-[850ms] ease-[cubic-bezier(0.85,0,0.15,1)]"
            style={{
              transform: isFinishing ? 'translateY(-101%)' : 'translateY(0%)',
              transitionDelay: `${col * 65}ms`
            }}
          />
        ))}
      </div>

      {/* Interactive Mouse Spotlight (Subtle ambient sheen across typography) */}
      <div 
        className="absolute inset-0 pointer-events-none z-15 opacity-60 transition-opacity duration-700"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255, 153, 51, 0.08) 0%, rgba(99, 102, 241, 0.04) 40%, transparent 75%)`
        }}
      />

      {/* Anamorphic Laser Horizon Flash on 100% completion */}
      <div 
        className={`absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff9933] via-white to-transparent transform -translate-y-1/2 transition-all duration-700 ease-out pointer-events-none z-40 ${
          textDissolve && !isFinishing 
            ? 'opacity-100 scale-x-100 shadow-[0_0_50px_10px_rgba(255,153,51,0.9)]' 
            : 'opacity-0 scale-x-0'
        }`}
      />

      {/* Fine Swiss Architectural Crop Marks & Coordinates */}
      <div className="absolute inset-0 pointer-events-none z-20 p-6 md:p-12 flex flex-col justify-between opacity-35 font-mono text-[10px] text-neutral-500">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 border-t border-l border-white/60"></span>
            <span>SYSTEM_INIT // 2026</span>
          </div>
          <div className="hidden sm:block">
            <span>AWWWARDS RECOGNITION ARCHIVE</span>
          </div>
          <div className="flex items-center space-x-3">
            <span>[ 60 FPS ]</span>
            <span className="w-2 h-2 border-t border-r border-white/60"></span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 border-b border-l border-white/60"></span>
            <span>LAT 39.8028° N, LON 105.0875° W</span>
          </div>
          <div className="hidden md:block">
            <span>ARVADA &amp; BOULDER, COLORADO</span>
          </div>
          <div className="flex items-center space-x-3">
            <span>EDITH // ACTIVE</span>
            <span className="w-2 h-2 border-b border-r border-white/60"></span>
          </div>
        </div>
      </div>

      {/* Main Kinetic Stage */}
      <div 
        className={`relative z-30 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-14 transition-all duration-600 ease-out ${
          textDissolve ? 'opacity-0 scale-[0.98] blur-[2px]' : 'opacity-100 scale-100 blur-none'
        }`}
      >
        
        {/* Top Header Row */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase pt-2">
          
          {/* Identity & Pulsing Radar */}
          <div className="flex items-center space-x-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff9933] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff9933]"></span>
            </span>
            <span className="text-white font-bold tracking-[0.25em]">RITVIK CHUNAMARI</span>
          </div>

          {/* Center Manifesto Tag */}
          <div className="hidden sm:flex items-center space-x-3 text-neutral-500 font-mono text-[10px]">
            <span className="text-[#ff9933]">●</span>
            <span className="tracking-[0.3em]">THE CREATIVE TRIAD</span>
          </div>

          {/* Rolling Odometer Counter (Top Right) */}
          <div className="flex items-baseline space-x-1 font-mono">
            <span className="text-[10px] text-neutral-500 mr-2 tracking-widest">LOADING</span>
            <div className="flex items-baseline font-bold text-white text-base sm:text-lg tracking-tight">
              {/* Hundreds (0 -> 1) */}
              <div className="h-[1.2em] overflow-hidden inline-flex flex-col">
                <div 
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center"
                  style={{ transform: `translateY(-${hundreds * 50}%)` }}
                >
                  <span className="h-[1.2em] flex items-center justify-center">0</span>
                  <span className="h-[1.2em] flex items-center justify-center">1</span>
                </div>
              </div>

              {/* Tens (0 -> 9) */}
              <div className="h-[1.2em] overflow-hidden inline-flex flex-col">
                <div 
                  className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center"
                  style={{ transform: `translateY(-${tens * 10}%)` }}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <span key={num} className="h-[1.2em] flex items-center justify-center">
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              {/* Units (0 -> 9) */}
              <div className="h-[1.2em] overflow-hidden inline-flex flex-col">
                <div 
                  className="transition-transform duration-150 ease-out flex flex-col items-center"
                  style={{ transform: `translateY(-${units * 10}%)` }}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <span key={num} className="h-[1.2em] flex items-center justify-center">
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              <span className="text-xs text-[#ff9933] ml-1 font-light">%</span>
            </div>
          </div>
        </div>

        {/* Center Stage: Monumental "Think. Design. Create." Triad Typography */}
        <div className="my-auto w-full max-w-6xl mx-auto flex flex-col items-start justify-center py-4 sm:py-6">
          
          {/* Micro Category Lead */}
          <div className="mb-4 sm:mb-6 flex items-center space-x-3 text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-neutral-500">
            <span className="text-[#ff9933]">//</span>
            <span>PHILOSOPHY &amp; DISCIPLINE</span>
            <span className="hidden sm:inline text-neutral-700">|</span>
            <span className="hidden sm:inline text-neutral-400">
              {activeStep === 0 && 'PHASE 01: COGNITION & ARCHITECTURE'}
              {activeStep === 1 && 'PHASE 02: SPATIAL INTERFACES & ACCESSIBILITY'}
              {activeStep === 2 && 'PHASE 03: VIBE CODING & FUNCTIONAL REALITY'}
              {activeStep === 3 && 'SYNTHESIS COMPLETE: READY FOR IMMERSION'}
            </span>
          </div>

          {/* Staggered Giant Word Rows */}
          <div className="w-full flex flex-col space-y-1 sm:space-y-2 md:space-y-3">
            {TRIAD_STEPS.map((item, index) => {
              // Determine if this specific item is active or if all 3 are ignited at 96%+
              const isCurrent = activeStep === index;
              const isAllLit = activeStep === 3;
              const isHighlighted = isCurrent || isAllLit;

              return (
                <div 
                  key={item.step}
                  className="w-full overflow-hidden border-b border-white/[0.07] pb-2 sm:pb-3 md:pb-4 group"
                >
                  <div 
                    className="flex flex-col md:flex-row md:items-baseline justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform"
                    style={{
                      transform: isWordsMounted ? 'translateY(0%)' : 'translateY(110%)',
                      transitionDelay: `${index * 140}ms`
                    }}
                  >
                    
                    {/* Left: Step Index & Giant Word */}
                    <div className="flex items-baseline space-x-3 sm:space-x-6 md:space-x-8">
                      
                      {/* Step Number */}
                      <span 
                        className={`font-mono text-xs sm:text-sm md:text-base tracking-widest transition-colors duration-500 ${
                          isHighlighted ? 'text-[#ff9933]' : 'text-neutral-600'
                        }`}
                      >
                        {item.step}
                      </span>

                      {/* Giant Word */}
                      <div className="flex items-baseline">
                        <span 
                          className={`font-sans font-bold tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-[7.5vw] leading-[0.9] uppercase transition-all duration-500 ${
                            isHighlighted 
                              ? 'text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.35)] scale-100' 
                              : 'text-white/20 scale-[0.98]'
                          }`}
                        >
                          {item.word.replace('.', '')}
                        </span>
                        
                        {/* Dot with Accent Color */}
                        <span 
                          className={`font-sans font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[7.5vw] leading-[0.9] transition-all duration-500 ${
                            isHighlighted 
                              ? 'text-[#ff9933] drop-shadow-[0_0_20px_rgba(255,153,51,0.8)]' 
                              : 'text-neutral-700'
                          }`}
                        >
                          .
                        </span>
                      </div>

                    </div>

                    {/* Right: Technical Descriptor & Context */}
                    <div className="mt-2 md:mt-0 flex items-center space-x-4 pl-8 md:pl-0">
                      
                      <div 
                        className={`transition-all duration-500 text-left md:text-right ${
                          isHighlighted ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-2'
                        }`}
                      >
                        <div className="flex items-center md:justify-end space-x-2">
                          <span 
                            className={`px-2 py-0.5 rounded-sm font-mono text-[9px] uppercase tracking-widest ${
                              isHighlighted 
                                ? 'bg-white/10 text-[#ff9933] border border-[#ff9933]/30' 
                                : 'bg-transparent text-neutral-600 border border-transparent'
                            }`}
                          >
                            {item.tag}
                          </span>
                          <span className="font-mono text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300">
                            {item.descriptor}
                          </span>
                        </div>
                        <p className="hidden md:block text-[11px] text-neutral-500 font-sans mt-0.5 max-w-sm">
                          {item.subtext}
                        </p>
                      </div>

                      {/* Active Indicator Arrow */}
                      <span 
                        className={`hidden lg:inline-block font-mono text-sm transition-all duration-500 ${
                          isHighlighted ? 'text-white translate-x-0 opacity-100' : 'text-neutral-700 -translate-x-2 opacity-0'
                        }`}
                      >
                        →
                      </span>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* High-Precision Progress Scrubber Track */}
          <div className="w-full mt-8 sm:mt-12">
            <div className="w-full h-[2px] bg-neutral-900 overflow-hidden relative rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-neutral-700 via-[#ff9933] to-white transition-all duration-150 ease-out shadow-[0_0_12px_rgba(255,153,51,0.7)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Triad Milestones */}
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-mono text-neutral-500 mt-2.5 uppercase tracking-widest">
              <span className={progress >= 0 ? 'text-[#ff9933] font-semibold' : ''}>
                01 THINK [00%]
              </span>
              <span className={progress >= 34 ? 'text-[#ff9933] font-semibold' : ''}>
                02 DESIGN [34%]
              </span>
              <span className={progress >= 67 ? 'text-[#ff9933] font-semibold' : ''}>
                03 CREATE [67%]
              </span>
              <span className={progress >= 98 ? 'text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}>
                READY [100%]
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Footer Row */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-neutral-500 uppercase border-t border-neutral-800/80 pt-4 sm:pt-6">
          
          <div className="flex items-center space-x-3">
            <span className="text-neutral-600">[ IDENT ]</span>
            <span className="text-neutral-300">UX ARCHITECT &amp; VIBE CODER</span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-neutral-600">
            <span>SWISS MINIMALISM</span>
            <span>RADICAL ACCESSIBILITY</span>
            <span>THREE.JS &amp; REACT</span>
          </div>

          {/* Interactive Skip Button */}
          <button 
            onClick={handleSkip}
            className="group flex items-center space-x-2 text-neutral-500 hover:text-white transition-colors duration-200 cursor-pointer"
            title="Skip loading animation"
          >
            <span className="text-neutral-600 group-hover:text-[#ff9933] transition-colors">⚡</span>
            <span className="border-b border-transparent group-hover:border-white transition-all">SKIP INTRO</span>
            <span className="text-[9px] text-neutral-600 font-sans">↵</span>
          </button>

        </div>

      </div>

    </div>
  );
};

export default MinimalLoader;
