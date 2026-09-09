import React, { useEffect, useRef } from 'react';
import { Experience } from '../types';

interface ExperienceProps {
  experiences: Experience[];
}

const ExperienceList: React.FC<ExperienceProps> = ({ experiences }) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

    const items = containerRef.current?.querySelectorAll('.experience-item');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [experiences]);

  return (
    <div className="w-full border-t border-black/10" ref={containerRef}>
      {experiences.map((exp, index) => (
        <div 
          key={index} 
          className="experience-item group grid grid-cols-1 md:grid-cols-12 gap-y-6 py-12 border-b border-black/10 hover:bg-neutral-50 transition-all duration-500 ease-out opacity-0 translate-y-8"
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          
          <div className="md:col-span-3 pl-2 border-l-2 border-transparent group-hover:border-black transition-colors duration-300">
             <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">{exp.duration}</span>
             <h4 className="text-lg font-bold uppercase tracking-tight">{exp.company}</h4>
          </div>

          <div className="md:col-span-3">
             <span className="text-sm font-medium uppercase tracking-wide text-neutral-600 block mb-1">{exp.role}</span>
             <span className="text-xs text-neutral-400 font-mono">{exp.location}</span>
          </div>

          <div className="md:col-span-6 md:pl-8">
             <ul className="space-y-3">
               {exp.points.map((point, i) => (
                 <li key={i} className="text-sm text-neutral-700 leading-relaxed max-w-xl">
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