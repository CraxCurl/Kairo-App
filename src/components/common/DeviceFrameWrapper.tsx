import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<'iphone' | 'fullscreen'>('iphone');

  return (
    <div className="min-h-screen bg-[#000000] text-[#EDEDED] flex flex-col items-center justify-start sm:py-6 sm:px-4 relative overflow-x-hidden vercel-grid selection:bg-white selection:text-black">
      {/* Vercel Ambient Spotlight Cone */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent blur-[90px] pointer-events-none rounded-full" />
      
      {/* Top Viewport Mode Switcher (Desktop Only) */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-2xl mb-4 px-4 py-2 rounded-2xl bg-[#0A0A0A] border border-[#222222] z-40 text-xs shadow-vercel-sm backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 100 85" className="w-3.5 h-3.5 fill-white">
            <polygon points="50,0 100,85 0,85" />
          </svg>
          <span className="font-bold text-white tracking-tight font-sans">Kairo</span>
          <span className="text-[#555555] font-mono">/</span>
          <span className="text-[#888888] font-mono text-[11px]">remote-interface</span>
        </div>

        <div className="flex items-center p-0.5 rounded-xl bg-[#111111] border border-[#242424]">
          <button
            onClick={() => setDeviceMode('iphone')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              deviceMode === 'iphone'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>mobile_frame</span>
          </button>

          <button
            onClick={() => setDeviceMode('fullscreen')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              deviceMode === 'fullscreen'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>expanded_view</span>
          </button>
        </div>
      </div>

      {/* Main Body Frame */}
      {deviceMode === 'iphone' ? (
        <div className="w-full sm:max-w-[430px] sm:h-[880px] sm:max-h-[92vh] bg-[#000000] sm:rounded-[44px] sm:border sm:border-[#262626] sm:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col transition-all">
          {/* Scrollable Container inside frame */}
          <div className="w-full flex-1 overflow-y-auto overflow-x-hidden overscroll-contain flex flex-col">
            {children}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xl min-h-screen bg-[#000000] rounded-3xl border border-[#222222] shadow-vercel-md relative overflow-hidden flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
