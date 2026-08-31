import React from 'react';
import { History, ArrowUpRight, CheckCircle, Laptop, Terminal, GitCommit } from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

interface RecentTimelineWidgetProps {
  onGoToHistory: () => void;
}

export const RecentTimelineWidget: React.FC<RecentTimelineWidgetProps> = ({ onGoToHistory }) => {
  const { timeline } = useKairo();
  const recentEvents = timeline.slice(0, 4);

  return (
    <div className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] transition-all space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-3.5 h-3.5 text-white" />
          <h3 className="font-semibold text-xs text-white tracking-tight font-sans">
            Deployment Activity
          </h3>
        </div>
        <button 
          onClick={onGoToHistory}
          className="text-xs text-[#888888] hover:text-white font-mono flex items-center gap-1 group transition-colors"
        >
          <span>all logs</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Timeline items list */}
      <div className="space-y-2 font-mono text-xs">
        {recentEvents.map((evt) => (
          <div key={evt.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#111111] border border-[#1C1C1C]">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="w-1.5 h-1.5 rounded-full bg-[#555555] shrink-0" />
              <span className="text-[#EDEDED] text-[11px] truncate">
                {evt.title}
              </span>
            </div>
            <span className="text-[10px] text-[#666666] shrink-0">
              {evt.timeFormatted}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
