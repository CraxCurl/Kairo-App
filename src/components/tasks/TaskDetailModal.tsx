import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Trash2, 
  Save, 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0A0A0A] border border-[#282828] rounded-2xl p-5 shadow-vercel-lg relative overflow-hidden max-h-[90vh] flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A] shrink-0 font-mono">
          <div>
            <span className="text-[10px] text-[#666666] uppercase tracking-wider">
              task_id: {task.id}
            </span>
            <h3 className="font-semibold text-xs text-white truncate max-w-xs">
              {task.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-[#111111] text-[#888888] hover:text-white border border-[#242424]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-3.5 overflow-y-auto pr-1 py-3 text-xs">
          <div className="space-y-1">
            <label className="text-[#888888] font-mono">Task Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded-xl bg-black border border-[#282828] text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#888888] font-mono">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full p-2 rounded-xl bg-black border border-[#282828] text-white font-mono resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono">
            <div className="space-y-1">
              <label className="text-[#888888]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full p-2 rounded-xl bg-black border border-[#282828] text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#888888]">Trigger</label>
              <select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value as TaskTrigger)}
                className="w-full p-2 rounded-xl bg-black border border-[#282828] text-white"
              >
                <option value="next_startup">Next Startup</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="specific_datetime">Scheduled Date/Time</option>
                <option value="after_task">After Another Task</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>

          {/* Steps Plan */}
          <div className="space-y-1.5 font-mono">
            <label className="text-[#888888]">Pipeline Steps</label>
            <div className="space-y-1">
              {task.steps?.map(step => (
                <div
                  key={step.id}
                  onClick={() => handleToggleStep(step.id)}
                  className={`p-2 rounded-xl flex items-center gap-2 text-xs cursor-pointer border ${
                    step.completed ? 'bg-[#0A0A0A] border-[#1A1A1A] text-[#666666] line-through' : 'bg-[#111111] border-[#222222] text-white'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                    step.completed ? 'bg-white border-white text-black' : 'border-[#444444]'
                  }`}>
                    {step.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="flex-1 truncate">{step.title}</span>
                </div>
              ))}
            </div>

            {/* Add Step */}
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                placeholder="add sub-step..."
                className="flex-1 p-1.5 rounded-lg bg-black border border-[#282828] text-white text-xs font-mono"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="px-2.5 py-1.5 rounded-lg vercel-btn-secondary text-xs"
              >
                add
              </button>
            </div>
          </div>

          {/* Execution Logs */}
          {task.executionLogs && task.executionLogs.length > 0 && (
            <div className="space-y-1 font-mono">
              <div className="flex items-center gap-1 text-[11px] text-[#888888]">
                <Terminal className="w-3 h-3" />
                <span>Runtime Output</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black border border-[#222222] text-[10px] text-[#00E599] space-y-1 max-h-24 overflow-y-auto">
                {task.executionLogs.map((l, i) => (
                  <div key={i}>{l}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[#1A1A1A] shrink-0 font-mono">
          <button
            onClick={() => {
              deleteTask(task.id);
              onClose();
            }}
            className="p-2 rounded-xl bg-[#160000] hover:bg-[#250000] text-[#FF4444] border border-[#FF0000]/20 text-xs flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>delete</span>
          </button>

          <div className="flex items-center gap-2">
            {task.status !== 'in_progress' && (
              <button
                onClick={() => {
                  startTask(task.id);
                  onClose();
                }}
                className="py-2 px-3 rounded-xl vercel-btn-secondary text-xs flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>run</span>
              </button>
            )}

            <button
              onClick={handleSave}
              className="py-2 px-3 rounded-xl vercel-btn-primary text-xs font-semibold flex items-center gap-1"
            >
              <Save className="w-3 h-3" />
              <span>save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
