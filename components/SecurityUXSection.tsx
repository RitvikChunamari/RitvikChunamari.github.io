import React, { useState, useEffect, useRef } from 'react';
import { CaseStudy } from '../types';

interface SecurityUXSectionProps {
  caseStudy: CaseStudy;
}

export const SecurityUXSection: React.FC<SecurityUXSectionProps> = ({ caseStudy }) => {
  // System Switcher: 0 = Admin Operations Platform, 1 = Client Acquisition Portal
  const [activeSystemIdx, setActiveSystemIdx] = useState<number>(0);
  
  // Personas State
  const [activePersonaIdx, setActivePersonaIdx] = useState<number>(0);

  // Prototype Screens State (Uncropped tab gallery)
  const [activeScreenIdx, setActiveScreenIdx] = useState<number>(0);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Lightbox Modal State (for Mindmaps, Flowcharts & Prototype Screens)
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; subtitle?: string } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const activePersona = caseStudy.securityPersonas?.[activePersonaIdx] || caseStudy.securityPersonas?.[0];
  const activeFlowMind = caseStudy.mindmapsAndFlows?.[activeSystemIdx] || caseStudy.mindmapsAndFlows?.[0];
  const activeObjectives = caseStudy.systemObjectives?.[activeSystemIdx] || caseStudy.systemObjectives?.[0];

  // Mousewheel horizontal scroll on prototype tabs bar
  useEffect(() => {
    const tabsContainer = tabsContainerRef.current;
    if (tabsContainer) {
      const handleWheel = (event: WheelEvent) => {
        if (event.deltaY !== 0) {
          event.preventDefault();
          tabsContainer.scrollLeft += event.deltaY;
        }
      };
      tabsContainer.addEventListener('wheel', handleWheel, { passive: false });
      return () => tabsContainer.removeEventListener('wheel', handleWheel);
    }
  }, [activeSystemIdx]);

  // Handle ESC for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImage && e.key === 'Escape') {
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage]);

  return (
    <div className="w-full space-y-16 md:space-y-24 text-white">
      {/* 1. SYSTEM ARCHITECTURE SWITCHER BAR */}
      <section className="bg-neutral-950/80 border border-white/15 rounded-xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0055FF]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#0055FF] animate-pulse"></span>
              <span className="font-mono text-[10px] sm:text-xs text-[#0055FF] uppercase tracking-widest font-semibold">
                Dual-System Enterprise Architecture
              </span>
            </div>
            <h3 className="text-xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              Explore Platform Ecosystem
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
              Switch between the mission-critical internal Operations ERP and the external-facing corporate client conversion portal.
            </p>
          </div>

          {/* Switcher Pills */}
          <div className="flex items-center gap-2 p-1.5 bg-neutral-900/90 border border-white/10 rounded-full backdrop-blur-md self-start md:self-auto">
            <button
              onClick={() => {
                setActiveSystemIdx(0);
                setActiveScreenIdx(0);
              }}
              className={`px-4 sm:px-6 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeSystemIdx === 0
                  ? 'bg-[#0055FF] text-white font-bold shadow-[0_0_20px_rgba(0,85,255,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Admin Operations Platform</span>
            </button>
            <button
              onClick={() => {
                setActiveSystemIdx(1);
                setActiveScreenIdx(0);
              }}
              className={`px-4 sm:px-6 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeSystemIdx === 1
                  ? 'bg-[#0055FF] text-white font-bold shadow-[0_0_20px_rgba(0,85,255,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>Client Acquisition Portal</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. STRATEGIC DESIGN OBJECTIVES */}
      {activeObjectives && (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <span className="font-mono text-[10px] text-[#0055FF] uppercase tracking-widest block mb-1">
                UX Directives & Standards
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mb-3">
                Core Objectives
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {activeObjectives.description}
              </p>
              <div className="mt-6 p-4 rounded-lg bg-white/[0.03] border border-white/10 hidden md:block">
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">Active System Focus</div>
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {activeObjectives.system}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeObjectives.objectives.map((obj, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-900/60 border border-white/10 hover:border-[#0055FF]/60 hover:bg-white/[0.04] p-5 sm:p-6 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#0055FF] font-bold">
                      0{idx + 1} // Principle
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#0055FF] transition-colors"></span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight mb-2 group-hover:text-[#0055FF] transition-colors">
                    {obj.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {obj.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. USER PERSONAS DEEP DIVE */}
      {caseStudy.securityPersonas && caseStudy.securityPersonas.length > 0 && (
        <section className="pb-12 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="font-mono text-[10px] sm:text-xs text-[#0055FF] uppercase tracking-widest block mb-1">
                Target User Research & Field Empathy
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                User Personas
              </h3>
            </div>

            {/* Persona Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-neutral-900/80 p-1.5 rounded-xl border border-white/10">
              {caseStudy.securityPersonas.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePersonaIdx(idx)}
                  className={`px-3.5 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    activePersonaIdx === idx
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: idx === 0 ? '#0055FF' : idx === 1 ? '#00C853' : '#FFCC00' }}></span>
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {activePersona && (
            <div className="bg-neutral-950/70 border border-white/15 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-md relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: Avatar & Demographics Card */}
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center text-center sm:text-left lg:text-center gap-6 p-6 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="relative group w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-neutral-900 shrink-0">
                    <img
                      src={activePersona.image}
                      alt={activePersona.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>

                  <div className="w-full">
                    <h4 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-1">
                      {activePersona.name}
                    </h4>
                    <span className="font-mono text-xs text-[#0055FF] font-semibold block mb-4">
                      {activePersona.demographics.find(d => d.label.toLowerCase() === 'occupation')?.value || 'Key Stakeholder'}
                    </span>

                    {/* Demographics Pill Grid */}
                    <div className="w-full space-y-2 text-left pt-3 border-t border-white/10">
                      {activePersona.demographics.map((demo, dIdx) => (
                        <div key={dIdx} className="flex justify-between items-center text-xs py-1 border-b border-white/5 font-sans">
                          <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">{demo.label}:</span>
                          <span className="font-medium text-neutral-200 text-right">{demo.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: 4 Strategic Research Quadrants */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {activePersona.sections.map((section, sIdx) => {
                    const isNeeds = section.title.toLowerCase().includes('need');
                    const isMotivations = section.title.toLowerCase().includes('motivation');
                    const isFrustrations = section.title.toLowerCase().includes('frustration');
                    const isDevices = section.title.toLowerCase().includes('device');

                    const accentColor = isNeeds ? '#0055FF' : isMotivations ? '#00C853' : isFrustrations ? '#FF3B30' : '#FFCC00';

                    return (
                      <div
                        key={sIdx}
                        className="p-5 sm:p-6 rounded-xl bg-white/[0.025] border border-white/10 hover:border-white/20 transition-all duration-300"
                        style={{ borderLeftWidth: '3px', borderLeftColor: accentColor }}
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                          >
                            {isNeeds ? 'N' : isMotivations ? 'M' : isFrustrations ? '!' : 'D'}
                          </div>
                          <h5 className="font-mono text-xs uppercase font-bold tracking-widest text-white">
                            {section.title}
                          </h5>
                        </div>

                        <ul className="space-y-2.5">
                          {section.items.map((item, iIdx) => (
                            <li key={iIdx} className="text-xs text-neutral-300 leading-relaxed flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: accentColor }}></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. INFORMATION ARCHITECTURE & USER FLOW (MINDMAP + FLOWCHART) */}
      {activeFlowMind && (
        <section className="pb-12 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="font-mono text-[10px] sm:text-xs text-[#0055FF] uppercase tracking-widest block mb-1">
                Taxonomy & Flow Mapping
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                Information Architecture & Flows
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
                {activeFlowMind.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                Click any diagram to open full zoom lightbox
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Mindmap Card */}
            <div className="bg-neutral-950 border border-white/15 rounded-xl p-5 sm:p-6 flex flex-col group hover:border-[#0055FF]/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0055FF]"></span>
                  <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                    System Mindmap
                  </span>
                </div>
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                  Hierarchy & Data Entities
                </span>
              </div>

              <div
                onClick={() => setLightboxImage({ src: activeFlowMind.mindmap, title: `${activeFlowMind.system} — Mindmap`, subtitle: 'Hierarchical structure and functional grouping' })}
                className="relative cursor-zoom-in overflow-hidden rounded-lg bg-black/40 border border-white/5 flex items-center justify-center p-2 min-h-[260px] sm:min-h-[320px]"
              >
                <img
                  src={activeFlowMind.mindmap}
                  alt={`${activeFlowMind.system} Mindmap`}
                  className="w-full h-auto max-h-[360px] object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  <span className="px-4 py-2 bg-white text-black text-xs font-mono uppercase font-bold rounded-full shadow-lg flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                    Enlarge Mindmap
                  </span>
                </div>
              </div>
            </div>

            {/* Flowchart Card */}
            <div className="bg-neutral-950 border border-white/15 rounded-xl p-5 sm:p-6 flex flex-col group hover:border-[#0055FF]/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00C853]"></span>
                  <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                    User Operational Flowchart
                  </span>
                </div>
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                  Decision Paths & States
                </span>
              </div>

              <div
                onClick={() => setLightboxImage({ src: activeFlowMind.flowchart, title: `${activeFlowMind.system} — Flowchart`, subtitle: 'End-to-end task routing and decision logic' })}
                className="relative cursor-zoom-in overflow-hidden rounded-lg bg-black/40 border border-white/5 flex items-center justify-center p-2 min-h-[260px] sm:min-h-[320px]"
              >
                <img
                  src={activeFlowMind.flowchart}
                  alt={`${activeFlowMind.system} Flowchart`}
                  className="w-full h-auto max-h-[360px] object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  <span className="px-4 py-2 bg-white text-black text-xs font-mono uppercase font-bold rounded-full shadow-lg flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                    Enlarge User Flow
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. HIGH-FIDELITY INTERFACE PROTOTYPE SCREENS (UNCROPPED) */}
      {caseStudy.prototypeSuites && caseStudy.prototypeSuites.length > 0 && (() => {
        const currentSuite = caseStudy.prototypeSuites[activeSystemIdx] || caseStudy.prototypeSuites[0];
        const currentScreens = currentSuite.screens || [];
        const currentScreen = currentScreens[activeScreenIdx] || currentScreens[0];

        if (!currentScreen) return null;

        return (
          <section className="pb-12 border-b border-white/10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF] animate-pulse"></span>
                  <span className="font-mono text-[10px] sm:text-xs text-[#0055FF] uppercase tracking-widest font-semibold">
                    High-Fidelity Interface Prototypes // {currentSuite.badge}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                  Prototype Screens
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                  {currentSuite.description} Every screen is rendered at full native resolution with zero cropping. Click any screen or use the zoom inspector to inspect typography, telemetry metrics, and layout hierarchy.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-neutral-900/80 border border-white/10 px-3 py-1.5 rounded-full font-mono text-xs text-neutral-400">
                  <span>SCREEN</span>
                  <span className="text-white font-bold">{String(activeScreenIdx + 1).padStart(2, '0')}</span>
                  <span>/</span>
                  <span>{String(currentScreens.length).padStart(2, '0')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveScreenIdx((idx) => (idx > 0 ? idx - 1 : currentScreens.length - 1))}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
                    title="Previous Screen"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setActiveScreenIdx((idx) => (idx < currentScreens.length - 1 ? idx + 1 : 0))}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
                    title="Next Screen"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Screen Tabs Bar with mousewheel horizontal scroll */}
            <div className="relative mb-6">
              <div 
                ref={tabsContainerRef}
                className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent select-none"
                style={{ scrollBehavior: 'smooth' }}
              >
                {currentScreens.map((screen, idx) => {
                  const isActive = activeScreenIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveScreenIdx(idx)}
                      className={`shrink-0 px-3.5 sm:px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 border cursor-pointer ${
                        isActive
                          ? 'bg-[#0055FF] text-white border-[#0055FF] font-bold shadow-[0_0_15px_rgba(0,85,255,0.4)]'
                          : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08] border-white/10'
                      }`}
                    >
                      <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-neutral-500'}`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>{screen.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Uncropped Screen Display Frame */}
            <div className="w-full bg-neutral-950/90 border border-white/15 rounded-xl p-3 sm:p-6 md:p-8 backdrop-blur-xl relative shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
              {/* Screen Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {currentScreen.category && (
                    <span className="px-2.5 py-1 rounded bg-[#0055FF]/20 text-[#0055FF] border border-[#0055FF]/40 font-mono text-[10px] uppercase font-bold tracking-wider">
                      {currentScreen.category}
                    </span>
                  )}
                  <h4 className="text-base sm:text-lg font-bold uppercase text-white tracking-tight">
                    {currentScreen.label}
                  </h4>
                  {currentScreen.description && (
                    <span className="text-xs text-neutral-400 hidden md:inline-block border-l border-white/15 pl-3">
                      {currentScreen.description}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLightboxImage({
                      src: currentScreen.src,
                      title: `${currentScreen.label} — ${currentSuite.system}`,
                      subtitle: currentScreen.description || `${currentSuite.system} Prototype Screen`
                    })}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    <span>Inspect Fullscreen</span>
                  </button>
                  <a
                    href={currentScreen.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Open direct uncropped image link in new tab"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>Raw</span>
                  </a>
                </div>
              </div>

              {/* The Image Itself - Strictly Uncropped (w-full h-auto object-contain, no maxHeight crop) */}
              <div
                className="w-full flex items-center justify-center bg-black/40 rounded-lg p-1 sm:p-3 border border-white/5 cursor-zoom-in group relative"
                onClick={() => setLightboxImage({
                  src: currentScreen.src,
                  title: `${currentScreen.label} — ${currentSuite.system}`,
                  subtitle: currentScreen.description || `${currentSuite.system} Prototype Screen`
                })}
              >
                <img
                  src={currentScreen.src}
                  alt={currentScreen.label}
                  className="w-full h-auto max-w-full block rounded object-contain shadow-2xl transition-transform duration-200 group-hover:scale-[1.002]"
                  style={{
                    objectFit: 'contain',
                    maxHeight: 'none',
                    display: 'block'
                  }}
                  loading="eager"
                />
                <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full font-mono text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 pointer-events-none shadow-xl">
                  <svg className="w-3.5 h-3.5 text-[#0055FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  <span>Click to Enlarge (Uncropped)</span>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 6. OPERATIONAL IMPACT & ROI METRICS */}
      {caseStudy.uxImpactMetrics && caseStudy.uxImpactMetrics.length > 0 && (
        <section className="pb-12 border-b border-white/10">
          <div className="mb-8">
            <span className="font-mono text-[10px] sm:text-xs text-[#0055FF] uppercase tracking-widest block mb-1">
              Field Efficacy & Measurable ROI
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              Impact & Usability Metrics
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {caseStudy.uxImpactMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#0055FF]/50 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#0055FF]/10 rounded-full blur-xl group-hover:bg-[#0055FF]/20 transition-all"></div>
                <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-white block mb-2 tracking-tight group-hover:text-[#0055FF] transition-colors">
                  {metric.value}
                </span>
                <h4 className="font-mono text-xs uppercase font-bold tracking-wider text-neutral-200 mb-2">
                  {metric.label}
                </h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. FULLSCREEN LIGHTBOX MODAL (FOR MINDMAPS & FLOWCHARTS) */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          {/* Lightbox Toolbar */}
          <div
            className="flex items-center justify-between pb-4 border-b border-white/15 text-white shrink-0 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h4 className="text-base sm:text-xl font-bold uppercase tracking-tight text-white">
                {lightboxImage.title}
              </h4>
              {lightboxImage.subtitle && (
                <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{lightboxImage.subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs cursor-pointer"
                title="Zoom Out"
              >
                －
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs cursor-pointer"
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs cursor-pointer"
                title="Zoom In"
              >
                ＋
              </button>
              <a
                href={lightboxImage.src}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#0055FF] hover:bg-[#0044CC] text-white font-mono text-xs uppercase font-bold ml-2"
              >
                Raw Image
              </a>
              <button
                onClick={() => {
                  setLightboxImage(null);
                  setZoomLevel(1);
                }}
                className="p-2 rounded-lg bg-white/15 hover:bg-white/30 text-white ml-2 cursor-pointer"
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Lightbox Canvas */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-4 relative"
            onClick={() => {
              setLightboxImage(null);
              setZoomLevel(1);
            }}
          >
            <img
              src={lightboxImage.src}
              alt={lightboxImage.title}
              onClick={(e) => e.stopPropagation()}
              className="max-w-none max-h-none object-contain rounded transition-transform duration-200 cursor-grab active:cursor-grabbing shadow-2xl"
              style={{
                transform: `scale(${zoomLevel})`,
                maxWidth: zoomLevel === 1 ? '95vw' : undefined,
                maxHeight: zoomLevel === 1 ? '85vh' : undefined,
              }}
            />
          </div>

          <div className="text-center py-2 text-[11px] font-mono text-neutral-500 uppercase tracking-wider shrink-0">
            Press ESC or click outside to close • Use +/- buttons to zoom
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityUXSection;
