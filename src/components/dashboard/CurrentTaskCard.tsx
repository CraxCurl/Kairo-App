import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Check, 
  Loader2, 
  Clock, 
  ShieldCheck,
  GitCommit,
  ArrowRight
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export const CurrentTaskCard: React.FC = () => {
  const { 
    currentTask, 
    kairoStatus, 
    pauseKairo, 
    resumeKairo, 
    skipCurrentTask, 
    completeCurrentTask, 
    startTask
  } = useKairo();

  const [showLogs, setShowLogs] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  if (!currentTask) {
    return (
      <div className="w-full p-6 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-center space-y-2">
        <div className="w-8 h-8 rounded-xl bg-[#111111] mx-auto flex items-center justify-center text-[#666666]">
          <Clock className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-semibold text-white font-sans">No Active Pipeline</h3>
        <p className="text-[11px] text-[#666666] font-mono">
          Task queue is empty. Dispatch a command via AI prompt or voice.
        </p>
      </div>
    );
  }

  const isPaused = kairoStatus === 'paused' || currentTask.status === 'paused';
  const isInProgress = currentTask.status === 'in_progress';

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl bg-[#0A0A0A] border border-[#262626] hover:border-[#383838] transition-all shadow-vercel-sm relative overflow-hidden">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#888888]">
            active_task
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
            currentTask.priority === 'critical' ? 'bg-[#330000] text-[#FF4444] border border-[#FF0000]/30' :
            currentTask.priority === 'high' ? 'bg-[#1F1500] text-[#F5A623] border border-[#F5A623]/30' :
            'bg-[#111111] text-[#A1A1A1] border border-[#262626]'
          }`}>
            p:{currentTask.priority}
          </span>
          {currentTask.requiresConfirmation && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#111111] text-[10px] font-mono text-[#F5A623] border border-[#262626]">
              <ShieldCheck className="w-3 h-3 text-[#F5A623]" />
              <span>auth_guard</span>
            </span>
          )}
        </div>

        {/* State Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {isInProgress && !isPaused && (
            <span className="flex items-center gap-1 text-[#00E599]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>building ({currentTask.progress}%)</span>
            </span>
          )}
          {isPaused && (
            <span className="flex items-center gap-1 text-[#FF0080]">
              <Pause className="w-3 h-3" />
              <span>paused</span>
            </span>
          )}
          {currentTask.status === 'waiting' && (
            <span className="text-[#666666]">queued</span>
          )}
        </div>
      </div>

      {/* Main Task Title & Description */}
      <div className="pt-3 pb-2 space-y-1">
        <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug font-sans">
          {currentTask.name}
        </h2>
        {currentTask.description && (
          <p className="text-xs text-[#888888] leading-relaxed line-clamp-2 font-sans">
            {currentTask.description}
          </p>
        )}
      </div>

      {/* Tags & Estimated Duration */}
      <div className="flex flex-wrap items-center gap-1.5 py-1">
        {currentTask.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-md bg-[#111111] border border-[#222222] font-mono text-[10px] text-[#A1A1A1]">
            #{tag}
          </span>
        ))}
        {currentTask.estimatedDuration && (
          <span className="px-2 py-0.5 rounded-md bg-[#111111] border border-[#222222] font-mono text-[10px] text-[#666666] flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            <span>~{currentTask.estimatedDuration}m</span>
          </span>
        )}
      </div>

      {/* Progress Bar in Solid White / Vercel style */}
      <div className="py-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#666666]">Pipeline Execution</span>
          <span className="text-white font-medium">{currentTask.progress}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#1A1A1A] overflow-hidden">
          <div 
            className="h-full rounded-full bg-white transition-all duration-700" 
            style={{ width: `${currentTask.progress}%` }}
          />
        </div>
      </div>

      {/* Execution Pipeline Steps */}
      {currentTask.steps && currentTask.steps.length > 0 && (
        <div className="mt-1 border-t border-[#1A1A1A] pt-2">
          <button 
            onClick={() => setShowSteps(!showSteps)}
            className="w-full flex items-center justify-between py-1 text-xs text-[#888888] hover:text-white transition-colors font-mono"
          >
            <span className="font-medium text-white">
              Steps ({currentTask.steps.filter(s => s.completed).length}/{currentTask.steps.length})
            </span>
            {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showSteps && (
            <div className="space-y-1.5 mt-2">
              {currentTask.steps.map((step) => (
                <div 
                  key={step.id} 
                  className={`p-2 rounded-xl flex items-start gap-2.5 text-xs transition-all ${
                    step.completed 
                      ? 'bg-[#111111] text-[#666666] line-through' 
                      : step.current 
                      ? 'bg-[#141414] border border-[#333333] text-white font-medium' 
                      : 'bg-[#0E0E0E] text-[#666666]'
                  }`}
                >
                  <div className="mt-0.5">
                    {step.completed ? (
                      <div className="w-3.5 h-3.5 rounded-full bg-[#00E599]/20 text-[#00E599] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : step.current ? (
                      <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-[#333333]" />
                    )}
                  </div>
                  <span className="flex-1 leading-snug font-mono text-[11px]">{step.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Live Terminal Logs Toggle */}
      {currentTask.executionLogs && currentTask.executionLogs.length > 0 && (
        <div className="mt-2">
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-1.5 text-[11px] font-mono text-[#888888] hover:text-white transition-colors py-1"
          >
            <Terminal className="w-3 h-3" />
            <span>{showLogs ? 'hide build logs' : 'view runtime logs'}</span>
          </button>

          {showLogs && (
            <div className="mt-1.5 p-3 rounded-xl bg-black border border-[#222222] font-mono text-[10px] text-[#A1A1A1] space-y-1 max-h-32 overflow-y-auto">
              {currentTask.executionLogs.map((log, i) => (
                <div key={i} className="text-[#00E599]">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Bar (Vercel Style) */}
      <div className="grid grid-cols-4 gap-2 pt-3 mt-3 border-t border-[#1A1A1A]">
        {/* Pause / Resume / Start */}
        {currentTask.status === 'waiting' ? (
          <button
            onClick={() => startTask(currentTask.id)}
            className="col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl vercel-btn-primary text-xs font-semibold"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Deploy / Start</span>
          </button>
        ) : isPaused ? (
          <button
            onClick={resumeKairo}
            className="col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl vercel-btn-primary text-xs font-semibold"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Resume</span>
          </button>
        ) : (
          <button
            onClick={pauseKairo}
            className="col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl vercel-btn-secondary text-xs font-medium"
          >
            <Pause className="w-3 h-3" />
            <span>Pause</span>
          </button>
        )}

        {/* Skip */}
        <button
          onClick={skipCurrentTask}
          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl vercel-btn-secondary text-xs font-medium"
        >
          <SkipForward className="w-3 h-3" />
          <span>Skip</span>
        </button>

        {/* Complete */}
        <button
          onClick={completeCurrentTask}
          className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-white hover:bg-[#EAEAEA] text-black text-xs font-semibold rounded-xl"
        >
          <CheckCircle className="w-3 h-3 text-black" />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
};
