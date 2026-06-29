import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  AlertTriangle, 
  Plus, 
  Flame, 
  Zap,
  CheckCircle2,
  ListRestart
} from 'lucide-react';
import { Motivation } from '../types';

interface FocusCoachViewProps {
  onCompleteSession: (minutes: number, category: string) => void;
  completedPomodoros: number;
  motivation: Motivation;
}

interface Distraction {
  time: string;
  cause: string;
}

export default function FocusCoachView({ 
  onCompleteSession, 
  completedPomodoros, 
  motivation 
}: FocusCoachViewProps) {
  const [sessionLength, setSessionLength] = useState(25); // in minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSound, setSelectedSound] = useState<'none' | 'rain' | 'lofi' | 'white'>('none');
  const [distractionText, setDistractionText] = useState('');
  const [distractions, setDistractions] = useState<Distraction[]>([]);
  const [coachingAlert, setCoachingAlert] = useState<string>('');

  // Update timer when session length changes
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(sessionLength * 60);
    }
  }, [sessionLength]);

  // Core countdown ticker
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      onCompleteSession(sessionLength, "Pomodoro Sprints");
      setTimeLeft(sessionLength * 60);
      setCoachingAlert("Superb execution! Focus cycle completed. Take a well-deserved 5-minute break.");
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
    setCoachingAlert('');
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionLength * 60);
    setCoachingAlert('');
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Sound select helper
  const handleSoundSelect = (sound: 'none' | 'rain' | 'lofi' | 'white') => {
    setSelectedSound(sound);
  };

  // Handle distraction logging
  const handleAddDistraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!distractionText.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newDistraction = { time: timeStr, cause: distractionText };
    setDistractions([newDistraction, ...distractions]);
    setDistractionText('');

    // Dynamic coach recommendation based on distraction text
    const text = distractionText.toLowerCase();
    if (text.includes("phone") || text.includes("instagram") || text.includes("social") || text.includes("youtube")) {
      setCoachingAlert("Focus Coach: Digital notifications decrease your cognitive efficiency by 40%. Put your phone in another room until this sprint completes.");
    } else if (text.includes("email") || text.includes("slack") || text.includes("message")) {
      setCoachingAlert("Focus Coach: Asynchronous communication breaks context-switching. Close all communication tabs during focus windows.");
    } else if (text.includes("tired") || text.includes("burnout") || text.includes("fatigue")) {
      setCoachingAlert("Focus Coach: Physical strain detected. Try standard 20-20-20 screen relief: look 20 feet away for 20 seconds, or stretch.");
    } else {
      setCoachingAlert("Focus Coach: External noise logged. Focus ambient soundtracks (Rain or White Noise) are recommended to mask acoustic distractions.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="focus-coach-root">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-serif font-black text-[#121e15] flex items-center gap-2.5">
          <Flame className="h-8 w-8 text-[#121e15]" /> Focus Coach Workspace
        </h1>
        <p className="text-[#121e15]/70 text-sm font-semibold mt-1">
          Lock in your attention windows. Block distractions and log interruptions to retrain cognitive consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Core Timer Panel */}
        <div className="lg:col-span-7 glass-card p-8 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-[60px] pointer-events-none" />
          
          {/* Quick preset lengths */}
          <div className="flex gap-2 mb-8 relative z-10">
            {[15, 25, 50].map((mins) => (
              <button
                key={mins}
                onClick={() => { if (!isRunning) setSessionLength(mins); }}
                className={`px-4 py-1.5 rounded-full border-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  sessionLength === mins && !isRunning
                    ? 'border-[#121e15] bg-[#bbf246] text-[#121e15]'
                    : 'border-[#121e15]/20 bg-white/45 text-[#121e15]/75 hover:border-[#121e15]/40'
                }`}
              >
                {mins}m sprint
              </button>
            ))}
          </div>

          {/* Large Countdown display */}
          <div className="relative flex items-center justify-center w-64 h-64 rounded-full border-4 border-[#121e15] bg-[#fcfaf2]/65 shadow-2xl mb-8">
            {/* Visual ticking ring indicator */}
            <div className="absolute inset-0 rounded-full border border-[#121e15]/20 animate-[pulse_2s_infinite]" />
            
            <div className="text-center">
              <span className="text-5xl md:text-6xl font-mono font-bold text-[#121e15] tracking-widest">{formatTime(timeLeft)}</span>
              <p className="text-[10px] text-[#121e15]/60 uppercase tracking-widest font-mono font-bold mt-2">
                {isRunning ? "Focus Pipeline Open" : "Standby Queue"}
              </p>
            </div>
          </div>

          {/* Active controls */}
          <div className="flex gap-4 relative z-10">
            <button 
              onClick={toggleTimer}
              className={`px-8 py-3.5 border-2 border-[#121e15] rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                isRunning 
                  ? 'bg-rose-50 border-rose-300 text-rose-800' 
                  : 'bg-[#121e15] text-[#bbf246] hover:bg-[#121e15]/90'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause Session</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-[#bbf246]" />
                  <span>Open Focus Session</span>
                </>
              )}
            </button>

            <button 
              onClick={resetTimer}
              className="p-3.5 rounded-full border-2 border-[#121e15] bg-[#fdfcf7] text-[#121e15] hover:bg-[#121e15]/5 transition-colors cursor-pointer flex items-center justify-center"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>

          {/* Coaching Alert box */}
          {coachingAlert && (
            <div className="mt-8 p-4 rounded-2xl border-2 border-[#121e15]/20 bg-[#bbf246]/10 text-[#121e15] text-xs leading-relaxed font-semibold flex items-start gap-2.5 max-w-md w-full animate-fade-in">
              <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-[#121e15] fill-white" />
              <span>{coachingAlert}</span>
            </div>
          )}
        </div>

        {/* Ambient audio & distractions queue */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Audio Presets */}
          <div className="glass-card space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#121e15]/60 flex items-center gap-1.5 font-mono">
              <Volume2 className="h-4 w-4 text-[#121e15]" /> Focus Ambient Layer
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'none', label: 'No Layer' },
                { id: 'rain', label: 'Zen Rain Layer' },
                { id: 'lofi', label: 'Lofi Space Loop' },
                { id: 'white', label: 'White Noise Shroud' }
              ].map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => handleSoundSelect(sound.id as any)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    selectedSound === sound.id
                      ? 'border-[#121e15] bg-[#bbf246]/20 text-[#121e15]'
                      : 'border-[#121e15]/15 bg-white/45 text-[#121e15]/70 hover:border-[#121e15]/30'
                  }`}
                >
                  <p className="font-bold text-[#121e15]">{sound.label}</p>
                  <span className="text-[9px] text-[#121e15]/60 uppercase font-mono mt-1 block font-bold">
                    {selectedSound === sound.id ? "Synthesizing" : "Muted"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Distractions Logger */}
          <div className="glass-card space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#121e15]/60 flex items-center gap-1.5 font-mono">
              <AlertTriangle className="h-4 w-4 text-rose-500" /> Distraction Telemetry
            </h3>
            
            <p className="text-xs text-[#121e15]/70 font-semibold leading-relaxed">
              Log any distraction immediately (e.g. "Looked at phone", "Opened Slack"). The Coach will provide custom cognitive recovery suggestions.
            </p>

            <form onSubmit={handleAddDistraction} className="flex gap-2">
              <input 
                type="text" 
                value={distractionText} 
                onChange={e => setDistractionText(e.target.value)} 
                placeholder="Logged detail..."
                className="flex-1 rounded-full border-2 border-[#121e15] bg-[#fdfcf7] p-3 text-xs text-[#121e15] placeholder-[#121e15]/40 focus:outline-none font-semibold font-sans"
              />
              <button 
                type="submit"
                className="p-3 rounded-full bg-[#121e15] border-2 border-[#121e15] text-[#bbf246] transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>

            {distractions.length > 0 && (
              <div className="space-y-2 border-t-2 border-[#121e15]/10 pt-4 max-h-40 overflow-y-auto">
                {distractions.map((dist, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px] p-3 rounded-xl bg-white/40 border-2 border-[#121e15]/10 font-mono font-bold text-[#121e15]">
                    <span>{dist.cause}</span>
                    <span className="text-[#121e15]/50">{dist.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
