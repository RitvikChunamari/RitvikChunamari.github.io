
import React, { useEffect, useState, useRef } from 'react';
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
  const [isEdithMode, setIsEdithMode] = useState(true);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'project'>('home');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  
  // Animation Refs
  const requestRef = useRef<number>();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLSpanElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  // Virtual Scroll State
  const scrollY = useRef(0);
  const targetScrollY = useRef(0);
  const scrollVelocityRef = useRef(0);

  // SVG Circle Calculations for Progress Indicator
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  // Physics State
  const mouse = useRef({ x: -2000, y: -2000, prevX: -2000, prevY: -2000 });
  const cursor = useRef({ x: -2000, y: -2000 });
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorFadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMouseDown = useRef(false);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    scrollY.current = 0;
    targetScrollY.current = 0;
  }, []);

  const handleLoaderComplete = () => {
    window.scrollTo(0, 0);
    scrollY.current = 0;
    targetScrollY.current = 0;
    if (scrollRef.current) {
      scrollRef.current.style.transform = 'translate3d(0, 0px, 0)';
    }
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
        // On mobile & tablet screen, fade once it is moved
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
        // Once moved or dragged, initiate soft fade
        scheduleCursorFade(450);
      }
    };

    const handleTouchEnd = () => {
      // Soft fade as soon as touch ends
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
          // Focused targeting ring with custom label
          cursorRef.current.className = "fixed top-0 left-0 pointer-events-none z-[10000] rounded-full will-change-transform flex items-center justify-center backdrop-blur-[2px] transition-[width,height,background-color,border-color,opacity] duration-500 ease-out w-[68px] h-[68px] border border-white bg-black/60";
          cursorTextRef.current.textContent = cursorTextAttr;
          cursorTextRef.current.style.opacity = '1';
        } else if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
          // Hover link / button state: crisp targeting reticle
          cursorRef.current.className = "fixed top-0 left-0 pointer-events-none z-[10000] rounded-full will-change-transform flex items-center justify-center backdrop-blur-[1px] transition-[width,height,background-color,border-color,opacity] duration-500 ease-out w-[52px] h-[52px] border border-white/90 bg-white/10";
          cursorTextRef.current.style.opacity = '0';
        } else {
          // Default Sleek Ring
          cursorRef.current.className = "fixed top-0 left-0 pointer-events-none z-[10000] rounded-full will-change-transform flex items-center justify-center backdrop-blur-[1px] transition-[width,height,background-color,border-color,opacity] duration-500 ease-out w-[44px] h-[44px] border border-white/40 bg-white/[0.03]";
          cursorTextRef.current.style.opacity = '0';
        }
      }
    };

    // Virtual Scroll Setup
    const handleScroll = () => {
      if (currentView === 'home') {
        targetScrollY.current = window.scrollY;
      }
    };

    // Resize Observer for Body Height
    const resizeObserver = new ResizeObserver((entries) => {
      if (currentView === 'home') {
        for (let entry of entries) {
          const height = Math.round(entry.contentRect.height);
          if (document.body.style.height !== `${height}px`) {
            document.body.style.height = `${height}px`;
          }
        }
      }
    });
    if (scrollRef.current) resizeObserver.observe(scrollRef.current);

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

    // Main Animation Loop (60-120fps)
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
        cursorRef.current.style.transform = `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${stretch}, ${squash})`;
      }

      // 3. Virtual Scroll (Liquid Smooth Glide) - Only active in Home view
      if (currentView === 'home') {
        const diff = targetScrollY.current - scrollY.current;
        const isTouch = isTouchOrMobile();
        
        if (isTouch) {
          // Instant 1:1 sync on mobile / touch devices for native responsiveness
          scrollY.current = targetScrollY.current;
        } else {
          // Liquid smooth damping on desktop wheel / trackpad
          if (Math.abs(diff) < 0.08) {
            scrollY.current = targetScrollY.current;
          } else {
            scrollY.current += diff * 0.095;
          }
        }
        scrollVelocityRef.current = diff;
        
        const roundedY = Math.round(scrollY.current * 100) / 100;
        if (scrollRef.current) {
          scrollRef.current.style.transform = `translate3d(0, -${roundedY}px, 0)`;
        }

        // Direct DOM update for circular scroll progress indicator (Zero React re-render overhead)
        const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, scrollY.current / docHeight));
        if (progressCircleRef.current) {
          progressCircleRef.current.style.strokeDashoffset = `${circumference - progress * circumference}`;
        }
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `${Math.round(progress * 100)}%`;
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
    window.addEventListener('scroll', handleScroll, { passive: true });
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
      window.removeEventListener('scroll', handleScroll);
      if (cursorFadeTimer.current) clearTimeout(cursorFadeTimer.current);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      resizeObserver.disconnect();
    };
  }, [currentView]);

  const scrollToSection = (targetId: string) => {
    if (targetId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    // Support both 'profile' and 'about' interchangeably
    const element = 
      document.getElementById(targetId) ||
      (targetId === 'profile' ? document.getElementById('about') : null) ||
      (targetId === 'about' ? document.getElementById('profile') : null);

    if (element) {
      // Calculate true offset within the scrollRef container
      let top = 0;
      let curr: HTMLElement | null = element;
      while (curr && curr !== scrollRef.current && curr !== document.body) {
        top += curr.offsetTop;
        curr = curr.offsetParent as HTMLElement;
      }

      // If offsetTop loop returned 0, fallback to clientRect
      if (top === 0) {
        top = element.getBoundingClientRect().top + scrollY.current;
      }

      // For contact or bottom sections, scroll to maxScroll
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const finalTop = targetId === 'contact' ? maxScroll : Math.min(top, maxScroll);

      window.scrollTo({
        top: finalTop,
        behavior: 'smooth'
      });
    }
  };

  const handleNavigate = (sectionId: string) => {
    const targetId = sectionId.toLowerCase();

    if (currentView === 'project') {
       handleBackToHome();
       setTimeout(() => {
          scrollToSection(targetId);
       }, 850);
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
      document.body.style.height = 'auto'; // Reset virtual scroll height
      
      // Reset Virtual Scroll Props
      scrollY.current = 0;
      targetScrollY.current = 0;
      if (scrollRef.current) {
         scrollRef.current.style.transform = `translate3d(0, 0, 0)`;
      }
      setTimeout(() => setIsTransitioning(false), 100);
    }, 800);
  };

  const handleBackToHome = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('home');
      setActiveProject(null);
      window.scrollTo(0, 0);
      setTimeout(() => setIsTransitioning(false), 100);
    }, 800);
  };
  
  const handleNextProject = () => {
     if (!activeProject) return;
     setIsTransitioning(true);
     setTimeout(() => {
       const currentIndex = resumeData.projects.findIndex(p => p.title === activeProject.title);
       const nextIndex = (currentIndex + 1) % resumeData.projects.length;
       setActiveProject(resumeData.projects[nextIndex]);
       window.scrollTo(0, 0);
       setTimeout(() => setIsTransitioning(false), 100);
     }, 800);
  };

  return (
    <>
      {/* Minimal Studio Ident Preloader */}
      {!isLoaded && <MinimalLoader onComplete={handleLoaderComplete} />}
      
      {/* Global Corner Registration Marks */}
      <div className="fixed inset-0 pointer-events-none z-[8000] mix-blend-difference p-6 md:p-12 opacity-50">
         <div className="absolute top-6 left-6 w-2 h-2 border-t border-l border-white"></div>
         <div className="absolute top-6 right-6 w-2 h-2 border-t border-r border-white"></div>
         <div className="absolute bottom-6 left-6 w-2 h-2 border-b border-l border-white"></div>
         <div className="absolute bottom-6 right-6 w-2 h-2 border-b border-r border-white"></div>
      </div>

      {/* Page Transition Overlay */}
      <div 
        className={`fixed inset-0 bg-black z-[9000] pointer-events-none transition-transform duration-700 ease-expo ${
          isTransitioning ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ transformOrigin: 'bottom' }}
      ></div>

      {/* Film Grain */}
      <div className="fixed inset-0 pointer-events-none z-[8600] opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      {/* Persistent Global 3D WebGL Fluid Atmosphere (Across Hero, Works & Portfolio) */}
      <GlobalFluidCanvas />

      {/* Continuous Swiss Architectural Grid Columns */}
      <div className="fixed inset-0 pointer-events-none z-[8] overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 bottom-0 left-6 md:left-16 w-px bg-white/[0.04]" />
        <div className="absolute top-0 bottom-0 right-6 md:right-16 w-px bg-white/[0.04]" />
      </div>

      {/* Google Antigravity Interactive Dots Background (Global across whole website) */}
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

        {/* Circular Scroll Progress Indicator (Zero React Re-renders) */}
        {currentView === 'home' && (
          <div className="fixed bottom-8 right-8 z-[50] mix-blend-difference hidden md:block">
            <svg width="50" height="50" className="transform -rotate-90">
              <circle 
                cx="25" cy="25" r={radius} 
                fill="transparent" 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="2" 
              />
              <circle 
                ref={progressCircleRef}
                cx="25" cy="25" r={radius} 
                fill="transparent" 
                stroke="white" 
                strokeWidth="2" 
                strokeDasharray={circumference} 
                strokeDashoffset={circumference}
                className="transition-all duration-75 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span ref={progressTextRef} className="text-[8px] font-mono text-white">0%</span>
            </div>
          </div>
        )}

        {currentView === 'home' && <Header onNavigate={handleNavigate} />}
        
        {/* VIEW ROUTER */}
        {currentView === 'home' ? (
          <div 
             ref={scrollRef} 
             className="fixed top-0 left-0 w-full z-10 origin-center will-change-transform"
             style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
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
