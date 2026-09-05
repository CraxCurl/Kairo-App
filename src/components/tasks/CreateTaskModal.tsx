import React, { useState } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  Loader2, 
  Check, 
  Plus,
  Terminal
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';
import { Priority, TaskTrigger, Task } from '../../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const { createTask, createTasksFromNaturalLanguage, tasks } = useKairo();

  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [nlPrompt, setNlPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiResultPreview, setAiResultPreview] = useState<Task[] | null>(null);

  // Manual Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [trigger, setTrigger] = useState<TaskTrigger>('next_startup');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [afterTaskId, setAfterTaskId] = useState('');
  const [requiresConfirmation, setRequiresConfirmation] = useState(true);
  const [estimatedDuration, setEstimatedDuration] = useState<number>(30);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['AI-Agent']);

  if (!isOpen) return null;

  const examplePrompts = [
    "Tomorrow when I open my laptop, remind me to finish my Java assignment, then solve two LeetCode problems.",
    "When I open my laptop, pull latest git repository changes and start Docker containers.",
    "Review DBMS normalization notes today at 4 PM with high priority."
  ];

  const handleAiParse = async (promptToUse?: string) => {
    const prompt = promptToUse || nlPrompt;
    if (!prompt.trim()) return;

    setIsAiProcessing(true);
    try {
      const created = await createTasksFromNaturalLanguage(prompt);
      setAiResultPreview(created);
      setIsAiProcessing(false);
      setTimeout(() => {
        setNlPrompt('');
        setAiResultPreview(null);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsAiProcessing(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createTask({
      name: name.trim(),
      description: description.trim() || undefined,
      priority,
      status: 'waiting',
      trigger,
      scheduledAt: scheduledDate ? `${scheduledDate}T${scheduledTime || '09:00'}` : undefined,
      scheduledTime: scheduledTime || undefined,
      afterTaskId: trigger === 'after_task' ? afterTaskId : undefined,
      requiresConfirmation,
      estimatedDuration: estimatedDuration || undefined,
      tags,
      dependencies: trigger === 'after_task' && afterTaskId ? [afterTaskId] : []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0A0A0A] border border-[#282828] rounded-2xl p-5 shadow-vercel-lg relative overflow-hidden max-h-[90vh] flex flex-col font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center text-white font-mono text-[10px]">
              &gt;
            </div>
            <div>
              <h3 className="font-bold text-xs text-white uppercase tracking-wider font-mono">
                Create Remote Task
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-[#111111] hover:bg-[#1C1C1C] text-[#888888] hover:text-white border border-[#242424] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#111111] border border-[#222222] my-3 shrink-0 font-mono text-xs">
          <button
            onClick={() => setMode('ai')}
            className={`py-1.5 rounded-lg font-medium transition-all ${
              mode === 'ai'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            Natural Language AI
          </button>

          <button
            onClick={() => setMode('manual')}
            className={`py-1.5 rounded-lg font-medium transition-all ${
              mode === 'manual'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            Manual Form
          </button>
        </div>

        {/* Mode 1: Natural Language AI */}
        {mode === 'ai' ? (
          <div className="space-y-3.5 overflow-y-auto pr-1">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#888888]">
                Instruct Kairo Desktop Agent:
              </label>
              <textarea
                value={nlPrompt}
                onChange={(e) => setNlPrompt(e.target.value)}
                placeholder="e.g. Tomorrow when I open my laptop, remind me to finish my Java assignment, then solve two LeetCode problems."
                rows={3}
                className="w-full p-3 rounded-xl bg-black border border-[#282828] text-white text-xs placeholder:text-[#555555] focus:outline-none focus:border-white transition-all resize-none font-mono"
              />
            </div>

            {/* Example Prompt Chips */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#666666] uppercase">
                Presets (Click to populate):
              </span>
              <div className="space-y-1">
                {examplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setNlPrompt(p);
                      handleAiParse(p);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-[#111111] hover:bg-[#171717] border border-[#222222] text-[#888888] hover:text-white text-xs font-mono transition-all truncate"
                  >
                    &gt; {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Processing / Result Preview */}
            {isAiProcessing && (
              <div className="p-3 rounded-xl bg-[#111111] border border-[#333333] flex items-center gap-2 text-xs font-mono text-[#EDEDED] animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Laptop agent parsing instructions...</span>
              </div>
            )}

            {aiResultPreview && (
              <div className="p-3 rounded-xl bg-[#002B1B] border border-[#00E599]/30 text-xs font-mono text-[#00E599] space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Dispatched {aiResultPreview.length} tasks to laptop queue</span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={() => handleAiParse()}
              disabled={isAiProcessing || !nlPrompt.trim()}
              className="w-full py-2.5 rounded-xl vercel-btn-primary disabled:opacity-40 text-xs font-semibold flex items-center justify-center gap-2"
            >
              {isAiProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch to Laptop</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Mode 2: Manual Form */
          <form onSubmit={handleManualSubmit} className="space-y-3 overflow-y-auto pr-1 text-xs">
            <div className="space-y-1">
              <label className="text-[#888888] font-mono">Task Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Complete Java assignment"
                className="w-full p-2 rounded-xl bg-black border border-[#282828] text-white focus:outline-none focus:border-white transition-all font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#888888] font-mono">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Execution instructions..."
                className="w-full p-2 rounded-xl bg-black border border-[#282828] text-white focus:outline-none focus:border-white transition-all resize-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="space-y-1">
                <label className="text-[#888888]">Trigger</label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value as TaskTrigger)}
                  className="w-full p-2 rounded-xl bg-black border border-[#282828] text-white focus:outline-none"
                >
                  <option value="next_startup">Next Startup</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="specific_datetime">Scheduled Date/Time</option>
                  <option value="after_task">After Another Task</option>
                  <option value="manual">Manual Execution</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#888888]">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full p-2 rounded-xl bg-black border border-[#282828] text-white focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {trigger === 'specific_datetime' && (
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="space-y-1">
                  <label className="text-[#888888]">Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-black border border-[#282828] text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[#888888]">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2 rounded-xl bg-black border border-[#282828] text-white"
                  />
                </div>
              </div>
            )}

            {trigger === 'after_task' && (
              <div className="space-y-1 font-mono">
                <label className="text-[#888888]">Prerequisite Task</label>
                <select
                  value={afterTaskId}
                  onChange={(e) => setAfterTaskId(e.target.value)}
                  className="w-full p-2 rounded-xl bg-black border border-[#282828] text-white"
                >
                  <option value="">-- Select Parent Task --</option>
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Tag Chips */}
            <div className="space-y-1.5 font-mono">
              <label className="text-[#888888]">Tags</label>
              <div className="flex flex-wrap items-center gap-1">
                {tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-[#111111] border border-[#262626] text-[10px] text-[#EDEDED] flex items-center gap-1">
                    #{tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="text-[#666666] hover:text-white">&times;</button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 pt-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  placeholder="add tag & press Enter..."
                  className="flex-1 p-1.5 rounded-lg bg-black border border-[#242424] text-white text-xs font-mono"
                />
                <button type="button" onClick={handleAddTag} className="px-2.5 py-1.5 rounded-lg vercel-btn-secondary text-xs">
                  add
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#222222]">
              <div className="font-mono">
                <span className="text-white block font-medium">Require Remote Auth</span>
                <span className="text-[10px] text-[#666666]">Prompt phone before laptop runs shell</span>
              </div>
              <input
                type="checkbox"
                checked={requiresConfirmation}
                onChange={(e) => setRequiresConfirmation(e.target.checked)}
                className="w-4 h-4 accent-white cursor-pointer"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl vercel-btn-primary text-xs font-semibold flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Create Task</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
