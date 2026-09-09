import React, { useEffect, useRef, useState } from 'react';

interface HeroMarqueeEchoProps {
  offset?: number;
}

const HeroMarqueeEcho: React.FC<HeroMarqueeEchoProps> = ({ offset = 0 }) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 30; // +/- 15px parallax
      targetY = (e.clientY / innerHeight - 0.5) * 20; // +/- 10px parallax
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      setMouseOffset({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const scrollFade = Math.max(0, 1 - offset * 0.0025);

  const marqueeData = {
    top: [
      'CREATIVE DESIGNER',
      '✦',
      'VIBE CODER',
      '✦',
      'UX ARCHITECT',
      '✦',
      'SYSTEMS THINKING',
      '✦',
      'CREATIVE TECHNOLOGIST',
      '✦',
      'INTERACTION LAB',
      '✦',
    ],
    hugeCenter: [
      'RITVIK CHUNAMARI',
      '—',
      'PORTFOLIO 2026',
      '—',
      'DIGITAL CRAFT',
      '—',
      'DESIGN & CODE',
      '—',
    ],
    technicalMono: [
      '[ ARCHITECTURE ]',
      '///',
      '[ ACCESSIBILITY FIRST ]',
      '///',
      '[ RADICAL EMPATHY ]',
      '///',
      '[ PROTOTYPING AT SPEED ]',
      '///',
      '[ CODE AS A MEDIUM ]',
      '///',
      '[ SWISS PRECISION ]',
      '///',
    ],
    bottom: [
      'INTERACTIVE EXPERIENCES',
      '•',
      'HUMAN-CENTERED SYSTEMS',
      '•',
      'GENERATIVE CODE',
      '•',
      'MOTION DESIGN',
      '•',
      'KINETIC TYPOGRAPHY',
      '•',
    ]
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none flex flex-col justify-between py-16 md:py-24"
      style={{
        opacity: scrollFade,
        transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
        maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
      }}
    >
      <style>{`
        @keyframes ticker-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes ticker-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-ticker-left {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: ticker-left 42s linear infinite;
        }
        .animate-ticker-right {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: ticker-right 50s linear infinite;
        }
        .animate-ticker-left-fast {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: ticker-left 32s linear infinite;
        }
        .animate-ticker-right-slow {
          display: flex;
          width: max-content;
          will-change: transform;
          animation: ticker-right 68s linear infinite;
        }
      `}</style>

      {/* Tier 1: Upper Fast Marquee (Outlined Swiss Title Case) */}
      <div className="overflow-hidden w-full opacity-60">
        <div className="animate-ticker-left">
          {[...Array(4)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-6 whitespace-nowrap pr-6">
              {marqueeData.top.map((item, i) => (
                <span
                  key={i}
                  className={`text-2xl md:text-4xl font-extrabold uppercase tracking-[0.2em] ${
                    item === '✦'
                      ? 'text-[#FF3B30]/50 scale-75'
                      : 'text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)]'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tier 2: Colossal Center Background Echo (Behind Foreground Main Title) */}
      <div className="overflow-hidden w-full my-auto opacity-70">
        <div className="animate-ticker-right-slow">
          {[...Array(4)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-10 whitespace-nowrap pr-10">
              {marqueeData.hugeCenter.map((item, i) => (
                <span
                  key={i}
                  className={`text-[9vw] md:text-[12vw] font-black uppercase tracking-tighter leading-none ${
                    item === '—'
                      ? 'text-[#FF3B30]/25 font-light'
                      : 'text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.04)]'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tier 3: Technical Monospace Data Track */}
      <div className="overflow-hidden w-full opacity-50 mb-3">
        <div className="animate-ticker-left-fast">
          {[...Array(4)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-8 whitespace-nowrap pr-8">
              {marqueeData.technicalMono.map((item, i) => (
                <span
                  key={i}
                  className={`text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] ${
                    item === '///'
                      ? 'text-[#FF3B30]/40'
                      : 'text-white/10'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tier 4: Lower Foundation Ticker (Opposite Flow) */}
      <div className="overflow-hidden w-full opacity-60">
        <div className="animate-ticker-right">
          {[...Array(4)].map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-8 whitespace-nowrap pr-8">
              {marqueeData.bottom.map((item, i) => (
                <span
                  key={i}
                  className={`text-sm md:text-lg font-semibold uppercase tracking-[0.25em] ${
                    item === '•'
                      ? 'text-[#FF3B30]/40'
                      : 'text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.07)]'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroMarqueeEcho;
