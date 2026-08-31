import React from 'react';
import { History, ArrowUpRight, CheckCircle, ShieldAlert, Laptop, Terminal, Sparkles } from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

interface RecentTimelineWidgetProps {
  onGoToHistory: () => void;
}

export const RecentTimelineWidget: React.FC<RecentTimelineWidgetProps> = ({ onGoToHistory }) => {
  const { timeline } = useKairo();
  const recentEvents = timeline.slice(0, 4);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'startup': return <Laptop className="w-3 h-3 text-emerald-400" />;
      case 'task_complete': return <CheckCircle className="w-3 h-3 text-emerald-400" />;
      case 'confirmation_approved': return <ShieldAlert className="w-3 h-3 text-purple-400" />;
      case 'confirmation_denied': return <ShieldAlert className="w-3 h-3 text-red-400" />;
      case 'app_launch': return <Terminal className="w-3 h-3 text-indigo-400" />;
      default: return <Sparkles className="w-3 h-3 text-purple-400" />;
    }
  };

  return (
    <div className="w-full p-4 rounded-3xl bg-[#11121C]/80 border border-white/[0.08] shadow-md backdrop-blur-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-xs text-white tracking-wide">
            Live Activity Timeline
          </h3>
        </div>
        <button 
          onClick={onGoToHistory}
          className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-0.5 group"
        >
          <span>Full History</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Timeline items list */}
      <div className="relative pl-3 space-y-2.5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
        {recentEvents.map((evt) => (
          <div key={evt.id} className="relative flex items-start gap-2.5 text-xs">
            <div className="w-3.5 h-3.5 rounded-full bg-[#18192A] border border-white/10 flex items-center justify-center -ml-[7px] mt-0.5 z-10">
              {getEventIcon(evt.type)}
            </div>
            <div className="flex-1 flex items-baseline justify-between gap-2">
              <span className="text-slate-300 font-medium leading-snug">
                {evt.title}
              </span>
              <span className="text-[10px] text-slate-500 font-mono shrink-0">
                {evt.timeFormatted}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
