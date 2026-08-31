import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Trash2, 
  Save, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Tag, 
  Terminal, 
  Check, 
  Plus
} from 'lucide-react';
import { Task, Priority, TaskTrigger } from '../../types';
import { useKairo } from '../../context/KairoContext';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose }) => {
  const { updateTask, deleteTask, startTask } = useKairo();

  if (!isOpen || !task) return null;

  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [trigger, setTrigger] = useState<TaskTrigger>(task.trigger);
  const [newStepTitle, setNewStepTitle] = useState('');

  const handleSave = () => {
    updateTask(task.id, {
      name,
      description,
      priority,
      trigger
    });
    onClose();
  };

  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;
    const steps = task.steps || [];
    const newStep = {
      id: 'step-' + Date.now(),
      title: newStepTitle.trim(),
      completed: false
    };
    updateTask(task.id, { steps: [...steps, newStep] });
    setNewStepTitle('');
  };

  const handleToggleStep = (stepId: string) => {
    if (!task.steps) return;
    const updated = task.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s);
    updateTask(task.id, { steps: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#11121F] border border-purple-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">
              Task Details
            </span>
            <h3 className="font-bold text-sm text-white tracking-wide truncate max-w-xs">
              {task.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-4 overflow-y-auto pr-1 py-3">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Task Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-white text-xs"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full p-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-white text-xs"
            />
          </div>

          {/* Priority & Trigger */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Trigger</label>
              <select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value as TaskTrigger)}
                className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
              >
                <option value="next_startup">Next Laptop Startup</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="specific_datetime">Specific Date & Time</option>
                <option value="after_task">After Another Task</option>
                <option value="manual">Manual Execution</option>
              </select>
            </div>
          </div>

          {/* Steps Plan */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Execution Steps</label>
            <div className="space-y-1.5">
              {task.steps?.map(step => (
                <div
                  key={step.id}
                  onClick={() => handleToggleStep(step.id)}
                  className={`p-2.5 rounded-xl flex items-center gap-2.5 text-xs cursor-pointer transition-all ${
                    step.completed ? 'bg-emerald-950/30 text-slate-400 line-through' : 'bg-slate-900/80 text-white'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                    step.completed ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-600'
                  }`}>
                    {step.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="flex-1">{step.title}</span>
                </div>
              ))}
            </div>

            {/* Add Step */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                placeholder="Add new sub-step..."
                className="flex-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Execution Logs */}
          {task.executionLogs && task.executionLogs.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Terminal className="w-3 h-3 text-purple-400" />
                <span>Agent Logs</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/80 border border-white/5 font-mono text-[10px] text-emerald-300 space-y-1 max-h-28 overflow-y-auto">
                {task.executionLogs.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 shrink-0">
          <button
            onClick={() => {
              deleteTask(task.id);
              onClose();
            }}
            className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            {task.status !== 'in_progress' && (
              <button
                onClick={() => {
                  startTask(task.id);
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Now</span>
              </button>
            )}

            <button
              onClick={handleSave}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
