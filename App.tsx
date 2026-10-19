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
import About from './components/About';
import Footer from './components/Footer';
import ProjectDetail from './components/ProjectDetail';
import CinematicBackground from './components/CinematicBackground';
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
          <div className="max-w-md w-full bg-neutral-900 border border-white/20 p-8 rounded-lg text-center space-y-5 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-mono font-bold text-lg border border-red-500/40">
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
                className="px-5 py-2.5 bg-white text-black font-mono text-xs uppercase font-bold rounded-full hover:bg-neutral-200 transition-colors"
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
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'project'>('home');
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

  // Physics State
  const mouse = useRef({ x: -2000, y: -2000 });
  const cursor = useRef({ x: -2000, y: -2000 });
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorFadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMouseDown = useRef(false);
  const hasCursorText = useRef(false);

  // Setup Lenis Smooth Momentum Scroll (Standard for Awwwards portfolios)
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
      // Direct DOM update for circular scroll progress indicator (Zero React re-render overhead)
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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, [currentView]);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

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
  
  useEffect(() => {
    const isTouchOrMobile = () => 
      typeof window !== 'undefined' && 
      (window.innerWidth <= 1024 || 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

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

      if (isTouchOrMobile()) {
        scheduleCursorFade(600);
      }
    };

    const handleMouseLeave = () => {
      softFadeCursor();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        cursor.current.x = t.clientX;
        cursor.current.y = t.clientY;
        mouse.current = { x: t.clientX, y: t.clientY };
        showCursor('0.85');
        scheduleCursorFade(650);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        mouse.current = { x: t.clientX, y: t.clientY };
        showCursor('0.85');
        scheduleCursorFade(450);
      }
    };

    const handleTouchEnd = () => {
      scheduleCursorFade(150);
    };

    const handleTouchCancel = () => {
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
      if (isTouchOrMobile()) {
        scheduleCursorFade(300);
      }
    };

    // Main Animation Loop for Elastic Cursor
    const animate = () => {
      // 1. Instant Precision Dot (Zero Lag)
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }

      // 2. Fluid Elastic Cursor Ring with Velocity Squash & Stretch
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
          // Keep cursor pill upright and stable for crystal-clear readability
          cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%) rotate(0deg) scale(${clickFactor})`;
        } else {
          cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${stretch}, ${squash})`;
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchCancel, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
      window.removeEventListener('mouseover', handleMouseOver);
      if (cursorFadeTimer.current) clearTimeout(cursorFadeTimer.current);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
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

    if (currentView === 'project') {
       handleBackToHome();
       setTimeout(() => {
          scrollToSection(targetId);
       }, 700);
       return;
    }

    scrollToSection(targetId);
  };

  const handleProjectClick = (project: Project) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveProject(project);
      setCurrentView('project');
      window.scrollTo(0, 0);
      const lenis = (window as any).__lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      setTimeout(() => {
        setIsTransitioning(false);
        ScrollTrigger.refresh();
      }, 100);
    }, 500);
  };

  const handleBackToHome = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('home');
      setActiveProject(null);
      window.scrollTo(0, 0);
      const lenis = (window as any).__lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      setTimeout(() => {
        setIsTransitioning(false);
        ScrollTrigger.refresh();
      }, 100);
    }, 500);
  };
  
  const handleNextProject = () => {
     if (!activeProject) return;
     setIsTransitioning(true);
     setTimeout(() => {
       const currentIndex = resumeData.projects.findIndex(p => p.title === activeProject.title);
       const nextIndex = (currentIndex + 1) % resumeData.projects.length;
       setActiveProject(resumeData.projects[nextIndex]);
       window.scrollTo(0, 0);
       const lenis = (window as any).__lenis;
       if (lenis) lenis.scrollTo(0, { immediate: true });
       setTimeout(() => {
         setIsTransitioning(false);
         ScrollTrigger.refresh();
       }, 100);
     }, 500);
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

      {/* Page Transition Overlay */}
      <div 
        className={`fixed inset-0 bg-[#050507] z-[9000] pointer-events-none transition-transform duration-600 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          isTransitioning ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ transformOrigin: 'bottom' }}
      ></div>

      {/* Persistent Global 3D WebGL Fluid Atmosphere (Across Hero, Works & Portfolio) */}
      <GlobalFluidCanvas />

      {/* Continuous Swiss Architectural Grid Columns */}
      <div className="fixed inset-0 pointer-events-none z-[8] overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 bottom-0 left-6 md:left-16 w-px bg-white/[0.04]" />
        <div className="absolute top-0 bottom-0 right-6 md:right-16 w-px bg-white/[0.04]" />
      </div>

      {/* Google Antigravity Interactive Dots Background */}
      <CinematicBackground />

      <div className={`min-h-screen text-cinema-white antialiased transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Precision Micro Dot (Zero Latency) with Soft Fade */}
        <div 
          ref={cursorDotRef}
          className="fixed top-0 left-0 pointer-events-none z-[10001] w-1.5 h-1.5 rounded-full bg-white will-change-transform shadow-[0_0_8px_rgba(255,255,255,0.9)] opacity-0 transition-opacity duration-500 ease-out"
        />

        {/* Fluid Elastic Follower Ring with Velocity Stretch and Soft Fade */}
        <div 
          ref={cursorRef}
          className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full will-change-transform flex items-center justify-center backdrop-blur-[1px] transition-[width,height,background-color,border-color,opacity] duration-500 ease-out w-[44px] h-[44px] border border-white/40 bg-white/[0.03] opacity-0"
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
            <About data={resumeData} />
            <Footer personal={resumeData.personal} />
          </div>
        ) : (
           <ErrorBoundary onReset={handleBackToHome}>
             <ProjectDetail 
                project={activeProject!} 
                onBack={handleBackToHome} 
                onNext={handleNextProject}
             />
           </ErrorBoundary>
        )}
        
      </div>
    </>
  );
};

export default App;
