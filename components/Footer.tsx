import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { ResumeData } from '../types';
import MagneticWrapper from './MagneticWrapper';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrambleText } from '../utils/scrambleText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FooterProps {
  personal: ResumeData['personal'];
}

const LETS_LETTERS = ['L', 'E', 'T', "'", 'S'];
const TALK_LETTERS = ['T', 'A', 'L', 'K'];

const Footer: React.FC<FooterProps> = ({ personal }) => {
  const footerRef = useRef<HTMLElement>(null);
  const footerTagRef = useRef<HTMLSpanElement>(null);
  const laserLineRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  const [timeStr, setTimeStr] = useState<string>('');

  // Live Colorado Mountain Time (MST/MDT)
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Denver',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setTimeStr(`${formatted} MST`);
      } catch {
        setTimeStr('10:20 PM MST');
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Section Header Laser Line Reveal & Monumental Headline Entrance
  useLayoutEffect(() => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // Top Architectural Laser Line Reveal
      if (laserLineRef.current) {
        if (isReduced) {
          gsap.set(laserLineRef.current, { scaleX: 1 });
        } else {
          gsap.fromTo(laserLineRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: footerRef.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                onEnter: () => {
                  if (footerTagRef.current) {
                    scrambleText(footerTagRef.current, '04 /// CONTACT', { duration: 600 });
                  }
                }
              }
            }
          );
        }
      }

      // Monumental "Let's Talk" Entrance
      if (linkRef.current) {
        if (isReduced) {
          gsap.set(linkRef.current, { y: 0, opacity: 1 });
        } else {
          gsap.fromTo(linkRef.current,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: footerRef.current,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              }
            }
          );
        }
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();

    // Tactile spring squeeze microinteraction
    if (copyBtnRef.current) {
      gsap.fromTo(copyBtnRef.current, 
        { scale: 0.96 }, 
        { scale: 1, duration: 0.35, ease: 'back.out(2)' }
      );
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(personal.email)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2400);
        })
        .catch(() => {
          try {
            const textarea = document.createElement('textarea');
            textarea.value = personal.email;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2400);
          } catch (err) {
            console.warn('Clipboard write fallback unavailable:', err);
          }
        });
    }
  };

  return (
    <footer 
      id="contact" 
      ref={footerRef}
      className="text-cinema-white px-6 md:px-12 pt-24 md:pt-32 pb-16 relative z-30 select-none"
    >
      
      {/* Top Editorial Bar */}
      <div className="border-t border-white/10 pt-8 mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
         {/* Architectural Laser Line that draws across on entry */}
         <div 
           ref={laserLineRef}
           className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-[#FF3B30] via-white/50 to-transparent origin-left scale-x-0 will-change-transform pointer-events-none" 
         />
         <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse"></span>
            <span 
              ref={footerTagRef}
              className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/80 font-medium"
            >
              04 /// Contact
            </span>
         </div>
         <p className="text-xs sm:text-sm text-neutral-400 font-mono tracking-wider max-w-sm md:text-right">
           BOULDER &amp; ARVADA, COLORADO<br/>
           <span className="text-white/60">Creative Technology &amp; Design · ATLAS Institute</span>
         </p>
      </div>

      {/* Monumental "Let's Talk" Stage with Kinetic Letter Roll & Architectural Launcher */}
      <div className="relative mb-20 md:mb-28">
        
        {/* Interactive Kinetic Headline Link */}
        <a 
          ref={linkRef}
          href={`mailto:${personal.email}`}
          className="group block relative w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] py-2"
          data-cursor-text="SAY HELLO"
          aria-label="Let's Talk — Send email to Ritvik Chunamari"
        >
          <div className="flex items-center justify-between w-full">
            
            {/* Kinetic Rolling Letters Headline */}
            <div className="flex items-baseline flex-wrap md:flex-nowrap gap-x-4 sm:gap-x-6 md:gap-x-8 text-[11.5vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[8vw] xl:text-[120px] 2xl:text-[145px] font-black uppercase tracking-[-0.04em] leading-[0.88] select-none text-white">
              
              {/* Word 1: LET'S */}
              <span className="inline-flex">
                {LETS_LETTERS.map((char, i) => (
                  <span key={i} className="relative inline-block overflow-hidden h-[1.12em] align-top">
                    {/* Primary Letter (rolls up on hover) */}
                    <span 
                      className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform"
                      style={{ transitionDelay: `${i * 24}ms` }}
                    >
                      {char}
                    </span>
                    {/* Duplicate Clone (rolls in from below with Crimson accent) */}
                    <span 
                      className="absolute inset-0 block text-[#FF3B30] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0 will-change-transform"
                      style={{ transitionDelay: `${i * 24}ms` }}
                      aria-hidden="true"
                    >
                      {char}
                    </span>
                  </span>
                ))}
              </span>

              {/* Word 2: TALK */}
              <span className="inline-flex">
                {TALK_LETTERS.map((char, i) => (
                  <span key={i} className="relative inline-block overflow-hidden h-[1.12em] align-top">
                    {/* Primary Letter */}
                    <span 
                      className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full will-change-transform"
                      style={{ transitionDelay: `${(i + 5) * 24}ms` }}
                    >
                      {char}
                    </span>
                    {/* Duplicate Clone */}
                    <span 
                      className="absolute inset-0 block text-[#FF3B30] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0 will-change-transform"
                      style={{ transitionDelay: `${(i + 5) * 24}ms` }}
                      aria-hidden="true"
                    >
                      {char}
                    </span>
                  </span>
                ))}
              </span>
            </div>

            {/* Architectural Magnetic Action Launcher Button */}
            <div className="hidden md:flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 border border-white/20 bg-white/[0.02] group-hover:bg-[#FF3B30] group-hover:border-[#FF3B30] transition-all duration-500 rounded-none shrink-0 self-center shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
              <span className="text-2xl lg:text-3xl xl:text-4xl text-white/80 group-hover:text-white transition-all duration-500 transform group-hover:translate-x-1.5 group-hover:-translate-y-1.5 group-hover:scale-110">
                ↗
              </span>
            </div>
          </div>

          {/* Interactive Laser Progress Underline */}
          <div className="relative w-full h-[1.5px] bg-white/10 mt-6 sm:mt-8 md:mt-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF3B30] via-white to-[#FF3B30] -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          </div>
        </a>
      </div>

      {/* Footer Info & Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 border-t border-white/10 pt-8 items-start">
        
        {/* Email */}
        <div className="md:col-span-5">
           <span className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-2.5 tracking-wider font-semibold">
             Email
           </span>
           <button 
             ref={copyBtnRef}
             onClick={handleCopyEmail}
             className="group flex flex-col items-start text-left cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] rounded-none py-1.5 px-2 -ml-2 hover:bg-white/[0.03] border border-transparent hover:border-white/10"
             title="Click to copy email address"
             data-cursor-text="COPY EMAIL"
             aria-live="polite"
           >
             <span className="text-base sm:text-lg lg:text-xl font-mono text-white group-hover:text-[#FF3B30] transition-colors flex items-center gap-2 font-medium">
               {personal.email}
               <span className="text-xs text-white/40 group-hover:text-[#FF3B30] transition-colors">📋</span>
             </span>
             <span className="font-mono text-[10px] uppercase tracking-wider text-white/50 mt-1 transition-all">
               {copied ? (
                 <span className="text-[#FF3B30] font-bold">✓ Copied to clipboard</span>
               ) : (
                 <span className="group-hover:text-white">Click to copy</span>
               )}
             </span>
           </button>
        </div>

        {/* Links */}
        <div className="md:col-span-4">
           <span className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-2.5 tracking-wider font-semibold">
             Links
           </span>
           <div className="flex flex-wrap gap-4 font-mono text-xs text-neutral-400">
             <a 
               href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} 
               target="_blank" 
               rel="noreferrer" 
               className="hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] rounded-none py-2 px-1 min-h-[40px] active:scale-95"
               data-cursor-text="LINKEDIN"
             >
               <span>LinkedIn</span>
               <span className="text-[10px] text-white/40 group-hover:text-[#FF3B30] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">↗</span>
             </a>
             <span className="text-white/20 self-center">/</span>
             <a 
               href="https://github.com/RitvikChunamari" 
               target="_blank" 
               rel="noreferrer" 
               className="hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] rounded-none py-2 px-1 min-h-[40px] active:scale-95"
               data-cursor-text="GITHUB"
             >
               <span>GitHub</span>
               <span className="text-[10px] text-white/40 group-hover:text-[#FF3B30] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">↗</span>
             </a>
             <span className="text-white/20 self-center">/</span>
             <a 
               href="./Ritvik_Chunamari_Resume.pdf" 
               download="Ritvik_Chunamari_Resume.pdf"
               target="_blank" 
               rel="noreferrer" 
               className="hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] rounded-none py-2 px-1 min-h-[40px] active:scale-95"
               data-cursor-text="RESUME"
             >
               <span>Resume PDF</span>
               <span className="text-[10px] text-white/40 group-hover:text-[#FF3B30] transition-colors">↓</span>
             </a>
           </div>
        </div>

        {/* Location & Back to Top */}
        <div className="md:col-span-3 md:text-right flex flex-col md:items-end justify-between gap-4">
           <div>
             <span className="block font-mono text-[10px] sm:text-xs uppercase text-white/40 mb-1 tracking-wider font-semibold">
               Location
             </span>
             <div className="font-mono text-xs text-white/90 tracking-wider font-medium">
               {timeStr || '10:20 PM MST'}
             </div>
             <div className="font-mono text-[10px] text-white/40 tracking-wider">
               BOULDER &amp; ARVADA, CO
             </div>
           </div>
           <MagneticWrapper strength={0.3}>
             <button 
               onClick={scrollToTop}
               className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/60 hover:text-white transition-all cursor-pointer group inline-flex items-center gap-2.5 border border-white/10 hover:border-white/40 px-4 py-2.5 min-h-[44px] rounded-none bg-white/[0.02] hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] active:scale-95"
               data-cursor-text="TOP"
             >
               <span>Return to Top</span>
               <span className="w-1.5 h-1.5 rounded-none bg-[#FF3B30] group-hover:scale-125 transition-transform"></span>
             </button>
           </MagneticWrapper>
        </div>

      </div>

      {/* Baseline System Tag */}
      <div className="mt-16 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-neutral-500 tracking-wider uppercase">
        <div>Designed &amp; built by Ritvik Chunamari · ATLAS Institute CU Boulder</div>
        <div className="mt-2 sm:mt-0">React · Three.js · Lenis · Tailwind CSS</div>
      </div>

    </footer>
  );
};

export default React.memo(Footer);
