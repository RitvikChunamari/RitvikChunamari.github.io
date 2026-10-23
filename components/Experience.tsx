import React, { useLayoutEffect, useRef } from 'react';
import { Experience } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrambleText } from '../utils/scrambleText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ExperienceProps {
  experiences: Experience[];
}

const ExperienceList: React.FC<ExperienceProps> = ({ experiences }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const expTitleRef = useRef<HTMLHeadingElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) {
      itemRefs.current.forEach((item) => {
        if (item) {
          item.classList.add('opacity-100', 'translate-y-0');
          item.classList.remove('opacity-0', 'translate-y-8');
        }
      });
      if (beamRef.current) beamRef.current.style.transform = 'scaleY(1)';
      nodeRefs.current.forEach((node) => {
        if (node) {
          node.style.backgroundColor = '#FF3B30';
          node.style.borderColor = '#FFFFFF';
          node.style.transform = 'scale(1.2)';
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 0. Header Cryptographic Scramble
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 82%',
        onEnter: () => {
          if (expTitleRef.current) {
            scrambleText(expTitleRef.current, '03 /// EXPERIENCE & LEADERSHIP', { duration: 600 });
          }
        }
      });
      // 1. Continuous Laser Guide Rail Progression (Scrubbed smoothly with Lenis)
      if (beamRef.current) {
        gsap.fromTo(beamRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: 0.2,
              invalidateOnRefresh: true,
            }
          }
        );
      }

      // 2. Experience Items Staggered Reveals & Node Ignition
      itemRefs.current.forEach((item, idx) => {
        if (!item) return;
        const node = nodeRefs.current[idx];
        const durationEl = item.querySelector('.exp-duration');
        const companyEl = item.querySelector('.exp-company');

        // Reveal animation
        gsap.fromTo(item,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            }
          }
        );

        // Active Reading Plane Node Ignition
        if (node) {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 65%',
            onEnter: () => {
              gsap.to(node, {
                backgroundColor: '#FF3B30',
                borderColor: '#FFFFFF',
                scale: 1.35,
                boxShadow: '0 0 16px rgba(255, 59, 48, 0.85), 0 0 4px #FFFFFF',
                duration: 0.25,
                ease: 'power2.out',
              });
              if (durationEl) gsap.to(durationEl, { color: '#EDEDED', duration: 0.25 });
              if (companyEl) gsap.to(companyEl, { color: '#FFFFFF', duration: 0.25 });
            },
            onLeaveBack: () => {
              gsap.to(node, {
                backgroundColor: '#262626',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                scale: 1,
                boxShadow: 'none',
                duration: 0.25,
                ease: 'power2.out',
              });
              if (durationEl) gsap.to(durationEl, { color: '', duration: 0.25 });
              if (companyEl) gsap.to(companyEl, { color: '', duration: 0.25 });
            }
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [experiences]);

  return (
    <div className="w-full border-t border-white/10 relative" ref={containerRef}>
      {/* Swiss Vertical Laser Guide Rail */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/[0.06] pointer-events-none hidden md:block">
        <div 
          ref={beamRef}
          className="w-full h-full bg-gradient-to-b from-white/30 via-[#FF3B30] to-[#FF3B30] origin-top scale-y-0 will-change-transform shadow-[0_0_10px_rgba(255,59,48,0.7)] relative"
        >
          {/* Luminous Laser Tip Micro-Glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#FF3B30] shadow-[0_0_12px_rgba(255,59,48,0.9),0_0_24px_rgba(255,59,48,0.5)]" />
        </div>
      </div>

      {/* Experience Sub-Header */}
      <div className="flex items-center gap-3 pt-12 pb-6 md:pl-8">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse"></span>
        <h3 ref={expTitleRef} className="text-xs font-mono uppercase tracking-[0.25em] text-white font-medium">
          03 /// Experience &amp; Leadership
        </h3>
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
             <span className="exp-duration font-mono text-[10px] uppercase tracking-widest text-white/60 block mb-2 transition-colors duration-300">{exp.duration}</span>
             <h4 className="exp-company text-lg font-bold uppercase tracking-tight text-white/85 group-hover:text-white transition-colors duration-300">{exp.company}</h4>
          </div>

          <div className="md:col-span-3">
             <span className="text-sm font-semibold uppercase tracking-wide text-neutral-300 block mb-1">{exp.role}</span>
             <span className="text-xs text-white/60 font-mono">{exp.location}</span>
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