import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Check, 
  X, 
  Copy, 
  Clock
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export const ConfirmationModal: React.FC = () => {
  const { confirmationQueue, respondToConfirmation, laptop } = useKairo();
  const currentReq = confirmationQueue[0];
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);

  useEffect(() => {
    if (!currentReq) return;
    setTimeLeft(currentReq.timeoutSeconds || 45);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          respondToConfirmation(currentReq.id, false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentReq?.id, respondToConfirmation]);

  if (!currentReq) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentReq.commandToExecute);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-[#282828] rounded-2xl p-5 shadow-vercel-lg relative overflow-hidden flex flex-col gap-3.5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2 font-mono">
            <div className="w-7 h-7 rounded-lg bg-[#1F1500] border border-[#F5A623]/40 flex items-center justify-center text-[#F5A623]">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                Remote Auth Request
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-[#F5A623] bg-[#1F1500] px-2 py-0.5 rounded-md border border-[#F5A623]/30">
            <Clock className="w-3 h-3" />
            <span>{timeLeft}s auto-deny</span>
          </div>
        </div>

        {/* Prompt */}
        <div className="space-y-1.5 font-mono text-xs">
          <span className="text-[10px] text-[#666666] uppercase">
            Kairo wants to execute on {laptop.deviceName}:
          </span>
          <div className="p-3 rounded-xl bg-[#111111] border border-[#222222] space-y-1">
            <p className="text-xs font-semibold text-white font-sans leading-snug">
              &ldquo;{currentReq.action}&rdquo;
            </p>
            <div className="text-[10px] text-[#888888]">
              target_task: <span className="text-white">{currentReq.taskName}</span>
            </div>
          </div>
        </div>

        {/* Command code preview */}
        {currentReq.commandToExecute && (
          <div className="space-y-1 font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] text-[#666666]">
              <div className="flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                <span>Shell Payload:</span>
              </div>
              <button 
                onClick={handleCopy}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                {copied ? <Check className="w-2.5 h-2.5 text-[#00E599]" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copied ? 'copied' : 'copy'}</span>
              </button>
            </div>
            <div className="p-2.5 rounded-xl bg-black border border-[#222222] text-[11px] text-[#00E599] overflow-x-auto select-all">
              <code>$ {currentReq.commandToExecute}</code>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
          <button
            onClick={() => respondToConfirmation(currentReq.id, false)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl vercel-btn-secondary text-[#EDEDED] font-medium"
          >
            <X className="w-3.5 h-3.5 text-[#FF4444]" />
            <span>Deny Action</span>
          </button>

          <button
            onClick={() => respondToConfirmation(currentReq.id, true)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl vercel-btn-primary font-semibold"
          >
            <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
            <span>Authorize [Allow]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
