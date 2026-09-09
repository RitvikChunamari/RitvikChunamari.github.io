import React, { useRef } from 'react';

interface MagneticWrapperProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

const MagneticWrapper: React.FC<MagneticWrapperProps> = ({ children, className = '', strength = 0.2 }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * strength; 
    const y = (e.clientY - (top + height / 2)) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = 'translate(0px, 0px)';
  };

  return (
    <div 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`will-change-transform transition-transform duration-300 ease-out ${className}`}
    >
      {children}
    </div>
  );
};

export default MagneticWrapper;
