import React from 'react';

const PromotionalPanel = () => {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 overflow-hidden">
      {/* Abstract flowing background shapes */}
      <div className="absolute inset-0 opacity-40">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q250,100 500,200 T1000,200 L1000,0 L0,0 Z"
            fill="url(#grad1)"
          />
          <path
            d="M0,600 Q300,500 600,600 T1000,600 L1000,400 Q700,450 400,400 T0,400 Z"
            fill="url(#grad1)"
          />
          <path
            d="M0,1000 Q400,900 800,1000 T1000,1000 L1000,800 Q600,750 200,800 T0,800 Z"
            fill="url(#grad1)"
          />
        </svg>
      </div>
      
      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-800">Productr</span>
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-bold">P</span>
          </div>
        </div>
      </div>

      {/* Orange gradient card with runner */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative w-80 h-96 rounded-3xl bg-gradient-to-b from-orange-400 via-orange-500 to-orange-700 shadow-2xl overflow-hidden">
          {/* Runner silhouette - more detailed */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
            <svg viewBox="0 0 200 250" className="w-56 h-72">
              {/* Head */}
              <circle cx="100" cy="30" r="18" fill="rgba(0,0,0,0.4)" />
              {/* Body */}
              <ellipse cx="100" cy="80" rx="25" ry="35" fill="rgba(0,0,0,0.4)" />
              {/* Arms - running position */}
              <path
                d="M75 70 Q60 50 50 65 Q55 75 65 80"
                fill="rgba(0,0,0,0.4)"
              />
              <path
                d="M125 70 Q140 50 150 65 Q145 75 135 80"
                fill="rgba(0,0,0,0.4)"
              />
              {/* Legs - running position */}
              <path
                d="M85 110 Q80 150 75 180 Q85 185 90 180 Q95 150 100 120"
                fill="rgba(0,0,0,0.4)"
              />
              <path
                d="M115 110 Q120 150 125 180 Q115 185 110 180 Q105 150 100 120"
                fill="rgba(0,0,0,0.4)"
              />
            </svg>
          </div>
          
          {/* Tagline */}
          <div className="absolute bottom-6 left-0 right-0 text-center px-4">
            <p className="text-white text-lg font-semibold drop-shadow-lg">
              Uplist your product to market
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalPanel;
