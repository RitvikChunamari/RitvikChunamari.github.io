import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import MagneticWrapper from './MagneticWrapper';

interface HeroProps {
  isLoaded?: boolean;
  onNavigate?: (sectionId: string) => void;
}

interface DynamicCharProps {
  char: string;
  mousePos: { clientX: number; clientY: number };
  className?: string;
}

const DynamicChar: React.FC<DynamicCharProps> = React.memo(({ char, mousePos, className = '' }) => {
  const charRef = useRef<HTMLSpanElement>(null);
  const [elevation, setElevation] = useState({ y: 0, scale: 1, glow: 0 });

  useEffect(() => {
    const el = charRef.current;
    if (!el || char === ' ') return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = mousePos.clientX - centerX;
    const dy = mousePos.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const radius = 170;

    if (dist < radius && dist > 0) {
      const proximity = Math.pow(1 - dist / radius, 2);
      const liftY = -proximity * 12;
      const scaleVal = 1 + proximity * 0.08;
      const glowVal = proximity;
      setElevation({ y: liftY, scale: scaleVal, glow: glowVal });
    } else {
      if (elevation.y !== 0 || elevation.scale !== 1) {
        setElevation({ y: 0, scale: 1, glow: 0 });
      }
    }
  }, [mousePos, char]);

  if (char === ' ') {
    return <span className="inline-block">&nbsp;</span>;
  }

  return (
    <span
      ref={charRef}
      className={`inline-block will-change-transform transition-all duration-200 ease-out cursor-default select-none ${className}`}
      style={{
        transform: `translate3d(0, ${elevation.y}px, 0) scale(${elevation.scale})`,
        color: elevation.glow > 0.08 ? '#ffffff' : undefined,
        textShadow: elevation.glow > 0.08
          ? `0 0 24px rgba(255, 255, 255, ${elevation.glow * 0.65}), 0 0 48px rgba(255, 59, 48, ${elevation.glow * 0.35})`
          : 'none',
      }}
    >
      {char}
    </span>
  );
});

