import React from 'react';
import { 
  Laptop, 
  Cpu, 
  HardDrive, 
  BatteryCharging, 
  Battery, 
  Activity,
  Radio,
  Power
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export const LaptopStatusCard: React.FC = () => {
  const { laptop, toggleLaptopOnline } = useKairo();

  return (
    <div className="w-full p-4 rounded-3xl bg-[#11121C]/80 border border-white/[0.08] shadow-lg relative overflow-hidden backdrop-blur-xl">
      {/* Background subtle mesh */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-all ${
        laptop.online ? 'bg-emerald-500/10' : 'bg-red-500/10'
      }`} />

      {/* Top Header: Device & Status */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center border transition-all ${
            laptop.online 
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.2)]' 
              : 'bg-slate-900 border-white/10 text-slate-500'
          }`}>
            <Laptop className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs text-white tracking-tight">
                {laptop.deviceName}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span>{laptop.ipAddress}</span>
              <span>&bull;</span>
              <span className="text-slate-500">{laptop.os}</span>
            </div>
          </div>
        </div>

        {/* Status Pill & Power button */}
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 border transition-all ${
            laptop.online 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-glow-success' 
              : 'bg-slate-800/80 border-slate-700 text-slate-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              laptop.online ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
            }`} />
            <span>{laptop.online ? 'Online' : 'Offline'}</span>
          </div>

          <button
            onClick={toggleLaptopOnline}
            title={laptop.online ? 'Simulate Laptop Disconnect' : 'Simulate Laptop Reconnect'}
            className="p-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <Power className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 pt-3">
        {/* CPU */}
        <div className="p-2.5 rounded-2xl bg-[#161726]/60 border border-white/[0.04]">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-purple-400" />
              <span>CPU</span>
            </span>
            <span className="font-mono text-slate-200">{laptop.online ? `${laptop.cpuLoad}%` : '--'}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500" 
              style={{ width: laptop.online ? `${laptop.cpuLoad}%` : '0%' }}
            />
          </div>
        </div>

        {/* RAM */}
        <div className="p-2.5 rounded-2xl bg-[#161726]/60 border border-white/[0.04]">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-indigo-400" />
              <span>RAM</span>
            </span>
            <span className="font-mono text-slate-200">{laptop.online ? `${laptop.ramUsage}%` : '--'}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-400 transition-all duration-500" 
              style={{ width: laptop.online ? `${laptop.ramUsage}%` : '0%' }}
            />
          </div>
        </div>

        {/* Battery / Active App */}
        <div className="p-2.5 rounded-2xl bg-[#161726]/60 border border-white/[0.04]">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              {laptop.isCharging ? (
                <BatteryCharging className="w-3 h-3 text-emerald-400" />
              ) : (
                <Battery className="w-3 h-3 text-emerald-400" />
              )}
              <span>Power</span>
            </span>
            <span className="font-mono text-slate-200">{Math.round(laptop.batteryLevel)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full rounded-full bg-emerald-400 transition-all duration-500" 
              style={{ width: `${laptop.batteryLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active App Strip */}
      {laptop.online && laptop.activeApp && (
        <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Foreground App:</span>
          <span className="font-medium text-purple-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            {laptop.activeApp}
          </span>
        </div>
      )}
    </div>
  );
};
