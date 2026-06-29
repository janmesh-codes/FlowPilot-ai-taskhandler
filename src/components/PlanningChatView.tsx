import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Check, 
  Loader2, 
  AlertCircle, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Brain,
  Cpu,
  ArrowRight,
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';
import { PlanningResponse, Task, CalendarBlock, RiskMetrics, AIMemory, Resource, Motivation } from '../types';

interface PlanningChatViewProps {
  onPlanSynthesized: (plan: PlanningResponse) => void;
  currentPlan: PlanningResponse | null;
}

interface AgentStep {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'processing' | 'completed';
}

export default function PlanningChatView({ onPlanSynthesized, currentPlan }: PlanningChatViewProps) {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Pipeline simulation state
  const [pipelineSteps, setPipelineSteps] = useState<AgentStep[]>([
    { id: 'master', name: 'Master Agent', description: 'Deconstructing constraints & goals...', status: 'idle' },
    { id: 'planner', name: 'Planner Agent', description: 'Splitting milestones into modular tasks...', status: 'idle' },
    { id: 'research', name: 'Research Agent', description: 'Scanning Google Search Grounding for developer references...', status: 'idle' },
    { id: 'scheduler', name: 'Scheduler Agent', description: 'Evaluating calendar gaps & cognitive load slots...', status: 'idle' },
    { id: 'risk', name: 'Risk Agent', description: 'Calculating probability coefficients & burnout factors...', status: 'idle' },
    { id: 'memory', name: 'Memory Agent', description: 'Recalling late-evening habits & past writing speed...', status: 'idle' },
    { id: 'coach', name: 'Focus Coach', description: 'Injecting custom Pomodoro cycles & ambient alerts...', status: 'idle' }
  ]);

  const [activeStepIndex, setActiveStepIndex] = useState(-1);

  // Quick prompt presets
  const presets = [
    { label: "AI Hackathon", text: "I have an AI hackathon in 5 days, an exam next week, and only two hours free every evening." },
    { label: "University Finals", text: "I need to study for 3 final university exams next week. High cognitive study sessions needed, feeling burnt out." },
    { label: "Side Project Launch", text: "I want to launch my SaaS side project in 2 weeks. Need clean modular milestones, planning, and documentation slots." }
  ];

  const handlePresetClick = (text: string) => {
    setUserInput(text);
  };

  const executePipeline = async (textToSubmit: string) => {
    setIsLoading(true);
    setErrorMessage('');
    setActiveStepIndex(0);

    // Reset steps
    setPipelineSteps(prev => prev.map(step => ({ ...step, status: 'idle' })));

    // Sequential simulation durations
    const stepDurations = [1200, 1000, 1400, 1100, 900, 800, 700];
    
    // Trigger the actual API request in parallel
    let responsePromise = fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput: textToSubmit })
    });

    for (let i = 0; i < stepDurations.length; i++) {
      setActiveStepIndex(i);
      setPipelineSteps(prev => prev.map((step, idx) => {
        if (idx === i) return { ...step, status: 'processing' };
        if (idx < i) return { ...step, status: 'completed' };
        return step;
      }));
      await new Promise(resolve => setTimeout(resolve, stepDurations[i]));
    }

    setPipelineSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));

    try {
      const res = await responsePromise;
      if (!res.ok) {
        throw new Error('Server returned an error response.');
      }
      const data: PlanningResponse = await res.json();
      
      // Update global state
      onPlanSynthesized(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("The AI Chief of Staff encountered a Handshake Error. Please try again.");
    } finally {
      setIsLoading(false);
      setActiveStepIndex(-1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    executePipeline(userInput);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="planning-chat-view-root">
      
      {/* Title block */}
      <div>
        <h1 className="text-3xl font-serif font-black text-[#121e15] flex items-center gap-2.5">
          <Cpu className="h-8 w-8 text-[#121e15]" /> AI Agent Command Center
        </h1>
        <p className="text-[#121e15]/70 text-sm font-semibold mt-1">
          Input your deadlines, schedules, and goals. The Chief of Staff will coordinate multi-agent logic to structure your sprint.
        </p>
      </div>

      {/* Main chat entry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Chat input pane */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#121e15]/70 flex items-center gap-1.5 font-mono">
              <Sparkles className="h-4 w-4 text-[#121e15]" /> Formulate Constraints
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g. I have a Google Hackathon in 5 days, a full database exam next Wednesday, and only have free hours from 7:00 PM to 9:30 PM..."
                  disabled={isLoading}
                  rows={4}
                  className="w-full rounded-[1.5rem] border-2 border-[#121e15] bg-[#fdfcf7] p-4 text-sm text-[#121e15] placeholder-[#121e15]/40 focus:outline-none font-semibold disabled:opacity-50"
                />
              </div>

              {/* Preset buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#121e15]/60 uppercase tracking-wide font-mono">Quick-Start Scenarios</span>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handlePresetClick(preset.text)}
                      disabled={isLoading}
                      className="px-3.5 py-1.5 rounded-full border-2 border-[#121e15]/20 hover:border-[#121e15] bg-white/45 text-xs text-[#121e15] font-semibold transition-all cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-[1.5rem] bg-rose-50 border-2 border-rose-300 text-rose-800 text-xs flex items-center gap-2 font-semibold">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!userInput.trim() || isLoading}
                className="w-full py-3.5 bg-[#bbf246] border-2 border-[#121e15] rounded-full text-xs font-mono uppercase tracking-wider font-bold text-[#121e15] shadow-[3px_3px_0px_0px_#121e15] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0px_0px_#121e15] disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Coordinating Agents...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Synthesize Chief-of-Staff Plan</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Prompt Guide info */}
          <div className="glass-card flex gap-3 text-xs text-[#121e15]/70">
            <Info className="h-4 w-4 text-[#121e15]/60 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#121e15]">How Grounded Multi-Agent Systems Work</p>
              <p className="mt-1 leading-relaxed font-semibold">
                Your request is analyzed server-side. The <strong>Planner</strong> splits the work; the <strong>Research Agent</strong> fetches actual tutorials using Google Search Grounding; the <strong>Scheduler</strong> distributes workload based on energy requirements; and the <strong>Memory Agent</strong> keeps long-term productivity records secure.
              </p>
            </div>
          </div>
        </div>

        {/* Real-time Agent Execution Pipeline Simulation */}
        <div className="lg:col-span-6 glass-card">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#121e15]/70 mb-6 flex items-center gap-2 font-mono">
            <Cpu className="h-4 w-4 text-[#121e15] animate-pulse" /> Agent Execution Timeline
          </h2>

          <div className="relative border-l-2 border-[#121e15]/15 pl-6 space-y-6 py-1">
            {pipelineSteps.map((step, idx) => (
              <div key={step.id} className="relative">
                {/* Node indicator */}
                <div className={`absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  step.status === 'completed' 
                    ? 'bg-[#121e15] border-[#121e15]' 
                    : step.status === 'processing'
                    ? 'bg-white border-[#121e15]'
                    : 'bg-[#f5eedc] border-[#121e15]/30'
                }`}>
                  {step.status === 'completed' && <Check className="h-2 w-2 text-[#bbf246] stroke-[3]" />}
                  {step.status === 'processing' && <span className="h-1.5 w-1.5 rounded-full bg-[#121e15] animate-ping" />}
                </div>

                <div className={`transition-all ${
                  step.status === 'completed' 
                    ? 'opacity-100 font-semibold' 
                    : step.status === 'processing'
                    ? 'opacity-100 translate-x-1 font-bold'
                    : 'opacity-45'
                }`}>
                  <h4 className="text-sm text-[#121e15] flex items-center gap-2">
                    {step.name}
                    {step.status === 'processing' && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#bbf246] text-[#121e15] rounded-full border border-[#121e15] animate-pulse">
                        Active
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-[#121e15]/60 mt-0.5 font-semibold">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Generated Plan Review Section */}
      {currentPlan && (
        <div className="glass-card space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#121e15]/10 pb-4 gap-4">
            <div>
              <span className="text-xs font-mono text-[#121e15]/60 font-bold uppercase tracking-wide">Synthesized Output Pipeline</span>
              <h2 className="text-xl font-serif font-black text-[#121e15] mt-1">{currentPlan.planner.title}</h2>
            </div>
            
            {currentPlan.isMock && (
              <div className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-center gap-1.5 font-mono">
                <Info className="h-3 w-3" />
                <span>Running in Sandbox Fallback Mode</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Planner Tasks Breakdown */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#121e15]/70 flex items-center gap-1.5 font-mono">
                <Calendar className="h-4 w-4 text-[#121e15]" /> Structured Subtasks
              </h3>
              
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {currentPlan.planner.subtasks.map((task, idx) => (
                  <div key={idx} className="p-3.5 rounded-[1.8rem] border-2 border-[#121e15]/10 bg-[#fcfaf2]/55 hover:bg-[#fcfaf2]/85 text-[#121e15] flex items-center justify-between text-xs font-semibold">
                    <div>
                      <p className="font-bold text-[#121e15]">{task.title}</p>
                      <span className="text-[10px] text-[#121e15]/60 font-mono uppercase mt-0.5 inline-block">
                        {task.category} • {task.durationMinutes} min
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full border bg-white/40 border-[#121e15]/15 text-[#121e15]/70 font-mono text-[9px] uppercase font-bold">
                      {task.energyLevel} Energy
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Collector Resources */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#121e15]/70 flex items-center gap-1.5 font-mono">
                <BookOpen className="h-4 w-4 text-[#121e15]" /> Grounded Research Resources
              </h3>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {currentPlan.research.resources.length > 0 ? (
                  currentPlan.research.resources.map((res, idx) => (
                    <a 
                      key={idx} 
                      href={res.url} 
                      target="_blank" 
                      rel="noopener noreferrer referrer" 
                      className="block p-3.5 rounded-[1.8rem] border-2 border-[#121e15]/10 bg-[#fcfaf2]/40 hover:bg-[#fcfaf2]/80 hover:border-[#121e15]/30 transition-all text-xs space-y-1 group font-semibold text-[#121e15]"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold group-hover:text-emerald-800 transition-colors flex items-center gap-1">
                          {res.title} <ExternalLink className="h-3 w-3 inline opacity-50 shrink-0" />
                        </span>
                        <span className="text-[9px] uppercase tracking-wide bg-emerald-50 border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                          {res.type}
                        </span>
                      </div>
                      <p className="text-[#121e15]/70 text-[11px] leading-relaxed mt-1 font-medium">
                        {res.description}
                      </p>
                    </a>
                  ))
                ) : (
                  <div className="text-center py-10 text-[#121e15]/50 font-semibold italic">
                    No references crawled for this sprint.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Long-term habits / risk factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t-2 border-[#121e15]/10 pt-6">
            
            {/* Risk profile */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#121e15]/70 flex items-center gap-1.5 font-mono">
                <TrendingUp className="h-4 w-4 text-rose-600" /> Critical Risk Profile
              </h3>
              <div className="p-4 rounded-[1.8rem] border-2 border-[#121e15]/10 bg-white/45 text-xs space-y-3 font-semibold text-[#121e15]">
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-[9px]">
                  <div className="p-2 rounded-2xl bg-[#fdfcf7] border-2 border-[#121e15]/10">
                    <span className="text-[#121e15]/50 uppercase font-bold">Burnout</span>
                    <p className="text-lg font-bold text-[#121e15] mt-1">{currentPlan.risk.burnoutRisk}%</p>
                  </div>
                  <div className="p-2 rounded-2xl bg-[#fdfcf7] border-2 border-[#121e15]/10">
                    <span className="text-[#121e15]/50 uppercase font-bold">Delay Prob.</span>
                    <p className="text-lg font-bold text-[#121e15] mt-1">{currentPlan.risk.delayProbability}%</p>
                  </div>
                  <div className="p-2 rounded-2xl bg-[#fdfcf7] border-2 border-[#121e15]/10">
                    <span className="text-[#121e15]/50 uppercase font-bold">Confidence</span>
                    <p className="text-lg font-bold text-[#121e15] mt-1">{currentPlan.risk.confidence}%</p>
                  </div>
                </div>
                <p className="text-[#121e15]/75 leading-relaxed italic border-l-2 border-[#121e15] pl-3 font-medium">
                  "{currentPlan.risk.assessment}"
                </p>
              </div>
            </div>

            {/* AI memory adaptive learnings */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#121e15]/70 flex items-center gap-1.5 font-mono">
                <Brain className="h-4 w-4 text-[#121e15]" /> AI Long-Term Memory Learnings
              </h3>
              <div className="p-4 rounded-[1.8rem] border-2 border-[#121e15]/10 bg-white/45 text-xs space-y-2 font-semibold text-[#121e15]">
                {currentPlan.memory.insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[#121e15]/80">
                    <Zap className="h-3.5 w-3.5 text-[#121e15] shrink-0 mt-0.5 fill-[#bbf246]" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick links to review calendar */}
          <div className="flex justify-end pt-2">
            <button 
              onClick={() => {}} 
              className="text-xs text-[#121e15] hover:text-[#121e15]/80 font-bold flex items-center gap-1 cursor-pointer font-mono uppercase"
            >
              <span>Verify Generated Calendar Slots</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
