import React, { useEffect, useRef } from 'react';

interface Dot {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  currentRadius: number;
  baseAlpha: number;
  currentAlpha: number;
  color: string;
  activeColor: string;
  highlighted: boolean;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  strength: number;
  alpha: number;
}

const CinematicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let dots: Dot[] = [];
    const ripples: Ripple[] = [];

    // Dense, delicate micro-grid spacing
    const getSpacing = () => (window.innerWidth < 768 ? 20 : 25);

    const initDots = () => {
      dots = [];
      const spacing = getSpacing();
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      // Monochromatic Black, Grey, White Palette
      const monoPalette = [
        { rest: '255, 255, 255', active: '255, 255, 255', baseAlpha: 0.15 }, // Crisp White
        { rest: '210, 215, 225', active: '255, 255, 255', baseAlpha: 0.17 }, // Bright Silver
        { rest: '160, 165, 175', active: '255, 255, 255', baseAlpha: 0.13 }, // Cool Mid-Grey
        { rest: '120, 125, 135', active: '240, 245, 255', baseAlpha: 0.11 }, // Slate Grey
        { rest: '90, 95, 105',   active: '225, 230, 240', baseAlpha: 0.09 }  // Deep Grey
      ];

      for (let r = -1; r <= rows; r++) {
        for (let c = -1; c <= cols; c++) {
          // Slight hexagonal lattice stagger
          const originX = c * spacing + (r % 2 === 0 ? spacing * 0.5 : 0);
          const originY = r * spacing;
          const shade = monoPalette[Math.floor(Math.random() * monoPalette.length)];

          dots.push({
            originX,
            originY,
            x: originX,
            y: originY,
            vx: 0,
            vy: 0,
            baseRadius: Math.random() * 0.3 + 0.65, // 0.65px - 0.95px micro resting size
            currentRadius: 0.75,
            baseAlpha: shade.baseAlpha,
            currentAlpha: shade.baseAlpha,
            color: shade.rest,
            activeColor: shade.active,
            highlighted: false
          });
        }
      }
    };

    initDots();

    // Mouse Tracking with Kinetic Velocity & Influence Radius
    const mouse = {
      x: -2000,
      y: -2000,
      prevX: -2000,
      prevY: -2000,
      vx: 0,
      vy: 0,
      radius: 110,      // Compact, refined repulsion field radius
      maxForce: 7.0,    // Delicate displacement strength
      isActive: false,
      fieldStrength: 0.0,
      targetStrength: 0.0
    };

    let animationFrameId: number;
    let isPaused = false;
    let time = 0;

    const render = () => {
      if (isPaused) return;

      time += 0.018;
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate field strength for organic soft fade in and out
      mouse.fieldStrength += (mouse.targetStrength - mouse.fieldStrength) * 0.065;
      if (mouse.fieldStrength < 0.003) {
        mouse.fieldStrength = 0;
        if (mouse.targetStrength === 0) {
          mouse.isActive = false;
        }
      } else {
        mouse.isActive = true;
      }

      // Compute cursor velocity wake
      mouse.vx = (mouse.x - mouse.prevX) * 0.32;
      mouse.vy = (mouse.y - mouse.prevY) * 0.32;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      // 1. Process and Draw Expanding White/Grey Shockwave Rings on Click
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += 8;
        rp.alpha = Math.max(0, 1 - rp.radius / rp.maxRadius);

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${rp.alpha * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (rp.radius >= rp.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 2. Update Elastic Physics for All Monochromatic Dots
      const activeDots: Dot[] = [];

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // Ambient zero-g harmonic wave drift
        const waveX = Math.sin(time + d.originY * 0.02) * 1.2;
        const waveY = Math.cos(time + d.originX * 0.02) * 1.4;

        const targetHomeX = d.originX + waveX;
        const targetHomeY = d.originY + waveY;

        // Interaction with Cursor Antigravity Force Field (Soft Fading)
        if (mouse.isActive && mouse.fieldStrength > 0.001) {
          const dx = d.x - mouse.x;
          const dy = d.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouse.radius * mouse.radius && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const normDist = 1 - dist / mouse.radius;
            const force = normDist * normDist * mouse.maxForce * mouse.fieldStrength;

            const angle = Math.atan2(dy, dx);
            d.vx += Math.cos(angle) * force * 0.85 + mouse.vx * 0.14 * mouse.fieldStrength;
            d.vy += Math.sin(angle) * force * 0.85 + mouse.vy * 0.14 * mouse.fieldStrength;

            // Illuminate & Scale active dots to Pure White modulated by soft fieldStrength
            d.highlighted = true;
            const targetAlpha = d.baseAlpha + (0.92 - d.baseAlpha) * mouse.fieldStrength;
            d.currentAlpha += (targetAlpha - d.currentAlpha) * 0.22;
            const targetRadius = d.baseRadius + (d.baseRadius * 1.8 - d.baseRadius) * mouse.fieldStrength;
            d.currentRadius += (targetRadius - d.currentRadius) * 0.22;
            activeDots.push(d);
          } else {
            d.highlighted = false;
            d.currentAlpha += (d.baseAlpha - d.currentAlpha) * 0.08;
            d.currentRadius += (d.baseRadius - d.currentRadius) * 0.08;
          }
        } else {
          d.highlighted = false;
          d.currentAlpha += (d.baseAlpha - d.currentAlpha) * 0.08;
          d.currentRadius += (d.baseRadius - d.currentRadius) * 0.08;
        }

        // Interaction with Click Ripple Pulses
        for (let r = 0; r < ripples.length; r++) {
          const rp = ripples[r];
          const rdx = d.x - rp.x;
          const rdy = d.y - rp.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          const diff = Math.abs(rdist - rp.radius);

          if (diff < 25) {
            const rippleForce = (1 - diff / 25) * rp.strength * rp.alpha;
            const rangle = Math.atan2(rdy, rdx);
            d.vx += Math.cos(rangle) * rippleForce;
            d.vy += Math.sin(rangle) * rippleForce;
            d.currentAlpha = Math.min(1.0, d.currentAlpha + 0.4);
            d.currentRadius = Math.min(2.4, d.currentRadius + 0.8);
          }
        }

        // Hooke's Law: Elastic Spring Force snapping back to home coordinate
        const springFx = (targetHomeX - d.x) * 0.07;
        const springFy = (targetHomeY - d.y) * 0.07;

        d.vx = (d.vx + springFx) * 0.87; // Damping / friction
        d.vy = (d.vy + springFy) * 0.87;

        d.x += d.vx;
        d.y += d.vy;

        // Render Dot (White when active, sleek Grey/Silver when resting)
        const dotColor = d.highlighted ? d.activeColor : d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, ${d.currentAlpha})`;
        ctx.fill();
      }

      // 3. Draw Delicate Pure White / Silver Connecting Lines Near Cursor
      const lineThreshold = 34;
      for (let i = 0; i < activeDots.length; i++) {
        const d1 = activeDots[i];
        for (let j = i + 1; j < activeDots.length; j++) {
          const d2 = activeDots[j];
          const ldx = d1.x - d2.x;
          const ldy = d1.y - d2.y;
          const ldistSq = ldx * ldx + ldy * ldy;

          if (ldistSq < lineThreshold * lineThreshold) {
            const ldist = Math.sqrt(ldistSq);
            const lineAlpha = (1 - ldist / lineThreshold) * 0.28 * mouse.fieldStrength;

            ctx.beginPath();
            ctx.moveTo(d1.x, d1.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Event Listeners with Mobile/Tablet Touch Support and Soft Fade
    let fadeTimer: ReturnType<typeof setTimeout> | null = null;

    const isTouchOrMobile = () => 
      typeof window !== 'undefined' && 
      (window.innerWidth <= 1024 || 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

    const triggerSoftFade = (delay = 450) => {
      if (fadeTimer) clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => {
        mouse.targetStrength = 0;
      }, delay);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.targetStrength = 1.0;
      mouse.isActive = true;

      // On mobile & tablet screen, once moved, initiate a soft fade
      if (isTouchOrMobile()) {
        triggerSoftFade(500);
      }
    };

    const handleMouseLeave = () => {
      mouse.targetStrength = 0;
      triggerSoftFade(0);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        mouse.x = t.clientX;
        mouse.y = t.clientY;
        mouse.prevX = t.clientX;
        mouse.prevY = t.clientY;
        mouse.targetStrength = 1.0;
        mouse.isActive = true;
        // Fade once touched
        triggerSoftFade(650);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        mouse.x = t.clientX;
        mouse.y = t.clientY;
        mouse.targetStrength = 1.0;
        mouse.isActive = true;
        // Fade once moved
        triggerSoftFade(450);
      }
    };

    const handleTouchEnd = () => {
      // Soft fade immediately as touch ends
      triggerSoftFade(150);
    };

    const handleTouchCancel = () => {
      triggerSoftFade(0);
    };

    const handleMouseDown = (e: MouseEvent) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 200,
        strength: 5,
        alpha: 1
      });
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDots();
    };

    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (fadeTimer) clearTimeout(fadeTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[25] mix-blend-difference opacity-90 will-change-transform"
    />
  );
};

export default CinematicBackground;
