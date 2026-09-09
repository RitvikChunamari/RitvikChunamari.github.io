import React, { useState, useEffect, useRef } from 'react';
import { Monument, MonumentType } from './Monuments';
import { OlympicRings } from './OlympicRings';

let uiAudioCtx: AudioContext | null = null;
const playUISound = (type: 'monument' | 'layout' | 'effect') => {
  try {
    if (!uiAudioCtx) {
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextCtor) return;
      uiAudioCtx = new AudioContextCtor();
    }
    
    if (uiAudioCtx.state === 'suspended') {
      uiAudioCtx.resume();
    }
    
    const osc = uiAudioCtx.createOscillator();
    const gainNode = uiAudioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(uiAudioCtx.destination);
    
    const now = uiAudioCtx.currentTime;
    
    if (type === 'monument') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'layout') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      
      const filter = uiAudioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
      
      osc.disconnect();
      osc.connect(filter);
      filter.connect(gainNode);
      
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'effect') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.2);
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (e) {
    console.warn('UI Audio playback failed', e);
  }
};

const COLORS = [
  { name: 'Saffron', value: '#FF9933' },
  { name: 'Pure White', value: '#FFFFFF' },
  { name: 'India Green', value: '#128807' },
  { name: 'Navy Blue', value: '#000080' },
  { name: 'Deep Black', value: '#0A0A0A' },
  { name: 'Holi Magenta', value: '#FF007F' },
  { name: 'Holi Cyan', value: '#00E5FF' },
  { name: 'Holi Yellow', value: '#FFEA00' },
];

