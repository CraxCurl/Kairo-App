import React from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  AlertCircle, 
  BrainCircuit, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export const KairoStatusCard: React.FC = () => {
  const { 
    kairoStatus, 
    currentTask, 
    pauseKairo, 
    resumeKairo, 
    confirmationQueue, 
    triggerMockConfirmation,
    laptop
  } = useKairo();

  const getStatusConfig = () => {
    switch (kairoStatus) {
      case 'executing':
        return {
          title: 'Executing Task',
          desc: currentTask ? `Actively running: "${currentTask.name}"` : 'Processing queued workflows...',
          badge: 'Executing',
          badgeColor: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
          orbClass: 'from-purple-600 via-indigo-600 to-pink-500 shadow-glow-md animate-pulse-subtle'
        };
      case 'waiting_confirmation':
        return {
          title: 'Waiting for Confirmation',
          desc: 'Kairo requires your permission before executing a command.',
          badge: 'Auth Needed',
          badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
          orbClass: 'from-amber-500 via-orange-600 to-yellow-400 shadow-glow-warning animate-bounce'
        };
      case 'paused':
        return {
          title: 'Kairo Paused',
          desc: 'Execution on hold. Click resume to continue your laptop workflow.',
          badge: 'Paused',
          badgeColor: 'bg-pink-500/20 border-pink-500/40 text-pink-300',
          orbClass: 'from-pink-600 via-rose-600 to-purple-600 opacity-80'
        };
      case 'thinking':
        return {
          title: 'Synthesizing Plan',
          desc: 'LLM agent is reasoning and planning next execution steps...',
          badge: 'Thinking',
          badgeColor: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
          orbClass: 'from-indigo-500 via-cyan-500 to-purple-500 animate-spin-slow'
        };
      default:
        return {
          title: 'Kairo Idle',
          desc: 'Standing by for new commands or next laptop startup trigger.',
          badge: 'Idle',
          badgeColor: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
          orbClass: 'from-blue-600 via-indigo-600 to-slate-700'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="w-full p-4 rounded-3xl bg-gradient-to-br from-[#121320] via-[#10111D] to-[#0D0E18] border border-purple-500/20 shadow-glow-sm relative overflow-hidden backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        {/* Left: Orb and Info */}
        <div className="flex items-center gap-3.5">
          {/* Animated AI Orb */}
          <div className="relative flex items-center justify-center">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${config.orbClass} p-0.5 flex items-center justify-center`}>
              <div className="w-full h-full rounded-full bg-[#0E0F1A] flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-white/10 animate-pulse" />
                <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
              </div>
            </div>
            {/* Wave ring */}
            <div className="absolute inset-0 rounded-full border border-purple-500/30 scale-125 animate-ping opacity-40 pointer-events-none" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-wide">
                {config.title}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.badgeColor}`}>
                {config.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
              {config.desc}
            </p>
          </div>
        </div>

        {/* Right: Quick Action toggle */}
        <div>
          {kairoStatus === 'executing' ? (
            <button
              onClick={pauseKairo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/30 text-pink-300 text-xs font-semibold transition-all active:scale-95 shadow-sm"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          ) : kairoStatus === 'paused' ? (
            <button
              onClick={resumeKairo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all active:scale-95 shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              onClick={triggerMockConfirmation}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all"
            >
              <span>Test Auth</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
