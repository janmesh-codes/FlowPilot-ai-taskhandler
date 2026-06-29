import React, { useState } from 'react';
import { 
  Check, 
  Plus, 
  Trash2, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Briefcase, 
  Trophy 
} from 'lucide-react';
import { Task, Milestone } from '../types';

interface TasksViewProps {
  tasks: Task[];
  milestones: Milestone[];
  onToggleTaskComplete: (id: string) => void;
  onAddTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export default function TasksView({
  tasks,
  milestones,
  onToggleTaskComplete,
  onAddTask,
  onDeleteTask
}: TasksViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Coding' | 'Research' | 'Documentation' | 'Review'>('Coding');
  const [newEnergy, setNewEnergy] = useState<'high' | 'medium' | 'low'>('medium');
  const [newDuration, setNewDuration] = useState(45);
  const [newMilestoneId, setNewMilestoneId] = useState('');

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newMilestoneId) return;

    onAddTask({
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      category: newCategory,
      durationMinutes: Number(newDuration),
      energyLevel: newEnergy,
      milestoneId: newMilestoneId,
      order: tasks.length + 1,
      completed: false
    });

    setNewTaskTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="tasks-view-root">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-[#121e15] flex items-center gap-2.5">
            <Trophy className="h-8 w-8 text-[#121e15]" /> Milestone & Task Board
          </h1>
          <p className="text-[#121e15]/70 text-sm font-semibold mt-1">
            Complete tasks, configure milestones, and trace your progress velocity.
          </p>
        </div>

        <button 
          onClick={() => {
            if (milestones.length > 0) {
              setNewMilestoneId(milestones[0].id);
            }
            setShowAddForm(!showAddForm);
          }}
          className="px-5 py-2.5 bg-[#bbf246] border-2 border-[#121e15] rounded-full text-xs font-mono uppercase tracking-wider font-bold text-[#121e15] shadow-[3px_3px_0px_0px_#121e15] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0px_0px_#121e15] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Subtask
        </button>
      </div>

      {/* Task Creation Form inline */}
      {showAddForm && (
        <div className="p-6 rounded-[2.2rem] border-2 border-[#121e15] bg-[#fcfaf2] space-y-4 shadow-lg animate-fade-in">
          <h3 className="text-lg font-serif font-black text-[#121e15] mb-2">Create New Task</h3>
          <form onSubmit={handleAddTaskSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[#121e15]/75 font-bold font-mono uppercase tracking-wider">Task Title</label>
              <input 
                type="text" 
                value={newTaskTitle} 
                onChange={e => setNewTaskTitle(e.target.value)} 
                placeholder="e.g. Write README file" 
                className="w-full rounded-full border-2 border-[#121e15] bg-[#fdfcf7] p-3 text-[#121e15] placeholder-[#121e15]/40 focus:outline-none font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#121e15]/75 font-bold font-mono uppercase tracking-wider">Target Milestone</label>
              <select 
                value={newMilestoneId} 
                onChange={e => setNewMilestoneId(e.target.value)} 
                className="w-full rounded-full border-2 border-[#121e15] bg-[#fdfcf7] p-3 text-[#121e15] focus:outline-none font-semibold font-sans"
              >
                {milestones.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#121e15]/75 font-bold font-mono uppercase tracking-wider">Category</label>
              <select 
                value={newCategory} 
                onChange={e => setNewCategory(e.target.value as any)} 
                className="w-full rounded-full border-2 border-[#121e15] bg-[#fdfcf7] p-3 text-[#121e15] focus:outline-none font-semibold font-sans"
              >
                <option value="Coding">Coding</option>
                <option value="Research">Research</option>
                <option value="Documentation">Documentation</option>
                <option value="Review">Review</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#121e15]/75 font-bold font-mono uppercase tracking-wider">Energy Requirement</label>
              <select 
                value={newEnergy} 
                onChange={e => setNewEnergy(e.target.value as any)} 
                className="w-full rounded-full border-2 border-[#121e15] bg-[#fdfcf7] p-3 text-[#121e15] focus:outline-none font-semibold font-sans"
              >
                <option value="high">High Energy</option>
                <option value="medium">Medium Energy</option>
                <option value="low">Low Energy</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#121e15]/75 font-bold font-mono uppercase tracking-wider">Duration (minutes)</label>
              <input 
                type="number" 
                value={newDuration} 
                onChange={e => setNewDuration(Number(e.target.value))} 
                className="w-full rounded-full border-2 border-[#121e15] bg-[#fdfcf7] p-3 text-[#121e15] focus:outline-none font-semibold"
                required
              />
            </div>

            <div className="md:col-span-4 flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 bg-[#fdfcf7] border-2 border-[#121e15] rounded-full text-xs font-mono uppercase tracking-wider font-bold text-[#121e15] hover:bg-[#121e15]/5 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 bg-[#bbf246] border-2 border-[#121e15] rounded-full text-xs font-mono uppercase tracking-wider font-bold text-[#121e15] hover:bg-[#bbf246]/95 cursor-pointer"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Milestones Sections */}
      <div className="space-y-6">
        {milestones.length > 0 ? (
          milestones.map((milestone) => {
            const milestoneTasks = tasks.filter(t => t.milestoneId === milestone.id);
            const completedMilestoneTasks = milestoneTasks.filter(t => t.completed);
            
            const progress = milestoneTasks.length > 0 
              ? Math.round((completedMilestoneTasks.length / milestoneTasks.length) * 100) 
              : 0;

            const daysLeft = Math.round((new Date(milestone.targetDate).getTime() - new Date().getTime()) / 86400000);

            return (
              <div key={milestone.id} className="glass-card space-y-4">
                
                {/* Milestone Header Info */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-serif font-black text-[#121e15] flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-[#121e15]" /> {milestone.title}
                    </h3>
                    <p className="text-xs text-[#121e15]/60 font-mono font-bold mt-1">
                      Target: {new Date(milestone.targetDate).toLocaleDateString()} • {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? "Today!" : "Overdue"}
                    </p>
                  </div>

                  <div className="w-full sm:w-48 space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-[#121e15]/70 font-mono font-bold uppercase">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    {/* Progression bar */}
                    <div className="h-2 w-full bg-[#f5eedc]/80 border border-[#121e15]/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#121e15] rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Subtasks inside milestone */}
                <div className="space-y-2 border-t-2 border-[#121e15]/5 pt-4">
                  {milestoneTasks.length > 0 ? (
                    milestoneTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`flex items-center justify-between p-4 rounded-[1.8rem] border-2 transition-all ${
                          task.completed 
                            ? 'border-[#121e15]/10 bg-white/25 opacity-55 text-[#121e15]/60' 
                            : 'border-[#121e15]/12 bg-[#fcfaf2]/55 hover:border-[#121e15]/25 hover:bg-[#fcfaf2]/85 text-[#121e15]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => onToggleTaskComplete(task.id)}
                            className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer ${
                              task.completed 
                                ? 'bg-[#121e15] border-[#121e15] text-[#bbf246]' 
                                : 'border-[#121e15]/30 hover:border-[#121e15]'
                            }`}
                          >
                            {task.completed && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
                          </button>

                          <div>
                            <span className={`text-sm font-bold ${task.completed ? 'line-through text-[#121e15]/50' : 'text-[#121e15]'}`}>
                              {task.title}
                            </span>
                            <div className="flex items-center gap-2 mt-1 font-semibold">
                              <span className="text-[10px] text-[#121e15]/60 font-mono uppercase">{task.category}</span>
                              <span className="text-[10px] text-[#121e15]/40 font-mono">•</span>
                              <span className="text-[10px] text-[#121e15]/60 font-mono">{task.durationMinutes} min execution</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase font-mono border-2 ${
                            task.completed 
                              ? 'border-[#121e15]/10 text-[#121e15]/50 bg-[#121e15]/5'
                              : task.energyLevel === 'high' 
                              ? 'border-rose-300 text-rose-800 bg-rose-50/50' 
                              : task.energyLevel === 'medium'
                              ? 'border-amber-300 text-amber-800 bg-amber-50/50'
                              : 'border-emerald-300 text-emerald-800 bg-emerald-50/50'
                          }`}>
                            {task.energyLevel} Energy
                          </span>

                          <button 
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 text-[#121e15]/40 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-[#121e15]/40 text-xs font-semibold italic">
                      No subtasks added to this milestone yet.
                    </div>
                  )}
                </div>

              </div>
            );
          })
        ) : (
          <div className="text-center py-20 glass-card border-dashed border-2 border-[#121e15]/15 text-[#121e15]/60">
            <Trophy className="h-12 w-12 mx-auto text-[#121e15]/40 mb-3" />
            <p className="font-serif font-black text-lg text-[#121e15]">Empty Board</p>
            <p className="text-xs text-[#121e15]/70 mt-2 max-w-sm mx-auto font-semibold leading-relaxed">
              No milestones have been structured yet. Please input your sprint constraints inside the Command Center.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
