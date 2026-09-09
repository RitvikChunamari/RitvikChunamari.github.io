import React, { useEffect, useRef } from 'react';

interface HeroVibeCanvasProps {
  offset?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
  isAccent: boolean;
  pulseSpeed: number;
  pulsePhase: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  color: string;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

const HeroVibeCanvas: React.FC<HeroVibeCanvasProps> = ({ offset = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(offset);

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse tracking with lerp
    const mouse = {
      x: -3000,
      y: -3000,
      targetX: -3000,
      targetY: -3000,
      radius: 180,
      isHovered: false
    };

    let particles: Particle[] = [];
    let sparks: Spark[] = [];
    let shockwaves: Shockwave[] = [];

    const initParticles = () => {
      const isMobile = width < 768;
      const count = isMobile ? 48 : 110;
      particles = [];

      for (let i = 0; i < count; i++) {
        const isAccent = Math.random() < 0.14; // ~14% Swiss Red nodes
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: isAccent ? Math.random() * 1.8 + 1.2 : Math.random() * 1.4 + 0.8,
          alpha: Math.random() * 0.4 + 0.2,
          baseAlpha: Math.random() * 0.4 + 0.2,
          isAccent,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    };

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -3000;
      mouse.targetY = -3000;
      mouse.isHovered = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Create shockwave ring
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 10,
        maxRadius: Math.min(width, height) * 0.35,
        alpha: 0.7
      });

      // Spawn energetic spark burst
      const sparkCount = width < 768 ? 16 : 28;
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const isRed = Math.random() < 0.45;
        sparks.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2 + 1,
          alpha: 1,
          decay: Math.random() * 0.025 + 0.015,
          color: isRed ? '#FF3B30' : '#FFFFFF'
        });
      }

      // Repel nearby particles violently
      particles.forEach((p) => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.hypot(dx, dy);
        if (dist < 260 && dist > 0) {
          const force = (1 - dist / 260) * 8;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Scroll fade
      const currentOffset = offsetRef.current;
      const scrollFade = Math.max(0, 1 - currentOffset * 0.0025);
      canvas.style.opacity = String(scrollFade);

      if (scrollFade <= 0.01) return;

      const maxConnectDist = width < 768 ? 85 : 125;

      // 1. Draw Shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += 5.5;
        sw.alpha -= 0.018;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 59, 48, ${sw.alpha * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#FF3B30';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw Sparks
      for (let sp = sparks.length - 1; sp >= 0; sp--) {
        const spark = sparks[sp];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= 0.94; // friction
        spark.vy *= 0.94;
        spark.alpha -= spark.decay;

        if (spark.alpha <= 0) {
          sparks.splice(sp, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
        ctx.fillStyle = spark.color;
        ctx.globalAlpha = spark.alpha;
        if (spark.color === '#FF3B30') {
          ctx.shadowColor = '#FF3B30';
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.restore();
      }

      // 3. Connective Constellation Threads
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectDist) {
            const connectAlpha = (1 - dist / maxConnectDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            if (p1.isAccent || p2.isAccent) {
              ctx.strokeStyle = `rgba(255, 59, 48, ${connectAlpha * 1.2})`;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${connectAlpha})`;
            }
            ctx.stroke();
          }
        }
      }

      // 4. Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Wave float motion
        p.pulsePhase += p.pulseSpeed;
        const waveX = Math.sin(p.pulsePhase + i) * 0.18;
        const waveY = Math.cos(p.pulsePhase + i * 0.5) * 0.18;

        p.x += p.vx + waveX;
        p.y += p.vy + waveY;

        // Damp velocity back to cruise speed
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Bounce gently off boundaries
        if (p.x < 0) {
          p.x = 0;
          p.vx = Math.abs(p.vx);
        } else if (p.x > width) {
          p.x = width;
          p.vx = -Math.abs(p.vx);
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy = Math.abs(p.vy);
        } else if (p.y > height) {
          p.y = height;
          p.vy = -Math.abs(p.vy);
        }

        // Interactive mouse magnetic gravity / push
        const distToMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (distToMouse < mouse.radius && mouse.isHovered) {
          const force = (1 - distToMouse / mouse.radius) * 0.8;
          const angle = Math.atan2(p.y - mouse.y, p.x - mouse.x);
          p.vx += Math.cos(angle) * force * 0.6;
          p.vy += Math.sin(angle) * force * 0.6;

          // Connect node to cursor with fine beam
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          const cursorBeamAlpha = (1 - distToMouse / mouse.radius) * 0.22;
          ctx.strokeStyle = p.isAccent
            ? `rgba(255, 59, 48, ${cursorBeamAlpha * 1.5})`
            : `rgba(255, 255, 255, ${cursorBeamAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (p.isAccent) {
          ctx.fillStyle = '#FF3B30';
          ctx.shadowColor = '#FF3B30';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = '#EDEDED';
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
        const dynamicAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.15;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, dynamicAlpha));
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }

      // 5. Delicate cursor glow orb
      if (mouse.isHovered) {
        const glowGrad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius * 0.8
        );
        glowGrad.addColorStop(0, 'rgba(255, 59, 48, 0.08)');
        glowGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 mix-blend-screen transition-opacity duration-500"
      style={{ opacity: 1 }}
    />
  );
};

export default HeroVibeCanvas;
