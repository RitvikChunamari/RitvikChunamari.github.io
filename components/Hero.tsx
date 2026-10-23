import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticWrapper from './MagneticWrapper';
import { scrambleText } from '../utils/scrambleText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroProps {
  isLoaded?: boolean;
  onNavigate?: (sectionId: string) => void;
}

const RITVIK_CHARS = ['R', 'i', 't', 'v', 'i', 'k'];
const CHUNAMARI_CHARS = ['C', 'h', 'u', 'n', 'a', 'm', 'a', 'r', 'i'];

const Hero: React.FC<HeroProps> = ({ isLoaded = true, onNavigate }) => {
  const [mobileFontSize, setMobileFontSize] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const chunamariSpanRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const redBarRef = useRef<HTMLDivElement>(null);
  const affiliationRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Pointer state tracked in refs to eliminate 100% of React component re-renders during mouse movements
  const mousePosRef = useRef({ clientX: -2000, clientY: -2000, normX: 0, normY: 0 });
  const animFrameRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const charCentersRef = useRef<{ x: number; y: number }[]>([]);

  // Cache character positions to eliminate 15 getBoundingClientRect reflows per mouse frame
  const measureCharCenters = () => {
    charCentersRef.current = charRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    });
  };

  useEffect(() => {
    window.addEventListener('resize', measureCharCenters, { passive: true });
    return () => window.removeEventListener('resize', measureCharCenters);
  }, []);

  // Initial GSAP Entrance Choreography & Lenis-Synchronized Typographic Scrub
  useLayoutEffect(() => {
    if (!isLoaded || !heroRef.current) return;

    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      gsap.set('.hero-grid-h', { scaleX: 1 });
      gsap.set('.hero-grid-v', { scaleY: 1 });
      gsap.set('.hero-title-line', { y: '0%', opacity: 1, filter: 'blur(0px)' });
      gsap.set('.hero-meta-reveal', { y: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Initial Hero Entrance Sequence (noth.in Parisian luxury curve)
      const entranceTl = gsap.timeline({ 
        delay: 0.12,
        onComplete: () => {
          if (affiliationRef.current) {
            scrambleText(affiliationRef.current, 'ATLAS INSTITUTE · CU BOULDER', { duration: 650 });
          }
        }
      });

      // Hairline Grid scale in
      entranceTl.to('.hero-grid-h', {
        scaleX: 1,
        duration: 1.1,
        ease: 'power3.out',
      }, 0.1)
      .to('.hero-grid-v', {
        scaleY: 1,
        duration: 1.1,
        ease: 'power3.out',
      }, 0.1);

      // Monumental Typography Mask Reveal
      entranceTl.fromTo('.hero-title-line',
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.1, duration: 1.2, ease: 'power3.out' },
        0.25
      );

      // Masked Manifesto Reveal
      entranceTl.fromTo('.hero-manifesto-line',
        { yPercent: 105, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.9, ease: 'power3.out' },
        0.55
      );

      // Accent Line & Telemetry Reveal
      entranceTl.fromTo('.hero-meta-reveal',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.85, ease: 'power2.out' },
        0.75
      );

      // 2. Continuous Awwwards Typographic Scrub Timeline (Lenis-synchronized, unpinned)
      const mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
        isMobile: "(max-width: 768px) and (prefers-reduced-motion: no-preference)",
        isReduced: "(prefers-reduced-motion: reduce)",
      }, (context) => {
        const { isDesktop, isMobile, isReduced } = context.conditions as { 
          isDesktop: boolean; 
          isMobile: boolean; 
          isReduced: boolean; 
        };

        if (isReduced) {
          if (line1Ref.current) gsap.set(line1Ref.current, { xPercent: 0, yPercent: 0, opacity: 1 });
          if (line2Ref.current) gsap.set(line2Ref.current, { xPercent: 0, yPercent: 0, opacity: 1 });
          if (redBarRef.current) gsap.set(redBarRef.current, { scaleX: 1, transformOrigin: 'left center' });
          gsap.set('.hero-meta-reveal', { opacity: 1, y: 0 });
          return;
        }

        const scrubTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          }
        });

        if (isDesktop) {
          // 1. Elegant fade for secondary subtitles & telemetry (fades cleanly without shifting vertically into typography)
          scrubTl.to('.hero-meta-reveal', {
            opacity: 0,
            duration: 0.35,
            ease: 'power2.out',
          }, 0)
          // 2. Symmetrical horizontal typographic drift (pure horizontal motion; zero downward collision with subtitle)
          .to(line1Ref.current, {
            xPercent: -8,
            opacity: 0.2,
            ease: 'power1.inOut',
          }, 0)
          .to(line2Ref.current, {
            xPercent: 8,
            opacity: 0.2,
            ease: 'power1.inOut',
          }, 0)
          // 3. Swiss Red Accent Line Drafting Expansion
          .to(redBarRef.current, {
            scaleX: 2.2,
            transformOrigin: 'left center',
            ease: 'power2.out',
          }, 0)
          // 4. Hairline Grid Boundary Softening
          .to('.hero-grid-h, .hero-grid-v', {
            opacity: 0.20,
            ease: 'power1.out',
          }, 0);
        } else if (isMobile) {
          // Subtle Mobile Drift (0 horizontal overflow, 0 vertical collision)
          scrubTl.to(line1Ref.current, {
            xPercent: -4,
            opacity: 0.25,
            ease: 'power1.inOut',
          }, 0)
          .to(line2Ref.current, {
            xPercent: 4,
            opacity: 0.25,
            ease: 'power1.inOut',
          }, 0)
          .to(redBarRef.current, {
            scaleX: 1.8,
            transformOrigin: 'left center',
            ease: 'power2.out',
          }, 0)
          .to('.hero-meta-reveal', {
            opacity: 0,
            duration: 0.35,
            ease: 'power1.in',
          }, 0);
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, [isLoaded]);

  // Direct GPU Pointer Updates (Zero React re-renders)
  const updatePointer = () => {
    animFrameRef.current = null;
    const isCoarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarse || isReduced) return;

    const { clientX, clientY, normX, normY } = mousePosRef.current;

    // Perspective 3D tilt on title container
    if (titleContainerRef.current) {
      if (isHoveredRef.current && clientX > -1000) {
        titleContainerRef.current.style.transform = `perspective(1000px) rotateX(${(-normY * 1.5).toFixed(2)}deg) rotateY(${(normX * 1.5).toFixed(2)}deg)`;
      } else {
        titleContainerRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      }
    }

    // Proximity letter elevation using pre-cached character centers (0 reflows)
    const radius = 160;
    const centers = charCentersRef.current;
    charRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (!isHoveredRef.current || clientX < -1000) {
        el.style.transform = 'translate3d(0, 0, 0) scale(1)';
        el.style.color = '';
        el.style.textShadow = 'none';
        return;
      }

      const center = centers[idx];
      if (!center || (center.x === 0 && center.y === 0)) return;

      const dx = clientX - center.x;
      const dy = clientY - center.y;
      const dist = Math.hypot(dx, dy);

      if (dist < radius && dist > 0) {
        const proximity = Math.pow(1 - dist / radius, 2);
        const liftY = -proximity * 12;
        const scaleVal = 1 + proximity * 0.08;
        el.style.transform = `translate3d(0, ${liftY.toFixed(2)}px, 0) scale(${scaleVal.toFixed(3)})`;
        if (proximity > 0.08) {
          el.style.color = '#ffffff';
          el.style.textShadow = `0 0 24px rgba(255, 255, 255, ${(proximity * 0.65).toFixed(2)}), 0 0 48px rgba(255, 59, 48, ${(proximity * 0.35).toFixed(2)})`;
        } else {
          el.style.color = '';
          el.style.textShadow = 'none';
        }
      } else {
        el.style.transform = 'translate3d(0, 0, 0) scale(1)';
        el.style.color = '';
        el.style.textShadow = 'none';
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const isCoarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const normX = (clientX / innerWidth - 0.5) * 2;
    const normY = (clientY / innerHeight - 0.5) * 2;
    mousePosRef.current = { clientX, clientY, normX, normY };

    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(updatePointer);
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    mousePosRef.current = { clientX: -2000, clientY: -2000, normX: 0, normY: 0 };
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(updatePointer);
    }
  };

  const scrollToWork = () => {
    if (onNavigate) {
      onNavigate('work');
      return;
    }
    const lenis = (window as any).__lenis;
    const workSection = document.getElementById('work');
    if (workSection) {
      if (lenis) {
        lenis.scrollTo(workSection, { offset: -30, duration: 1.2 });
      } else {
        const top = workSection.offsetTop || (workSection.getBoundingClientRect().top + window.scrollY);
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen w-full relative flex flex-col justify-between pt-24 pb-12 md:pt-28 md:pb-16 px-6 md:px-16 text-[#ededed] select-none will-change-[transform,opacity]"
    >
      {/* ─────────────────────────────────────────────────────────────
          2. SWISS ARCHITECTURAL HAIRLINE FRAMING
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Horizontal Hairlines */}
        <div className="hero-grid-h absolute top-24 md:top-28 left-6 right-6 md:left-16 md:right-16 h-px bg-white/[0.07] origin-left scale-x-0" />
        <div className="hero-grid-h absolute bottom-16 md:bottom-20 left-6 right-6 md:left-16 md:right-16 h-px bg-white/[0.07] origin-left scale-x-0" />

        {/* Vertical Hairlines */}
        <div className="hero-grid-v absolute top-0 bottom-0 left-6 md:left-16 w-px bg-white/[0.07] origin-top scale-y-0" />
        <div className="hero-grid-v absolute top-0 bottom-0 right-6 md:right-16 w-px bg-white/[0.07] origin-top scale-y-0" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TOP EDITORIAL BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full flex items-center justify-between pointer-events-none hero-meta-reveal opacity-0">
        {/* Left: Designer Identity */}
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]"></span>
          <span className="font-mono text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.25em] text-white/80 uppercase font-medium">
            RITVIK CHUNAMARI
          </span>
        </div>

        {/* Right: Location & Affiliation */}
        <div className="flex items-center text-right gap-3">
          <span 
            ref={affiliationRef}
            className="font-mono text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.25em] text-white/50 uppercase font-medium"
          >
            ATLAS INSTITUTE · CU BOULDER
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. MONUMENTAL HERO CENTERPIECE (Dynamic Typography & Parallax)
          ───────────────────────────────────────────────────────────── */}
      <div 
        ref={titleContainerRef}
        onMouseEnter={() => {
          isHoveredRef.current = true;
          measureCharCenters();
          if (!animFrameRef.current) animFrameRef.current = requestAnimationFrame(updatePointer);
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          if (!animFrameRef.current) animFrameRef.current = requestAnimationFrame(updatePointer);
        }}
        className="my-auto py-2 md:py-4 relative z-10 will-change-transform w-full pointer-events-auto transition-transform duration-300 ease-out flex flex-col items-start text-left"
      >
        {/* Monumental Display Name with Dual-Layer Differential Parallax */}
        <h1 
          className="text-[clamp(2.75rem,8.2vw,9.6rem)] md:text-[clamp(4.2rem,8.8vw,10.2rem)] font-extrabold uppercase tracking-[-0.045em] leading-[0.84] text-cinema-white select-none -ml-0.5 md:-ml-2 flex flex-col w-full text-left"
          style={{
            fontSize: mobileFontSize || undefined,
          }}
        >
          {/* Line 1: Ritvik with kinetic differential scroll dispersal */}
          <div 
            ref={line1Ref}
            className="block overflow-hidden will-change-transform w-full text-left"
          >
            <span className="inline-block hero-title-line whitespace-nowrap text-left will-change-transform">
              {RITVIK_CHARS.map((char, idx) => (
                <span
                  key={idx}
                  ref={(el) => { charRefs.current[idx] = el; }}
                  className="inline-block hero-char will-change-transform cursor-default select-none transition-[color,text-shadow] duration-200 ease-out"
                >
                  {char}
                </span>
              ))}
            </span>
          </div>

          {/* Line 2: Chunamari with deeper kinetic differential scroll dispersal */}
          <div 
            ref={line2Ref}
            className="block overflow-hidden will-change-transform w-full text-left"
          >
            <span ref={chunamariSpanRef} className="inline-block hero-title-line whitespace-nowrap text-left will-change-transform">
              {CHUNAMARI_CHARS.map((char, idx) => (
                <span
                  key={idx + 6}
                  ref={(el) => { charRefs.current[idx + 6] = el; }}
                  className="inline-block hero-char will-change-transform cursor-default select-none transition-[color,text-shadow] duration-200 ease-out"
                >
                  {char}
                </span>
              ))}
            </span>
          </div>
        </h1>

        {/* Swiss Red Accent Bar with kinetic scroll expansion */}
        <div 
          ref={redBarRef}
          className="w-14 h-[2px] bg-[#FF3B30] my-5 md:my-6 hero-meta-reveal opacity-0 will-change-transform origin-left"
        />

        {/* Subtitle / Manifesto with Masked Reveal */}
        <div className="max-w-2xl text-left overflow-hidden">
          <div className="overflow-hidden">
            <p className="hero-manifesto-line text-base sm:text-lg md:text-xl font-light text-neutral-300 leading-snug tracking-tight text-left will-change-transform">
              <span className="text-white font-medium">Product Designer</span> and{' '}
              <span className="text-white font-medium">Creative Developer</span> crafting accessible
            </p>
          </div>
          <div className="overflow-hidden mt-1">
            <p className="hero-manifesto-line text-base sm:text-lg md:text-xl font-light text-neutral-300 leading-snug tracking-tight text-left will-change-transform">
              digital interfaces and computational systems.
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. BOTTOM EDITORIAL BAR & SCROLL TRIGGER
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t border-white/[0.08] pt-6 pointer-events-auto hero-meta-reveal opacity-0">
        {/* Education / Domain Focus */}
        <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.2em] text-white/45 uppercase">
          <span>M.S. Creative Technology &amp; Design</span>
          <span className="text-white/20">●</span>
          <span>CU Boulder</span>
        </div>

        {/* Magnetic Scroll to Explore Button */}
        <MagneticWrapper strength={0.25}>
          <button
            onClick={scrollToWork}
            className="group flex items-center gap-3 font-mono text-[10px] md:text-xs tracking-[0.22em] uppercase text-white/70 hover:text-white hover:tracking-[0.25em] transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050507] rounded-sm py-2 px-3 min-h-[44px] active:scale-95"
            data-cursor-text="SCROLL"
            aria-label="Scroll to Explore Selected Works"
          >
            <span>Scroll to Explore</span>
            <span className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white group-hover:scale-110 transition-all duration-300">
              <span className="w-1 h-1 bg-white rounded-full group-hover:bg-[#FF3B30] transition-colors"></span>
            </span>
          </button>
        </MagneticWrapper>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          6. EDITORIAL CONTINUITY BRIDGE (HERO -> SELECTED WORKS)
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-none hero-meta-reveal opacity-0 z-10">
        <div className="w-px h-10 bg-gradient-to-b from-[#FF3B30] via-white/20 to-transparent" />
      </div>

    </section>
  );
};

export default React.memo(Hero);