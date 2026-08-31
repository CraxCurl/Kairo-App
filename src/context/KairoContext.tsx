import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  // Load state from localStorage or initialData
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('kairo_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [laptop, setLaptop] = useState<LaptopInfo>(() => {
    const saved = localStorage.getItem('kairo_laptop');
    return saved ? JSON.parse(saved) : initialLaptop;
  });

  const [kairoStatus, setKairoStatus] = useState<KairoStatusMode>('executing');
  
  const [confirmationQueue, setConfirmationQueue] = useState<ConfirmationRequest[]>([
    {
      id: 'conf-1',
      taskId: 'task-1',
      taskName: 'Complete Java assignment',
      action: 'Open VS Code and run the Java project test suite',
      commandToExecute: 'code /Projects/JavaAssignments && ./gradlew test --continuous',
      riskLevel: 'medium',
      timeoutSeconds: 45,
      createdAt: new Date().toISOString()
    }
  ]);

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

  const [isWsConnected, setIsWsConnected] = useState<boolean>(true);

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

  // Unread notification count
  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Helper to add timeline event
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
    setTimeline(prev => [newEvent, ...prev.slice(0, 40)]);
  }, []);

  // Helper to add notification
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

  // Real-time heartbeat and telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (laptop.online) {
        setLaptop(prev => ({
          ...prev,
          cpuLoad: Math.min(95, Math.max(12, Math.round(prev.cpuLoad + (Math.random() * 8 - 4)))),
          ramUsage: Math.min(85, Math.max(40, Math.round(prev.ramUsage + (Math.random() * 2 - 1)))),
          batteryLevel: prev.isCharging ? Math.min(100, prev.batteryLevel + 0.1) : Math.max(5, prev.batteryLevel - 0.05),
          lastHeartbeat: 'Just now (<1s ago)'
        }));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [laptop.online]);

  // Live Task progress simulation when Kairo is executing
  useEffect(() => {
    if (kairoStatus !== 'executing' || !laptop.online || !currentTask || confirmationQueue.length > 0) {
      return;
    }

    const interval = setInterval(() => {
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === currentTask.id && task.status === 'in_progress') {
            const nextProgress = Math.min(100, task.progress + 2);
            
            // Advance steps if needed
            let updatedSteps = task.steps;
            if (task.steps && task.steps.length > 0) {
              const currentStepIdx = task.steps.findIndex(s => !s.completed);
              if (currentStepIdx !== -1 && nextProgress > ((currentStepIdx + 1) / task.steps.length) * 100) {
                updatedSteps = task.steps.map((s, idx) => ({
                  ...s,
                  completed: idx <= currentStepIdx,
                  current: idx === currentStepIdx + 1
                }));
              }
            }

            if (nextProgress >= 100) {
              // Task completed
              addTimelineEvent('task_complete', `Task completed: "${task.name}"`, 'All execution steps verified.', task.id);
              addNotification('task_completed', 'Task Completed', `"${task.name}" has been completed by Kairo.`, task.id);
              return {
                ...task,
                status: 'completed',
                progress: 100,
                completedAt: new Date().toISOString(),
                steps: task.steps?.map(s => ({ ...s, completed: true, current: false }))
              };
            }

            return {
              ...task,
              progress: nextProgress,
              steps: updatedSteps
            };
          }
          return task;
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [kairoStatus, laptop.online, currentTask?.id, confirmationQueue.length, addTimelineEvent, addNotification]);

  // Actions
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
    setKairoStatus('executing');
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      addTimelineEvent('task_start', `Started "${task.name}"`, 'Execution commenced on laptop agent.', taskId);
    }
  };

  const pauseKairo = () => {
    setKairoStatus('paused');
    setTasks(prev => prev.map(t => t.status === 'in_progress' ? { ...t, status: 'paused' } : t));
    addTimelineEvent('task_pause', 'Kairo paused by user', 'All remote worker threads held.');
  };

  const resumeKairo = () => {
    setKairoStatus('executing');
    setTasks(prev => prev.map(t => t.status === 'paused' ? { ...t, status: 'in_progress' } : t));
    addTimelineEvent('system', 'Kairo resumed', 'Worker threads active.');
  };

  const skipCurrentTask = () => {
    if (!currentTask) return;
    setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, status: 'skipped' } : t));
    addTimelineEvent('system', `Skipped "${currentTask.name}"`, 'Moved to next item in queue.', currentTask.id);
    addNotification('task_skipped', 'Task Skipped', `Skipped execution of "${currentTask.name}".`, currentTask.id);
    
    // Start next waiting task if available
    const nextTask = tasks.find(t => t.status === 'waiting' && t.id !== currentTask.id);
    if (nextTask) {
      startTask(nextTask.id);
    } else {
      setKairoStatus('idle');
    }
  };

  const completeCurrentTask = () => {
    if (!currentTask) return;
    setTasks(prev => prev.map(t => t.id === currentTask.id ? {
      ...t,
      status: 'completed',
      progress: 100,
      completedAt: new Date().toISOString(),
      steps: t.steps?.map(s => ({ ...s, completed: true, current: false }))
    } : t));
    addTimelineEvent('task_complete', `Completed "${currentTask.name}"`, 'Marked completed manually by user.', currentTask.id);
    addNotification('task_completed', 'Task Completed', `"${currentTask.name}" marked as done.`, currentTask.id);
    
    // Pick next
    const nextTask = tasks.find(t => t.status === 'waiting' && t.id !== currentTask.id);
    if (nextTask) {
      startTask(nextTask.id);
    } else {
      setKairoStatus('idle');
    }
  };

  const cancelTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'failed' } : t));
    addTimelineEvent('system', 'Task cancelled', `Task ID ${taskId} cancelled remotely.`, taskId);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    addTimelineEvent('system', 'Task deleted from queue', `Removed task ID ${taskId}`);
  };

  const reorderTasks = (newTasks: Task[]) => {
    const updated = newTasks.map((t, idx) => ({ ...t, position: idx }));
    setTasks(updated);
    addTimelineEvent('system', 'Task queue reordered', 'Updated execution priority hierarchy.');
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
        { id: 's1', title: 'Initialize task on laptop runtime', completed: false, current: true },
        { id: 's2', title: 'Execute primary agent instructions', completed: false },
        { id: 's3', title: 'Verify completion status and artifacts', completed: false }
      ],
      executionLogs: [`[${new Date().toLocaleTimeString()}] Task registered on mobile companion queue`]
    };

    setTasks(prev => [...prev, newTask]);
    addTimelineEvent('system', `Created task "${newTask.name}"`, `Trigger: ${newTask.trigger} | Priority: ${newTask.priority}`, newTask.id);
    return newTask;
  };

  // Natural Language Task Creator (Simulates Laptop LLM Parsing)
  const createTasksFromNaturalLanguage = async (prompt: string): Promise<Task[]> => {
    setKairoStatus('thinking');
    
    // Simulate LLM roundtrip to laptop
    await new Promise(resolve => setTimeout(resolve, 800));

    const lower = prompt.toLowerCase();
    const created: Task[] = [];

    // Parse triggers & tasks
    let trigger: TaskTrigger = 'today';
    if (lower.includes('tomorrow')) trigger = 'tomorrow';
    else if (lower.includes('next startup') || lower.includes('open my laptop') || lower.includes('start my laptop')) trigger = 'next_startup';
    else if (lower.includes('tonight') || lower.includes('today')) trigger = 'today';

    // Check for compound instructions (e.g. "then", "and then", comma separated)
    const segments = prompt
      .replace(/tomorrow when i open my laptop,?/gi, '')
      .replace(/when i open my laptop,?/gi, '')
      .replace(/tomorrow,?/gi, '')
      .split(/,\s*then\s*|\s*then\s*|\s*and also\s*|;\s*/i)
      .map(s => s.trim())
      .filter(Boolean);

    for (let i = 0; i < segments.length; i++) {
      let raw = segments[i];
      // Strip helper phrases
      raw = raw.replace(/^(remind me to|please|i need to|kairo|kairo please|add|schedule)\s+/i, '');
      const taskName = raw.charAt(0).toUpperCase() + raw.slice(1);
      
      const priority: Priority = 
        lower.includes('urgent') || lower.includes('critical') || lower.includes('asap') 
          ? 'critical' 
          : lower.includes('important') || lower.includes('java') || lower.includes('assignment')
          ? 'high'
          : 'medium';

      const tags: string[] = ['AI-Parsed'];
      if (lower.includes('java')) tags.push('Java');
      if (lower.includes('leetcode')) tags.push('LeetCode', 'DSA');
      if (lower.includes('dbms')) tags.push('DBMS');
      if (lower.includes('code') || lower.includes('solve')) tags.push('Coding');

      const newTask = createTask({
        name: taskName,
        description: `Parsed from instruction: "${prompt}"`,
        priority,
        status: 'waiting',
        trigger: i === 0 ? trigger : (trigger === 'next_startup' ? 'next_startup' : 'today'),
        requiresConfirmation: lower.includes('submit') || lower.includes('delete') || lower.includes('run') || true,
        estimatedDuration: lower.includes('leetcode') ? 30 : 45,
        tags,
        dependencies: i > 0 && created[i - 1] ? [created[i - 1].id] : []
      });
      created.push(newTask);
    }

    setKairoStatus('executing');
    return created;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
    addTimelineEvent('system', `Updated task details`, `Task ID: ${taskId}`, taskId);
  };

  const respondToConfirmation = (confirmationId: string, allow: boolean) => {
    const req = confirmationQueue.find(c => c.id === confirmationId);
    if (!req) return;

    setConfirmationQueue(prev => prev.filter(c => c.id !== confirmationId));

    if (allow) {
      addTimelineEvent('confirmation_approved', `Approved: "${req.action}"`, `Action allowed for ${req.taskName}`, req.taskId);
      addNotification('kairo_started', 'Action Approved', `Kairo is executing "${req.action}".`, req.taskId);
      setKairoStatus('executing');
    } else {
      addTimelineEvent('confirmation_denied', `Denied: "${req.action}"`, `Action blocked by user for ${req.taskName}`, req.taskId);
      addNotification('task_skipped', 'Action Blocked', `Denied permission for "${req.action}".`, req.taskId);
      setKairoStatus('paused');
    }
  };

  // Voice command processor
  const processVoiceCommand = async (transcript: string): Promise<string> => {
    const lower = transcript.toLowerCase().trim();
    let responseText = '';
    let action = '';

    if (lower.includes("what's next") || lower.includes("what is next") || lower.includes("upcoming")) {
      if (currentTask) {
        responseText = `You're currently working on "${currentTask.name}" at ${currentTask.progress}%. ${upcomingTask ? `Up next is "${upcomingTask.name}".` : 'No other tasks in queue.'}`;
      } else {
        responseText = upcomingTask ? `Up next is "${upcomingTask.name}".` : "Your task queue is currently empty.";
      }
      action = "Queried upcoming task";
    } 
    else if (lower.includes("is my laptop online") || lower.includes("laptop status") || lower.includes("computer status")) {
      responseText = laptop.online 
        ? `Yes, ${laptop.deviceName} is Online at ${laptop.ipAddress}. Battery is at ${Math.round(laptop.batteryLevel)}% and CPU load is ${laptop.cpuLoad}%.`
        : `Your laptop is currently Offline. Tasks will queue and resume upon next startup.`;
      action = "Checked laptop status";
    }
    else if (lower.includes("pause kairo") || lower.includes("pause") || lower.includes("hold on")) {
      pauseKairo();
      responseText = "Paused Kairo. All execution on your laptop is on hold.";
      action = "Paused agent";
    }
    else if (lower.includes("resume") || lower.includes("continue") || lower.includes("start kairo")) {
      resumeKairo();
      responseText = "Resumed Kairo. Execution has continued on your laptop.";
      action = "Resumed agent";
    }
    else if (lower.includes("skip the current task") || lower.includes("skip task") || lower.includes("skip")) {
      if (currentTask) {
        const skippedName = currentTask.name;
        skipCurrentTask();
        responseText = `Skipped "${skippedName}". Moving on to the next task.`;
      } else {
        responseText = "There is no active task to skip.";
      }
      action = "Skipped task";
    }
    else if (lower.includes("move leetcode to the top") || (lower.includes("move") && lower.includes("top"))) {
      const target = tasks.find(t => t.name.toLowerCase().includes('leetcode') || (lower.includes('java') && t.name.toLowerCase().includes('java')));
      if (target) {
        moveTaskToTop(target.id);
        responseText = `Moved "${target.name}" to the top of your queue.`;
        action = `Moved ${target.name} to top`;
      } else {
        responseText = "Couldn't locate the specified task in your queue.";
      }
    }
    else if (lower.includes("what have i completed today") || lower.includes("completed today") || lower.includes("progress")) {
      const completed = tasks.filter(t => t.status === 'completed');
      if (completed.length > 0) {
        responseText = `Today you've completed ${completed.length} task${completed.length > 1 ? 's' : ''}: ${completed.map(t => `"${t.name}"`).join(', ')}.`;
      } else {
        responseText = "You haven't completed any tasks yet today. Let's get through the queue!";
      }
      action = "Queried completed tasks";
    }
    else if (lower.startsWith("add ") || lower.includes("remind me") || lower.includes("create task")) {
      const created = await createTasksFromNaturalLanguage(transcript);
      if (created.length > 0) {
        responseText = `Added ${created.length > 1 ? `${created.length} tasks` : `"${created[0].name}"`} to your ${created[0].trigger.replace('_', ' ')} queue.`;
        action = `Created ${created.length} task(s)`;
      } else {
        responseText = "I've added the requested task to your laptop queue.";
      }
    }
    else {
      // General AI assistant response
      responseText = `Understood. I've sent your command "${transcript}" to Kairo on your laptop. Current status is ${kairoStatus}.`;
      action = "Sent prompt to laptop agent";
    }

    // TTS synthesis if enabled
    if (settings.voiceAutoSpeak && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(responseText);
        utterance.rate = settings.ttsSpeed;
        utterance.pitch = settings.ttsPitch;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('TTS playback error:', err);
      }
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
      const nextOnline = !prev.online;
      if (nextOnline) {
        addTimelineEvent('startup', 'Laptop came online', `${prev.deviceName} re-established secure link.`);
        addNotification('laptop_online', 'Laptop Came Online', `${prev.deviceName} is now online and listening.`);
      } else {
        addTimelineEvent('system', 'Laptop went offline', 'Connection lost or laptop put to sleep.');
      }
      return { ...prev, online: nextOnline };
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
      taskId: currentTask?.id || 'task-2',
      taskName: currentTask?.name || 'Solve 2 LeetCode problems',
      action: 'Launch Chrome browser session and submit code solution',
      commandToExecute: 'open -a "Google Chrome" https://leetcode.com/problems/trapping-rain-water/ && kairo-runner --submit',
      riskLevel: 'high',
      timeoutSeconds: 60,
      createdAt: new Date().toISOString()
    };
    setConfirmationQueue(prev => [newConf, ...prev]);
    setKairoStatus('waiting_confirmation');
    addNotification('needs_confirmation', 'Confirmation Required', `Kairo is requesting permission to execute: "${newConf.action}"`, newConf.taskId);
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setTasks(initialTasks);
    setLaptop(initialLaptop);
    setTimeline(initialTimeline);
    setVoiceHistory(initialVoiceExchanges);
    setNotifications(initialNotifications);
    setSettings(initialSettings);
    setKairoStatus('executing');
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
      isWsConnected,
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
