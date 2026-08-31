import React, { useState } from 'react';
import { 
  History, 
  Laptop, 
  CheckCircle, 
  ShieldAlert, 
  Terminal, 
  Sparkles, 
  Filter, 
  Download, 
  Mic, 
  Play, 
  Pause,
  Trash2
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export const HistoryTab: React.FC = () => {
  const { timeline, resetToDefaults } = useKairo();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTimeline = timeline.filter(evt => {
    if (filterType === 'all') return true;
    if (filterType === 'system') return evt.type === 'startup' || evt.type === 'system';
    if (filterType === 'tasks') return evt.type === 'task_start' || evt.type === 'task_complete' || evt.type === 'task_pause';
    if (filterType === 'auth') return evt.type === 'confirmation_approved' || evt.type === 'confirmation_denied';
    if (filterType === 'apps') return evt.type === 'app_launch';
    return true;
  });

  const getEventMeta = (type: string) => {
    switch (type) {
      case 'startup':
        return {
          icon: Laptop,
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/40 border-emerald-500/30',
          tag: 'System Boot'
        };
      case 'task_complete':
        return {
          icon: CheckCircle,
          color: 'text-emerald-400',
          bg: 'bg-emerald-950/40 border-emerald-500/30',
          tag: 'Completed'
        };
      case 'task_start':
        return {
          icon: Play,
          color: 'text-purple-400',
          bg: 'bg-purple-950/40 border-purple-500/30',
          tag: 'Task Running'
        };
      case 'task_pause':
        return {
          icon: Pause,
          color: 'text-pink-400',
          bg: 'bg-pink-950/40 border-pink-500/30',
          tag: 'Paused'
        };
      case 'confirmation_approved':
        return {
          icon: ShieldAlert,
          color: 'text-purple-300',
          bg: 'bg-purple-950/40 border-purple-500/30',
          tag: 'Auth Approved'
        };
      case 'confirmation_denied':
        return {
          icon: ShieldAlert,
          color: 'text-red-400',
          bg: 'bg-red-950/40 border-red-500/30',
          tag: 'Auth Denied'
        };
      case 'app_launch':
        return {
          icon: Terminal,
          color: 'text-indigo-400',
          bg: 'bg-indigo-950/40 border-indigo-500/30',
          tag: 'App Launched'
        };
      case 'voice_command':
        return {
          icon: Mic,
          color: 'text-cyan-400',
          bg: 'bg-cyan-950/40 border-cyan-500/30',
          tag: 'Voice Command'
        };
      default:
        return {
          icon: Sparkles,
          color: 'text-purple-400',
          bg: 'bg-slate-900 border-white/10',
          tag: 'Agent Event'
        };
    }
  };

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timeline, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kairo-timeline-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full space-y-4 pb-28 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Agent Timeline</span>
          </h2>
          <p className="text-xs text-slate-400">
            Realtime audit log of laptop executions and approvals
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
          title="Export audit log JSON"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Events' },
          { id: 'tasks', label: 'Tasks' },
          { id: 'auth', label: 'Confirmations' },
          { id: 'apps', label: 'App Launches' },
          { id: 'system', label: 'System & Boot' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-purple-600/30 border border-purple-500/50 text-purple-200'
                : 'bg-slate-900/60 border border-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-4 space-y-4 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-purple-500/50 before:via-white/10 before:to-transparent">
        {filteredTimeline.map((evt) => {
          const meta = getEventMeta(evt.type);
          const Icon = meta.icon;

          return (
            <div key={evt.id} className="relative flex items-start gap-3 group">
              {/* Timeline dot icon */}
              <div className={`w-6 h-6 rounded-full ${meta.bg} border flex items-center justify-center -ml-[13px] mt-0.5 z-10 shadow-sm shrink-0`}>
                <Icon className={`w-3 h-3 ${meta.color}`} />
              </div>

              {/* Event Card */}
              <div className="flex-1 p-3.5 rounded-2xl bg-[#11121C]/80 border border-white/[0.08] hover:border-white/20 transition-all backdrop-blur-xl space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white leading-snug">
                    {evt.title}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 text-slate-400 font-medium">
                      {meta.tag}
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-300">
                      {evt.timeFormatted}
                    </span>
                  </div>
                </div>

                {evt.description && (
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {evt.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
