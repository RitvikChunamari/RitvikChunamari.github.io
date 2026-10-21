import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { ResumeData } from '../types';
import MagneticWrapper from './MagneticWrapper';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FooterProps {
  personal: ResumeData['personal'];
}

const Footer: React.FC<FooterProps> = ({ personal }) => {
  const footerRef = useRef<HTMLElement>(null);
  const laserLineRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  // 1. Section Header Laser Line Reveal
  useLayoutEffect(() => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
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
              }
            }
          );
        }
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // 2. Lenis-Synchronized Monumental Headline Scrub Reveal
  useEffect(() => {
    let ticking = false;
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateFooter = (customY?: number) => {
      if (isReduced) {
        if (linkRef.current) {
          linkRef.current.style.transform = 'translate3d(0, 0, 0)';
          linkRef.current.style.opacity = '1';
          linkRef.current.style.letterSpacing = '-0.035em';
        }
        return;
      }

      if (!linkRef.current) return;

      const rect = linkRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Start revealing when link enters lower 95% of screen, fully revealed at 45%
      const startY = vh * 0.95;
      const endY = vh * 0.45;
      const rawProgress = (startY - rect.top) / (startY - endY);
      const progress = Math.min(1, Math.max(0, rawProgress));

      const eased = 1 - Math.pow(1 - progress, 3);
      const translateY = (1 - eased) * 100;
      const opacity = Math.min(1, eased * 1.25);
      const letterSpacing = -0.05 + progress * 0.015;

      linkRef.current.style.transform = `translate3d(0, ${translateY.toFixed(2)}%, 0)`;
      linkRef.current.style.opacity = `${opacity.toFixed(3)}`;
      linkRef.current.style.letterSpacing = `${letterSpacing.toFixed(4)}em`;
    };

    const handleNativeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateFooter();
          ticking = false;
        });
        ticking = true;
      }
    };

    const lenis = (window as any).__lenis;
    const onLenisScroll = (e: any) => {
      updateFooter(e?.scroll ?? lenis?.scroll);
    };

    if (lenis) {
      lenis.on('scroll', onLenisScroll);
    }
    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    updateFooter();

    return () => {
      if (lenis) {
        lenis.off('scroll', onLenisScroll);
      }
      window.removeEventListener('scroll', handleNativeScroll);
    };
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
      
      {/* Top Editorial Telemetry Bar */}
      <div className="border-t border-white/10 pt-8 mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
         {/* Architectural Laser Line that draws across on entry */}
         <div 
           ref={laserLineRef}
           className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-[#FF3B30] via-white/50 to-transparent origin-left scale-x-0 will-change-transform pointer-events-none" 
         />
         <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse"></span>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/70">
              06 /// FOLIO 2026 // OPEN TO OPPORTUNITIES
            </span>
         </div>
         <p className="text-xs sm:text-sm text-neutral-400 font-mono tracking-wider max-w-sm md:text-right">
           BOULDER &amp; ARVADA, COLORADO<br/>
           <span className="text-white/60">CREATIVE TECHNOLOGY &amp; DESIGN // ATLAS</span>
         </p>
      </div>

      {/* Massive Monumental Headline with Scroll Scrub */}
      <div className="group relative mb-16 md:mb-24 inline-block w-full overflow-hidden">
        <a 
          ref={linkRef}
          href={`mailto:${personal.email}`}
          className="block text-[11vw] leading-[0.8] font-extrabold uppercase tracking-[-0.04em] text-white mix-blend-exclusion hover:text-neutral-300 transition-colors duration-300 will-change-transform opacity-0"
          style={{ transform: 'translate3d(0, 100%, 0)' }}
          data-cursor-text="SAY HELLO"
        >
          Let's Talk
        </a>
      </div>

      {/* Footer Info & Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-white/10 pt-8 items-start">
        
        {/* Email & Micro Copy Interaction */}
        <div className="md:col-span-5">
           <span className="block font-mono text-[9px] uppercase text-white/60 mb-2 tracking-widest font-semibold">
             ● DIRECT INTAKE
           </span>
           <button 
             ref={copyBtnRef}
             onClick={handleCopyEmail}
             className="group flex flex-col items-start text-left cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] rounded-sm py-1 px-1.5"
             title="Click to copy email"
             data-cursor-text="COPY"
             aria-live="polite"
           >
             <span className="text-base sm:text-lg font-mono text-white group-hover:text-[#FF3B30] transition-colors flex items-center gap-2">
               {personal.email}
               <span className="text-xs text-white/60 group-hover:text-[#FF3B30]">📋</span>
             </span>
             <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 mt-1 transition-all">
               {copied ? (
                 <span className="text-[#FF3B30] font-bold">✓ COPIED TO CLIPBOARD // READY TO WRITE</span>
               ) : (
                 <span className="group-hover:text-white/70">CLICK TO COPY EMAIL ADDRESS</span>
               )}
             </span>
           </button>
        </div>

        {/* Network Portals */}
        <div className="md:col-span-4">
           <span className="block font-mono text-[9px] uppercase text-white/60 mb-2 tracking-widest font-semibold">
             ● NETWORK DIRECTORY
           </span>
           <div className="flex flex-wrap gap-4 font-mono text-xs text-neutral-400">
             <a 
               href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} 
               target="_blank" 
               rel="noreferrer" 
               className="hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] rounded-sm py-2 px-1 min-h-[40px] active:scale-95"
               data-cursor-text="OPEN"
             >
               <span>LinkedIn</span>
               <span className="text-[10px] text-white/60 group-hover:text-[#FF3B30] group-hover:translate-x-0.5 transition-all">↗</span>
             </a>
             <span className="text-white/20 self-center">/</span>
             <a 
               href="https://github.com/RitvikChunamari" 
               target="_blank" 
               rel="noreferrer" 
               className="hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] rounded-sm py-2 px-1 min-h-[40px] active:scale-95"
               data-cursor-text="OPEN"
             >
               <span>GitHub</span>
               <span className="text-[10px] text-white/60 group-hover:text-[#FF3B30] group-hover:translate-x-0.5 transition-all">↗</span>
             </a>
             <span className="text-white/20 self-center">/</span>
             <a 
               href="./Ritvik_Chunamari_Resume.pdf" 
               download="Ritvik_Chunamari_Resume.pdf"
               target="_blank" 
               rel="noreferrer" 
               className="hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] rounded-sm py-2 px-1 min-h-[40px] active:scale-95"
               data-cursor-text="RESUME"
             >
               <span>Resume PDF</span>
               <span className="text-[10px] text-white/60 group-hover:text-[#FF3B30]">↓</span>
             </a>
           </div>
        </div>

        {/* Back to Top Magnetic Anchor */}
        <div className="md:col-span-3 md:text-right">
           <MagneticWrapper strength={0.3}>
             <button 
               onClick={scrollToTop}
               className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 hover:text-white transition-all cursor-pointer group inline-flex items-center gap-2 border border-white/10 px-4 py-2.5 min-h-[44px] rounded-full hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3B30] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] active:scale-95"
               data-cursor-text="TOP"
             >
               <span>Return to Top</span>
               <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-[#FF3B30] transition-colors"></span>
             </button>
           </MagneticWrapper>
        </div>

      </div>

      {/* Baseline System Micro-Tag */}
      <div className="mt-16 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center text-[9px] font-mono text-white/30 tracking-widest uppercase">
        <div>DESIGNED WITH RIGOR &amp; VIBE CODED // RITVIK CHUNAMARI</div>
        <div className="mt-2 sm:mt-0">REACT 19 · THREE.JS · LENIS · TAILWIND</div>
      </div>

    </footer>
  );
};

export default React.memo(Footer);