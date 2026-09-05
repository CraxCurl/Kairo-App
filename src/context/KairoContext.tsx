import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Task, 
  KairoStatusMode, 
  LaptopInfo, 
  ConfirmationRequest, 
  TimelineEvent, 
  VoiceExchange, 
  AppNotification, 
  AppSettings,
  Priority,
  TaskTrigger 
} from '../types';
import { 
  initialTasks, 
  initialLaptop, 
  initialTimeline, 
  initialVoiceExchanges, 
  initialNotifications, 
  initialSettings 
} from './initialData';
import { api } from '../services/api';

interface KairoContextType {
  tasks: Task[];
  currentTask: Task | null;
  upcomingTask: Task | null;
  kairoStatus: KairoStatusMode;
  laptop: LaptopInfo;
  confirmationQueue: ConfirmationRequest[];
  timeline: TimelineEvent[];
  voiceHistory: VoiceExchange[];
  notifications: AppNotification[];
  unreadNotificationCount: number;
  settings: AppSettings;
  isWsConnected: boolean;
  isLoadingDb: boolean;
  
  // Actions
  startTask: (taskId: string) => void;
  pauseKairo: () => void;
  resumeKairo: () => void;
  skipCurrentTask: () => void;
  completeCurrentTask: () => void;
  cancelTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  reorderTasks: (newTasks: Task[]) => void;
  moveTaskUp: (taskId: string) => void;
  moveTaskDown: (taskId: string) => void;
  moveTaskToTop: (taskId: string) => void;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'position' | 'progress'>) => Task;
  createTasksFromNaturalLanguage: (prompt: string) => Promise<Task[]>;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  respondToConfirmation: (confirmationId: string, allow: boolean) => void;
  processVoiceCommand: (transcript: string) => Promise<string>;
  toggleLaptopOnline: () => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  triggerMockConfirmation: () => void;
  resetToDefaults: () => void;
}

const KairoContext = createContext<KairoContextType | null>(null);

