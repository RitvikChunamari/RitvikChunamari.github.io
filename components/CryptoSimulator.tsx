import React, { useState } from 'react';

const CryptoSimulator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full bg-[#050508] border border-white/10 rounded-2xl p-2 md:p-6 my-16 overflow-hidden relative min-h-[800px] flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent opacity-50"></div>
      
      <div className="mb-6 px-4 pt-4">
        <h3 className="text-2xl md:text-3xl font-mono text-white mb-2 tracking-tight">AI TRADING TERMINAL</h3>
        <p className="text-white/50 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse"></span>
          LIVE CLOUD INFERENCE ENGINE CONNECTED
        </p>
      </div>

      <div className="relative w-full flex-1 min-h-[700px] rounded-xl overflow-hidden border border-white/5 bg-black/40">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#050508]">
            <div className="w-8 h-8 border-2 border-white/20 border-t-[#00E5FF] rounded-full animate-spin mb-4"></div>
            <div className="text-[#00E5FF] font-mono text-sm animate-pulse tracking-widest">[ CONNECTING TO STREAMLIT GPU CLOUD... ]</div>
          </div>
        )}
        
        <iframe 
          src="https://crypto-ai-predictor-wao2qsjasta2v4fpdpcgfs.streamlit.app/?embed=true"
          title="Crypto AI Predictor Streamlit App"
          className="absolute inset-0 w-full h-full border-none"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; vr; web-share"
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </div>
    </div>
  );
};

export default CryptoSimulator;
