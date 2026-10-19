import React, { useEffect, useRef, useState } from 'react';
import { ResumeData } from '../types';
import MagneticWrapper from './MagneticWrapper';

interface FooterProps {
  personal: ResumeData['personal'];
}

const Footer: React.FC<FooterProps> = ({ personal }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let ticking = false;
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateFooter = () => {
      if (isReduced) {
        if (linkRef.current) {
          linkRef.current.style.transform = 'translate3d(0, 0, 0)';
          linkRef.current.style.opacity = '1';
        }
        ticking = false;
        return;
      }

      if (!linkRef.current) {
        ticking = false;
        return;
      }

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

      linkRef.current.style.transform = `translate3d(0, ${translateY.toFixed(2)}%, 0)`;
      linkRef.current.style.opacity = `${opacity.toFixed(3)}`;

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateFooter);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    requestAnimationFrame(updateFooter);

    return () => {
      window.removeEventListener('scroll', handleScroll);
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
    <footer id="contact" className="text-cinema-white px-6 md:px-12 pt-24 md:pt-32 pb-16 relative z-30 select-none">
      
      {/* Top Editorial Telemetry Bar */}
      <div className="border-t border-white/10 pt-8 mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse"></span>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/70">
              06 /// FOLIO 2026 // OPEN TO OPPORTUNITIES
            </span>
         </div>
         <p className="text-xs sm:text-sm text-neutral-400 font-mono tracking-wider max-w-sm md:text-right">
           BOULDER &amp; ARVADA, COLORADO<br/>
           <span className="text-white/40">CREATIVE TECHNOLOGY &amp; DESIGN // ATLAS</span>
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
           <span className="block font-mono text-[9px] uppercase text-white/40 mb-2 tracking-widest font-semibold">
             ● DIRECT INTAKE
           </span>
           <button 
             onClick={handleCopyEmail}
             className="group flex flex-col items-start text-left cursor-pointer transition-all"
             title="Click to copy email"
             data-cursor-text="COPY"
           >
             <span className="text-base sm:text-lg font-mono text-white group-hover:text-[#FF3B30] transition-colors flex items-center gap-2">
               {personal.email}
               <span className="text-xs text-white/40 group-hover:text-[#FF3B30]">📋</span>
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
           <span className="block font-mono text-[9px] uppercase text-white/40 mb-2 tracking-widest font-semibold">
             ● NETWORK DIRECTORY
           </span>
           <div className="flex flex-wrap gap-4 font-mono text-xs text-neutral-400">
             <a 
               href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} 
               target="_blank" 
               rel="noreferrer" 
               className="hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1 group"
               data-cursor-text="OPEN"
             >
               <span>LinkedIn</span>
               <span className="text-[10px] text-white/40 group-hover:text-[#FF3B30] group-hover:translate-x-0.5 transition-all">↗</span>
             </a>
             <span className="text-white/20">/</span>
             <a 
               href="https://github.com/RitvikChunamari" 
               target="_blank" 
               rel="noreferrer" 
               className="hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1 group"
               data-cursor-text="OPEN"
             >
               <span>GitHub</span>
               <span className="text-[10px] text-white/40 group-hover:text-[#FF3B30] group-hover:translate-x-0.5 transition-all">↗</span>
             </a>
             <span className="text-white/20">/</span>
             <a 
               href="./Ritvik_Chunamari_Resume.pdf" 
               download="Ritvik_Chunamari_Resume.pdf"
               target="_blank" 
               rel="noreferrer" 
               className="hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1 group"
               data-cursor-text="RESUME"
             >
               <span>Resume PDF</span>
               <span className="text-[10px] text-white/40 group-hover:text-[#FF3B30]">↓</span>
             </a>
           </div>
        </div>

        {/* Back to Top Magnetic Anchor */}
        <div className="md:col-span-3 md:text-right">
           <MagneticWrapper strength={0.3}>
             <button 
               onClick={scrollToTop}
               className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 hover:text-white transition-all cursor-pointer group inline-flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full hover:border-white/40"
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