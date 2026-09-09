
import React, { useEffect, useRef, useState } from 'react';
import { ResumeData } from '../types';
import ExperienceList from './Experience';

interface AboutProps {
  data: ResumeData;
}

const About: React.FC<AboutProps> = ({ data }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-24');
            entry.target.classList.add('opacity-100', 'translate-y-0');
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const renderSplitWords = (text: string, baseDelay: number = 0) => {
    return text.split(' ').map((word, index) => (
      <React.Fragment key={index}>
        <span className="inline-block overflow-hidden align-baseline">
          <span 
            className={`inline-block transform transition-transform duration-1000 ease-expo ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
            style={{ transitionDelay: `${baseDelay + (index * 30)}ms` }}
          >
            {word}
          </span>
        </span>
        {' '}
      </React.Fragment>
    ));
  };

  const renderRevealHeading = (text: string, baseDelay: number = 0) => {
    return (
      <span className="inline-block">
        {text.split('').map((char, index) => (
          <span key={index} className="inline-block overflow-hidden align-bottom">
            <span
              className={`inline-block transform transition-transform duration-1000 ease-expo ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
              style={{ transitionDelay: `${baseDelay + (index * 25)}ms` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          </span>
        ))}
      </span>
    );
  };

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="bg-white text-black relative z-20 rounded-t-[3rem] -mt-12 border-t border-black/10 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-all duration-1000 ease-out opacity-0 translate-y-24 will-change-transform"
    >
      
      {/* Intro Bio Container */}
      <div className="px-6 md:px-12 pt-32 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-32 relative">
          <div className="md:col-span-4">
            <div className="sticky top-32 self-start">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block mb-4">● Profile</span>
            </div>
          </div>
          <div className="md:col-span-8" data-cursor-text="READING" data-edith-target="BIOMETRIC PROFILE // RITVIK CHUNAMARI">
            <div className="text-3xl md:text-5xl font-sans font-semibold leading-[1.3] tracking-tight mb-12 text-black">
               {/* Word by word staggered reveal */}
               {renderSplitWords(data.personal.summary, 0)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border-l-2 border-black pl-6 hover:pl-8 transition-all duration-300 bg-neutral-50/80 py-4 rounded-r-lg">
                  <span className="block font-mono text-[10px] uppercase text-neutral-500 mb-2 tracking-widest">Personal Insight</span>
                  <p className="text-lg italic font-medium text-neutral-900">{data.personal.insights}</p>
                </div>
            </div>
          </div>
        </div>

        {/* Experience - Swiss Layout with Border Rule */}
        <div className="mb-20 pt-12 border-t border-black">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            <div className="md:col-span-4">
               <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 block">● Experience</span>
            </div>
            <div className="md:col-span-8 flex items-center justify-between border-b border-black/20 pb-6">
                <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-black">
                  {renderRevealHeading("Experience", 200)}
                </h3>
                <span className="font-mono text-[10px] uppercase border border-black rounded-full px-3 py-1 overflow-hidden font-semibold">
                   <span className={`inline-block transform transition-transform duration-1000 ease-expo ${isVisible ? 'translate-y-0' : 'translate-y-full'}`} style={{ transitionDelay: '600ms' }}>
                      2024 — Present
                   </span>
                </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12">
             <div className="md:col-span-12">
                <ExperienceList experiences={data.experience} />
             </div>
          </div>
        </div>
      </div>

      {/* Kinetic Marquee Strip */}
      <div className="overflow-hidden py-12 border-y border-black/10 bg-neutral-100 mb-20 select-none cursor-pointer group" data-cursor-text="CONNECT">
        <div className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
          {[1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <span className="text-6xl md:text-8xl font-bold uppercase tracking-tighter mx-8 text-black">User Experience</span>
              <span className="text-6xl md:text-8xl font-bold uppercase tracking-tighter mx-8 text-transparent stroke-text">Interaction</span>
              <span className="text-6xl md:text-8xl font-bold uppercase tracking-tighter mx-8 text-black">Research</span>
              <span className="text-6xl md:text-8xl font-bold uppercase tracking-tighter mx-8 text-transparent stroke-text">Prototyping</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Grid: Education & Skills - Swiss Layout with Border Rules */}
      <div className="px-6 md:px-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 border-t border-black pt-12">
          
          {/* Education Column */}
          <div className="relative">
            <div className="sticky top-32 self-start mb-12 bg-transparent py-2 z-10 pointer-events-none">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                 {renderRevealHeading("● Education", 400)}
              </h4>
            </div>
            <div className="space-y-16">
              {data.education.map((edu, idx) => (
                <div 
                  key={idx} 
                  className="relative pl-8 border-l border-neutral-300 hover:border-black transition-colors duration-500 will-change-transform"
                >
                  <span className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-black rounded-full"></span>
                  <h5 className="text-2xl font-bold mb-2 text-black">{edu.school}</h5>
                  <p className="text-xl font-sans font-medium text-neutral-700 mb-4">{edu.degree}</p>
                  <div className="flex gap-4 text-[10px] font-mono text-neutral-500 uppercase mb-4 tracking-widest">
                      <span>{edu.duration}</span>
                      <span>{edu.location}</span>
                  </div>
                  <ul className="space-y-2">
                      {edu.details.map((d, i) => (
                        <li key={i} className="text-sm text-neutral-800 leading-normal">{d}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities Column (Vertical Stack) */}
          <div className="relative flex flex-col space-y-24">
             <div className="sticky top-32 self-start mb-12 bg-transparent py-2 z-10 pointer-events-none">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                  {renderRevealHeading("● Capabilities", 600)}
                </h4>
            </div>
            
            {/* 1. Skillset */}
            <div className="will-change-transform">
              <div className="border-b border-black/20 pb-4 mb-8 flex items-end justify-between">
                <span className="font-bold uppercase text-sm tracking-wide text-black">01 / Skillset</span>
              </div>

              <div className="space-y-10">
                {data.skills.map((cat, idx) => (
                  <div key={idx}>
                    <span className="block font-mono text-[10px] text-neutral-500 mb-4 uppercase tracking-widest font-semibold">{cat.category}</span>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.split(', ').map((skill, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="px-3.5 py-1.5 border border-neutral-300 bg-neutral-50 rounded-sm text-xs font-semibold uppercase tracking-wide text-neutral-800 transition-all duration-300 cursor-default hover:bg-black hover:text-white hover:border-black hover:-translate-y-0.5 hover:shadow-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Certifications (Refactored to Ruled List) */}
            <div className="will-change-transform">
              <div className="border-b border-black/20 pb-4 mb-8 flex items-end justify-between">
                <span className="font-bold uppercase text-sm tracking-wide text-black">02 / Certifications</span>
              </div>
              <div className="flex flex-col">
                {data.certifications.map((c, i) => (
                  <div 
                    key={i} 
                    className="group relative py-4 border-b border-black/10 flex items-start justify-between transition-all duration-300 hover:bg-neutral-50 hover:pl-4" 
                    data-cursor-text="VERIFY"
                  >
                     <span className="text-sm font-semibold text-neutral-700 group-hover:text-black transition-colors leading-relaxed max-w-[90%]">
                        {c}
                     </span>
                     <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-black text-xs mt-1">
                       ↗
                     </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
