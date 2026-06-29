import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  Task, 
  Milestone, 
  CalendarBlock, 
  RiskMetrics, 
  Resource, 
  AIMemory, 
  Motivation,
  PlanningResponse
} from './types';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import DailyBriefingView from './components/DailyBriefingView';
import PlanningChatView from './components/PlanningChatView';
import CalendarView from './components/CalendarView';
import TasksView from './components/TasksView';
import FocusCoachView from './components/FocusCoachView';
import AnalyticsView from './components/AnalyticsView';
import EmergencyModeView from './components/EmergencyModeView';
import ReminderEngineView from './components/ReminderEngineView';

// Pre-seeded high fidelity mock data for instant demo engagement
const DEFAULT_MILESTONES: Milestone[] = [
  { id: 'm1', title: 'Alpha Prototype Functionality', targetDate: new Date(Date.now() + 172800000).toISOString().split('T')[0] },
  { id: 'm2', title: 'Polished Launch & Pitch', targetDate: new Date(Date.now() + 432000000).toISOString().split('T')[0] }
];

const DEFAULT_TASKS: Task[] = [
  { id: 't1', title: 'Architect project schema & Firestore models', category: 'Coding', durationMinutes: 60, energyLevel: 'high', milestoneId: 'm1', order: 1, completed: true },
  { id: 't2', title: 'Verify Gemini API endpoints & Express routes', category: 'Coding', durationMinutes: 45, energyLevel: 'high', milestoneId: 'm1', order: 2, completed: true },
  { id: 't3', title: 'Design high-fidelity dashboard layouts with Tailwind', category: 'Coding', durationMinutes: 75, energyLevel: 'high', milestoneId: 'm1', order: 3, completed: false },
  { id: 't4', title: 'Run comprehensive typescript compile verification', category: 'Review', durationMinutes: 30, energyLevel: 'medium', milestoneId: 'm2', order: 4, completed: false },
  { id: 't5', title: 'Assemble pitch deck & record product video demo', category: 'Documentation', durationMinutes: 45, energyLevel: 'low', milestoneId: 'm2', order: 5, completed: false }
];

const DEFAULT_CALENDAR: CalendarBlock[] = [
  { id: 'b1', taskId: 't1', title: 'Focus Session: Architect project schema', startTime: new Date(Date.now() - 86400000).toISOString().split('T')[0] + 'T19:00:00', endTime: new Date(Date.now() - 86400000).toISOString().split('T')[0] + 'T20:00:00', energySpent: 'high', completed: true },
  { id: 'b2', taskId: 't2', title: 'Focus Session: Verify Gemini endpoints', startTime: new Date().toISOString().split('T')[0] + 'T18:00:00', endTime: new Date().toISOString().split('T')[0] + 'T18:45:00', energySpent: 'high', completed: true },
  { id: 'b3', taskId: 't3', title: 'Focus Session: Design high-fidelity dashboard', startTime: new Date().toISOString().split('T')[0] + 'T19:30:00', endTime: new Date().toISOString().split('T')[0] + 'T20:45:00', energySpent: 'high', completed: false },
  { id: 'b4', taskId: 't4', title: 'Focus Session: Run compile verification', startTime: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T19:00:00', endTime: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T19:30:00', energySpent: 'medium', completed: false },
  { id: 'b5', taskId: 't5', title: 'Focus Session: Assemble pitch deck', startTime: new Date(Date.now() + 172800000).toISOString().split('T')[0] + 'T14:00:00', endTime: new Date(Date.now() + 172800000).toISOString().split('T')[0] + 'T14:45:00', energySpent: 'low', completed: false }
];

const DEFAULT_RISK: RiskMetrics = {
  score: 45,
  delayProbability: 50,
  burnoutRisk: 35,
  confidence: 80,
  assessment: "Moderately tight schedule. Your high energy coding tasks are centered today, which maintains consistency. Risk spikes only if documentation shifts.",
  mitigationSteps: [
    "Execute coding sprints during late evening slots.",
    "Lock down non-essential browser tabs using Focus Coach presets."
  ]
};

const DEFAULT_RESOURCES: Resource[] = [
  { title: "Grounded AI Systems Design principles", url: "https://ai.google.dev", description: "Official resource containing guidelines for Gemini model usage.", type: "documentation" },
  { title: "Advanced Grid Layouts with Tailwind CSS", url: "https://tailwindcss.com/docs", description: "Official responsive utility documentation.", type: "tutorial" }
];

const DEFAULT_MEMORY: AIMemory = {
  insights: [
    "Prefers late-evening high focus windows (7:00 PM - 9:00 PM).",
    "Prone to post-lunch documentation delays."
  ],
  habitsNoticed: [
    "Consistent completion rate on core technical milestones.",
    "Bypasses administrative tasks if cognitive exhaustion is high."
  ],
  recommendations: [
    "Align all intense coding blocks between 7 PM and 9 PM.",
    "De-scope auxiliary documentation slots when absolute deadlines fall below 24 hours."
  ]
};

