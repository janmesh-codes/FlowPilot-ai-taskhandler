export interface Task {
  id: string;
  title: string;
  category: 'Coding' | 'Research' | 'Documentation' | 'Review';
  durationMinutes: number;
  energyLevel: 'high' | 'medium' | 'low';
  milestoneId: string;
  order: number;
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: string;
}

export interface CalendarBlock {
  id: string;
  taskId: string;
  title: string;
  startTime: string; // ISO format
  endTime: string; // ISO format
  energySpent: 'high' | 'medium' | 'low';
  completed?: boolean;
}

export interface RiskMetrics {
  score: number; // 0-100 (Overall Risk)
  delayProbability: number; // 0-100
  burnoutRisk: number; // 0-100
  confidence: number; // 0-100
  assessment: string;
  mitigationSteps: string[];
}

export interface Resource {
  title: string;
  url: string;
  description: string;
  type: 'documentation' | 'video' | 'article' | 'tutorial';
}

export interface AIMemory {
  insights: string[];
  habitsNoticed: string[];
  recommendations: string[];
}

export interface Motivation {
  coachMessage: string;
  urgencySlogan: string;
}

export interface FocusSession {
  id: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  category: string;
}

export interface PlanningResponse {
  planner: {
    title: string;
    milestones: Milestone[];
    subtasks: Task[];
  };
  scheduler: {
    calendarBlocks: CalendarBlock[];
  };
  risk: RiskMetrics;
  research: {
    resources: Resource[];
  };
  memory: AIMemory;
  motivation: Motivation;
  isMock: boolean;
  error?: string;
}

export type ActiveTab = 
  | 'dashboard'
  | 'daily-briefing'
  | 'chat-planning'
  | 'calendar'
  | 'tasks'
  | 'focus'
  | 'analytics'
  | 'emergency'
  | 'reminders';
