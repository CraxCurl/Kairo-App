import React, { useState } from 'react';
import { 
  Bell, 
  Power, 
  AlertTriangle,
  Play,
  Pause,
  Terminal,
  Shield,
  ChevronDown
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenCreateTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
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
    <div className="w-full px-5 pt-3.5 pb-3.5 bg-[#000000]/90 backdrop-blur-xl border-b border-[#1A1A1A] sticky top-[41px] z-20">
      <div className="flex items-center justify-between">
        {/* Left: Vercel style project breadcrumb & triangle */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Vercel Geometric Glyph Logo */}
            <div className="w-8 h-8 rounded-xl bg-[#111111] border border-[#282828] flex items-center justify-center group-hover:border-white/40 transition-colors">
              <svg viewBox="0 0 100 85" className="w-3.5 h-3.5 fill-white transition-transform group-hover:scale-105">
                <polygon points="50,0 100,85 0,85" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-sm text-white tracking-tight font-sans">
                  kairo
                </h1>
                <span className="text-[#555555] font-mono text-xs">/</span>
                <span className="text-[#888888] font-mono text-xs truncate max-w-[110px]">
                  dev-station
                </span>
                <ChevronDown className="w-3 h-3 text-[#666666] group-hover:text-white transition-colors" />
              </div>

              {/* Status subline */}
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLaptopOnline();
                  }}
                  className="flex items-center gap-1.5 text-[#888888] hover:text-white transition-colors"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    laptop.online ? 'bg-[#00E599] shadow-[0_0_8px_#00E599]' : 'bg-[#555555]'
                  }`} />
                  <span className="font-mono text-[10px]">
                    {laptop.online ? 'production: online' : 'status: offline'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          {/* Auth Needed alert pill */}
          {confirmationQueue.length > 0 && (
            <button 
              onClick={onOpenNotifications}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1F1500] border border-[#F5A623]/60 text-[#F5A623] text-xs font-mono font-medium animate-pulse"
              title="Remote authorization required!"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>auth_req</span>
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
              className="p-2 rounded-xl bg-[#0A0A0A] hover:bg-[#141414] border border-[#242424] text-[#EDEDED] hover:border-[#444444] transition-all active:scale-95"
            >
              {kairoStatus === 'executing' ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current text-[#00E599]" />
              )}
            </button>
          )}

          {/* Notification Center */}
          <button 
            onClick={onOpenNotifications}
            className="p-2 rounded-xl bg-[#0A0A0A] hover:bg-[#141414] border border-[#242424] text-[#EDEDED] hover:border-[#444444] transition-all relative active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white text-black text-[9px] font-mono font-bold flex items-center justify-center">
                {unreadNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Simulation Drawer */}
      {showQuickMenu && (
        <div className="mt-3 p-3 rounded-2xl bg-[#0C0C0C] border border-[#262626] shadow-vercel-md text-xs space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#1F1F1F]">
            <span className="font-semibold text-white font-mono text-[11px]">Runtime Simulator</span>
            <button 
              onClick={() => setShowQuickMenu(false)}
              className="text-[#666666] hover:text-white font-mono text-[10px]"
            >
              [esc] close
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => {
                toggleLaptopOnline();
                setShowQuickMenu(false);
              }}
              className="p-2 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] text-left border border-[#282828] flex items-center gap-2 text-[#EDEDED]"
            >
              <Power className={`w-3.5 h-3.5 ${laptop.online ? 'text-[#FF0000]' : 'text-[#00E599]'}`} />
              <span className="font-mono text-[11px]">
                {laptop.online ? 'Simulate Disconnect' : 'Simulate Connect'}
              </span>
            </button>
            <button 
              onClick={() => {
                triggerMockConfirmation();
                setShowQuickMenu(false);
              }}
              className="p-2 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] text-left border border-[#282828] flex items-center gap-2 text-[#F5A623]"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">
                Trigger Auth Prompt
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
