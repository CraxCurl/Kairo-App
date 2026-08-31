import React, { useState } from 'react';
import { 
  Laptop, 
  Bell, 
  Sparkles, 
  Power, 
  AlertTriangle,
  RefreshCw,
  Sliders,
  CheckCircle2,
  PauseCircle,
  PlayCircle
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenCreateTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, onOpenCreateTask }) => {
  const { 
    laptop, 
    kairoStatus, 
    unreadNotificationCount, 
    toggleLaptopOnline, 
    pauseKairo, 
    resumeKairo,
    triggerMockConfirmation,
    confirmationQueue
  } = useKairo();

  const [showQuickMenu, setShowQuickMenu] = useState(false);

  return (
    <div className="w-full px-5 pt-3 pb-3 bg-[#090A0F]/80 backdrop-blur-xl border-b border-white/[0.06] sticky top-[41px] z-20">
      <div className="flex items-center justify-between">
        {/* Left: Kairo Brand & Glow Orb */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => setShowQuickMenu(!showQuickMenu)}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-violet-400 p-[1.5px] shadow-glow-sm transition-transform active:scale-95">
              <div className="w-full h-full bg-[#0E0F1A] rounded-[14px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent" />
                <Sparkles className="w-5 h-5 text-purple-300 transition-transform group-hover:rotate-12" />
              </div>
            </div>
            {/* Pulsing indicator */}
            {kairoStatus === 'executing' && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-purple-500 rounded-full border-2 border-[#090A0F] animate-pulse" />
            )}
            {confirmationQueue.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-[#090A0F] flex items-center justify-center text-[8px] font-bold text-black animate-bounce">
                !
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-wider text-white font-sans">
                KAIRO
              </h1>
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 font-semibold border border-purple-800/40">
                Companion
              </span>
            </div>
            {/* Subtitle status line */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <button 
                onClick={toggleLaptopOnline}
                title="Click to toggle laptop Online/Offline simulation"
                className="flex items-center gap-1 hover:text-white transition-colors group"
              >
                <span className={`w-2 h-2 rounded-full transition-all ${
                  laptop.online 
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' 
                    : 'bg-slate-500'
                }`} />
                <span className="text-[11px] font-medium text-slate-300 group-hover:underline">
                  {laptop.online ? 'Laptop Online' : 'Laptop Offline'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Quick actions & Notification Bell */}
        <div className="flex items-center gap-2">
          {/* Quick confirmation alert badge if pending */}
          {confirmationQueue.length > 0 && (
            <button 
              onClick={() => {}}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Needs Auth</span>
            </button>
          )}

          {/* Quick Pause/Resume Button */}
          {laptop.online && (
            <button
              onClick={() => {
                if (kairoStatus === 'executing') pauseKairo();
                else resumeKairo();
              }}
              title={kairoStatus === 'executing' ? 'Pause Kairo' : 'Resume Kairo'}
              className={`p-2 rounded-xl border transition-all ${
                kairoStatus === 'executing' 
                  ? 'bg-purple-950/40 border-purple-500/30 text-purple-300 hover:bg-purple-900/50' 
                  : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50'
              }`}
            >
              {kairoStatus === 'executing' ? (
                <PauseCircle className="w-4 h-4" />
              ) : (
                <PlayCircle className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Notification Bell */}
          <button 
            onClick={onOpenNotifications}
            className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:border-purple-500/40 transition-all relative active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center shadow-glow-sm">
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick menu drawer if tapped brand */}
      {showQuickMenu && (
        <div className="mt-3 p-3 rounded-2xl bg-[#121320] border border-purple-500/20 shadow-xl text-xs space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="font-semibold text-slate-200">Agent Quick Simulator</span>
            <button 
              onClick={() => setShowQuickMenu(false)}
              className="text-slate-400 hover:text-white text-[11px]"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => {
                toggleLaptopOnline();
                setShowQuickMenu(false);
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-left border border-white/5 flex items-center gap-2"
            >
              <Power className={`w-3.5 h-3.5 ${laptop.online ? 'text-red-400' : 'text-emerald-400'}`} />
              <span className="text-slate-300 text-[11px]">
                {laptop.online ? 'Simulate Disconnect' : 'Simulate Connect'}
              </span>
            </button>
            <button 
              onClick={() => {
                triggerMockConfirmation();
                setShowQuickMenu(false);
              }}
              className="p-2 rounded-xl bg-amber-950/30 hover:bg-amber-900/40 text-left border border-amber-500/30 flex items-center gap-2"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-200 text-[11px]">
                Trigger Auth Prompt
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
