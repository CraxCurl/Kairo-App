import React from 'react';
import { 
  LayoutDashboard, 
  ListOrdered, 
  Mic, 
  History, 
  Settings2,
  Plus
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export type TabType = 'dashboard' | 'queue' | 'voice' | 'history' | 'settings';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenCreateTask: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentTab, 
  onSelectTab, 
  onOpenCreateTask 
}) => {
  const { tasks, kairoStatus } = useKairo();
  const queueCount = tasks.filter(t => t.status === 'waiting' || t.status === 'in_progress').length;

  const navItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'queue' as TabType, label: 'Queue', icon: ListOrdered, badge: queueCount },
    { id: 'voice' as TabType, label: 'Voice AI', icon: Mic, isSpecialVoice: true },
    { id: 'history' as TabType, label: 'Timeline', icon: History },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings2 },
  ];

  return (
    <div className="w-full fixed bottom-0 left-0 right-0 z-30 px-3 pb-4 pt-2 pointer-events-none flex justify-center max-w-lg mx-auto">
      <div className="w-full bg-[#11121C]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-3xl p-1.5 flex items-center justify-around pointer-events-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.isSpecialVoice) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab('voice')}
                className="relative -top-4 group flex flex-col items-center focus:outline-none"
              >
                <div className={`w-14 h-14 rounded-full p-[2px] transition-transform duration-300 group-hover:scale-105 active:scale-95 ${
                  isActive 
                    ? 'bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 shadow-glow-md' 
                    : 'bg-gradient-to-tr from-purple-900 to-indigo-800 shadow-lg'
                }`}>
                  <div className="w-full h-full rounded-full bg-[#0E0F1A] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors" />
                    <Mic className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-purple-300 animate-pulse' : 'text-slate-300'
                    }`} />
                  </div>
                </div>
                <span className={`text-[10px] font-semibold mt-0.5 tracking-tight transition-colors ${
                  isActive ? 'text-purple-300' : 'text-slate-400'
                }`}>
                  Voice
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 relative group active:scale-95 ${
                isActive 
                  ? 'text-purple-300 bg-purple-500/10' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-purple-400' : 'group-hover:scale-105'
                }`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-1 tracking-tight ${
                isActive ? 'text-purple-300 font-semibold' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-purple-400 mt-0.5 shadow-glow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
