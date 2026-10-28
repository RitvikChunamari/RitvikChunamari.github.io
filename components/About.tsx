import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { ResumeData } from '../types';
import ExperienceList from './Experience';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrambleText } from '../utils/scrambleText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutProps {
  data: ResumeData;
}

const About: React.FC<AboutProps> = ({ data }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const sectionTitleRef = useRef<HTMLHeadingElement>(null);
  const laserLineRef = useRef<HTMLDivElement>(null);
  const bioContainerRef = useRef<HTMLDivElement>(null);
  const insightRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const words = data.personal.summary.split(' ');

  // Section Header Architectural Laser Line & Lenis-Synchronized Word Illumination
  useLayoutEffect(() => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Architectural Laser Line Reveal & Cryptographic Scramble
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
                onEnter: () => {
                  if (sectionTitleRef.current) {
                    scrambleText(sectionTitleRef.current, '02 /// PROFILE & PHILOSOPHY', { duration: 600 });
                  }
                }
              }
            }
          );
        }
      }

      if (isReduced) {
        wordRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, color: '#EDEDED' });
        });
        if (insightRef.current) gsap.set(insightRef.current, { y: 0, opacity: 1 });
        return;
      }

      // Continuous Lenis-Synchronized Word Illumination
      const validWords = wordRefs.current.filter(Boolean);
      if (bioContainerRef.current && validWords.length > 0) {
        const wordsTl = gsap.timeline({
          scrollTrigger: {
            trigger: bioContainerRef.current,
            start: 'top 82%',
            end: 'bottom 40%',
            scrub: 0.35,
            invalidateOnRefresh: true,
          }
        });

        wordsTl.fromTo(validWords,
          { opacity: 0.35, color: '#666666' },
          {
            opacity: 1,
            color: '#EDEDED',
            stagger: {
              each: 0.025,
              ease: 'none',
            },
            ease: 'none',
          }
        );
      }

      // Insight Card Elevation
      if (insightRef.current) {
        gsap.fromTo(insightRef.current,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: insightRef.current,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [data.personal.summary]);

  const renderSplitWords = () => {
    return words.map((word, index) => (
      <React.Fragment key={index}>
        <span 
          ref={(el) => { if (el) wordRefs.current[index] = el; }}
          className="inline-block transition-[opacity,color,transform] duration-200 ease-out will-change-[opacity,color,transform]"
          style={{ opacity: 0.35, color: '#666666' }}
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
        
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-16 md:mb-24 border-b border-white/10 pb-6 items-end relative">
          {/* Architectural Laser Line that draws across on entry */}
          <div 
            ref={laserLineRef}
            className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-[#FF3B30] via-white/50 to-transparent origin-left scale-x-0 will-change-transform pointer-events-none" 
          />
          <div className="md:col-span-8 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
            <h2 
              ref={sectionTitleRef}
              className="text-xs font-mono uppercase tracking-[0.25em] text-white font-medium"
            >
              02 /// Profile &amp; Philosophy
            </h2>
          </div>
          <div className="md:col-span-4 flex justify-end items-center gap-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 hidden sm:inline-block">
              ATLAS INSTITUTE · CU BOULDER
            </span>
          </div>
        </div>

        {/* Intro Bio & Philosophy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-28 relative">
          
          {/* Left Column: Location & Context */}
          <div className="md:col-span-4">
            <div className="sticky top-28 self-start space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 block font-medium">
                Location &amp; Domain
              </span>
              <div className="space-y-1.5 text-xs font-mono text-neutral-400">
                <div className="text-white">Boulder, Colorado</div>
                <div>Creative Technology &amp; Design</div>
                <div className="text-neutral-400">ATLAS Institute, CU Boulder</div>
              </div>
            </div>
          </div>

          {/* Right Column: Monumental Scrubbed Bio */}
          <div className="md:col-span-8" data-cursor-text="READ">
            <div 
              ref={bioContainerRef} 
              className="text-2xl sm:text-4xl md:text-5xl font-sans font-medium leading-[1.3] tracking-tight mb-12 text-white py-1 select-text"
            >
              {renderSplitWords()}
            </div>

            {/* Architectural Philosophy Card */}
            <div 
              ref={insightRef} 
              className="border-l-2 border-[#FF3B30] pl-6 md:pl-8 py-5 bg-white/[0.02] border-y border-r border-white/[0.05] rounded-none will-change-transform backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]"></span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-white font-semibold">
                  Accessibility &amp; Ergonomics
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
               <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 block font-medium">
                 Experience
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
                  className="group inline-flex items-center gap-2 px-4 py-2 border border-white/30 rounded-none font-mono text-[10px] md:text-xs uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] active:scale-95"
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
                <span className="font-mono text-xs uppercase tracking-wider text-white font-medium">
                  Education
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
                  <span className="font-mono text-xs uppercase tracking-wider text-white font-medium">
                    Skills &amp; Capabilities
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
                  <span className="font-mono text-xs uppercase tracking-wider text-white font-medium">
                    Certifications
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
