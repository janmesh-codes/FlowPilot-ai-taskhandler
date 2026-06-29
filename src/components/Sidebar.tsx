import React, { useState } from 'react';
import { 
  Compass, 
  BrainCircuit, 
  Cpu, 
  Trophy, 
  Calendar, 
  Flame, 
  TrendingUp, 
  ShieldAlert,
  Menu,
  X,
  Sparkles,
  BellRing
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isEmergencyActive: boolean;
}

export default function Sidebar({ activeTab, onTabChange, isEmergencyActive }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: Compass },
    { id: 'daily-briefing', label: 'Daily Briefing', icon: BrainCircuit },
    { id: 'chat-planning', label: 'AI Planner', icon: Cpu },
    { id: 'tasks', label: 'Tasks & Milestones', icon: Trophy },
    { id: 'calendar', label: 'Focus Timeline', icon: Calendar },
    { id: 'focus', label: 'Focus Coach', icon: Flame },
    { id: 'analytics', label: 'Cognitive Analytics', icon: TrendingUp },
    { id: 'reminders', label: 'AI Reminder Engine', icon: BellRing },
    { id: 'emergency', label: 'Emergency Alert', icon: ShieldAlert, alert: isEmergencyActive }
  ];

  const handleTabSelect = (tab: ActiveTab) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  return (
    <div id="sidebar-navigation">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#fcfaf2] border-b-2 border-[#121e15] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#121e15] fill-[#bbf246] animate-pulse" />
          <span className="text-[#121e15] font-serif font-black tracking-tight text-base">FlowPilot</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 text-[#121e15] hover:text-black transition-colors cursor-pointer"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-[#121e15]/20 backdrop-blur-xs z-30"
        />
      )}

      {/* Sidebar Shell */}
      <div className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#fcfaf2] border-r-2 border-[#121e15] p-6 flex flex-col justify-between z-40 transition-transform duration-300 lg:transform-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="h-10 w-10 bg-[#bbf246] border-2 border-[#121e15] rounded-xl flex items-center justify-center text-[#121e15] font-serif font-extrabold text-xl shadow-[3px_3px_0px_0px_#121e15]">
              F
            </div>
            <div>
              <span className="text-[#121e15] font-serif font-black tracking-tight text-base block">FlowPilot</span>
              <p className="text-[9px] text-[#121e15]/75 uppercase tracking-wider font-bold font-mono">AI Chief of Staff</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id as ActiveTab)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border-2 ${
                    isActive 
                      ? 'bg-[#bbf246] border-[#121e15] text-[#121e15] shadow-[3px_3px_0px_0px_#121e15] font-bold' 
                      : 'border-transparent text-[#121e15]/75 hover:text-[#121e15] hover:bg-[#f5eedc]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4.5 w-4.5 ${
                      isActive 
                        ? 'text-[#121e15]' 
                        : item.alert 
                        ? 'text-rose-600 animate-pulse' 
                        : 'text-[#121e15]/60 group-hover:text-[#121e15]'
                    }`} />
                    <span className={isActive ? 'font-black' : ''}>{item.label}</span>
                  </div>

                  {item.alert && (
                    <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping shrink-0" />
                  )}
                  {isActive && !item.alert && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#121e15] shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Identity / Status indicator */}
        <div className="border-t-2 border-[#121e15] pt-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#bbf246] border-2 border-[#121e15] flex items-center justify-center text-[#121e15] font-serif font-black text-sm shadow-[2px_2px_0px_0px_#121e15]">
            JM
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-[#121e15]">Janmesh</p>
            <p className="text-[10px] text-[#121e15]/60 font-mono">sjanmesh1351</p>
          </div>
        </div>

      </div>
    </div>
  );
}
