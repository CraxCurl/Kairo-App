import React, { useState, useEffect } from 'react';
import { Wifi, Battery, BatteryCharging, Shield, Activity, Zap } from 'lucide-react';
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
    <div className="w-full pt-3 pb-2 px-5 flex items-center justify-between text-xs text-[#888888] select-none border-b border-[#1A1A1A] bg-[#000000]/95 backdrop-blur-xl sticky top-0 z-30 font-mono">
      {/* Time & Agent Moniker */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-white tracking-tight">{time || '09:41'}</span>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#111111] border border-[#262626] text-[10px] text-[#EDEDED]">
          <span className={`w-1.5 h-1.5 rounded-full ${
            kairoStatus === 'executing' ? 'bg-[#0070F3] animate-ping' :
            kairoStatus === 'waiting_confirmation' ? 'bg-[#F5A623] animate-bounce' :
            kairoStatus === 'paused' ? 'bg-[#FF0080]' :
            kairoStatus === 'thinking' ? 'bg-[#7928CA] animate-pulse' : 'bg-[#888888]'
          }`} />
          <span className="font-sans font-semibold tracking-wider text-[9px] uppercase">KAIRO</span>
        </div>
      </div>

      {/* Connectivity & Telemetry */}
      <div className="flex items-center gap-3 text-[#A1A1A1]">
        <div className="flex items-center gap-1 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E599]" />
          <span>EDGE</span>
        </div>
        <Wifi className="w-3.5 h-3.5 text-[#888888]" />
        <div className="flex items-center gap-1">
          <span className="text-[10px]">{Math.round(laptop.batteryLevel)}%</span>
          {laptop.isCharging ? (
            <Zap className="w-3 h-3 text-[#00E599] fill-current" />
          ) : (
            <Battery className="w-3.5 h-3.5 text-[#888888]" />
          )}
        </div>
      </div>
    </div>
  );
};
