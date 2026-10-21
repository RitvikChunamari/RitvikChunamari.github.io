import React, { useState, useRef, useLayoutEffect } from 'react';
import { Project } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectListProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectClick }) => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const laserLineRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useLayoutEffect(() => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // 1. Section Header Architectural Laser Line Reveal
      if (laserLineRef.current && sectionRef.current) {
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

      // 2. Individual Project Card Reveals & Dual-Layer Parallax
      rowRefs.current.forEach((row, index) => {
        if (!row) return;

        const container = containerRefs.current[index];
        const img = imageRefs.current[index];
        const separator = row.querySelector('.separator');
        const title = row.querySelector('.project-title');
        const meta = row.querySelectorAll('.project-meta');
        const arrow = row.querySelector('.project-arrow');
        const redBar = row.querySelector('.project-red-bar');
        const brackets = row.querySelector('.corner-brackets') as HTMLElement | null;

        if (isReduced) {
          gsap.set(row, { opacity: 1, y: 0 });
          if (container) gsap.set(container, { clipPath: 'inset(0% round 4px)', opacity: 1, scale: 1 });
          if (img) gsap.set(img, { opacity: 1, scale: 1, yPercent: 0 });
          if (title) gsap.set(title, { y: '0%', opacity: 1 });
          if (meta) gsap.set(meta, { y: '0%', opacity: 1 });
          if (arrow) gsap.set(arrow, { scale: 1, opacity: 1 });
          if (separator) gsap.set(separator, { scaleX: 1 });
          if (redBar) gsap.set(redBar, { scaleX: 1 });
          if (brackets) brackets.style.opacity = '0.5';
          return;
        }

        // Entrance Reveal Timeline (Reversible when scrolling back up above card)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        });

        tl.fromTo(row,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }
        );

        if (container) {
          tl.fromTo(container,
            { clipPath: 'inset(6% 0% 6% 0% round 4px)', opacity: 0.8, scale: 0.98 },
            { clipPath: 'inset(0% 0% 0% 0% round 4px)', opacity: 1, scale: 1, duration: 0.85, ease: 'power3.inOut' },
            '-=0.55'
          );
        }

        if (img) {
          tl.fromTo(img,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: 'power2.out' },
            '-=0.6'
          );
        }

        if (title) {
          tl.fromTo(title,
            { y: '110%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 0.8, ease: 'power4.out' },
            '-=0.6'
          );
        }

        if (meta && meta.length) {
          tl.fromTo(meta,
            { y: '100%', opacity: 0 },
            { y: '0%', opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' },
            '-=0.6'
          );
        }

        if (arrow) {
          tl.fromTo(arrow,
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' },
            '-=0.4'
          );
        }

        if (separator) {
          tl.fromTo(separator,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: 'power3.out' },
            '-=0.5'
          );
        }

        if (redBar) {
          tl.fromTo(redBar,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: 'power3.out' },
            '-=0.6'
          );
        }

        // Bidirectional Dual-Layer Image Parallax Float
        if (img) {
          gsap.fromTo(img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
              }
            }
          );
        }

        // Center-focus telemetry ignition: Corner brackets & Swiss red line highlight via smooth GSAP tweens
        ScrollTrigger.create({
          trigger: row,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => {
            if (brackets) gsap.to(brackets, { opacity: 0.85, duration: 0.35, overwrite: 'auto' });
            if (redBar) gsap.to(redBar, { scaleX: 1.8, duration: 0.35, overwrite: 'auto' });
          },
          onLeave: () => {
            if (brackets) gsap.to(brackets, { opacity: 0.35, duration: 0.35, overwrite: 'auto' });
            if (redBar) gsap.to(redBar, { scaleX: 1.0, duration: 0.35, overwrite: 'auto' });
          },
          onEnterBack: () => {
            if (brackets) gsap.to(brackets, { opacity: 0.85, duration: 0.35, overwrite: 'auto' });
            if (redBar) gsap.to(redBar, { scaleX: 1.8, duration: 0.35, overwrite: 'auto' });
          },
          onLeaveBack: () => {
            if (brackets) gsap.to(brackets, { opacity: 0.35, duration: 0.35, overwrite: 'auto' });
            if (redBar) gsap.to(redBar, { scaleX: 1.0, duration: 0.35, overwrite: 'auto' });
          },
        });

      });
    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  // Card cursor spotlight sheen & 3D tilt microinteraction
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const isTouchOrMobile = typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    if (isTouchOrMobile) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);

    const rotateY = ((x / rect.width) - 0.5) * 5;
    const rotateX = (0.5 - (y / rect.height)) * 5;
    e.currentTarget.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.008)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1.0)';
  };

  return (
    <section ref={sectionRef} id="work" className="relative py-24 md:py-32 min-h-screen z-20">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header Synchronized with Hero Swiss Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-16 md:mb-24 border-b border-white/10 pb-6 items-end relative">
          {/* Architectural Laser Line that draws across on entry */}
          <div 
            ref={laserLineRef}
            className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-[#FF3B30] via-white/50 to-transparent origin-left scale-x-0 will-change-transform pointer-events-none" 
          />
          <div className="md:col-span-4 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
            <h2 className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/80 font-medium">
              01 /// SELECTED WORKS
            </h2>
          </div>
          <div className="md:col-span-8 flex justify-between md:justify-end items-center gap-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/60">
              INDEX 001 — 00{projects.length}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 hidden sm:inline-block">
              CURATED ARCHIVE 2024–2026
            </span>
          </div>
        </div>

        {/* Project Cards Stream */}
        <div className="flex flex-col gap-28 md:gap-36">
          {projects.map((project, index) => (
            <div 
              key={index}
              data-index={index}
              ref={(el) => { if (el) rowRefs.current[index] = el; }}
              role="button"
              tabIndex={0}
              aria-label={`View case study: ${project.title} — ${project.category}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onProjectClick(project);
                }
              }}
              style={{ opacity: 0, transform: 'translate3d(0, 35px, 0)' }}
              className="group relative cursor-pointer will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-8 focus-visible:ring-offset-[#050507] rounded-sm active:scale-[0.99] transition-transform duration-150"
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => onProjectClick(project)}
              data-cursor-text="VIEW CASE"
            >
              {/* Frosted Obsidian Showcase Frame */}
              <div 
                ref={(el) => { if (el) containerRefs.current[index] = el; }}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="image-container w-full h-[50vh] md:h-[68vh] relative overflow-hidden mb-8 rounded-sm bg-[#09090e]/75 backdrop-blur-md flex items-center justify-center p-8 md:p-16 border border-white/10 will-change-transform opacity-0 scale-[0.98] transition-[border-color,box-shadow] duration-500 group-hover:border-white/30 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              >
                {/* Reactive Cursor Spotlight Sheen */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-sm z-10"
                  style={{
                    background: 'radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.045), transparent 60%)',
                  }}
                />

                {/* Swiss Corner Registration Brackets */}
                <div className="corner-brackets absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 opacity-35 group-hover:opacity-75 transition-opacity duration-300">
                  <div className="flex justify-between items-start">
                    <span className="w-2.5 h-2.5 border-t border-l border-white/60"></span>
                    <span className="font-mono text-[8px] tracking-widest text-white/60 uppercase">
                      FOLIO // REF-0{index + 1}
                    </span>
                    <span className="w-2.5 h-2.5 border-t border-r border-white/60"></span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="w-2.5 h-2.5 border-b border-l border-white/60"></span>
                    <span className="w-2.5 h-2.5 border-b border-r border-white/60"></span>
                  </div>
                </div>

                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-black/15 z-10 group-hover:bg-transparent transition-colors duration-700 pointer-events-none"></div>

                {/* Project Image with Silky Parallax Float */}
                <img 
                  ref={(el) => { if (el) imageRefs.current[index] = el; }}
                  src={project.image} 
                  alt={project.title} 
                  className="max-w-[88%] max-h-[82%] object-contain relative z-10 group-hover:scale-105 transition-all duration-700 ease-out will-change-transform drop-shadow-[0_15px_40px_rgba(0,0,0,0.7)] opacity-0"
                />
              </div>

              {/* Project Editorial Metadata & Monumental Title */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start relative z-10">
                
                {/* Index Number */}
                <div className="md:col-span-1 hidden md:block overflow-hidden pt-2">
                  <span className="project-meta block font-mono text-xs text-white/60 group-hover:text-white transition-colors transform translate-y-full opacity-0 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#FF3B30] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </span>
                </div>

                {/* Title and Swiss Red Line */}
                <div className="md:col-span-7 overflow-hidden py-2">
                  <h3 className="project-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white/95 group-hover:text-white transition-all duration-300 transform translate-y-[110%] will-change-transform">
                    {project.title}
                  </h3>
                  {/* Signature Swiss Red Accent Line matching Hero */}
                  <div className="project-red-bar w-10 h-[2px] bg-[#FF3B30] mt-3 origin-left transition-all duration-300 scale-x-0 group-hover:w-20" />
                </div>

                {/* Category, Year & Arrow */}
                <div className="md:col-span-4 flex justify-between items-start pt-2 md:pt-4 overflow-hidden">
                  <div className="flex flex-col gap-1.5">
                    <span className="project-meta block text-xs md:text-sm font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors transform translate-y-full opacity-0">
                      {project.category}
                    </span>
                    {project.caseStudy?.year && (
                      <span className="project-meta block font-mono text-[10px] uppercase tracking-widest text-white/60 transform translate-y-full opacity-0">
                        {project.caseStudy.year}
                      </span>
                    )}
                    {project.caseStudy?.technologies && (
                      <div className="project-meta flex flex-wrap items-center gap-x-2 gap-y-1 mt-2.5 font-mono text-[9px] uppercase tracking-wider text-white/60 transform translate-y-full opacity-0">
                        {project.caseStudy.technologies.slice(0, 3).map((tech, tIdx) => (
                          <React.Fragment key={tIdx}>
                            <span className="hover:text-white transition-colors">{tech}</span>
                            {tIdx < Math.min(2, project.caseStudy!.technologies.length - 1) && (
                              <span className="text-white/20">/</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Circular Interactive Arrow Button */}
                  <div className="project-arrow w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 group-hover:scale-110 group-active:scale-95 transform scale-50 opacity-0 flex-shrink-0 ml-4">
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform group-hover:rotate-45 transition-transform duration-500">
                      <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                    </svg>
                  </div>
                </div>

              </div>
              
              {/* Continuous Hairline Section Separator */}
              <div className="separator absolute -bottom-14 md:-bottom-18 left-0 w-full h-[1px] bg-white/[0.08] origin-left transform scale-x-0"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ProjectList);
