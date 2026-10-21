import React, { useRef } from 'react';
import gsap from 'gsap';

interface MagneticWrapperProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

const MagneticWrapper: React.FC<MagneticWrapperProps> = ({ children, className = '', strength = 0.25 }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const isCoarse = typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    if (isCoarse) return;

    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * strength; 
    const y = (e.clientY - (top + height / 2)) * strength;
    gsap.to(ref.current, { x, y, duration: 0.15, ease: 'power1.out', overwrite: 'auto' });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
  };

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
};

export default MagneticWrapper;
