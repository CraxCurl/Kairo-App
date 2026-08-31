import React from 'react';
import { TrendingUp, CheckCircle2, Activity } from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export const ProgressWidget: React.FC = () => {
  const { tasks } = useKairo();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const waitingTasks = tasks.filter(t => t.status === 'waiting').length;
  
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] transition-all shadow-vercel-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-white" />
          <h3 className="font-semibold text-xs text-white tracking-tight font-sans">
            Throughput & Analytics
          </h3>
        </div>
        <span className="text-[11px] text-[#666666] font-mono">
          {completedTasks}/{totalTasks} tasks resolved
        </span>
      </div>

      <div className="flex items-center gap-5 pt-3">
        {/* Ring */}
        <div className="relative flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#1F1F1F"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-bold text-white font-mono">{percentage}%</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-1 space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#888888] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>Completed</span>
            </span>
            <span className="text-white font-medium">{completedTasks}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#888888] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
              <span>In Pipeline</span>
            </span>
            <span className="text-white font-medium">{inProgressTasks}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#888888] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#444444]" />
              <span>Queued</span>
            </span>
            <span className="text-white font-medium">{waitingTasks}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
