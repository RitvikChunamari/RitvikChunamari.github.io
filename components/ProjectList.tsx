import React, { useState, useRef, useLayoutEffect } from 'react';
import { Project } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrambleText } from '../utils/scrambleText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectListProps {
  projects: Project[];
  onProjectClick: (project: Project, cardEl?: HTMLElement) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectClick }) => {
  const [activeDeckIndex, setActiveDeckIndex] = useState<number>(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const lastActiveIndexRef = useRef<number>(0);
  const cardRectsRef = useRef<{ [key: number]: DOMRect }>({});
  const sectionRef = useRef<HTMLElement>(null);
  const sectionTitleRef = useRef<HTMLHeadingElement>(null);
  const deckWrapperRef = useRef<HTMLDivElement>(null);
  const laserLineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardInnerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Section Header Architectural Laser Line Reveal & Cryptographic Scramble
      if (laserLineRef.current) {
        gsap.fromTo(laserLineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
              onEnter: () => {
                if (sectionTitleRef.current) {
                  scrambleText(sectionTitleRef.current, '01 /// SELECTED WORKS', { duration: 600 });
                }
              }
            }
          }
        );
      }

      const mm = gsap.matchMedia();

      // DESKTOP: 3D Spatial Stacking Deck (Lenis-synchronized, pinned stage)
      mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
        const totalCards = projects.length;
        if (!deckWrapperRef.current || totalCards === 0) return;

        // Set Initial Stacking Context & 3D Plate Transforms (Solid Opaque Physical Plates)
        cardRefs.current.forEach((card, idx) => {
          if (!card) return;
          if (idx === 0) {
            gsap.set(card, {
              y: 0,
              z: 0,
              rotateX: 0,
              scale: 1,
              opacity: 1,
              zIndex: 10,
              pointerEvents: 'auto',
            });
          } else {
            gsap.set(card, {
              y: window.innerHeight * 1.15,
              z: 0,
              rotateX: 0,
              scale: 1,
              opacity: 1,
              zIndex: 10 + idx * 10,
              pointerEvents: 'none',
            });
          }
        });

        // Continuous Master Stacking Timeline (60/120fps hardware accelerated)
        const deckTl = gsap.timeline({
          scrollTrigger: {
            trigger: deckWrapperRef.current,
            start: 'top top',
            end: `+=${(totalCards - 1) * 75}%`,
            pin: true,
            scrub: 0.35,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const currentActive = Math.min(totalCards - 1, Math.floor(p * (totalCards - 1) + 0.45));
              
              if (lastActiveIndexRef.current !== currentActive) {
                lastActiveIndexRef.current = currentActive;
                setActiveDeckIndex(currentActive);
              }

              // Update pointer-events so only the active focal card receives clicks
              cardRefs.current.forEach((card, idx) => {
                if (!card) return;
                card.style.pointerEvents = idx === currentActive ? 'auto' : 'none';
              });
            }
          }
        });

        // Build sequential plate stacking choreographies with stepped tab offsets
        for (let i = 0; i < totalCards - 1; i++) {
          const outgoingCard = cardRefs.current[i];
          const incomingCard = cardRefs.current[i + 1];
          const segmentStart = i;

          if (outgoingCard) {
            // Outgoing card lifts back into depth with stepped tab offset (-44px)
            deckTl.to(outgoingCard, {
              z: -120,
              y: -44,
              rotateX: 3.5,
              scale: 0.94,
              opacity: 0.65,
              ease: 'power1.inOut',
              duration: 1,
            }, segmentStart);

            // Previous cards in the stack step further back (-80px, -112px...)
            for (let k = 0; k < i; k++) {
              const previousCard = cardRefs.current[k];
              if (previousCard) {
                const step = i - k + 1;
                const tabOffset = -44 - (step - 1) * 32;
                const depthOffset = -120 - (step - 1) * 80;
                deckTl.to(previousCard, {
                  z: depthOffset,
                  y: tabOffset,
                  rotateX: 3.5 + (step - 1) * 1.5,
                  scale: Math.max(0.82, 0.94 - (step - 1) * 0.04),
                  opacity: Math.max(0.22, 0.65 - (step - 1) * 0.14),
                  ease: 'power1.inOut',
                  duration: 1,
                }, segmentStart);
              }
            }
          }

          if (incomingCard) {
            // Incoming card slides up smoothly from below to cover the card behind it
            deckTl.to(incomingCard, {
              y: 0,
              z: 0,
              rotateX: 0,
              scale: 1,
              opacity: 1,
              ease: 'power1.out',
              duration: 1,
            }, segmentStart);
          }
        }
      });

      // MOBILE: Tactile Unpinned Vertical Stream (0% scroll trapping, natural touch inertia)
      mm.add("(max-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        cardRefs.current.forEach((card) => {
          if (!card) return;
          gsap.set(card, {
            y: 0,
            z: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            pointerEvents: 'auto',
          });

          // Subtle focal scaling as card scrolls through mobile viewport center
          gsap.fromTo(card,
            { scale: 0.95, opacity: 0.8 },
            {
              scale: 1,
              opacity: 1,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'center center',
                scrub: 0.6,
              }
            }
          );
        });
      });

      // REDUCED MOTION: Static Clean Accessibility Fallback
      mm.add("(prefers-reduced-motion: reduce)", () => {
        cardRefs.current.forEach((card) => {
          if (!card) return;
          gsap.set(card, {
            y: 0,
            z: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            pointerEvents: 'auto',
          });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  // Reactive Cursor Spotlight & Damped 3D Elastic Card Tilt
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const isTouchOrMobile = typeof window !== 'undefined' && 
      (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    if (isTouchOrMobile) return;

    const card = cardRefs.current[index];
    if (!card) return;

    // Use cached rect or compute once per hover session
    let rect = cardRectsRef.current[index];
    if (!rect) {
      rect = card.getBoundingClientRect();
      cardRectsRef.current[index] = rect;
    }

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // Damped 3D tilt interaction with natural easing
    const rotateY = ((x / rect.width) - 0.5) * 4.5;
    const rotateX = (0.5 - (y / rect.height)) * 4.5;
    const inner = cardInnerRefs.current[index];
    if (inner) {
      gsap.to(inner, {
        rotateX,
        rotateY,
        scale: 1.006,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleCardMouseEnter = (index: number) => {
    setHoveredCard(index);
    const card = cardRefs.current[index];
    if (card) {
      cardRectsRef.current[index] = card.getBoundingClientRect();
    }
  };

  const handleCardMouseLeave = (index: number) => {
    setHoveredCard(null);
    delete cardRectsRef.current[index];
    const inner = cardInnerRefs.current[index];
    if (inner) {
      gsap.to(inner, {
        rotateX: 0,
        rotateY: 0,
        scale: 1.0,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  return (
    <section ref={sectionRef} id="work" className="relative py-20 md:py-28 min-h-screen z-20">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-10 md:mb-14 border-b border-white/10 pb-5 items-end relative">
          {/* Architectural Laser Line */}
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
              01 /// Selected Works
            </h2>
          </div>
          <div className="md:col-span-4 flex justify-end items-center">
            <span className="font-mono text-xs tracking-widest text-neutral-400">
              0{activeDeckIndex + 1} / 0{projects.length}
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3D SPATIAL STACKING DECK STAGE (Pinned Desktop / Flow Mobile)
            ───────────────────────────────────────────────────────────── */}
        <div 
          ref={deckWrapperRef} 
          className="relative w-full md:h-[88vh] flex items-center justify-center overflow-visible"
          style={{
            perspective: '1200px',
            perspectiveOrigin: 'center center',
          }}
        >
          <div className="relative w-full max-w-5xl h-full flex flex-col md:block items-center justify-center">
            {projects.map((project, index) => {
              const isActive = index === activeDeckIndex;
              return (
                <div
                  key={index}
                  ref={(el) => { if (el) cardRefs.current[index] = el; }}
                  data-index={index}
                  role="button"
                  tabIndex={0}
                  aria-label={`View case study: ${project.title} — ${project.category}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      const cardEl = cardInnerRefs.current[index] || undefined;
                      onProjectClick(project, cardEl);
                    }
                  }}
                  onClick={() => {
                    const cardEl = cardInnerRefs.current[index] || undefined;
                    onProjectClick(project, cardEl);
                  }}
                  onMouseEnter={() => handleCardMouseEnter(index)}
                  onMouseLeave={() => handleCardMouseLeave(index)}
                  onMouseMove={(e) => handleCardMouseMove(e, index)}
                  data-cursor-text="VIEW CASE"
                  className="w-full md:absolute md:inset-0 md:m-auto h-auto md:h-[72vh] max-h-[640px] mb-12 md:mb-0 cursor-pointer will-change-[transform,opacity] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-8 focus-visible:ring-offset-[#050507] rounded-none select-none group"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Outer Matte Obsidian Plate Frame */}
                  <div 
                    ref={(el) => { if (el) cardInnerRefs.current[index] = el; }}
                    className={`w-full h-full p-6 sm:p-8 md:p-10 rounded-none bg-[#09090f] border transition-[border-color,box-shadow] duration-500 flex flex-col justify-between relative overflow-hidden ${
                      isActive 
                        ? 'border-white/25 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_35px_rgba(255,59,48,0.12)]' 
                        : 'border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
                    }`}
                  >
                    {/* Reactive Specular Spotlight Sheen */}
                    <div 
                      className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-none z-20"
                      style={{
                        background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), transparent 60%)',
                      }}
                    />

                    {/* Top Card Bar */}
                    <div className="flex items-center justify-between z-10 border-b border-white/[0.08] pb-3 sm:pb-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#FF3B30]' : 'bg-white/30'}`}></span>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-300 font-medium">
                          0{index + 1} // {project.category}
                        </span>
                      </div>

                      {project.caseStudy?.year && (
                        <span className="font-mono text-xs text-neutral-400 tracking-wider">
                          {project.caseStudy.year}
                        </span>
                      )}
                    </div>

                    {/* Central Artwork Canvas Frame */}
                    <div className="relative flex-1 w-full my-4 md:my-5 flex items-center justify-center overflow-hidden rounded-none bg-[#050508] border border-white/[0.06] group/art">
                      {/* Subtle ambient lighting vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-10" />

                      {/* Project Image with drop shadow and hover scaling */}
                      {project.image ? (
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="max-w-[90%] max-h-[82%] object-contain relative z-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/art:scale-105 will-change-transform drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
                        />
                      ) : (
                        <div className="font-mono text-xs text-white/30 uppercase tracking-widest">
                          [ CASE STUDY ]
                        </div>
                      )}
                    </div>

                    {/* Bottom Content & Navigation Bar */}
                    <div className="flex justify-between items-end z-10 pt-4 border-t border-white/[0.08]">
                      <div>
                        <div className="overflow-hidden">
                          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-none will-change-transform transition-transform duration-500 ease-out group-hover:translate-x-1">
                            {project.title}
                          </h3>
                        </div>
                        <div className={`h-[2px] bg-[#FF3B30] mt-3 origin-left transition-all duration-500 ${isActive ? 'w-16 scale-x-100' : 'w-8 scale-x-75'}`} />
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-wider text-neutral-400 hidden sm:inline-block font-mono">
                          ( Explore Case )
                        </span>
                        <div className="w-10 h-10 rounded-none border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0 text-white">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform hover:rotate-45 transition-transform duration-300">
                            <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default React.memo(ProjectList);