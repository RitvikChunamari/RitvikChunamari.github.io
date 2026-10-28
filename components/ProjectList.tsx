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
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const cardEdgeRefs = useRef<(HTMLDivElement | null)[]>([]);

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

      // DESKTOP: 3D Multi-Plane Parallax Stacking Deck (Lenis-synchronized, pinned stage)
      mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
        const totalCards = projects.length;
        if (!deckWrapperRef.current || totalCards === 0) return;

        // Set Initial Stacking Context & Multi-Plane Parallax Starting States
        cardRefs.current.forEach((card, idx) => {
          if (!card) return;
          const imgWrapper = imageRefs.current[idx];
          const title = titleRefs.current[idx];
          const edge = cardEdgeRefs.current[idx];

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
            if (imgWrapper) {
              gsap.set(imgWrapper, { yPercent: 0, scale: 1.0, filter: 'brightness(1)' });
            }
            if (title) {
              gsap.set(title, { y: 0, opacity: 1 });
            }
            if (edge) {
              gsap.set(edge, { scaleX: 1, opacity: 1 });
            }
          } else {
            // Incoming cards start with spatial depth, perspective pitch, and internal counter-offset
            gsap.set(card, {
              y: window.innerHeight * 1.15,
              z: -80,
              rotateX: -4.5,
              scale: 0.94,
              opacity: 0.85,
              zIndex: 10 + idx * 10,
              pointerEvents: 'none',
            });
            if (imgWrapper) {
              gsap.set(imgWrapper, { yPercent: -22, scale: 1.16, filter: 'brightness(0.95)' });
            }
            if (title) {
              gsap.set(title, { y: 36, opacity: 0.35 });
            }
            if (edge) {
              gsap.set(edge, { scaleX: 0, opacity: 0 });
            }
          }
        });

        // Continuous Master Parallax Timeline (60/120fps hardware accelerated)
        const deckTl = gsap.timeline({
          scrollTrigger: {
            trigger: deckWrapperRef.current,
            start: 'top top',
            end: `+=${(totalCards - 1) * 85}%`,
            pin: true,
            scrub: 0.45,
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

        // Build sequential multi-plane parallax stacking choreographies
        for (let i = 0; i < totalCards - 1; i++) {
          const outgoingCard = cardRefs.current[i];
          const outgoingImg = imageRefs.current[i];
          const outgoingEdge = cardEdgeRefs.current[i];

          const incomingCard = cardRefs.current[i + 1];
          const incomingImg = imageRefs.current[i + 1];
          const incomingTitle = titleRefs.current[i + 1];
          const incomingEdge = cardEdgeRefs.current[i + 1];

          const segmentStart = i;

          if (outgoingCard) {
            // Outgoing card lifts back into depth with stepped tab offset (-50px)
            deckTl.to(outgoingCard, {
              z: -140,
              y: -50,
              rotateX: 4.2,
              scale: 0.93,
              opacity: 0.58,
              ease: 'power1.inOut',
              duration: 1,
            }, segmentStart);

            // Outgoing artwork sinks with subtle depth parallax and dimming
            if (outgoingImg) {
              deckTl.to(outgoingImg, {
                yPercent: 14,
                scale: 0.93,
                filter: 'brightness(0.65)',
                ease: 'power1.inOut',
                duration: 1,
              }, segmentStart);
            }

            if (outgoingEdge) {
              deckTl.to(outgoingEdge, {
                scaleX: 0,
                opacity: 0,
                duration: 0.4,
                ease: 'power1.in',
              }, segmentStart);
            }

            // Previous cards in the stack step further back into deep perspective
            for (let k = 0; k < i; k++) {
              const previousCard = cardRefs.current[k];
              if (previousCard) {
                const step = i - k + 1;
                const tabOffset = -50 - (step - 1) * 28;
                const depthOffset = -140 - (step - 1) * 85;
                deckTl.to(previousCard, {
                  z: depthOffset,
                  y: tabOffset,
                  rotateX: 4.2 + (step - 1) * 1.2,
                  scale: Math.max(0.78, 0.93 - (step - 1) * 0.035),
                  opacity: Math.max(0.18, 0.58 - (step - 1) * 0.14),
                  ease: 'power1.inOut',
                  duration: 1,
                }, segmentStart);
              }
            }
          }

          if (incomingCard) {
            // Incoming card glides up in 3D perspective to focal plane
            deckTl.to(incomingCard, {
              y: 0,
              z: 0,
              rotateX: 0,
              scale: 1,
              opacity: 1,
              ease: 'power1.out',
              duration: 1,
            }, segmentStart);

            // Incoming artwork counter-parallax down into centered position
            if (incomingImg) {
              deckTl.to(incomingImg, {
                yPercent: 0,
                scale: 1.0,
                filter: 'brightness(1)',
                ease: 'power1.out',
                duration: 1,
              }, segmentStart);
            }

            // Staggered title float reveal with slight trailing lag
            if (incomingTitle) {
              deckTl.to(incomingTitle, {
                y: 0,
                opacity: 1,
                ease: 'power2.out',
                duration: 0.75,
              }, segmentStart + 0.18);
            }

            // Specular laser edge sweep as card locks in
            if (incomingEdge) {
              deckTl.to(incomingEdge, {
                scaleX: 1,
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
              }, segmentStart + 0.45);
            }
          }
        }
      });

      // MOBILE: Tactile Unpinned Vertical Stream with Scroll-Scrubbed Parallax
      mm.add("(max-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        cardRefs.current.forEach((card, idx) => {
          if (!card) return;
          const imgWrapper = imageRefs.current[idx];
          const title = titleRefs.current[idx];

          gsap.set(card, {
            y: 0,
            z: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            pointerEvents: 'auto',
          });

          // Card focal entrance scaling & opacity
          gsap.fromTo(card,
            { scale: 0.94, opacity: 0.7 },
            {
              scale: 1,
              opacity: 1,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                end: 'top 35%',
                scrub: 0.5,
              }
            }
          );

          // Continuous vertical image parallax inside mobile card
          if (imgWrapper) {
            gsap.fromTo(imgWrapper,
              { yPercent: -14, scale: 1.08 },
              {
                yPercent: 14,
                scale: 1.0,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                }
              }
            );
          }

          // Subtle title parallax float
          if (title) {
            gsap.fromTo(title,
              { y: 18, opacity: 0.7 },
              {
                y: 0,
                opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 85%',
                  end: 'top 50%',
                  scrub: 0.4,
                }
              }
            );
          }
        });
      });

      // REDUCED MOTION: Static Clean Accessibility Fallback
      mm.add("(prefers-reduced-motion: reduce)", () => {
        cardRefs.current.forEach((card, idx) => {
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
          const imgWrapper = imageRefs.current[idx];
          if (imgWrapper) {
            gsap.set(imgWrapper, { yPercent: 0, scale: 1, filter: 'none' });
          }
          const title = titleRefs.current[idx];
          if (title) {
            gsap.set(title, { y: 0, opacity: 1 });
          }
          const edge = cardEdgeRefs.current[idx];
          if (edge) {
            gsap.set(edge, { scaleX: 1, opacity: 1 });
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  // Reactive Cursor Spotlight & Damped 3D Dual-Plane Elastic Tilt Parallax
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
    const rotateY = ((x / rect.width) - 0.5) * 5;
    const rotateX = (0.5 - (y / rect.height)) * 5;
    const inner = cardInnerRefs.current[index];
    if (inner) {
      gsap.to(inner, {
        rotateX,
        rotateY,
        scale: 1.008,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    // Dual-layer counter parallax on the artwork inside the card
    const imgWrapper = imageRefs.current[index];
    if (imgWrapper) {
      gsap.to(imgWrapper, {
        x: -rotateY * 3.5,
        y: -rotateX * 3.5,
        duration: 0.45,
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
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    const imgWrapper = imageRefs.current[index];
    if (imgWrapper) {
      gsap.to(imgWrapper, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  return (
    <section ref={sectionRef} id="work" className="relative py-20 md:py-28 min-h-screen z-20">
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        
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
          className="relative w-full md:h-[92vh] flex items-center justify-center overflow-visible"
          style={{
            perspective: '1400px',
            perspectiveOrigin: 'center center',
          }}
        >
          <div className="relative w-full max-w-6xl xl:max-w-7xl h-full flex flex-col md:block items-center justify-center">
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
                  className="w-full md:absolute md:inset-0 md:m-auto h-auto md:h-[80vh] max-h-[760px] min-h-[540px] mb-12 md:mb-0 cursor-pointer will-change-[transform,opacity] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-8 focus-visible:ring-offset-[#050507] rounded-none select-none group"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Outer Matte Obsidian Plate Frame */}
                  <div 
                    ref={(el) => { if (el) cardInnerRefs.current[index] = el; }}
                    className={`w-full h-full p-6 sm:p-8 md:p-10 lg:p-12 rounded-none bg-[#09090f] border transition-[border-color,box-shadow] duration-500 flex flex-col justify-between relative overflow-hidden ${
                      isActive 
                        ? 'border-white/25 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_35px_rgba(255,59,48,0.12)]' 
                        : 'border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)]'
                    }`}
                  >
                    {/* Specular Edge Laser Accent Sweep */}
                    <div 
                      ref={(el) => { if (el) cardEdgeRefs.current[index] = el; }}
                      className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#FF3B30] to-transparent origin-center scale-x-0 will-change-transform pointer-events-none z-30" 
                    />

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
                    <div className="relative flex-1 w-full my-4 md:my-6 flex items-center justify-center overflow-hidden rounded-none bg-[#050508] border border-white/[0.06] group/art">
                      {/* Subtle ambient lighting vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-10" />

                      {/* Project Image with drop shadow and hover scaling */}
                      {project.image ? (
                        <div 
                          ref={(el) => { if (el) imageRefs.current[index] = el; }}
                          className="w-full h-full flex items-center justify-center will-change-transform"
                        >
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="max-w-[92%] max-h-[86%] object-contain relative z-10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/art:scale-105 will-change-transform drop-shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
                          />
                        </div>
                      ) : (
                        <div className="font-mono text-xs text-white/30 uppercase tracking-widest">
                          [ CASE STUDY ]
                        </div>
                      )}
                    </div>

                    {/* Bottom Content & Navigation Bar */}
                    <div className="flex justify-between items-end z-10 pt-4 md:pt-5 border-t border-white/[0.08]">
                      <div>
                        <div className="overflow-hidden">
                          <h3 
                            ref={(el) => { if (el) titleRefs.current[index] = el; }}
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold uppercase tracking-tight text-white leading-none will-change-transform transition-transform duration-500 ease-out group-hover:translate-x-1"
                          >
                            {project.title}
                          </h3>
                        </div>
                        <div className={`h-[2px] bg-[#FF3B30] mt-3 origin-left transition-all duration-500 ${isActive ? 'w-16 scale-x-100' : 'w-8 scale-x-75'}`} />
                      </div>

                      <div className="flex items-center gap-3.5">
                        <span className="text-xs sm:text-sm uppercase tracking-wider text-neutral-400 hidden sm:inline-block font-mono">
                          ( Explore Case )
                        </span>
                        <div className="w-11 h-11 rounded-none border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0 text-white">
                          <svg width="13" height="13" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform hover:rotate-45 transition-transform duration-300">
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