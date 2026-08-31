import React, { useState } from 'react';
import { 
  History, 
  Laptop, 
  CheckCircle, 
  ShieldAlert, 
  Terminal, 
  Download, 
  Mic, 
  Play, 
  Pause,
  Clock
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export const HistoryTab: React.FC = () => {
  const { timeline } = useKairo();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTimeline = timeline.filter(evt => {
    if (filterType === 'all') return true;
    if (filterType === 'system') return evt.type === 'startup' || evt.type === 'system';
    if (filterType === 'tasks') return evt.type === 'task_start' || evt.type === 'task_complete' || evt.type === 'task_pause';
    if (filterType === 'auth') return evt.type === 'confirmation_approved' || evt.type === 'confirmation_denied';
    if (filterType === 'apps') return evt.type === 'app_launch';
    return true;
  });

  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timeline, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `kairo-audit-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full space-y-3 pb-28 pt-1 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Audit Trail
          </h2>
          <p className="text-xs text-[#666666] font-mono">
            System & task execution logs
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="py-1.5 px-2.5 rounded-xl vercel-btn-secondary text-xs font-mono flex items-center gap-1.5"
        >
          <Download className="w-3 h-3" />
          <span>export_json</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar font-mono text-xs">
        {[
          { id: 'all', label: 'All' },
          { id: 'tasks', label: 'Tasks' },
          { id: 'auth', label: 'Auth' },
          { id: 'apps', label: 'Apps' },
          { id: 'system', label: 'System' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              filterType === tab.id
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'bg-[#0E0E0E] text-[#888888] hover:text-white border border-[#222222]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Log Feed */}
      <div className="space-y-2 font-mono text-xs">
        {filteredTimeline.map((evt) => (
          <div
            key={evt.id}
            className="p-3 rounded-2xl bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] transition-all space-y-1"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-white font-sans">
                {evt.title}
              </span>
              <span className="text-[10px] text-[#666666] shrink-0">
                {evt.timeFormatted}
              </span>
            </div>

            {evt.description && (
              <p className="text-[11px] text-[#888888] font-mono leading-relaxed">
                &gt; {evt.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
