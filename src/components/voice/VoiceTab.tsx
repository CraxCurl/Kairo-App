import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Volume2, 
  VolumeX, 
  Send, 
  Terminal,
  CheckCircle2
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export const VoiceTab: React.FC = () => {
  const { 
    voiceHistory, 
    processVoiceCommand, 
    laptop, 
    settings, 
    updateSettings 
  } = useKairo();

  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualText, setManualText] = useState('');

  const recognitionRef = useRef<any>(null);

  const voiceCommandChips = [
    "What's next?",
    "Add finish my Java assignment to tomorrow.",
    "Pause Kairo.",
    "Resume Kairo.",
    "Skip the current task.",
    "Move LeetCode to the top.",
    "What have I completed today?",
    "Is my laptop online?"
  ];

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setLiveTranscript(transcript);
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      if (liveTranscript.trim()) handleSubmitCommand(liveTranscript);
    } else {
      setLiveTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    const randomCommand = voiceCommandChips[Math.floor(Math.random() * voiceCommandChips.length)];
    let index = 0;
    const interval = setInterval(() => {
      if (index <= randomCommand.length) {
        setLiveTranscript(randomCommand.slice(0, index));
        index += 3;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsListening(false);
          handleSubmitCommand(randomCommand);
        }, 500);
      }
    }, 70);
  };

  const handleSubmitCommand = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setLiveTranscript('');
    try {
      await processVoiceCommand(text);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-4 pb-28 pt-1 flex flex-col items-center font-sans">
      {/* Voice Mode Header */}
      <div className="w-full flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Voice Remote Interface</span>
          </h2>
          <p className="text-xs text-[#666666] font-mono">
            Bidirectional audio stream &bull; {laptop.deviceName}
          </p>
        </div>

        <button
          onClick={() => updateSettings({ voiceAutoSpeak: !settings.voiceAutoSpeak })}
          className={`p-2 rounded-xl border transition-all ${
            settings.voiceAutoSpeak 
              ? 'bg-white text-black border-white' 
              : 'bg-[#111111] border-[#242424] text-[#666666]'
          }`}
          title={settings.voiceAutoSpeak ? 'Voice response enabled' : 'Voice response muted'}
        >
          {settings.voiceAutoSpeak ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Central Audio Visualizer & Mic Button */}
      <div className="w-full py-6 flex flex-col items-center justify-center relative">
        {/* Minimal Audio Bars */}
        <div className="flex items-center justify-center gap-1 h-10 mb-4">
          <div className={`w-1 rounded-full bg-white transition-all ${isListening ? 'animate-vwave-1' : 'h-1.5 opacity-30'}`} />
          <div className={`w-1 rounded-full bg-white transition-all ${isListening ? 'animate-vwave-2' : 'h-2 opacity-30'}`} />
          <div className={`w-1 rounded-full bg-white transition-all ${isListening ? 'animate-vwave-3' : 'h-1.5 opacity-30'}`} />
          <div className={`w-1 rounded-full bg-white transition-all ${isListening ? 'animate-vwave-4' : 'h-3 opacity-30'}`} />
          <div className={`w-1 rounded-full bg-white transition-all ${isListening ? 'animate-vwave-5' : 'h-1.5 opacity-30'}`} />
          <div className={`w-1 rounded-full bg-white transition-all ${isListening ? 'animate-vwave-2' : 'h-2.5 opacity-30'}`} />
          <div className={`w-1 rounded-full bg-white transition-all ${isListening ? 'animate-vwave-1' : 'h-1.5 opacity-30'}`} />
        </div>

        {/* Vercel Style Mic Orb */}
        <button
          onClick={handleToggleListening}
          className={`w-24 h-24 rounded-2xl p-0.5 transition-all duration-200 active:scale-95 border ${
            isListening
              ? 'bg-white text-black border-white shadow-vercel-glow'
              : 'bg-[#0E0E0E] text-white border-[#2A2A2A] hover:border-white/40'
          }`}
        >
          <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center">
            <Mic className={`w-8 h-8 ${isListening ? 'text-black' : 'text-white'}`} />
            <span className={`text-[9px] font-mono font-semibold uppercase tracking-wider mt-1 ${
              isListening ? 'text-black' : 'text-[#666666]'
            }`}>
              {isListening ? 'listening...' : isProcessing ? 'thinking...' : 'tap to talk'}
            </span>
          </div>
        </button>

        {/* Live speech preview */}
        {isListening && liveTranscript && (
          <div className="mt-3 px-3 py-1.5 rounded-xl bg-[#111111] border border-[#2A2A2A] text-xs text-white font-mono animate-in fade-in max-w-xs text-center">
            &gt; {liveTranscript}
          </div>
        )}
      </div>

      {/* Suggested Voice Commands */}
      <div className="w-full space-y-1.5">
        <span className="text-[10px] font-mono uppercase text-[#666666] tracking-wider">
          Suggested Prompts:
        </span>

        <div className="flex flex-wrap gap-1 font-mono text-xs">
          {voiceCommandChips.map((cmd, i) => (
            <button
              key={i}
              onClick={() => handleSubmitCommand(cmd)}
              className="px-2.5 py-1 rounded-lg bg-[#0A0A0A] hover:bg-[#141414] border border-[#222222] hover:border-[#383838] text-[#888888] hover:text-white transition-all active:scale-95"
            >
              &gt; {cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input */}
      <div className="w-full pt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (manualText.trim()) {
              handleSubmitCommand(manualText);
              setManualText('');
            }
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="or type prompt to execute..."
            className="flex-1 p-2.5 rounded-xl bg-black border border-[#242424] text-white text-xs placeholder:text-[#555555] focus:outline-none focus:border-white transition-all font-mono"
          />
          <button
            type="submit"
            disabled={!manualText.trim()}
            className="p-2.5 rounded-xl vercel-btn-primary disabled:opacity-30"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Transcript Log */}
      <div className="w-full space-y-2 pt-2">
        <span className="text-[10px] font-mono uppercase text-[#666666] tracking-wider">
          Dialogue Stream:
        </span>

        <div className="space-y-2 font-mono text-xs">
          {voiceHistory.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-[#0A0A0A] border border-[#222222] space-y-1.5"
            >
              <div className="flex items-center justify-between text-[#888888]">
                <span>user: &ldquo;{item.userInput}&rdquo;</span>
                <span className="text-[10px] text-[#555555]">{item.timestamp}</span>
              </div>
              <div className="pl-2 border-l border-white/20 text-[#EDEDED] font-sans text-xs">
                {item.kairoResponse}
              </div>
              {item.actionTaken && (
                <div className="text-[10px] text-[#00E599] flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>action: {item.actionTaken}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
