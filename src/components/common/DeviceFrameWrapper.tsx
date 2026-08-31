import React, { useState } from 'react';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<'iphone' | 'fullscreen'>('iphone');

  return (
    <div className="min-h-screen bg-[#06070B] text-slate-100 flex flex-col items-center justify-start sm:py-6 sm:px-4 relative overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Background Ambient Glow Orbs */}
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 -right-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-32 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Floating Viewport Mode Switcher (Desktop only) */}
      <div className="hidden lg:flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-[#11121C]/80 border border-white/10 backdrop-blur-xl z-40 text-xs shadow-lg">
        <div className="flex items-center gap-1.5 text-slate-400 mr-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-semibold text-slate-300">Kairo Mobile Preview</span>
        </div>

        <button
          onClick={() => setDeviceMode('iphone')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
            deviceMode === 'iphone'
              ? 'bg-purple-600 text-white shadow-glow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile Frame</span>
        </button>

        <button
          onClick={() => setDeviceMode('fullscreen')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-medium transition-all ${
            deviceMode === 'fullscreen'
              ? 'bg-purple-600 text-white shadow-glow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Expanded View</span>
        </button>
      </div>

      {/* Device Body */}
      {deviceMode === 'iphone' ? (
        <div className="w-full sm:max-w-[430px] sm:min-h-[880px] bg-[#090A0F] sm:rounded-[52px] sm:border-[8px] sm:border-[#1E2033] sm:shadow-[0_0_80px_rgba(0,0,0,0.9),0_0_40px_rgba(124,110,248,0.2)] relative overflow-hidden flex flex-col transition-all">
          {/* Hardware Dynamic Island Notch (Desktop mock only) */}
          <div className="hidden sm:flex justify-center pt-2.5 pb-1 bg-[#090A0F] absolute top-0 left-0 right-0 z-40 pointer-events-none">
            <div className="w-28 h-6 rounded-full bg-black border border-white/10 flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              <div className="w-2 h-2 rounded-full bg-purple-950 border border-purple-800/40" />
            </div>
          </div>

          <div className="w-full flex-1 flex flex-col sm:pt-4">
            {children}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xl bg-[#090A0F] rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
