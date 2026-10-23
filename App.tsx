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
  
  // Shared-Element Morphing Transition State
  const [morphOrigin, setMorphOrigin] = useState<{
    rect: { top: number; left: number; width: number; height: number };
    image: string;
    title: string;
    category: string;
  } | null>(null);
  const savedScrollY = useRef<number>(0);
  const morphCloneRef = useRef<HTMLDivElement>(null);
  
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
  const cursorAngle = useRef(0);

  // Setup Lenis Smooth Momentum Scroll (Standard for Awwwards portfolios)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      const onNativeScroll = () => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, (window.scrollY || window.pageYOffset) / maxScroll));
        if (progressCircleRef.current) {
          progressCircleRef.current.style.strokeDashoffset = `${circumference - progress * circumference}`;
        }
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `${Math.round(progress * 100)}%`;
        }
      };
      window.addEventListener('scroll', onNativeScroll, { passive: true });
      return () => window.removeEventListener('scroll', onNativeScroll);
    }

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

    const onScroll = (e: any) => {
      const currentScroll = e?.scroll ?? lenis.scroll;
      (window as any).__virtualScrollY = currentScroll;
      ScrollTrigger.update();

      // Direct DOM update for circular scroll progress indicator (Zero React re-render overhead)
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, currentScroll / maxScroll));
      
      if (progressCircleRef.current) {
        progressCircleRef.current.style.strokeDashoffset = `${circumference - progress * circumference}`;
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.round(progress * 100)}%`;
      }
    };

    lenis.on('scroll', onScroll);

    // Gold-standard GSAP ticker synchronization
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
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
      (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 1024 || 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

    // Disable custom cursor on touch/mobile devices to eliminate overhead and preserve native touch response
    if (isTouchOrMobile()) {
      if (cursorRef.current) cursorRef.current.style.display = 'none';
      if (cursorDotRef.current) cursorDotRef.current.style.display = 'none';
      return;
    }

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
          cursorRef.current.className = "fixed top-0 left-0 pointer-events-none z-[10000] rounded-full will-change-transform flex items-center justify-center backdrop-blur-md transition-[width,height,background-color,border-color,opacity] duration-250 ease-out px-3.5 py-1 min-h-[30px] border border-white/80 bg-[#050508]/90 shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_12px_rgba(255,255,255,0.12)]";
          cursorTextRef.current.textContent = cursorTextAttr;
          cursorTextRef.current.style.opacity = '1';
        } else if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
          hasCursorText.current = false;
          cursorRef.current.className = "fixed top-0 left-0 pointer-events-none z-[10000] rounded-full will-change-transform flex items-center justify-center backdrop-blur-[1px] transition-[width,height,background-color,border-color,opacity] duration-250 ease-out w-[50px] h-[50px] border border-white/90 bg-white/10 shadow-[0_0_16px_rgba(255,255,255,0.15)]";
          cursorTextRef.current.style.opacity = '0';
        } else {
          hasCursorText.current = false;
          cursorRef.current.className = "fixed top-0 left-0 pointer-events-none z-[10000] rounded-full will-change-transform flex items-center justify-center backdrop-blur-[1px] transition-[width,height,background-color,border-color,opacity] duration-250 ease-out w-[42px] h-[42px] border border-white/40 bg-white/[0.03]";
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

      // 2. Fluid Elastic Cursor Ring with Velocity Squash & Stretch (Jitter-free angle damping)
      const dx = mouse.current.x - cursor.current.x;
      const dy = mouse.current.y - cursor.current.y;
      
      cursor.current.x += dx * 0.18;
      cursor.current.y += dy * 0.18;

      const speed = Math.hypot(dx, dy);
      if (speed > 1.4) {
        cursorAngle.current = Math.atan2(dy, dx) * (180 / Math.PI);
      }
      const angle = cursorAngle.current;
      const clickFactor = isMouseDown.current ? 0.78 : 1.0;
      const stretch = Math.min(1.35, 1 + speed * 0.0024) * clickFactor;
      const squash = Math.max(0.75, 1 - speed * 0.0016) * clickFactor;

      if (cursorRef.current) {
        if (hasCursorText.current) {
          // Keep cursor pill upright and stable for crystal-clear readability
          cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%) rotate(0deg) scale(${clickFactor})`;
        } else {
          cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%) rotate(${angle.toFixed(1)}deg) scale(${stretch.toFixed(3)}, ${squash.toFixed(3)})`;
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

  const handleProjectClick = (project: Project, cardEl?: HTMLElement) => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    savedScrollY.current = (window as any).__virtualScrollY ?? (window.scrollY || window.pageYOffset);

    if (cardEl && !isReduced) {
      const rect = cardEl.getBoundingClientRect();
      const originData = {
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        image: project.image,
        title: project.title,
        category: project.category,
      };
      setMorphOrigin(originData);
      setIsTransitioning(true);

      // Hardware-accelerated FLIP expansion from card bounds to case hero
      requestAnimationFrame(() => {
        if (morphCloneRef.current) {
          gsap.fromTo(morphCloneRef.current,
            {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              borderRadius: '0px',
              opacity: 1,
            },
            {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight * 0.72,
              borderRadius: '0px',
              duration: 0.62,
              ease: 'expo.inOut',
              onComplete: () => {
                setActiveProject(project);
                setCurrentView('project');
                window.scrollTo(0, 0);
                const lenis = (window as any).__lenis;
                if (lenis) lenis.scrollTo(0, { immediate: true });

                gsap.to(morphCloneRef.current, {
                  opacity: 0,
                  duration: 0.28,
                  ease: 'power2.out',
                  onComplete: () => {
                    setMorphOrigin(null);
                    setIsTransitioning(false);
                    ScrollTrigger.refresh();
                  }
                });
              }
            }
          );
        }
      });
    } else {
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
      }, 400);
    }
  };

  const handleBackToHome = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('home');
      setActiveProject(null);
      const targetY = savedScrollY.current;
      window.scrollTo(0, targetY);
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(targetY, { immediate: true });
      }
      setTimeout(() => {
        setIsTransitioning(false);
        ScrollTrigger.refresh();
      }, 100);
    }, 450);
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

      {/* Shared-Element Morphing Portal (Thumbnail -> Case Hero) */}
      {morphOrigin && (
        <div 
          ref={morphCloneRef}
          className="fixed z-[9900] pointer-events-none overflow-hidden bg-[#09090e]/95 backdrop-blur-xl border border-white/20 shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex items-center justify-center will-change-transform"
          style={{
            top: morphOrigin.rect.top,
            left: morphOrigin.rect.left,
            width: morphOrigin.rect.width,
            height: morphOrigin.rect.height,
            borderRadius: '0px',
          }}
        >
          <img 
            src={morphOrigin.image} 
            alt={morphOrigin.title} 
            className="max-w-[85%] max-h-[80%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          />
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse"></span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/70 font-semibold">
              CASE STUDY · {morphOrigin.category}
            </span>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-white font-bold uppercase text-lg sm:text-2xl tracking-tight truncate max-w-[70%]">
              {morphOrigin.title}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF3B30] font-semibold">
              OPENING CASE →
            </span>
          </div>
        </div>
      )}

      {/* Page Transition Overlay (Fallback / Next Project Curtain) */}
      <div 
        className={`fixed inset-0 bg-[#050507] z-[9000] pointer-events-none transition-transform duration-600 ease-[cubic-bezier(0.85,0,0.15,1)] ${
          isTransitioning && !morphOrigin ? 'translate-y-0' : 'translate-y-full'
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
        
        {/* WCAG 2.2 AA Accessible Landmark Skip Link */}
        <a 
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100000] focus:px-4 focus:py-2 focus:bg-[#FF3B30] focus:text-white focus:font-mono focus:text-xs focus:font-bold focus:uppercase focus:tracking-widest focus:rounded-sm focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to Selected Works [Enter]
        </a>

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
          <span ref={cursorTextRef} className="text-white text-[9px] font-mono font-bold uppercase tracking-[0.22em] opacity-0 transition-opacity duration-150 select-none"></span>
        </div>

        {/* Circular Scroll Progress Indicator */}
        {currentView === 'home' && (
          <div aria-hidden="true" className="fixed bottom-8 right-8 z-[50] hidden md:block bg-[#050508]/80 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-2xl pointer-events-none">
            <svg width="48" height="48" viewBox="0 0 50 50" className="transform -rotate-90">
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
              <span ref={progressTextRef} className="text-[9px] font-mono font-bold text-white tracking-tighter">0%</span>
            </div>
          </div>
        )}

        {currentView === 'home' && <Header onNavigate={handleNavigate} />}
        
        {/* VIEW ROUTER */}
        {currentView === 'home' ? (
          <main id="main-content" className="relative w-full z-10">
            <Hero isLoaded={showContent} onNavigate={handleNavigate} />
            <ProjectList 
              projects={resumeData.projects} 
              onProjectClick={handleProjectClick} 
            />
            <About data={resumeData} />
            <Footer personal={resumeData.personal} />
          </main>
        ) : (
           <main id="main-content" className="relative w-full z-10">
             <ErrorBoundary onReset={handleBackToHome}>
               <ProjectDetail 
                  project={activeProject!} 
                  onBack={handleBackToHome} 
                  onNext={handleNextProject}
               />
             </ErrorBoundary>
           </main>
        )}
        
      </div>
    </>
  );
};

export default App;