import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  Share2, 
  Loader2, 
  CheckCircle2, 
  Plus, 
  Trash2,
  Lock
} from 'lucide-react';
import { CalendarBlock, Task } from '../types';

interface CalendarViewProps {
  calendarBlocks: CalendarBlock[];
  tasks: Task[];
  onToggleBlockComplete: (id: string) => void;
  onAddCustomBlock: (block: CalendarBlock) => void;
  onDeleteBlock: (id: string) => void;
}

export default function CalendarView({
  calendarBlocks,
  tasks,
  onToggleBlockComplete,
  onAddCustomBlock,
  onDeleteBlock
}: CalendarViewProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for manual additions
  const [title, setTitle] = useState('');
  const [taskId, setTaskId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('20:00');
  const [energy, setEnergy] = useState<'high' | 'medium' | 'low'>('medium');

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    // Simulate real OAuth & sync handshake latency
    await new Promise(resolve => setTimeout(resolve, 1800));
    setIsExporting(false);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const startISO = `${date}T${startTime}:00`;
    const endISO = `${date}T${endTime}:00`;

    onAddCustomBlock({
      id: `custom-${Date.now()}`,
      taskId: taskId || 'manual',
      title,
      startTime: startISO,
      endTime: endISO,
      energySpent: energy,
      completed: false
    });

    // Reset Form
    setTitle('');
    setTaskId('');
    setShowAddModal(false);
  };

  // Group blocks by day
  const getGroupedBlocks = () => {
    const groups: { [key: string]: CalendarBlock[] } = {};
    calendarBlocks.forEach(block => {
      const day = block.startTime.split('T')[0];
      if (!groups[day]) {
        groups[day] = [];
      }
      groups[day].push(block);
    });
    // Sort keys chronologically
    return Object.keys(groups).sort().reduce((acc, key) => {
      acc[key] = groups[key].sort((a, b) => a.startTime.localeCompare(b.startTime));
      return acc;
    }, {} as { [key: string]: CalendarBlock[] });
  };

  const grouped = getGroupedBlocks();

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in" id="calendar-view-root">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-[#121e15] flex items-center gap-2.5">
            <CalendarIcon className="h-8 w-8 text-[#121e15]" /> Focus Block Timeline
          </h1>
          <p className="text-[#121e15]/70 text-sm font-semibold mt-1">
            Hour-by-hour cognitive blocks automatically organized to bypass fatigue peaks.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-[#fdfcf7] border-2 border-[#121e15] rounded-full text-xs font-mono uppercase tracking-wider font-bold text-[#121e15] shadow-[3px_3px_0px_0px_#121e15] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0px_0px_#121e15] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Focus Block
          </button>
          
          <button 
            onClick={handleExport}
            disabled={isExporting || calendarBlocks.length === 0}
            className="px-5 py-2.5 bg-[#bbf246] border-2 border-[#121e15] rounded-full text-xs font-mono uppercase tracking-wider font-bold text-[#121e15] shadow-[3px_3px_0px_0px_#121e15] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0px_0px_#121e15] disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-300 disabled:shadow-none disabled:translate-y-0 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Syncing Google Cal...</span>
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                <span>Calendar Synced!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Sync Google Calendar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Blocks Stream */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Calendar Column */}
        <div className="xl:col-span-8 space-y-6">
          {Object.keys(grouped).length > 0 ? (
            Object.keys(grouped).map(day => (
              <div key={day} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#121e15]/60 font-mono flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#121e15]/60" /> {formatDateLabel(day)}
                </h3>

                <div className="space-y-3">
                  {grouped[day].map(block => {
                    const startLocal = new Date(block.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const endLocal = new Date(block.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div 
                        key={block.id} 
                        className={`flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all backdrop-blur-md ${
                          block.completed 
                            ? 'border-[#121e15]/10 bg-white/25 opacity-50 text-[#121e15]/60' 
                            : 'border-[#121e15]/12 bg-white/45 text-[#121e15] shadow-lg shadow-[#121e15]/5 hover:translate-y-[-1px] hover:shadow-xl hover:border-[#121e15]/25'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => onToggleBlockComplete(block.id)}
                            className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer ${
                              block.completed 
                                ? 'bg-[#121e15] border-[#121e15] text-[#bbf246]' 
                                : 'border-[#121e15]/30 hover:border-[#121e15]'
                            }`}
                          >
                            {block.completed && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
                          </button>

                          <div>
                            <h4 className={`text-sm font-black ${block.completed ? 'line-through text-[#121e15]/50' : 'text-[#121e15]'}`}>
                              {block.title}
                            </h4>
                            <p className="text-xs text-[#121e15]/70 font-mono font-bold mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {startLocal} - {endLocal}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] uppercase font-mono font-bold px-2.5 py-1 rounded-full border-2 ${
                            block.completed 
                              ? 'border-[#121e15]/10 text-[#121e15]/50 bg-[#121e15]/5'
                              : block.energySpent === 'high' 
                              ? 'border-rose-300 text-rose-800 bg-rose-50/50' 
                              : block.energySpent === 'medium'
                              ? 'border-amber-300 text-amber-800 bg-amber-50/50'
                              : 'border-emerald-300 text-emerald-800 bg-emerald-50/50'
                          }`}>
                            {block.completed ? 'completed' : `${block.energySpent} load`}
                          </span>
                          
                          <button 
                            onClick={() => onDeleteBlock(block.id)}
                            className="p-1 text-[#121e15]/40 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 glass-card border-dashed border-2 border-[#121e15]/15 text-[#121e15]/60">
              <CalendarIcon className="h-12 w-12 mx-auto text-[#121e15]/40 mb-3" />
              <p className="font-serif font-black text-lg text-[#121e15]">Empty Timeline</p>
              <p className="text-xs text-[#121e15]/70 mt-2 max-w-sm mx-auto font-semibold leading-relaxed">
                No calendar blocks have been calculated yet. Input your constraints in the Command Center to sync structured focus slots.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Info Column */}
        <div className="xl:col-span-4 space-y-6">
          <div className="glass-card space-y-4">
            <h3 className="text-sm font-serif font-black text-[#121e15] uppercase tracking-wider">Energy-Based Scheduling Rules</h3>
            
            <div className="space-y-4 text-xs text-[#121e15]/80 leading-relaxed font-semibold">
              <p>
                FlowPilot operates on a <strong>cognitive workload load-balancer</strong>. To guarantee you finish before deadlines without burning out, tasks are mapped as follows:
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <div>
                    <span className="text-[#121e15] font-black">High Energy</span>
                    <p className="mt-0.5 text-[#121e15]/70">Heavy architectural decisions, core coding, complex problem sets. Scheduled in morning or early evening windows.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <div>
                    <span className="text-[#121e15] font-black">Medium Energy</span>
                    <p className="mt-0.5 text-[#121e15]/70">Refactoring, researching tutorials, active revisions. Scheduled in intermediate blocks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <div>
                    <span className="text-[#121e15] font-black">Low Energy</span>
                    <p className="mt-0.5 text-[#121e15]/70">Writing documentation, preparing demo slides, code cleanups. Scheduled during cognitive slump valleys.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Manual Add Block Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-[2.2rem] border-2 border-[#121e15] bg-[#fcfaf2] p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif font-black text-[#121e15]">Create Custom Focus Block</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[#121e15]/75 font-bold font-mono uppercase tracking-wider">Block Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g. Debug Firestore schemas" 
                  className="w-full rounded-full border-2 border-[#121e15] bg-[#fdfcf7] p-3 text-[#121e15] placeholder-[#121e15]/40 focus:outline-none font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#121e15]/75 font-bold font-mono uppercase tracking-wider">Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                    className="w-full rounded-full border-2 border-[#121e15] bg-[#fdfcf7] p-3 text-[#121e15] focus:outline-none font-semibold"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#121e15]/75 font-bold font-mono uppercase tracking-wider">Energy Requirement</label>
                  <select 
                    value={energy} 
                    onChange={e => setEnergy(e.target.value as any)} 
                    className="w-full rounded-full border-2 border-[#121e15] bg-[#fdfcf7] p-3 text-[#121e15] focus:outline-none font-semibold"
                  >
                    <option value="high">High Energy</option>
                    <option value="medium">Medium Energy</option>
                    <option value="low">Low Energy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[#121e15]/75 font-bold font-mono uppercase tracking-wider">Start Time</label>
                  <input 
                    type="time" 
                    value={startTime} 
                    onChange={e => setStartTime(e.target.value)} 
                    className="w-full rounded-full border-2 border-[#121e15] bg-[#fdfcf7] p-3 text-[#121e15] focus:outline-none font-semibold"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#121e15]/75 font-bold font-mono uppercase tracking-wider">End Time</label>
                  <input 
                    type="time" 
                    value={endTime} 
                    onChange={e => setEndTime(e.target.value)} 
                    className="w-full rounded-full border-2 border-[#121e15] bg-[#fdfcf7] p-3 text-[#121e15] focus:outline-none font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#121e15]/75 font-bold font-mono uppercase tracking-wider">Associate Task (Optional)</label>
                <select 
                  value={taskId} 
                  onChange={e => setTaskId(e.target.value)} 
                  className="w-full rounded-full border-2 border-[#121e15] bg-[#fdfcf7] p-3 text-[#121e15] focus:outline-none font-semibold font-sans"
                >
                  <option value="">No Associated Task</option>
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 bg-[#fdfcf7] border-2 border-[#121e15] rounded-full text-xs font-mono uppercase tracking-wider font-bold text-[#121e15] hover:bg-[#121e15]/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-[#bbf246] border-2 border-[#121e15] rounded-full text-xs font-mono uppercase tracking-wider font-bold text-[#121e15] hover:bg-[#bbf246]/95 cursor-pointer"
                >
                  Add Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
