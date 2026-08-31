import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Wand2, 
  Send, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Tag, 
  ListTree, 
  Loader2, 
  Check, 
  AlertCircle,
  Plus
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
      // Auto close after brief success preview
      setTimeout(() => {
        setNlPrompt('');
        setAiResultPreview(null);
        onClose();
      }, 1400);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#11121F] border border-purple-500/30 rounded-3xl p-5 shadow-[0_0_50px_rgba(124,110,248,0.2)] relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow ambient highlight */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white tracking-wide">
                Create Remote Task
              </h3>
              <p className="text-[11px] text-slate-400">
                Dispatched to laptop agent execution queue
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Pill */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-white/5 my-3 shrink-0">
          <button
            onClick={() => setMode('ai')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              mode === 'ai'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Natural Language AI</span>
          </button>

          <button
            onClick={() => setMode('manual')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              mode === 'manual'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Manual Form</span>
          </button>
        </div>

        {/* Mode 1: Natural Language AI */}
        {mode === 'ai' ? (
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Tell Kairo what you want done on your laptop:</span>
              </label>
              <div className="relative">
                <textarea
                  value={nlPrompt}
                  onChange={(e) => setNlPrompt(e.target.value)}
                  placeholder="e.g. Tomorrow when I open my laptop, remind me to finish my Java assignment, then solve two LeetCode problems."
                  rows={4}
                  className="w-full p-3.5 rounded-2xl bg-slate-950/70 border border-purple-500/30 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all resize-none font-sans"
                />
              </div>
            </div>

            {/* Example Prompt Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Quick Prompts (Tap to test):
              </span>
              <div className="space-y-1.5">
                {examplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setNlPrompt(p);
                      handleAiParse(p);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-purple-950/40 border border-white/5 hover:border-purple-500/30 text-slate-300 hover:text-purple-200 text-xs transition-all flex items-center justify-between gap-2 group"
                  >
                    <span className="truncate">&ldquo;{p}&rdquo;</span>
                    <Sparkles className="w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* AI Success / Processing State */}
            {isAiProcessing && (
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-center gap-3 text-xs text-purple-200 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span>Laptop LLM Agent is structuring tasks, dependencies & triggers...</span>
              </div>
            )}

            {aiResultPreview && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 text-xs text-emerald-200 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Dispatched {aiResultPreview.length} structured task(s) to laptop queue!</span>
                </div>
                <div className="space-y-1 pl-6">
                  {aiResultPreview.map((t, idx) => (
                    <div key={t.id} className="text-slate-300">
                      {idx + 1}. <span className="font-semibold text-white">{t.name}</span> — <span className="text-purple-300">{t.trigger.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={() => handleAiParse()}
              disabled={isAiProcessing || !nlPrompt.trim()}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:opacity-90 active:scale-95 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow-sm"
            >
              {isAiProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing with Laptop LLM...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send to Laptop Agent</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Mode 2: Manual Structured Form */
          <form onSubmit={handleManualSubmit} className="space-y-3.5 overflow-y-auto pr-1">
            {/* Task Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Task Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Complete Java assignment"
                className="w-full p-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition-all font-sans"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details or specific commands for Kairo..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-950/70 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition-all resize-none"
              />
            </div>

            {/* Trigger Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Trigger</label>
              <select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value as TaskTrigger)}
                className="w-full p-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400 transition-all"
              >
                <option value="next_startup">Next Laptop Startup</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="specific_datetime">Specific Date & Time</option>
                <option value="after_task">After Another Task</option>
                <option value="manual">Manual Execution Only</option>
              </select>
            </div>

            {/* Conditional: Specific Date/Time */}
            {trigger === 'specific_datetime' && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Time</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Conditional: After another task */}
            {trigger === 'after_task' && (
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Select Preceding Task</label>
                <select
                  value={afterTaskId}
                  onChange={(e) => setAfterTaskId(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                >
                  <option value="">-- Choose task dependency --</option>
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Priority & Estimated Duration */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Est. Duration (mins)</label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                />
              </div>
            </div>

            {/* Requires Confirmation Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-white/5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-semibold text-white block">Requires Confirmation</span>
                  <span className="text-[10px] text-slate-400">Ask permission on phone before running</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={requiresConfirmation}
                onChange={(e) => setRequiresConfirmation(e.target.checked)}
                className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
              />
            </div>

            {/* Tags Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tags</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Type tag and press Add..."
                  className="flex-1 p-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                >
                  Add
                </button>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map(t => (
                  <span
                    key={t}
                    onClick={() => handleRemoveTag(t)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[11px] text-purple-300 cursor-pointer hover:bg-red-950/50 hover:border-red-500/30 hover:text-red-300 transition-colors"
                  >
                    <span>#{t}</span>
                    <X className="w-2.5 h-2.5" />
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:opacity-90 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-glow-sm mt-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Task</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
