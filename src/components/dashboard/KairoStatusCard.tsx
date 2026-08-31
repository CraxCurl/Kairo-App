import React from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Activity,
  Terminal,
  ShieldAlert
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export const KairoStatusCard: React.FC = () => {
  const { 
    kairoStatus, 
    currentTask, 
    pauseKairo, 
    resumeKairo, 
    triggerMockConfirmation
  } = useKairo();

  const getStatusConfig = () => {
    switch (kairoStatus) {
      case 'executing':
        return {
          title: 'Agent Pipeline Running',
          desc: currentTask ? `Active task: ${currentTask.name}` : 'Processing queued workflows...',
          badge: 'Executing',
          badgeColor: 'bg-[#002B1B] border-[#00E599]/40 text-[#00E599]',
          dotColor: 'bg-[#00E599]'
        };
      case 'waiting_confirmation':
        return {
          title: 'Awaiting Authorization',
          desc: 'Kairo requires explicit remote confirmation to proceed.',
          badge: 'Auth Required',
          badgeColor: 'bg-[#1F1500] border-[#F5A623]/40 text-[#F5A623]',
          dotColor: 'bg-[#F5A623]'
        };
      case 'paused':
        return {
          title: 'Pipeline Paused',
          desc: 'Execution on hold. Click resume to continue workflow.',
          badge: 'Paused',
          badgeColor: 'bg-[#2B0E1E] border-[#FF0080]/40 text-[#FF0080]',
          dotColor: 'bg-[#FF0080]'
        };
      case 'thinking':
        return {
          title: 'LLM Synthesizing Plan',
          desc: 'Local agent reasoning and constructing step pipeline...',
          badge: 'Synthesizing',
          badgeColor: 'bg-[#1A0A2E] border-[#7928CA]/40 text-[#A78BFA]',
          dotColor: 'bg-[#7928CA]'
        };
      default:
        return {
          title: 'Agent Idle',
          desc: 'Standing by for new commands or next laptop startup trigger.',
          badge: 'Idle',
          badgeColor: 'bg-[#141414] border-[#2A2A2A] text-[#888888]',
          dotColor: 'bg-[#888888]'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="w-full p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] transition-all shadow-vercel-sm">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Indicator & Status */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#111111] border border-[#262626] flex items-center justify-center relative">
            <svg viewBox="0 0 100 85" className="w-3.5 h-3.5 fill-white">
              <polygon points="50,0 100,85 0,85" />
            </svg>
            <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${config.dotColor} ${kairoStatus === 'executing' ? 'animate-pulse' : ''}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xs text-white font-sans">
                {config.title}
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${config.badgeColor}`}>
                {config.badge}
              </span>
            </div>
            <p className="text-[11px] text-[#888888] line-clamp-1 mt-0.5 font-sans">
              {config.desc}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div>
          {kairoStatus === 'executing' ? (
            <button
              onClick={pauseKairo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-[#282828] text-white text-xs font-mono font-medium transition-all active:scale-95"
            >
              <Pause className="w-3 h-3" />
              <span>pause</span>
            </button>
          ) : kairoStatus === 'paused' ? (
            <button
              onClick={resumeKairo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#EAEAEA] text-black text-xs font-mono font-semibold transition-all active:scale-95 shadow-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>resume</span>
            </button>
          ) : (
            <button
              onClick={triggerMockConfirmation}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1C1C1C] border border-[#282828] text-[#A1A1A1] hover:text-white text-xs font-mono transition-all"
            >
              <span>auth_test</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
