import React from 'react';
import { ArrowUpRight, Play, Calendar } from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

interface UpcomingTaskCardProps {
  onGoToQueue: () => void;
}

export const UpcomingTaskCard: React.FC<UpcomingTaskCardProps> = ({ onGoToQueue }) => {
  const { upcomingTask, startTask } = useKairo();

  if (!upcomingTask) return null;

  const formatTrigger = (trigger: string) => {
    switch (trigger) {
      case 'next_startup': return 'next_boot';
      case 'today': return 'today';
      case 'tomorrow': return 'tomorrow';
      case 'after_task': return 'dependency';
      default: return 'scheduled';
    }
  };

  return (
    <div className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] transition-all space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#666666]">
            next_in_queue
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#141414] border border-[#242424] text-[9px] font-mono text-[#888888]">
            pos: 02
          </span>
        </div>

        <button 
          onClick={onGoToQueue}
          className="text-xs text-[#888888] hover:text-white font-mono flex items-center gap-1 group transition-colors"
        >
          <span>view queue</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <h3 className="text-xs font-semibold text-white leading-snug font-sans">
            {upcomingTask.name}
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-[#666666] font-mono">
            <span>trigger: {formatTrigger(upcomingTask.trigger)}</span>
            {upcomingTask.estimatedDuration && (
              <>
                <span>&bull;</span>
                <span>~{upcomingTask.estimatedDuration}m</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Start Button */}
        <button
          onClick={() => startTask(upcomingTask.id)}
          className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-[#282828] text-white text-xs font-mono transition-all active:scale-95"
        >
          <Play className="w-2.5 h-2.5 fill-current" />
          <span>start</span>
        </button>
      </div>
    </div>
  );
};
