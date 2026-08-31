import React, { useState } from 'react';
import { Smartphone, Monitor, Terminal, Shield, ArrowUpRight } from 'lucide-react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<'iphone' | 'fullscreen'>('iphone');

  return (
    <div className="min-h-screen bg-[#000000] text-[#EDEDED] flex flex-col items-center justify-start sm:py-8 sm:px-4 relative overflow-x-hidden vercel-grid selection:bg-white selection:text-black">
      {/* Vercel Ambient Spotlight Cone */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-transparent blur-[80px] pointer-events-none rounded-full" />
      
      {/* Top Vercel Header Bar (Desktop Mode) */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-4xl mb-6 px-4 py-2.5 rounded-2xl bg-[#0A0A0A] border border-[#222222] z-40 text-xs shadow-vercel-sm backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Vercel Triangle Logo */}
            <svg viewBox="0 0 100 85" className="w-4 h-4 fill-white">
              <polygon points="50,0 100,85 0,85" />
            </svg>
            <span className="font-bold text-white tracking-tight text-sm font-sans">Kairo</span>
            <span className="text-[#666666] font-mono text-xs">/</span>
            <span className="text-[#888888] font-mono text-xs">companion-agent</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#111111] border border-[#282828] text-[10px] font-mono text-[#00E599]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
            <span>ws://192.168.1.42:8420</span>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#111111] border border-[#262626]">
          <button
            onClick={() => setDeviceMode('iphone')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'iphone'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Device</span>
          </button>

          <button
            onClick={() => setDeviceMode('fullscreen')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'fullscreen'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Expanded View</span>
          </button>
        </div>
      </div>

      {/* Main Body Shell */}
      {deviceMode === 'iphone' ? (
        <div className="w-full sm:max-w-[430px] sm:min-h-[890px] bg-[#000000] sm:rounded-[48px] sm:border sm:border-[#262626] sm:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_25px_60px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col transition-all">
          {/* Dynamic Island Pill Notch (Hardware mock) */}
          <div className="hidden sm:flex justify-center pt-2.5 pb-1 bg-[#000000] absolute top-0 left-0 right-0 z-40 pointer-events-none">
            <div className="w-28 h-6 rounded-full bg-[#0C0C0C] border border-[#222222] flex items-center justify-between px-3">
              <div className="w-2 h-2 rounded-full bg-[#1A1A1A]" />
              <div className="w-2 h-2 rounded-full bg-white/20" />
            </div>
          </div>

          <div className="w-full flex-1 flex flex-col sm:pt-4">
            {children}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xl bg-[#000000] rounded-3xl border border-[#242424] shadow-vercel-md relative overflow-hidden flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
