import React from 'react';
import { 
  LayoutDashboard, 
  ListOrdered, 
  Mic, 
  History, 
  Settings2,
  Terminal
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
  onSelectTab 
}) => {
  const { tasks } = useKairo();
  const queueCount = tasks.filter(t => t.status === 'waiting' || t.status === 'in_progress').length;

  const navItems = [
    { id: 'dashboard' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'queue' as TabType, label: 'Queue', icon: ListOrdered, badge: queueCount },
    { id: 'voice' as TabType, label: 'Voice AI', icon: Mic, isVoice: true },
    { id: 'history' as TabType, label: 'Logs', icon: History },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings2 },
  ];

  return (
    <div role="navigation" aria-label="Bottom navigation" className="w-full fixed bottom-0 left-0 right-0 z-30 px-4 pb-4 pt-2 pointer-events-none flex justify-center max-w-lg mx-auto">
      <div className="w-full bg-[#0A0A0A]/95 backdrop-blur-2xl border border-[#242424] shadow-[0_15px_40px_rgba(0,0,0,0.9)] rounded-2xl p-1 flex items-center justify-around pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.isVoice) {
            return (
               <button
                 key={item.id}
                 onClick={() => onSelectTab('voice')}
                 aria-label="voice"
                 className="relative -top-3 group flex flex-col items-center min-w-[48px] min-h-[48px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00DFD8]"
               >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-black shadow-vercel-glow scale-105' 
                    : 'bg-[#141414] text-[#EDEDED] border border-[#2E2E2E] hover:border-white/40'
                }`}>
                  <Mic className={`w-5 h-5 ${isActive ? 'text-black' : 'text-white'}`} />
                </div>
                <span className={`text-[10px] font-mono mt-0.5 transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-[#666666]'
                }`}>
                  voice
                </span>
              </button>
            );
          }

          return <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                aria-label={item.label}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl min-w-[48px] min-h-[48px] transition-all duration-150 relative active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00DFD8] ${
                  isActive 
                    ? 'text-white bg-[#141414]' 
                    : 'text-[#666666] hover:text-[#A1A1A1]'
                }`}
              >
              <div className="relative">
                <Icon className={`w-4 h-4 transition-transform ${
                  isActive ? 'scale-105 text-white' : ''
                }`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[13px] h-[13px] rounded-full bg-white text-black font-mono text-[8px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-mono mt-1 ${
                isActive ? 'text-white font-medium' : 'text-[#666666]'
              }`}>
                {item.label.toLowerCase()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
