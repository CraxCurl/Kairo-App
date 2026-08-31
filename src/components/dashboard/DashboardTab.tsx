import React from 'react';
import { Sparkles, Plus, Mic, ArrowRight } from 'lucide-react';
import { LaptopStatusCard } from './LaptopStatusCard';
import { KairoStatusCard } from './KairoStatusCard';
import { CurrentTaskCard } from './CurrentTaskCard';
import { UpcomingTaskCard } from './UpcomingTaskCard';
import { ProgressWidget } from './ProgressWidget';
import { RecentTimelineWidget } from './RecentTimelineWidget';
import { TabType } from '../common/BottomNav';

interface DashboardTabProps {
  onSelectTab: (tab: TabType) => void;
  onOpenCreateTask: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ 
  onSelectTab, 
  onOpenCreateTask 
}) => {
  return (
    <div className="w-full space-y-4 pb-28 pt-1">
      {/* Quick AI Task Creator Prompt Bar */}
      <div 
        onClick={onOpenCreateTask}
        className="w-full p-3 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-[#121322] border border-purple-500/30 shadow-glow-sm flex items-center justify-between gap-3 cursor-pointer hover:border-purple-500/50 transition-all group"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs text-slate-300 font-medium truncate group-hover:text-white transition-colors">
            &ldquo;Tomorrow when I open laptop, remind me to...&rdquo;
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">AI Create</span>
          <ArrowRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Laptop Online Telemetry */}
      <LaptopStatusCard />

      {/* Kairo AI Agent Status */}
      <KairoStatusCard />

      {/* Current Task Hero */}
      <CurrentTaskCard />

      {/* Upcoming Task preview */}
      <UpcomingTaskCard onGoToQueue={() => onSelectTab('queue')} />

      {/* Today's Progress Stats */}
      <ProgressWidget />

      {/* Recent Timeline */}
      <RecentTimelineWidget onGoToHistory={() => onSelectTab('history')} />
    </div>
  );
};