const Hero: React.FC<HeroProps> = ({ isLoaded = true, onNavigate }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rawMousePos, setRawMousePos] = useState({ clientX: -2000, clientY: -2000 });
  const [isHovered, setIsHovered] = useState(false);
  const [mobileFontSize, setMobileFontSize] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const chunamariSpanRef = useRef<HTMLSpanElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const redBarRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (!isLoaded) return;

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

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!heroRef.current) return;
      const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const y = (window as any).__virtualScrollY ?? (window.scrollY || window.pageYOffset);
      const scrollFade = Math.max(0, 1 - y * 0.0012);
      const scrollParallax = -y * 0.22;
      heroRef.current.style.opacity = `${scrollFade}`;
      heroRef.current.style.transform = `translate3d(0, ${scrollParallax.toFixed(2)}px, 0)`;
      heroRef.current.style.pointerEvents = scrollFade < 0.05 ? 'none' : 'auto';

      if (!isReduced) {
        const isMobile = window.innerWidth < 768;
        const drift = isMobile ? 0.08 : 0.16;
        if (line1Ref.current) {
          const x1 = (-y * drift) + (mousePosRef.current.x * 12);
          const y1 = mousePosRef.current.y * 8;
          line1Ref.current.style.transform = `translate3d(${x1.toFixed(2)}px, ${y1.toFixed(2)}px, 0)`;
        }
        if (line2Ref.current) {
          const x2 = (y * drift) + (mousePosRef.current.x * 22);
          const y2 = mousePosRef.current.y * 14;
          line2Ref.current.style.transform = `translate3d(${x2.toFixed(2)}px, ${y2.toFixed(2)}px, 0)`;
        }
        if (redBarRef.current) {
          const barScale = Math.min(2.5, 1 + y * 0.002);
          redBarRef.current.style.transform = `scaleX(${barScale.toFixed(2)})`;
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', onScroll);
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

  const touchFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetInteractiveState = () => {
    mousePosRef.current = { x: 0, y: 0 };
    setMousePos({ x: 0, y: 0 });
    setRawMousePos({ clientX: -2000, clientY: -2000 });
  };

  useEffect(() => {
    return () => {
      if (touchFadeRef.current) clearTimeout(touchFadeRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    mousePosRef.current = { x, y };
    setMousePos({ x, y });
    setRawMousePos({ clientX, clientY });
  };

  const handleMouseLeave = () => {
    resetInteractiveState();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      const { clientX, clientY } = t;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      mousePosRef.current = { x, y };
      setMousePos({ x, y });
      setRawMousePos({ clientX, clientY });

      if (touchFadeRef.current) clearTimeout(touchFadeRef.current);
      touchFadeRef.current = setTimeout(resetInteractiveState, 600);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      const { clientX, clientY } = t;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      mousePosRef.current = { x, y };
      setMousePos({ x, y });
      setRawMousePos({ clientX, clientY });

      if (touchFadeRef.current) clearTimeout(touchFadeRef.current);
      touchFadeRef.current = setTimeout(resetInteractiveState, 450);
    }
  };

  const handleTouchEnd = () => {
    if (touchFadeRef.current) clearTimeout(touchFadeRef.current);
    touchFadeRef.current = setTimeout(resetInteractiveState, 150);
  };

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

  const renderDynamicText = (text: string) => {
    return text.split('').map((char, i) => (
      <DynamicChar
        key={i}
        char={char}
        mousePos={rawMousePos}
        className="transition-colors duration-200"
      />
    ));
  };

  return (
    <section
      ref={heroRef}
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={resetInteractiveState}
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="my-auto py-4 md:py-6 relative z-10 will-change-transform w-full pointer-events-auto transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${-mousePos.y * 1.5}deg) rotateY(${mousePos.x * 1.5}deg)`,
        }}
      >
        {/* Monumental Display Name with Dual-Layer Differential Parallax */}
        <h1 
          className="text-[clamp(2.75rem,8.2vw,9.6rem)] md:text-[clamp(4.2rem,8.8vw,10.2rem)] font-extrabold uppercase tracking-[-0.045em] leading-[0.84] text-cinema-white select-none -ml-0.5 md:-ml-2 flex flex-col w-full"
          style={{
            fontSize: mobileFontSize || undefined,
            textShadow: isHovered 
              ? '2px 0 rgba(255, 59, 48, 0.4), -2px 0 rgba(0, 229, 255, 0.3)' 
              : 'none',
            transition: 'text-shadow 0.3s ease',
          }}
        >
          {/* Line 1: Ritvik with kinetic differential scroll dispersal */}
          <div 
            ref={line1Ref}
            className="block overflow-hidden will-change-transform w-full"
          >
            <span className="inline-block hero-title-line whitespace-nowrap">
              {renderDynamicText("Ritvik")}
            </span>
          </div>

          {/* Line 2: Chunamari with deeper kinetic differential scroll dispersal */}
          <div 
            ref={line2Ref}
            className="block overflow-hidden will-change-transform w-full"
          >
            <span ref={chunamariSpanRef} className="inline-block hero-title-line whitespace-nowrap">
              {renderDynamicText("Chunamari")}
            </span>
          </div>
        </h1>

        {/* Swiss Red Accent Bar with kinetic scroll expansion */}
        <div 
          ref={redBarRef}
          className="w-14 h-[2px] bg-[#FF3B30] my-5 md:my-6 hero-meta-reveal opacity-0 will-change-transform"
          style={{
            transformOrigin: 'left',
          }}
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
            className="group flex items-center gap-3 font-mono text-[10px] md:text-xs tracking-[0.22em] uppercase text-white/70 hover:text-white hover:tracking-[0.25em] transition-all duration-300 cursor-pointer"
            data-cursor-text="SCROLL"
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
        <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/40 mt-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
          <span>01 / SELECTED WORKS</span>
        </span>
      </div>

    </section>
  );
};

export default React.memo(Hero);
