import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import gsap from 'gsap';

interface ProjectListProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectClick }) => {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    // Smooth Staggered Reveal Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            if (!target.classList.contains('ignited')) {
              target.classList.add('ignited');
              
              const indexAttr = target.getAttribute('data-index');
              const index = indexAttr ? parseInt(indexAttr, 10) : 0;
              const staggerDelay = (index % 2) * 0.08;

              const container = containerRefs.current[index];
              const img = imageRefs.current[index];
              const separator = target.querySelector('.separator');
              const title = target.querySelector('.project-title');
              const meta = target.querySelectorAll('.project-meta');
              const arrow = target.querySelector('.project-arrow');
              const redBar = target.querySelector('.project-red-bar');

              const tl = gsap.timeline({ delay: staggerDelay });

              // 1. Reveal Container Skeleton
              tl.to(target, {
                opacity: 1,
                y: 0,
                duration: 0.75,
                ease: 'power3.out',
              })
              // 2. Smooth Image Fade & Scale Settle
              .to([container, img], {
                opacity: 1,
                scale: 1,
                duration: 0.85,
                ease: 'power2.out',
              }, '-=0.5')
              // 3. Metadata & Title Reveal
              .to(title, {
                y: '0%',
                opacity: 1,
                duration: 0.8,
                ease: 'power4.out',
              }, '-=0.6')
              .to(meta, {
                y: '0%',
                opacity: 1,
                duration: 0.6,
                stagger: 0.06,
                ease: 'power3.out',
              }, '-=0.6')
              .to(arrow, {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: 'back.out(1.5)',
              }, '-=0.4')
              .to([separator, redBar], {
                scaleX: 1,
                duration: 0.8,
                ease: 'power3.out',
              }, '-=0.5');
            }
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );

    rowRefs.current.forEach((row) => {
      if (row) observer.observe(row);
    });

    // Throttled Parallax on Scroll (Zero idle CPU / RAF thrashing)
    let ticking = false;
    const updateParallax = () => {
      const windowHeight = window.innerHeight;

      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const rect = row.getBoundingClientRect();
        const img = imageRefs.current[index];

        if (img && rect.top < windowHeight && rect.bottom > 0) {
          const parallaxProgress = 1 - (rect.bottom / (windowHeight + rect.height));
          const yOffset = (parallaxProgress - 0.5) * 12; 
          img.style.transform = `translate3d(0, ${yOffset.toFixed(2)}%, 0)`;
        }
      });

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    requestAnimationFrame(updateParallax);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [projects]);

  // Card cursor spotlight sheen
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section id="work" className="relative py-24 md:py-32 min-h-screen z-20">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header Synchronized with Hero Swiss Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-16 md:mb-24 border-b border-white/10 pb-6 items-end">
           <div className="md:col-span-4 flex items-center gap-3">
             <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
             <h2 className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/80 font-medium">
               01 /// SELECTED WORKS
             </h2>
           </div>
           <div className="md:col-span-8 flex justify-between md:justify-end items-center gap-6">
             <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40">
               INDEX 001 — 00{projects.length}
             </span>
             <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 hidden sm:inline-block">
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
              style={{ opacity: 0, transform: 'translate3d(0, 35px, 0)' }}
              className="group relative cursor-pointer will-change-transform"
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => onProjectClick(project)}
              data-cursor-text="VIEW CASE"
            >
              {/* Frosted Obsidian Showcase Frame */}
              <div 
                ref={(el) => { if (el) containerRefs.current[index] = el; }}
                onMouseMove={handleCardMouseMove}
                className="image-container w-full h-[52vh] md:h-[72vh] relative overflow-hidden mb-8 rounded-sm bg-[#09090e]/75 backdrop-blur-md flex items-center justify-center p-8 md:p-16 border border-white/10 will-change-transform opacity-0 scale-[0.98] transition-[border-color,box-shadow] duration-500 group-hover:border-white/30 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              >
                {/* Reactive Cursor Spotlight Sheen */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-sm z-10"
                  style={{
                    background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), transparent 60%)',
                  }}
                />

                {/* Swiss Corner Registration Brackets */}
                <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 opacity-35 group-hover:opacity-75 transition-opacity duration-300">
                  <div className="flex justify-between items-start">
                    <span className="w-2.5 h-2.5 border-t border-l border-white/60"></span>
                    <span className="font-mono text-[8px] tracking-widest text-white/40 uppercase">
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
                  <span className="project-meta block font-mono text-xs text-white/40 group-hover:text-white transition-colors transform translate-y-full opacity-0 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#FF3B30] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </span>
                </div>

                {/* Title and Swiss Red Line */}
                <div className="md:col-span-7 overflow-hidden py-2">
                  <h3 className="project-title text-4xl sm:text-6xl md:text-8xl font-bold uppercase tracking-tighter text-white/90 group-hover:text-white transition-all duration-300 mix-blend-screen transform translate-y-[110%] will-change-transform">
                    {project.title}
                  </h3>
                  {/* Signature Swiss Red Accent Line matching Hero */}
                  <div className="project-red-bar w-8 h-[2px] bg-[#FF3B30] mt-3 group-hover:w-16 origin-left transition-all duration-300 scale-x-0" />
                </div>

                {/* Category, Year & Arrow */}
                <div className="md:col-span-4 flex justify-between items-start pt-2 md:pt-4 overflow-hidden">
                   <div className="flex flex-col gap-1.5">
                     <span className="project-meta block text-xs md:text-sm font-bold uppercase tracking-widest text-white/60 group-hover:text-white transition-colors transform translate-y-full opacity-0">
                       {project.category}
                     </span>
                     {project.caseStudy?.year && (
                       <span className="project-meta block font-mono text-[10px] uppercase tracking-widest text-white/35 transform translate-y-full opacity-0">
                         {project.caseStudy.year}
                       </span>
                     )}
                     {project.caseStudy?.technologies && (
                       <div className="flex flex-wrap gap-1.5 mt-2">
                         {project.caseStudy.technologies.slice(0, 3).map((tech, tIdx) => (
                           <span key={tIdx} className="font-mono text-[9px] uppercase tracking-wider text-white/45 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                             {tech}
                           </span>
                         ))}
                       </div>
                     )}
                   </div>

                   {/* Circular Interactive Arrow Button */}
                   <div className="project-arrow w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 group-hover:scale-110 transform scale-50 opacity-0 flex-shrink-0 ml-4">
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