const DEFAULT_MOTIVATION: Motivation = {
  coachMessage: "We have optimized your day. Focus solely on dashboard layouts today.",
  urgencySlogan: "Small habits compound. Launch your focus cycle now."
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // Storage initialization
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('deadline_milestones');
    return saved ? JSON.parse(saved) : DEFAULT_MILESTONES;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('deadline_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [calendarBlocks, setCalendarBlocks] = useState<CalendarBlock[]>(() => {
    const saved = localStorage.getItem('deadline_calendar');
    return saved ? JSON.parse(saved) : DEFAULT_CALENDAR;
  });

  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>(() => {
    const saved = localStorage.getItem('deadline_risk');
    return saved ? JSON.parse(saved) : DEFAULT_RISK;
  });

  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem('deadline_resources');
    return saved ? JSON.parse(saved) : DEFAULT_RESOURCES;
  });

  const [memory, setMemory] = useState<AIMemory>(() => {
    const saved = localStorage.getItem('deadline_memory');
    return saved ? JSON.parse(saved) : DEFAULT_MEMORY;
  });

  const [motivation, setMotivation] = useState<Motivation>(() => {
    const saved = localStorage.getItem('deadline_motivation');
    return saved ? JSON.parse(saved) : DEFAULT_MOTIVATION;
  });

  const [completedPomodoros, setCompletedPomodoros] = useState<number>(() => {
    const saved = localStorage.getItem('deadline_pomodoros');
    return saved ? Number(saved) : 2;
  });

  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(() => {
    const saved = localStorage.getItem('deadline_emergency_active');
    return saved ? JSON.parse(saved) : false;
  });

  const [currentPlan, setCurrentPlan] = useState<PlanningResponse | null>(() => {
    const saved = localStorage.getItem('deadline_current_plan');
    if (saved) return JSON.parse(saved);
    return {
      planner: { title: "Google AI Hackathon Core Track", milestones: DEFAULT_MILESTONES, subtasks: DEFAULT_TASKS },
      scheduler: { calendarBlocks: DEFAULT_CALENDAR },
      risk: DEFAULT_RISK,
      research: { resources: DEFAULT_RESOURCES },
      memory: DEFAULT_MEMORY,
      motivation: DEFAULT_MOTIVATION,
      isMock: true
    };
  });

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('deadline_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('deadline_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('deadline_calendar', JSON.stringify(calendarBlocks));
  }, [calendarBlocks]);

  useEffect(() => {
    localStorage.setItem('deadline_risk', JSON.stringify(riskMetrics));
  }, [riskMetrics]);

  useEffect(() => {
    localStorage.setItem('deadline_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('deadline_memory', JSON.stringify(memory));
  }, [memory]);

  useEffect(() => {
    localStorage.setItem('deadline_motivation', JSON.stringify(motivation));
  }, [motivation]);

  useEffect(() => {
    localStorage.setItem('deadline_pomodoros', String(completedPomodoros));
  }, [completedPomodoros]);

  useEffect(() => {
    localStorage.setItem('deadline_emergency_active', JSON.stringify(isEmergencyActive));
  }, [isEmergencyActive]);

  useEffect(() => {
    if (currentPlan) {
      localStorage.setItem('deadline_current_plan', JSON.stringify(currentPlan));
    }
  }, [currentPlan]);

  // Handlers
  const handlePlanSynthesized = (plan: PlanningResponse) => {
    setMilestones(plan.planner.milestones);
    setTasks(plan.planner.subtasks);
    setCalendarBlocks(plan.scheduler.calendarBlocks);
    setRiskMetrics(plan.risk);
    setResources(plan.research.resources);
    setMemory(plan.memory);
    setMotivation(plan.motivation);
    setCurrentPlan(plan);
    setIsEmergencyActive(false); // Reset emergency
    setActiveTab('dashboard'); // Redirect to dashboard
  };

  const handleToggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        // Automatically toggle corresponding calendar block
        setCalendarBlocks(blocks => blocks.map(b => {
          if (b.taskId === id) return { ...b, completed: nextState };
          return b;
        }));
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const handleToggleBlockComplete = (id: string) => {
    setCalendarBlocks(prev => prev.map(b => {
      if (b.id === id) {
        const nextState = !b.completed;
        // Sync back to corresponding task
        if (b.taskId !== 'manual') {
          setTasks(ts => ts.map(t => {
            if (t.id === b.taskId) return { ...t, completed: nextState };
            return t;
          }));
        }
        return { ...b, completed: nextState };
      }
      return b;
    }));
  };

  const handleAddTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setCalendarBlocks(prev => prev.filter(b => b.taskId !== id));
  };

  const handleAddCustomBlock = (block: CalendarBlock) => {
    setCalendarBlocks(prev => [...prev, block]);
  };

  const handleDeleteBlock = (id: string) => {
    setCalendarBlocks(prev => prev.filter(b => b.id !== id));
  };

  const handleCompleteSession = (minutes: number, category: string) => {
    setCompletedPomodoros(prev => prev + 1);
  };

  const handleToggleEmergency = () => {
    setIsEmergencyActive(prev => !prev);
  };

  const handlePruneTasks = () => {
    // Drop uncompleted documentation/review/non-essential tasks as requested by planner crash requirements
    setTasks(prev => prev.filter(t => t.completed || t.category === 'Coding' || t.energyLevel === 'high'));
    setCalendarBlocks(prev => prev.filter(b => b.completed || b.energySpent === 'high'));
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            tasks={tasks}
            calendarBlocks={calendarBlocks}
            riskMetrics={riskMetrics}
            memory={memory}
            onNavigate={setActiveTab}
            isEmergencyActive={isEmergencyActive}
          />
        );
      case 'daily-briefing':
        return (
          <DailyBriefingView 
            tasks={tasks}
            calendarBlocks={calendarBlocks}
            riskMetrics={riskMetrics}
            motivation={motivation}
            onNavigate={setActiveTab}
            isEmergencyActive={isEmergencyActive}
          />
        );
      case 'chat-planning':
        return (
          <PlanningChatView 
            onPlanSynthesized={handlePlanSynthesized}
            currentPlan={currentPlan}
          />
        );
      case 'calendar':
        return (
          <CalendarView 
            calendarBlocks={calendarBlocks}
            tasks={tasks}
            onToggleBlockComplete={handleToggleBlockComplete}
            onAddCustomBlock={handleAddCustomBlock}
            onDeleteBlock={handleDeleteBlock}
          />
        );
      case 'tasks':
        return (
          <TasksView 
            tasks={tasks}
            milestones={milestones}
            onToggleTaskComplete={handleToggleTaskComplete}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'focus':
        return (
          <FocusCoachView 
            onCompleteSession={handleCompleteSession}
            completedPomodoros={completedPomodoros}
            motivation={motivation}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView 
            memory={memory}
            completedCount={tasks.filter(t => t.completed).length}
          />
        );
      case 'emergency':
        return (
          <EmergencyModeView 
            tasks={tasks}
            isEmergencyActive={isEmergencyActive}
            onToggleEmergency={handleToggleEmergency}
            onPruneTasks={handlePruneTasks}
          />
        );
      case 'reminders':
        return (
          <ReminderEngineView />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f5eedc] font-sans text-[#121e15] antialiased selection:bg-[#bbf246] selection:text-[#121e15] relative overflow-x-hidden" id="deadlineai-viewport">
      
      {/* Decorative Natural Elements (Sky, Clouds, and Birds matching the reference) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Soft elegant clouds */}
        <div className="absolute top-12 right-24 w-64 h-16 bg-white/70 blur-md rounded-full opacity-80" />
        <div className="absolute top-48 left-1/3 w-80 h-20 bg-white/60 blur-md rounded-full opacity-70" />
        <div className="absolute top-8 left-16 w-48 h-12 bg-white/80 blur-md rounded-full opacity-80" />
        
        {/* Floating Bird vector from reference image */}
        <div className="absolute top-36 right-1/4 opacity-40">
          <svg className="w-16 h-12 text-[#121e15]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M2 12C6 8 10 12 12 12C14 12 18 8 22 12" />
          </svg>
        </div>
      </div>

      {/* Sleek collapse sidebar navigation - elevated on top of background */}
      <div className="relative z-20">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isEmergencyActive={isEmergencyActive}
        />
      </div>

      {/* Primary viewport content frame */}
      <main className="flex-1 p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full space-y-8 overflow-x-hidden relative z-10 pb-48">
        {renderActiveView()}
      </main>

      {/* Gorgeous Responsive Vector Rolling Green Hills at the bottom of the screen */}
      <div className="fixed bottom-0 left-0 right-0 h-40 pointer-events-none overflow-hidden z-0 select-none hidden md:block">
        {/* Back Hill Layer */}
        <svg className="absolute bottom-0 w-full h-[140px] text-[#82b34a] opacity-40 translate-y-3" viewBox="0 0 1440 200" preserveAspectRatio="none" fill="currentColor">
          <path d="M0,110 C360,50 720,170 1080,90 C1260,50 1380,70 1440,80 L1440,200 L0,200 Z" />
        </svg>
        {/* Middle Hill Layer */}
        <svg className="absolute bottom-0 w-full h-[110px] text-[#70a33c] opacity-60 translate-y-2" viewBox="0 0 1440 200" preserveAspectRatio="none" fill="currentColor">
          <path d="M0,130 C240,170 480,70 720,110 C960,150 1200,80 1440,100 L1440,200 L0,200 Z" />
        </svg>
        {/* Front Vibrant Meadow Hill Layer - thick outline style to match reference! */}
        <svg className="absolute bottom-0 w-full h-[80px] text-[#5b8c2d]" viewBox="0 0 1440 200" preserveAspectRatio="none" fill="currentColor">
          <path d="M0,150 C300,100 600,160 900,120 C1200,80 1320,140 1440,130 L1440,200 L0,200 Z" />
        </svg>
      </div>

    </div>
  );
}
