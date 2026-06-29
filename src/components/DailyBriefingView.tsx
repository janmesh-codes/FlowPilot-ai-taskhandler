import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  Calendar, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Maximize2
} from 'lucide-react';
import { Task, CalendarBlock, RiskMetrics, Motivation } from '../types';

interface DailyBriefingViewProps {
  tasks: Task[];
  calendarBlocks: CalendarBlock[];
  riskMetrics: RiskMetrics;
  motivation: Motivation;
  onNavigate: (tab: any) => void;
  isEmergencyActive: boolean;
}

export default function DailyBriefingView({
  tasks,
  calendarBlocks,
  riskMetrics,
  motivation,
  onNavigate,
  isEmergencyActive
}: DailyBriefingViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  // Handle actual SpeechSynthesis voice playback
  useEffect(() => {
    if (isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToSpeak = getBriefingText();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        
        utterance.onend = () => {
          setIsPlaying(false);
          setPlaybackProgress(100);
          setTimeout(() => setPlaybackProgress(0), 1000);
        };
        utterance.onerror = () => {
          setIsPlaying(false);
          setPlaybackProgress(0);
        };
        
        window.speechSynthesis.speak(utterance);
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying]);

  // Handle progress bar track timing matched dynamically with the word count
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      const textWordCount = getBriefingText().split(/\s+/).length;
      // 150 words per min = ~2.5 words/sec. Let's allocate 2.3 words/sec to match natural breathing pauses
      const estimatedDurationSeconds = Math.max(8, textWordCount / 2.3);
      const tickMs = (estimatedDurationSeconds * 1000) / 100;

      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 98) {
            return 98; // hold at 98% until speech completes and sets 100%
          }
          return prev + 1;
        });
      }, tickMs);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const getBriefingText = () => {
    if (tasks.length === 0) {
      return "Good day! Your command logs are currently empty. Please activate the Command Center to generate an AI sprint. Once your constraints are computed, I will give you a daily voice briefing right here.";
    }

    const unfinished = tasks.filter(t => !t.completed);
    const completedCount = tasks.filter(t => t.completed).length;

    let text = `Good morning Janmesh. Today, you have ${unfinished.length} action items on your radar. We have already completed ${completedCount} subtasks representing an optimized focus velocity. `;
    
    if (isEmergencyActive) {
      text += `Our active telemetry indicates Emergency Mode is running. I have fully reprioritized your evening blocks and scheduled high-cognitive coding sprints. No slack remains. Let's execute.`;
    } else {
      text += `Our risk algorithms predict a ${100 - riskMetrics.confidence}% delay probability on current milestones unless study or coding focus is prioritized tonight. My recommendation is to tackle '${unfinished[0]?.title || "your pending coding tasks"}' early in the evening.`;
    }

    return text;
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 animate-fade-in relative z-10" id="daily-briefing-view">
      
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-serif font-black text-[#121e15] flex items-center gap-2.5">
          <BrainCircuit className="h-8 w-8 text-[#121e15] fill-[#bbf246]" /> Daily Briefing
        </h1>
        <p className="text-[#121e15]/70 text-sm font-semibold mt-1">Your synthesized summary & workload projection for today.</p>
      </div>

      {/* Narrative Section & Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Playable Briefing Card */}
        <div className="lg:col-span-8 cause-card space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-blue-400/[0.03] blur-[50px] pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-[#121e15]/10 pb-4 gap-4">
            <div>
              <span className="cause-pill-lime">Audio Stream Synthesis</span>
              <p className="text-[#121e15]/60 text-xs font-mono font-bold mt-2">{todayStr}</p>
            </div>
            
            {/* Audio Waveform Simulator */}
            {isPlaying && (
              <div className="flex items-end gap-1 h-6">
                <span className="w-1.5 bg-[#121e15] animate-[bounce_0.8s_infinite_100ms] rounded-full" style={{ height: '60%' }} />
                <span className="w-1.5 bg-[#121e15] animate-[bounce_0.8s_infinite_300ms] rounded-full" style={{ height: '100%' }} />
                <span className="w-1.5 bg-[#121e15] animate-[bounce_0.8s_infinite_150ms] rounded-full" style={{ height: '40%' }} />
                <span className="w-1.5 bg-[#121e15] animate-[bounce_0.8s_infinite_450ms] rounded-full" style={{ height: '80%' }} />
                <span className="w-1.5 bg-[#121e15] animate-[bounce_0.8s_infinite_200ms] rounded-full" style={{ height: '50%' }} />
              </div>
            )}
          </div>

          {/* Coach Motivation Narrative */}
          <div className="space-y-4">
            <div className="text-[#121e15] leading-relaxed font-sans text-base border-l-4 border-[#121e15] pl-4 py-2 italic bg-[#f5eedc]/30 rounded-r-2xl p-4 font-semibold">
              "{getBriefingText()}"
            </div>
            
            {motivation.urgencySlogan && (
              <div className="cause-pill-beige">
                <Sparkles className="h-3.5 w-3.5 text-[#121e15] fill-white" />
                <span>{motivation.urgencySlogan}</span>
              </div>
            )}
          </div>

          {/* Player controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#f5eedc]/40 p-4 rounded-2xl border-2 border-[#121e15]/10">
            <button 
              onClick={togglePlayback}
              className="p-3.5 rounded-full bg-[#121e15] text-[#bbf246] hover:bg-[#121e15]/90 transition-all cursor-pointer shadow-md shadow-slate-950/10"
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-[#bbf246]" /> : <Play className="h-5 w-5 fill-[#bbf246] ml-0.5" />}
            </button>
            
            <div className="flex-1 w-full space-y-1">
              <div className="flex justify-between items-center text-[10px] text-[#121e15]/70 font-mono font-bold">
                <span>AI Vocal Assistant (Voice: Kore)</span>
                <span>{isPlaying ? `${Math.round(playbackProgress * 0.35)}s` : "0:00"} / 0:35</span>
              </div>
              
              {/* Progress track */}
              <div className="h-2 w-full bg-[#f5eedc]/80 border border-[#121e15]/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#121e15] rounded-full transition-all duration-300"
                  style={{ width: `${playbackProgress}%` }}
                />
              </div>
            </div>

            <Volume2 className="h-5 w-5 text-[#121e15]/60 shrink-0 hidden sm:block" />
          </div>
        </div>

        {/* Action Blocks Today */}
        <div className="lg:col-span-4 cause-card space-y-6">
          <h2 className="text-lg font-serif font-black text-[#121e15] flex items-center gap-2 border-b-2 border-[#121e15]/10 pb-4">
            <Calendar className="h-5 w-5 text-[#121e15]" /> Today's Focus Slots
          </h2>

          <div className="space-y-4">
            {calendarBlocks.length > 0 ? (
              calendarBlocks.slice(0, 3).map((block) => {
                const startTime = new Date(block.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const endTime = new Date(block.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div key={block.id} className="p-4 rounded-2xl border-2 border-[#121e15]/10 bg-[#f5eedc]/10 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-[#121e15]">{block.title}</h4>
                      <p className="text-[10px] text-[#121e15]/60 font-mono font-bold mt-1">{startTime} - {endTime}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 border-t-2 border-[#121e15]/5 pt-2">
                      <span className="text-[9px] text-[#121e15]/60 uppercase font-mono font-bold">{block.energySpent} energy load</span>
                      <button 
                        onClick={() => onNavigate('calendar')}
                        className="text-[9px] font-mono uppercase tracking-wider font-bold text-[#121e15] bg-[#bbf246] border-2 border-[#121e15] px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#121e15] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#121e15] transition-all cursor-pointer flex items-center gap-0.5"
                      >
                        Adjust <ArrowRight className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-[#121e15]/40 text-sm font-semibold">
                No active focus slots calculated for today. Initialize a goal under AI Command.
              </div>
            )}
          </div>
          
          {/* Daily Risk assessment */}
          {tasks.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-black text-rose-800 uppercase tracking-wider font-mono">
                <ShieldAlert className="h-4 w-4" /> Risk Assessment
              </div>
              <p className="text-xs text-rose-900 leading-relaxed font-sans font-semibold">
                {riskMetrics.assessment}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