const GRADIENTS = [
  { id: 'sunset', name: 'Sunset', colors: ['#FF9933', '#FF5E62'] },
  { id: 'ocean', name: 'Ocean', colors: ['#000080', '#00E5FF'] },
  { id: 'india', name: 'India', colors: ['#FF9933', '#FFFFFF', '#128807'] },
  { id: 'holi', name: 'Holi', colors: ['#FF007F', '#FFEA00', '#00E5FF'] },
  { id: 'gold', name: 'Gold', colors: ['#BF953F', '#FCF6BA', '#B38728', '#FBF5B7', '#AA771C'] },
  { id: 'silver', name: 'Silver', colors: ['#8A8D91', '#E3E5E8', '#979A9E', '#F2F3F5', '#75787B'] },
  { id: 'bronze', name: 'Bronze', colors: ['#804A00', '#E3A857', '#995900', '#FCDA9C', '#663B00'] },
  { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#FCEE0A', '#FF003C', '#00E5FF'] },
  { id: 'neon', name: 'Neon', colors: ['#FF00FF', '#00FFFF', '#00FF00'] },
  { id: 'vibrant-purple', name: 'Vibrant Purple', colors: ['#7928CA', '#FF0080'] },
  { id: 'vibrant-orange', name: 'Vibrant Orange', colors: ['#FF4D4D', '#F9CB28'] },
];

const FONTS = [
  { id: 'samarkan', name: 'Samarkan', family: '"Samarkan", "Yatra One", cursive' },
  { id: 'playfair', name: 'Playfair Display', family: '"Playfair Display", serif' },
  { id: 'montserrat', name: 'Montserrat', family: '"Montserrat", sans-serif' },
  { id: 'bebas', name: 'Bebas Neue', family: '"Bebas Neue", sans-serif' },
  { id: 'cinzel', name: 'Cinzel', family: '"Cinzel", serif' },
  { id: 'oswald', name: 'Oswald', family: '"Oswald", sans-serif' },
  { id: 'space', name: 'Space Grotesk', family: '"Space Grotesk", sans-serif' },
  { id: 'inter', name: 'Inter', family: '"Inter", sans-serif' },
] as const;

const FONT_PAIRINGS = [
  { name: 'Heritage', primary: 'samarkan', secondary: 'inter' },
  { name: 'Editorial', primary: 'playfair', secondary: 'montserrat' },
  { name: 'Modern', primary: 'montserrat', secondary: 'space' },
  { name: 'Athletic', primary: 'bebas', secondary: 'oswald' },
  { name: 'Classic', primary: 'cinzel', secondary: 'inter' },
  { name: 'Tech', primary: 'space', secondary: 'inter' },
];

const LAYOUTS = [
  'stacked', 'inline', 'minimal', 'brutalist', 'badge', 'editorial', 'corporate', 'monument-only',
  'official-vertical', 'official-horizontal', 'official-partner'
] as const;
type LayoutType = typeof LAYOUTS[number];

const THEMES = ['dark', 'light', 'holi'] as const;
type ThemeType = typeof THEMES[number];

const ANIMATIONS = ['none', 'reveal', 'assemble', 'stamp', 'fluid', 'paint'] as const;
type AnimationType = typeof ANIMATIONS[number];

export default function MumbaiLogoGenerator() {
  const [monument, setMonument] = useState<MonumentType>('gateway');
  const [font, setFont] = useState<string>('samarkan');
  const [secondaryFont, setSecondaryFont] = useState<string>('inter');
  const [color, setColor] = useState<string>('#FF9933');
  const [gradient, setGradient] = useState<string | null>('sunset');
  const [customGradientColors, setCustomGradientColors] = useState<string[]>(['#FF9933', '#FF5E62']);
  const [fillMonument, setFillMonument] = useState<boolean>(true);
  const [gradientFont, setGradientFont] = useState<boolean>(false);
  const [monumentEffect, setMonumentEffect] = useState<'none' | 'crystal'>('none');
  const [fontSizeScale, setFontSizeScale] = useState<number>(1);
  const [lineSpaceScale, setLineSpaceScale] = useState<number>(1);
  const [showOlympicsText, setShowOlympicsText] = useState<boolean>(true);
  const [textEffect, setTextEffect] = useState<'none' | 'outline' | 'shadow' | 'glow'>('none');
  const [layout, setLayout] = useState<LayoutType>('stacked');
  const [animation, setAnimation] = useState<AnimationType>('none');
  const [musicEnabled, setMusicEnabled] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<{type: 'error' | 'info' | 'success', text: string} | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    
    if (musicEnabled) {
      audioRef.current.play().catch(e => console.log('Audio playback prevented by browser:', e));
    } else {
      audioRef.current.pause();
    }
  }, [musicEnabled]);

  const cycleTheme = () => {
    const currentIndex = THEMES.indexOf(theme);
    setTheme(THEMES[(currentIndex + 1) % THEMES.length]);
  };

  // High-fidelity native export without external library dependencies
  const handleExport = async (format: 'png' | 'jpeg' | 'svg' | 'transparent-png') => {
    if (!previewRef.current) return;
    setIsExporting(true);
    setExportMessage({ type: 'info', text: `Packaging ${format.toUpperCase()} asset...` });

    try {
      const element = previewRef.current;
      const clone = element.cloneNode(true) as HTMLElement;

      // Handle SVG direct serialization
      if (format === 'svg') {
        const svgElement = clone.querySelector('svg');
        const serialized = new XMLSerializer().serializeToString(svgElement || clone);
        const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `mumbai-2028-logo-${layout}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setExportMessage({ type: 'success', text: 'Vector SVG downloaded!' });
        setTimeout(() => setExportMessage(null), 3500);
        return;
      }

      // Handle PNG / JPEG using SVG ForeignObject canvas rendering
      const width = element.offsetWidth || 500;
      const height = element.offsetHeight || 500;
      const scale = 2; // High-DPI 2x Retina

      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not create canvas context");

      ctx.scale(scale, scale);

      // Background
      if (format === 'transparent-png') {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = theme === 'dark' ? '#0A0A0A' : theme === 'holi' ? '#FFF0F5' : '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      // Convert inner HTML to XML-compliant ForeignObject
      const htmlContent = element.innerHTML;
      const svgDoc = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width:${width}px;height:${height}px;display:flex;align-items:center;justify-content:center;">
              ${htmlContent}
            </div>
          </foreignObject>
        </svg>
      `;

      const img = new Image();
      const svgBlob = new Blob([svgDoc], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
          const dataUrl = canvas.toDataURL(mimeType, 0.95);

          const a = document.createElement('a');
          a.download = `mumbai-2028-logo-${layout}.${format === 'transparent-png' ? 'png' : format === 'jpeg' ? 'jpg' : 'png'}`;
          a.href = dataUrl;
          a.click();

          setIsExporting(false);
          setExportMessage({ type: 'success', text: `Downloaded ${a.download} successfully!` });
          setTimeout(() => setExportMessage(null), 3500);
        } catch (err: any) {
          // Fallback if cross-origin font/image blocks canvas
          const a = document.createElement('a');
          a.download = `mumbai-2028-logo-${layout}.svg`;
          a.href = url;
          a.click();
          setIsExporting(false);
          setExportMessage({ type: 'info', text: 'Downloaded vector SVG (Direct Canvas rasterization restricted by local browser policy)' });
          setTimeout(() => setExportMessage(null), 4000);
        }
      };

      img.onerror = () => {
        // Direct SVG fallback
        const a = document.createElement('a');
        a.download = `mumbai-2028-logo-${layout}.svg`;
        a.href = url;
        a.click();
        setIsExporting(false);
        setExportMessage({ type: 'info', text: 'Exported as crisp vector SVG.' });
        setTimeout(() => setExportMessage(null), 3500);
      };

      img.src = url;
    } catch (err: any) {
      console.error('Export error:', err);
      setIsExporting(false);
      setExportMessage({ type: 'error', text: 'Export failed: ' + (err.message || 'Unknown error') });
    }
  };

  // Theme-specific CSS styles
  const themeBg = theme === 'dark' ? '#0A0A0A' : theme === 'holi' ? '#FFF0F5' : '#F5F5F4';
  const themeSurface = theme === 'dark' ? '#141414' : theme === 'holi' ? '#FFFFFF' : '#FFFFFF';
  const themeInk = theme === 'dark' ? '#FFFFFF' : theme === 'holi' ? '#4A0E4E' : '#0A0A0A';
  const themeInkDim = theme === 'dark' ? '#888888' : theme === 'holi' ? '#FF1493' : '#666666';
  const themeBorder = theme === 'dark' ? '#222222' : theme === 'holi' ? '#FFD700' : '#E5E5E5';
  const themeAccent = theme === 'dark' ? '#FF9933' : theme === 'holi' ? '#FF007F' : '#FF9933';

  return (
    <div 
      className={`w-full rounded-lg border transition-all duration-300 overflow-hidden shadow-2xl relative ${
        isFullscreen ? 'fixed inset-0 z-[9999] rounded-none m-0' : 'my-12'
      }`}
      style={{
        backgroundColor: themeBg,
        borderColor: themeBorder,
        color: themeInk,
      }}
    >
      {/* Window Title Bar */}
      <div 
        className="px-4 sm:px-6 py-3 border-b flex items-center justify-between text-xs font-mono select-none"
        style={{ backgroundColor: themeSurface, borderColor: themeBorder }}
      >
        <div className="flex items-center gap-3">
          {/* macOS Style Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block"></span>
            <span 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block cursor-pointer hover:opacity-80 transition-opacity" 
              title="Toggle Fullscreen Window"
            ></span>
          </div>
          <span className="font-bold tracking-wider uppercase text-[11px] truncate" style={{ color: themeInk }}>
            Mumbai 2028 // Olympic Logo Generator & Identity Lab
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] uppercase text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Interactive Studio Active</span>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={cycleTheme}
            className="px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider border flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            style={{ borderColor: themeBorder, backgroundColor: themeBg, color: themeInk }}
            title={`Cycle Theme (Current: ${theme.toUpperCase()})`}
          >
            <span>Theme:</span>
            <span className="font-bold" style={{ color: themeAccent }}>{theme.toUpperCase()}</span>
          </button>

          {/* Expand / Minimize Window */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider border hover:opacity-80 transition-opacity hidden md:inline-block"
            style={{ borderColor: themeBorder, backgroundColor: themeBg, color: themeInk }}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'Expand'}
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className={`flex flex-col lg:flex-row ${isFullscreen ? 'h-[calc(100vh-45px)]' : 'h-[750px] sm:h-[820px] lg:h-[700px]'}`}>
        
        {/* Left Sidebar Controls */}
        <aside 
          className="w-full lg:w-[320px] flex-shrink-0 flex flex-col h-1/2 lg:h-full overflow-y-auto border-b lg:border-b-0 lg:border-r"
          style={{ backgroundColor: themeSurface, borderColor: themeBorder }}
        >
          {/* 01. Monument Selection */}
          <section className="p-5 border-b" style={{ borderColor: themeBorder }}>
            <div className="text-[10px] uppercase tracking-widest font-mono mb-3 flex items-center justify-between" style={{ color: themeInkDim }}>
              <span>01 / Architectural Monument</span>
              <span style={{ color: themeAccent }}>Selected</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['gateway', 'csmt', 'sealink', 'pagoda'] as MonumentType[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMonument(m);
                    playUISound('monument');
                  }}
                  className={`p-2.5 border text-[11px] font-medium text-left transition-all flex items-center gap-2 rounded ${
                    monument === m 
                      ? 'shadow-sm' 
                      : 'hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: monument === m ? themeInk : 'transparent',
                    color: monument === m ? themeBg : themeInk,
                    borderColor: monument === m ? themeInk : themeBorder
                  }}
                >
                  <Monument type={m} className="w-4 h-4 flex-shrink-0" style={{ fill: monument === m ? themeBg : themeInk }} />
                  <span className="truncate">{m === 'csmt' ? 'CSMT' : m === 'sealink' ? 'Sea Link' : m.charAt(0).toUpperCase() + m.slice(1)}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 02. Typography & Pairings */}
          <section className="p-5 border-b" style={{ borderColor: themeBorder }}>
            <div className="text-[10px] uppercase tracking-widest font-mono mb-3 flex items-center justify-between" style={{ color: themeInkDim }}>
              <span>02 / Typography & Pairings</span>
            </div>
            
            <div className="text-[9px] uppercase tracking-wider font-mono mb-2" style={{ color: themeInkDim }}>Font Pairings</div>
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              {FONT_PAIRINGS.map((pairing) => (
                <button
                  key={pairing.name}
                  onClick={() => {
                    setFont(pairing.primary);
                    setSecondaryFont(pairing.secondary);
                    playUISound('layout');
                  }}
                  className="p-1.5 border text-left rounded text-[10px] transition-all"
                  style={{
                    backgroundColor: font === pairing.primary && secondaryFont === pairing.secondary ? themeInk : 'transparent',
                    color: font === pairing.primary && secondaryFont === pairing.secondary ? themeBg : themeInk,
                    borderColor: font === pairing.primary && secondaryFont === pairing.secondary ? themeInk : themeBorder
                  }}
                >
                  <span className="font-bold block truncate">{pairing.name}</span>
                  <span className="text-[8px] opacity-70 block truncate">{pairing.primary}</span>
                </button>
              ))}
            </div>

            <div className="text-[9px] uppercase tracking-wider font-mono mb-2" style={{ color: themeInkDim }}>Primary Display Font</div>
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => { setFont(f.id); playUISound('effect'); }}
                  className="p-1.5 border text-[11px] text-left rounded truncate transition-all"
                  style={{
                    fontFamily: f.family,
                    backgroundColor: font === f.id ? themeInk : 'transparent',
                    color: font === f.id ? themeBg : themeInk,
                    borderColor: font === f.id ? themeInk : themeBorder
                  }}
                >
                  {f.name}
                </button>
              ))}
            </div>

            {/* Font Size & Line Spacing */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1" style={{ color: themeInkDim }}>
                  <span>Scale:</span>
                  <span>{Math.round(fontSizeScale * 100)}%</span>
                </div>
                <input 
                  type="range" min="0.6" max="1.4" step="0.05" 
                  value={fontSizeScale} 
                  onChange={(e) => setFontSizeScale(parseFloat(e.target.value))}
                  className="w-full accent-[#FF9933] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono mb-1" style={{ color: themeInkDim }}>
                  <span>Line Spacing:</span>
                  <span>{Math.round(lineSpaceScale * 100)}%</span>
                </div>
                <input 
                  type="range" min="0.6" max="1.8" step="0.05" 
                  value={lineSpaceScale} 
                  onChange={(e) => setLineSpaceScale(parseFloat(e.target.value))}
                  className="w-full accent-[#FF9933] cursor-pointer"
                />
              </div>

              {/* Text Effects */}
              <div>
                <span className="text-[9px] uppercase font-mono block mb-1.5" style={{ color: themeInkDim }}>Text Effect</span>
                <div className="grid grid-cols-4 gap-1">
                  {(['none', 'outline', 'shadow', 'glow'] as const).map((eff) => (
                    <button
                      key={eff}
                      onClick={() => { setTextEffect(eff); playUISound('effect'); }}
                      className="p-1 text-[9px] uppercase font-mono border rounded text-center transition-all"
                      style={{
                        backgroundColor: textEffect === eff ? themeInk : 'transparent',
                        color: textEffect === eff ? themeBg : themeInk,
                        borderColor: textEffect === eff ? themeInk : themeBorder
                      }}
                    >
                      {eff}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-[11px] font-mono cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  checked={showOlympicsText} 
                  onChange={(e) => setShowOlympicsText(e.target.checked)}
                  className="accent-[#FF9933]"
                />
                <span>Include "Olympics" Text</span>
              </label>
            </div>
          </section>

          {/* 03. Palette & Gradients */}
          <section className="p-5 border-b" style={{ borderColor: themeBorder }}>
            <div className="text-[10px] uppercase tracking-widest font-mono mb-3 flex items-center justify-between" style={{ color: themeInkDim }}>
              <span>03 / Palette & Gradients</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 items-center">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => { setColor(c.value); setGradient(null); }}
                  className={`w-5 h-5 rounded transition-transform ${
                    color === c.value && !gradient ? 'scale-125 ring-2 ring-offset-1 ring-white' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.value, border: '1px solid rgba(255,255,255,0.2)' }}
                  title={c.name}
                />
              ))}
              <div className="relative w-5 h-5 rounded overflow-hidden border border-white/20 hover:scale-110 transition-transform">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => { setColor(e.target.value); setGradient(null); }}
                  className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%] cursor-pointer opacity-0"
                  title="Custom 16M Color Picker"
                />
                <div className="w-full h-full bg-gradient-to-tr from-rose-500 via-amber-400 to-cyan-400"></div>
              </div>
            </div>

            <div className="text-[9px] uppercase tracking-wider font-mono mb-2" style={{ color: themeInkDim }}>Olympic Gradients</div>
            <div className="grid grid-cols-4 gap-1.5 mb-4">
              {GRADIENTS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { 
                    setGradient(g.id); 
                    setCustomGradientColors([...g.colors]);
                    playUISound('effect');
                  }}
                  className={`h-6 rounded text-[8px] font-mono uppercase font-bold text-white shadow-sm flex items-center justify-center transition-all ${
                    gradient === g.id ? 'ring-2 ring-white scale-105' : 'hover:opacity-90'
                  }`}
                  style={{ background: `linear-gradient(135deg, ${g.colors.join(', ')})` }}
                  title={g.name}
                >
                  <span className="drop-shadow-md truncate px-1">{g.name}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-1 text-[11px] font-mono">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={fillMonument} 
                  onChange={(e) => setFillMonument(e.target.checked)}
                  className="accent-[#FF9933]"
                />
                <span>Fill Monument (Uncheck for Stroke)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={gradientFont} 
                  onChange={(e) => setGradientFont(e.target.checked)}
                  className="accent-[#FF9933]"
                />
                <span>Apply Gradient to Typography</span>
              </label>

              <div className="pt-2">
                <span className="text-[9px] uppercase font-mono block mb-1" style={{ color: themeInkDim }}>Monument Effect</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['none', 'crystal'] as const).map((eff) => (
                    <button
                      key={eff}
                      onClick={() => setMonumentEffect(eff)}
                      className="p-1 text-[9px] uppercase font-mono border rounded text-center transition-all"
                      style={{
                        backgroundColor: monumentEffect === eff ? themeInk : 'transparent',
                        color: monumentEffect === eff ? themeBg : themeInk,
                        borderColor: monumentEffect === eff ? themeInk : themeBorder
                      }}
                    >
                      {eff === 'crystal' ? 'Crystal Shine' : 'None'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 04. Identity Layouts */}
          <section className="p-5 border-b" style={{ borderColor: themeBorder }}>
            <div className="text-[10px] uppercase tracking-widest font-mono mb-3 flex items-center justify-between" style={{ color: themeInkDim }}>
              <span>04 / Identity Layouts</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {LAYOUTS.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLayout(l);
                    playUISound('layout');
                  }}
                  className="p-2 border text-[10px] font-mono text-left rounded transition-all truncate"
                  style={{
                    backgroundColor: layout === l ? themeInk : 'transparent',
                    color: layout === l ? themeBg : themeInk,
                    borderColor: layout === l ? themeInk : themeBorder
                  }}
                >
                  {l.replace('-', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </section>

          {/* 05. Motion & Audio */}
          <section className="p-5" style={{ borderColor: themeBorder }}>
            <div className="text-[10px] uppercase tracking-widest font-mono mb-3 flex items-center justify-between" style={{ color: themeInkDim }}>
              <span>05 / Motion & Audio</span>
            </div>
            <div className="grid grid-cols-3 gap-1 mb-4">
              {ANIMATIONS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAnimation(a)}
                  className="p-1.5 border text-[9px] font-mono uppercase text-center rounded transition-all"
                  style={{
                    backgroundColor: animation === a ? themeInk : 'transparent',
                    color: animation === a ? themeBg : themeInk,
                    borderColor: animation === a ? themeInk : themeBorder
                  }}
                >
                  {a}
                </button>
              ))}
            </div>

            <button
              onClick={() => setMusicEnabled(!musicEnabled)}
              className="w-full p-2.5 border text-[10px] font-mono uppercase tracking-wider rounded flex items-center justify-between transition-all"
              style={{
                backgroundColor: musicEnabled ? themeInk : 'transparent',
                color: musicEnabled ? themeBg : themeInk,
                borderColor: musicEnabled ? themeInk : themeBorder
              }}
            >
              <span>Indian Sitar Scoring</span>
              <span className="font-bold">{musicEnabled ? 'ACTIVE' : 'OFF'}</span>
            </button>
          </section>
        </aside>

        {/* Right Main Stage / Live Preview */}
        <main className="flex-1 flex flex-col relative overflow-hidden" style={{ backgroundColor: themeBg }}>
          
          {/* Audio stream for sitar ambience */}
          <audio 
            ref={audioRef} 
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Raga_Yaman_Kalyan_on_Sitar.ogg" 
            loop 
            autoPlay={false}
            className="hidden"
            crossOrigin="anonymous"
          />

          {/* Top Stage Header & Export Actions */}
          <div 
            className="px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 z-10 font-mono text-xs"
            style={{ backgroundColor: themeSurface, borderColor: themeBorder }}
          >
            <div className="text-[11px] tracking-wider uppercase opacity-70" style={{ color: themeInk }}>
              LIVE PREVIEW // {layout.toUpperCase()} // 60FPS
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider mr-1" style={{ color: themeInkDim }}>
                Export:
              </span>
              <button 
                onClick={() => handleExport('png')} 
                disabled={isExporting}
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded hover:opacity-80 transition-opacity disabled:opacity-50"
                style={{ borderColor: themeBorder, backgroundColor: themeBg, color: themeInk }}
              >
                PNG
              </button>
              <button 
                onClick={() => handleExport('transparent-png')} 
                disabled={isExporting}
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded hover:opacity-80 transition-opacity disabled:opacity-50"
                style={{ borderColor: themeBorder, backgroundColor: themeBg, color: themeInk }}
              >
                TRANS PNG
              </button>
              <button 
                onClick={() => handleExport('jpeg')} 
                disabled={isExporting}
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded hover:opacity-80 transition-opacity disabled:opacity-50"
                style={{ borderColor: themeBorder, backgroundColor: themeBg, color: themeInk }}
              >
                JPEG
              </button>
              <button 
                onClick={() => handleExport('svg')} 
                disabled={isExporting}
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded hover:opacity-80 transition-opacity disabled:opacity-50 font-bold"
                style={{ borderColor: themeAccent, backgroundColor: themeAccent, color: '#000000' }}
              >
                SVG
              </button>
            </div>
          </div>

          {/* Notification Toast */}
          {exportMessage && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 animate-bounce">
              <div 
                className="px-4 py-2 rounded shadow-2xl text-[11px] font-mono border"
                style={{
                  backgroundColor: exportMessage.type === 'error' ? '#7F1D1D' : exportMessage.type === 'success' ? '#064E3B' : themeInk,
                  color: exportMessage.type === 'error' ? '#FCA5A5' : exportMessage.type === 'success' ? '#6EE7B7' : themeBg,
                  borderColor: themeBorder
                }}
              >
                {exportMessage.text}
              </div>
            </div>
          )}

          {/* Central Interactive Canvas Stage */}
          <div 
            className="flex-1 flex items-center justify-center p-6 sm:p-10 relative overflow-hidden"
            style={{
              backgroundImage: `radial-gradient(${themeBorder} 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}
          >
            {/* SVG Defs for Gradients & Filters */}
            <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true" focusable="false">
              <defs>
                {gradient && customGradientColors.length > 0 && (
                  <linearGradient id="active-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    {customGradientColors.map((c, i) => (
                      <stop key={i} offset={`${(i / Math.max(1, customGradientColors.length - 1)) * 100}%`} stopColor={c} />
                    ))}
                  </linearGradient>
                )}
                <filter id="crystal">
                  <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" result="noise" />
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.4 0" in="noise" result="coloredNoise" />
                  <feDisplacementMap in="SourceGraphic" in2="coloredNoise" scale="4" xChannelSelector="R" yChannelSelector="G" result="displaced" />
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur" />
                  <feSpecularLighting in="blur" surfaceScale="6" specularConstant="1.5" specularExponent="30" lightingColor="#ffffff" result="specOut">
                    <feDistantLight azimuth="45" elevation="45" />
                  </feSpecularLighting>
                  <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                  <feBlend mode="screen" in="specOut" in2="displaced" result="lit" />
                </filter>
              </defs>
            </svg>

            {/* Logo Stage Container */}
            <div 
              ref={previewRef}
              className={`relative flex items-center justify-center p-8 sm:p-12 w-full max-w-[460px] aspect-square rounded border shadow-2xl transition-all duration-500 ${
                animation === 'stamp' ? 'animate-[bounce_0.8s_ease-out_1]' :
                animation === 'fluid' ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''
              }`}
              style={{
                backgroundColor: themeBg,
                borderColor: themeBorder,
                boxShadow: `0 20px 60px -15px ${theme === 'dark' ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.1)'}`
              }}
            >
              <LogoPreviewRender 
                monument={monument}
                font={font}
                secondaryFont={secondaryFont}
                color={color}
                layout={layout}
                theme={theme}
                gradient={gradient}
                customGradientColors={customGradientColors}
                fillMonument={fillMonument}
                gradientFont={gradientFont}
                monumentEffect={monumentEffect}
                fontSizeScale={fontSizeScale}
                lineSpaceScale={lineSpaceScale}
                showOlympicsText={showOlympicsText}
                textEffect={textEffect}
                animation={animation}
              />
            </div>
          </div>

          {/* Footer Bar */}
          <div 
            className="px-6 py-2.5 border-t flex items-center justify-between text-[10px] font-mono uppercase tracking-widest"
            style={{ backgroundColor: themeSurface, borderColor: themeBorder, color: themeInkDim }}
          >
            <span>International Olympic Committee // Mumbai 2028</span>
            <span className="hidden sm:inline">12-Col Modular // Swiss Design Principles</span>
          </div>
        </main>
      </div>
    </div>
  );
}

