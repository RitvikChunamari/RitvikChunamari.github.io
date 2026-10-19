import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection?: string;
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
  ariaLabel?: string;
}> = ({ children, onClick, className, cursorText, href, download, target, rel, ariaLabel }) => {
  const elemRef = useRef<any>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!elemRef.current) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const { left, top, width, height } = elemRef.current.getBoundingClientRect();
    
    // Calculate distance from center with refined magnetic attraction
    const x = (e.clientX - (left + width / 2)) * 0.32;
    const y = (e.clientY - (top + height / 2)) * 0.32;
    
    gsap.to(elemRef.current, {
      x,
      y,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = () => {
    if (!elemRef.current) return;
    // Elegant spring return to neutral origin
    gsap.to(elemRef.current, {
      x: 0,
      y: 0,
      duration: 0.55,
      ease: 'elastic.out(1, 0.45)',
      overwrite: 'auto',
      onComplete: () => {
        if (elemRef.current) elemRef.current.style.transform = '';
      }
    });
  };

  if (href) {
    return (
      <a 
        ref={elemRef}
        href={href}
        download={download}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative will-change-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${className}`}
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
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group transition-colors duration-200 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm ${className || 'text-[10px] md:text-xs font-bold uppercase tracking-widest hover:text-neutral-300'}`}
      data-cursor-text={cursorText || "GO TO"}
    >
      <span className="block pointer-events-none">
        {children}
      </span>
      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full group-focus-visible:w-full pointer-events-none"></span>
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ onNavigate, activeSection = 'home' }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white">
      <div className="bg-black/5 backdrop-blur-sm border-b border-white/10 w-full px-4 sm:px-6 md:px-12 py-3 sm:py-4 flex items-center justify-between">
        
        {/* Logo - Sharp & Technical - Now Magnetic */}
        <div className="w-auto md:w-1/4">
          <MagneticNavItem 
            onClick={() => onNavigate('home')}
            ariaLabel="Ritvik Chunamari - Home"
            className="cursor-pointer font-bold text-sm tracking-tight uppercase"
            cursorText="HOME"
          >
            RC
          </MagneticNavItem>
        </div>

        {/* Center Info - Monospace Data */}
        <div className="hidden md:flex w-2/4 justify-center items-center space-x-12">
          <span className="font-mono text-[10px] tracking-widest text-white/80 uppercase">Arvada, CO</span>
          <span className="font-mono text-[10px] tracking-widest text-white/80 uppercase">{time} MST</span>
        </div>

        {/* Navigation - Right Aligned Grid */}
        <nav aria-label="Main Navigation" className="w-auto md:w-auto flex items-center justify-end space-x-5 sm:space-x-7 md:space-x-8">
          {['Work', 'Profile', 'Contact'].map((item) => (
            <MagneticNavItem 
              key={item}
              onClick={() => onNavigate(item.toLowerCase())}
              ariaLabel={`Navigate to ${item} section`}
              className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${
                activeSection === item.toLowerCase() ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              {item}
            </MagneticNavItem>
          ))}

          {/* Action Button: RESUME */}
          <MagneticNavItem
            href="./Ritvik_Chunamari_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download="Ritvik_Chunamari_Resume.pdf"
            ariaLabel="Download Ritvik Chunamari Resume PDF"
            cursorText="RESUME"
            className="border border-white/50 hover:border-white px-2.5 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-mono font-bold tracking-wider sm:tracking-widest text-white hover:bg-white hover:text-black transition-all duration-200 inline-flex items-center gap-1 shadow-sm active:scale-95"
          >
            <span>RESUME</span>
            <span className="text-[9px] opacity-75" aria-hidden="true">↓</span>
          </MagneticNavItem>
        </nav>

      </div>
    </header>
  );
};

export default Header;