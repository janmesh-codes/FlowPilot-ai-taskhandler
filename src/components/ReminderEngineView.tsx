import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BellRing,
  BrainCircuit, 
  Clock, 
  Hourglass, 
  TrendingUp, 
  ShieldAlert, 
  AlertTriangle,
  CheckCircle, 
  Play, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ArrowRight, 
  Sliders, 
  Gauge, 
  Lightbulb, 
  Zap, 
  RotateCcw,
  Power,
  Sparkles,
  Calendar
} from 'lucide-react';

type StageType = 'stage1' | 'stage2' | 'stage3' | 'stage4';

export default function ReminderEngineView() {
  // Decision Engine Input States
  const [deadlineHours, setDeadlineHours] = useState<number>(48);
  const [estimatedWorkHours, setEstimatedWorkHours] = useState<number>(8);
  const [taskDifficulty, setTaskDifficulty] = useState<'Low' | 'Medium' | 'High' | 'Extreme'>('Medium');
  const [postponedTimes, setPostponedTimes] = useState<number>(1);
  const [focusScore, setFocusScore] = useState<number>(85);
  const [energyLevel, setEnergyLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Interactive Simulation States
  const [activeStage, setActiveStage] = useState<StageType>('stage2');
  const [simulatedEscalationStep, setSimulatedEscalationStep] = useState<number>(0);
  const [isEscalating, setIsEscalating] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechText, setSpeechText] = useState<string>('');
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [isFocusModeEnabled, setIsFocusModeEnabled] = useState<boolean>(false);
  const [isPomodoroEnabled, setIsPomodoroEnabled] = useState<boolean>(false);
  const [calendarOptimized, setCalendarOptimized] = useState<boolean>(false);

  // Dynamic calculations based on inputs
  const [calculatedSuccessProb, setCalculatedSuccessProb] = useState<number>(82);
  const [calculatedRisk, setCalculatedRisk] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [recommendedStage, setRecommendedStage] = useState<StageType>('stage2');

  const audioWaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [waveHeights, setWaveHeights] = useState<number[]>([12, 24, 8, 16, 32, 12, 16, 8, 24, 12]);

  // Handle SpeechSynthesis fallback/audio visualizer
  useEffect(() => {
    if (isSpeaking) {
      audioWaveIntervalRef.current = setInterval(() => {
        setWaveHeights(Array.from({ length: 12 }, () => Math.floor(Math.random() * 32) + 4));
      }, 100);
    } else {
      if (audioWaveIntervalRef.current) clearInterval(audioWaveIntervalRef.current);
      setWaveHeights([4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]);
    }
    return () => {
      if (audioWaveIntervalRef.current) clearInterval(audioWaveIntervalRef.current);
    };
  }, [isSpeaking]);

  // Recalculate variables when engine parameters change
  useEffect(() => {
    // 1. Success Probability Formula
    let prob = 100;
    
    // Impact of deadline vs work ratio
    const ratio = deadlineHours / Math.max(1, estimatedWorkHours);
    if (ratio < 1.2) {
      prob -= 45;
    } else if (ratio < 2.0) {
      prob -= 25;
    } else if (ratio < 4.0) {
      prob -= 12;
    } else if (ratio > 8.0) {
      prob += 5;
    }

    // Postponement impact
    prob -= postponedTimes * 8;

    // Difficulty impact
    if (taskDifficulty === 'Low') prob += 5;
    if (taskDifficulty === 'High') prob -= 12;
    if (taskDifficulty === 'Extreme') prob -= 25;

    // Focus Score impact
    prob += (focusScore - 80) * 0.3;

    // Energy level impact
    if (energyLevel === 'Low') prob -= 8;
    if (energyLevel === 'High') prob += 6;

    const finalProb = Math.min(99, Math.max(5, Math.round(prob)));
    setCalculatedSuccessProb(finalProb);

    // 2. Risk Evaluation
    let risk: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
    if (finalProb < 45 || ratio < 1.3 || deadlineHours <= 8) {
      risk = 'Critical';
    } else if (finalProb < 70 || ratio < 2.5 || deadlineHours <= 24) {
      risk = 'High';
    } else if (finalProb < 88 || ratio < 4.5 || deadlineHours <= 72) {
      risk = 'Medium';
    }
    setCalculatedRisk(risk);

    // 3. Recommended Stage Selection
    let recStage: StageType = 'stage1';
    if (ratio < 1.5 || deadlineHours <= 12) {
      recStage = 'stage4';
    } else if (ratio < 3.0 || deadlineHours <= 36 || postponedTimes >= 3) {
      recStage = 'stage3';
    } else if (ratio < 6.0 || deadlineHours <= 96) {
      recStage = 'stage2';
    } else {
      recStage = 'stage1';
    }
    setRecommendedStage(recStage);
  }, [deadlineHours, estimatedWorkHours, taskDifficulty, postponedTimes, focusScore, energyLevel]);

  // Voice Speech Controller
  const speakVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeechText(text);
      
      if (isMuted) {
        // Just show text/simulate speech animation
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 4500);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback visual simulation
      setSpeechText(text);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 5000);
    }
  };

  const stopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Stage Voice Content Map
  const speakStageVoice = (stage: StageType) => {
    let line = '';
    if (stage === 'stage1') {
      line = "Good evening! You are in a great position. You have some free time, which makes this the perfect opportunity to make early progress on your assignment and finish comfortably.";
    } else if (stage === 'stage2') {
      line = "Nice work! You still have plenty of time, but you are halfway through. Complete Chapter 2 today in about forty-five minutes to stay comfortably on schedule.";
    } else if (stage === 'stage3') {
      line = "You are falling behind on this deadline. You have postponed this task twice. Starting before 6 PM keeps you on schedule and avoids a critical cram session.";
    } else if (stage === 'stage4') {
      line = "Action required. Your assignment is due in six hours. Based on your estimated workload, you must begin immediately. I have already cleared your schedule and enabled focus mode.";
    }
    speakVoice(line);
  };

  // Simulate Sequential Escalation Steps
  const triggerEscalationSimulation = () => {
    if (isEscalating) return;
    setIsEscalating(true);
    setSimulatedEscalationStep(1);

    const runStep = (step: number) => {
      setTimeout(() => {
        setSimulatedEscalationStep(step);
        if (step < 8) {
          runStep(step + 1);
        } else {
          setIsEscalating(false);
          setIsEmergencyActive(true);
        }
      }, 1500);
    };

    runStep(2);
  };

  const resetEscalation = () => {
    setSimulatedEscalationStep(0);
    setIsEscalating(false);
    setIsEmergencyActive(false);
    setCalendarOptimized(false);
    setIsFocusModeEnabled(false);
    setIsPomodoroEnabled(false);
  };

  const runSchedulerInterventions = () => {
    setCalendarOptimized(true);
  };

  const handleApplyEngineRecommendation = () => {
    setDeadlineHours(48);
    setEstimatedWorkHours(8);
    setTaskDifficulty('Medium');
    setPostponedTimes(1);
    setFocusScore(85);
    setEnergyLevel('Medium');
  };

  const escalationWorkflow = [
    { id: 1, title: 'Notification Ignored', desc: 'First warning sent but user failed to respond.' },
    { id: 2, title: 'Amplified Volume', desc: 'Reminder density increased. Highlighted in Command Center.' },
    { id: 3, title: 'Calendar Overhaul', desc: 'Low-priority tasks rescheduled. Empty block allocated.' },
    { id: 4, title: 'Focus Slot Locked', desc: 'Pre-emptive Focus Coach booking created.' },
    { id: 5, title: 'Push Alert Broadcasted', desc: 'High-urgency overlay notification pushed.' },
    { id: 6, title: 'Email Dispatch', desc: 'System summary report emailed to the user.' },
    { id: 7, title: 'AI Voice Call Triggered', desc: 'Verbal reminder played aloud.' },
    { id: 8, title: 'Emergency Mode Locked', desc: 'Full-screen override. Focused Pomodoro initialized.' },
  ];

  return (
    <div className="space-y-8 animate-fade-in p-1 sm:p-4" id="reminder-engine-root">
      {/* Header and Tagline */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-2 border-[#121e15]/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#121e15]/10 text-[#121e15] border border-[#121e15]/20">
              Agentic AI Engine
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-[#121e15]/60 font-bold">v2.4 Adaptive</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-[#121e15] flex items-center gap-2.5">
            <BrainCircuit className="h-8 w-8 text-[#121e15]" />
            Adaptive AI Reminder Engine
          </h1>
          <p className="text-sm text-[#121e15]/75 font-semibold mt-2 max-w-2xl">
            It doesn't just send static alerts—it understands progress, predicts risk, coordinates with calendar schedulers, and escalates intelligently to ensure you finish on time.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-center">
          <button
            onClick={resetEscalation}
            className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-[#121e15]/20 bg-white/45 text-[#121e15] hover:text-[#121e15] hover:bg-[#121e15]/5 hover:border-[#121e15] transition-all text-xs font-mono uppercase tracking-wider font-bold cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset State
          </button>
        </div>
      </div>

      {/* Grid Layout - Reminders Stage + Command Center Widget */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Stage Selector and Notifications View (8 Columns) */}
        <div className="xl:col-span-8 space-y-6">
          <div className="glass-card relative overflow-hidden">
            {/* Background Glow accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b-2 border-[#121e15]/10 pb-4 mb-6">
              <h2 className="text-lg font-serif font-black text-[#121e15] flex items-center gap-2">
                <BellRing className="h-5 w-5 text-[#121e15]" />
                Evolutionary Notification Simulator
              </h2>
              <span className="text-xs text-[#121e15]/50 font-mono font-bold">Click stages to preview alerts</span>
            </div>

            {/* Stages Slider/Tab bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
              {[
                { id: 'stage1', label: 'Stage 1: Planning', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' },
                { id: 'stage2', label: 'Stage 2: Progress', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' },
                { id: 'stage3', label: 'Stage 3: Warning', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' },
                { id: 'stage4', label: 'Stage 4: Action', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' },
              ].map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id as StageType)}
                  className={`px-3.5 py-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    activeStage === stage.id
                      ? stage.id === 'stage3'
                        ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-md font-bold'
                        : stage.id === 'stage4'
                        ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-md font-bold'
                        : 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-md font-bold'
                      : 'bg-white/45 border-[#121e15]/12 text-[#121e15]/60 hover:text-[#121e15] hover:border-[#121e15]/30'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono tracking-wider font-bold opacity-60 mb-1">
                    {stage.id === 'stage1' || stage.id === 'stage2' ? '🟢 Level Green' : stage.id === 'stage3' ? '🟡 Level Yellow' : '🔴 Level Red'}
                  </div>
                  <div className="text-xs truncate">{stage.label}</div>
                </button>
              ))}
            </div>

            {/* Notification Card Previews (Staged exactly like the prompt details) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {activeStage === 'stage1' && (
                  <div className="border-2 border-emerald-300/40 bg-emerald-50/25 rounded-2xl p-5 md:p-6 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">🟢</div>
                      <span>You're in a great position!</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-[#121e15]/50 text-xs uppercase tracking-wider font-mono font-bold">Assignment</div>
                        <div className="text-[#121e15] text-base font-bold mt-0.5">Database Assignment</div>
                        <div className="text-[#121e15]/70 text-xs font-semibold mt-1">Due in 7 days</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#fcfaf2]/60 p-2.5 rounded-2xl border-2 border-[#121e15]/12">
                          <span className="text-[#121e15]/50 font-bold block">Est. Work</span>
                          <span className="text-[#121e15] font-bold">5 hours</span>
                        </div>
                        <div className="bg-[#fcfaf2]/60 p-2.5 rounded-2xl border-2 border-[#121e15]/12">
                          <span className="text-[#121e15]/50 font-bold block">Probability</span>
                          <span className="text-emerald-800 font-bold">97%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/40 p-3 rounded-2xl border-2 border-[#121e15]/10 flex items-center justify-between text-xs text-[#121e15] font-semibold">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#121e15]/75" />
                        <span>Recommended Start: <strong>Today at 7:00 PM</strong></span>
                      </div>
                      <span className="text-[#121e15]/50 text-[10px] font-mono font-bold">Auto-Calculated</span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-[#121e15]/70 border-t-2 border-[#121e15]/10 pt-3 mt-1 font-semibold">
                      <span>Start now and you'll finish comfortably.</span>
                      <button 
                        onClick={() => speakStageVoice('stage1')}
                        className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border-2 border-emerald-300 text-emerald-850 rounded-full font-bold transition-all cursor-pointer"
                      >
                        <Play className="h-3 w-3" /> Play AI Voice
                      </button>
                    </div>
                  </div>
                )}

                {activeStage === 'stage2' && (
                  <div className="border-2 border-emerald-300/40 bg-emerald-50/25 rounded-2xl p-5 md:p-6 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-800 text-sm font-bold">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">🟢</div>
                      <span>Nice! You still have enough time.</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-[#fcfaf2]/60 p-3 rounded-2xl border-2 border-[#121e15]/12">
                        <span className="text-[#121e15]/50 font-bold block mb-0.5">Time Remaining</span>
                        <span className="text-[#121e15] text-sm font-bold">4 days</span>
                      </div>
                      <div className="bg-[#fcfaf2]/60 p-3 rounded-2xl border-2 border-[#121e15]/12">
                        <span className="text-[#121e15]/50 font-bold block mb-0.5">Current Progress</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-white/50 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '20%' }} />
                          </div>
                          <span className="text-[#121e15] font-mono font-bold">20%</span>
                        </div>
                      </div>
                      <div className="bg-[#fcfaf2]/60 p-3 rounded-2xl border-2 border-[#121e15]/12">
                        <span className="text-[#121e15]/50 font-bold block mb-0.5">Next Goal Milestone</span>
                        <span className="text-[#121e15]/80 font-bold truncate block">Complete Chapter 2</span>
                      </div>
                    </div>

                    <div className="bg-white/40 p-4 rounded-2xl border-2 border-[#121e15]/10 space-y-2">
                      <div className="text-[10px] text-[#121e15]/50 uppercase tracking-widest font-mono font-bold">Today's Recommendation</div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4.5 w-4.5 text-[#121e15]" />
                          <span className="text-xs text-[#121e15] font-bold">Draft & complete Chapter 2</span>
                        </div>
                        <span className="text-xs text-[#121e15]/70 font-mono font-bold">Est. 45 min</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-[#121e15]/70 border-t-2 border-[#121e15]/10 pt-3 font-semibold">
                      <span>You'll stay perfectly on schedule.</span>
                      <button 
                        onClick={() => speakStageVoice('stage2')}
                        className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border-2 border-emerald-300 text-emerald-850 rounded-full font-bold transition-all cursor-pointer"
                      >
                        <Play className="h-3 w-3" /> Play AI Voice
                      </button>
                    </div>
                  </div>
                )}

                {activeStage === 'stage3' && (
                  <div className="border-2 border-amber-300/40 bg-amber-50/25 rounded-2xl p-5 md:p-6 space-y-4">
                    <div className="flex items-center gap-2 text-amber-800 text-sm font-bold">
                      <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">🟡</div>
                      <span>You're falling behind.</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-[#121e15]/50 text-xs font-mono font-bold uppercase">Deadline</div>
                          <div className="text-[#121e15] text-base font-bold mt-0.5">Tomorrow (Within 24 Hours)</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[#121e15]/50 font-bold block">Current Progress</span>
                            <span className="text-[#121e15] font-mono font-bold">25% completed</span>
                          </div>
                          <div>
                            <span className="text-[#121e15]/50 font-bold block">Required Work</span>
                            <span className="text-amber-800 font-mono font-bold">4.0 hours remaining</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#fcfaf2]/60 p-3.5 rounded-2xl border-2 border-[#121e15]/12 space-y-2.5">
                        <div className="text-[10px] text-[#121e15]/50 font-mono uppercase tracking-widest font-bold">AI Recommended Actions</div>
                        <div className="text-xs text-[#121e15]/80 font-semibold">
                          Start working before <strong className="text-[#121e15]">6:00 PM today</strong>.
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] border-t-2 border-[#121e15]/10 pt-2 font-mono font-bold">
                          <div>
                            <span className="text-[#121e15]/50 block">Risk Level</span>
                            <span className="text-amber-700 font-bold uppercase">🟡 Medium</span>
                          </div>
                          <div>
                            <span className="text-[#121e15]/50 block">Success Prob.</span>
                            <span className="text-amber-700 font-bold">68%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stage 3 Intervention Box */}
                    <div className="bg-white/40 p-3.5 rounded-2xl border-2 border-[#121e15]/10 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-[#121e15]/80 font-semibold">
                          <CpuIcon className="h-4 w-4 text-[#121e15]" />
                          <span>Reschedule lower priority blocks & book slots?</span>
                        </div>
                        <button
                          onClick={runSchedulerInterventions}
                          className="px-3.5 py-1.5 text-[10px] font-bold bg-[#121e15] text-[#bbf246] border border-[#121e15] hover:bg-[#121e15]/90 rounded-full transition-colors cursor-pointer"
                        >
                          {calendarOptimized ? '✓ Interventions Scheduled' : 'Trigger Interventions'}
                        </button>
                      </div>
                      {calendarOptimized && (
                        <div className="text-[10px] text-[#121e15]/70 font-bold mt-1 pl-6 space-y-1">
                          <p className="flex items-center gap-1.5 text-emerald-800">
                            <span className="h-1 w-1 bg-emerald-500 rounded-full" />
                            rescheduled 'Review UI Layouts' (low priority) to Friday.
                          </p>
                          <p className="flex items-center gap-1.5 text-emerald-800">
                            <span className="h-1 w-1 bg-emerald-500 rounded-full" />
                            Freed 3.5 hours space on Google Calendar.
                          </p>
                          <p className="flex items-center gap-1.5 text-emerald-800">
                            <span className="h-1 w-1 bg-emerald-500 rounded-full" />
                            Suggested focused work block tonight at 7:00 PM.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs text-[#121e15]/70 border-t-2 border-[#121e15]/10 pt-3 font-semibold">
                      <span>Begin today to preserve your success rate.</span>
                      <button 
                        onClick={() => speakStageVoice('stage3')}
                        className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border-2 border-amber-300 text-amber-850 rounded-full font-bold transition-all cursor-pointer"
                      >
                        <Play className="h-3 w-3" /> Play AI Voice
                      </button>
                    </div>
                  </div>
                )}

                {activeStage === 'stage4' && (
                  <div className="border-2 border-rose-300/40 bg-rose-50/25 rounded-2xl p-5 md:p-6 space-y-4">
                    <div className="flex items-center gap-2 text-rose-800 text-sm font-bold">
                      <div className="h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center text-xs">🔴</div>
                      <span>Immediate Action Required</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="bg-[#fcfaf2]/60 p-3.5 rounded-2xl border-2 border-[#121e15]/12">
                          <div className="text-[10px] text-[#121e15]/50 font-mono font-bold uppercase">Target Task</div>
                          <div className="text-[#121e15] text-base font-bold">Database Assignment</div>
                          <div className="flex gap-4 mt-2">
                            <div>
                              <span className="text-[#121e15]/50 text-[10px] block font-bold">Deadline Remaining</span>
                              <span className="text-rose-800 text-xs font-mono font-bold flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 animate-pulse" /> 6 hours remaining
                              </span>
                            </div>
                            <div>
                              <span className="text-[#121e15]/50 text-[10px] block font-bold">Workload Estimate</span>
                              <span className="text-rose-800 text-xs font-mono font-bold">4.0 hours left</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-rose-800 font-bold leading-relaxed">
                          The gap between remaining time and required workload has hit the warning threshold. You need to begin NOW.
                        </p>
                      </div>

                      <div className="bg-[#fcfaf2]/60 p-4 rounded-2xl border-2 border-[#121e15]/12 space-y-2">
                        <div className="text-[10px] text-[#121e15]/50 font-mono uppercase tracking-widest font-bold">Autopilot Interventions Applied:</div>
                        <ul className="text-xs text-[#121e15]/80 space-y-1.5 pl-1 font-semibold">
                          <li className="flex items-center gap-2">
                            <span className="text-emerald-700 text-[10px] font-bold">✓</span>
                            <span>Cleared schedule (Auto-moved 2 non-essential tasks)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-emerald-700 text-[10px] font-bold">✓</span>
                            <span>Prepared Focus Mode & locked browser workspace</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-emerald-700 text-[10px] font-bold">✓</span>
                            <span>Enabled Pomodoro system preset (50m/10m)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-emerald-700 text-[10px] font-bold">✓</span>
                            <span>Muted non-critical Slack/system reminders</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-white/40 p-3.5 rounded-2xl border-2 border-[#121e15]/10 flex flex-wrap gap-2 items-center justify-between font-semibold">
                      <div className="text-xs text-[#121e15]/80">
                        Would you like to initiate the integrated active focus sequence?
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsFocusModeEnabled(true);
                            setIsPomodoroEnabled(true);
                          }}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer border-2 transition-colors ${
                            isFocusModeEnabled && isPomodoroEnabled
                              ? 'bg-[#121e15] border-[#121e15] text-[#bbf246]'
                              : 'bg-rose-600 border-rose-600 text-white hover:bg-rose-500'
                          }`}
                        >
                          {isFocusModeEnabled && isPomodoroEnabled ? '✓ Focus Presets Active' : 'Begin Focus Autopilot'}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-[#121e15]/70 border-t-2 border-[#121e15]/10 pt-3 font-semibold">
                      <span>You still have time to make a 100% full recovery.</span>
                      <button 
                        onClick={() => speakStageVoice('stage4')}
                        className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border-2 border-rose-300 text-rose-850 rounded-full font-bold transition-all cursor-pointer"
                      >
                        <Play className="h-3 w-3" /> Play AI Voice
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive Escalation Pipeline Simulator */}
          <div className="glass-card relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-[#121e15]/10 pb-4 mb-4 gap-4">
              <div>
                <h3 className="text-sm font-bold text-[#121e15] flex items-center gap-2">
                  <TrendingUp className="h-4.5 w-4.5 text-[#121e15]" />
                  Intelligent Escalation Simulator
                </h3>
                <p className="text-[11px] text-[#121e15]/60 mt-0.5 font-bold">Simulate what happens if you repeatedly ignore alerts.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={triggerEscalationSimulation}
                  disabled={isEscalating}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wide font-bold bg-[#121e15] hover:bg-[#121e15]/90 text-[#bbf246] rounded-full transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isEscalating ? 'Escalating...' : 'Simulate Ignored Alert'}
                </button>
                <button
                  onClick={resetEscalation}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wide font-bold border-2 border-[#121e15]/12 bg-white/45 text-[#121e15] hover:bg-white/70 rounded-full transition-all cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Stepper Display */}
            <div className="relative mt-6">
              {/* Stepper central connector line */}
              <div className="absolute top-[18px] left-[6.25%] right-[6.25%] h-0.5 bg-[#121e15]/12 -translate-y-1/2 hidden md:block" />
              
              <div className="grid grid-cols-2 md:grid-cols-8 gap-4 relative z-10">
                {escalationWorkflow.map((step) => {
                  const isCompleted = step.id <= simulatedEscalationStep;
                  const isCurrent = step.id === simulatedEscalationStep;
                  return (
                    <div key={step.id} className="flex flex-col items-center text-center">
                      <div 
                        className={`relative z-10 h-9 w-9 rounded-full flex items-center justify-center border-2 text-xs font-mono transition-all ${
                          isCurrent
                            ? 'bg-[#121e15] border-[#121e15] text-[#bbf246] ring-4 ring-[#121e15]/10 animate-pulse font-bold'
                            : isCompleted
                            ? 'bg-[#121e15]/80 border-[#121e15]/80 text-[#bbf246] font-semibold'
                            : 'bg-[#faf7eb] border-[#121e15]/12 text-[#121e15]/40'
                        }`}
                      >
                        {isCompleted && !isCurrent ? '✓' : step.id}
                      </div>
                      <span className={`text-[10px] mt-2 font-bold truncate w-full ${isCurrent ? 'text-[#121e15] font-black' : isCompleted ? 'text-[#121e15]/80' : 'text-[#121e15]/40'}`}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Detail Explanation Panel */}
            {simulatedEscalationStep > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-2xl border-2 border-[#121e15]/10 bg-white/45"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-rose-50 text-rose-800 mt-0.5">
                    <ShieldAlert className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[#121e15]/50 font-bold">Escalation Stage {simulatedEscalationStep} / 8</span>
                    <h4 className="text-sm font-bold text-[#121e15] mt-0.5">
                      {escalationWorkflow[simulatedEscalationStep - 1].title}
                    </h4>
                    <p className="text-xs text-[#121e15]/70 font-semibold mt-1">
                      {escalationWorkflow[simulatedEscalationStep - 1].desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* AI Decision Engine Control Parameters */}
          <div className="glass-card relative">
            <div className="flex items-center justify-between border-b-2 border-[#121e15]/10 pb-4 mb-6">
              <h3 className="text-sm font-serif font-black text-[#121e15] flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-[#121e15] animate-pulse" />
                AI Decision Engine Settings
              </h3>
              <button 
                onClick={handleApplyEngineRecommendation}
                className="text-[10px] text-[#121e15]/60 hover:text-[#121e15] font-bold font-mono uppercase tracking-wide transition-colors cursor-pointer"
              >
                Reset Parameters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] mb-1.5 font-mono">
                    <span className="text-[#121e15]/60 uppercase tracking-wider font-bold">Hours to Deadline</span>
                    <span className="text-[#121e15] font-black">{deadlineHours}h</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="240"
                    value={deadlineHours}
                    onChange={(e) => setDeadlineHours(parseInt(e.target.value))}
                    className="w-full accent-[#121e15] h-1.5 bg-[#121e15]/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#121e15]/40 mt-1 uppercase font-bold">
                    <span>Immediate (1h)</span>
                    <span>10 Days (240h)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1.5 font-mono font-bold">
                    <span className="text-[#121e15]/60 uppercase tracking-wider">Estimated Work Needed</span>
                    <span className="text-[#121e15] font-black">{estimatedWorkHours} hours</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={estimatedWorkHours}
                    onChange={(e) => setEstimatedWorkHours(parseInt(e.target.value))}
                    className="w-full accent-[#121e15] h-1.5 bg-[#121e15]/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#121e15]/40 mt-1 uppercase font-bold">
                    <span>Light (1h)</span>
                    <span>Heavy (40h)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1.5 font-mono font-bold">
                    <span className="text-[#121e15]/60 uppercase tracking-wider">Focus Score (History)</span>
                    <span className="text-[#121e15] font-black">{focusScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={focusScore}
                    onChange={(e) => setFocusScore(parseInt(e.target.value))}
                    className="w-full accent-[#121e15] h-1.5 bg-[#121e15]/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#121e15]/40 mt-1 uppercase font-bold">
                    <span>Low Focus (10%)</span>
                    <span>Perfect (100%)</span>
                  </div>
                </div>
              </div>

              {/* Toggles / Multi Selection */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-[#121e15]/60 font-mono font-bold uppercase tracking-wider block mb-2">Task Difficulty Factor</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['Low', 'Medium', 'High', 'Extreme'] as const).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setTaskDifficulty(diff)}
                        className={`py-2 px-1.5 text-[10px] rounded-full border-2 transition-all cursor-pointer text-center font-mono uppercase tracking-wider font-bold ${
                          taskDifficulty === diff
                            ? 'bg-[#bbf246]/20 border-[#121e15] text-[#121e15]'
                            : 'bg-white/45 border-[#121e15]/12 text-[#121e15]/70 hover:border-[#121e15]/30'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#121e15]/60 font-mono font-bold uppercase tracking-wider block mb-2">Ignored Reminders Count</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[0, 1, 2, 3, 4].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setPostponedTimes(count)}
                        className={`py-2 px-2 text-[10px] rounded-full border-2 transition-all cursor-pointer text-center font-mono font-bold ${
                          postponedTimes === count
                            ? 'bg-rose-50 border-rose-400 text-rose-800'
                            : 'bg-white/45 border-[#121e15]/12 text-[#121e15]/70 hover:border-[#121e15]/30'
                        }`}
                      >
                        {count === 4 ? '4+' : count}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-[#121e15]/60 font-mono font-bold uppercase tracking-wider block mb-2">Current Energy Level</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Low', 'Medium', 'High'] as const).map((energy) => (
                      <button
                        key={energy}
                        type="button"
                        onClick={() => setEnergyLevel(energy)}
                        className={`py-2 px-2 text-[10px] rounded-full border-2 transition-all cursor-pointer text-center font-mono uppercase tracking-wider font-bold ${
                          energyLevel === energy
                            ? 'bg-purple-50 border-purple-400 text-purple-800'
                            : 'bg-white/45 border-[#121e15]/12 text-[#121e15]/70 hover:border-[#121e15]/30'
                        }`}
                      >
                        {energy}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Live Outputs of the Decision Engine */}
            <div className="mt-6 border-t-2 border-[#121e15]/10 pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/45 p-3.5 rounded-2xl border-2 border-[#121e15]/10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white border-2 border-[#121e15]/10 text-[#121e15]">
                  <Gauge className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] text-[#121e15]/50 block uppercase font-mono font-bold">Simulated Success</span>
                  <span className={`text-sm font-bold ${
                    calculatedSuccessProb > 80 
                      ? 'text-emerald-850' 
                      : calculatedSuccessProb > 60 
                      ? 'text-amber-850' 
                      : 'text-rose-850'
                  }`}>
                    {calculatedSuccessProb}% probability
                  </span>
                </div>
              </div>

              <div className="bg-white/45 p-3.5 rounded-2xl border-2 border-[#121e15]/10 flex items-center gap-3">
                <div className={`p-2 rounded-xl border-2 ${
                  calculatedRisk === 'Critical'
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : calculatedRisk === 'High'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : calculatedRisk === 'Medium'
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}>
                  <AlertTriangle className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] text-[#121e15]/50 block uppercase font-mono font-bold">Dynamic Risk Assessment</span>
                  <span className={`text-sm font-bold uppercase ${
                    calculatedRisk === 'Critical'
                      ? 'text-rose-850'
                      : calculatedRisk === 'High'
                      ? 'text-rose-750'
                      : calculatedRisk === 'Medium'
                      ? 'text-amber-850'
                      : 'text-emerald-850'
                  }`}>
                    {calculatedRisk} Risk
                  </span>
                </div>
              </div>

              <div className="bg-white/45 p-3.5 rounded-2xl border-2 border-[#121e15]/10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white border-2 border-[#121e15]/10 text-[#121e15]">
                  <BrainCircuit className="h-5 w-5 animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] text-[#121e15]/50 block uppercase font-mono font-bold">Engine Recommendation</span>
                  <button
                    onClick={() => setActiveStage(recommendedStage)}
                    className="text-xs font-bold text-[#121e15] hover:underline cursor-pointer text-left block"
                  >
                    Load Stage {recommendedStage === 'stage1' ? '1 (Planning)' : recommendedStage === 'stage2' ? '2 (Progress)' : recommendedStage === 'stage3' ? '3 (Warning)' : '4 (Action)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Command Center, Emergency Mode & Voice Assistant (4 Columns) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* AI Command Center Widget (Matches Example exactly) */}
          <div className="glass-card relative">
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border-2 border-emerald-300 text-[10px] text-emerald-850 font-bold font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live
            </div>
            
            <h3 className="text-xs uppercase tracking-wider font-mono font-black text-[#121e15]/60 border-b-2 border-[#121e15]/10 pb-2.5 mb-4">
              AI Command Center
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between font-semibold">
                <span className="text-xs text-[#121e15]/80">Success Probability</span>
                <span className={`text-base font-mono font-bold ${
                  calculatedSuccessProb > 80 
                    ? 'text-emerald-750' 
                    : calculatedSuccessProb > 60 
                    ? 'text-amber-750' 
                    : 'text-rose-750'
                }`}>
                  {calculatedSuccessProb}%
                </span>
              </div>
              <div className="flex items-center justify-between border-t-2 border-[#121e15]/5 pt-3 font-semibold">
                <span className="text-xs text-[#121e15]/80">Deadline Risk</span>
                <span className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-full border-2 ${
                  calculatedRisk === 'Critical'
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : calculatedRisk === 'High'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : calculatedRisk === 'Medium'
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}>
                  {calculatedRisk === 'Critical' ? '🔴 Critical' : calculatedRisk === 'High' ? '🔴 High' : calculatedRisk === 'Medium' ? '🟡 Medium' : '🟢 Low'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t-2 border-[#121e15]/5 pt-3 font-semibold">
                <span className="text-xs text-[#121e15]/80">Focus Score</span>
                <span className="text-xs font-mono text-[#121e15] font-bold">{focusScore}%</span>
              </div>
              <div className="flex items-center justify-between border-t-2 border-[#121e15]/5 pt-3 font-semibold">
                <span className="text-xs text-[#121e15]/80">Today's Priority</span>
                <span className="text-xs font-bold text-[#121e15]">Database Assignment</span>
              </div>
              <div className="flex items-center justify-between border-t-2 border-[#121e15]/5 pt-3 font-semibold">
                <span className="text-xs text-[#121e15]/80">Next Session</span>
                <span className="text-xs font-mono text-[#121e15]/70">7:00 PM Tonight</span>
              </div>

              <div className="bg-[#fcfaf2]/60 p-3.5 rounded-2xl border-2 border-[#121e15]/10 mt-4">
                <div className="text-[10px] text-[#121e15]/50 uppercase font-mono font-bold">AI Recommendation</div>
                <div className="text-xs text-[#121e15] font-bold mt-1">Complete Section 2.4 Setup</div>
                <div className="flex justify-between items-center text-[10px] text-[#121e15]/60 mt-2 font-mono font-bold">
                  <span>Est Time: 45 min</span>
                  <span className="text-emerald-700 flex items-center gap-0.5">
                    <span className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                    High Priority
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Voice Assistant Synthesizer */}
          <div className="glass-card space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#121e15]/10 pb-2.5">
              <h3 className="text-xs uppercase tracking-wider font-mono font-black text-[#121e15]/60 flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-[#121e15]" />
                AI Voice Assistant
              </h3>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-[#121e15]/60 hover:text-[#121e15] transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Speech Synthesis' : 'Mute Speech Synthesis'}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>

            {/* Audio Wave Visualizer */}
            <div className="bg-white/45 p-4 rounded-2xl border-2 border-[#121e15]/12 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
              <div className="flex items-end gap-1.5 h-10">
                {waveHeights.map((h, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ height: isSpeaking ? h : 4 }}
                    className={`w-1 rounded-t transition-all duration-100 ${
                      isSpeaking ? 'bg-[#121e15]' : 'bg-[#121e15]/15'
                    }`}
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
              <div className="text-[10px] font-mono font-bold text-[#121e15]/50">
                {isSpeaking ? (
                  <span className="text-[#121e15] animate-pulse flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Synthesis Active...
                  </span>
                ) : (
                  <span>Voice engine standby</span>
                )}
              </div>
            </div>

            {/* Trigger Voice Blocks */}
            <div className="space-y-2">
              <button
                onClick={() => speakStageVoice('stage1')}
                className="w-full flex items-center justify-between p-2.5 rounded-full bg-white/45 hover:bg-white/75 border-2 border-[#121e15]/12 hover:border-[#121e15]/30 transition-all text-left text-xs text-[#121e15] font-bold cursor-pointer"
              >
                <span>🟢 Stage 1 Speak</span>
                <Play className="h-3 w-3 text-[#121e15]/50" />
              </button>
              <button
                onClick={() => speakStageVoice('stage2')}
                className="w-full flex items-center justify-between p-2.5 rounded-full bg-white/45 hover:bg-white/75 border-2 border-[#121e15]/12 hover:border-[#121e15]/30 transition-all text-left text-xs text-[#121e15] font-bold cursor-pointer"
              >
                <span>🟢 Stage 2 Speak</span>
                <Play className="h-3 w-3 text-[#121e15]/50" />
              </button>
              <button
                onClick={() => speakStageVoice('stage3')}
                className="w-full flex items-center justify-between p-2.5 rounded-full bg-white/45 hover:bg-white/75 border-2 border-[#121e15]/12 hover:border-[#121e15]/30 transition-all text-left text-xs text-[#121e15] font-bold cursor-pointer"
              >
                <span>🟡 Stage 3 Speak</span>
                <Play className="h-3 w-3 text-[#121e15]/50" />
              </button>
              <button
                onClick={() => speakStageVoice('stage4')}
                className="w-full flex items-center justify-between p-2.5 rounded-full bg-white/45 hover:bg-white/75 border-2 border-[#121e15]/12 hover:border-[#121e15]/30 transition-all text-left text-xs text-[#121e15] font-bold cursor-pointer"
              >
                <span>🔴 Stage 4 Speak</span>
                <Play className="h-3 w-3 text-[#121e15]/50" />
              </button>
            </div>

            {/* Voice Subtitles */}
            {speechText && (
              <div className="bg-[#fdfcf7] p-3.5 rounded-2xl border-2 border-[#121e15]/10 text-[11px] text-[#121e15]/80 italic leading-relaxed font-semibold">
                <span className="text-[#121e15]/50 font-mono text-[9px] uppercase font-bold block mb-1">AI Voice Subtitles</span>
                "{speechText}"
              </div>
            )}
          </div>

          {/* 🚨 Emergency Mode Block */}
          <div className="glass-card space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#121e15]/10 pb-2.5">
              <h3 className="text-xs uppercase tracking-wider font-mono font-black text-[#121e15]/60 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-rose-500 animate-pulse" />
                🚨 Emergency Mode
              </h3>
              <button
                onClick={() => setIsEmergencyActive(!isEmergencyActive)}
                className={`px-3 py-1 rounded-full text-[9px] uppercase font-bold font-mono transition-colors cursor-pointer ${
                  isEmergencyActive
                    ? 'bg-rose-600 text-white border-2 border-rose-600'
                    : 'bg-white/45 text-[#121e15]/50 border-2 border-[#121e15]/12 hover:text-[#121e15] hover:border-[#121e15]/30'
                }`}
              >
                {isEmergencyActive ? 'Active' : 'Standby'}
              </button>
            </div>

            {isEmergencyActive ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-center space-y-1">
                  <div className="text-rose-800 text-xs font-mono font-bold uppercase tracking-widest animate-pulse">
                    ⚠ Emergency Mode Activated
                  </div>
                  <div className="text-[#121e15] text-base font-black">Database Assignment</div>
                  <div className="text-xs text-[#121e15]/70 font-mono font-bold">6 Hours Remaining — Current Risk: 92%</div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-[#121e15]/50 uppercase tracking-wider font-mono font-bold">Recommended Step Plan:</div>
                  
                  <div className="space-y-1.5 text-xs font-semibold text-[#121e15]">
                    {[
                      { step: '1', time: '2 hours', label: 'Research', desc: 'Synthesize chapter material & write outline.' },
                      { step: '2', time: '2 hours', label: 'Implementation', desc: 'Code schemas, constraints & queries.' },
                      { step: '3', time: '1 hour', label: 'Testing', desc: 'Validate execution outcomes against criteria.' },
                      { step: '4', time: '30 min', label: 'Submission', desc: 'Upload artifacts to the course portal.' },
                      { step: '5', time: '30 min', label: 'Buffer', desc: 'Safety window for network delays.' },
                    ].map((item, index) => (
                      <div key={item.step} className="flex items-start gap-2.5 p-2 bg-white/40 rounded-xl border border-[#121e15]/10">
                        <div className="h-5 w-5 bg-white border border-[#121e15]/15 text-[#121e15] font-mono text-[10px] font-bold rounded flex items-center justify-center shrink-0">
                          {item.step}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="text-[#121e15] font-bold text-xs">{item.label}</span>
                            <span className="text-[#121e15]/70 text-[10px] font-mono font-bold">{item.time}</span>
                          </div>
                          <p className="text-[10px] text-[#121e15]/50 mt-0.5 truncate font-medium">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-[#121e15]/70 bg-white/40 p-2.5 rounded-xl border border-[#121e15]/10 italic leading-relaxed font-semibold">
                  "Autopilot has automatically cleared other tasks. Focus on this structured timeline to complete comfortably."
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-6 text-[#121e15]/50 space-y-2 font-semibold">
                <Hourglass className="h-8 w-8 text-[#121e15]/30 mx-auto animate-spin" style={{ animationDuration: '6s' }} />
                <p className="text-xs">Emergency Plan is standby.</p>
                <p className="text-[10px] text-[#121e15]/40 max-w-xs mx-auto">
                  It will activate automatically when a heavy estimated workload overlaps closely with a remaining deadline.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Timeline Graphic (Matches Prompt details) */}
      <div className="glass-card relative">
        <div className="flex items-center justify-between border-b-2 border-[#121e15]/10 pb-4 mb-6">
          <div>
            <h3 className="text-sm font-serif font-black text-[#121e15] flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-[#121e15]" />
              Example Timeline Roadmap: Hackathon Project
            </h3>
            <p className="text-xs text-[#121e15]/60 mt-0.5 font-semibold">Estimated workload: 20 hours of coding over 10 days.</p>
          </div>
          <span className="text-xs text-[#121e15]/50 font-mono font-bold">10 Days remaining</span>
        </div>

        {/* Visual Line Roadmap */}
        <div className="relative mt-8 mb-6 px-4">
          {/* Stepper central connector line */}
          <div className="absolute top-[20px] left-[10%] right-[10%] h-0.5 bg-[#121e15]/12 -translate-y-1/2" />
          
          <div className="grid grid-cols-5 relative z-10 text-center">
            {[
              { day: 'Day 10', label: '🟢 Stage 1', sub: 'Planning Reminder', desc: 'Schedule initial drafts & early setup.' },
              { day: 'Day 7', label: '🟢 Stage 2', sub: 'Progress Reminder', desc: 'Assess 20% progress milestones.' },
              { day: 'Day 3', label: '🟡 Stage 3', sub: 'Warning Reminder', desc: 'Escalate schedule, move low priority blocks.' },
              { day: 'Day 1', label: '🔴 Stage 4', sub: 'Action Reminder', desc: 'Auto-pilot focus blocks, start Pomodoro.' },
              { day: 'Deadline', label: '🏁 Goal Target', sub: 'Submission Window', desc: 'Successful complete and hand over.' },
            ].map((node, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className={`relative z-10 h-10 w-10 rounded-full border-2 flex items-center justify-center font-mono text-[10px] font-bold shadow-lg transition-all ${
                  idx === 4
                    ? 'bg-white border-blue-500 text-blue-700 shadow-blue-500/10'
                    : idx === 3
                    ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-rose-500/10'
                    : idx === 2
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-amber-500/10'
                    : 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-emerald-500/10'
                }`}>
                  {node.day === 'Deadline' ? '🏁' : `D-${10 - (idx === 0 ? 0 : idx === 1 ? 3 : idx === 2 ? 7 : 9)}`}
                </div>
                
                <span className="text-xs text-[#121e15] font-bold mt-3 font-display">
                  {node.day}
                </span>
                
                <span className={`text-[10px] font-mono mt-0.5 font-bold ${
                  idx === 3 ? 'text-rose-700' : idx === 2 ? 'text-amber-700' : idx === 4 ? 'text-blue-700' : 'text-emerald-700'
                }`}>
                  {node.label}
                </span>
                
                <p className="text-[10px] text-[#121e15]/50 mt-2 max-w-[120px] hidden md:block leading-relaxed font-semibold">
                  {node.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline mini SVG component for CpuIcon to prevent dependency errors
function CpuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M9 1v3" />
      <path d="M15 1v3" />
      <path d="M9 20v3" />
      <path d="M15 20v3" />
      <path d="M20 9h3" />
      <path d="M20 15h3" />
      <path d="M1 9h3" />
      <path d="M1 15h3" />
    </svg>
  );
}
