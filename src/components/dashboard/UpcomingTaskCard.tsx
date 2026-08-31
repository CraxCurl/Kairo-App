import React from 'react';
import { Clock, ArrowUpRight, Play, Tag, Calendar } from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

interface UpcomingTaskCardProps {
  onGoToQueue: () => void;
}

export const UpcomingTaskCard: React.FC<UpcomingTaskCardProps> = ({ onGoToQueue }) => {
  const { upcomingTask, startTask } = useKairo();

  if (!upcomingTask) return null;

  const formatTrigger = (trigger: string) => {
    switch (trigger) {
      case 'next_startup': return 'Next Laptop Startup';
      case 'today': return 'Today';
      case 'tomorrow': return 'Tomorrow';
      case 'after_task': return 'After Current Task';
      default: return 'Scheduled';
    }
  };

  return (
    <div className="w-full p-4 rounded-3xl bg-[#11121C]/80 border border-white/[0.08] shadow-md backdrop-blur-xl space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Up Next In Queue
          </span>
          <span className="px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-[10px] font-semibold text-purple-300">
            #2 in line
          </span>
        </div>

        <button 
          onClick={onGoToQueue}
          className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-0.5 group"
        >
          <span>View Queue</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1">
          <h3 className="text-sm font-bold text-white leading-snug">
            {upcomingTask.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <Calendar className="w-3 h-3 text-purple-400" />
              <span>{formatTrigger(upcomingTask.trigger)}</span>
            </span>
            {upcomingTask.estimatedDuration && (
              <>
                <span>&bull;</span>
                <span className="text-slate-400">~{upcomingTask.estimatedDuration} mins</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Start Button */}
        <button
          onClick={() => startTask(upcomingTask.id)}
          className="flex items-center gap-1 py-1.5 px-3 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all active:scale-95 shadow-sm"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Start Now</span>
        </button>
      </div>
    </div>
  );
};
