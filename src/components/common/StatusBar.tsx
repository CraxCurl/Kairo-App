import React, { useState, useEffect } from 'react';
import { Wifi, Battery, BatteryCharging, ShieldCheck, Zap } from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export const StatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const { laptop, kairoStatus } = useKairo();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full pt-3 pb-2 px-6 flex items-center justify-between text-xs text-slate-400 select-none border-b border-white/[0.04] bg-[#090A0F]/90 backdrop-blur-md sticky top-0 z-30">
      {/* Time & Kairo Pill */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-200 tracking-tight font-mono">{time || '09:41'}</span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-[10px] text-purple-300 font-medium">
          <span className={`w-1.5 h-1.5 rounded-full ${
            kairoStatus === 'executing' ? 'bg-purple-400 animate-ping' :
            kairoStatus === 'waiting_confirmation' ? 'bg-amber-400 animate-bounce' :
            kairoStatus === 'paused' ? 'bg-pink-400' :
            kairoStatus === 'thinking' ? 'bg-indigo-400 animate-pulse' : 'bg-blue-400'
          }`} />
          <span>KAIRO</span>
        </div>
      </div>

      {/* Dynamic Island / Agent Status Pill */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-white/10 text-[11px] text-slate-300">
        <ShieldCheck className="w-3 h-3 text-purple-400" />
        <span className="text-slate-400 text-[10px]">Encrypted Tunnel</span>
      </div>

      {/* Connectivity & Battery */}
      <div className="flex items-center gap-2 text-slate-300">
        <div className="flex items-center gap-1 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-400 font-mono">5G</span>
        </div>
        <Wifi className="w-3.5 h-3.5 text-slate-300" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-slate-400">{Math.round(laptop.batteryLevel)}%</span>
          {laptop.isCharging ? (
            <div className="flex items-center text-emerald-400">
              <Zap className="w-3 h-3 fill-emerald-400" />
            </div>
          ) : (
            <Battery className="w-3.5 h-3.5 text-slate-300" />
          )}
        </div>
      </div>
    </div>
  );
};
