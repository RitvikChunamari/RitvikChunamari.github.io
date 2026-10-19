import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import gsap from 'gsap';

interface ProjectListProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectClick }) => {
  const [viewMode, setViewMode] = useState<'editorial' | 'index'>('editorial');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'product' | 'experiment'>('all');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Filter projects according to category
  const filteredProjects = projects.filter(p => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'product') {
      return p.projectGroup === 'featured' || p.category.toLowerCase().includes('ux') || p.category.toLowerCase().includes('design') || p.category.toLowerCase().includes('rebrand');
    }
    if (selectedFilter === 'experiment') {
      return p.projectGroup === 'experiment' || p.category.toLowerCase().includes('ai') || p.category.toLowerCase().includes('mechatronics') || p.category.toLowerCase().includes('motion');
    }
    return true;
  });

  useEffect(() => {
    // Staggered reveal observer for Editorial Mode
    if (viewMode !== 'editorial') return;

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

              const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              if (isReduced) {
                target.style.opacity = '1';
                target.style.transform = 'none';
                if (container) {
                  container.style.opacity = '1';
                  container.style.transform = 'none';
                  container.style.clipPath = 'none';
                }
                if (img) {
                  img.style.opacity = '1';
                  img.style.transform = 'none';
                }
                if (title) {
                  (title as HTMLElement).style.opacity = '1';
                  (title as HTMLElement).style.transform = 'none';
                }
                meta.forEach(m => {
                  (m as HTMLElement).style.opacity = '1';
                  (m as HTMLElement).style.transform = 'none';
                });
                if (arrow) {
                  (arrow as HTMLElement).style.opacity = '1';
                  (arrow as HTMLElement).style.transform = 'none';
                }
                if (separator) (separator as HTMLElement).style.transform = 'none';
                if (redBar) (redBar as HTMLElement).style.transform = 'none';
                return;
              }

              const tl = gsap.timeline({ delay: staggerDelay });

              tl.to(target, {
                opacity: 1,
                y: 0,
                duration: 0.75,
                ease: 'power3.out',
              });

              if (container) {
                tl.fromTo(container,
                  { clipPath: 'inset(6% 0% 6% 0% round 4px)' },
                  { clipPath: 'inset(0% 0% 0% 0% round 4px)', duration: 0.85, ease: 'power3.inOut' },
                  '-=0.55'
                );
              }

              tl.to([container, img], {
                opacity: 1,
                scale: 1,
                duration: 0.85,
                ease: 'power2.out',
              }, '-=0.75')
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
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );

    rowRefs.current.forEach((row) => {
      if (row) observer.observe(row);
    });

    let ticking = false;
    const updateParallax = () => {
      const windowHeight = window.innerHeight;
      const centerY = windowHeight * 0.5;

      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const rect = row.getBoundingClientRect();
        const img = imageRefs.current[index];

        if (rect.top < windowHeight && rect.bottom > 0) {
          if (img) {
            const parallaxProgress = 1 - (rect.bottom / (windowHeight + rect.height));
            const yOffset = (parallaxProgress - 0.5) * 14; 
            img.style.transform = `translate3d(0, ${yOffset.toFixed(2)}%, 0)`;
          }

          const cardCenter = rect.top + rect.height * 0.5;
          const distFromCenter = Math.abs(cardCenter - centerY);
          const focusFactor = Math.max(0, 1 - distFromCenter / (windowHeight * 0.45));

          const redBar = row.querySelector('.project-red-bar') as HTMLElement | null;
          if (redBar && row.classList.contains('ignited')) {
            const barScale = 1 + focusFactor * 0.9;
            redBar.style.transform = `scaleX(${barScale.toFixed(2)})`;
          }

          const brackets = row.querySelector('.corner-brackets') as HTMLElement | null;
          if (brackets) {
            brackets.style.opacity = `${(0.35 + focusFactor * 0.45).toFixed(2)}`;
          }
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
  }, [filteredProjects, viewMode]);

  // Card cursor spotlight sheen & 3D tilt microinteraction
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);

    const rotateY = ((x / rect.width) - 0.5) * 5;
    const rotateX = (0.5 - (y / rect.height)) * 5;
    e.currentTarget.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.006)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1.0)';
  };

  return (
    <section id="work" className="relative py-24 md:py-32 min-h-screen z-20 select-none">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header Synchronized with Swiss Telemetry */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-12 md:mb-16 border-b border-white/10 pb-6 items-end gap-6">
           <div className="md:col-span-5 flex items-center gap-3">
             <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
             <div>
               <h2 className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/80 font-medium">
                 01 /// SELECTED WORKS
               </h2>
               <p className="text-xs text-neutral-400 font-mono mt-1">
                 Product Design, Interaction Architecture &amp; Creative Technology
               </p>
             </div>
           </div>

           {/* Controls: Category Filter & View Mode Toggles */}
           <div className="md:col-span-7 flex flex-wrap justify-between md:justify-end items-center gap-4">
             
             {/* Category Filter Chips */}
             <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-sm border border-white/10" role="tablist" aria-label="Project Category Filter">
               {(['all', 'product', 'experiment'] as const).map(filter => (
                 <button
                   key={filter}
                   role="tab"
                   aria-selected={selectedFilter === filter}
                   onClick={() => setSelectedFilter(filter)}
                   className={`px-3 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider rounded-sm transition-all duration-200 cursor-pointer ${
                     selectedFilter === filter
                       ? 'bg-white text-black font-bold shadow-sm'
                       : 'text-neutral-400 hover:text-white'
                   }`}
                 >
                   {filter === 'all' ? 'All' : filter === 'product' ? 'Product & UX' : 'Experiments'}
                 </button>
               ))}
             </div>

             {/* Mode Switcher: Mode A (Editorial Exhibition) vs Mode B (Compact Index) */}
             <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-sm border border-white/10">
               <button
                 onClick={() => setViewMode('editorial')}
                 className={`px-3 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider rounded-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                   viewMode === 'editorial'
                     ? 'bg-[#FF3B30] text-white font-bold'
                     : 'text-neutral-400 hover:text-white'
                 }`}
                 title="Mode A: Editorial Exhibition"
                 data-cursor-text="EXHIBIT"
               >
                 <span>Exhibition</span>
               </button>
               <button
                 onClick={() => setViewMode('index')}
                 className={`px-3 py-1 text-[10px] sm:text-xs font-mono uppercase tracking-wider rounded-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                   viewMode === 'index'
                     ? 'bg-[#FF3B30] text-white font-bold'
                     : 'text-neutral-400 hover:text-white'
                 }`}
                 title="Mode B: Compact Index"
                 data-cursor-text="INDEX"
               >
                 <span>Index</span>
               </button>
             </div>

           </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MODE A: EDITORIAL EXHIBITION (Large Artwork, Storytelling)
            ───────────────────────────────────────────────────────────── */}
        {viewMode === 'editorial' ? (
          <div className="flex flex-col gap-28 md:gap-36">
            {filteredProjects.map((project, index) => {
              const showExperimentDivider = selectedFilter === 'all' && project.projectGroup === 'experiment' && (index === 0 || filteredProjects[index - 1]?.projectGroup === 'featured');
              return (
                <React.Fragment key={project.slug || project.title}>
                  {showExperimentDivider && (
                    <div className="pt-12 pb-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4" data-testid="experiment-category-divider">
                      <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
                        <div>
                          <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-white/80 font-medium">
                            01.2 /// CREATIVE COMPUTING &amp; EXPERIMENTS
                          </h3>
                          <p className="text-xs text-neutral-400 font-mono mt-1">
                            Quantitative AI, Physical Computing &amp; Generative Identity Systems
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                        RESEARCH LAB // 03 EXPERIMENTS
                      </span>
                    </div>
                  )}
                  <div 
                    data-index={index}
                    ref={(el) => { if (el) rowRefs.current[index] = el; }}
                    style={{ opacity: 0, transform: 'translate3d(0, 35px, 0)' }}
                    className="group relative cursor-pointer will-change-transform"
                    onMouseEnter={() => setHoveredProject(index)}
                    onMouseLeave={() => setHoveredProject(null)}
                    onClick={() => onProjectClick(project)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onProjectClick(project);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View case study: ${project.title}`}
                    data-cursor-text="VIEW CASE"
                  >
                {/* Frosted Obsidian Showcase Frame */}
                <div 
                  ref={(el) => { if (el) containerRefs.current[index] = el; }}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className="image-container w-full h-[52vh] sm:h-[60vh] md:h-[68vh] relative overflow-hidden mb-8 rounded-sm bg-[#09090E]/80 backdrop-blur-md flex items-center justify-center p-6 sm:p-10 md:p-16 border border-white/10 will-change-transform opacity-0 scale-[0.98] transition-[border-color,box-shadow] duration-500 group-hover:border-white/30 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)] group-focus-visible:border-[#FF3B30]"
                >
                  {/* Reactive Cursor Spotlight Sheen */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-sm z-10"
                    style={{
                      background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.07), transparent 60%)',
                    }}
                  />

                  {/* Swiss Corner Registration Brackets */}
                  <div className="corner-brackets absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-6 opacity-35 group-hover:opacity-80 transition-opacity duration-300">
                    <div className="flex justify-between items-start">
                      <span className="w-2.5 h-2.5 border-t border-l border-white/60"></span>
                      <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-white/40 uppercase">
                        FOLIO // EXHIBIT-0{index + 1}
                      </span>
                      <span className="w-2.5 h-2.5 border-t border-r border-white/60"></span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="w-2.5 h-2.5 border-b border-l border-white/60"></span>
                      <span className="w-2.5 h-2.5 border-b border-r border-white/60"></span>
                    </div>
                  </div>

                  {/* Ambient vignette */}
                  <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-700 pointer-events-none"></div>

                  {/* Project Image with Silky Parallax Float */}
                  <img 
                    ref={(el) => { if (el) imageRefs.current[index] = el; }}
                    src={project.image} 
                    alt={project.title} 
                    className="max-w-[90%] max-h-[85%] object-contain relative z-10 group-hover:scale-105 transition-all duration-700 ease-out will-change-transform drop-shadow-[0_15px_40px_rgba(0,0,0,0.7)] opacity-0"
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
                  <div className="md:col-span-7 overflow-hidden py-1">
                    <h3 className="project-title text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white/95 group-hover:text-white transition-all duration-300 transform translate-y-[110%] will-change-transform">
                      {project.title}
                    </h3>
                    <div className="project-red-bar w-10 h-[2px] bg-[#FF3B30] mt-3 origin-left transition-all duration-300 scale-x-0 group-hover:w-20" />
                    
                    {/* Executive Summary 1-liner */}
                    {project.description?.[0] && (
                      <p className="text-xs sm:text-sm text-neutral-400 mt-3 font-sans line-clamp-2 leading-relaxed">
                        {project.description[0]}
                      </p>
                    )}
                  </div>

                  {/* Category, Year, Tech Stack & Action Arrow */}
                  <div className="md:col-span-4 flex justify-between items-start pt-2 md:pt-4 overflow-hidden">
                     <div className="flex flex-col gap-1.5">
                       <span className="project-meta block text-xs md:text-sm font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors transform translate-y-full opacity-0">
                         {project.category}
                       </span>
                       {project.caseStudy?.year && (
                         <span className="project-meta block font-mono text-[10px] uppercase tracking-widest text-white/40 transform translate-y-full opacity-0">
                           {project.caseStudy.year} · {project.caseStudy.role || 'Design Lead'}
                         </span>
                       )}
                       {project.caseStudy?.technologies && (
                         <div className="project-meta flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 font-mono text-[9px] uppercase tracking-wider text-white/45 transform translate-y-full opacity-0">
                           {project.caseStudy.technologies.slice(0, 4).map((tech, tIdx) => (
                             <React.Fragment key={tIdx}>
                               <span className="hover:text-white transition-colors">{tech}</span>
                               {tIdx < Math.min(3, project.caseStudy!.technologies.length - 1) && (
                                 <span className="text-white/20">/</span>
                               )}
                             </React.Fragment>
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
            </React.Fragment>
          );
        })}
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────
              MODE B: COMPACT INDEX (Scannable Architectural Directory)
              ───────────────────────────────────────────────────────────── */
          <div className="border border-white/10 rounded-sm bg-[#09090E]/60 backdrop-blur-md overflow-hidden">
            {/* Index Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-white/40 bg-white/[0.02]">
              <div className="col-span-1 hidden sm:block">#</div>
              <div className="col-span-6 sm:col-span-5">PROJECT NAME</div>
              <div className="col-span-4 sm:col-span-4">DISCIPLINE &amp; FOCUS</div>
              <div className="col-span-2 hidden md:block">YEAR</div>
              <div className="col-span-2 sm:col-span-2 text-right">ACTION</div>
            </div>

            {/* Index Rows */}
            <div className="divide-y divide-white/[0.06]">
              {filteredProjects.map((project, idx) => {
                const showExperimentDivider = selectedFilter === 'all' && project.projectGroup === 'experiment' && (idx === 0 || filteredProjects[idx - 1]?.projectGroup === 'featured');
                return (
                  <React.Fragment key={project.slug || project.title}>
                    {showExperimentDivider && (
                      <div className="px-6 py-3 bg-white/[0.02] border-y border-white/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/60" data-testid="experiment-index-divider">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]"></span>
                          <span>TECHNOLOGY EXPERIMENTS &amp; COMPUTATIONAL CRAFT</span>
                        </div>
                        <span className="text-white/40">RESEARCH LAB</span>
                      </div>
                    )}
                    <div
                      onClick={() => onProjectClick(project)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onProjectClick(project);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Open project ${project.title}`}
                      className="group grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-white/[0.04] transition-colors duration-200 cursor-pointer focus-visible:bg-white/[0.06]"
                      data-cursor-text="OPEN"
                    >
                      <div className="col-span-1 hidden sm:block font-mono text-xs text-white/40 group-hover:text-[#FF3B30] transition-colors">
                        {String(idx + 1).padStart(2, '0')}
                      </div>

                      <div className="col-span-6 sm:col-span-5">
                        <h4 className="text-base sm:text-lg font-bold uppercase tracking-tight text-white group-hover:text-white transition-colors">
                          {project.title}
                        </h4>
                        <span className="block sm:hidden font-mono text-[10px] text-white/40 mt-0.5">
                          {project.category}
                        </span>
                      </div>

                      <div className="col-span-4 sm:col-span-4">
                        <span className="text-xs sm:text-sm text-neutral-300 font-mono uppercase tracking-wider block">
                          {project.category}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono hidden sm:block">
                          {project.caseStudy?.role || 'Product Design'}
                        </span>
                      </div>

                      <div className="col-span-2 hidden md:block font-mono text-xs text-white/40">
                        {project.caseStudy?.year || '2026'}
                      </div>

                      <div className="col-span-2 sm:col-span-2 text-right font-mono text-xs text-white/50 group-hover:text-[#FF3B30] flex items-center justify-end gap-1.5 transition-colors">
                        <span className="hidden sm:inline">VIEW CASE</span>
                        <span>↗</span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default React.memo(ProjectList);
