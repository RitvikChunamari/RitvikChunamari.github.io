import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Prediction {
  action: string;
  confidence: number;
  pct_change: number;
  current_price: number;
  predicted_price: number;
}

const CryptoSimulator: React.FC = () => {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [inferenceLoading, setInferenceLoading] = useState(false);
  const [symbol, setSymbol] = useState('BTC-USD');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  
  const scanlineRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  const fetchInferenceData = async () => {
    setLoading(true);
    setPrediction(null);
    setData([]);
    
    try {
      const api_url = `https://crypto-ai-api-y2j3.onrender.com/predict?ticker=${symbol}&mode=daily`;
      const res = await fetch(api_url);
      if (res.ok) {
        const result = await res.json();
        if (result.historical_data) {
          setData(result.historical_data);
          setPrediction({
            action: result.action,
            confidence: result.confidence,
            pct_change: result.pct_change,
            current_price: result.current_price,
            predicted_price: result.predicted_price
          });
        }
      }
    } catch (error) {
      console.error("API Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInferenceData();
  }, [symbol]);

  const runSimulation = () => {
    if (!scanlineRef.current || !chartRef.current || data.length === 0) return;
    
    setInferenceLoading(true);
    
    // Animate scanline
    gsap.fromTo(scanlineRef.current, 
      { left: '0%', opacity: 1 },
      {
        left: '100%',
        duration: 2.5,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(scanlineRef.current, { opacity: 0, duration: 0.5 });
          setInferenceLoading(false);
        }
      }
    );
  };

  // SVG Chart Calculation
  const maxPrice = Math.max(...data, 1);
  const minPrice = Math.min(...data, 0);
  const range = maxPrice - minPrice || 1;
  
  const generatePath = () => {
    if (data.length === 0) return '';
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (((d - minPrice) / range) * 100);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="w-full bg-[#050508] border border-white/10 rounded-2xl p-6 md:p-12 my-16 overflow-hidden relative shadow-[0_0_50px_rgba(0,229,255,0.05)]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-50"></div>
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-white/10 pb-8">
        <div>
          <h3 className="text-3xl md:text-5xl font-mono text-white mb-4 tracking-tighter">LIVE AI TERMINAL</h3>
          <p className="text-[#00E5FF] font-mono text-xs md:text-sm uppercase tracking-widest flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
            TENSORFLOW CLOUD INFERENCE ENGINE CONNECTED
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 z-10">
          {['BTC-USD', 'ETH-USD', 'SOL-USD'].map(coin => (
            <button 
              key={coin}
              onClick={() => setSymbol(coin)}
              className={`px-6 py-3 font-mono text-xs tracking-widest transition-all duration-300 ${symbol === coin ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'bg-transparent text-white/50 border border-white/20 hover:border-[#00E5FF] hover:text-[#00E5FF] cursor-pointer'}`}
            >
              {coin}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* CHART SECTION */}
        <div className="flex-1">
          <div className="relative w-full h-[400px] md:h-[500px] border border-white/10 rounded-xl bg-black mb-8 p-4 overflow-hidden">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-white/10 border-t-[#00E5FF] rounded-full animate-spin mb-6"></div>
                <div className="text-[#00E5FF] font-mono text-xs animate-pulse tracking-[0.3em] uppercase">Pinging Cloud API...</div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                {/* Grid */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="w-full h-px bg-white"></div>)}
                </div>
                <div className="absolute inset-0 flex justify-between pointer-events-none opacity-[0.03]">
                  {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-full w-px bg-white"></div>)}
                </div>
                
                {/* SVG Line */}
                <svg ref={chartRef} className="absolute inset-0 w-full h-full overflow-visible py-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(0, 229, 255, 0.5)" />
                      <stop offset="100%" stopColor="rgba(0, 229, 255, 0)" />
                    </linearGradient>
                  </defs>
                  {/* Fill Area */}
                  {data.length > 0 && (
                    <path 
                      d={`${generatePath()} L 100 100 L 0 100 Z`}
                      fill="url(#chartGradient)"
                      className="opacity-20"
                    />
                  )}
                  {/* Stroke Line */}
                  <path 
                    d={generatePath()} 
                    fill="none" 
                    stroke="#00E5FF" 
                    strokeWidth="2" 
                    vectorEffect="non-scaling-stroke"
                    className="drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]"
                  />
                </svg>
                
                {/* AI Scanline */}
                <div 
                  ref={scanlineRef} 
                  className="absolute top-0 bottom-0 w-[2px] bg-[#00E5FF] shadow-[0_0_20px_#00E5FF] opacity-0 pointer-events-none z-10"
                  style={{ left: '0%' }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* METRICS SIDEBAR */}
        <div className="lg:w-[350px] flex flex-col gap-6">
          <div className="bg-black border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[#00E5FF]/5 opacity-50"></div>
             <span className="font-mono text-[10px] text-white/50 uppercase tracking-[0.2em] mb-2 z-10">AI PREDICTION SIGNAL</span>
             {loading || !prediction ? (
                <span className="text-xl font-mono text-white/30 z-10">AWAITING...</span>
             ) : (
                <span className={`text-2xl md:text-3xl font-bold font-mono tracking-tight z-10 ${prediction.action.includes('BUY') ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]'}`}>
                  {prediction.action}
                </span>
             )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black border border-white/10 rounded-xl p-5 flex flex-col justify-center">
               <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest mb-2">Confidence</span>
               <span className="text-xl font-mono text-white">{loading || !prediction ? '--' : `${prediction.confidence}%`}</span>
            </div>
            <div className="bg-black border border-white/10 rounded-xl p-5 flex flex-col justify-center">
               <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest mb-2">Est. Move</span>
               <span className={`text-xl font-mono ${prediction && prediction.pct_change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                 {loading || !prediction ? '--' : `${prediction.pct_change > 0 ? '+' : ''}${prediction.pct_change.toFixed(2)}%`}
               </span>
            </div>
            <div className="bg-black border border-white/10 rounded-xl p-5 flex flex-col justify-center">
               <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest mb-2">Current</span>
               <span className="text-xl font-mono text-white/80">{loading || !prediction ? '--' : `$${prediction.current_price.toLocaleString(undefined, {maximumFractionDigits:2})}`}</span>
            </div>
            <div className="bg-black border border-white/10 rounded-xl p-5 flex flex-col justify-center">
               <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest mb-2">Target</span>
               <span className="text-xl font-mono text-white">{loading || !prediction ? '--' : `$${prediction.predicted_price.toLocaleString(undefined, {maximumFractionDigits:2})}`}</span>
            </div>
          </div>

          <button 
            onClick={runSimulation}
            disabled={loading || inferenceLoading || !prediction}
            className={`mt-auto w-full group relative px-8 py-5 bg-transparent border border-[#00E5FF]/30 font-mono text-xs tracking-[0.2em] uppercase overflow-hidden cursor-pointer transition-all hover:border-[#00E5FF] ${inferenceLoading ? 'opacity-50' : ''}`}
          >
            <span className="relative z-10 font-bold text-[#00E5FF] transition-colors duration-300 group-hover:text-black">
              {inferenceLoading ? 'ANALYZING NEURAL NET...' : 'EXECUTE INFERENCE ANIMATION'}
            </span>
            <div className="absolute inset-0 bg-[#00E5FF] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default CryptoSimulator;
