import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { ResumeData } from '../types';
import ExperienceList from './Experience';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutProps {
  data: ResumeData;
}

const About: React.FC<AboutProps> = ({ data }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const laserLineRef = useRef<HTMLDivElement>(null);
  const bioContainerRef = useRef<HTMLDivElement>(null);
  const insightRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const words = data.personal.summary.split(' ');

  // 1. Section Header Architectural Laser Line Reveal
  useLayoutEffect(() => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (laserLineRef.current) {
        if (isReduced) {
          gsap.set(laserLineRef.current, { scaleX: 1 });
        } else {
          gsap.fromTo(laserLineRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              }
            }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 2. Continuous Lenis-Synchronized Word Illumination & Reading Progress
  useEffect(() => {
    let ticking = false;
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateWords = (customY?: number) => {
      if (isReduced) {
        wordRefs.current.forEach((el) => {
          if (el) {
            el.style.opacity = '1';
            el.style.color = '#FFFFFF';
            el.style.transform = 'translate3d(0, 0, 0)';
          }
        });
        if (insightRef.current) {
          insightRef.current.style.transform = 'translate3d(0, 0, 0)';
          insightRef.current.style.opacity = '1';
        }
        return;
      }

      if (!bioContainerRef.current) return;

      const rect = bioContainerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Start illuminating when top of bio enters lower 82% of viewport, finish near 35%
      const startTrigger = vh * 0.82;
      const endTrigger = vh * 0.35;
      const totalSpan = (startTrigger - endTrigger) + rect.height;
      const rawProgress = (startTrigger - rect.top) / totalSpan;
      const progress = Math.min(1, Math.max(0, rawProgress));

      const total = wordRefs.current.length;
      const activeFloat = progress * total;

      wordRefs.current.forEach((el, idx) => {
        if (!el) return;
        if (idx < Math.floor(activeFloat)) {
          // Preceding read words settle into crisp #EDEDED (AAA contrast ratio on obsidian #050508)
          el.style.opacity = '1';
          el.style.color = '#EDEDED';
          el.style.transform = 'translate3d(0, 0, 0)';
        } else if (idx === Math.floor(activeFloat)) {
          // Active reading word has micro-lift and radiant white glow
          const frac = activeFloat - Math.floor(activeFloat);
          const op = 0.28 + 0.72 * frac;
          el.style.opacity = op.toFixed(3);
          el.style.color = frac > 0.4 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.55)';
          const liftY = (1 - frac) * -1.5;
          el.style.transform = `translate3d(0, ${liftY.toFixed(1)}px, 0)`;
        } else {
          // Upcoming unread words maintain subtle contrast
          el.style.opacity = '0.28';
          el.style.color = 'rgba(255, 255, 255, 0.32)';
          el.style.transform = 'translate3d(0, 0, 0)';
        }
      });

      // Insight card smooth elevation
      if (insightRef.current) {
        const insightRect = insightRef.current.getBoundingClientRect();
        if (insightRect.top < vh && insightRect.bottom > 0) {
          const inProgress = Math.min(1, Math.max(0, (vh - insightRect.top) / (vh * 0.5)));
          insightRef.current.style.transform = `translate3d(0, ${((1 - inProgress) * 12).toFixed(1)}px, 0)`;
          insightRef.current.style.opacity = `${Math.min(1, 0.35 + inProgress * 0.65).toFixed(3)}`;
        }
      }
    };

    const handleNativeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateWords();
          ticking = false;
        });
        ticking = true;
      }
    };

    const lenis = (window as any).__lenis;
    const onLenisScroll = (e: any) => {
      updateWords(e?.scroll ?? lenis?.scroll);
    };

    if (lenis) {
      lenis.on('scroll', onLenisScroll);
    }
    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    updateWords();

    return () => {
      if (lenis) {
        lenis.off('scroll', onLenisScroll);
      }
      window.removeEventListener('scroll', handleNativeScroll);
    };
  }, [data.personal.summary]);

  const renderSplitWords = () => {
    return words.map((word, index) => (
      <React.Fragment key={index}>
        <span 
          ref={(el) => { if (el) wordRefs.current[index] = el; }}
          className="inline-block transition-[opacity,color,transform] duration-200 ease-out will-change-[opacity,color,transform]"
          style={{ opacity: 0.22, color: 'rgba(255, 255, 255, 0.3)' }}
        >
          {word}
        </span>
        {' '}
      </React.Fragment>
    ));
  };

  return (
    <section 
      id="profile" 
      ref={sectionRef}
      className="bg-[#050508] text-white relative z-20 border-t border-white/10 pt-24 md:pt-32 pb-24 select-none"
    >
      <div id="about" className="absolute -top-24 left-0 pointer-events-none" />
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header Synchronized with Swiss Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-16 md:mb-24 border-b border-white/10 pb-6 items-end relative">
          {/* Architectural Laser Line that draws across on entry */}
          <div 
            ref={laserLineRef}
            className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-[#FF3B30] via-white/50 to-transparent origin-left scale-x-0 will-change-transform pointer-events-none" 
          />
          <div className="md:col-span-4 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
            <h2 className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/80 font-medium">
              02 /// PROFILE &amp; PHILOSOPHY
            </h2>
          </div>
          <div className="md:col-span-8 flex justify-between md:justify-end items-center gap-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/60">
              THEORY &amp; CRAFT
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 hidden sm:inline-block">
              ATLAS INSTITUTE // CU BOULDER
            </span>
          </div>
        </div>

        {/* Intro Bio & Philosophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-28 relative">
          
          {/* Left Column: Monospace Metadata & Coordinates */}
          <div className="md:col-span-4">
            <div className="sticky top-28 self-start space-y-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 block">
                ● CORE PERSPECTIVE
              </span>
              <div className="space-y-2 text-xs font-mono text-white/70">
                <div className="flex items-center gap-2">
                  <span className="text-[#FF3B30]">■</span>
                  <span>LAT: 40.0076° N, LON: 105.2659° W</span>
                </div>
                <div>BOULDER, COLORADO</div>
                <div>CREATIVE TECHNOLOGY &amp; DESIGN</div>
              </div>
            </div>
          </div>

          {/* Right Column: Monumental Scrubbed Bio */}
          <div className="md:col-span-8" data-cursor-text="READ">
            <div 
              ref={bioContainerRef} 
              className="text-2xl sm:text-4xl md:text-5xl font-sans font-medium leading-[1.28] tracking-tight mb-12 text-white"
            >
               {renderSplitWords()}
            </div>

            {/* Architectural Philosophy Card */}
            <div 
              ref={insightRef} 
              className="border-l-2 border-[#FF3B30] pl-6 md:pl-8 py-5 bg-white/[0.02] border-y border-r border-white/[0.05] rounded-r-sm will-change-transform backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#FF3B30] font-semibold">
                  MANDATE // RADICAL ACCESSIBILITY
                </span>
              </div>
              <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed">
                {data.personal.insights}
              </p>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-28 pt-12 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 items-end">
            <div className="md:col-span-4">
               <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60 block">
                 ● APPLIED LEADERSHIP
               </span>
            </div>
            <div className="md:col-span-8 flex items-center justify-between border-b border-white/10 pb-6">
                <h3 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white">
                  Experience
                </h3>
                <a 
                  href="./Ritvik_Chunamari_Resume.pdf" 
                  download="Ritvik_Chunamari_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-4 py-2 border border-white/30 rounded-full font-mono text-[10px] md:text-xs uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] active:scale-95"
                  data-cursor-text="DOWNLOAD"
                >
                  <span>Resume PDF</span>
                  <span className="transform group-hover:translate-y-0.5 transition-transform">↓</span>
                </a>
            </div>
          </div>

          <div className="w-full">
            <ExperienceList experiences={data.experience} />
          </div>
        </div>

        {/* Education & Disciplines Grid (Swiss 2-Column Architectural System) */}
        <div className="pt-12 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Column 1: Academic Pedigree */}
            <div className="lg:col-span-5 space-y-12">
              <div className="border-b border-white/10 pb-4 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]"></span>
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/70 font-semibold">
                  03 / ACADEMIC FOUNDATION
                </span>
              </div>

              <div className="space-y-12">
                {data.education.map((edu, idx) => (
                  <div 
                    key={idx} 
                    className="relative pl-6 border-l border-white/15 hover:border-[#FF3B30] transition-colors duration-300"
                  >
                    <span className="absolute -left-[4.5px] top-1.5 w-[8px] h-[8px] bg-[#FF3B30] rounded-full"></span>
                    <h5 className="text-xl font-bold text-white mb-1">{edu.school}</h5>
                    <p className="text-sm font-medium text-neutral-300 mb-2">{edu.degree}</p>
                    <div className="flex gap-4 text-[10px] font-mono text-white/60 uppercase mb-3 tracking-widest">
                      <span>{edu.duration}</span>
                      <span>{edu.location}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {edu.details.map((d, i) => (
                        <li key={i} className="text-xs text-neutral-400 leading-normal">{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Disciplines & Professional Credentials */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Disciplines */}
              <div>
                <div className="border-b border-white/10 pb-4 mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]"></span>
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/70 font-semibold">
                    04 / STUDIO DISCIPLINES
                  </span>
                </div>

                <div className="space-y-6">
                  {data.skills.map((cat, idx) => (
                    <div key={idx} className="border-b border-white/[0.05] pb-5">
                      <span className="block font-mono text-[10px] text-white/60 mb-2.5 uppercase tracking-widest">
                        {cat.category}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {cat.skills.split(', ').map((skill, sIdx) => (
                          <span 
                            key={sIdx} 
                            className="px-3 py-1 border border-white/10 bg-white/[0.03] rounded-sm text-xs font-mono uppercase tracking-wider text-neutral-300 transition-all duration-300 cursor-default hover:bg-white hover:text-black hover:border-white"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Credentials */}
              <div>
                <div className="border-b border-white/10 pb-4 mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]"></span>
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/70 font-semibold">
                    05 / VERIFIED CREDENTIALS
                  </span>
                </div>

                <div className="flex flex-col">
                  {data.certifications.map((c, i) => (
                    <div 
                      key={i} 
                      className="group relative py-3.5 border-b border-white/[0.07] flex items-center justify-between transition-all duration-300 hover:bg-white/[0.02] hover:pl-3" 
                      data-cursor-text="CREDENTIAL"
                    >
                       <span className="text-xs sm:text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                          {c}
                       </span>
                       <span className="font-mono text-xs text-white/30 group-hover:text-[#FF3B30] group-hover:translate-x-0.5 transition-all">
                         ↗
                       </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default React.memo(About);
