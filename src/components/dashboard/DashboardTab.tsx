import React from 'react';
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
    <div className="w-full space-y-4">
      {/* Vercel Command-K Prompt Bar */}
      <div 
        onClick={onOpenCreateTask}
        className="w-full p-3 rounded-2xl bg-[#0A0A0A] border border-[#262626] hover:border-[#444444] shadow-vercel-sm flex items-center justify-between gap-3 cursor-pointer transition-all group"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-[#141414] border border-[#2E2E2E] flex items-center justify-center text-white shrink-0 font-mono text-[10px]">
            &gt;_
          </div>
          <span className="text-xs text-[#888888] font-mono truncate group-hover:text-[#EDEDED] transition-colors">
            Ask Kairo to queue, schedule, or code...
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#141414] border border-[#262626] text-[#666666]">
            ⌘K
          </span>
        </div>
      </div>

      {/* Laptop Telemetry */}
      <LaptopStatusCard />

      {/* Agent Pipeline State */}
      <KairoStatusCard />

      {/* Active Pipeline Card */}
      <CurrentTaskCard onOpenCreateTask={onOpenCreateTask} />

      {/* Upcoming In Queue */}
      <UpcomingTaskCard onGoToQueue={() => onSelectTab('queue')} />

      {/* Analytics & Throughput */}
      <ProgressWidget />

      {/* Recent Activity */}
      <RecentTimelineWidget onGoToHistory={() => onSelectTab('history')} />
    </div>
  );
};