export const KairoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('kairo_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [laptop, setLaptop] = useState<LaptopInfo>(() => {
    const saved = localStorage.getItem('kairo_laptop');
    return saved ? JSON.parse(saved) : initialLaptop;
  });

  const [kairoStatus, setKairoStatus] = useState<KairoStatusMode>('idle');
  const [confirmationQueue, setConfirmationQueue] = useState<ConfirmationRequest[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);

  const [timeline, setTimeline] = useState<TimelineEvent[]>(() => {
    const saved = localStorage.getItem('kairo_timeline');
    return saved ? JSON.parse(saved) : initialTimeline;
  });

  const [voiceHistory, setVoiceHistory] = useState<VoiceExchange[]>(() => {
    const saved = localStorage.getItem('kairo_voice_history');
    return saved ? JSON.parse(saved) : initialVoiceExchanges;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('kairo_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('kairo_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  // Fetch initial tasks from MongoDB API if available
  useEffect(() => {
    async function loadDb() {
      setIsLoadingDb(true);
      const dbTasks = await api.getTasks();
      if (dbTasks && dbTasks.length > 0) {
        setTasks(dbTasks);
      }
      const dbLaptop = await api.getLaptopState();
      if (dbLaptop) {
        setLaptop(dbLaptop);
      }
      setIsLoadingDb(false);
    }
    loadDb();
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('kairo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('kairo_laptop', JSON.stringify(laptop));
  }, [laptop]);

  useEffect(() => {
    localStorage.setItem('kairo_timeline', JSON.stringify(timeline));
  }, [timeline]);

  useEffect(() => {
    localStorage.setItem('kairo_voice_history', JSON.stringify(voiceHistory));
  }, [voiceHistory]);

  useEffect(() => {
    localStorage.setItem('kairo_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('kairo_settings', JSON.stringify(settings));
  }, [settings]);

  // Derived tasks
  const currentTask = tasks.find(t => t.status === 'in_progress') || tasks.find(t => t.status === 'waiting') || null;
  const waitingTasks = tasks.filter(t => t.status === 'waiting' && t.id !== currentTask?.id);
  const upcomingTask = waitingTasks[0] || null;
  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const addTimelineEvent = useCallback((type: TimelineEvent['type'], title: string, description?: string, taskId?: string) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEvent: TimelineEvent = {
      id: 'tl-' + Date.now(),
      timestamp: now.toISOString(),
      timeFormatted,
      type,
      title,
      description,
      taskId
    };
    setTimeline(prev => [newEvent, ...prev.slice(0, 50)]);
    api.saveTimelineEvent(newEvent);
  }, []);

  const addNotification = useCallback((type: AppNotification['type'], title: string, body: string, taskId?: string) => {
    const now = new Date();
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title,
      body,
      type,
      read: false,
      taskId
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  // Update status depending on current active task
  useEffect(() => {
    if (confirmationQueue.length > 0) {
      setKairoStatus('waiting_confirmation');
    } else if (tasks.some(t => t.status === 'in_progress')) {
      setKairoStatus('executing');
    } else if (tasks.some(t => t.status === 'paused')) {
      setKairoStatus('paused');
    } else {
      setKairoStatus('idle');
    }
  }, [tasks, confirmationQueue.length]);

  const hasInProgressTask = tasks.some(t => t.status === 'in_progress');

  // Reactive Simulation Loop for Active Task Execution
  useEffect(() => {
    if (!laptop.online || confirmationQueue.length > 0) return;
    if (!hasInProgressTask) return;

    const timer = setInterval(() => {
      setTasks(prevTasks => {
        const idx = prevTasks.findIndex(t => t.status === 'in_progress');
        if (idx === -1) return prevTasks;
        const task = prevTasks[idx];
        const newProgress = Math.min(100, task.progress + Math.floor(Math.random() * 10) + 8);
        const steps = task.steps ? [...task.steps] : [];

        // Update step completion based on progress ratio
        if (steps.length > 0) {
          const completedStepCount = Math.floor((newProgress / 100) * steps.length);
          steps.forEach((s, i) => {
            if (i < completedStepCount) {
              s.completed = true;
              s.current = false;
            } else if (i === completedStepCount) {
              s.completed = false;
              s.current = true;
            } else {
              s.completed = false;
              s.current = false;
            }
          });
        }

        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newLogs = [...(task.executionLogs || [])];
        if (newProgress < 100 && Math.random() > 0.4) {
          const sampleLogs = [
            `[${nowStr}] Worker thread active: processing sub-routine`,
            `[${nowStr}] Verified AST node & executed compiler pass`,
            `[${nowStr}] Streaming telemetry to companion app`,
            `[${nowStr}] Host system CPU load optimal`
          ];
          const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
          if (!newLogs.includes(randomLog)) {
            newLogs.push(randomLog);
          }
        }

        if (newProgress >= 100) {
          // Task completed! Trigger celebration & auto-chain next
          try {
            confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
          } catch {}

          addTimelineEvent('task_complete', `Completed "${task.name}"`, 'Resolved successfully on laptop agent.', task.id);
          addNotification('task_completed', 'Task Completed! 🎉', `"${task.name}" has successfully finished execution.`, task.id);

          const updatedTasks = prevTasks.map((t, i) => {
            if (i === idx) {
              return {
                ...t,
                status: 'completed' as const,
                progress: 100,
                completedAt: new Date().toISOString(),
                steps: steps.map(s => ({ ...s, completed: true, current: false })),
                executionLogs: [...newLogs, `[${nowStr}] Pipeline execution resolved successfully [100%]`]
              };
            }
            return t;
          });

          // Auto-start next waiting task
          const nextWaitingIndex = updatedTasks.findIndex(t => t.status === 'waiting');
          if (nextWaitingIndex !== -1) {
            updatedTasks[nextWaitingIndex] = {
              ...updatedTasks[nextWaitingIndex],
              status: 'in_progress' as const
            };
            addTimelineEvent('task_start', `Started "${updatedTasks[nextWaitingIndex].name}"`, 'Auto-commenced next queued task.', updatedTasks[nextWaitingIndex].id);
          }
          return updatedTasks;
        }

        return prevTasks.map((t, i) => i === idx ? {
          ...t,
          progress: newProgress,
          steps,
          executionLogs: newLogs
        } : t);
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [laptop.online, confirmationQueue.length, hasInProgressTask, addTimelineEvent, addNotification]);

  // Telemetry Fluctuation Loop
  useEffect(() => {
    if (!laptop.online) return;
    const interval = setInterval(() => {
      setLaptop(prev => {
        const activeT = tasks.find(t => t.status === 'in_progress');
        const cpuDelta = (Math.random() - 0.5) * 8;
        const newCpu = Math.max(10, Math.min(85, Math.round(prev.cpuLoad + cpuDelta)));
        const ramDelta = (Math.random() - 0.5) * 4;
        const newRam = Math.max(25, Math.min(75, Math.round(prev.ramUsage + ramDelta)));
        const newBattery = prev.isCharging ? Math.min(100, prev.batteryLevel + 0.1) : Math.max(5, prev.batteryLevel - 0.1);
        const appName = activeT ? `Executing: ${activeT.name}` : 'VS Code - dev-station';

        return {
          ...prev,
          cpuLoad: newCpu,
          ramUsage: newRam,
          batteryLevel: newBattery,
          activeApp: appName
        };
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [laptop.online, tasks]);

  const startTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'in_progress' };
      }
      if (t.status === 'in_progress' && t.id !== taskId) {
        return { ...t, status: 'waiting' };
      }
      return t;
    }));
    api.updateTask(taskId, { status: 'in_progress' });
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      addTimelineEvent('task_start', `Started "${task.name}"`, 'Execution commenced on laptop agent.', taskId);
    }
  };

  const pauseKairo = () => {
    setKairoStatus('paused');
    setTasks(prev => prev.map(t => t.status === 'in_progress' ? { ...t, status: 'paused' } : t));
    addTimelineEvent('task_pause', 'Pipeline paused by user', 'All remote worker threads held.');
  };

  const resumeKairo = () => {
    setKairoStatus('executing');
    setTasks(prev => prev.map(t => t.status === 'paused' ? { ...t, status: 'in_progress' } : t));
    addTimelineEvent('system', 'Pipeline resumed', 'Worker threads active.');
  };

  const skipCurrentTask = () => {
    if (!currentTask) return;
    setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, status: 'skipped' } : t));
    api.updateTask(currentTask.id, { status: 'skipped' });
    addTimelineEvent('system', `Skipped "${currentTask.name}"`, 'Moved to next item in queue.', currentTask.id);
    
    const nextTask = tasks.find(t => t.status === 'waiting' && t.id !== currentTask.id);
    if (nextTask) {
      startTask(nextTask.id);
    }
  };

  const completeCurrentTask = () => {
    if (!currentTask) return;
    try {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    } catch {}

    setTasks(prev => prev.map(t => t.id === currentTask.id ? {
      ...t,
      status: 'completed',
      progress: 100,
      completedAt: new Date().toISOString(),
      steps: t.steps?.map(s => ({ ...s, completed: true, current: false }))
    } : t));
    api.updateTask(currentTask.id, { status: 'completed', progress: 100, completedAt: new Date().toISOString() });
    addTimelineEvent('task_complete', `Completed "${currentTask.name}"`, 'Resolved successfully.', currentTask.id);
    addNotification('task_completed', 'Task Completed! 🎉', `"${currentTask.name}" marked complete.`, currentTask.id);
    
    const nextTask = tasks.find(t => t.status === 'waiting' && t.id !== currentTask.id);
    if (nextTask) {
      startTask(nextTask.id);
    }
  };

  const cancelTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'failed' } : t));
    api.updateTask(taskId, { status: 'failed' });
    addTimelineEvent('system', 'Task cancelled', `Task ID ${taskId} cancelled remotely.`, taskId);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    api.deleteTask(taskId);
    addTimelineEvent('system', 'Task removed', `Removed task ID ${taskId}`);
  };

  const reorderTasks = (newTasks: Task[]) => {
    const updated = newTasks.map((t, idx) => ({ ...t, position: idx }));
    setTasks(updated);
    api.reorderTasks(updated);
    addTimelineEvent('system', 'Queue reordered', 'Updated execution priority hierarchy.');
  };

  const moveTaskUp = (taskId: string) => {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index <= 0) return;
    const newTasks = [...tasks];
    const temp = newTasks[index - 1];
    newTasks[index - 1] = newTasks[index];
    newTasks[index] = temp;
    reorderTasks(newTasks);
  };

  const moveTaskDown = (taskId: string) => {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1 || index >= tasks.length - 1) return;
    const newTasks = [...tasks];
    const temp = newTasks[index + 1];
    newTasks[index + 1] = newTasks[index];
    newTasks[index] = temp;
    reorderTasks(newTasks);
  };

  const moveTaskToTop = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const remaining = tasks.filter(t => t.id !== taskId);
    reorderTasks([task, ...remaining]);
  };

  const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'position' | 'progress'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
      progress: 0,
      position: tasks.length,
      steps: taskData.steps || [
        { id: 's1', title: 'Initialize task on laptop node', completed: false, current: true },
        { id: 's2', title: 'Execute primary instructions', completed: false },
        { id: 's3', title: 'Verify completion status', completed: false }
      ],
      executionLogs: [`[${new Date().toLocaleTimeString()}] Task registered in pipeline`]
    };

    setTasks(prev => [...prev, newTask]);
    api.createTask(newTask);
    addTimelineEvent('system', `Created task "${newTask.name}"`, `Trigger: ${newTask.trigger} | Priority: ${newTask.priority}`, newTask.id);
    return newTask;
  };

  const createTasksFromNaturalLanguage = async (prompt: string): Promise<Task[]> => {
    setKairoStatus('thinking');
    await new Promise(resolve => setTimeout(resolve, 600));

    const lower = prompt.toLowerCase();
    const created: Task[] = [];

    let trigger: TaskTrigger = 'today';
    if (lower.includes('tomorrow')) trigger = 'tomorrow';
    else if (lower.includes('next startup') || lower.includes('open my laptop') || lower.includes('start my laptop')) trigger = 'next_startup';

    const segments = prompt
      .replace(/tomorrow when i open my laptop,?/gi, '')
      .replace(/when i open my laptop,?/gi, '')
      .replace(/tomorrow,?/gi, '')
      .split(/,\s*then\s*|\s*then\s*|\s*and also\s*|;\s*/i)
      .map(s => s.trim())
      .filter(Boolean);

    for (let i = 0; i < segments.length; i++) {
      let raw = segments[i];
      raw = raw.replace(/^(remind me to|please|i need to|kairo|kairo please|add|schedule)\s+/i, '');
      const taskName = raw.charAt(0).toUpperCase() + raw.slice(1);
      
      const priority: Priority = 
        lower.includes('urgent') || lower.includes('critical') 
          ? 'critical' 
          : lower.includes('important')
          ? 'high'
          : 'medium';

      const tags: string[] = ['AI-Parsed'];
      if (lower.includes('java')) tags.push('Java');
      if (lower.includes('leetcode')) tags.push('LeetCode');
      if (lower.includes('dbms')) tags.push('DBMS');

      const newTask = createTask({
        name: taskName,
        description: `Parsed from instruction: "${prompt}"`,
        priority,
        status: 'waiting',
        trigger: i === 0 ? trigger : 'today',
        requiresConfirmation: true,
        estimatedDuration: 30,
        tags,
        dependencies: i > 0 && created[i - 1] ? [created[i - 1].id] : []
      });
      created.push(newTask);
    }

    return created;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    api.updateTask(taskId, updates);
    addTimelineEvent('system', `Updated task details`, `Task ID: ${taskId}`, taskId);
  };

  const respondToConfirmation = (confirmationId: string, allow: boolean) => {
    const req = confirmationQueue.find(c => c.id === confirmationId);
    if (!req) return;

    setConfirmationQueue(prev => prev.filter(c => c.id !== confirmationId));

    if (allow) {
      addTimelineEvent('confirmation_approved', `Approved: "${req.action}"`, `Action allowed for ${req.taskName}`, req.taskId);
    } else {
      addTimelineEvent('confirmation_denied', `Denied: "${req.action}"`, `Action blocked by user for ${req.taskName}`, req.taskId);
    }
  };

  const processVoiceCommand = async (transcript: string): Promise<string> => {
    const lower = transcript.toLowerCase().trim();
    let responseText = '';
    let action = '';

    if (lower.includes("what's next") || lower.includes("what is next")) {
      if (currentTask) {
        responseText = `Currently queued on "${currentTask.name}". ${upcomingTask ? `Up next: "${upcomingTask.name}".` : 'No further tasks queued.'}`;
      } else {
        responseText = upcomingTask ? `Up next: "${upcomingTask.name}".` : "Task queue is currently empty.";
      }
      action = "Queried upcoming task";
    } 
    else if (lower.includes("is my laptop online") || lower.includes("status") || lower.includes("laptop online")) {
      responseText = laptop.online 
        ? `${laptop.deviceName} is Online. CPU load at ${laptop.cpuLoad}%, Battery at ${Math.round(laptop.batteryLevel)}%.`
        : `Laptop is currently Offline.`;
      action = "Checked node status";
    }
    else if (lower.includes("move") && lower.includes("top")) {
      if (tasks.length > 0) {
        const targetTask = tasks.find(t => lower.includes(t.name.toLowerCase())) || tasks[tasks.length - 1];
        moveTaskToTop(targetTask.id);
        responseText = `Moved "${targetTask.name}" to top of queue.`;
        action = "Moved task to top";
      } else {
        responseText = "No tasks in queue to reorder.";
        action = "Reorder attempt failed";
      }
    }
    else if (lower.includes("completed") || lower.includes("done") || lower.includes("finish current")) {
      if (currentTask) {
        completeCurrentTask();
        responseText = `Marked "${currentTask.name}" as completed! 🎉`;
        action = "Completed active task";
      } else {
        responseText = "No active task in progress to complete.";
        action = "Complete task attempt";
      }
    }
    else if (lower.includes("pause")) {
      pauseKairo();
      responseText = "Paused Kairo execution pipeline.";
      action = "Paused pipeline";
    }
    else if (lower.includes("resume") || lower.includes("start")) {
      resumeKairo();
      responseText = "Resumed Kairo execution pipeline.";
      action = "Resumed pipeline";
    }
    else if (lower.includes("skip")) {
      if (currentTask) {
        skipCurrentTask();
        responseText = `Skipped "${currentTask.name}".`;
        action = "Skipped active task";
      } else {
        responseText = "No active task to skip.";
        action = "Skip attempt";
      }
    }
    else if (lower.startsWith("add ") || lower.includes("remind me") || lower.includes("schedule")) {
      const created = await createTasksFromNaturalLanguage(transcript);
      responseText = `Successfully created ${created.length} task(s) on your desktop queue.`;
      action = `Created ${created.length} task(s)`;
    }
    else {
      responseText = `Dispatched instruction "${transcript}" to Kairo Desktop Agent.`;
      action = "Sent prompt to agent";
    }

    if (settings.voiceAutoSpeak && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(responseText);
        utterance.rate = settings.ttsSpeed;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }

    const exchange: VoiceExchange = {
      id: 'vx-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userInput: transcript,
      kairoResponse: responseText,
      actionTaken: action
    };

    setVoiceHistory(prev => [exchange, ...prev]);
    return responseText;
  };

  const toggleLaptopOnline = () => {
    setLaptop(prev => {
      const next = !prev.online;
      addTimelineEvent('system', next ? 'Laptop came online' : 'Laptop went offline');
      addNotification(
        next ? 'laptop_online' : 'task_failed',
        next ? 'Laptop Came Online' : 'Laptop Disconnected',
        next ? 'Desktop agent node reconnected.' : 'Companion node is now offline.'
      );
      return { ...prev, online: next };
    });
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const triggerMockConfirmation = () => {
    const newConf: ConfirmationRequest = {
      id: 'conf-' + Date.now(),
      taskId: currentTask?.id || 'task-1',
      taskName: currentTask?.name || 'Java Assignment',
      action: 'Launch VS Code and execute build script',
      commandToExecute: 'code . && npm test --run',
      riskLevel: 'medium',
      timeoutSeconds: 45,
      createdAt: new Date().toISOString()
    };
    setConfirmationQueue(prev => [newConf, ...prev]);
    addNotification('needs_confirmation', 'Remote Auth Request', `Authorization needed for "${currentTask?.name || 'Java Assignment'}".`, currentTask?.id);
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setTasks(initialTasks);
    setLaptop(initialLaptop);
    setTimeline(initialTimeline);
    setVoiceHistory(initialVoiceExchanges);
    setNotifications(initialNotifications);
    setSettings(initialSettings);
    setConfirmationQueue([]);
  };

  return (
    <KairoContext.Provider value={{
      tasks,
      currentTask,
      upcomingTask,
      kairoStatus,
      laptop,
      confirmationQueue,
      timeline,
      voiceHistory,
      notifications,
      unreadNotificationCount,
      settings,
      isWsConnected: true,
      isLoadingDb,
      startTask,
      pauseKairo,
      resumeKairo,
      skipCurrentTask,
      completeCurrentTask,
      cancelTask,
      deleteTask,
      reorderTasks,
      moveTaskUp,
      moveTaskDown,
      moveTaskToTop,
      createTask,
      createTasksFromNaturalLanguage,
      updateTask,
      respondToConfirmation,
      processVoiceCommand,
      toggleLaptopOnline,
      updateSettings,
      markNotificationAsRead,
      clearAllNotifications,
      triggerMockConfirmation,
      resetToDefaults
    }}>
      {children}
    </KairoContext.Provider>
  );
};

export const useKairo = () => {
  const context = useContext(KairoContext);
  if (!context) {
    throw new Error('useKairo must be used within a KairoProvider');
  }
  return context;
};
