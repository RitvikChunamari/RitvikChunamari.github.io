import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import MagneticWrapper from './MagneticWrapper';

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
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Pointer state tracked in refs to eliminate 100% of React component re-renders during mouse movements
  const mousePosRef = useRef({ clientX: -2000, clientY: -2000, normX: 0, normY: 0 });
  const animFrameRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);

  // Initial GSAP Entrance Choreography
  useLayoutEffect(() => {
    if (!isLoaded) return;

    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      gsap.set('.hero-grid-h', { scaleX: 1 });
      gsap.set('.hero-grid-v', { scaleY: 1 });
      gsap.set('.hero-title-line', { y: '0%', opacity: 1, filter: 'blur(0px)' });
      gsap.set('.hero-meta-reveal', { y: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      // 1. Hairline Grid scale in
      tl.to('.hero-grid-h', {
        scaleX: 1,
        duration: 1.1,
        ease: 'power3.out',
      }, 0.1)
      .to('.hero-grid-v', {
        scaleY: 1,
        duration: 1.1,
        ease: 'power3.out',
      }, 0.1);

      // 2. Monumental Typography Mask Reveal
      tl.fromTo('.hero-title-line',
        { y: '110%', filter: 'blur(8px)', opacity: 0 },
        { y: '0%', filter: 'blur(0px)', opacity: 1, stagger: 0.1, duration: 1.2, ease: 'power4.out' },
        0.3
      );

      // 3. Accent Line & Manifesto Reveal
      tl.fromTo('.hero-meta-reveal',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.9, ease: 'power2.out' },
        0.65
      );

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

    // Proximity letter elevation
    const radius = 160;
    charRefs.current.forEach((el) => {
      if (!el) return;
      if (!isHoveredRef.current || clientX < -1000) {
        el.style.transform = 'translate3d(0, 0, 0) scale(1)';
        el.style.color = '';
        el.style.textShadow = 'none';
        return;
      }

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
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

  // Kinetic Scroll Dispersal & Reverse Symmetrical Choreography
  useEffect(() => {
    let ticking = false;

    const handleScroll = (customY?: number) => {
      if (!heroRef.current) return;
      const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const y = customY ?? ((window as any).__virtualScrollY ?? (window.scrollY || window.pageYOffset));
      const scrollFade = Math.max(0, 1 - y * 0.0012);
      const scrollParallax = -y * 0.22;
      
      heroRef.current.style.opacity = `${scrollFade}`;
      heroRef.current.style.transform = `translate3d(0, ${scrollParallax.toFixed(2)}px, 0)`;
      heroRef.current.style.pointerEvents = scrollFade < 0.05 ? 'none' : 'auto';

      if (!isReduced) {
        const isMobile = window.innerWidth < 768;
        const drift = isMobile ? 0.03 : 0.12;
        const maxDrift = isMobile ? 12 : 46;
        
        if (line1Ref.current) {
          const x1 = Math.max(-maxDrift, -y * drift);
          line1Ref.current.style.transform = `translate3d(${x1.toFixed(2)}px, 0, 0)`;
        }
        if (line2Ref.current) {
          const x2 = Math.min(maxDrift, y * drift);
          line2Ref.current.style.transform = `translate3d(${x2.toFixed(2)}px, 0, 0)`;
        }
        if (redBarRef.current) {
          const barScale = Math.min(2.2, 1 + y * 0.002);
          redBarRef.current.style.transform = `scaleX(${barScale.toFixed(2)})`;
        }
      } else {
        if (line1Ref.current) line1Ref.current.style.transform = 'translate3d(0, 0, 0)';
        if (line2Ref.current) line2Ref.current.style.transform = 'translate3d(0, 0, 0)';
        if (redBarRef.current) redBarRef.current.style.transform = 'scaleX(1)';
      }
    };

    const onNativeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    const lenis = (window as any).__lenis;
    const onLenisScroll = (e: any) => {
      handleScroll(e?.scroll ?? lenis?.scroll);
    };

    if (lenis) {
      lenis.on('scroll', onLenisScroll);
    }
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    handleScroll();

    return () => {
      if (lenis) {
        lenis.off('scroll', onLenisScroll);
      }
      window.removeEventListener('scroll', onNativeScroll);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Dynamically calculate the maximum font size on mobile so Chunamari fills 98% of the margin
  useEffect(() => {
    const adjustFontSize = () => {
      if (window.innerWidth >= 768) {
        setMobileFontSize(null);
        return;
      }
      if (!chunamariSpanRef.current || !titleContainerRef.current) return;

      const containerWidth = titleContainerRef.current.clientWidth;
      const textWidth = chunamariSpanRef.current.offsetWidth;
      const currentSize = parseFloat(window.getComputedStyle(chunamariSpanRef.current).fontSize);

      if (textWidth > 0 && containerWidth > 0 && currentSize > 0) {
        // Target: fill 98% of the allotted margin (edge to edge with 1% micro-cushion)
        const idealSize = (containerWidth * 0.98) / (textWidth / currentSize);
        setMobileFontSize(`${idealSize.toFixed(2)}px`);
      }
    };

    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
    return () => window.removeEventListener('resize', adjustFontSize);
  }, [isLoaded]);

  const scrollToWork = () => {
    if (onNavigate) {
      onNavigate('work');
      return;
    }
    const workSection = document.getElementById('work');
    if (workSection) {
      const top = workSection.offsetTop || (workSection.getBoundingClientRect().top + window.scrollY);
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen w-full relative flex flex-col justify-between pt-24 pb-8 md:pt-32 md:pb-12 px-6 md:px-16 text-[#ededed] select-none will-change-[transform,opacity]"
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

        {/* Architectural Crosshairs (+) */}
        <div className="absolute top-24 md:top-28 left-6 md:left-16 -translate-x-1/2 -translate-y-1/2 text-white/25 font-mono text-xs">+</div>
        <div className="absolute top-24 md:top-28 right-6 md:right-16 translate-x-1/2 -translate-y-1/2 text-white/25 font-mono text-xs">+</div>
        <div className="absolute bottom-16 md:bottom-20 left-6 md:left-16 -translate-x-1/2 translate-y-1/2 text-white/25 font-mono text-xs">+</div>
        <div className="absolute bottom-16 md:bottom-20 right-6 md:right-16 translate-x-1/2 translate-y-1/2 text-white/25 font-mono text-xs">+</div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. TOP EDITORIAL TELEMETRY BAR
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full flex items-center justify-between pointer-events-none hero-meta-reveal opacity-0">
        {/* Left: Designer Folio Identity */}
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
          <span className="font-mono text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.25em] text-white/70 uppercase font-medium">
            RITVIK CHUNAMARI <span className="text-white/20">///</span> FOLIO 2026
          </span>
        </div>

        {/* Right: Location & Affiliation */}
        <div className="flex items-center text-right gap-3">
          <span className="font-mono text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.25em] text-white/50 uppercase font-medium">
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
          if (!animFrameRef.current) animFrameRef.current = requestAnimationFrame(updatePointer);
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          if (!animFrameRef.current) animFrameRef.current = requestAnimationFrame(updatePointer);
        }}
        className="my-auto py-4 md:py-6 relative z-10 will-change-transform w-full pointer-events-auto transition-transform duration-300 ease-out"
      >
        {/* Monumental Display Name with Dual-Layer Differential Parallax */}
        <h1 
          className="text-[clamp(2.75rem,8.2vw,9.6rem)] md:text-[clamp(4.2rem,8.8vw,10.2rem)] font-extrabold uppercase tracking-[-0.045em] leading-[0.84] text-cinema-white select-none -ml-0.5 md:-ml-2 flex flex-col w-full"
          style={{
            fontSize: mobileFontSize || undefined,
          }}
        >
          {/* Line 1: Ritvik with kinetic differential scroll dispersal */}
          <div 
            ref={line1Ref}
            className="block overflow-hidden will-change-transform w-full"
          >
            <span className="inline-block hero-title-line whitespace-nowrap">
              {RITVIK_CHARS.map((char, idx) => (
                <span
                  key={idx}
                  ref={(el) => { charRefs.current[idx] = el; }}
                  className="inline-block hero-char will-change-transform cursor-default select-none transition-[color,text-shadow,transform] duration-200 ease-out"
                >
                  {char}
                </span>
              ))}
            </span>
          </div>

          {/* Line 2: Chunamari with deeper kinetic differential scroll dispersal */}
          <div 
            ref={line2Ref}
            className="block overflow-hidden will-change-transform w-full"
          >
            <span ref={chunamariSpanRef} className="inline-block hero-title-line whitespace-nowrap">
              {CHUNAMARI_CHARS.map((char, idx) => (
                <span
                  key={idx + 6}
                  ref={(el) => { charRefs.current[idx + 6] = el; }}
                  className="inline-block hero-char will-change-transform cursor-default select-none transition-[color,text-shadow,transform] duration-200 ease-out"
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

        {/* Manifesto Subtitle */}
        <div className="max-w-2xl hero-meta-reveal opacity-0">
          <p className="text-base sm:text-lg md:text-xl font-light text-neutral-300 leading-relaxed tracking-tight">
            <span className="text-white font-medium">Creative Designer</span> and{' '}
            <span className="text-white font-medium">Vibe Coder</span> crafting sensory digital interfaces at the intersection of computational logic and human intuition.
          </p>
          {/* Disciplines Index (Swiss Typographic Hierarchy — Zero AI Slop Boxes) */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-white/60">
            <span className="text-[#FF3B30] font-bold">// DISCIPLINES:</span>
            <span className="hover:text-white transition-colors"><strong className="text-white font-mono mr-1">01</strong> INTERACTION ARCHITECTURE</span>
            <span className="text-white/20">/</span>
            <span className="hover:text-white transition-colors"><strong className="text-white font-mono mr-1">02</strong> CREATIVE COMPUTING</span>
            <span className="text-white/20">/</span>
            <span className="hover:text-white transition-colors"><strong className="text-white font-mono mr-1">03</strong> RADICAL ACCESSIBILITY</span>
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
      <div className="relative z-10 w-full flex flex-col items-center justify-center pt-8 pb-2 pointer-events-none hero-meta-reveal opacity-0">
        <div className="w-px h-12 bg-gradient-to-b from-[#FF3B30] via-white/20 to-transparent" />
      </div>

    </section>
  );
};

export default React.memo(Hero);
