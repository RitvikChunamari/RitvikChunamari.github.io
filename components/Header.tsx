import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
}

const MagneticNavItem: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string; 
  cursorText?: string;
  href?: string;
  download?: string;
  target?: string;
  rel?: string;
}> = ({ children, onClick, className, cursorText, href, download, target, rel }) => {
  const elemRef = useRef<any>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (elemRef.current) rectRef.current = elemRef.current.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!elemRef.current) return;
    const isCoarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    let rect = rectRef.current;
    if (!rect) {
      rect = elemRef.current.getBoundingClientRect();
      rectRef.current = rect;
    }

    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.28;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.28;
    
    gsap.to(elemRef.current, { transform: `translate3d(${x}px, ${y}px, 0)`, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    if (!elemRef.current) return;
    gsap.to(elemRef.current, { transform: 'translate3d(0, 0, 0)', duration: 0.42, ease: 'power3.out', overwrite: 'auto' });
  };

  if (href) {
    return (
      <a 
        ref={elemRef}
        href={href}
        download={download}
        target={target}
        rel={rel}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] rounded-none ${className}`}
        data-cursor-text={cursorText || "OPEN"}
      >
        <span className="block pointer-events-none">
          {children}
        </span>
      </a>
    );
  }

  return (
    <button 
      ref={elemRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group transition-colors duration-200 ease-out will-change-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] rounded-sm py-2 px-2 sm:py-1.5 sm:px-2 min-h-[40px] flex items-center justify-center active:scale-95 ${className || 'text-[10px] md:text-xs font-bold uppercase tracking-widest text-neutral-300 hover:text-white'}`}
      data-cursor-text={cursorText || "GO TO"}
    >
      <span className="block pointer-events-none">
        {children}
      </span>
      {/* Underline only for nav items */}
      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-x-100 pointer-events-none"></span>
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [time, setTime] = useState('');
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    if (!progressBarRef.current) return;
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      gsap.set(progressBarRef.current, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(progressBarRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          start: 'top top',
          end: 'max',
          scrub: 0.1,
          invalidateOnRefresh: true,
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 text-white">
      <div className="bg-[#050508]/85 backdrop-blur-md border-b border-white/10 w-full px-6 md:px-12 py-4 flex items-center justify-between relative">
        {/* Kinetic Scroll Progress Micro-Line */}
        <div 
          ref={progressBarRef}
          className="absolute bottom-0 left-0 h-[1.5px] w-full bg-gradient-to-r from-[#FF3B30] via-white/80 to-[#FF3B30] origin-left scale-x-0 will-change-transform opacity-80 pointer-events-none"
        />
        
        {/* Logo - Sharp & Technical - Now Magnetic */}
        <div className="w-auto md:w-1/4">
          <MagneticNavItem 
            onClick={() => onNavigate('home')}
            className="cursor-pointer font-bold text-sm tracking-tight uppercase text-white hover:text-[#FF3B30] transition-colors"
            cursorText="HOME"
          >
            RC
          </MagneticNavItem>
        </div>

        {/* Center Info - Monospace Data */}
        <div className="hidden md:flex w-2/4 justify-center items-center space-x-12">
          <span className="font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase">Arvada, CO</span>
          <span className="font-mono text-[10px] tracking-[0.25em] text-white/70 uppercase">{time} MST</span>
        </div>

        {/* Navigation - Right Aligned Grid */}
        <nav className="w-auto md:w-auto flex items-center justify-end space-x-5 sm:space-x-7 md:space-x-8">
          {[
            { label: 'WORKS', id: 'work' },
            { label: 'PROFILE', id: 'profile' },
            { label: 'CONTACT', id: 'contact' },
          ].map((item) => (
            <MagneticNavItem 
              key={item.id}
              onClick={() => onNavigate(item.id)}
              cursorText={item.label}
              className="text-[10px] md:text-xs font-mono font-semibold uppercase tracking-[0.2em] text-neutral-300 hover:text-white"
            >
              {item.label}
            </MagneticNavItem>
          ))}

          {/* Action Button: RESUME */}
          <MagneticNavItem
            href="./Ritvik_Chunamari_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download="Ritvik_Chunamari_Resume.pdf"
            cursorText="RESUME"
            className="border border-white/50 hover:border-white px-3.5 py-1.5 min-h-[36px] rounded-none text-[10px] md:text-xs font-mono font-bold tracking-widest text-white hover:bg-white hover:text-black transition-all duration-200 inline-flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>RESUME</span>
            <span className="text-[9px] opacity-75">↓</span>
          </MagneticNavItem>
        </nav>

      </div>
    </header>
  );
};

export default Header;
