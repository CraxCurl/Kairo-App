import React from 'react';
import { CheckCircle2, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export const ProgressWidget: React.FC = () => {
  const { tasks } = useKairo();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const waitingTasks = tasks.filter(t => t.status === 'waiting').length;
  
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate stroke dash for SVG circle
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full p-4 rounded-3xl bg-[#11121C]/80 border border-white/[0.08] shadow-md backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-xs text-white tracking-wide">
            Today&apos;s Productivity
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {completedTasks}/{totalTasks} Tasks Done
        </span>
      </div>

      <div className="flex items-center gap-4 pt-3">
        {/* Circular Progress Ring */}
        <div className="relative flex items-center justify-center">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="url(#progress-gradient)"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C6EF8" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-extrabold text-white font-mono">{percentage}%</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Done</span>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Completed</span>
            </span>
            <span className="font-semibold text-slate-200 font-mono">{completedTasks}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>Active Agent</span>
            </span>
            <span className="font-semibold text-slate-200 font-mono">{inProgressTasks}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              <span>In Queue</span>
            </span>
            <span className="font-semibold text-slate-200 font-mono">{waitingTasks}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
