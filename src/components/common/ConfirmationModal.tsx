import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Check, 
  X, 
  Copy, 
  Clock, 
  AlertTriangle,
  Laptop
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
          // Auto deny on timeout for security
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#121322] border-2 border-amber-500/50 rounded-3xl p-5 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative overflow-hidden flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        {/* Glow ambient highlight */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white tracking-wide">
                  Execution Auth Request
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  {currentReq.riskLevel} Risk
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Kairo is paused waiting for your approval
              </p>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center gap-1 text-xs font-mono text-amber-300/90 bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-500/20">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Request Prompt */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Kairo wants to execute on {laptop.deviceName}:
          </span>
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent border border-amber-500/30">
            <p className="text-sm font-semibold text-white leading-snug">
              &ldquo;{currentReq.action}&rdquo;
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="text-slate-500">Related Task:</span>
              <span className="text-purple-300 font-medium">{currentReq.taskName}</span>
            </div>
          </div>
        </div>

        {/* Command code preview */}
        {currentReq.commandToExecute && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <Terminal className="w-3 h-3 text-slate-400" />
                <span>Laptop Shell Payload:</span>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-emerald-300/90 overflow-x-auto select-all">
              <code>$ {currentReq.commandToExecute}</code>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => respondToConfirmation(currentReq.id, false)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 active:bg-slate-900 border border-white/10 text-slate-300 font-semibold text-sm transition-all active:scale-95 shadow-sm"
          >
            <X className="w-4 h-4 text-red-400" />
            <span>Deny</span>
          </button>

          <button
            onClick={() => respondToConfirmation(currentReq.id, true)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 hover:opacity-90 active:opacity-100 text-white font-bold text-sm transition-all active:scale-95 shadow-[0_0_25px_rgba(124,110,248,0.4)]"
          >
            <Check className="w-4 h-4 text-emerald-200 stroke-[3]" />
            <span>Allow</span>
          </button>
        </div>

        {/* Security footnote */}
        <div className="text-center pt-1 text-[10px] text-slate-500">
          Encrypted token validation &bull; Remote laptop execution policy active
        </div>
      </div>
    </div>
  );
};
