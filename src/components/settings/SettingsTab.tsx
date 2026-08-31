import React, { useState } from 'react';
import { 
  Laptop, 
  Sparkles, 
  Mic, 
  Bell, 
  ShieldCheck, 
  Sliders, 
  Lock, 
  QrCode, 
  Key, 
  RefreshCw, 
  Check, 
  RotateCcw,
  Volume2
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';
import { Priority, TaskTrigger } from '../../types';

export const SettingsTab: React.FC = () => {
  const { settings, updateSettings, resetToDefaults, laptop } = useKairo();
  const [showQrModal, setShowQrModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleNotif = (key: keyof typeof settings.notifications) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  const triggerSaveToast = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="w-full space-y-4 pb-28 pt-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">
            Settings & Security
          </h2>
          <p className="text-xs text-slate-400">
            Kairo companion configuration & pairing
          </p>
        </div>

        {savedSuccess && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 animate-in fade-in">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Saved</span>
          </span>
        )}
      </div>

      {/* 1. Connected Laptop & Pairing Card */}
      <div className="p-4 rounded-3xl bg-[#11121C]/80 border border-white/[0.08] backdrop-blur-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">
              Connected Laptop Runtime
            </h3>
          </div>
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-semibold"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Pair New Device</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-white/5">
            <span className="text-slate-400">Device Name</span>
            <span className="font-semibold text-white">{settings.laptopName}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold">IP Address</span>
              <p className="font-mono text-white text-xs">{settings.laptopIp}</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold">WebSocket Port</span>
              <p className="font-mono text-white text-xs">{settings.laptopPort}</p>
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <Key className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="text-slate-400 text-xs truncate">JWT: {settings.authToken.slice(0, 16)}...</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* 2. Kairo AI Personality */}
      <div className="p-4 rounded-3xl bg-[#11121C]/80 border border-white/[0.08] backdrop-blur-xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-xs text-white uppercase tracking-wider">
            Kairo Personality
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'focused', title: 'Focused Engineer', desc: 'Precise, technical, minimal fluff' },
            { id: 'buddy', title: 'Casual Buddy', desc: 'Encouraging, friendly & helpful' },
            { id: 'strict', title: 'Strict Overseer', desc: 'No excuses, deadline enforcer' },
            { id: 'concise', title: 'Concise Butler', desc: 'Polite, ultra-succinct responses' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => updateSettings({ kairoPersonality: p.id as any })}
              className={`p-3 rounded-2xl text-left border transition-all ${
                settings.kairoPersonality === p.id
                  ? 'bg-purple-950/50 border-purple-500/50 text-white shadow-glow-sm'
                  : 'bg-slate-950/50 border-white/5 text-slate-400 hover:border-white/20'
              }`}
            >
              <span className="font-bold text-xs text-white block">{p.title}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">{p.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Voice Settings */}
      <div className="p-4 rounded-3xl bg-[#11121C]/80 border border-white/[0.08] backdrop-blur-xl space-y-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-xs text-white uppercase tracking-wider">
            Voice & Speech AI
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-white/5">
            <div>
              <span className="text-xs font-semibold text-white block">Auto-Speak Voice Responses</span>
              <span className="text-[10px] text-slate-400">Play spoken audio reply for voice commands</span>
            </div>
            <input
              type="checkbox"
              checked={settings.voiceAutoSpeak}
              onChange={(e) => updateSettings({ voiceAutoSpeak: e.target.checked })}
              className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Speech Speed Rate</span>
              <span className="font-mono text-purple-300">{settings.ttsSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.1"
              value={settings.ttsSpeed}
              onChange={(e) => updateSettings({ ttsSpeed: parseFloat(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. Confirmation & Execution Safeguards */}
      <div className="p-4 rounded-3xl bg-[#11121C]/80 border border-white/[0.08] backdrop-blur-xl space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-xs text-white uppercase tracking-wider">
            Confirmation & Security
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-white/5">
            <div>
              <span className="text-xs font-semibold text-white block">Auto-Approve Safe Read-Only Tasks</span>
              <span className="text-[10px] text-slate-400">Skip mobile prompt for harmless commands</span>
            </div>
            <input
              type="checkbox"
              checked={settings.autoApproveSafeTasks}
              onChange={(e) => updateSettings({ autoApproveSafeTasks: e.target.checked })}
              className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-white/5 text-xs">
            <span className="text-slate-300">Confirmation Timeout</span>
            <span className="font-mono text-purple-300">{settings.confirmationTimeout} seconds (Auto-Deny)</span>
          </div>
        </div>
      </div>

      {/* 5. Default Task Defaults & Startup Behavior */}
      <div className="p-4 rounded-3xl bg-[#11121C]/80 border border-white/[0.08] backdrop-blur-xl space-y-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-xs text-white uppercase tracking-wider">
            Queue & Startup Policy
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold">Laptop Boot / Startup Behavior</label>
            <select
              value={settings.startupBehavior}
              onChange={(e) => updateSettings({ startupBehavior: e.target.value as any })}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
            >
              <option value="resume_queue">Automatically Resume Queued Tasks</option>
              <option value="wait_for_user">Wait for Manual Mobile Approval</option>
              <option value="prompt_plan">Prompt Daily Plan Briefing</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Default Priority</label>
              <select
                value={settings.defaultPriority}
                onChange={(e) => updateSettings({ defaultPriority: e.target.value as Priority })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Default Trigger</label>
              <select
                value={settings.defaultTrigger}
                onChange={(e) => updateSettings({ defaultTrigger: e.target.value as TaskTrigger })}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
              >
                <option value="next_startup">Next Startup</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Push Notification Preferences */}
      <div className="p-4 rounded-3xl bg-[#11121C]/80 border border-white/[0.08] backdrop-blur-xl space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          <h3 className="font-bold text-xs text-white uppercase tracking-wider">
            Push Notification Triggers
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          {[
            { key: 'laptopOnline', label: 'Laptop came online / boot' },
            { key: 'needsConfirmation', label: 'Kairo requires confirmation' },
            { key: 'taskCompleted', label: 'Task completed successfully' },
            { key: 'taskFailed', label: 'Task execution failed' },
            { key: 'taskSkipped', label: 'Task skipped' },
            { key: 'deadlines', label: 'Important deadline approaching' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-white/5">
              <span className="text-slate-300">{item.label}</span>
              <input
                type="checkbox"
                checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                onChange={() => handleToggleNotif(item.key as any)}
                className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Reset Defaults Button */}
      <div className="pt-2">
        <button
          onClick={resetToDefaults}
          className="w-full py-3 rounded-2xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/20 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Data & Revert to Defaults</span>
        </button>
      </div>

      {/* Pairing QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="w-full max-w-sm bg-[#11121F] border border-purple-500/30 rounded-3xl p-6 text-center space-y-4">
            <h3 className="text-base font-bold text-white">Pair with Laptop Agent</h3>
            <p className="text-xs text-slate-400">
              Open Kairo on your laptop and scan this pairing QR code or use the authentication token.
            </p>

            {/* Mock QR graphic */}
            <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center">
              <div className="w-full h-full border-4 border-black p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-black" />
                  <div className="w-8 h-8 bg-black" />
                </div>
                <div className="text-black font-mono text-[9px] font-extrabold tracking-widest text-center">
                  KAIRO-AUTH
                </div>
                <div className="flex justify-between">
                  <div className="w-8 h-8 bg-black" />
                  <div className="w-4 h-4 bg-black" />
                </div>
              </div>
            </div>

            <div className="font-mono text-xs text-purple-300 bg-slate-950 p-2.5 rounded-xl border border-white/5 break-all">
              {settings.authToken}
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
