import React, { useState, useEffect } from 'react';
import { FigmaPageTab } from '../types';

interface FigmaViewerWindowProps {
  embedUrl: string;
  directUrl: string;
  title?: string;
  fileName?: string;
  nodeId?: string;
  pages?: FigmaPageTab[];
  activePageIndex?: number;
  onPageChange?: (index: number) => void;
}

const FigmaViewerWindow: React.FC<FigmaViewerWindowProps> = ({
  embedUrl,
  directUrl,
  title = "Interactive Figma Prototype",
  fileName = "Nexus-AI.fig",
  nodeId = "22-113",
  pages,
  activePageIndex,
  onPageChange,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [activeTab, setActiveTab] = useState(activePageIndex ?? 0);

  useEffect(() => {
    if (activePageIndex !== undefined && activePageIndex !== activeTab) {
      setActiveTab(activePageIndex);
      setIsLoading(true);
    }
  }, [activePageIndex]);

  // Handle ESC to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleTabClick = (idx: number) => {
    setActiveTab(idx);
    setIsLoading(true);
    onPageChange?.(idx);
  };

  const currentPage = pages && pages[activeTab] ? pages[activeTab] : null;
  const currentEmbedUrl = currentPage ? currentPage.embedUrl : embedUrl;
  const currentDirectUrl = currentPage ? currentPage.directUrl : directUrl;
  const currentNodeId = currentPage ? (currentPage.nodeId || nodeId) : nodeId;
  const currentFileName = fileName;

  return (
    <>
      {/* Background backdrop blur when in Fullscreen */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99998] transition-opacity duration-300"
          onClick={() => setIsFullscreen(false)}
        />
      )}

      {/* Main Window Container */}
      <div 
        className={`transition-all duration-300 ease-out flex flex-col ${
          isFullscreen
            ? 'fixed inset-2 sm:inset-6 md:inset-10 z-[99999] rounded-xl overflow-hidden border border-white/20 bg-[#09090e] shadow-[0_30px_100px_rgba(0,0,0,0.95)]'
            : 'w-full rounded-xl overflow-hidden border border-white/15 bg-[#09090e] shadow-[0_25px_80px_rgba(0,0,0,0.85)]'
        }`}
      >
        {/* Window Chrome Title Bar */}
        <div className="h-11 bg-[#12121a] border-b border-white/10 px-3.5 sm:px-4 flex items-center justify-between select-none z-20">
          
          {/* Left: macOS Traffic Lights */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isFullscreen) setIsFullscreen(false);
                else toggleCollapse();
              }}
              title={isFullscreen ? "Exit Fullscreen" : "Minimize"}
              className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition-opacity flex items-center justify-center group cursor-pointer"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black/80 font-bold leading-none">
                ×
              </span>
            </button>
            <button
              onClick={toggleCollapse}
              title="Minimize / Expand Window"
              className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 transition-opacity flex items-center justify-center group cursor-pointer"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black/80 font-bold leading-none">
                –
              </span>
            </button>
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Restore Window" : "Fullscreen View"}
              className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 transition-opacity flex items-center justify-center group cursor-pointer"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[7px] text-black/80 font-bold leading-none">
                {isFullscreen ? '⤦' : '⤢'}
              </span>
            </button>
          </div>

          {/* Center: File Title & Figma Identity */}
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] px-3 py-1 rounded-full max-w-[50%] sm:max-w-[60%]">
            {/* Figma Icon */}
            <svg width="12" height="18" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
              <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
              <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
              <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
              <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
            </svg>
            <span className="font-mono text-[10px] sm:text-xs text-white/90 truncate font-medium">
              {currentFileName}
            </span>
            <span className="hidden sm:inline-block font-mono text-[9px] text-white/40 border-l border-white/10 pl-2">
              Page: {currentNodeId}
            </span>
          </div>

          {/* Right: Window Controls */}
          <div className="flex items-center gap-2">
            {/* Live Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE FIGMA</span>
            </div>

            {/* Reload Canvas */}
            <button
              onClick={handleReload}
              title="Reload Figma Canvas"
              className="w-7 h-7 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M8 16H3v5"/>
              </svg>
            </button>

            {/* Fullscreen Expand/Contract Button */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "Expand to Fullscreen"}
              className="w-7 h-7 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
              )}
            </button>

            {/* Direct Open in Figma Link */}
            <a
              href={currentDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open active page on Figma.com"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white hover:text-black text-white font-mono text-[10px] tracking-wider uppercase transition-all duration-200"
              data-cursor-text="FIGMA"
            >
              <span className="hidden sm:inline">Open</span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
              </svg>
            </a>
          </div>

        </div>

        {/* Multi-Page Tab Bar (when file has multiple pages) */}
        {!isCollapsed && pages && pages.length > 1 && (
          <div className="h-10 bg-[#0f0f17] border-b border-white/10 px-3.5 sm:px-4 flex items-center justify-between gap-2 select-none z-10 overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 mr-1 shrink-0 flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Figma Pages:
              </span>
              {pages.map((p, pIdx) => {
                const isActive = activeTab === pIdx;
                return (
                  <button
                    key={pIdx}
                    onClick={() => handleTabClick(pIdx)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#0055FF] text-white font-bold shadow-[0_0_15px_rgba(0,85,255,0.4)]'
                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-neutral-500'}`}></span>
                    <span>{p.name}</span>
                    {p.nodeId && (
                      <span className={`text-[9px] font-normal opacity-70 px-1.5 py-0.5 rounded ${isActive ? 'bg-black/25' : 'bg-white/5'}`}>
                        {p.nodeId}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <span className="text-[10px] font-mono text-neutral-400 hidden md:inline shrink-0">
              Active View: <strong className="text-white">{pages[activeTab]?.name}</strong>
            </span>
          </div>
        )}

        {/* Iframe Viewport Container (Collapsible) */}
        {!isCollapsed && (
          <div 
            className={`w-full relative bg-[#1e1e1e] overflow-hidden ${
              isFullscreen ? 'flex-1' : 'h-[620px] sm:h-[720px] lg:h-[840px]'
            }`}
          >
            {/* Loading Shimmer State */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#18181f] text-white">
                <div className="relative mb-4">
                  <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-[#0055FF] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#0055FF]"></span>
                  </div>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-white/70">
                  Connecting to Figma Prototype Canvas...
                </p>
                <span className="font-mono text-[10px] text-white/40 mt-1">
                  File: {currentFileName} • Node: {currentNodeId}
                </span>
              </div>
            )}

            {/* Embedded Figma Canvas */}
            <iframe
              key={`${iframeKey}-${activeTab}`}
              src={currentEmbedUrl}
              title={title}
              className="w-full h-full border-0 block will-change-transform"
              allowFullScreen
              loading="lazy"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        )}

        {/* Bottom Editorial Telemetry Bar */}
        {!isCollapsed && (
          <div className="h-8 bg-[#0c0c12] border-t border-white/10 px-4 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-white/45 select-none z-20">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF]"></span>
              <span className="uppercase tracking-wider">FIGMA EMBED // NODE: {currentNodeId}</span>
            </div>

            <div className="hidden md:flex items-center gap-3 tracking-widest uppercase text-white/35">
              <span>DRAG TO PAN</span>
              <span>•</span>
              <span>PINCH / SCROLL TO ZOOM</span>
              <span>•</span>
              <span>CLICK FRAMES TO INSPECT</span>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={currentDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors underline-offset-2 hover:underline"
              >
                OPEN EXTERNAL ↗
              </a>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default FigmaViewerWindow;
