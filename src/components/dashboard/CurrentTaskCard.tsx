import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Check, 
  Loader2, 
  Tag, 
  Clock, 
  ShieldCheck,
  AlertCircle
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
    cancelTask,
    startTask
  } = useKairo();

  const [showLogs, setShowLogs] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  if (!currentTask) {
    return (
      <div className="w-full p-5 rounded-3xl bg-[#11121C]/80 border border-white/[0.08] text-center space-y-2">
        <div className="w-10 h-10 rounded-2xl bg-slate-900 mx-auto flex items-center justify-center text-slate-500">
          <Clock className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-300">No Task In Progress</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Your laptop queue is clear. Create a task using voice or natural language.
        </p>
      </div>
    );
  }

  const isPaused = kairoStatus === 'paused' || currentTask.status === 'paused';
  const isInProgress = currentTask.status === 'in_progress';

  return (
    <div className="w-full p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#131422] to-[#0E0F1A] border border-purple-500/25 shadow-glow-sm relative overflow-hidden backdrop-blur-xl">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
            Active Task
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            currentTask.priority === 'critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
            currentTask.priority === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
            'bg-blue-500/20 text-blue-300 border border-blue-500/30'
          }`}>
            {currentTask.priority}
          </span>
          {currentTask.requiresConfirmation && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 border border-white/5">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Auth Protected</span>
            </span>
          )}
        </div>

        {/* Status Chip */}
        <div className="flex items-center gap-1.5 text-xs">
          {isInProgress && !isPaused && (
            <span className="flex items-center gap-1 text-purple-300 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>In Progress</span>
            </span>
          )}
          {isPaused && (
            <span className="flex items-center gap-1 text-pink-300 font-medium">
              <Pause className="w-3.5 h-3.5 text-pink-400" />
              <span>Paused</span>
            </span>
          )}
          {currentTask.status === 'waiting' && (
            <span className="text-slate-400 font-medium">Waiting to start</span>
          )}
        </div>
      </div>

      {/* Main Task Title & Description */}
      <div className="pt-3 pb-2 space-y-1.5">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
          &ldquo;{currentTask.name}&rdquo;
        </h2>
        {currentTask.description && (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {currentTask.description}
          </p>
        )}
      </div>

      {/* Tags & Estimated Duration */}
      <div className="flex flex-wrap items-center gap-2 py-1">
        {currentTask.tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-white/5 text-[11px] text-slate-300">
            <Tag className="w-2.5 h-2.5 text-purple-400" />
            <span>{tag}</span>
          </span>
        ))}
        {currentTask.estimatedDuration && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-white/5 text-[11px] text-slate-400">
            <Clock className="w-2.5 h-2.5 text-slate-400" />
            <span>~{currentTask.estimatedDuration} mins</span>
          </span>
        )}
      </div>

      {/* Progress Bar & Percentage */}
      <div className="py-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-400">Task Completion</span>
          <span className="text-purple-300 font-mono">{currentTask.progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-white/5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-400 transition-all duration-700 shadow-[0_0_12px_rgba(124,110,248,0.5)]" 
            style={{ width: `${currentTask.progress}%` }}
          />
        </div>
      </div>

      {/* Step Checklist Drawer */}
      {currentTask.steps && currentTask.steps.length > 0 && (
        <div className="mt-1 border-t border-white/[0.06] pt-2">
          <button 
            onClick={() => setShowSteps(!showSteps)}
            className="w-full flex items-center justify-between py-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span className="font-semibold text-slate-300">
              Execution Plan ({currentTask.steps.filter(s => s.completed).length}/{currentTask.steps.length})
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
                      ? 'bg-emerald-950/20 text-slate-400 line-through' 
                      : step.current 
                      ? 'bg-purple-950/30 border border-purple-500/30 text-white font-medium shadow-sm' 
                      : 'bg-slate-900/40 text-slate-400'
                  }`}
                >
                  <div className="mt-0.5">
                    {step.completed ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : step.current ? (
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700" />
                    )}
                  </div>
                  <span className="flex-1 leading-snug">{step.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Realtime Terminal Logs Toggle */}
      {currentTask.executionLogs && currentTask.executionLogs.length > 0 && (
        <div className="mt-2">
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-1.5 text-[11px] text-purple-300 hover:text-purple-200 transition-colors py-1"
          >
            <Terminal className="w-3 h-3 text-purple-400" />
            <span>{showLogs ? 'Hide Laptop Logs' : 'View Live Execution Logs'}</span>
          </button>

          {showLogs && (
            <div className="mt-1.5 p-3 rounded-2xl bg-black/80 border border-white/10 font-mono text-[10px] text-slate-300 space-y-1 max-h-32 overflow-y-auto">
              {currentTask.executionLogs.map((log, i) => (
                <div key={i} className="text-emerald-300/90 font-mono">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Remote Controls Action Bar */}
      <div className="grid grid-cols-4 gap-2 pt-3 mt-3 border-t border-white/[0.06]">
        {/* Pause / Resume / Start */}
        {currentTask.status === 'waiting' ? (
          <button
            onClick={() => startTask(currentTask.id)}
            className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-xs transition-all active:scale-95 shadow-glow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Now</span>
          </button>
        ) : isPaused ? (
          <button
            onClick={resumeKairo}
            className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs transition-all active:scale-95 shadow-glow-success"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume</span>
          </button>
        ) : (
          <button
            onClick={pauseKairo}
            className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-pink-950/60 hover:bg-pink-900/60 border border-pink-500/40 text-pink-200 font-bold text-xs transition-all active:scale-95"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause</span>
          </button>
        )}

        {/* Skip */}
        <button
          onClick={skipCurrentTask}
          title="Skip current task and move to next"
          className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-slate-300 font-semibold text-xs transition-all active:scale-95"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span>Skip</span>
        </button>

        {/* Complete */}
        <button
          onClick={completeCurrentTask}
          title="Mark task completed"
          className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-2xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-all active:scale-95"
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
};
