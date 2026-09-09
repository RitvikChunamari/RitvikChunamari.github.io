import React, { useEffect, useRef } from 'react';

interface RevealLayerProps {
  className?: string;
}

export const RevealLayer: React.FC<RevealLayerProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const primaryLightRef = useRef<HTMLDivElement>(null);
  const secondaryLeakRef = useRef<HTMLDivElement>(null);

  const posRef = useRef({ x: -500, y: -500, targetX: -500, targetY: -500, vx: 0, vy: 0 });

  useEffect(() => {
    let isMoving = false;
    let idleTimer: number;

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
      isMoving = true;
      clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        isMoving = false;
      }, 500);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId: number;

    const update = () => {
      const pos = posRef.current;

      const dx = pos.targetX - pos.x;
      const dy = pos.targetY - pos.y;

      // Only calculate if there is noticeable movement
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || Math.abs(pos.vx) > 0.1 || Math.abs(pos.vy) > 0.1) {
        pos.vx = pos.vx * 0.88 + dx * 0.07;
        pos.vy = pos.vy * 0.88 + dy * 0.07;

        pos.x += pos.vx;
        pos.y += pos.vy;

        const speed = Math.sqrt(pos.vx * pos.vx + pos.vy * pos.vy);
        const angle = Math.atan2(pos.vy, pos.vx) * (180 / Math.PI);

        if (primaryLightRef.current) {
          primaryLightRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
        }

        if (secondaryLeakRef.current) {
          const stretchX = 1 + Math.min(speed * 0.03, 1.6);
          const stretchY = 1 - Math.min(speed * 0.015, 0.35);
          const opacity = Math.min(0.28, 0.08 + speed * 0.005);

          secondaryLeakRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${stretchX}, ${stretchY})`;
          secondaryLeakRef.current.style.opacity = opacity.toFixed(2);
        }
      }

      animId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(idleTimer);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none z-[4] overflow-hidden ${className}`}
    >
      {/* 1. Feathered Core Luminescence Radial Pool (Hardware native gradients) */}
      <div
        ref={primaryLightRef}
        className="absolute w-[540px] h-[540px] rounded-full will-change-transform opacity-70 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.14) 0%,
              rgba(255, 255, 255, 0.08) 20%,
              rgba(200, 225, 255, 0.04) 40%,
              rgba(140, 170, 240, 0.015) 60%,
              transparent 75%
            )
          `
        }}
      />

      {/* 2. Anamorphic Light-Leak Streak Flare */}
      <div
        ref={secondaryLeakRef}
        className="absolute w-[600px] h-[200px] rounded-full will-change-transform opacity-20 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              rgba(255, 255, 255, 0.18) 0%,
              rgba(240, 220, 190, 0.06) 35%,
              rgba(180, 210, 255, 0.02) 60%,
              transparent 80%
            )
          `
        }}
      />
    </div>
  );
};

export default RevealLayer;

