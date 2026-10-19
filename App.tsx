import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

import Header from './components/Header';
import Hero from './components/Hero';
import ProjectList from './components/ProjectList';
import HumanInterfaceLab from './components/HumanInterfaceLab';
import About from './components/About';
import Footer from './components/Footer';
const ProjectDetail = React.lazy(() => import('./components/ProjectDetail'));
import GlobalFluidCanvas from './components/GlobalFluidCanvas';
import MinimalLoader from './components/MinimalLoader';
import { resumeData } from './data';
import { Project } from './types';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<any, any> {
  public state: any = { hasError: false, error: null };

  constructor(props: any) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    const { hasError, error } = (this as any).state || {};
    const { children, onReset } = (this as any).props || {};

    if (hasError) {
      return (
        <div className="min-h-screen bg-cinema-black text-white flex flex-col items-center justify-center p-6 sm:p-12 relative z-50">
          <div className="max-w-md w-full bg-[#09090E] border border-white/20 p-8 rounded-sm text-center space-y-5 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FF3B30]/20 text-[#FF3B30] flex items-center justify-center font-mono font-bold text-lg border border-[#FF3B30]/40">
              !
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-white">Something went wrong</h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-mono">
              {error?.message || "An unexpected error occurred while loading this view."}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button 
                onClick={() => {
                  (this as any).setState({ hasError: false, error: null });
                  if (onReset) onReset();
                }} 
                className="px-5 py-2.5 bg-white text-black font-mono text-xs uppercase font-bold rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Return to Index
              </button>
            </div>
          </div>
        </div>
      );
    }
    return children;
  }
}

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'home' | 'project' | '404'>('home');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  
  // Animation Refs
  const requestRef = useRef<number>();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  // SVG Circle Calculations for Progress Indicator
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  // Cursor Physics State
  const mouse = useRef({ x: -2000, y: -2000 });
  const cursor = useRef({ x: -2000, y: -2000 });
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorFadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMouseDown = useRef(false);
  const hasCursorText = useRef(false);

  // Helper: Find project by slug or normalized title
  const findProjectBySlugOrTitle = (identifier: string): Project | undefined => {
    const cleanId = identifier.toLowerCase().replace(/^#/, '').trim();
    if (!cleanId) return undefined;
    return resumeData.projects.find(p => 
      (p.slug && p.slug.toLowerCase() === cleanId) ||
      p.title.toLowerCase().replace(/\s+/g, '-') === cleanId ||
      p.title.toLowerCase() === cleanId
    );
  };

  // 1. Lenis Smooth Momentum Scroll with Strictly Managed Lifecycle
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    (window as any).__lenis = lenis;

    const onScroll = () => {
      (window as any).__virtualScrollY = lenis.scroll;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, lenis.scroll / maxScroll));
      
      if (progressCircleRef.current) {
        progressCircleRef.current.style.strokeDashoffset = `${circumference - progress * circumference}`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(progress * 100)}%`;
      }
    };

    lenis.on('scroll', onScroll);

    // Track frameId accurately on every frame to prevent orphaned loops
    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, [currentView]);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // 2. URL Hash, Deep Linking, and History popstate / hashchange sync
  useEffect(() => {
    const handleLocationChange = () => {
      const hash = window.location.hash.replace(/^#/, '').trim();

      if (!hash) {
        if (currentView !== 'home') {
          window.scrollTo(0, 0);
          const lenis = (window as any).__lenis;
          if (lenis) lenis.scrollTo(0, { immediate: true });
          setCurrentView('home');
          setActiveProject(null);
          document.title = 'Ritvik Chunamari — Product Designer & Creative Technologist';
          setTimeout(() => ScrollTrigger.refresh(), 100);
        }
        return;
      }

      // Check anchor targets
      if (['work', 'experiments', 'lab', 'about', 'profile', 'contact'].includes(hash.toLowerCase())) {
        if (currentView !== 'home') {
          setCurrentView('home');
          setActiveProject(null);
          setTimeout(() => {
            scrollToSection(hash.toLowerCase());
            ScrollTrigger.refresh();
          }, 120);
        } else {
          scrollToSection(hash.toLowerCase());
        }
        document.title = 'Ritvik Chunamari — Product Designer & Creative Technologist';
        return;
      }

      // Check project match
      const matched = findProjectBySlugOrTitle(hash);
      if (matched) {
        window.scrollTo(0, 0);
        const lenis = (window as any).__lenis;
        if (lenis) lenis.scrollTo(0, { immediate: true });
        setActiveProject(matched);
        setCurrentView('project');
        document.title = `${matched.title} — Ritvik Chunamari`;
        setTimeout(() => ScrollTrigger.refresh(), 100);
      } else {
        // Unknown hash - show clean 404 state
        window.scrollTo(0, 0);
        const lenis = (window as any).__lenis;
        if (lenis) lenis.scrollTo(0, { immediate: true });
        setCurrentView('404');
        document.title = '404 // Project Not Found — Ritvik Chunamari';
        setTimeout(() => ScrollTrigger.refresh(), 100);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Keyboard Escape key returns to work index
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentView === 'project') {
        handleBackToHome();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentView]);

  const handleLoaderComplete = () => {
    window.scrollTo(0, 0);
    const lenis = (window as any).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    
    if (progressCircleRef.current) {
      progressCircleRef.current.style.strokeDashoffset = `${circumference}`;
    }
    if (progressTextRef.current) {
      progressTextRef.current.textContent = '0%';
    }
    setIsLoaded(true);
    setShowContent(true);
  };
  
  // 3. Custom Cursor Audit: ONLY activate for desktop pointer devices with fine hover
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 1024;

    if (!isFinePointer) {
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    document.body.classList.add('custom-cursor-active');

    const showCursor = (opacity = '1') => {
      if (cursorRef.current) cursorRef.current.style.opacity = opacity;
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = opacity;
    };

    const softFadeCursor = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '0';
    };

    const scheduleCursorFade = (delay = 500) => {
      if (cursorFadeTimer.current) clearTimeout(cursorFadeTimer.current);
      cursorFadeTimer.current = setTimeout(() => {
        softFadeCursor();
      }, delay);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (cursor.current.x < -1000) {
        cursor.current.x = e.clientX;
        cursor.current.y = e.clientY;
      }
      mouse.current = { x: e.clientX, y: e.clientY };
      showCursor('1');
    };

    const handleMouseLeave = () => {
      softFadeCursor();
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorTextAttr = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
      
      if (cursorRef.current && cursorTextRef.current) {
        if (cursorTextAttr) {
          hasCursorText.current = true;
          cursorRef.current.className = "fixed top-0 left-0 pointer-events-none z-[10000] rounded-full will-change-transform flex items-center justify-center backdrop-blur-md transition-[width,height,background-color,border-color,opacity] duration-300 ease-out px-4 py-1.5 w-auto h-auto min-h-[34px] border border-white/80 bg-black/85 shadow-[0_0_20px_rgba(255,255,255,0.18)]";
          cursorTextRef.current.textContent = cursorTextAttr;
          cursorTextRef.current.style.opacity = '1';
        } else if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
          hasCursorText.current = false;
          cursorRef.current.className = "fixed top-0 left-0 pointer-events-none z-[10000] rounded-full will-change-transform flex items-center justify-center backdrop-blur-[1px] transition-[width,height,background-color,border-color,opacity] duration-300 ease-out w-[52px] h-[52px] border border-white/90 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]";
          cursorTextRef.current.style.opacity = '0';
        } else {
          hasCursorText.current = false;
          cursorRef.current.className = "fixed top-0 left-0 pointer-events-none z-[10000] rounded-full will-change-transform flex items-center justify-center backdrop-blur-[1px] transition-[width,height,background-color,border-color,opacity] duration-300 ease-out w-[44px] h-[44px] border border-white/40 bg-white/[0.03]";
          cursorTextRef.current.style.opacity = '0';
        }
      }
    };

    const handleMouseDown = () => {
      isMouseDown.current = true;
      showCursor('1');
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    // Elastic Follower Animation Loop
    let animId: number;
    const animate = () => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }

      const dx = mouse.current.x - cursor.current.x;
      const dy = mouse.current.y - cursor.current.y;
      
      cursor.current.x += dx * 0.18;
      cursor.current.y += dy * 0.18;

      const speed = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const clickFactor = isMouseDown.current ? 0.78 : 1.0;
      const stretch = Math.min(1.4, 1 + speed * 0.0028) * clickFactor;
      const squash = Math.max(0.72, 1 - speed * 0.0018) * clickFactor;

      if (cursorRef.current) {
        if (hasCursorText.current) {
          cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%) rotate(0deg) scale(${clickFactor})`;
        } else {
          cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${stretch}, ${squash})`;
        }
      }

      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    animId = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      if (cursorFadeTimer.current) clearTimeout(cursorFadeTimer.current);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [currentView]);

  const scrollToSection = (targetId: string) => {
    const lenis = (window as any).__lenis;
    if (targetId === 'home') {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const element = 
      document.getElementById(targetId) ||
      (targetId === 'lab' ? document.getElementById('experiments') : null) ||
      (targetId === 'experiments' ? document.getElementById('experiments') : null) ||
      (targetId === 'profile' ? document.getElementById('about') : null) ||
      (targetId === 'about' ? document.getElementById('profile') : null);

    if (element) {
      if (lenis) {
        lenis.scrollTo(element, { offset: -30, duration: 1.2 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNavigate = (sectionId: string) => {
    const targetId = sectionId.toLowerCase();

    if (currentView === 'project' || currentView === '404') {
       handleBackToHome();
       setTimeout(() => {
          scrollToSection(targetId);
       }, 550);
       return;
    }

    scrollToSection(targetId);
  };

  // Cinematic Project Transition Handlers
  const handleProjectClick = (project: Project) => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const projectSlug = project.slug || project.title.toLowerCase().replace(/\s+/g, '-');

    if (isReduced) {
      window.location.hash = projectSlug;
      setActiveProject(project);
      setCurrentView('project');
      window.scrollTo(0, 0);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      window.location.hash = projectSlug;
      setActiveProject(project);
      setCurrentView('project');
      window.scrollTo(0, 0);
      const lenis = (window as any).__lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      setTimeout(() => {
        setIsTransitioning(false);
        ScrollTrigger.refresh();
      }, 100);
    }, 450);
  };

  const handleBackToHome = () => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) {
      window.location.hash = 'work';
      setCurrentView('home');
      setActiveProject(null);
      window.scrollTo(0, 0);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      window.location.hash = 'work';
      setCurrentView('home');
      setActiveProject(null);
      window.scrollTo(0, 0);
      const lenis = (window as any).__lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      setTimeout(() => {
        setIsTransitioning(false);
        ScrollTrigger.refresh();
      }, 100);
    }, 450);
  };
  
  const handleNextProject = () => {
     if (!activeProject) return;
     const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
     const currentIndex = resumeData.projects.findIndex(p => p.title === activeProject.title);
     const nextIndex = (currentIndex + 1) % resumeData.projects.length;
     const nextProj = resumeData.projects[nextIndex];
     const nextSlug = nextProj.slug || nextProj.title.toLowerCase().replace(/\s+/g, '-');

     if (isReduced) {
       window.location.hash = nextSlug;
       setActiveProject(nextProj);
       window.scrollTo(0, 0);
       return;
     }

     setIsTransitioning(true);
     setTimeout(() => {
       window.location.hash = nextSlug;
       setActiveProject(nextProj);
       window.scrollTo(0, 0);
       const lenis = (window as any).__lenis;
       if (lenis) lenis.scrollTo(0, { immediate: true });
       setTimeout(() => {
         setIsTransitioning(false);
         ScrollTrigger.refresh();
       }, 100);
     }, 450);
  };

  return (
    <>
      {/* Minimal Studio Ident Preloader */}
      {!isLoaded && <MinimalLoader onComplete={handleLoaderComplete} />}
      
      {/* Global Corner Registration Marks */}
      <div className="fixed inset-0 pointer-events-none z-[8000] mix-blend-difference p-6 md:p-12 opacity-40">
         <div className="absolute top-6 left-6 w-2.5 h-2.5 border-t border-l border-white"></div>
         <div className="absolute top-6 right-6 w-2.5 h-2.5 border-t border-r border-white"></div>
         <div className="absolute bottom-6 left-6 w-2.5 h-2.5 border-b border-l border-white"></div>
         <div className="absolute bottom-6 right-6 w-2.5 h-2.5 border-b border-r border-white"></div>
      </div>

      {/* Cinematic Curtain Page Transition Overlay */}
      <div 
        className={`fixed inset-0 bg-[#050507] z-[9000] pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          isTransitioning ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ transformOrigin: 'bottom' }}
        aria-hidden="true"
      />

      {/* Single Dominant 3D WebGL Fluid Atmosphere (Across Hero, Works & Portfolio) */}
      <GlobalFluidCanvas paused={currentView !== 'home'} />

      {/* Continuous Swiss Architectural Grid Columns */}
      <div className="fixed inset-0 pointer-events-none z-[8] overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 bottom-0 left-6 md:left-16 w-px bg-white/[0.04]" />
        <div className="absolute top-0 bottom-0 right-6 md:right-16 w-px bg-white/[0.04]" />
      </div>

      <div className={`min-h-screen text-cinema-white antialiased transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Precision Micro Dot (Zero Latency) with Soft Fade */}
        <div 
          ref={cursorDotRef}
          className="fixed top-0 left-0 pointer-events-none z-[10001] w-1.5 h-1.5 rounded-full bg-white will-change-transform shadow-[0_0_8px_rgba(255,255,255,0.9)] opacity-0 transition-opacity duration-500 ease-out hidden md:block"
        />

        {/* Fluid Elastic Follower Ring with Velocity Stretch and Soft Fade */}
        <div 
          ref={cursorRef}
          className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full will-change-transform flex items-center justify-center backdrop-blur-[1px] transition-[width,height,background-color,border-color,opacity] duration-500 ease-out w-[44px] h-[44px] border border-white/40 bg-white/[0.03] opacity-0 hidden md:flex"
          style={{
             boxShadow: '0 0 25px rgba(255,255,255,0.08)'
          }}
        >
          <span ref={cursorTextRef} className="text-white text-[9px] font-mono font-bold uppercase tracking-widest opacity-0 transition-opacity duration-150"></span>
        </div>

        {/* Circular Scroll Progress Indicator */}
        {currentView === 'home' && (
          <div className="fixed bottom-8 right-8 z-[50] mix-blend-difference hidden md:block">
            <svg width="50" height="50" className="transform -rotate-90">
              <circle 
                cx="25" cy="25" r={radius} 
                fill="transparent" 
                stroke="rgba(255,255,255,0.12)" 
                strokeWidth="1.5" 
              />
              <circle 
                ref={progressCircleRef}
                cx="25" cy="25" r={radius} 
                fill="transparent" 
                stroke="#FF3B30" 
                strokeWidth="1.5" 
                strokeDasharray={circumference} 
                strokeDashoffset={circumference}
                className="transition-all duration-75 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span ref={progressTextRef} className="text-[9px] font-mono text-white/80">0%</span>
            </div>
          </div>
        )}

        {currentView === 'home' && <Header onNavigate={handleNavigate} />}
        
        {/* VIEW ROUTER */}
        {currentView === 'home' ? (
          <div className="relative w-full z-10">
            <Hero isLoaded={showContent} onNavigate={handleNavigate} />
            <ProjectList 
              projects={resumeData.projects} 
              onProjectClick={handleProjectClick} 
            />
            <HumanInterfaceLab />
            <About data={resumeData} />
            <Footer personal={resumeData.personal} />
          </div>
        ) : currentView === 'project' ? (
           <ErrorBoundary onReset={handleBackToHome}>
             <React.Suspense fallback={
               <div className="min-h-screen bg-[#050507] flex flex-col items-center justify-center p-8 space-y-4">
                 <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#FF3B30] animate-spin" />
                 <span className="font-mono text-xs uppercase tracking-widest text-white/50">INITIALIZING CASE STUDY...</span>
               </div>
             }>
               <ProjectDetail 
                  project={activeProject!} 
                  onBack={handleBackToHome} 
                  onNext={handleNextProject}
               />
             </React.Suspense>
           </ErrorBoundary>
        ) : (
          /* Elevated 404 View: Interactive Archive Radar & Coordinate Recovery */
          <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative z-20">
            <div className="max-w-2xl w-full bg-[#08080C] border border-white/10 p-8 sm:p-12 rounded-sm space-y-8 relative overflow-hidden shadow-2xl">
              {/* Decorative Corner Coordinate Crosshairs */}
              <div className="absolute top-3 left-3 font-mono text-[9px] text-white/25">LOC: [NULL]</div>
              <div className="absolute top-3 right-3 font-mono text-[9px] text-white/25">STATUS: ERR_0x404</div>

              <div className="flex items-center gap-2 font-mono text-xs text-[#FF3B30] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse"></span>
                <span>SYSTEM NOTIFICATION // ARCHIVE COORDINATE UNRESOLVED</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans">
                  Trajectory Lost
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 font-mono leading-relaxed">
                  The requested hash or path does not correspond to a registered case study in Ritvik Chunamari&apos;s active portfolio index. Select a verified trajectory below or return to the main exhibition.
                </p>
              </div>

              {/* Archive Locator Matrix */}
              <div className="space-y-3 pt-2 text-left">
                <div className="text-[10px] font-mono uppercase tracking-widest text-white/50 flex items-center justify-between border-b border-white/10 pb-2">
                  <span>Available Archive Coordinates</span>
                  <span>7 Registered Trajectories</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {resumeData.projects.map((proj, idx) => (
                    <button
                      key={proj.slug || idx}
                      data-testid={`404-link-${proj.slug || idx}`}
                      onClick={() => handleProjectClick(proj)}
                      className="group flex items-center justify-between p-3 rounded bg-white/[0.03] border border-white/10 hover:border-[#FF3B30]/60 hover:bg-white/[0.06] transition-all text-left cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider group-hover:text-[#FF3B30] transition-colors">
                          0{idx + 1} // {proj.category}
                        </div>
                        <div className="text-xs font-semibold text-white truncate group-hover:text-white transition-colors">
                          {proj.title}
                        </div>
                      </div>
                      <span className="font-mono text-xs text-white/30 group-hover:text-[#FF3B30] group-hover:translate-x-1 transition-all">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  data-testid="return-to-exhibition"
                  onClick={handleBackToHome}
                  className="w-full sm:w-auto px-6 py-3 bg-white text-black font-mono text-xs uppercase font-bold tracking-widest rounded-full hover:bg-neutral-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer text-center"
                >
                  ← Return to Exhibition
                </button>
                <span className="font-mono text-[10px] text-white/40 tracking-wider">
                  PRESS ESC OR CLICK ANY ARCHIVE ENTRY
                </span>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </>
  );
};

export default App;
