import React, { useState } from 'react';
import { 
  ListOrdered, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  ArrowUpToLine, 
  Play, 
  Pause, 
  CheckCircle, 
  SkipForward, 
  Trash2, 
  Edit3, 
  Filter, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Tag,
  Loader2,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';
import { Task, TaskStatus, TaskTrigger } from '../../types';

interface QueueTabProps {
  onOpenCreateTask: () => void;
  onOpenEditTask: (task: Task) => void;
}

export const QueueTab: React.FC<QueueTabProps> = ({ 
  onOpenCreateTask, 
  onOpenEditTask 
}) => {
  const { 
    tasks, 
    startTask, 
    pauseKairo, 
    resumeKairo, 
    skipCurrentTask, 
    completeCurrentTask, 
    cancelTask, 
    deleteTask, 
    moveTaskUp, 
    moveTaskDown, 
    moveTaskToTop,
    kairoStatus 
  } = useKairo();

  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'waiting' | 'completed' | 'startup'>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'in_progress') return t.status === 'in_progress';
    if (activeFilter === 'waiting') return t.status === 'waiting';
    if (activeFilter === 'completed') return t.status === 'completed';
    if (activeFilter === 'startup') return t.trigger === 'next_startup';
    return true;
  });

  const formatTriggerLabel = (trigger: TaskTrigger) => {
    switch (trigger) {
      case 'next_startup': return 'Next Startup';
      case 'today': return 'Today';
      case 'tomorrow': return 'Tomorrow';
      case 'specific_datetime': return 'Scheduled';
      case 'after_task': return 'After Dependency';
      case 'manual': return 'Manual';
      default: return trigger;
    }
  };

  return (
    <div className="w-full space-y-4 pb-28 pt-1">
      {/* Header & Filter Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">
            Task Queue
          </h2>
          <p className="text-xs text-slate-400">
            {tasks.filter(t => t.status !== 'completed').length} pending &bull; {tasks.filter(t => t.status === 'completed').length} completed
          </p>
        </div>

        {/* Add Task Button */}
        <button
          onClick={onOpenCreateTask}
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 active:scale-95 text-white text-xs font-bold transition-all shadow-glow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Tasks' },
          { id: 'in_progress', label: 'In Progress' },
          { id: 'waiting', label: 'Waiting' },
          { id: 'startup', label: 'Next Startup' },
          { id: 'completed', label: 'Completed' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? 'bg-purple-600/30 border border-purple-500/50 text-purple-200'
                : 'bg-slate-900/60 border border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task Queue List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#11121C]/60 border border-white/5 text-center space-y-2">
            <ListOrdered className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No tasks match this filter.</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => {
            const isFirst = index === 0;
            const isLast = index === filteredTasks.length - 1;
            const isMenuOpen = activeMenuId === task.id;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-3xl border transition-all relative overflow-hidden backdrop-blur-xl ${
                  task.status === 'in_progress'
                    ? 'bg-gradient-to-r from-[#17182C] via-[#121322] to-[#0E0F1A] border-purple-500/40 shadow-glow-sm'
                    : task.status === 'completed'
                    ? 'bg-[#0E0F18]/60 border-white/[0.04] opacity-75'
                    : 'bg-[#11121C]/80 border-white/[0.08] hover:border-white/20'
                }`}
              >
                {/* Priority Color Stripe */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                  task.priority === 'critical' ? 'bg-red-500' :
                  task.priority === 'high' ? 'bg-amber-500' :
                  task.priority === 'medium' ? 'bg-blue-500' : 'bg-slate-600'
                }`} />

                <div className="pl-1 space-y-2">
                  {/* Top Bar: Position & Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 border border-white/10 text-[10px] font-bold font-mono text-slate-300 flex items-center justify-center">
                        {index + 1}
                      </span>
                      
                      {/* Trigger Pill */}
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 border border-white/5 text-[10px] text-slate-300 font-medium">
                        <Calendar className="w-2.5 h-2.5 text-purple-400" />
                        <span>{formatTriggerLabel(task.trigger)}</span>
                      </span>

                      {/* Confirmation badge */}
                      {task.requiresConfirmation && (
                        <span className="p-1 rounded-full bg-amber-500/10 text-amber-300" title="Requires confirmation">
                          <ShieldCheck className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    {/* Status indicator chip */}
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        task.status === 'in_progress' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        task.status === 'paused' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' :
                        task.status === 'skipped' ? 'bg-slate-700 text-slate-400' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>

                      {/* Dropdown 3 dots */}
                      <button
                        onClick={() => setActiveMenuId(isMenuOpen ? null : task.id)}
                        className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Task Name & Description */}
                  <div>
                    <h3 className={`text-sm font-bold leading-snug ${
                      task.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'
                    }`}>
                      {task.name}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Tags and Duration */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {task.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded-md border border-white/5">
                        #{tag}
                      </span>
                    ))}
                    {task.estimatedDuration && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {task.estimatedDuration}m
                      </span>
                    )}
                    {task.progress > 0 && task.status !== 'completed' && (
                      <span className="text-[10px] text-purple-300 font-mono font-semibold">
                        {task.progress}% done
                      </span>
                    )}
                  </div>

                  {/* Controls / Reorder Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                    {/* Reorder Buttons (Up, Down, Top) */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveTaskToTop(task.id)}
                        title="Move to Top"
                        disabled={isFirst}
                        className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-white border border-white/5 transition-all"
                      >
                        <ArrowUpToLine className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveTaskUp(task.id)}
                        title="Move Up"
                        disabled={isFirst}
                        className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-white border border-white/5 transition-all"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveTaskDown(task.id)}
                        title="Move Down"
                        disabled={isLast}
                        className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-white border border-white/5 transition-all"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Action Execution Buttons */}
                    <div className="flex items-center gap-1.5">
                      {task.status === 'waiting' && (
                        <button
                          onClick={() => startTask(task.id)}
                          className="flex items-center gap-1 py-1.5 px-3 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Start</span>
                        </button>
                      )}

                      {task.status === 'in_progress' && (
                        <button
                          onClick={skipCurrentTask}
                          className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                        >
                          <SkipForward className="w-3 h-3" />
                          <span>Skip</span>
                        </button>
                      )}

                      {task.status !== 'completed' && (
                        <button
                          onClick={() => {
                            if (task.status === 'in_progress') completeCurrentTask();
                            else {
                              // mark complete directly
                              startTask(task.id);
                              setTimeout(completeCurrentTask, 100);
                            }
                          }}
                          className="p-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 transition-all"
                          title="Mark Completed"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onOpenEditTask(task)}
                        className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 transition-all"
                        title="Edit Task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-xl bg-red-950/30 hover:bg-red-900/50 border border-red-500/20 text-red-400 hover:text-red-300 transition-all"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dropdown Extra Menu */}
                {isMenuOpen && (
                  <div className="mt-3 p-2 rounded-2xl bg-black/90 border border-white/10 text-xs space-y-1 animate-in fade-in duration-150">
                    <button
                      onClick={() => {
                        cancelTask(task.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-950/40 flex items-center gap-2"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Task Execution</span>
                    </button>
                    <button
                      onClick={() => {
                        moveTaskToTop(task.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-slate-300 hover:bg-white/5 flex items-center gap-2"
                    >
                      <ArrowUpToLine className="w-3.5 h-3.5 text-purple-400" />
                      <span>Prioritize to Top</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
