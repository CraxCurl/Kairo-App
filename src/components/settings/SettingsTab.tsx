import React, { useState } from 'react';
import { 
  Laptop, 
  Sparkles, 
  QrCode, 
  Key, 
  Check, 
  RotateCcw,
  Volume2,
  ShieldCheck,
  Sliders,
  Bell
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';
import { Priority, TaskTrigger } from '../../types';

export const SettingsTab: React.FC = () => {
  const { settings, updateSettings, resetToDefaults } = useKairo();
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

  return (
    <div className="w-full space-y-3 pb-28 pt-1 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Settings & Pairing
          </h2>
          <p className="text-xs text-[#666666] font-mono">
            Device link, policies & personality
          </p>
        </div>

        {savedSuccess && (
          <span className="px-2 py-0.5 rounded-full bg-[#002B1B] text-[#00E599] border border-[#00E599]/30 text-xs font-mono flex items-center gap-1">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>saved</span>
          </span>
        )}
      </div>

      {/* 1. Connected Laptop Card */}
      <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] transition-all space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Laptop className="w-3.5 h-3.5 text-white" />
            <h3 className="font-semibold text-xs text-white uppercase tracking-wider font-mono">
              Desktop Node
            </h3>
          </div>
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1 text-xs text-white hover:underline font-mono"
          >
            <QrCode className="w-3 h-3" />
            <span>pair_qr</span>
          </button>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#1F1F1F]">
            <span className="text-[#666666]">Host</span>
            <span className="text-white font-medium">{settings.laptopName}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-[#111111] border border-[#1F1F1F]">
              <span className="text-[#666666] text-[10px] block">IP</span>
              <span className="text-white text-xs">{settings.laptopIp}</span>
            </div>
            <div className="p-2 rounded-xl bg-[#111111] border border-[#1F1F1F]">
              <span className="text-[#666666] text-[10px] block">PORT</span>
              <span className="text-white text-xs">{settings.laptopPort}</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-[#111111] border border-[#1F1F1F] flex items-center justify-between">
            <span className="text-[#666666] text-[10px] truncate">JWT: {settings.authToken.slice(0, 18)}...</span>
            <span className="text-[10px] text-[#00E599] font-bold">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 2. Kairo AI Personality */}
      <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] transition-all space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <h3 className="font-semibold text-xs text-white uppercase tracking-wider font-mono">
            Agent Personality
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'focused', title: 'Focused Engineer', desc: 'Technical & minimal' },
            { id: 'buddy', title: 'Casual Buddy', desc: 'Encouraging & friendly' },
            { id: 'strict', title: 'Strict Overseer', desc: 'Enforces deadlines' },
            { id: 'concise', title: 'Concise Butler', desc: 'Ultra-succinct' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => updateSettings({ kairoPersonality: p.id as any })}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                settings.kairoPersonality === p.id
                  ? 'bg-white text-black border-white'
                  : 'bg-[#111111] border-[#222222] text-[#888888] hover:border-[#383838]'
              }`}
            >
              <span className={`font-semibold text-xs block ${settings.kairoPersonality === p.id ? 'text-black' : 'text-white'}`}>
                {p.title}
              </span>
              <span className={`text-[10px] block mt-0.5 font-mono ${settings.kairoPersonality === p.id ? 'text-[#333333]' : 'text-[#666666]'}`}>
                {p.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Voice Settings */}
      <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] transition-all space-y-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-white" />
          <h3 className="font-semibold text-xs text-white uppercase tracking-wider font-mono">
            Audio & Speech AI
          </h3>
        </div>

        <div className="space-y-2.5 text-xs font-mono">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#1F1F1F]">
            <div>
              <span className="text-white block font-medium">Auto-Speak Voice Replies</span>
              <span className="text-[10px] text-[#666666]">Synthesize audio response for commands</span>
            </div>
            <input
              type="checkbox"
              checked={settings.voiceAutoSpeak}
              onChange={(e) => updateSettings({ voiceAutoSpeak: e.target.checked })}
              className="w-4 h-4 accent-white cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[#888888]">
              <span>Speech Rate</span>
              <span className="text-white">{settings.ttsSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.1"
              value={settings.ttsSpeed}
              onChange={(e) => updateSettings({ ttsSpeed: parseFloat(e.target.value) })}
              className="w-full accent-white cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. Security Safeguards */}
      <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] transition-all space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <h3 className="font-semibold text-xs text-white uppercase tracking-wider font-mono">
            Authorization Policy
          </h3>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#1F1F1F]">
            <div>
              <span className="text-white block font-medium">Auto-Approve Safe Commands</span>
              <span className="text-[10px] text-[#666666]">Skip mobile auth for read-only actions</span>
            </div>
            <input
              type="checkbox"
              checked={settings.autoApproveSafeTasks}
              onChange={(e) => updateSettings({ autoApproveSafeTasks: e.target.checked })}
              className="w-4 h-4 accent-white cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#1F1F1F]">
            <span className="text-[#888888]">Timeout Policy</span>
            <span className="text-white">{settings.confirmationTimeout}s (Auto-Deny)</span>
          </div>
        </div>
      </div>

      {/* Reset Defaults */}
      <div className="pt-1">
        <button
          onClick={resetToDefaults}
          className="w-full py-2.5 rounded-xl bg-[#160000] hover:bg-[#250000] border border-[#FF0000]/20 text-[#FF4444] text-xs font-mono transition-all active:scale-95"
        >
          reset_all_data
        </button>
      </div>

      {/* QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xs bg-[#0A0A0A] border border-[#282828] rounded-2xl p-5 text-center space-y-3 font-mono">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Device Pair Key</h3>
            <div className="w-40 h-40 bg-white p-2 rounded-xl mx-auto flex items-center justify-center">
              <div className="w-full h-full border-4 border-black p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-6 h-6 bg-black" />
                  <div className="w-6 h-6 bg-black" />
                </div>
                <div className="text-black text-[8px] font-bold text-center">KAIRO</div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 bg-black" />
                  <div className="w-4 h-4 bg-black" />
                </div>
              </div>
            </div>
            <div className="text-[10px] text-[#888888] break-all">{settings.authToken}</div>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 rounded-xl vercel-btn-primary text-xs font-semibold"
            >
              close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
