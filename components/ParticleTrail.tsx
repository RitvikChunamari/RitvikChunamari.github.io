import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxLife: number;
  life: number;
  shape: 'square' | 'diamond' | 'cross' | 'ring';
  rotation: number;
  rotSpeed: number;
  opacity: number;
}

export const ParticleTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastMouseRef = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animFrameId: number;
    let isRunning = false;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const shapes: ('square' | 'diamond' | 'cross' | 'ring')[] = ['square', 'diamond', 'cross', 'ring'];

    const render = () => {
      if (particlesRef.current.length === 0) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        isRunning = false;
        return;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.rotation += p.rotSpeed;

        const progress = p.life / p.maxLife;
        if (progress >= 1) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        const alpha = p.opacity * (1 - progress);
        const currentSize = p.size * (1 - progress * 0.3);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
        ctx.lineWidth = 1;

        if (p.shape === 'square') {
          ctx.strokeRect(-currentSize / 2, -currentSize / 2, currentSize, currentSize);
        } else if (p.shape === 'diamond') {
          ctx.beginPath();
          ctx.moveTo(0, -currentSize);
          ctx.lineTo(currentSize * 0.8, 0);
          ctx.lineTo(0, currentSize);
          ctx.lineTo(-currentSize * 0.8, 0);
          ctx.closePath();
          ctx.stroke();
        } else if (p.shape === 'cross') {
          const arm = currentSize * 0.6;
          ctx.beginPath();
          ctx.moveTo(-arm, 0);
          ctx.lineTo(arm, 0);
          ctx.moveTo(0, -arm);
          ctx.lineTo(0, arm);
          ctx.stroke();
        } else if (p.shape === 'ring') {
          ctx.beginPath();
          ctx.arc(0, 0, currentSize / 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }

      animFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const now = Date.now();
      const dt = Math.max(1, now - lastMouseRef.current.time);
      
      const dx = x - lastMouseRef.current.x;
      const dy = y - lastMouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = dist / dt;

      lastMouseRef.current = { x, y, time: now };

      if (dist > 5) {
        const spawnCount = speed > 1.2 ? 2 : 1;

        for (let i = 0; i < spawnCount; i++) {
          if (particlesRef.current.length > 30) {
            particlesRef.current.shift();
          }

          const shape = shapes[Math.floor(Math.random() * shapes.length)];
          const size = Math.random() * 3 + 3;
          const angle = Math.random() * Math.PI * 2;
          const speedFactor = Math.random() * 0.5 + 0.2;

          particlesRef.current.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            vx: Math.cos(angle) * speedFactor,
            vy: Math.sin(angle) * speedFactor - 0.15,
            size,
            maxLife: Math.random() * 20 + 20,
            life: 0,
            shape,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.08,
            opacity: Math.min(0.5, speed * 0.25 + 0.15)
          });
        }

        if (!isRunning) {
          isRunning = true;
          animFrameId = requestAnimationFrame(render);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998] hidden md:block will-change-transform"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default ParticleTrail;
