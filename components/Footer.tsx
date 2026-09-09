import React, { useEffect, useRef } from 'react';
import { ResumeData } from '../types';

interface FooterProps {
  personal: ResumeData['personal'];
}

const Footer: React.FC<FooterProps> = ({ personal }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('translate-y-0', 'opacity-100');
            entry.target.classList.remove('translate-y-full', 'opacity-0');
          }
        });
      },
      { threshold: 0.5 }
    );

    if (linkRef.current) observer.observe(linkRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="text-cinema-white px-6 md:px-12 pt-20 md:pt-24 pb-12 relative z-30 -mt-2">
      
      <div className="border-t border-white/20 pt-8 mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse"></span>
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-cinema-white/70">
              Folio 2026 // Available for Opportunities
            </span>
         </div>
         <p className="text-sm md:text-base max-w-xs md:text-right text-cinema-gray">
           Based in Arvada, CO.<br/>
           Creating intuitive solutions for complex problems.
         </p>
      </div>

      {/* Massive Link with Reveal */}
      <div className="group relative mb-16 md:mb-20 inline-block w-full overflow-hidden">
        <a 
          ref={linkRef}
          href={`mailto:${personal.email}`}
          className="block text-[11vw] leading-[0.8] font-bold uppercase tracking-tighter text-white mix-blend-exclusion hover:opacity-50 transition-all duration-1000 ease-out transform translate-y-full opacity-0 will-change-transform"
          data-cursor-text="SAY HELLO"
        >
          Let's Talk
        </a>
      </div>

      {/* Footer Info Grid - The Single Official Contact Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-8 items-start">
        
        <div className="md:col-span-2">
           <span className="block font-mono text-[10px] uppercase text-cinema-gray mb-3 tracking-widest">● Contact</span>
           <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10">
             <div>
               <span className="block font-mono text-[9px] uppercase text-neutral-500 tracking-wider mb-1">Email</span>
               <a href={`mailto:${personal.email}`} className="text-sm sm:text-base hover:text-white text-neutral-300 transition-colors font-mono">
                 {personal.email}
               </a>
             </div>
             <div>
               <span className="block font-mono text-[9px] uppercase text-neutral-500 tracking-wider mb-1">LinkedIn</span>
               <a 
                 href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} 
                 target="_blank" 
                 rel="noreferrer" 
                 className="text-xs sm:text-sm sm:text-base hover:text-white text-neutral-300 transition-colors font-mono break-all"
               >
                 {personal.linkedin}
               </a>
             </div>
           </div>
        </div>

        <div className="md:text-right">
           <button 
             onClick={scrollToTop}
             className="text-[10px] font-mono uppercase text-cinema-gray hover:text-white transition-colors tracking-widest cursor-pointer group inline-flex items-center gap-2"
           >
             <span>Back to Top</span>
             <span className="group-hover:-translate-y-0.5 transition-transform">↑</span>
           </button>
        </div>

      </div>

    </footer>
  );
};

export default React.memo(Footer);