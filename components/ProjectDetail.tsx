import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { Project, Persona, UserJourney } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticWrapper from './MagneticWrapper';
import FigmaViewerWindow from './FigmaViewerWindow';
import SecurityUXSection from './SecurityUXSection';
import MumbaiLogoGenerator from './MumbaiLogoGenerator';

gsap.registerPlugin(ScrollTrigger);

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onNext: () => void;
}

// Sub-component for interactive Experience Journeys
const ExperienceJourneysSection: React.FC<{ userJourneys: UserJourney[] }> = ({ userJourneys }) => {
  const [activePersonaIdx, setActivePersonaIdx] = React.useState(0);
  const [activeStageIdx, setActiveStageIdx] = React.useState(0);
  const [viewMode, setViewMode] = React.useState<'timeline' | 'matrix'>('timeline');
  const trackRef = useRef<HTMLDivElement>(null);

  const activeJourney = userJourneys[activePersonaIdx] || userJourneys[0];

  const stageColors = [
    { border: 'border-[#FF3B30]', text: 'text-[#FF3B30]', bg: 'bg-[#FF3B30]/10', badge: 'bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/40' }, // Red
    { border: 'border-[#0055FF]', text: 'text-[#0055FF]', bg: 'bg-[#0055FF]/10', badge: 'bg-[#0055FF]/20 text-[#0055FF] border-[#0055FF]/40' }, // Blue
    { border: 'border-[#00C853]', text: 'text-[#00C853]', bg: 'bg-[#00C853]/10', badge: 'bg-[#00C853]/20 text-[#00C853] border-[#00C853]/40' }, // Green
    { border: 'border-[#FFCC00]', text: 'text-[#FFCC00]', bg: 'bg-[#FFCC00]/10', badge: 'bg-[#FFCC00]/20 text-[#FFCC00] border-[#FFCC00]/40' }, // Yellow
    { border: 'border-[#00f0ff]', text: 'text-[#00f0ff]', bg: 'bg-[#00f0ff]/10', badge: 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/40' }, // Cyan
  ];

  const scrollToStage = (stageIdx: number) => {
    setActiveStageIdx(stageIdx);
    if (trackRef.current) {
      const cards = trackRef.current.querySelectorAll('.stage-timeline-card');
      if (cards[stageIdx]) {
        cards[stageIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  const handlePrev = () => {
    if (activeStageIdx > 0) {
      scrollToStage(activeStageIdx - 1);
    } else if (trackRef.current) {
      trackRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (activeStageIdx < activeJourney.stages.length - 1) {
      scrollToStage(activeStageIdx + 1);
    } else if (trackRef.current) {
      trackRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  if (!userJourneys || userJourneys.length === 0) return null;

  return (
    <section className="w-full bg-cinema-black text-white py-12 md:py-20 border-t border-white/10 relative overflow-hidden">
      {/* Subtle Background Blueprint Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-15 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', 
          backgroundSize: '60px 60px' 
        }}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        
        {/* Section Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/10">
          <div>
            <span className="font-mono text-[10px] sm:text-xs text-[#0055FF] uppercase tracking-widest block mb-1">
              UX Flow & Journey Mapping
            </span>
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white">
              Experience Journeys
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full transition-all duration-300 ${
                  viewMode === 'timeline' 
                    ? 'bg-[#0055FF] text-white font-bold shadow-[0_0_15px_rgba(0,85,255,0.4)]' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Interactive Timeline
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full transition-all duration-300 ${
                  viewMode === 'matrix' 
                    ? 'bg-[#0055FF] text-white font-bold shadow-[0_0_15px_rgba(0,85,255,0.4)]' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Stages Matrix
              </button>
            </div>

            {/* Prev / Next buttons for Timeline mode */}
            {viewMode === 'timeline' && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 hover:border-white/30 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous Stage"
                  disabled={activeStageIdx === 0}
                >
                  ←
                </button>
                <button 
                  onClick={handleNext}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 hover:border-white/30 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Next Stage"
                  disabled={activeStageIdx === activeJourney.stages.length - 1}
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Persona Selector Tabs */}
        {userJourneys.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {userJourneys.map((j, idx) => {
              const isSelected = idx === activePersonaIdx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActivePersonaIdx(idx);
                    setActiveStageIdx(0);
                    if (trackRef.current) trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                  }}
                  className={`p-4 rounded-sm border text-left transition-all duration-300 flex items-center gap-3.5 cursor-pointer ${
                    isSelected 
                      ? 'bg-white/10 border-[#0055FF] shadow-[0_0_20px_rgba(0,85,255,0.2)] ring-1 ring-[#0055FF]/40' 
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-neutral-200'
                  }`}
                >
                  <span className={`font-mono text-xs uppercase font-bold px-2 py-1 rounded flex items-center justify-center ${
                    isSelected ? 'bg-[#0055FF] text-white shadow-sm' : 'bg-white/10 text-neutral-400'
                  }`}>
                    0{idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className={`block text-sm font-bold uppercase tracking-tight truncate ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                      {j.personaName}
                    </span>
                    <span className="block text-[11px] text-neutral-400 font-mono truncate">{j.role}</span>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#0055FF] animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Active Persona Header & Interactive Step Navigator */}
        <div className="bg-white/5 border border-white/10 p-5 sm:p-7 rounded-sm mb-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#0055FF] font-bold block mb-1">
                Active User Persona
              </span>
              <h4 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-tight flex items-center gap-2">
                {activeJourney.personaName}
                <span className="text-xs sm:text-sm font-normal text-neutral-400 font-mono">/ {activeJourney.role}</span>
              </h4>
            </div>
            
            {/* Stage Counter */}
            <div className="font-mono text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded self-start sm:self-auto text-neutral-300">
              Stage <span className="text-[#0055FF] font-bold font-mono">{activeStageIdx + 1}</span> of <span className="text-white font-bold font-mono">{activeJourney.stages.length}</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="relative pt-2 pb-2">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 z-0"></div>
            
            {/* Active Highlight Line */}
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-[#0055FF] to-[#00C853] -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: activeJourney.stages.length > 1 
                  ? `${(activeStageIdx / (activeJourney.stages.length - 1)) * 100}%` 
                  : '100%'
              }}
            ></div>

            {/* Stepper Nodes */}
            <div className="relative z-10 flex justify-between items-center">
              {activeJourney.stages.map((stg, sIdx) => {
                const isPassed = sIdx <= activeStageIdx;
                const isCurrent = sIdx === activeStageIdx;
                const colorObj = stageColors[sIdx % stageColors.length];

                return (
                  <button
                    key={sIdx}
                    onClick={() => scrollToStage(sIdx)}
                    className="flex flex-col items-center group focus:outline-none cursor-pointer"
                  >
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center font-mono text-[11px] font-bold transition-all duration-300 ${
                      isCurrent
                        ? `${colorObj.border} bg-black text-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]`
                        : isPassed
                        ? 'border-[#0055FF] bg-[#0055FF] text-white'
                        : 'border-white/20 bg-neutral-900 text-neutral-500 hover:border-white/50'
                    }`}>
                      {sIdx + 1}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-mono uppercase mt-2 hidden sm:block tracking-wider max-w-[100px] text-center truncate ${
                      isCurrent ? 'text-white font-bold' : isPassed ? 'text-neutral-300' : 'text-neutral-500'
                    }`}>
                      {stg.stage}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* View Mode 1: Interactive Timeline (Smooth Horizontal Carousel) */}
        {viewMode === 'timeline' && (
          <div className="relative">
            {/* Scrollable Track */}
            <div 
              ref={trackRef}
              className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory custom-scrollbar scroll-smooth"
            >
              {/* Start Phase Indicator */}
              <div className="flex flex-col justify-center shrink-0 w-[130px] sm:w-[160px] border-r border-white/10 pr-4 sm:pr-6 snap-start">
                <span className="font-mono text-[10px] uppercase text-[#00C853] tracking-widest mb-2 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]"></span> Start
                </span>
                <p className="text-base sm:text-lg font-bold uppercase leading-tight text-white/50">
                  Initial Discovery
                </p>
                <div className="w-full h-[1px] bg-white/20 mt-4"></div>
              </div>

              {/* Stage Cards */}
              {activeJourney.stages.map((stage, i) => {
                const colorObj = stageColors[i % stageColors.length];
                const isSelected = i === activeStageIdx;

                return (
                  <div 
                    key={i}
                    onClick={() => setActiveStageIdx(i)}
                    className={`stage-timeline-card shrink-0 w-[85vw] sm:w-[55vw] md:w-[400px] lg:w-[440px] bg-white/5 border-x border-b border-white/10 ${colorObj.border} border-t-4 p-5 sm:p-6 md:p-7 rounded-sm backdrop-blur-md flex flex-col justify-between snap-center transition-all duration-300 hover:bg-white/10 group cursor-pointer ${
                      isSelected ? 'ring-1 ring-white/30 bg-white/[0.08] shadow-2xl' : ''
                    }`}
                  >
                    <div>
                      {/* Stage Header */}
                      <div className="flex justify-between items-start mb-4 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <span className={`flex items-center justify-center px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${colorObj.badge}`}>
                            Stage 0{i + 1}
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold uppercase text-white tracking-tight">{stage.stage}</h4>
                      </div>

                      {/* Content Sections */}
                      <div className="space-y-4">
                        {/* Actions */}
                        <div>
                          <span className="block text-[9px] uppercase font-mono text-neutral-400 mb-1.5 tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF]"></span> User Actions
                          </span>
                          <ul className="text-xs sm:text-sm text-neutral-200 list-disc list-inside space-y-1 marker:text-[#0055FF]">
                            {stage.actions.map((a, idx) => (
                              <li key={idx} className="leading-relaxed">{a}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Thinking & Quotes */}
                        <div>
                          <span className="block text-[9px] uppercase font-mono text-neutral-400 mb-1.5 tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC00]"></span> Mindset & Internal Monologue
                          </span>
                          <div className="bg-white/5 p-3 rounded border-l-2 border-[#FFCC00] space-y-1">
                            {stage.thoughtsAndFeelings.map((t, idx) => (
                              <p key={idx} className="text-xs text-neutral-300 italic leading-relaxed">
                                "{t}"
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Stats (Pain vs Opps) */}
                    <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {stage.painPoints.length > 0 ? (
                        <div className="bg-[#FF3B30]/10 p-2.5 rounded-sm border border-[#FF3B30]/20">
                          <span className="block text-[9px] uppercase text-[#FF3B30] mb-0.5 font-bold font-mono">Pain Point</span>
                          <p className="text-[11px] text-neutral-300 leading-snug">{stage.painPoints[0]}</p>
                        </div>
                      ) : (
                        <div className="bg-white/5 p-2.5 rounded-sm border border-white/10 opacity-40">
                          <span className="block text-[9px] uppercase text-neutral-400 mb-0.5 font-mono">Pain Point</span>
                          <p className="text-[11px] text-neutral-400 italic">None reported</p>
                        </div>
                      )}

                      {stage.opportunities.length > 0 ? (
                        <div className="bg-[#00C853]/10 p-2.5 rounded-sm border border-[#00C853]/20">
                          <span className="block text-[9px] uppercase text-[#00C853] mb-0.5 font-bold font-mono">Opportunity</span>
                          <p className="text-[11px] text-neutral-300 leading-snug">{stage.opportunities[0]}</p>
                        </div>
                      ) : (
                        <div className="bg-white/5 p-2.5 rounded-sm border border-white/10 opacity-40">
                          <span className="block text-[9px] uppercase text-neutral-400 mb-0.5 font-mono">Opportunity</span>
                          <p className="text-[11px] text-neutral-400 italic">None reported</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* End Phase Indicator */}
              <div className="flex flex-col justify-center shrink-0 w-[130px] sm:w-[160px] border-l border-white/10 pl-4 sm:pr-4 opacity-60 snap-end">
                <span className="font-mono text-[10px] uppercase text-[#FFCC00] tracking-widest mb-2 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC00]"></span> Finish
                </span>
                <p className="text-base sm:text-lg font-bold uppercase leading-tight text-white">
                  Goal Achieved
                </p>
              </div>
            </div>

            {/* Mobile Scroll Hint */}
            <div className="sm:hidden flex items-center justify-center gap-2 mt-3 text-neutral-500 text-[10px] font-mono uppercase tracking-widest">
              <span>← Swipe horizontally to explore stages →</span>
            </div>
          </div>
        )}

        {/* View Mode 2: All Stages Grid / Matrix */}
        {viewMode === 'matrix' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {activeJourney.stages.map((stage, i) => {
              const colorObj = stageColors[i % stageColors.length];

              return (
                <div 
                  key={i}
                  className={`bg-white/5 border-x border-b border-white/10 ${colorObj.border} border-t-4 p-5 sm:p-6 rounded-sm backdrop-blur-md flex flex-col justify-between hover:bg-white/10 transition-colors`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                      <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${colorObj.badge}`}>Stage 0{i + 1}</span>
                      <h4 className="text-base sm:text-lg font-bold uppercase text-white">{stage.stage}</h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="block text-[9px] uppercase font-mono text-neutral-400 mb-1 tracking-widest">User Actions</span>
                        <ul className="text-xs text-neutral-200 list-disc list-inside space-y-1 marker:text-[#0055FF]">
                          {stage.actions.map((a, idx) => <li key={idx}>{a}</li>)}
                        </ul>
                      </div>

                      <div>
                        <span className="block text-[9px] uppercase font-mono text-neutral-400 mb-1 tracking-widest">Mindset & Thinking</span>
                        <div className="bg-white/5 p-2.5 rounded border-l-2 border-[#FFCC00]">
                          <ul className="text-xs text-neutral-300 italic space-y-1">
                            {stage.thoughtsAndFeelings.map((t, idx) => <li key={idx}>"{t}"</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                    {stage.painPoints.length > 0 && (
                      <div className="bg-[#FF3B30]/10 p-2 rounded border border-[#FF3B30]/20">
                        <span className="block text-[9px] uppercase text-[#FF3B30] font-bold font-mono">Pain Point</span>
                        <p className="text-[11px] text-neutral-300">{stage.painPoints[0]}</p>
                      </div>
                    )}
                    {stage.opportunities.length > 0 && (
                      <div className="bg-[#00C853]/10 p-2 rounded border border-[#00C853]/20">
                        <span className="block text-[9px] uppercase text-[#00C853] font-bold font-mono">Opportunity</span>
                        <p className="text-[11px] text-neutral-300">{stage.opportunities[0]}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};


const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onNext }) => {
  const { caseStudy } = project;
  const heroImageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLightbox, setActiveLightbox] = React.useState<{ image: string; title: string; subtitle?: string } | null>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Hero Image Parallax & Reveal
      if (heroImageRef.current && heroImageRef.current.parentElement) {
        const parent = heroImageRef.current.parentElement;
        
        gsap.fromTo(parent,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { 
            clipPath: 'inset(0% 0% 0% 0%)', 
            duration: 1.3, 
            ease: "expo.inOut",
            scrollTrigger: {
              trigger: parent,
              start: "top 88%",
            }
          }
        );

        gsap.to(heroImageRef.current, {
          y: 40,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: parent,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }

      // General Reveals
      const revealElements = gsap.utils.toArray('.gsap-reveal');
      revealElements.forEach((el: any) => {
        gsap.fromTo(el, 
          { y: 35, opacity: 0, filter: 'blur(10px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.0,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
            }
          }
        );
      });

      // Staggered Cards (Personas)
      const personas = gsap.utils.toArray('.persona-card');
      if (personas.length > 0) {
        gsap.fromTo(personas, 
          { y: 50, opacity: 0, scale: 0.98 },
          {
            y: 0, 
            opacity: 1, 
            scale: 1,
            duration: 1.2, 
            stagger: 0.18, 
            ease: "expo.out",
            scrollTrigger: {
              trigger: personas[0] as Element,
              start: "top 88%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [project]);

  const renderRevealWords = (text: string, baseDelay: number) => {
    return text.split(' ').map((word, index) => (
       <React.Fragment key={index}>
         <span className="inline-block overflow-hidden align-baseline">
           <span 
             className="inline-block animate-blur-in will-change-transform opacity-0"
             style={{ 
               animationDelay: `${baseDelay + (index * 0.04)}s`,
               animationFillMode: 'both'
             }}
           >
             {word}
           </span>
         </span>
         {' '}
       </React.Fragment>
    ));
  };

  const renderRevealHeading = (text: string, baseDelay: number) => {
     return (
       <span className="inline-block">
         {text.split('').map((char, index) => (
           <span key={index} className="inline-block overflow-hidden">
             <span
               className="inline-block animate-blur-in will-change-transform opacity-0"
               style={{ animationDelay: `${baseDelay + (index * 0.02)}s`, animationFillMode: 'both' }}
             >
               {char === ' ' ? '\u00A0' : char}
             </span>
           </span>
         ))}
       </span>
     );
  };

  if (!caseStudy) return null;

  return (
    <div ref={containerRef} className="min-h-screen bg-cinema-black/90 text-cinema-white relative z-20 pt-24 md:pt-32 pb-16 md:pb-24">
      
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 w-full z-40 px-4 sm:px-6 md:px-12 py-5 md:py-8 flex justify-between items-center mix-blend-difference pointer-events-none">
        <MagneticWrapper strength={0.4}>
          <button 
            onClick={onBack}
            className="pointer-events-auto text-xs font-bold uppercase tracking-widest hover:text-[#0055FF] transition-colors flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
            data-cursor-text="RETURN"
          >
            <span>←</span> Index
          </button>
        </MagneticWrapper>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Project Hero */}
        <div className="min-h-[35vh] sm:min-h-[40vh] md:min-h-[48vh] flex flex-col justify-center mb-12 md:mb-16 relative">
          <div className="mb-4 sm:mb-6 overflow-hidden">
             <span className="block font-mono text-[10px] sm:text-xs text-[#0055FF] uppercase tracking-widest animate-blur-in" style={{ animationDelay: '0.2s' }}>
                Case Study • {project.category}
             </span>
          </div>

          {project.logo && !caseStudy?.isBrandIdentity ? (
            <div className="relative w-full max-w-2xl animate-blur-in will-change-transform opacity-0" style={{ animationDelay: '0.35s', animationFillMode: 'both' }}>
               <div className="absolute inset-0 bg-[#0055FF]/15 blur-[80px] rounded-full pointer-events-none"></div>
               <img 
                 src={project.logo} 
                 alt={`${project.title} Logo`}
                 className="w-full max-h-[14vh] sm:max-h-[18vh] md:max-h-[22vh] object-contain object-left"
               />
               <h1 className="sr-only">{project.title}</h1>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.88] font-bold uppercase tracking-tighter text-white mix-blend-screen">
                 {renderRevealWords(project.title, 0.35)}
              </h1>
              {caseStudy?.isBrandIdentity && (
                <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#0055FF] animate-pulse"></span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-300 font-medium">
                    Design Project 1 • Organization Rebrand & Visual Identity
                  </span>
                </div>
              )}
              {caseStudy?.isSecurityUX && (
                <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#0055FF] animate-pulse"></span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-300 font-medium">
                    Enterprise UX Project • Operations ERP & Client Acquisition Portal
                  </span>
                </div>
              )}
              {caseStudy?.isOlympicIdentity && (
                <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse"></span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-300 font-medium">
                    Olympic Games Identity • Motion Design & Cultural Branding
                  </span>
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 border-t border-white/20 pt-6 mt-8 md:mt-10 animate-blur-in" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
             <div>
               <span className="block font-mono text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Role</span>
               <span className="text-xs sm:text-sm font-medium">{caseStudy.role}</span>
             </div>
             <div>
               <span className="block font-mono text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Year</span>
               <span className="text-xs sm:text-sm font-medium">{caseStudy.year}</span>
             </div>
             <div className="col-span-2">
               <span className="block font-mono text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5">Tech Stack</span>
               <div className="flex flex-wrap gap-1.5 sm:gap-2">
                 {caseStudy.technologies.map((tech, i) => (
                   <span key={i} className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 sm:py-1 bg-[#0055FF]/10 text-[#0055FF] rounded-sm">{tech}</span>
                 ))}
               </div>
             </div>
          </div>
        </div>

        {/* Full Width Hero Image Card (Visual Stage) */}
        {(project.image || caseStudy.videoUrl) && (
          <div className={`w-full ${caseStudy?.isOlympicIdentity ? 'h-[44vh] sm:h-[56vh] md:h-[68vh] lg:h-[76vh]' : 'h-[32vh] sm:h-[42vh] md:h-[55vh] lg:h-[60vh]'} mb-12 md:mb-16 relative overflow-hidden group rounded-sm gsap-reveal opacity-0 translate-y-8 bg-neutral-950 flex items-center justify-center p-6 sm:p-10 md:p-14 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]`}>
             <div className="absolute inset-0 bg-[#0055FF]/10 blur-[80px] pointer-events-none"></div>
             {caseStudy?.isOlympicIdentity ? (
               <div 
                 className="relative z-10 w-full h-full flex flex-col items-center justify-center cursor-pointer group"
                 onClick={() => setActiveLightbox({ 
                   image: "/projects/mumbai-olympics-2028/gateway-of-india.jpg", 
                   title: "Primary Gateway of India Master Lockup", 
                   subtitle: "Architectural Silhouette + Custom Wordmark + Olympic Rings" 
                 })}
               >
                 <img 
                   ref={heroImageRef}
                   src="/projects/mumbai-olympics-2028/gateway-of-india.jpg" 
                   alt="Primary Gateway of India Master Lockup" 
                   className="max-w-[90%] max-h-[86%] object-contain relative z-10 transition-all duration-[2s] ease-expo drop-shadow-[0_0_40px_rgba(255,153,51,0.25)] rounded"
                 />
                 <div className="flex items-center gap-2 mt-3 sm:mt-4 z-20">
                   <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#FF9933] bg-black/85 px-3.5 py-1 rounded-full border border-white/15 backdrop-blur-md flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse"></span>
                     Primary Gateway of India Master Lockup // Flagship Olympic Mark
                   </span>
                   <span className="font-mono text-[9px] text-white/50 bg-black/60 px-2.5 py-1 rounded-full border border-white/10 hidden sm:inline-block">
                     Click to Enlarge
                   </span>
                 </div>
               </div>
             ) : caseStudy?.videoUrl ? (
               <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                 <video 
                   src={caseStudy.videoUrl}
                   autoPlay
                   loop
                   muted
                   playsInline
                   controls
                   className="max-h-[85%] max-w-[85%] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.9)] border border-white/15"
                 />
                 <span className="font-mono text-[9px] uppercase tracking-widest text-[#FF9933] bg-black/80 px-3 py-1 rounded-full border border-white/15 mt-3 backdrop-blur-md">
                   Official Animated Motion Logo // 4K Broadcast Sting
                 </span>
               </div>
             ) : project.image?.endsWith('.png') || project.image?.endsWith('.svg') ? (
               <img 
                 ref={heroImageRef}
                 src={project.image} 
                 alt={project.title} 
                 className="max-w-[85%] max-h-[85%] object-contain relative z-10 transition-all duration-[2s] ease-expo drop-shadow-[0_0_40px_rgba(255,255,255,0.18)]"
               />
             ) : (
               <img 
                 ref={heroImageRef}
                 src={project.image} 
                 alt={project.title} 
                 className="w-full h-[120%] object-cover absolute top-0 left-0 transition-all duration-[2s] ease-expo"
                 style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
               />
             )}
          </div>
        )}

        {/* Structured Modular Sections */}
        <div className="space-y-12 md:space-y-16 mb-16 md:mb-24">
           
           {/* 1. Overview */}
           <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
              <div className="md:col-span-4 gsap-reveal">
                 <div className="md:sticky md:top-28">
                   <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                     <span className="text-[#0055FF] mr-2">●</span> {renderRevealHeading("Overview", 0.2)}
                   </h3>
                 </div>
              </div>
              <div className="md:col-span-8 gsap-reveal">
                 <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-sans font-medium leading-[1.35] text-white/90">
                   {caseStudy.overview}
                 </p>
              </div>
           </section>

           {/* 2. Problem Overview List */}
           {caseStudy.problemOverview && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#FF3B30] mr-2">●</span> {renderRevealHeading("Problem Overview", 0.2)}
                     </h3>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal">
                   <ul className="space-y-4 md:space-y-5">
                     {caseStudy.problemOverview.map((item, idx) => (
                       <li key={idx} className="border-l-2 border-[#FF3B30]/30 pl-4 sm:pl-6 hover:border-[#FF3B30] transition-colors duration-300">
                         <span className="block text-xs sm:text-sm font-bold uppercase tracking-wide text-white mb-0.5">
                           <span className="text-[#FF3B30] mr-1.5">•</span> {item.title}
                         </span>
                         <span className="text-xs sm:text-sm text-neutral-400 leading-relaxed">{item.description}</span>
                       </li>
                     ))}
                   </ul>
                </div>
             </section>
           )}

           {/* 3. Problem Statement */}
           {caseStudy.problemStatement && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#FF3B30] mr-2">●</span> {renderRevealHeading("Problem Statement", 0.2)}
                     </h3>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal">
                   <blockquote className="text-base sm:text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed border-l-2 sm:border-l-4 border-[#FF3B30] pl-4 sm:pl-6 md:pl-8 py-3 md:py-4 bg-gradient-to-r from-[#FF3B30]/10 via-[#FF3B30]/5 to-transparent backdrop-blur-sm rounded-r-sm text-white">
                     "{caseStudy.problemStatement}"
                   </blockquote>
                </div>
             </section>
           )}

           {/* 4. Solution Overview */}
           {caseStudy.detailedSolution && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#0055FF] mr-2">●</span> {renderRevealHeading("Proposed Solution", 0.2)}
                     </h3>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      {caseStudy.detailedSolution.map((sol, idx) => (
                        <div key={idx} className="bg-white/5 p-5 md:p-6 backdrop-blur-md rounded-sm border border-white/10 hover:border-[#0055FF] hover:bg-[#0055FF]/5 transition-all duration-300 group">
                           <span className="font-mono text-[10px] text-[#0055FF] mb-1.5 block font-bold">0{idx + 1}</span>
                           <h4 className="text-base sm:text-lg font-bold uppercase mb-1.5 group-hover:text-[#0055FF] transition-colors">{sol.title}</h4>
                           <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">{sol.description}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </section>
           )}

           {/* Brand History & Organizational Context (USPS) */}
           {caseStudy.historyAndContext && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#0055FF] mr-2">●</span> {renderRevealHeading("Historical Context", 0.2)}
                     </h3>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal">
                   <p className="text-base sm:text-lg md:text-xl text-neutral-300 leading-relaxed bg-white/5 p-6 sm:p-8 border border-white/10 rounded-sm backdrop-blur-md">
                     {caseStudy.historyAndContext}
                   </p>
                </div>
             </section>
           )}

           {/* Initial Explorations (Process Documentation) */}
           {caseStudy.initialExplorations && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#FFCC00] mr-2">●</span> {renderRevealHeading("Initial Explorations", 0.2)}
                     </h3>
                     <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block">Postcard & Typography Experiments</span>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal">
                   <div className="p-6 sm:p-8 bg-neutral-950 border-l-4 border-[#FFCC00] border-t border-r border-b border-white/10 rounded-r-sm">
                     <p className="text-sm sm:text-base md:text-lg text-neutral-200 leading-relaxed">
                       {caseStudy.initialExplorations}
                     </p>
                   </div>
                </div>
             </section>
           )}

           {/* Brand Audit: Legacy Identity Analysis (USPS) */}
           {caseStudy.auditCurrentIdentity && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#FF3B30] mr-2">●</span> {renderRevealHeading("Brand Audit", 0.2)}
                     </h3>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                     <div className="bg-[#00C853]/5 p-5 sm:p-6 border border-[#00C853]/20 rounded-sm">
                       <h4 className="font-mono text-xs uppercase font-bold text-[#00C853] mb-3 tracking-wider flex items-center gap-1.5">
                         <span>✓</span> What Works (Legacy Equity)
                       </h4>
                       <ul className="space-y-2.5">
                         {caseStudy.auditCurrentIdentity.whatWorks.map((item, idx) => (
                           <li key={idx} className="text-xs sm:text-sm text-neutral-300 leading-relaxed border-l border-[#00C853]/30 pl-2.5">
                             {item}
                           </li>
                         ))}
                       </ul>
                     </div>

                     <div className="bg-[#FF3B30]/5 p-5 sm:p-6 border border-[#FF3B30]/20 rounded-sm">
                       <h4 className="font-mono text-xs uppercase font-bold text-[#FF3B30] mb-3 tracking-wider flex items-center gap-1.5">
                         <span>✕</span> Why Redesign Is Needed
                       </h4>
                       <ul className="space-y-2.5">
                         {caseStudy.auditCurrentIdentity.whatDoesntWork.map((item, idx) => (
                           <li key={idx} className="text-xs sm:text-sm text-neutral-300 leading-relaxed border-l border-[#FF3B30]/30 pl-2.5">
                             {item}
                           </li>
                         ))}
                       </ul>
                     </div>
                   </div>
                </div>
             </section>
           )}

           {/* Brand Attributes (USPS) */}
           {caseStudy.brandAttributes && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#FFCC00] mr-2">●</span> {renderRevealHeading("Brand Attributes", 0.2)}
                     </h3>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal">
                   <div className="space-y-4 sm:space-y-5">
                     {caseStudy.brandAttributes.map((attr, idx) => (
                       <div key={idx} className="bg-white/5 p-5 sm:p-6 border border-white/10 rounded-sm hover:border-[#FFCC00] transition-colors">
                         <h4 className="text-base sm:text-lg font-bold uppercase text-white mb-1.5">{attr.title}</h4>
                         <p className="text-xs sm:text-sm text-neutral-400 mb-2.5 italic">"{attr.rationale}"</p>
                         <div className="text-xs text-neutral-200 bg-white/5 p-2.5 rounded border-l-2 border-[#FFCC00]">
                           <strong className="text-[#FFCC00] uppercase block mb-0.5 font-mono text-[9px]">Visual Expression:</strong>
                           {attr.visualExpression}
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
             </section>
           )}

           {/* Concept Directions (USPS) */}
           {caseStudy.conceptDirections && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#0055FF] mr-2">●</span> {renderRevealHeading("Concept Directions", 0.2)}
                     </h3>
                     <p className="text-xs text-neutral-400 leading-relaxed hidden md:block">
                       Initial exploratory avenues investigating seal iconography, patriotic flag accents, and envelope geometry before converging on typographic speed.
                     </p>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal">
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                     {caseStudy.conceptDirections.map((concept, idx) => {
                       const isDarkConcept = concept.image?.includes('mumbai') || concept.image?.includes('gateway') || concept.image?.includes('sea-link') || concept.image?.includes('basilica') || concept.image?.includes('pagoda');
                       return (
                         <div 
                           key={idx} 
                           onClick={() => concept.image && setActiveLightbox({ image: concept.image, title: concept.title, subtitle: concept.badge })}
                           className="bg-neutral-950 border border-white/10 rounded-sm overflow-hidden hover:border-[#0055FF] transition-all flex flex-col group cursor-pointer"
                         >
                           {concept.image && (
                             <div className={`h-48 sm:h-56 ${isDarkConcept ? 'bg-black' : 'bg-white'} p-4 flex items-center justify-center border-b border-white/10 relative overflow-hidden`}>
                               <img src={concept.image} alt={concept.title} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                 <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded backdrop-blur-sm border border-white/20">
                                   Enlarge
                                 </span>
                               </div>
                             </div>
                           )}
                           <div className="p-4 sm:p-5 flex-1 flex flex-col">
                             {concept.badge && (
                               <span className="font-mono text-[9px] uppercase font-bold text-[#0055FF] bg-[#0055FF]/10 px-2 py-0.5 rounded-sm mb-2 inline-block self-start border border-[#0055FF]/20">
                                 {concept.badge}
                               </span>
                             )}
                             <h4 className="text-sm sm:text-base font-bold uppercase text-white mb-1.5 group-hover:text-[#0055FF] transition-colors">{concept.title}</h4>
                             <p className="text-xs text-neutral-300 leading-relaxed">{concept.description}</p>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                </div>
             </section>
           )}

           {/* Refinement Rationale & Geometric Construction (USPS) */}
           {caseStudy.refinementRationale && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#00C853] mr-2">●</span> {renderRevealHeading("Refinement & Direction", 0.2)}
                     </h3>
                     <p className="text-xs text-neutral-400 leading-relaxed hidden md:block">
                       Shifting away from decorative wax seals to bold diagonal typography integrated with geometric vector precision.
                     </p>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal space-y-6">
                   <div className="bg-gradient-to-r from-[#00C853]/10 to-transparent p-6 sm:p-8 border-l-4 border-[#00C853] rounded-r-sm">
                     <p className="text-base sm:text-lg md:text-xl font-medium text-neutral-100 leading-relaxed">
                       {caseStudy.refinementRationale}
                     </p>
                   </div>

                   {/* Geometric Conversion Diagram & Refinement Output */}
                   {(caseStudy.refinementDiagram || caseStudy.refinementImage) && (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
                       {caseStudy.refinementDiagram && (
                         <div 
                           onClick={() => setActiveLightbox({ image: caseStudy.refinementDiagram!, title: "Geometric Construction & Vector Conversion Grid", subtitle: "USPS Vector Conversion" })}
                           className="bg-neutral-950 border border-white/10 rounded-sm overflow-hidden group cursor-pointer hover:border-[#00C853] transition-all"
                         >
                           <div className="bg-white p-3 h-52 sm:h-64 flex items-center justify-center relative overflow-hidden">
                             <img src={caseStudy.refinementDiagram} alt="Geometric Vector Construction" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                               <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded backdrop-blur-sm border border-white/20">
                                 View Grid & Geometry
                               </span>
                             </div>
                           </div>
                           <div className="p-4 bg-white/5 border-t border-white/10">
                             <span className="font-mono text-[9px] uppercase font-bold text-[#00C853] block mb-1">Vector Construction</span>
                             <h5 className="text-sm font-bold text-white uppercase group-hover:text-[#00C853] transition-colors">Geometric Conversion Grid</h5>
                             <p className="text-xs text-neutral-400 mt-1">Precise angle guidelines, envelope flap vector intersections, and slanted typographic grid alignment.</p>
                           </div>
                         </div>
                       )}

                       {caseStudy.refinementImage && (
                         <div 
                           onClick={() => setActiveLightbox({ image: caseStudy.refinementImage!, title: "Refined Final Mark Artboard", subtitle: "Production Artboard" })}
                           className="bg-neutral-950 border border-white/10 rounded-sm overflow-hidden group cursor-pointer hover:border-[#00C853] transition-all"
                         >
                           <div className="bg-white p-3 h-52 sm:h-64 flex items-center justify-center relative overflow-hidden">
                             <img src={caseStudy.refinementImage} alt="Refined Final Mark" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                               <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded backdrop-blur-sm border border-white/20">
                                 Enlarge Artboard
                               </span>
                             </div>
                           </div>
                           <div className="p-4 bg-white/5 border-t border-white/10">
                             <span className="font-mono text-[9px] uppercase font-bold text-[#00C853] block mb-1">Final Mark Output</span>
                             <h5 className="text-sm font-bold text-white uppercase group-hover:text-[#00C853] transition-colors">Refined Vector Artboard</h5>
                             <p className="text-xs text-neutral-400 mt-1">Calibrated lineweight balance and unified diagonal italic slant for high-speed dynamic legibility.</p>
                           </div>
                         </div>
                       )}
                     </div>
                   )}
                </div>
             </section>
           )}

           {/* Styleguide & Design System (USPS) */}
           {caseStudy.styleguide && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#0055FF] mr-2">●</span> {renderRevealHeading("Brand Styleguide", 0.2)}
                     </h3>
                     <p className="text-xs text-neutral-400 leading-relaxed hidden md:block">
                       Strict graphic standards governing color reproduction across RGB/CMYK, clear space isolation, and typographic hierarchy.
                     </p>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal space-y-6 sm:space-y-8">
                   {/* Color Palette Swatches */}
                   {caseStudy.styleguide.colorPalette && caseStudy.styleguide.colorPalette.length > 0 && (
                     <div className="bg-white/5 p-5 sm:p-6 md:p-8 border border-white/10 rounded-sm">
                       <h4 className="font-mono text-xs uppercase font-bold text-neutral-400 mb-4 sm:mb-6 tracking-wider flex items-center justify-between">
                         <span>Color Standards & Swatches</span>
                         <span className="text-[10px] text-neutral-500 font-normal">Physical & Digital Specs</span>
                       </h4>
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         {caseStudy.styleguide.colorPalette.map((color, idx) => (
                           <div 
                             key={idx} 
                             onClick={() => color.image && setActiveLightbox({ image: color.image, title: `${color.name} Swatch Card`, subtitle: color.hex })}
                             className="bg-neutral-950 border border-white/10 rounded-sm overflow-hidden flex flex-col group hover:border-[#0055FF] transition-all cursor-pointer"
                           >
                             {color.image ? (
                               <div className="bg-white p-3 h-44 sm:h-52 flex items-center justify-center relative overflow-hidden border-b border-white/10">
                                 <img src={color.image} alt={color.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                   <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded backdrop-blur-sm border border-white/20">
                                     Enlarge Swatch
                                   </span>
                                 </div>
                               </div>
                             ) : (
                               <div className="h-16 w-full border-b border-white/10" style={{ backgroundColor: color.hex }}></div>
                             )}
                             <div className="p-3.5 bg-white/5 flex-1 flex flex-col justify-between">
                               <div>
                                 <div className="flex items-center justify-between gap-2 mb-1">
                                   <span className="text-xs font-bold text-white block truncate">{color.name}</span>
                                   <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">{color.type}</span>
                                 </div>
                                 <span className="font-mono text-[11px] text-[#0055FF] font-bold block">{color.hex}</span>
                               </div>
                               {(color.rgb || color.cmyk) && (
                                 <div className="mt-2.5 pt-2 border-t border-white/10 font-mono text-[9px] text-neutral-400 space-y-0.5">
                                   {color.rgb && <div className="text-neutral-300">{color.rgb}</div>}
                                   {color.cmyk && <div className="text-neutral-400">{color.cmyk}</div>}
                                 </div>
                               )}
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* Clear Space Diagram */}
                   {caseStudy.styleguide.clearSpaceDiagram && (
                     <div 
                       onClick={() => setActiveLightbox({ image: caseStudy.styleguide!.clearSpaceDiagram!, title: "Clear Space & Minimum Size Specifications", subtitle: "Official Brand Architecture" })}
                       className="bg-white/5 p-4 sm:p-6 border border-white/10 rounded-sm overflow-hidden group cursor-pointer hover:border-[#0055FF] transition-all"
                     >
                       <div className="flex items-center justify-between mb-3">
                         <span className="font-mono text-[10px] uppercase font-bold text-[#0055FF] block">Clear Space & Minimum Size Diagram</span>
                         <span className="font-mono text-[9px] text-neutral-400 uppercase">Click to Expand</span>
                       </div>
                       <div className="w-full bg-white rounded overflow-hidden p-4 flex items-center justify-center relative">
                         <img src={caseStudy.styleguide.clearSpaceDiagram} alt="Clear Space Diagram" className="w-full max-h-80 object-contain group-hover:scale-[1.02] transition-transform duration-300" />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                           <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded backdrop-blur-sm border border-white/20">
                             Enlarge Full Diagram
                           </span>
                         </div>
                       </div>
                     </div>
                   )}

                   {/* Typography & Specs */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                     {/* Primary Typeface */}
                     <div className="bg-white/5 p-5 sm:p-6 border border-white/10 rounded-sm flex flex-col justify-between">
                       <div>
                         <span className="font-mono text-[9px] sm:text-[10px] uppercase text-[#0055FF] block mb-1 font-bold">Primary Typeface</span>
                         <h5 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-tight">{caseStudy.styleguide.primaryTypeface?.name || "Primary Typeface"}</h5>
                         <span className="text-xs text-neutral-400 block mb-3">{caseStudy.styleguide.primaryTypeface?.weight || "Regular"}</span>
                       </div>

                       {caseStudy.styleguide.primaryTypeface?.image ? (
                         <div 
                           onClick={() => setActiveLightbox({ image: caseStudy.styleguide!.primaryTypeface!.image!, title: `${caseStudy.styleguide.primaryTypeface?.name || 'Primary Typeface'} Specimen`, subtitle: "Primary Typographic Specimen" })}
                           className="bg-white p-4 rounded mt-3 cursor-pointer group hover:opacity-95 transition-opacity"
                         >
                           <img src={caseStudy.styleguide.primaryTypeface.image} alt="Primary Typeface Specimen" className="max-h-20 w-full object-contain" />
                           <span className="block text-center font-mono text-[8px] text-neutral-500 uppercase mt-2">Click to view specimen</span>
                         </div>
                       ) : (
                         <div className="text-2xl sm:text-3xl font-black italic tracking-wider text-white border-t border-white/10 pt-3 font-sans">
                           {caseStudy.styleguide.primaryTypeface?.sample || ""}
                         </div>
                       )}
                     </div>

                     {/* Secondary Typeface & Additional Images */}
                     <div className="bg-white/5 p-5 sm:p-6 border border-white/10 rounded-sm flex flex-col justify-between">
                       <div>
                         <span className="font-mono text-[9px] sm:text-[10px] uppercase text-[#0055FF] block mb-1 font-bold">Secondary Typeface</span>
                         <h5 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-tight">
                           {caseStudy.styleguide.secondaryTypeface?.name || "Azo Sans"}
                         </h5>
                         <span className="text-xs text-neutral-400 block mb-3">
                           {caseStudy.styleguide.secondaryTypeface?.weight || "Regular & Black Italic"}
                         </span>
                       </div>

                       {caseStudy.styleguide.secondaryTypeface?.image ? (
                         <div className="space-y-2 mt-3">
                           <div 
                             onClick={() => setActiveLightbox({ image: caseStudy.styleguide!.secondaryTypeface!.image!, title: "Secondary Typeface — 1-Line Lockup", subtitle: "Horizontal Typography" })}
                             className="bg-white p-3 rounded cursor-pointer group hover:opacity-95 transition-opacity"
                           >
                             <img src={caseStudy.styleguide.secondaryTypeface.image} alt="Secondary Typeface Specimen" className="max-h-8 w-full object-contain" />
                           </div>
                           {caseStudy.styleguide.secondaryTypeface.additionalImages && (
                             <div className="grid grid-cols-2 gap-2">
                               {caseStudy.styleguide.secondaryTypeface.additionalImages.map((addImg, aIdx) => (
                                 <div 
                                   key={aIdx}
                                   onClick={() => setActiveLightbox({ image: addImg, title: `Secondary Typographic Hierarchy — Variant 0${aIdx + 1}`, subtitle: "Stacked Formats" })}
                                   className="bg-white p-2.5 rounded cursor-pointer group hover:opacity-95 transition-opacity flex items-center justify-center h-20"
                                 >
                                   <img src={addImg} alt={`Typographic Variant ${aIdx + 1}`} className="max-h-full max-w-full object-contain" />
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>
                       ) : (
                         <div className="text-lg font-bold text-white border-t border-white/10 pt-3">
                           {caseStudy.styleguide.secondaryTypeface?.sample}
                         </div>
                       )}
                     </div>
                   </div>

                   {/* Minimum Size Standards */}
                   <div className="bg-white/5 p-5 sm:p-6 border border-white/10 rounded-sm">
                     <span className="font-mono text-[9px] sm:text-[10px] uppercase text-[#0055FF] block mb-2 font-bold">Reproduction Thresholds</span>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-300">
                       <div className="p-3 bg-white/5 rounded border border-white/10">
                         <strong className="text-white block uppercase font-mono text-[9px] mb-1 text-[#0055FF]">Clear Space Boundary:</strong>
                         {caseStudy.styleguide.clearSpace}
                       </div>
                       <div className="p-3 bg-white/5 rounded border border-white/10">
                         <strong className="text-white block uppercase font-mono text-[9px] mb-1 text-[#0055FF]">Digital Minimum:</strong>
                         {caseStudy.styleguide.minSizeDigital}
                       </div>
                       <div className="p-3 bg-white/5 rounded border border-white/10">
                         <strong className="text-white block uppercase font-mono text-[9px] mb-1 text-[#0055FF]">Print Minimum:</strong>
                         {caseStudy.styleguide.minSizePrint}
                       </div>
                     </div>
                   </div>
                </div>
             </section>
           )}

           {/* Brand Logo Lockups System (USPS) */}
           {caseStudy.lockups && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#0055FF] mr-2">●</span> {renderRevealHeading("Logo Lockups System", 0.2)}
                     </h3>
                     <p className="text-xs text-neutral-400 leading-relaxed hidden md:block">
                       A rigorous multi-configuration lockup architecture accommodating standalone icons, vertical facades, horizontal digital navigation, and reverse contrast environments.
                     </p>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                     {caseStudy.lockups.map((lockup, idx) => {
                       const isDarkBlue = lockup.variant === 'reverse-blue' || lockup.variant === 'dark';
                       const isBlack = lockup.variant === 'reverse-black';
                       return (
                         <div 
                           key={idx} 
                           onClick={() => lockup.image && setActiveLightbox({ image: lockup.image, title: lockup.title, subtitle: lockup.subtitle })}
                           className="bg-neutral-950 border border-white/10 rounded-sm overflow-hidden flex flex-col group hover:border-[#0055FF] transition-all cursor-pointer"
                         >
                           <div className={`p-6 sm:p-8 min-h-[190px] sm:min-h-[220px] flex items-center justify-center relative overflow-hidden ${
                             isDarkBlue ? 'bg-[#1A2754]' : isBlack ? 'bg-black' : 'bg-white'
                           }`}>
                             {lockup.image && (
                               <img 
                                 src={lockup.image} 
                                 alt={lockup.title} 
                                 className="max-h-28 sm:max-h-32 max-w-full object-contain group-hover:scale-105 transition-transform duration-300" 
                               />
                             )}
                             <span className={`absolute top-2.5 right-2.5 font-mono text-[8px] sm:text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                               isDarkBlue || isBlack 
                                 ? 'text-white bg-white/10 border-white/20' 
                                 : 'text-[#0055FF] bg-[#0055FF]/10 border-[#0055FF]/20'
                             }`}>
                               {lockup.tag}
                             </span>
                           </div>

                           <div className="p-4 sm:p-5 bg-white/5 flex-1 flex flex-col justify-between border-t border-white/10">
                             <div>
                               <h4 className="text-sm sm:text-base font-bold uppercase text-white mb-1 group-hover:text-[#0055FF] transition-colors">{lockup.title}</h4>
                               <p className="font-mono text-[9px] sm:text-[10px] text-[#0055FF] mb-2 font-semibold uppercase">{lockup.subtitle}</p>
                               <p className="text-xs text-neutral-300 leading-relaxed">{lockup.description}</p>
                             </div>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                </div>
             </section>
           )}

           {/* Brand Application Mockups (USPS) */}
           {caseStudy.mockups && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#00C853] mr-2">●</span> {renderRevealHeading("Application Mockups", 0.2)}
                     </h3>
                     <p className="text-xs text-neutral-400 leading-relaxed hidden md:block">
                       High-fidelity contextual renderings demonstrating the brand identity in tangible real-world physical and logistic environments.
                     </p>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal space-y-6 sm:space-y-8">
                   {caseStudy.mockups.map((mockup, idx) => (
                     <div 
                        key={idx} 
                        onClick={() => !mockup.videoUrl && setActiveLightbox({ image: mockup.image, title: mockup.title, subtitle: mockup.category })}
                        className={`group bg-neutral-950 border border-white/10 rounded-sm overflow-hidden hover:border-[#00C853] transition-all duration-300 shadow-2xl ${mockup.videoUrl ? '' : 'cursor-pointer'}`}
                      >
                        <div className="relative w-full h-[36vh] sm:h-[48vh] md:h-[56vh] overflow-hidden bg-black flex items-center justify-center p-2 sm:p-4">
                          {mockup.videoUrl ? (
                            <video 
                              src={mockup.videoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              controls
                              className="w-full h-full object-contain rounded-sm shadow-2xl"
                            />
                          ) : (
                            <img 
                              src={mockup.image} 
                              alt={mockup.title} 
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                          )}
                          {mockup.badge && (
                            <span className="absolute top-3 left-3 font-mono text-[9px] sm:text-[10px] uppercase font-bold text-black bg-[#00C853] px-2.5 py-0.5 rounded shadow z-10">
                              {mockup.badge}
                            </span>
                          )}
                          {!mockup.videoUrl && (
                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded backdrop-blur-sm border border-white/20">
                              Click to Expand
                            </div>
                          )}
                        </div>
                       <div className="p-5 sm:p-6 border-t border-white/10 bg-white/5">
                         <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold text-neutral-400 tracking-widest block mb-1">{mockup.category}</span>
                         <h4 className="text-base sm:text-xl font-bold uppercase text-white mb-2 group-hover:text-[#00C853] transition-colors">{mockup.title}</h4>
                         <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">{mockup.description}</p>
                       </div>
                     </div>
                   ))}
                </div>
             </section>
           )}

           {/* Brand Application & Collateral Gallery (USPS) */}
           {caseStudy.gallery && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#0055FF] mr-2">●</span> {renderRevealHeading("Applications & Gallery", 0.2)}
                     </h3>
                     <p className="text-xs text-neutral-400 leading-relaxed hidden md:block">
                       Archival gallery of all primary assets, geometric diagrams, colorways, and collateral mockups.
                     </p>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                     {caseStudy.gallery.map((item, idx) => (
                       <div 
                         key={idx} 
                         onClick={() => setActiveLightbox({ image: item.image, title: item.title, subtitle: item.category })}
                         className="group bg-neutral-950 border border-white/10 rounded-sm overflow-hidden hover:border-[#0055FF] transition-all duration-300 flex flex-col cursor-pointer"
                       >
                         <div className="relative h-52 sm:h-60 md:h-68 overflow-hidden bg-black flex items-center justify-center p-3">
                           <img 
                             src={item.image} 
                             alt={item.title} 
                             className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                           />
                           <span className="absolute top-3 left-3 font-mono text-[8px] sm:text-[9px] uppercase font-bold text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
                             {item.category}
                           </span>
                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                             <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded backdrop-blur-sm border border-white/20">
                               View Full
                             </span>
                           </div>
                         </div>
                         <div className="p-4 sm:p-5 border-t border-white/10 bg-white/5 flex-1 flex flex-col justify-between">
                           <div>
                             <h4 className="text-sm sm:text-base font-bold uppercase text-white group-hover:text-[#0055FF] transition-colors mb-1.5">{item.title}</h4>
                             <p className="text-xs text-neutral-300 leading-relaxed">{item.description}</p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
             </section>
           )}

            {/* 5. Hardware Specifications & Technical Constraints */}
            {caseStudy.hardwareSpecs && (
              <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                 <div className="md:col-span-4 gsap-reveal">
                    <div className="md:sticky md:top-28">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                        <span className="text-[#00E5FF] mr-2">●</span> {renderRevealHeading("Engineering Specs", 0.2)}
                      </h3>
                      {caseStudy.needStatement && (
                        <div className="p-4 bg-white/5 border border-white/10 rounded-sm mt-4">
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[#00E5FF] block mb-1 font-bold">Need Statement</span>
                          <p className="text-xs text-neutral-300 leading-relaxed">{caseStudy.needStatement}</p>
                        </div>
                      )}
                    </div>
                 </div>
                 <div className="md:col-span-8 gsap-reveal">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {caseStudy.hardwareSpecs.map((spec, idx) => (
                        <div key={idx} className="p-4 sm:p-5 bg-white/5 border border-white/10 rounded-sm hover:border-[#00E5FF]/60 hover:bg-[#00E5FF]/5 transition-all duration-300 group">
                          <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1 group-hover:text-[#00E5FF] transition-colors">
                            {spec.label}
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-white block">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                 </div>
              </section>
            )}

            {/* 6. Prior Art & Existing Solutions Benchmarking */}
            {caseStudy.existingSolutions && (
              <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                 <div className="md:col-span-4 gsap-reveal">
                    <div className="md:sticky md:top-28">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                        <span className="text-[#FFCC00] mr-2">●</span> {renderRevealHeading("Prior Art & Benchmark", 0.2)}
                      </h3>
                    </div>
                 </div>
                 <div className="md:col-span-8 gsap-reveal">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {caseStudy.existingSolutions.map((sol, idx) => (
                        <div key={idx} className="p-5 bg-neutral-950 border border-white/10 rounded-sm hover:border-[#FFCC00] transition-all flex flex-col justify-between">
                          <div>
                            <span className="font-mono text-[9px] text-[#FFCC00] font-bold block mb-1">REFERENCE 0{idx + 1}</span>
                            <h4 className="text-base font-bold uppercase text-white mb-2">{sol.name}</h4>
                            <p className="text-xs text-neutral-300 leading-relaxed mb-4">{sol.description}</p>
                          </div>
                          {sol.link && (
                            <a 
                              href={sol.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-[#FFCC00] hover:underline mt-auto"
                            >
                              External Reference →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                 </div>
              </section>
            )}

            {/* 7. Morphological Chart */}
            {caseStudy.morphologicalChart && (
              <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                 <div className="md:col-span-4 gsap-reveal">
                    <div className="md:sticky md:top-28">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                        <span className="text-[#0055FF] mr-2">●</span> {renderRevealHeading("Morphological Chart", 0.2)}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Exploration of mechanical, electronic, and user-interface sub-functions mapped across alternative technical implementation means.
                      </p>
                    </div>
                 </div>
                 <div className="md:col-span-8 gsap-reveal">
                    <div className="overflow-x-auto rounded-sm border border-white/10 bg-white/5 backdrop-blur-md">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-3 font-mono text-[10px] uppercase text-neutral-300 font-bold border-r border-white/10 w-1/3">Subfunction</th>
                            <th className="p-3 font-mono text-[10px] uppercase text-[#0055FF] font-bold">Means & Alternatives Evaluated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {caseStudy.morphologicalChart.map((row, idx) => (
                            <tr key={idx} className="border-b last:border-0 border-white/10 hover:bg-white/5 transition-colors">
                              <td className="p-3 font-medium text-white border-r border-white/10 align-top">
                                {row.subfunction}
                              </td>
                              <td className="p-3">
                                <div className="flex flex-wrap gap-1.5">
                                  {row.means.map((m, mIdx) => (
                                    <span key={mIdx} className="px-2 py-1 bg-white/10 text-[11px] rounded-sm text-neutral-200 border border-white/5">
                                      {m}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
              </section>
            )}

            {/* 8. PUGH Decision Selection Matrix */}
            {caseStudy.pughMatrix && (
              <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                 <div className="md:col-span-4 gsap-reveal">
                    <div className="md:sticky md:top-28">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                        <span className="text-[#00C853] mr-2">●</span> {renderRevealHeading("PUGH Decision Matrix", 0.2)}
                      </h3>
                      <div className="p-3.5 bg-[#00C853]/10 border border-[#00C853]/30 rounded-sm mt-3">
                        <span className="font-mono text-[9px] uppercase font-bold text-[#00C853] block mb-1">Selected Design</span>
                        <p className="text-xs text-white font-medium">Concept 1 ranked highest (+33 score) for reliability, hygiene, and low jamming risk.</p>
                      </div>
                    </div>
                 </div>
                 <div className="md:col-span-8 gsap-reveal">
                    <div className="overflow-x-auto rounded-sm border border-white/10 bg-white/5 backdrop-blur-md">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-3 font-mono text-[10px] uppercase text-neutral-300 font-bold border-r border-white/10">Design Criteria</th>
                            <th className="p-3 font-mono text-[10px] uppercase text-neutral-300 font-bold border-r border-white/10 text-center">Wt</th>
                            <th className="p-3 font-mono text-[10px] uppercase text-[#00C853] font-bold border-r border-white/10 bg-[#00C853]/10 text-center">Concept 1 (Selected)</th>
                            <th className="p-3 font-mono text-[10px] uppercase text-neutral-400 font-bold border-r border-white/10 text-center">Concept 2 (Datum)</th>
                            <th className="p-3 font-mono text-[10px] uppercase text-neutral-400 font-bold border-r border-white/10 text-center">Concept 3</th>
                            <th className="p-3 font-mono text-[10px] uppercase text-neutral-400 font-bold text-center">Concept 4</th>
                          </tr>
                        </thead>
                        <tbody>
                          {caseStudy.pughMatrix.map((row, idx) => (
                            <tr key={idx} className="border-b last:border-0 border-white/10 hover:bg-white/5 transition-colors">
                              <td className="p-3 font-semibold text-white border-r border-white/10">
                                {row.criteria}
                                {row.notes && <span className="block text-[10px] font-normal text-neutral-400 mt-0.5">{row.notes}</span>}
                              </td>
                              <td className="p-3 text-center font-mono font-bold text-neutral-300 border-r border-white/10">{row.weight}</td>
                              <td className="p-3 text-center font-mono font-bold text-[#00C853] bg-[#00C853]/5 border-r border-white/10">{row.concept1}</td>
                              <td className="p-3 text-center font-mono text-neutral-400 border-r border-white/10">{row.concept2}</td>
                              <td className="p-3 text-center font-mono text-neutral-400 border-r border-white/10">{row.concept3}</td>
                              <td className="p-3 text-center font-mono text-neutral-400">{row.concept4}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
              </section>
            )}

            {/* 9. Subsystem Architecture & CAD Assembly */}
            {caseStudy.subsystems && (
              <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                 <div className="md:col-span-4 gsap-reveal">
                    <div className="md:sticky md:top-28">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                        <span className="text-[#00E5FF] mr-2">●</span> {renderRevealHeading("Subsystem Architecture", 0.2)}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                        Modular mechatronic architecture dividing physical actuation, optoelectronic sensing, embedded UI, and structural casing into decoupled sub-assemblies.
                      </p>
                      {caseStudy.cadAttachmentUrl && (
                        <a 
                          href={caseStudy.cadAttachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00E5FF]/10 border border-[#00E5FF]/40 rounded-sm text-[#00E5FF] font-mono text-xs font-bold uppercase hover:bg-[#00E5FF]/20 transition-all shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                        >
                          Download 3D CAD Assembly (.zip) ↓
                        </a>
                      )}
                    </div>
                 </div>
                 <div className="md:col-span-8 gsap-reveal space-y-8">
                    {caseStudy.subsystems.map((sub, idx) => (
                      <div key={idx} className="bg-neutral-950 border border-white/10 rounded-sm overflow-hidden p-6 hover:border-[#00E5FF]/50 transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-white/10">
                          <h4 className="text-lg font-bold uppercase text-white">{sub.title}</h4>
                          <span className="font-mono text-[9px] uppercase font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-0.5 rounded border border-[#00E5FF]/30">
                            {sub.category}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">{sub.description}</p>
                        
                        {/* Parts Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                          {sub.parts.map((p, pIdx) => (
                            <div key={pIdx} className="p-3 bg-white/5 border border-white/10 rounded-sm flex items-center gap-3">
                              {p.image && (
                                <img src={p.image} alt={p.name} className="w-14 h-14 object-contain bg-black rounded p-1 border border-white/10 flex-shrink-0" />
                              )}
                              <div>
                                <span className="text-xs font-bold text-white block">{p.name}</span>
                                <span className="text-[10px] text-neutral-400 font-mono block leading-tight mt-0.5">{p.spec}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Circuit & Flowchart Previews */}
                        {(sub.circuitImage || sub.flowChartImage) && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10">
                            {sub.circuitImage && (
                              <div className="bg-black/80 p-2 rounded border border-white/10">
                                <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block mb-1">Subsystem Circuit Schematics</span>
                                <img src={sub.circuitImage} alt="Circuit Schematic" className="w-full h-32 object-contain rounded" />
                              </div>
                            )}
                            {sub.flowChartImage && (
                              <div className="bg-black/80 p-2 rounded border border-white/10">
                                <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-400 block mb-1">Logic Flowchart</span>
                                <img src={sub.flowChartImage} alt="Logic Flowchart" className="w-full h-32 object-contain rounded" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                 </div>
              </section>
            )}

            {/* 10. Motor Calculations & Power Budget */}
            {(caseStudy.motorTorqueCalculations || caseStudy.powerBudget) && (
              <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                 <div className="md:col-span-4 gsap-reveal">
                    <div className="md:sticky md:top-28">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                        <span className="text-[#FF3B30] mr-2">●</span> {renderRevealHeading("Physics & Power Sizing", 0.2)}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Torque sizing derived from mechanical density, volume, and gravitational mass with a 1.5× Factor of Safety to prevent stalling.
                      </p>
                    </div>
                 </div>
                 <div className="md:col-span-8 gsap-reveal space-y-6">
                    {caseStudy.motorTorqueCalculations?.map((calc, idx) => (
                      <div key={idx} className="p-5 bg-neutral-950 border border-white/10 rounded-sm">
                        <h4 className="text-sm sm:text-base font-bold uppercase text-white mb-2">{calc.title}</h4>
                        {calc.formula && (
                          <div className="p-3 bg-white/5 border-l-2 border-[#FF3B30] font-mono text-xs sm:text-sm text-[#FF3B30] rounded-r mb-3 overflow-x-auto">
                            {calc.formula}
                          </div>
                        )}
                        <ul className="space-y-1.5 text-xs text-neutral-300 mb-2">
                          {calc.steps.map((st, stIdx) => (
                            <li key={stIdx} className="flex items-start gap-2">
                              <span className="text-[#FF3B30] font-mono font-bold">•</span>
                              <span>{st}</span>
                            </li>
                          ))}
                        </ul>
                        {calc.notes && <p className="text-[10px] text-neutral-400 italic mt-2">{calc.notes}</p>}
                      </div>
                    ))}

                    {/* Power Budget Table */}
                    {caseStudy.powerBudget && (
                      <div className="overflow-x-auto rounded-sm border border-white/10 bg-white/5">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                              <th className="p-3 font-mono text-[10px] uppercase text-neutral-300 font-bold">Component</th>
                              <th className="p-3 font-mono text-[10px] uppercase text-neutral-300 font-bold">Rating</th>
                              <th className="p-3 font-mono text-[10px] uppercase text-neutral-300 font-bold text-center">Qty</th>
                              <th className="p-3 font-mono text-[10px] uppercase text-[#FF3B30] font-bold">Total Draw</th>
                            </tr>
                          </thead>
                          <tbody>
                            {caseStudy.powerBudget.map((pw, idx) => (
                              <tr key={idx} className="border-b last:border-0 border-white/10 hover:bg-white/5">
                                <td className="p-3 font-medium text-white">{pw.component}</td>
                                <td className="p-3 font-mono text-neutral-300">{pw.rating}</td>
                                <td className="p-3 font-mono text-center text-neutral-300">{pw.qty}</td>
                                <td className="p-3 font-mono font-bold text-[#FF3B30]">{pw.totalRating}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                 </div>
              </section>
            )}

            {/* 11. Bill of Materials (BOM) */}
            {caseStudy.billOfMaterials && (
              <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                 <div className="md:col-span-4 gsap-reveal">
                    <div className="md:sticky md:top-28">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                        <span className="text-[#0055FF] mr-2">●</span> {renderRevealHeading("Bill of Materials (BOM)", 0.2)}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Complete manufacturing and procurement specification table detailing materials, dimensional tolerances, and fabrication processes.
                      </p>
                    </div>
                 </div>
                 <div className="md:col-span-8 gsap-reveal">
                    <div className="overflow-x-auto rounded-sm border border-white/10 bg-white/5 backdrop-blur-md max-h-[500px]">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="sticky top-0 bg-neutral-900 z-10">
                          <tr className="border-b border-white/10">
                            <th className="p-2.5 font-mono text-[9px] uppercase text-neutral-400 font-bold">#</th>
                            <th className="p-2.5 font-mono text-[9px] uppercase text-neutral-300 font-bold">Part Name</th>
                            <th className="p-2.5 font-mono text-[9px] uppercase text-neutral-300 font-bold">Material</th>
                            <th className="p-2.5 font-mono text-[9px] uppercase text-neutral-300 font-bold">Specifications</th>
                            <th className="p-2.5 font-mono text-[9px] uppercase text-neutral-300 font-bold text-center">Qty</th>
                            <th className="p-2.5 font-mono text-[9px] uppercase text-[#0055FF] font-bold">Process</th>
                          </tr>
                        </thead>
                        <tbody>
                          {caseStudy.billOfMaterials.map((item, idx) => (
                            <tr key={idx} className="border-b last:border-0 border-white/10 hover:bg-white/5 transition-colors">
                              <td className="p-2.5 font-mono text-[10px] text-neutral-500">{item.sNo}</td>
                              <td className="p-2.5 font-semibold text-white">{item.partName}</td>
                              <td className="p-2.5 text-neutral-300">{item.material}</td>
                              <td className="p-2.5 font-mono text-[10px] text-neutral-400">{item.spec}</td>
                              <td className="p-2.5 font-mono text-center text-neutral-300">{item.qty}</td>
                              <td className="p-2.5 font-mono text-[10px] text-[#0055FF] font-medium">{item.process}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
              </section>
            )}

            {/* 12. Engineering Team Credits */}
            {caseStudy.teamMembers && (
              <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                 <div className="md:col-span-4 gsap-reveal">
                    <div className="md:sticky md:top-28">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                        <span className="text-[#00C853] mr-2">●</span> {renderRevealHeading("Project Team", 0.2)}
                      </h3>
                      <span className="text-xs text-neutral-400">KLE Technological University — Repo-02</span>
                    </div>
                 </div>
                 <div className="md:col-span-8 gsap-reveal">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {caseStudy.teamMembers.map((member, idx) => (
                        <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-sm">
                          <span className="text-sm font-bold text-white block">{member.name}</span>
                          <span className="text-xs text-[#00C853] font-medium block mt-0.5">{member.role}</span>
                          {member.usn && <span className="font-mono text-[10px] text-neutral-400 block mt-1">USN: {member.usn}</span>}
                          {member.email && <span className="font-mono text-[10px] text-neutral-500 block truncate">{member.email}</span>}
                        </div>
                      ))}
                    </div>
                 </div>
              </section>
            )}

            {/* 5. Competitor Analysis */}
            {caseStudy.competitorAnalysis && (
              <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                 <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#FFCC00] mr-2">●</span> {renderRevealHeading("Competitor Analysis", 0.2)}
                     </h3>
                   </div>
                 </div>
                 <div className="md:col-span-8 gsap-reveal">
                    {/* Desktop/Tablet Table */}
                    <div className="hidden sm:block overflow-x-auto rounded-sm border border-white/10 backdrop-blur-md bg-white/5">
                       <div className="min-w-full text-xs sm:text-sm">
                          {/* Header Row */}
                          <div className="border-b border-white/10 grid grid-cols-12 bg-white/5 font-bold">
                             <div className="col-span-4 p-3.5 border-r border-white/10">
                                <span className="font-mono text-[9px] sm:text-[10px] uppercase text-neutral-400 tracking-widest">Persona & Needs</span>
                             </div>
                             <div className="col-span-4 p-3.5 border-r border-white/10 bg-[#00C853]/10">
                                <span className="font-mono text-[9px] sm:text-[10px] uppercase text-[#00C853] tracking-widest">Strengths</span>
                             </div>
                             <div className="col-span-4 p-3.5 bg-[#FF3B30]/10">
                                <span className="font-mono text-[9px] sm:text-[10px] uppercase text-[#FF3B30] tracking-widest">Weaknesses</span>
                             </div>
                          </div>
                          
                          {/* Data Rows */}
                          {caseStudy.competitorAnalysis.map((comp, idx) => (
                             <div key={idx} className="border-b last:border-0 border-white/10 grid grid-cols-12 hover:bg-white/5 transition-colors">
                                <div className="col-span-4 p-3.5 border-r border-white/10 flex flex-col justify-between">
                                   <div>
                                     <h4 className="font-bold uppercase mb-1 text-[#FFCC00] text-xs sm:text-sm">{comp.persona}</h4>
                                     <p className="text-neutral-400 text-[11px] mb-2.5 italic">"{comp.keyNeeds}"</p>
                                   </div>
                                   <div className="flex gap-1.5 flex-wrap mt-auto">
                                      {comp.competitors.map((c, i) => <span key={i} className="px-1.5 py-0.5 bg-white/10 text-[9px] uppercase rounded-sm font-mono tracking-wide">{c}</span>)}
                                   </div>
                                </div>
                                <div className="col-span-4 p-3.5 border-r border-white/10 bg-[#00C853]/5">
                                   <ul className="list-disc list-inside text-neutral-300 space-y-1.5 text-[11px] sm:text-xs marker:text-[#00C853]">
                                      {comp.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                   </ul>
                                </div>
                                <div className="col-span-4 p-3.5 bg-[#FF3B30]/5">
                                   <ul className="list-disc list-inside text-neutral-300 space-y-1.5 text-[11px] sm:text-xs marker:text-[#FF3B30]">
                                      {comp.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                   </ul>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Mobile Card Layout */}
                    <div className="sm:hidden space-y-4">
                       {caseStudy.competitorAnalysis.map((comp, idx) => (
                          <div key={idx} className="bg-white/5 border border-white/10 rounded-sm p-4 space-y-3">
                             <div className="border-b border-white/10 pb-2.5">
                                <h4 className="font-bold uppercase text-[#FFCC00] text-sm">{comp.persona}</h4>
                                <p className="text-neutral-400 text-xs italic mt-0.5">"{comp.keyNeeds}"</p>
                                <div className="flex gap-1 flex-wrap mt-2">
                                   {comp.competitors.map((c, i) => <span key={i} className="px-1.5 py-0.5 bg-white/10 text-[9px] uppercase rounded font-mono">{c}</span>)}
                                </div>
                             </div>
                             <div className="bg-[#00C853]/5 p-2.5 rounded border border-[#00C853]/20">
                                <span className="font-mono text-[9px] uppercase font-bold text-[#00C853] block mb-1">Strengths</span>
                                <ul className="list-disc list-inside text-neutral-300 text-xs space-y-1 marker:text-[#00C853]">
                                   {comp.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                             </div>
                             <div className="bg-[#FF3B30]/5 p-2.5 rounded border border-[#FF3B30]/20">
                                <span className="font-mono text-[9px] uppercase font-bold text-[#FF3B30] block mb-1">Weaknesses</span>
                                <ul className="list-disc list-inside text-neutral-300 text-xs space-y-1 marker:text-[#FF3B30]">
                                   {comp.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </section>
           )}

           {/* Strategic Differentiation Opportunities (USPS) */}
           {caseStudy.differentiationOpportunities && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#00C853] mr-2">●</span> {renderRevealHeading("Differentiation", 0.2)}
                     </h3>
                     <p className="text-xs text-neutral-400 leading-relaxed">
                       Key institutional and strategic moats separating USPS from commercial, profit-driven couriers.
                     </p>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {caseStudy.differentiationOpportunities.map((diff, idx) => (
                       <div key={idx} className="bg-white/5 border border-white/10 p-5 rounded-sm hover:border-[#00C853] transition-all">
                         <h4 className="text-sm sm:text-base font-bold uppercase text-white mb-1.5 flex items-center gap-1.5">
                           <span className="text-[#00C853]">★</span> {diff.title}
                         </h4>
                         <p className="text-xs text-neutral-300 leading-relaxed">{diff.description}</p>
                       </div>
                     ))}
                   </div>
                </div>
             </section>
           )}

           {/* What USPS Should Avoid (USPS Research) */}
           {caseStudy.avoidances && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#FF3B30] mr-2">●</span> {renderRevealHeading("Strategic Guardrails", 0.2)}
                     </h3>
                     <span className="font-mono text-[9px] uppercase tracking-wider text-[#FF3B30] block font-bold">What USPS Should Avoid</span>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal">
                   <div className="p-6 bg-[#FF3B30]/5 border border-[#FF3B30]/30 rounded-sm space-y-3">
                     <ul className="space-y-2.5">
                       {caseStudy.avoidances.map((avoid, idx) => (
                         <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-200 leading-relaxed">
                           <span className="text-[#FF3B30] font-bold">✕</span>
                           <span>{avoid}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                </div>
             </section>
           )}

           {/* Audience Segmentation Analysis (USPS Research) */}
           {caseStudy.audienceAnalysis && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#00E5FF] mr-2">●</span> {renderRevealHeading("Audience Matrix", 0.2)}
                     </h3>
                     <p className="text-xs text-neutral-400 leading-relaxed">
                       Multigenerational residential customers, commercial business accounts, government agencies, 500,000+ employees, and postal collectors.
                     </p>
                   </div>
                </div>
                <div className="md:col-span-8 gsap-reveal space-y-4">
                   {caseStudy.audienceAnalysis.map((aud, idx) => (
                     <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded-sm hover:border-[#00E5FF] transition-colors">
                       <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
                         <h4 className="text-sm sm:text-base font-bold uppercase text-white">{aud.segment}</h4>
                         <span className="font-mono text-[9px] uppercase text-neutral-400">{aud.demographics}</span>
                       </div>
                       <div className="mb-2">
                         <span className="font-mono text-[9px] uppercase font-bold text-[#00E5FF] block mb-1">Needs from Visual Identity:</span>
                         <ul className="list-disc list-inside text-xs text-neutral-300 space-y-1 marker:text-[#00E5FF]">
                           {aud.needs.map((nd, nIdx) => <li key={nIdx}>{nd}</li>)}
                         </ul>
                       </div>
                       {aud.touchpoints && (
                         <div className="text-[11px] text-neutral-400 italic pt-2 border-t border-white/5">
                           <strong className="text-neutral-300 font-mono text-[9px] uppercase not-italic">Brand Touchpoints: </strong>
                           {aud.touchpoints}
                         </div>
                       )}
                     </div>
                   ))}
                </div>
             </section>
           )}

           {/* 6. User Personas */}
           {caseStudy.userPersonas && (
             <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                <div className="md:col-span-4 gsap-reveal">
                   <div className="md:sticky md:top-28">
                     <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                       <span className="text-[#FFCC00] mr-2">●</span> {renderRevealHeading("User Personas", 0.2)}
                     </h3>
                   </div>
                </div>
                <div className="md:col-span-8">
                   <div className="space-y-8 sm:space-y-10">
                     {caseStudy.userPersonas.map((persona, idx) => (
                       <div key={idx} className="persona-card border border-white/10 p-5 sm:p-7 md:p-9 bg-white/5 backdrop-blur-md rounded-sm hover:bg-white/10 transition-all duration-300 hover:border-[#FFCC00] group relative overflow-hidden">
                           {/* Subtle noise overlay */}
                           <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
                           
                           {/* Persona Header with Age/Education/Goals */}
                           <div className="mb-6 sm:mb-8 border-b border-white/10 pb-6 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between relative z-10">
                             <div className="flex-1">
                               <span className="block font-mono text-[9px] sm:text-[10px] uppercase text-[#FFCC00] mb-1">User 0{idx + 1}</span>
                               <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-1 group-hover:text-[#FFCC00] transition-colors">{persona.name}</h4>
                               <span className="text-sm sm:text-base text-neutral-400 font-medium block mb-2">{persona.role}</span>
                               
                               <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
                                 {persona.age && <span>Age: <strong className="text-white font-mono">{persona.age}</strong></span>}
                                 {persona.education && <span>Edu: <strong className="text-white">{persona.education}</strong></span>}
                                </div>
                             </div>

                             {persona.goals && (
                               <div className="flex-1 sm:border-l sm:border-white/10 sm:pl-6">
                                   <h5 className="font-mono text-[9px] sm:text-[10px] uppercase text-neutral-400 mb-2 tracking-widest">Key Goals</h5>
                                   <ul className="list-none space-y-1.5">
                                     {persona.goals.map((goal, i) => (
                                       <li key={i} className="text-xs sm:text-sm text-neutral-300 flex gap-2 items-start">
                                         <span className="text-[#00C853] mt-0.5">●</span> <span>{goal}</span>
                                       </li>
                                     ))}
                                   </ul>
                               </div>
                             )}
                           </div>

                           {/* Quote */}
                           {persona.quote && (
                             <div className="mb-6 sm:mb-8">
                               <blockquote className="text-base sm:text-lg md:text-xl font-serif italic text-white/85 border-l-2 border-[#FFCC00]/50 pl-4 sm:pl-6 py-1">
                                 "{persona.quote}"
                               </blockquote>
                             </div>
                           )}

                           {/* Empathy Map */}
                           {persona.empathyMap && (
                             <div className="mb-6 sm:mb-8 border-b border-white/10 pb-6">
                                 <h5 className="font-mono text-[9px] sm:text-[10px] uppercase text-neutral-400 mb-3 tracking-widest">Empathy Map</h5>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                   <div className="bg-white/5 p-3.5 rounded border border-white/5">
                                       <span className="block text-[11px] sm:text-xs font-bold uppercase mb-1.5 text-[#00bfff]">Thinks & Feels</span>
                                       <ul className="text-xs text-neutral-300 space-y-1">
                                         {persona.empathyMap.thinksAndFeels.map((item, i) => <li key={i}>• {item}</li>)}
                                       </ul>
                                   </div>
                                   <div className="bg-white/5 p-3.5 rounded border border-white/5">
                                       <span className="block text-[11px] sm:text-xs font-bold uppercase mb-1.5 text-[#ff00ff]">Says & Does</span>
                                       <ul className="text-xs text-neutral-300 space-y-1">
                                         {persona.empathyMap.saysAndDoes.map((item, i) => <li key={i}>• {item}</li>)}
                                       </ul>
                                   </div>
                                   <div className="bg-white/5 p-3.5 rounded border border-white/5 sm:col-span-2 lg:col-span-1">
                                       <span className="block text-[11px] sm:text-xs font-bold uppercase mb-1.5 text-[#FFCC00]">Sees</span>
                                       <ul className="text-xs text-neutral-300 space-y-1">
                                         {persona.empathyMap.sees.map((item, i) => <li key={i}>• {item}</li>)}
                                       </ul>
                                   </div>
                                 </div>
                             </div>
                           )}
                           
                           {/* Details Grid */}
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6">
                             {/* Awareness */}
                             <div>
                                 <h5 className="font-mono text-[9px] sm:text-[10px] uppercase text-neutral-400 mb-2 tracking-widest">Awareness</h5>
                                 <div className="mb-2">
                                   <span className="block text-[11px] font-bold uppercase mb-0.5 text-neutral-300">Familiarity</span>
                                   <p className="text-xs text-neutral-300">{persona.awareness.familiarity}</p>
                                 </div>
                                 <div>
                                   <span className="block text-[11px] font-bold uppercase mb-0.5 text-neutral-300">Understanding</span>
                                   <p className="text-xs text-neutral-300">"{persona.awareness.understanding}"</p>
                                 </div>
                             </div>

                             {/* Behavior */}
                             <div>
                                 <h5 className="font-mono text-[9px] sm:text-[10px] uppercase text-neutral-400 mb-2 tracking-widest">Behavior</h5>
                                 <div className="mb-2">
                                   <span className="block text-[11px] font-bold uppercase mb-0.5 text-neutral-300">Information Sought</span>
                                   <p className="text-xs text-neutral-300">{persona.behavior.sought}</p>
                                 </div>
                                 <div>
                                   <span className="block text-[11px] font-bold uppercase mb-0.5 text-neutral-300">Sources</span>
                                   <p className="text-xs text-neutral-300">{persona.behavior.sources}</p>
                                 </div>
                             </div>

                             {/* Pain Points */}
                             <div className="sm:col-span-2">
                                 <h5 className="font-mono text-[9px] sm:text-[10px] uppercase text-neutral-400 mb-2 tracking-widest">Pain Points & Opportunities</h5>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                     <div className="bg-[#FF3B30]/5 p-3 rounded border border-[#FF3B30]/20">
                                       <span className="block text-[11px] font-bold uppercase mb-1 text-[#FF3B30]">Challenges</span>
                                       <ul className="list-disc list-inside text-xs text-neutral-300 space-y-0.5 marker:text-[#FF3B30]">
                                           {persona.painPoints.challenges.map((c, i) => <li key={i}>{c}</li>)}
                                       </ul>
                                     </div>
                                     <div className="bg-[#00C853]/5 p-3 rounded border border-[#00C853]/20">
                                       <span className="block text-[11px] font-bold uppercase mb-1 text-[#00C853]">Accessibility Needs</span>
                                       <ul className="list-disc list-inside text-xs text-neutral-300 space-y-0.5 marker:text-[#00C853]">
                                           {persona.painPoints.accessibility.map((c, i) => <li key={i}>{c}</li>)}
                                       </ul>
                                     </div>
                                 </div>
                             </div>
                             
                             {/* Design Preferences */}
                             <div>
                                 <h5 className="font-mono text-[9px] sm:text-[10px] uppercase text-neutral-400 mb-2 tracking-widest">Design Preferences</h5>
                                 <p className="text-xs text-neutral-300 mb-1.5"><strong className="text-white">Appealing:</strong> {persona.designPreferences.appealing}</p>
                                 <p className="text-xs text-neutral-300"><strong className="text-white">Preference:</strong> {persona.designPreferences.preference}</p>
                             </div>

                             {/* Content Preferences */}
                             <div>
                                 <h5 className="font-mono text-[9px] sm:text-[10px] uppercase text-neutral-400 mb-2 tracking-widest">Content</h5>
                                 <p className="text-xs text-neutral-300 mb-1.5"><strong className="text-white">Preferred:</strong> {persona.contentPreferences.preferred}</p>
                                 <p className="text-xs text-neutral-300"><strong className="text-white">Format:</strong> {persona.contentPreferences.consumption}</p>
                             </div>
                            </div>
                        </div>
                      ))}
                    </div>
                 </div>
              </section>
            )}

            {/* Academic & Research References (USPS Research) */}
            {caseStudy.referencesList && (
              <section className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 lg:gap-12 pb-10 md:pb-14 border-b border-white/10">
                 <div className="md:col-span-4 gsap-reveal">
                    <div className="md:sticky md:top-28">
                      <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 md:mb-4">
                        <span className="text-white mr-2">●</span> {renderRevealHeading("Research Citations", 0.2)}
                      </h3>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 block">Academic &amp; Historical Sources</span>
                    </div>
                 </div>
                 <div className="md:col-span-8 gsap-reveal">
                    <ol className="space-y-2.5 text-xs text-neutral-400 font-mono">
                      {caseStudy.referencesList.map((ref, idx) => (
                        <li key={idx} className="border-l border-white/10 pl-3 hover:border-[#0055FF] hover:text-neutral-200 transition-colors">
                          <span className="text-[#0055FF] font-bold mr-2">[{ref.citationNumber}]</span>
                          <span>{ref.text}</span>
                          {ref.url && (
                            <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-[#0055FF] hover:underline ml-2 block truncate">
                              {ref.url}
                            </a>
                          )}
                        </li>
                      ))}
                    </ol>
                 </div>
              </section>
            )}

            {/* Enterprise Security UX Deep-Dive */}
            {caseStudy.isSecurityUX && (
              <SecurityUXSection caseStudy={caseStudy} />
            )}

        </div> {/* End Modular Sections */}
      </div> {/* End Container */}

      {/* IMMERSIVE USER JOURNEY SEQUENCES */}
      {caseStudy.userJourneys && (
        <ExperienceJourneysSection userJourneys={caseStudy.userJourneys} />
      )}

      {/* LIVE FIGMA INTERACTIVE PROTOTYPE WINDOW */}
      {(caseStudy.figmaEmbedUrl || project.title === 'Nexus AI') && !caseStudy.isSecurityUX && (
        <section className="w-full bg-[#08080c] py-16 md:py-24 border-t border-white/10 relative overflow-hidden">
          {/* Subtle Background Blueprint Grid */}
          <div 
            className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }}
          ></div>

          <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
                  <span className="font-mono text-[10px] sm:text-xs text-[#FF3B30] uppercase tracking-widest font-medium">
                    Interactive Design Artifact // Live Embed
                  </span>
                </div>
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white">
                  Figma Prototype
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={caseStudy.figmaUrl || "https://www.figma.com/design/as77j5bf5uEnBlsKi1lN6P/Nexus-AI?node-id=22-113"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black font-mono text-xs uppercase tracking-wider text-white transition-all duration-300 shadow-sm"
                  data-cursor-text="FIGMA"
                >
                  <span>Open Full Canvas</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Figma Window Viewer */}
            <FigmaViewerWindow 
              embedUrl={caseStudy.figmaEmbedUrl || "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2Fas77j5bf5uEnBlsKi1lN6P%2FNexus-AI%3Fnode-id%3D22-113"}
              directUrl={caseStudy.figmaUrl || "https://www.figma.com/design/as77j5bf5uEnBlsKi1lN6P/Nexus-AI?node-id=22-113"}
              title={`${project.title} — Interactive Figma Prototype`}
              nodeId="22-113"
            />
          </div>
        </section>
      )}

      {/* MUMBAI 2028 INTERACTIVE LOGO GENERATOR & IDENTITY LAB */}
      {caseStudy.isOlympicIdentity && (
        <section className="w-full bg-[#08080c] py-16 md:py-24 border-t border-white/10 relative overflow-hidden">
          {/* Subtle Background Blueprint Grid */}
          <div 
            className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', 
              backgroundSize: '40px 40px' 
            }}
          ></div>

          <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse"></span>
                  <span className="font-mono text-[10px] sm:text-xs text-[#FF9933] uppercase tracking-widest font-medium">
                    Live Generative Design Tool // Public Playground
                  </span>
                </div>
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white">
                  Logo Generator
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 font-mono hidden md:inline">
                  Interactive architectural monuments, bilingual typography, Olympic gradients &amp; vector export
                </span>
              </div>
            </div>

            {/* Interactive Logo Generator Studio */}
            <MumbaiLogoGenerator />
          </div>
        </section>
      )}

      {/* Next Project Footer */}
      <div className="container mx-auto px-4 sm:px-6 md:px-12 border-t border-white/20 pt-12 md:pt-16 pb-20 md:pb-28 flex justify-center">
         <MagneticWrapper strength={0.1}>
           <button 
             onClick={onNext}
             className="group relative flex flex-col items-center"
             data-cursor-text="NEXT"
           >
              <span className="font-mono text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest mb-2 sm:mb-4 group-hover:text-[#0055FF] transition-colors">Next Project</span>
              <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tighter text-white/50 group-hover:text-white transition-colors duration-500">
                Continue
              </span>
              <span className="w-0 h-[2px] bg-[#0055FF] mt-3 md:mt-4 transition-all duration-500 group-hover:w-full"></span>
           </button>
         </MagneticWrapper>
      </div>

      {/* High-Resolution Lightbox Modal */}
      {activeLightbox && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setActiveLightbox(null)}
        >
          <div 
            className="relative max-w-6xl w-full max-h-[92vh] flex flex-col bg-neutral-950 border border-white/20 rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <div>
                {activeLightbox.subtitle && (
                  <span className="font-mono text-[10px] text-[#0055FF] uppercase tracking-widest block font-bold">
                    {activeLightbox.subtitle}
                  </span>
                )}
                <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                  {activeLightbox.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveLightbox(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors font-mono text-sm"
              >
                ✕
              </button>
            </div>

            {/* Image Preview */}
            <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-black/60">
              <img 
                src={activeLightbox.image} 
                alt={activeLightbox.title} 
                className="max-h-[74vh] max-w-full object-contain rounded drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectDetail;
