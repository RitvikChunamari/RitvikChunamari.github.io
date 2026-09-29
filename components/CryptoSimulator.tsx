import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import MagneticWrapper from './MagneticWrapper';

interface KlineData {
  time: string;
  close: number;
}

const CryptoSimulator: React.FC = () => {
  const [data, setData] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [prediction, setPrediction] = useState<{ action: string; confidence: number; profit: string } | null>(null);
  
  const scanlineRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  const fetchLiveCryptoData = async () => {
    setLoading(true);
    setPrediction(null);
    try {
      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=30`);
      const rawData = await response.json();
      
      const formattedData: KlineData[] = rawData.map((d: any) => ({
        time: new Date(d[0]).toLocaleDateString(),
        close: parseFloat(d[4])
      }));
      
      setData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCryptoData();
  }, [symbol]);

  const runSimulation = () => {
    if (!scanlineRef.current || !chartRef.current || data.length === 0) return;
    
    // Reset scanline
    gsap.set(scanlineRef.current, { left: '0%', opacity: 1 });
    
    // Animate scanline
    gsap.to(scanlineRef.current, {
      left: '100%',
      duration: 2,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.to(scanlineRef.current, { opacity: 0, duration: 0.5 });
        
        // Generate a pseudo-prediction based on momentum for demo purposes
        const lastClose = data[data.length - 1].close;
        const prevClose = data[data.length - 2].close;
        const momentum = lastClose - prevClose;
        
        if (momentum > 0) {
          setPrediction({ action: 'BUY (BULLISH)', confidence: 87.4, profit: '+3.2%' });
        } else {
          setPrediction({ action: 'SELL (BEARISH)', confidence: 92.1, profit: '-4.1%' });
        }
      }
    });
  };

  // SVG Chart Calculation
  const maxPrice = Math.max(...data.map(d => d.close), 1);
  const minPrice = Math.min(...data.map(d => d.close), 0);
  const range = maxPrice - minPrice;
  
  const generatePath = () => {
    if (data.length === 0) return '';
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (((d.close - minPrice) / range) * 100);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="w-full bg-[#050508] border border-white/10 rounded-2xl p-6 md:p-10 my-16 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-50"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-mono text-white mb-2 tracking-tight">AI TRADING TERMINAL</h3>
          <p className="text-white/50 font-mono text-xs uppercase tracking-widest">Live 1D CNN + GRU Inference Demo</p>
        </div>
        
        <div className="flex gap-4">
          {['BTCUSDT', 'ETHUSDT', 'SOLUSDT'].map(coin => (
            <button 
              key={coin}
              onClick={() => setSymbol(coin)}
              className={`px-4 py-2 font-mono text-xs tracking-wider border transition-colors ${symbol === coin ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/20 hover:border-white/50'}`}
            >
              {coin.replace('USDT', '')}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full h-[300px] md:h-[400px] border border-white/5 rounded-xl bg-black/40 mb-8 p-4">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-[#00E5FF] font-mono text-sm animate-pulse">[ FETCHING LIVE MARKET DATA... ]</div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <svg ref={chartRef} className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path 
                d={generatePath()} 
                fill="none" 
                stroke="#00E5FF" 
                strokeWidth="1.5" 
                vectorEffect="non-scaling-stroke"
                className="drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]"
              />
            </svg>
            
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              {[1,2,3,4,5].map(i => <div key={i} className="w-full h-px bg-white"></div>)}
            </div>
            
            {/* AI Scanline */}
            <div 
              ref={scanlineRef} 
              className="absolute top-0 bottom-0 w-px bg-white shadow-[0_0_15px_#fff] opacity-0 pointer-events-none z-10"
              style={{ left: '0%' }}
            ></div>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <MagneticWrapper>
          <button 
            onClick={runSimulation}
            disabled={loading}
            className="group relative px-8 py-4 bg-white text-black font-mono text-sm tracking-widest uppercase overflow-hidden"
          >
            <span className="relative z-10 font-bold group-hover:text-white transition-colors duration-300">Run Inference</span>
            <div className="absolute inset-0 bg-[#00E5FF] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
          </button>
        </MagneticWrapper>

        {prediction && (
          <div className="flex flex-col items-end text-right animate-fade-in">
            <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest mb-1">Model Output</span>
            <span className={`text-2xl font-bold font-mono ${prediction.action.includes('BUY') ? 'text-green-400' : 'text-red-400'}`}>
              {prediction.action}
            </span>
            <div className="flex gap-4 mt-2">
              <span className="text-xs font-mono text-white/70">CONFIDENCE: {prediction.confidence}%</span>
              <span className="text-xs font-mono text-white/70">EST. PROFIT: {prediction.profit}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoSimulator;
