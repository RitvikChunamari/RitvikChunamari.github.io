import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import MagneticWrapper from './MagneticWrapper';

interface HeroProps {
  isLoaded?: boolean;
}

interface DynamicCharProps {
  char: string;
  mousePos: { clientX: number; clientY: number };
  className?: string;
}

const DynamicChar: React.FC<DynamicCharProps> = ({ char, mousePos, className = '' }) => {
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
};

const Hero: React.FC<HeroProps> = ({ isLoaded = true }) => {
  const [offset, setOffset] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rawMousePos, setRawMousePos] = useState({ clientX: -2000, clientY: -2000 });
  const [isHovered, setIsHovered] = useState(false);
  const [mobileFontSize, setMobileFontSize] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const chunamariSpanRef = useRef<HTMLSpanElement>(null);

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
    const handleScroll = () => {
      requestAnimationFrame(() => {
        setOffset(window.pageYOffset);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    setMousePos({ x, y });
    setRawMousePos({ clientX, clientY });
  };

  const scrollToWork = () => {
    const workSection = document.getElementById('work');
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' });
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

  const scrollFade = Math.max(0, 1 - offset * 0.0012);
  const scrollParallax = -offset * 0.22;

  return (
    <section
      ref={heroRef}
      id="home"
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full relative flex flex-col justify-between pt-24 pb-8 md:pt-32 md:pb-12 px-6 md:px-16 text-[#ededed] select-none"
      style={{
        opacity: scrollFade,
        transform: `translate3d(0, ${scrollParallax}px, 0)`,
        pointerEvents: scrollFade < 0.05 ? 'none' : 'auto',
      }}
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
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]"></span>
          <span className="font-mono text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.25em] text-white/50 uppercase font-medium">
            RITVIK CHUNAMARI <span className="text-white/20">///</span> FOLIO 2026
          </span>
        </div>

        {/* Right: Location */}
        <div className="flex items-center text-right">
          <span className="font-mono text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.25em] text-white/40 uppercase font-medium">
            ARVADA, CO
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
        className="my-auto py-8 md:py-12 relative z-10 will-change-transform w-full pointer-events-auto transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${-mousePos.y * 1.5}deg) rotateY(${mousePos.x * 1.5}deg)`,
        }}
      >
        {/* Monumental Display Name with Dual-Layer Differential Parallax */}
        <h1 
          className="text-[clamp(3.1rem,calc((100vw-48px)/5.62),16.5rem)] md:text-[clamp(4.5rem,13.5vw,16.5rem)] font-bold uppercase tracking-[-0.04em] leading-[0.84] text-cinema-white select-none -ml-0.5 md:-ml-2 flex flex-col w-full"
          style={{
            fontSize: mobileFontSize || undefined,
            textShadow: isHovered 
              ? '2px 0 rgba(255, 59, 48, 0.4), -2px 0 rgba(0, 229, 255, 0.3)' 
              : 'none',
            transition: 'text-shadow 0.3s ease',
          }}
        >
          {/* Line 1: Ritvik with subtle magnetic shift */}
          <div 
            className="block overflow-hidden will-change-transform transition-transform duration-300 ease-out w-full"
            style={{
              transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 8}px, 0)`,
            }}
          >
            <span className="inline-block hero-title-line whitespace-nowrap">
              {renderDynamicText("Ritvik")}
            </span>
          </div>

          {/* Line 2: Chunamari with deeper magnetic shift */}
          <div 
            className="block overflow-hidden will-change-transform transition-transform duration-300 ease-out w-full"
            style={{
              transform: `translate3d(${mousePos.x * 22}px, ${mousePos.y * 14}px, 0)`,
            }}
          >
            <span ref={chunamariSpanRef} className="inline-block hero-title-line whitespace-nowrap">
              {renderDynamicText("Chunamari")}
            </span>
          </div>
        </h1>

        {/* Swiss Red Accent Bar */}
        <div 
          className="w-12 h-[2px] bg-[#FF3B30] my-6 md:my-8 hero-meta-reveal opacity-0 transition-all duration-300"
          style={{
            transform: `scaleX(${isHovered ? 1.4 : 1})`,
            transformOrigin: 'left',
          }}
        />

        {/* Manifesto Subtitle */}
        <div className="max-w-2xl hero-meta-reveal opacity-0">
          <p className="text-base sm:text-lg md:text-2xl font-light text-neutral-300 leading-relaxed tracking-tight">
            <span className="text-white font-medium shadow-glow">Creative Designer</span> and{' '}
            <span className="text-white font-medium shadow-glow">Vibe Coder</span> crafting digital experiences at the intersection of logic and human intuition.
          </p>
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

export default Hero;
