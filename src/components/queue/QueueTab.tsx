import React, { useState } from 'react';
import { 
  ListOrdered, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  ArrowUpToLine, 
  Play, 
  CheckCircle, 
  SkipForward, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  MoreVertical,
  XCircle
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';
import { Task, TaskTrigger } from '../../types';

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
    skipCurrentTask, 
    completeCurrentTask, 
    cancelTask, 
    deleteTask, 
    moveTaskUp, 
    moveTaskDown, 
    moveTaskToTop
  } = useKairo();

  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'waiting' | 'completed' | 'startup'>('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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
      case 'next_startup': return 'next_boot';
      case 'today': return 'today';
      case 'tomorrow': return 'tomorrow';
      case 'specific_datetime': return 'scheduled';
      case 'after_task': return 'dependency';
      case 'manual': return 'manual';
      default: return trigger;
    }
  };

  return (
    <div className="w-full space-y-3 pb-28 pt-1 font-sans">
      {/* Header & Filter Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Pipeline Queue
          </h2>
          <p className="text-xs text-[#666666] font-mono">
            {tasks.filter(t => t.status !== 'completed').length} active &bull; {tasks.filter(t => t.status === 'completed').length} resolved
          </p>
        </div>

        {/* Add Task Button */}
        <button
          onClick={onOpenCreateTask}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl vercel-btn-primary text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar font-mono text-xs">
        {[
          { id: 'all', label: 'All' },
          { id: 'in_progress', label: 'In Progress' },
          { id: 'waiting', label: 'Queued' },
          { id: 'startup', label: 'Next Boot' },
          { id: 'completed', label: 'Completed' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              activeFilter === tab.id
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'bg-[#0E0E0E] text-[#888888] hover:text-white border border-[#222222]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task Queue List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0A0A0A] border border-[#222222] text-center space-y-2">
            <ListOrdered className="w-6 h-6 text-[#555555] mx-auto" />
            <p className="text-xs text-[#666666] font-mono">No tasks matching current filter.</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => {
            const isFirst = index === 0;
            const isLast = index === filteredTasks.length - 1;
            const isMenuOpen = activeMenuId === task.id;

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
                  task.status === 'in_progress'
                    ? 'bg-[#0E0E0E] border-white/30 shadow-vercel-sm'
                    : task.status === 'completed'
                    ? 'bg-[#080808] border-[#1A1A1A] opacity-70'
                    : 'bg-[#0A0A0A] border-[#222222] hover:border-[#333333]'
                }`}
              >
                <div className="space-y-2">
                  {/* Top Bar: Position & Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="w-5 h-5 rounded-md bg-[#141414] border border-[#282828] font-bold text-[#888888] flex items-center justify-center">
                        {index + 1}
                      </span>
                      
                      {/* Trigger Pill */}
                      <span className="px-2 py-0.5 rounded bg-[#111111] border border-[#222222] text-[#A1A1A1]">
                        {formatTriggerLabel(task.trigger)}
                      </span>

                      {/* Confirmation badge */}
                      {task.requiresConfirmation && (
                        <span className="px-1.5 py-0.5 rounded bg-[#1F1500] border border-[#F5A623]/30 text-[#F5A623]">
                          auth_guard
                        </span>
                      )}
                    </div>

                    {/* Status indicator chip */}
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium uppercase ${
                        task.status === 'in_progress' ? 'bg-[#002B1B] text-[#00E599] border border-[#00E599]/30' :
                        task.status === 'completed' ? 'bg-[#111111] text-[#666666] border border-[#222222]' :
                        task.status === 'paused' ? 'bg-[#2B0E1E] text-[#FF0080] border border-[#FF0080]/30' :
                        'bg-[#111111] text-[#888888] border border-[#222222]'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>

                      {/* Dropdown 3 dots */}
                      <button
                        onClick={() => setActiveMenuId(isMenuOpen ? null : task.id)}
                        className="p-1 text-[#666666] hover:text-white rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Task Name & Description */}
                  <div>
                    <h3 className={`text-xs sm:text-sm font-semibold leading-snug ${
                      task.status === 'completed' ? 'text-[#666666] line-through' : 'text-white'
                    }`}>
                      {task.name}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-[#888888] line-clamp-1 mt-0.5 font-sans">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Tags and Duration */}
                  <div className="flex flex-wrap items-center gap-1 font-mono">
                    {task.tags.map(tag => (
                      <span key={tag} className="text-[9px] text-[#888888] bg-[#111111] px-1.5 py-0.5 rounded border border-[#222222]">
                        #{tag}
                      </span>
                    ))}
                    {task.estimatedDuration && (
                      <span className="text-[9px] text-[#666666] flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {task.estimatedDuration}m
                      </span>
                    )}
                    {task.progress > 0 && task.status !== 'completed' && (
                      <span className="text-[9px] text-[#00E599] font-semibold">
                        {task.progress}%
                      </span>
                    )}
                  </div>

                  {/* Controls / Reorder Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1A1A1A]">
                    {/* Reorder Buttons (Up, Down, Top) */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveTaskToTop(task.id)}
                        title="Move to Top"
                        disabled={isFirst}
                        className="p-1.5 rounded-lg bg-[#111111] hover:bg-[#1C1C1C] disabled:opacity-30 text-[#888888] hover:text-white border border-[#222222] transition-colors"
                      >
                        <ArrowUpToLine className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveTaskUp(task.id)}
                        title="Move Up"
                        disabled={isFirst}
                        className="p-1.5 rounded-lg bg-[#111111] hover:bg-[#1C1C1C] disabled:opacity-30 text-[#888888] hover:text-white border border-[#222222] transition-colors"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveTaskDown(task.id)}
                        title="Move Down"
                        disabled={isLast}
                        className="p-1.5 rounded-lg bg-[#111111] hover:bg-[#1C1C1C] disabled:opacity-30 text-[#888888] hover:text-white border border-[#222222] transition-colors"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Action Execution Buttons */}
                    <div className="flex items-center gap-1.5 font-mono">
                      {task.status === 'waiting' && (
                        <button
                          onClick={() => startTask(task.id)}
                          className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-white text-black text-xs font-semibold hover:bg-[#EAEAEA] transition-all active:scale-95"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>start</span>
                        </button>
                      )}

                      {task.status === 'in_progress' && (
                        <button
                          onClick={skipCurrentTask}
                          className="flex items-center gap-1 py-1 px-2 rounded-lg bg-[#141414] hover:bg-[#1C1C1C] text-[#EDEDED] text-xs border border-[#262626]"
                        >
                          <SkipForward className="w-3 h-3" />
                          <span>skip</span>
                        </button>
                      )}

                      {task.status !== 'completed' && (
                        <button
                          onClick={() => {
                            if (task.status === 'in_progress') completeCurrentTask();
                            else {
                              startTask(task.id);
                              setTimeout(completeCurrentTask, 100);
                            }
                          }}
                          className="p-1 rounded-lg bg-[#111111] hover:bg-[#1C1C1C] border border-[#262626] text-[#00E599]"
                          title="Mark Done"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onOpenEditTask(task)}
                        className="p-1 rounded-lg bg-[#111111] hover:bg-[#1C1C1C] text-[#888888] hover:text-white border border-[#222222]"
                        title="Edit Task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 rounded-lg bg-[#160000] hover:bg-[#250000] border border-[#FF0000]/20 text-[#FF4444]"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dropdown Extra Menu */}
                {isMenuOpen && (
                  <div className="mt-2 p-1.5 rounded-xl bg-black border border-[#262626] text-xs font-mono space-y-1 animate-in fade-in duration-100">
                    <button
                      onClick={() => {
                        cancelTask(task.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full text-left px-2.5 py-1 rounded-lg text-[#FF4444] hover:bg-[#1F0000] flex items-center gap-2"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>cancel execution</span>
                    </button>
                    <button
                      onClick={() => {
                        moveTaskToTop(task.id);
                        setActiveMenuId(null);
                      }}
                      className="w-full text-left px-2.5 py-1 rounded-lg text-[#EDEDED] hover:bg-[#141414] flex items-center gap-2"
                    >
                      <ArrowUpToLine className="w-3 h-3 text-white" />
                      <span>move to top of queue</span>
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
