import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
}

const MagneticNavItem: React.FC<{ children: React.ReactNode; onClick: () => void; className?: string; cursorText?: string }> = ({ children, onClick, className, cursorText }) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    
    // Calculate distance from center
    const x = (e.clientX - (left + width / 2)) * 0.3; // 0.3 = magnetic strength
    const y = (e.clientY - (top + height / 2)) * 0.3;
    
    // Apply transform directly for performance
    btnRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = '';
  };

  return (
    <button 
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group transition-colors duration-200 ease-out will-change-transform ${className || 'text-[10px] md:text-xs font-bold uppercase tracking-widest hover:text-neutral-400'}`}
      data-cursor-text={cursorText || "GO TO"}
    >
      <span className="block pointer-events-none">
        {children}
      </span>
      {/* Underline only for nav items, maybe make optional? Keeping consistent for now */}
      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full pointer-events-none"></span>
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
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
      <div className="bg-black/5 backdrop-blur-sm border-b border-white/10 w-full px-6 md:px-12 py-4 flex items-center justify-between">
        
        {/* Logo - Sharp & Technical - Now Magnetic */}
        <div className="w-1/4">
          <MagneticNavItem 
            onClick={() => onNavigate('home')}
            className="cursor-pointer font-bold text-sm tracking-tight uppercase"
            cursorText="HOME"
          >
            RC
          </MagneticNavItem>
        </div>

        {/* Center Info - Monospace Data */}
        <div className="hidden md:flex w-2/4 justify-center items-center space-x-12">
          <span className="font-mono text-[10px] tracking-widest text-white/70 uppercase">Arvada, CO</span>
          <span className="font-mono text-[10px] tracking-widest text-white/70 uppercase">{time} MST</span>
        </div>

        {/* Navigation - Right Aligned Grid */}
        <nav className="w-auto md:w-1/4 flex justify-end space-x-8">
          {['Work', 'Profile', 'Contact'].map((item) => (
            <MagneticNavItem 
              key={item}
              onClick={() => onNavigate(item.toLowerCase())}
            >
              {item}
            </MagneticNavItem>
          ))}
        </nav>

      </div>
    </header>
  );
};

export default Header;