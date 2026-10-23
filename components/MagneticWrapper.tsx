import React, { useRef } from 'react';
import gsap from 'gsap';

interface MagneticWrapperProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

const MagneticWrapper: React.FC<MagneticWrapperProps> = ({ children, className = '', strength = 0.25 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const isCoarse = typeof window !== 'undefined' && (
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    if (isCoarse) return;

    let rect = rectRef.current;
    if (!rect) {
      rect = ref.current.getBoundingClientRect();
      rectRef.current = rect;
    }

    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    gsap.to(ref.current, { transform: `translate3d(${x}px, ${y}px, 0)`, duration: 0.22, ease: 'power2.out', overwrite: 'auto' });
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    if (!ref.current) return;
    gsap.to(ref.current, { transform: 'translate3d(0, 0, 0)', duration: 0.42, ease: 'power3.out', overwrite: 'auto' });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
};

export default MagneticWrapper;
