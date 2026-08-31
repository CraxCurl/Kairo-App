import React from 'react';
import { 
  Laptop, 
  Cpu, 
  HardDrive, 
  BatteryCharging, 
  Battery, 
  Power,
  GitBranch,
  Terminal
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export const LaptopStatusCard: React.FC = () => {
  const { laptop, toggleLaptopOnline } = useKairo();

  return (
    <div className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] transition-all shadow-vercel-sm">
      {/* Top Header: Device Name & Live Status */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#111111] border border-[#262626] flex items-center justify-center text-white">
            <Laptop className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-xs text-white font-sans tracking-tight">
                {laptop.deviceName}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#666666] font-mono">
              <span>{laptop.ipAddress}</span>
              <span>&bull;</span>
              <span>{laptop.os}</span>
            </div>
          </div>
        </div>

        {/* Status Pill & Power button */}
        <div className="flex items-center gap-2">
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium flex items-center gap-1.5 border ${
            laptop.online 
              ? 'bg-[#002B1B] border-[#00E599]/40 text-[#00E599]' 
              : 'bg-[#141414] border-[#2A2A2A] text-[#666666]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              laptop.online ? 'bg-[#00E599] animate-pulse' : 'bg-[#555555]'
            }`} />
            <span>{laptop.online ? 'Ready' : 'Offline'}</span>
          </div>

          <button
            onClick={toggleLaptopOnline}
            title={laptop.online ? 'Simulate Disconnect' : 'Simulate Reconnect'}
            className="p-1 rounded-lg bg-[#111111] hover:bg-[#1C1C1C] border border-[#242424] text-[#666666] hover:text-white transition-colors"
          >
            <Power className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Metrics Row: CPU, RAM, Battery */}
      <div className="grid grid-cols-3 gap-2 pt-3">
        {/* CPU Load */}
        <div className="p-2.5 rounded-xl bg-[#111111] border border-[#1F1F1F]">
          <div className="flex items-center justify-between text-[10px] text-[#888888] font-mono mb-1.5">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#666666]" />
              <span>CPU</span>
            </span>
            <span className="text-white font-medium">{laptop.online ? `${laptop.cpuLoad}%` : '--'}</span>
          </div>
          <div className="w-full h-1 rounded-full bg-[#1F1F1F] overflow-hidden">
            <div 
              className="h-full rounded-full bg-white transition-all duration-500" 
              style={{ width: laptop.online ? `${laptop.cpuLoad}%` : '0%' }}
            />
          </div>
        </div>

        {/* RAM Usage */}
        <div className="p-2.5 rounded-xl bg-[#111111] border border-[#1F1F1F]">
          <div className="flex items-center justify-between text-[10px] text-[#888888] font-mono mb-1.5">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-[#666666]" />
              <span>RAM</span>
            </span>
            <span className="text-white font-medium">{laptop.online ? `${laptop.ramUsage}%` : '--'}</span>
          </div>
          <div className="w-full h-1 rounded-full bg-[#1F1F1F] overflow-hidden">
            <div 
              className="h-full rounded-full bg-white transition-all duration-500" 
              style={{ width: laptop.online ? `${laptop.ramUsage}%` : '0%' }}
            />
          </div>
        </div>

        {/* Battery Power */}
        <div className="p-2.5 rounded-xl bg-[#111111] border border-[#1F1F1F]">
          <div className="flex items-center justify-between text-[10px] text-[#888888] font-mono mb-1.5">
            <span className="flex items-center gap-1">
              {laptop.isCharging ? (
                <BatteryCharging className="w-3 h-3 text-[#00E599]" />
              ) : (
                <Battery className="w-3 h-3 text-[#666666]" />
              )}
              <span>PWR</span>
            </span>
            <span className="text-white font-medium">{Math.round(laptop.batteryLevel)}%</span>
          </div>
          <div className="w-full h-1 rounded-full bg-[#1F1F1F] overflow-hidden">
            <div 
              className="h-full rounded-full bg-[#00E599] transition-all duration-500" 
              style={{ width: `${laptop.batteryLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Process Branch Indicator */}
      {laptop.online && laptop.activeApp && (
        <div className="mt-2.5 pt-2 border-t border-[#1A1A1A] flex items-center justify-between text-[11px] font-mono">
          <span className="text-[#666666] flex items-center gap-1">
            <Terminal className="w-3 h-3" />
            <span>Active Window:</span>
          </span>
          <span className="text-[#EDEDED] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0070F3] animate-ping" />
            {laptop.activeApp}
          </span>
        </div>
      )}
    </div>
  );
};
