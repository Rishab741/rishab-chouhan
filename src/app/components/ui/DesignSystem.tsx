'use client';

import React from 'react';

export const GlobalAmbientGlow = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Moving ambient blobs */}
    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse mix-blend-screen" />
    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000 mix-blend-screen" />
    
    {/* Grainy Noise Overlay for Texture */}
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
  </div>
);

export const SectionTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center mb-20 relative z-10">
    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
      <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-wider uppercase">
        {subtitle}
      </span>
    </div>
    <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
      {title}
    </h2>
  </div>
);