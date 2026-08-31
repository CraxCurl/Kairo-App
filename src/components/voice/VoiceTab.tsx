import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Send, 
  RotateCcw, 
  Radio, 
  CheckCircle2, 
  Clock,
  Laptop
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

export const VoiceTab: React.FC = () => {
  const { 
    voiceHistory, 
    processVoiceCommand, 
    kairoStatus, 
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

  // Initialize Web Speech API if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setLiveTranscript(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      if (liveTranscript.trim()) {
        handleSubmitCommand(liveTranscript);
      }
    } else {
      setLiveTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          // Fallback to simulated voice input
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
        }, 600);
      }
    }, 80);
  };

  const handleSubmitCommand = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setLiveTranscript('');
    try {
      await processVoiceCommand(text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-4 pb-28 pt-1 flex flex-col items-center">
      {/* Voice Mode Header */}
      <div className="w-full flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Kairo Voice Assistant</span>
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          </h2>
          <p className="text-xs text-slate-400">
            Realtime bidirectional voice link to {laptop.deviceName}
          </p>
        </div>

        {/* TTS Mute / Unmute Toggle */}
        <button
          onClick={() => updateSettings({ voiceAutoSpeak: !settings.voiceAutoSpeak })}
          className={`p-2 rounded-xl border transition-all ${
            settings.voiceAutoSpeak 
              ? 'bg-purple-950/50 border-purple-500/40 text-purple-300' 
              : 'bg-slate-900 border-white/5 text-slate-500'
          }`}
          title={settings.voiceAutoSpeak ? 'Voice response enabled' : 'Voice response muted'}
        >
          {settings.voiceAutoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Central Audio Visualizer & Mic Orb */}
      <div className="w-full py-8 flex flex-col items-center justify-center relative">
        {/* Glow backdrop */}
        <div className={`absolute w-56 h-56 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isListening 
            ? 'bg-purple-500/30 scale-125' 
            : isProcessing 
            ? 'bg-indigo-500/30' 
            : 'bg-purple-900/15'
        }`} />

        {/* Audio Waveform Bars */}
        <div className="flex items-center justify-center gap-1.5 h-14 mb-4">
          <div className={`w-1.5 rounded-full bg-gradient-to-t from-purple-600 to-indigo-400 transition-all ${
            isListening ? 'animate-wave-1' : 'h-2 opacity-40'
          }`} />
          <div className={`w-1.5 rounded-full bg-gradient-to-t from-purple-600 to-pink-400 transition-all ${
            isListening ? 'animate-wave-2' : 'h-3 opacity-40'
          }`} />
          <div className={`w-1.5 rounded-full bg-gradient-to-t from-indigo-500 to-purple-400 transition-all ${
            isListening ? 'animate-wave-3' : 'h-2 opacity-40'
          }`} />
          <div className={`w-1.5 rounded-full bg-gradient-to-t from-purple-500 to-emerald-400 transition-all ${
            isListening ? 'animate-wave-4' : 'h-4 opacity-40'
          }`} />
          <div className={`w-1.5 rounded-full bg-gradient-to-t from-pink-500 to-purple-400 transition-all ${
            isListening ? 'animate-wave-5' : 'h-2 opacity-40'
          }`} />
          <div className={`w-1.5 rounded-full bg-gradient-to-t from-indigo-600 to-blue-400 transition-all ${
            isListening ? 'animate-wave-2' : 'h-3 opacity-40'
          }`} />
          <div className={`w-1.5 rounded-full bg-gradient-to-t from-purple-600 to-indigo-400 transition-all ${
            isListening ? 'animate-wave-1' : 'h-2 opacity-40'
          }`} />
        </div>

        {/* Interactive Mic Button */}
        <button
          onClick={handleToggleListening}
          className={`w-28 h-28 rounded-full p-1 transition-all duration-300 active:scale-95 relative group ${
            isListening
              ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-emerald-400 shadow-glow-lg animate-pulse'
              : 'bg-gradient-to-tr from-purple-700 via-indigo-600 to-slate-800 shadow-glow-md hover:scale-105'
          }`}
        >
          <div className="w-full h-full rounded-full bg-[#0E0F1A] flex flex-col items-center justify-center relative overflow-hidden">
            <div className={`absolute inset-0 transition-opacity ${
              isListening ? 'bg-purple-600/30' : 'bg-purple-500/10 group-hover:bg-purple-500/20'
            }`} />
            {isListening ? (
              <Mic className="w-10 h-10 text-purple-300 animate-bounce" />
            ) : (
              <Mic className="w-10 h-10 text-slate-200 group-hover:text-purple-300 transition-colors" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-1">
              {isListening ? 'Listening...' : isProcessing ? 'Thinking...' : 'Tap to Talk'}
            </span>
          </div>
        </button>

        {/* Live speech preview */}
        {isListening && liveTranscript && (
          <div className="mt-4 px-4 py-2 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-xs text-purple-200 animate-in fade-in max-w-xs text-center font-mono">
            &ldquo;{liveTranscript}&rdquo;
          </div>
        )}
      </div>

      {/* Suggested Voice Commands */}
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
            Sample Voice Commands
          </span>
          <span className="text-[10px] text-purple-400">Tap to execute</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {voiceCommandChips.map((cmd, i) => (
            <button
              key={i}
              onClick={() => handleSubmitCommand(cmd)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-purple-950/60 border border-white/5 hover:border-purple-500/30 text-slate-300 hover:text-purple-200 text-xs font-medium transition-all active:scale-95"
            >
              &ldquo;{cmd}&rdquo;
            </button>
          ))}
        </div>
      </div>

      {/* Manual Text Command Input */}
      <div className="w-full pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (manualText.trim()) {
              handleSubmitCommand(manualText);
              setManualText('');
            }
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Or type a voice command here..."
            className="flex-1 p-3 rounded-2xl bg-slate-950/70 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!manualText.trim()}
            className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all shadow-glow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Voice Exchanges Transcript Feed */}
      <div className="w-full space-y-3 pt-3">
        <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
          Voice Dialogue History
        </span>

        <div className="space-y-3">
          {voiceHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-[#11121C]/80 border border-white/[0.08] space-y-2 backdrop-blur-xl"
            >
              {/* User speech line */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 text-[10px] font-bold">
                  You
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-200">
                    &ldquo;{item.userInput}&rdquo;
                  </p>
                  <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                </div>
              </div>

              {/* Kairo AI response */}
              <div className="flex items-start gap-2.5 pl-2 pt-1 border-l-2 border-purple-500/40">
                <div className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-purple-100 leading-relaxed font-sans">
                    {item.kairoResponse}
                  </p>
                  {item.actionTaken && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-[10px] font-medium text-purple-300">
                      <CheckCircle2 className="w-3 h-3 text-purple-400" />
                      <span>{item.actionTaken}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
