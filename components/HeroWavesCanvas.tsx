import React, { useEffect, useRef } from 'react';

interface HeroWavesCanvasProps {
  offset?: number;
}

interface WaveConfig {
  baseYPercent: number;    // Base vertical anchor (0 to 1)
  amplitude: number;       // Base wave crest height in px
  frequency: number;       // Spatial frequency
  speed: number;           // Animation speed
  color: string;           // Stroke color (RGBA or Hex)
  lineWidth: number;       // Stroke width
  glow?: boolean;          // Optional glow effect
  dash?: number[];         // Optional line dash
  hasNodes?: boolean;      // Small points on crests
}

const HeroWavesCanvas: React.FC<HeroWavesCanvasProps> = ({ offset = 0 }) => {
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

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse Tracking with smooth interpolation
    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      radius: 220,
      force: 0
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.force = 1;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 7 Carefully tuned generative wave ribbons across the horizon
    const waves: WaveConfig[] = [
      {
        baseYPercent: 0.45,
        amplitude: 38,
        frequency: 0.0035,
        speed: 0.014,
        color: 'rgba(255, 255, 255, 0.08)',
        lineWidth: 1
      },
      {
        baseYPercent: 0.52,
        amplitude: 48,
        frequency: 0.0042,
        speed: 0.018,
        color: 'rgba(255, 255, 255, 0.18)',
        lineWidth: 1.2
      },
      {
        baseYPercent: 0.58,
        amplitude: 62,
        frequency: 0.0038,
        speed: 0.022,
        color: 'rgba(255, 59, 48, 0.55)', // Signature Swiss Red Laser Ribbon
        lineWidth: 1.5,
        glow: true
      },
      {
        baseYPercent: 0.64,
        amplitude: 54,
        frequency: 0.0048,
        speed: 0.016,
        color: 'rgba(255, 255, 255, 0.28)', // Crisp White Lead Ribbon
        lineWidth: 1.5,
        hasNodes: true
      },
      {
        baseYPercent: 0.70,
        amplitude: 44,
        frequency: 0.0039,
        speed: 0.020,
        color: 'rgba(180, 195, 220, 0.14)',
        lineWidth: 1
      },
      {
        baseYPercent: 0.76,
        amplitude: 36,
        frequency: 0.0052,
        speed: 0.024,
        color: 'rgba(255, 59, 48, 0.25)', // Faint Secondary Red Accent
        lineWidth: 1,
        dash: [4, 8]
      },
      {
        baseYPercent: 0.82,
        amplitude: 28,
        frequency: 0.0032,
        speed: 0.012,
        color: 'rgba(255, 255, 255, 0.09)',
        lineWidth: 1
      }
    ];

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const currentOffset = offsetRef.current;
      const scrollFade = Math.max(0, 1 - currentOffset * 0.0025);
      canvas.style.opacity = String(scrollFade);

      // Dynamic step size based on screen width
      const step = width < 768 ? 8 : 5;
      const wavePoints: { x: number; y: number }[][] = [];

      // 1. Calculate and Draw Wave Ribbons
      waves.forEach((wave, waveIdx) => {
        const points: { x: number; y: number }[] = [];
        const baseY = height * wave.baseYPercent + Math.sin(time * 0.5 + waveIdx) * 12;

        for (let x = 0; x <= width + step; x += step) {
          // Multi-harmonic superposition for rich organic flow
          const h1 = Math.sin(x * wave.frequency + time * wave.speed * 60 + waveIdx) * wave.amplitude;
          const h2 = Math.sin(x * (wave.frequency * 2.3) - time * (wave.speed * 40) + waveIdx * 1.5) * (wave.amplitude * 0.35);
          const h3 = Math.cos(x * (wave.frequency * 0.6) + time * (wave.speed * 20)) * (wave.amplitude * 0.25);

          let y = baseY + h1 + h2 + h3;

          // Interactive cursor displacement (swell & ripple)
          const distToMouse = Math.hypot(x - mouse.x, y - mouse.y);
          if (distToMouse < mouse.radius) {
            const factor = Math.cos((distToMouse / mouse.radius) * (Math.PI / 2));
            const swell = factor * 45 * Math.sin(time * 6 - distToMouse * 0.05);
            y += swell;
          }

          points.push({ x, y });
        }

        wavePoints.push(points);

        // Draw Wave Ribbon Line with dynamic gradient
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.15, wave.color);
        gradient.addColorStop(0.85, wave.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = wave.lineWidth;
        if (wave.dash) {
          ctx.setLineDash(wave.dash);
        } else {
          ctx.setLineDash([]);
        }

        if (wave.glow) {
          ctx.shadowColor = '#FF3B30';
          ctx.shadowBlur = 12;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        // Optional Crest Nodes (small glowing data points)
        if (wave.hasNodes) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          const nodeInterval = width < 768 ? 24 : 16;
          for (let i = 0; i < points.length; i += nodeInterval) {
            const pt = points[i];
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // 2. Draw Subtle Vertical Isoline Connectors between Adjacent Waves (Topographic Mesh Grid)
      ctx.shadowBlur = 0;
      ctx.setLineDash([]);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';

      const colStep = width < 768 ? 32 : 24;
      for (let c = 0; c < wavePoints[0].length; c += colStep) {
        ctx.beginPath();
        ctx.moveTo(wavePoints[0][c].x, wavePoints[0][c].y);
        for (let w = 1; w < wavePoints.length; w++) {
          if (wavePoints[w] && wavePoints[w][c]) {
            ctx.lineTo(wavePoints[w][c].x, wavePoints[w][c].y);
          }
        }
        ctx.stroke();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 mix-blend-screen transition-opacity duration-300"
      style={{ opacity: 1 }}
    />
  );
};

export default HeroWavesCanvas;
