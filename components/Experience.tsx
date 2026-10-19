import React, { useEffect, useRef } from 'react';
import { Experience } from '../types';

interface ExperienceProps {
  experiences: Experience[];
}

const ExperienceList: React.FC<ExperienceProps> = ({ experiences }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    // Throttled Scroll Laser Guide Rail & Node Ignition
    let ticking = false;
    const updateLaser = () => {
      if (!containerRef.current || !beamRef.current) {
        ticking = false;
        return;
      }
      const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        beamRef.current.style.transform = 'scaleY(1)';
        nodeRefs.current.forEach((node) => {
          if (node) {
            node.style.backgroundColor = '#FF3B30';
            node.style.borderColor = '#FFFFFF';
            node.style.transform = 'scale(1.2)';
          }
        });
        ticking = false;
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const readingLine = vh * 0.65;

      const totalDist = rect.height;
      const currentDist = readingLine - rect.top;
      const progress = Math.min(1, Math.max(0, currentDist / totalDist));

      beamRef.current.style.transform = `scaleY(${progress.toFixed(3)})`;

      itemRefs.current.forEach((item, idx) => {
        const node = nodeRefs.current[idx];
        if (!item || !node) return;

        const itemRect = item.getBoundingClientRect();
        if (itemRect.top <= readingLine) {
          node.style.backgroundColor = '#FF3B30';
          node.style.borderColor = '#FFFFFF';
          node.style.transform = 'scale(1.35)';
          node.style.boxShadow = '0 0 14px rgba(255, 59, 48, 0.8)';
        } else {
          node.style.backgroundColor = '#262626';
          node.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          node.style.transform = 'scale(1)';
          node.style.boxShadow = 'none';
        }
      });

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateLaser);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    requestAnimationFrame(updateLaser);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [experiences]);

  return (
    <div className="w-full border-t border-white/10 relative" ref={containerRef}>
      {/* Swiss Vertical Laser Guide Rail */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/[0.06] pointer-events-none hidden md:block">
        <div 
          ref={beamRef}
          className="w-full h-full bg-gradient-to-b from-white/30 via-[#FF3B30] to-[#FF3B30] origin-top scale-y-0 will-change-transform shadow-[0_0_8px_rgba(255,59,48,0.5)]"
        />
      </div>

      {experiences.map((exp, index) => (
        <div 
          key={index} 
          ref={(el) => { if (el) itemRefs.current[index] = el; }}
          className="experience-item group grid grid-cols-1 md:grid-cols-12 gap-y-6 py-12 md:pl-8 border-b border-white/[0.08] hover:bg-white/[0.02] transition-all duration-500 ease-out opacity-0 translate-y-8 relative"
          style={{ transitionDelay: `${index * 80}ms` }}
        >
          {/* Milestone Precision Node Dot */}
          <span 
            ref={(el) => { if (el) nodeRefs.current[index] = el; }}
            className="hidden md:block absolute -left-[5px] top-14 w-[12px] h-[12px] rounded-full bg-neutral-800 border-2 border-white/30 transition-all duration-300 ease-out will-change-transform z-10"
          />

          <div className="md:col-span-3 pl-2 border-l-2 border-transparent group-hover:border-[#FF3B30] transition-colors duration-300">
             <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block mb-2">{exp.duration}</span>
             <h4 className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-white transition-colors">{exp.company}</h4>
          </div>

          <div className="md:col-span-3">
             <span className="text-sm font-semibold uppercase tracking-wide text-neutral-300 block mb-1">{exp.role}</span>
             <span className="text-xs text-white/40 font-mono">{exp.location}</span>
          </div>

          <div className="md:col-span-6 md:pl-8">
             <ul className="space-y-3">
               {exp.points.map((point, i) => (
                 <li key={i} className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors leading-relaxed max-w-xl">
                   {point}
                 </li>
               ))}
             </ul>
          </div>

        </div>
      ))}
    </div>
  );
};

export default ExperienceList;