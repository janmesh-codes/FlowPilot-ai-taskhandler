import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  Play, 
  Pause, 
  Clock, 
  Zap, 
  Sparkles, 
  Trash2,
  Check
} from 'lucide-react';
import { Task } from '../types';

interface EmergencyModeViewProps {
  tasks: Task[];
  isEmergencyActive: boolean;
  onToggleEmergency: () => void;
  onPruneTasks: () => void;
}

export default function EmergencyModeView({
  tasks,
  isEmergencyActive,
  onToggleEmergency,
  onPruneTasks
}: EmergencyModeViewProps) {
  const [timeLeft, setTimeLeft] = useState(24 * 3600); // 24 hours countdown
  const [isCounting, setIsCounting] = useState(true);

  // Countdown timer for emergency
  useEffect(() => {
    let interval: any = null;
    if (isCounting && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isCounting, timeLeft]);

  const formatCountdown = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const coreSprints = tasks.filter(t => !t.completed && (t.category === 'Coding' || t.energyLevel === 'high'));
  const deScopedTasks = tasks.filter(t => !t.completed && t.category !== 'Coding' && t.energyLevel !== 'high');

  return (
    <div className="space-y-8 animate-fade-in" id="emergency-view-root">
      
      {/* Alert Header Banner */}
      <div className={`glass-card p-6 md:p-8 transition-colors duration-300 border-2 ${
        isEmergencyActive 
          ? 'border-red-500 bg-red-50/55 text-red-950 shadow-lg shadow-red-500/5' 
          : 'border-[#121e15]/15 bg-white/45 text-[#121e15]'
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className={`h-8 w-8 ${isEmergencyActive ? 'text-red-600 animate-pulse' : 'text-[#121e15]/60'}`} />
              <h1 className="text-xl md:text-2xl font-serif font-black tracking-tight text-[#121e15]">
                {isEmergencyActive ? "CRITICAL EMERGENCY STATUS" : "Emergency Standby Panel"}
              </h1>
            </div>
            <p className="text-xs md:text-sm text-[#121e15]/70 font-semibold leading-relaxed max-w-xl">
              When your milestone is under 24 hours, toggle Emergency Mode to bypass exhaustion, drop low-priority documentation milestones, and execute a dynamic crash-plan.
            </p>
          </div>

          <button 
            onClick={onToggleEmergency}
            className={`px-5 py-2.5 border-2 rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
              isEmergencyActive 
                ? 'bg-red-600 border-red-700 text-white shadow-md' 
                : 'bg-[#bbf246] border-[#121e15] text-[#121e15] shadow-[3px_3px_0px_0px_#121e15] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0px_0px_#121e15]'
            }`}
          >
            {isEmergencyActive ? "Disarm Emergency Mode" : "Activate Emergency Mode"}
          </button>
        </div>
      </div>

      {isEmergencyActive ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main countdown and coaching prompt */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Countdown card */}
            <div className="glass-card border-red-300/40 bg-red-50/35 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-red-500/5 blur-[50px] pointer-events-none" />
              
              <span className="text-xs font-bold uppercase tracking-widest text-red-700 mb-2 font-mono">Absolute Deadline Countdown</span>
              <span className="text-4xl md:text-6xl font-mono font-bold text-red-600 tracking-wider animate-pulse">{formatCountdown(timeLeft)}</span>
              
              <p className="text-xs text-[#121e15]/75 font-semibold mt-4 max-w-sm leading-relaxed">
                Time is ticking down. FlowPilot has paused all daily briefs and is serving direct, continuous focus prompts.
              </p>
            </div>

            {/* Coach guidelines */}
            <div className="glass-card space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#121e15]/70 flex items-center gap-1.5 font-mono">
                <Sparkles className="h-4 w-4 text-[#121e15]" /> Minute-By-Minute Guidelines
              </h3>
              
              <div className="space-y-4 text-xs leading-relaxed text-[#121e15]/80 font-semibold">
                <div className="flex gap-3">
                  <span className="h-6 w-6 rounded-full bg-red-100 border-2 border-red-300 text-red-800 flex items-center justify-center font-mono font-bold shrink-0">1</span>
                  <p className="mt-0.5"><strong>De-Scope Documentation & Review:</strong> You are strictly in an execution crunch. Defer writing slide decks, tests, or cleanups until core functional features compile cleanly.</p>
                </div>

                <div className="flex gap-3">
                  <span className="h-6 w-6 rounded-full bg-red-100 border-2 border-red-300 text-red-800 flex items-center justify-center font-mono font-bold shrink-0">2</span>
                  <p className="mt-0.5"><strong>25/5 Intensity Sprints:</strong> Open the Focus Coach and set 25-minute Pomodoros. Avoid switching tabs to social feeds. Every single segment counts towards success probability.</p>
                </div>

                <div className="flex gap-3">
                  <span className="h-6 w-6 rounded-full bg-red-100 border-2 border-red-300 text-red-800 flex items-center justify-center font-mono font-bold shrink-0">3</span>
                  <p className="mt-0.5"><strong>Strict hydration checks:</strong> High adrenaline spikes cause mental exhaustion quickly. Stretch every 50 minutes to keep cognitive stamina high.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Sprints management side-panel */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick prune triggers */}
            <div className="glass-card border-red-300/40 bg-red-50/25 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1 font-mono">
                <Flame className="h-4 w-4 text-red-600 fill-red-500" /> Crash Timeline Optimization
              </h3>
              <p className="text-xs text-[#121e15]/75 font-semibold leading-relaxed">
                You currently have {deScopedTasks.length} non-essential tasks scheduled. Click below to automatically de-scope them from your task board to clear up focal bandwidth.
              </p>
              
              <button 
                onClick={onPruneTasks}
                disabled={deScopedTasks.length === 0}
                className="w-full py-2.5 bg-red-50 hover:bg-red-100 disabled:bg-slate-100 disabled:text-slate-400 border-2 border-red-300 disabled:border-slate-200 rounded-full text-xs font-mono font-bold text-red-700 transition-colors cursor-pointer"
              >
                Prune {deScopedTasks.length} Low-Priority Tasks
              </button>
            </div>

            {/* Active Core deliverables */}
            <div className="glass-card space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#121e15]/60 font-mono">Core Deliverables Only</h3>
              
              <div className="space-y-2">
                {coreSprints.length > 0 ? (
                  coreSprints.map((task, idx) => (
                    <div key={task.id} className="p-3 rounded-2xl border-2 border-[#121e15]/10 bg-white/45 text-xs flex justify-between items-center font-semibold text-[#121e15]">
                      <span>{task.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[9px] uppercase font-mono font-bold">
                        CRITICAL
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#121e15]/50 italic py-4 text-center font-semibold">
                    No critical tasks pending!
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="text-center py-20 glass-card border-dashed border-2 border-[#121e15]/15 text-[#121e15]/60 max-w-2xl mx-auto p-6">
          <ShieldAlert className="h-12 w-12 mx-auto text-[#121e15]/40 mb-4 animate-[pulse_3s_infinite]" />
          <p className="font-serif font-black text-xl text-[#121e15]">Standby Mode</p>
          <p className="text-xs text-[#121e15]/70 mt-3 leading-relaxed font-semibold">
            Emergency mode is disarmed. The Daily Briefing and standard Energy-Based scheduling workloads are running normally. Toggle emergency rules only when a crunch-point deadline is under 24 hours.
          </p>
          <button 
            onClick={onToggleEmergency}
            className="mt-6 px-5 py-2.5 bg-[#bbf246] border-2 border-[#121e15] rounded-full text-xs font-mono uppercase tracking-wider font-bold text-[#121e15] shadow-[3px_3px_0px_0px_#121e15] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0px_0px_#121e15] transition-all cursor-pointer"
          >
            Simulate Emergency Crunch
          </button>
        </div>
      )}

    </div>
  );
}
