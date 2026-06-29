import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Compass, 
  Zap, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  CalendarDays,
  BellRing
} from 'lucide-react';
import { Task, CalendarBlock, RiskMetrics, AIMemory } from '../types';

interface DashboardViewProps {
  tasks: Task[];
  calendarBlocks: CalendarBlock[];
  riskMetrics: RiskMetrics;
  memory: AIMemory;
  onNavigate: (tab: any) => void;
  isEmergencyActive: boolean;
}

export default function DashboardView({ 
  tasks, 
  calendarBlocks, 
  riskMetrics, 
  memory, 
  onNavigate,
  isEmergencyActive
}: DashboardViewProps) {
  
  // Calculate metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed);
  const completedCount = completedTasks.length;
  
  const productivityScore = totalTasks > 0 
    ? Math.round((completedCount / totalTasks) * 100) 
    : 0;

  // Base success on task completion vs risk score
  const baseSuccess = 100 - riskMetrics.score;
  const successProbability = totalTasks > 0
    ? Math.min(98, Math.max(12, Math.round(baseSuccess + (productivityScore * 0.2))))
    : 75;

  const totalMinutesSaved = completedTasks.reduce((acc, t) => acc + Math.round(t.durationMinutes * 0.3), 0);

  // Dynamic status messages
  const getRiskStatus = (score: number) => {
    if (isEmergencyActive) return { label: 'CRITICAL', color: 'text-red-500 bg-red-950/40 border-red-500/30' };
    if (score >= 70) return { label: 'HIGH RISK', color: 'text-rose-500 bg-rose-950/20 border-rose-500/30' };
    if (score >= 40) return { label: 'MEDIUM', color: 'text-amber-500 bg-amber-950/20 border-amber-500/30' };
    return { label: 'OPTIMAL', color: 'text-emerald-500 bg-emerald-950/20 border-emerald-500/30' };
  };

  const riskStatus = getRiskStatus(riskMetrics.score);

  // Filter today's priority tasks
  const todayPriorities = tasks.filter(t => !t.completed).slice(0, 3);

  // Generate dynamic proactive suggestions
  const getAISuggestions = () => {
    const suggestions: string[] = [];
    if (isEmergencyActive) {
      suggestions.push("Emergency Mode Active: Focus exclusively on priority 'Coding' blocks. All review tasks are deferred.");
      suggestions.push("Hydration alert: Your focus schedule requires intense mental energy for the next 2 hours.");
    } else {
      if (riskMetrics.score > 50) {
        suggestions.push("Risk of missed milestone detected. Consider starting a Focus Coach session on 'Coding' subtasks.");
      }
      if (tasks.some(t => t.energyLevel === 'high' && !t.completed)) {
        suggestions.push("Your energy levels are highest in the next hour. Tackle your 'high energy' coding milestones now.");
      }
      if (completedCount === 0) {
        suggestions.push("Welcome! Boot the Planning System with your goals to trigger the AI agent coordination.");
      } else {
        suggestions.push("Scheduler has successfully synchronized your calendar blocks with Google Calendar mock interfaces.");
      }
    }
    return suggestions;
  };

  const aiSuggestions = getAISuggestions();

  return (
    <div className="space-y-8 animate-fade-in relative z-10" id="dashboard-view-root">
      
      {/* Premium Elegant Banner with CauseHouse Natural Sky Styling */}
      <div className="relative overflow-hidden glass-card p-6 md:p-8">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-400/[0.04] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 h-48 w-48 rounded-full bg-emerald-400/[0.04] blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div>
            <div className="cause-pill-lime mb-4">
              <Sparkles className="h-3.5 w-3.5 text-[#121e15] fill-white animate-spin-slow" />
              <span>AI Chief of Staff Active</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black text-[#121e15] tracking-tight leading-none mb-3">
              Ready to conquer <span className="cause-text-outline-lime font-black">today's goals?</span>
            </h1>
            <p className="text-[#121e15]/85 mt-3 text-sm md:text-base max-w-xl leading-relaxed font-sans font-medium">
              {isEmergencyActive 
                ? "Emergency System Active. Core tasks prioritised. Focus solely on execution."
                : "Your AI Chief of Staff has analyzed your priorities, optimized your schedule, and prepared your personalized execution plan."
              }
            </p>
          </div>
          <button 
            onClick={() => onNavigate('chat-planning')}
            className="cause-btn-lime self-start md:self-center"
          >
            <span>Command Center</span>
            <ChevronRight className="h-4 w-4 stroke-[3px]" />
          </button>
        </div>
      </div>

      {/* Metrics Grid including the signature yellow Project Activity block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5" id="dashboard-metrics-grid">
        {/* Metric 1: Productivity Score */}
        <div className="glass-card-hover bg-[#eafcf0]/35 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-[#121e15] mb-4">
            <span className="text-[10px] font-bold tracking-wider uppercase font-mono text-[#121e15]/70">Productivity</span>
            <div className="p-1.5 rounded-full bg-[#bbf246] border-2 border-[#121e15] text-[#121e15]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-serif font-black text-[#121e15] tracking-tight">{productivityScore}%</span>
            <p className="text-[10px] text-[#121e15]/70 font-bold mt-1.5 font-sans">Today's Productivity</p>
          </div>
        </div>

        {/* Metric 2: Success Probability */}
        <div className="glass-card-hover bg-[#eaf4fd]/35 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-[#121e15] mb-4">
            <span className="text-[10px] font-bold tracking-wider uppercase font-mono text-[#121e15]/70">Success Prob.</span>
            <div className="p-1.5 rounded-full bg-[#eaf4fd] border-2 border-[#121e15] text-[#121e15]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-serif font-black text-[#121e15] tracking-tight">{successProbability}%</span>
            <p className="text-[10px] text-[#121e15]/70 font-bold mt-1.5 font-sans">Completion Confidence</p>
          </div>
        </div>

        {/* Metric 3: Deadline Risk */}
        <div className="glass-card-hover bg-[#fdf2f2]/35 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-[#121e15] mb-4">
            <span className="text-[10px] font-bold tracking-wider uppercase font-mono text-[#121e15]/70">Deadline Risk</span>
            <div className="p-1.5 rounded-full bg-[#fdf2f2] border-2 border-[#121e15] text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="mb-1">
              <span className={`text-[9px] px-2.5 py-1 rounded-full font-mono font-bold border-2 ${
                isEmergencyActive 
                  ? 'text-white bg-rose-600 border-[#121e15]' 
                  : riskMetrics.score >= 70 
                  ? 'text-rose-700 bg-rose-100 border-rose-300' 
                  : riskMetrics.score >= 40 
                  ? 'text-amber-700 bg-amber-100 border-amber-300' 
                  : 'text-emerald-700 bg-emerald-100 border-emerald-300'
              }`}>
                {riskStatus.label}
              </span>
            </div>
            <p className="text-[10px] text-[#121e15]/70 font-bold mt-2 font-sans">Based on timeline</p>
          </div>
        </div>

        {/* Metric 4: Burnout Risk */}
        <div className="glass-card-hover bg-[#fff7ed]/35 flex flex-col justify-between group">
          <div className="flex items-center justify-between text-[#121e15] mb-4">
            <span className="text-[10px] font-bold tracking-wider uppercase font-mono text-[#121e15]/70">Burnout Level</span>
            <div className="p-1.5 rounded-full bg-[#fff7ed] border-2 border-[#121e15] text-orange-600">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-serif font-black text-[#121e15] tracking-tight">{isEmergencyActive ? 85 : riskMetrics.burnoutRisk}%</span>
            <p className="text-[10px] text-[#121e15]/70 font-bold mt-1.5 font-sans">Cognitive Strain</p>
          </div>
        </div>

        {/* Metric 5 & 6 Unified: Yellow "Project Activity" Card inspired directly by reference image */}
        <div className="glass-card-hover bg-[#fccc31]/35 col-span-1 sm:col-span-2 relative overflow-hidden flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-[10px] font-bold tracking-wider uppercase font-mono text-[#121e15]/80">Project Activity</span>
            <span className="px-2.5 py-0.5 rounded-full bg-white border-2 border-[#121e15] text-[#121e15] font-bold text-[9px] shadow-sm font-mono uppercase tracking-wide">Statistic</span>
          </div>
          <div className="grid grid-cols-3 gap-2 relative z-10 py-1">
            <div>
              <span className="text-xl md:text-2xl font-serif font-black block text-[#121e15] leading-none">26h</span>
              <span className="text-[9px] text-[#121e15]/80 font-bold font-mono uppercase tracking-wider block mt-1">Sync Calls</span>
            </div>
            <div>
              <span className="text-xl md:text-2xl font-serif font-black block text-[#121e15] leading-none">11h</span>
              <span className="text-[9px] text-[#121e15]/80 font-bold font-mono uppercase tracking-wider block mt-1">Workshops</span>
            </div>
            <div>
              <span className="text-xl md:text-2xl font-serif font-black block text-[#121e15] leading-none">6h</span>
              <span className="text-[9px] text-[#121e15]/80 font-bold font-mono uppercase tracking-wider block mt-1">Reviews</span>
            </div>
          </div>
          {/* Floating Organic Leaf Representation */}
          <div className="absolute right-[-4px] bottom-[-4px] text-emerald-800/15 pointer-events-none transform rotate-12 scale-125">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5,16 5,16C5,16 9,13 14,13C16,13 18,14 18,14C18,14 20,10 20,7C20,4 17,2 17,2C17,2 15,5 15,8C15,11 17,8 17,8Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Adaptive AI Reminder Engine Banner with Natural Accent */}
      <div className="glass-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-[#eaf4fd] border-2 border-[#121e15] text-[#121e15] shrink-0 shadow-[2px_2px_0px_0px_#121e15]">
            <BellRing className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-[#121e15]/75">🧠 Adaptive AI Reminder Engine</span>
              <span className="h-1.5 w-1.5 bg-[#121e15]/30 rounded-full" />
              <span className="cause-pill-lime text-[9px] px-2 py-0.5 shadow-none">Coaching Stage</span>
            </div>
            <h3 className="text-[#121e15] font-serif font-black text-lg mt-2 leading-tight">
              "It doesn't just remind you—it predicts your risk and adapts its coaching guidance."
            </h3>
            <p className="text-xs text-[#121e15]/70 mt-1.5 max-w-2xl leading-relaxed font-semibold">
              Unlike static reminders, FlowPilot evolves from planning to warning based on remaining time, cognitive strain, and calendar load.
            </p>
          </div>
        </div>
        <button 
          onClick={() => onNavigate('reminders')}
          className="cause-btn-white self-start md:self-center"
        >
          <span>Open Reminder Engine</span>
          <ChevronRight className="h-4 w-4 stroke-[3px]" />
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active AI Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card">
            <div className="flex items-center gap-2 border-b-2 border-[#121e15]/10 pb-4 mb-4">
              <Sparkles className="h-5 w-5 text-[#121e15] fill-[#bbf246]" />
              <h2 className="text-lg font-serif font-black text-[#121e15]">Active Chief of Staff Insights</h2>
            </div>
            
            <div className="space-y-4">
              {aiSuggestions.map((suggestion, idx) => (
                <div key={idx} className="flex gap-3 p-4 rounded-2xl bg-[#f5eedc]/40 border-2 border-[#121e15]/20 text-sm text-[#121e15] font-semibold leading-relaxed">
                  <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5 fill-amber-500" />
                  <span>{suggestion}</span>
                </div>
              ))}
              
              {/* Procrastination habits if any */}
              {memory.recommendations && memory.recommendations.length > 0 && (
                <div className="mt-6 border-t-2 border-[#121e15]/10 pt-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#121e15]/60 mb-3 font-mono">AI Memory Adaptation</h3>
                  <div className="space-y-2">
                    {memory.recommendations.slice(0, 2).map((rec, idx) => (
                      <p key={idx} className="text-xs text-[#121e15]/80 flex items-start gap-1.5 leading-relaxed font-semibold">
                        <span className="text-[#121e15] font-bold mt-1">•</span>
                        <span>{rec}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="glass-card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-[#121e15] font-serif font-black text-base flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-[#121e15]" /> Need real-time momentum?
              </h3>
              <p className="text-xs text-[#121e15]/70 mt-1 max-w-sm leading-relaxed font-semibold">
                Activate the Focus Coach to run a structured Pomodoro sprint backed by ambient audio layers.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('focus')}
              className="cause-btn-white"
            >
              Start Focus Session
            </button>
          </div>
        </div>

        {/* Priority Queue & Upcoming blocks */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card">
            <div className="flex items-center justify-between border-b-2 border-[#121e15]/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#121e15]" />
                <h2 className="text-lg font-serif font-black text-[#121e15]">Focus Queue</h2>
              </div>
              <button 
                onClick={() => onNavigate('tasks')}
                className="text-xs font-bold text-[#121e15] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {todayPriorities.length > 0 ? (
                todayPriorities.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-4 rounded-2xl border-2 border-[#121e15]/10 bg-[#f5eedc]/20 hover:border-[#121e15] hover:bg-[#f5eedc]/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full border border-[#121e15]/30 ${
                        task.energyLevel === 'high' ? 'bg-rose-500' : task.energyLevel === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      <div>
                        <p className="text-xs font-black text-[#121e15]">{task.title}</p>
                        <span className="text-[9px] text-[#121e15]/60 font-mono uppercase tracking-wider block mt-0.5">{task.category} • {task.durationMinutes} min</span>
                      </div>
                    </div>
                    <span className="text-[9px] px-2.5 py-0.5 rounded-full font-bold border-2 border-[#121e15] bg-white text-[#121e15] font-mono uppercase">
                      {task.energyLevel}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#121e15]/50 text-sm font-semibold">
                  <CalendarDays className="h-8 w-8 mx-auto text-[#121e15]/30 mb-2" />
                  Your priority queue is clear. Use the AI command planner to generate focus pipelines.
                </div>
              )}
            </div>
          </div>
          
          {/* Emergency triggers card */}
          <div className="glass-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#121e15]/60 mb-3 flex items-center gap-1.5 font-mono">
              <ShieldAlert className="h-4 w-4 text-rose-500 animate-pulse" /> Alert Panel
            </h3>
            <p className="text-xs text-[#121e15]/75 leading-relaxed mb-4 font-semibold">
              Is your absolute deadline looming within 24 hours? Activate Emergency mode to focus strictly on coding & execution milestones.
            </p>
            <button
              onClick={() => onNavigate('emergency')}
              className={`w-full py-3 text-center rounded-full text-xs font-bold transition-all border-2 border-[#121e15] cursor-pointer font-mono uppercase tracking-wide ${
                isEmergencyActive 
                  ? 'bg-rose-600 text-white shadow-[3px_3px_0px_0px_#121e15] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#121e15]'
                  : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
              }`}
            >
              {isEmergencyActive ? "Open Emergency Control" : "Trigger Emergency Crash Mode"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