// Logo Layout Engine
function LogoPreviewRender({
  monument, font, secondaryFont, color, layout, theme, gradient, customGradientColors,
  fillMonument, gradientFont, monumentEffect, fontSizeScale, lineSpaceScale, showOlympicsText, textEffect, animation
}: {
  monument: MonumentType;
  font: string;
  secondaryFont: string;
  color: string;
  layout: LayoutType;
  theme: ThemeType;
  gradient: string | null;
  customGradientColors: string[];
  fillMonument: boolean;
  gradientFont: boolean;
  monumentEffect: 'none' | 'crystal';
  fontSizeScale: number;
  lineSpaceScale: number;
  showOlympicsText: boolean;
  textEffect: 'none' | 'outline' | 'shadow' | 'glow';
  animation: AnimationType;
}) {
  const fontObj = FONTS.find(f => f.id === font) || FONTS[0];
  const secondaryFontObj = FONTS.find(f => f.id === secondaryFont) || FONTS[7];
  
  const textColor = theme === 'dark' ? '#FFFFFF' : theme === 'holi' ? '#4A0E4E' : '#0A0A0A';
  const themeBorder = theme === 'dark' ? '#222222' : theme === 'holi' ? '#FFD700' : '#E5E5E5';

  let effectStyle: React.CSSProperties = {};
  if (textEffect === 'outline') {
    effectStyle = {
      WebkitTextStroke: `1.5px ${color}`,
      color: 'transparent',
      WebkitTextFillColor: 'transparent'
    };
  } else if (textEffect === 'shadow') {
    effectStyle = {
      textShadow: `3px 3px 0px ${color}80`
    };
  } else if (textEffect === 'glow') {
    effectStyle = {
      textShadow: `0 0 12px ${color}, 0 0 25px ${color}80`
    };
  }

  const textStyle: React.CSSProperties = gradientFont && gradient && customGradientColors.length > 0 ? {
    backgroundImage: `linear-gradient(135deg, ${customGradientColors.join(', ')})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: fontObj.family,
    ...effectStyle
  } : {
    color: textColor,
    fontFamily: fontObj.family,
    ...effectStyle
  };

  const monumentColor = gradient ? `url(#active-gradient)` : color;
  const monumentStyle: React.CSSProperties = fillMonument 
    ? { fill: monumentColor, stroke: 'none' } 
    : { fill: 'none', stroke: monumentColor, strokeWidth: 2 };
  
  const effectFilter = monumentEffect === 'crystal' ? { filter: 'url(#crystal)' } : {};

  // 1. Brutalist / Swiss Layout
  if (layout === 'brutalist') {
    return (
      <div 
        className="w-full h-full grid grid-cols-3 grid-rows-3 border-2" 
        style={{ borderColor: textColor }}
      >
        <div className="col-span-2 row-span-1 p-3 flex flex-col justify-start border-b-2 border-r-2" style={{ borderColor: textColor }}>
          <h2 className="font-black uppercase tracking-tighter break-words" style={{ ...textStyle, fontSize: `calc(40px * ${fontSizeScale})`, lineHeight: 0.88 * lineSpaceScale }}>
            MUMBAI<br/>2028
          </h2>
        </div>
        <div className="col-span-1 row-span-1 p-3 flex justify-end items-start border-b-2" style={{ borderColor: textColor }}>
          <OlympicRings className="w-10 h-10" />
        </div>

        <div className="col-span-1 row-span-1 p-3 flex items-end border-b-2 border-r-2" style={{ borderColor: textColor }}>
          <div className="font-mono text-[7px] tracking-widest uppercase font-bold opacity-70" style={{ color: textColor }}>
            19.0760° N<br/>72.8777° E
          </div>
        </div>

        <div className="col-span-2 row-span-2 relative flex items-end justify-end p-3 overflow-hidden">
          <Monument type={monument} className="w-44 h-44 absolute -bottom-3 -right-3 opacity-90" style={{ ...monumentStyle, ...effectFilter }} />
        </div>

        <div className="col-span-1 row-span-1 p-3 flex items-end border-r-2" style={{ borderColor: textColor }}>
          <div className="font-black tracking-tight opacity-50 uppercase text-[10px]" style={{ color: textColor, fontFamily: secondaryFontObj.family }}>
            GAMES<br/>OF THE<br/>XXXIV<br/>OLYMPIAD
          </div>
        </div>
      </div>
    );
  }

  // 2. Badge Layout
  if (layout === 'badge') {
    return (
      <div className="relative flex items-center justify-center w-full h-full">
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-[spin_35s_linear_infinite]">
          <path id="badgePath" d="M 100, 100 m -68, 0 a 68,68 0 1,1 136,0 a 68,68 0 1,1 -136,0" fill="none" />
          <text fill={textColor} className="font-bold uppercase tracking-[0.22em] text-[15px]" style={{ fontFamily: fontObj.family }}>
            <textPath href="#badgePath" startOffset="0%">
              {showOlympicsText ? "MUMBAI 2028 OLYMPICS • MUMBAI 2028 OLYMPICS • " : "MUMBAI 2028 • MUMBAI 2028 • MUMBAI 2028 • "}
            </textPath>
          </text>
        </svg>
        <div className="flex flex-col items-center justify-center rounded-full w-[150px] h-[150px] border z-10 shadow-xl" style={{ borderColor: themeBorder, backgroundColor: theme === 'dark' ? '#141414' : '#FFFFFF' }}>
          <Monument type={monument} className="w-16 h-16 mb-2" style={{ ...monumentStyle, ...effectFilter }} />
          <OlympicRings className="w-12 h-12" />
        </div>
      </div>
    );
  }

  // 3. Editorial Layout
  if (layout === 'editorial') {
    return (
      <div className="w-full h-full flex relative overflow-hidden p-6">
        <div className="absolute top-6 left-6 z-0">
          <Monument type={monument} className="w-52 h-52 opacity-35" style={{ ...monumentStyle, ...effectFilter }} />
        </div>
        <div className="z-10 flex flex-col justify-end w-full h-full pb-2">
          <h2 className="tracking-tighter font-bold uppercase" style={{ ...textStyle, fontSize: `calc(68px * ${fontSizeScale})`, lineHeight: 0.85 * lineSpaceScale }}>
            MUMBAI
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <h3 className="font-bold tracking-widest uppercase text-base" style={{ color, fontFamily: secondaryFontObj.family }}>
              2028{showOlympicsText && " Olympics"}
            </h3>
            <div className="flex-1 h-[2px]" style={{ backgroundColor: color }} />
            <OlympicRings className="w-10 h-10" />
          </div>
        </div>
      </div>
    );
  }

  // 4. Corporate Layout
  if (layout === 'corporate') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="flex items-center gap-6 border-b pb-6 mb-6 w-full justify-center" style={{ borderColor: themeBorder }}>
          <Monument type={monument} className="w-20 h-20" style={{ ...monumentStyle, ...effectFilter }} />
          <div className="w-[1px] h-16 opacity-40" style={{ backgroundColor: textColor }} />
          <div className="flex flex-col text-left">
            <h2 className="tracking-tight font-bold text-3xl" style={{ ...textStyle, fontSize: `calc(48px * ${fontSizeScale})` }}>
              Mumbai 2028
            </h2>
            <h3 className="tracking-widest uppercase mt-1 text-xs opacity-70" style={{ color, fontFamily: secondaryFontObj.family }}>
              Candidate City
            </h3>
          </div>
        </div>
        <OlympicRings className="w-16 h-16" />
      </div>
    );
  }

  // 5. Minimal Layout
  if (layout === 'minimal') {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <Monument type={monument} className="w-28 h-28" style={{ ...monumentStyle, ...effectFilter }} />
        <div className="flex items-center gap-5">
          <h2 className="tracking-tight font-bold text-4xl" style={{ ...textStyle, fontSize: `calc(52px * ${fontSizeScale})` }}>
            Mumbai
          </h2>
          <div className="w-[1px] h-12" style={{ backgroundColor: textColor }} />
          <div className="flex flex-col items-start text-left">
            <h3 className="font-bold tracking-widest uppercase text-sm" style={{ color, fontFamily: secondaryFontObj.family }}>
              2028{showOlympicsText && <><br/>Olympics</>}
            </h3>
            <OlympicRings className="w-10 h-10 mt-1" />
          </div>
        </div>
      </div>
    );
  }

  // 6. Inline Layout
  if (layout === 'inline') {
    return (
      <div className="flex items-center gap-6">
        <Monument type={monument} className="w-28 h-28 flex-shrink-0" style={{ ...monumentStyle, ...effectFilter }} />
        <div className="flex flex-col">
          <h2 className="tracking-tight font-bold" style={{ ...textStyle, fontSize: `calc(58px * ${fontSizeScale})`, lineHeight: 1 * lineSpaceScale }}>
            Mumbai
          </h2>
          <div className="flex items-center gap-3 mt-1.5">
            <h3 className="font-bold tracking-widest uppercase text-sm" style={{ color, fontFamily: secondaryFontObj.family }}>
              2028{showOlympicsText && " Olympics"}
            </h3>
            <OlympicRings className="w-10 h-10" />
          </div>
        </div>
      </div>
    );
  }

  // 7. Monument Only Layout
  if (layout === 'monument-only') {
    return (
      <div className="flex items-center justify-center w-full h-full p-6">
        <Monument type={monument} className="w-56 h-56" style={{ ...monumentStyle, ...effectFilter }} />
      </div>
    );
  }

  // 8. Official Vertical Layout
  if (layout === 'official-vertical') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-center gap-4">
        <Monument type={monument} className="w-40 h-40" style={{ ...monumentStyle, ...effectFilter }} />
        <div className="flex flex-col items-center w-full">
          <h2 className="leading-none tracking-normal font-black uppercase flex flex-col gap-0.5" style={{ ...textStyle, fontSize: `calc(48px * ${fontSizeScale})` }}>
            <span>MUMBAI</span>
            <span className="opacity-90">2028</span>
          </h2>
        </div>
        <OlympicRings className="w-16 h-16 mt-2" />
      </div>
    );
  }

  // 9. Official Horizontal Layout
  if (layout === 'official-horizontal') {
    return (
      <div className="flex items-center justify-center w-full h-full px-6">
        <div className="flex items-center gap-8">
          <Monument type={monument} className="w-36 h-36 flex-shrink-0" style={{ ...monumentStyle, ...effectFilter }} />
          <div className="w-[2px] h-24 opacity-40 shrink-0" style={{ backgroundColor: textColor }} />
          <div className="flex flex-col justify-center">
            <h2 className="font-black uppercase tracking-tight flex flex-col" style={{ ...textStyle, fontSize: `calc(40px * ${fontSizeScale})` }}>
              <span>MUMBAI</span>
              <span className="opacity-90">2028</span>
            </h2>
            <OlympicRings className="w-14 h-14 mt-4" />
          </div>
        </div>
      </div>
    );
  }

  // 10. Official Partner Layout
  if (layout === 'official-partner') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-8">
        <div className="flex items-center gap-4 border-b pb-4 w-3/4 justify-center" style={{ borderColor: themeBorder }}>
          <h3 className="font-bold tracking-widest uppercase opacity-80 text-xs" style={{ color: textColor, fontFamily: secondaryFontObj.family }}>
            Candidate City
          </h3>
        </div>
        <div className="flex items-center gap-8">
          <Monument type={monument} className="w-32 h-32 flex-shrink-0" style={{ ...monumentStyle, ...effectFilter }} />
          <div className="w-[1px] h-20 opacity-40 shrink-0" style={{ backgroundColor: textColor }} />
          <div className="flex flex-col items-start">
            <h2 className="tracking-tight font-bold" style={{ ...textStyle, fontSize: `calc(36px * ${fontSizeScale})` }}>
              Mumbai<br/>2028
            </h2>
            <OlympicRings className="w-12 h-12 mt-3" />
          </div>
        </div>
      </div>
    );
  }

  // 11. Stacked Layout (Default Master Lockup)
  return (
    <div className="flex flex-col items-center text-center">
      <Monument type={monument} className="w-36 h-36 mb-4" style={{ ...monumentStyle, ...effectFilter }} />
      <div className="flex flex-col items-center">
        <h2 className="tracking-tight font-bold" style={{ ...textStyle, fontSize: `calc(62px * ${fontSizeScale})`, lineHeight: 1 * lineSpaceScale }}>
          Mumbai
        </h2>
        <h3 className="font-bold tracking-widest uppercase mt-2 text-sm" style={{ color, fontFamily: secondaryFontObj.family }}>
          2028{showOlympicsText && " Olympics"}
        </h3>
      </div>
      <OlympicRings className="w-20 h-20 mt-4" />
    </div>
  );
}
