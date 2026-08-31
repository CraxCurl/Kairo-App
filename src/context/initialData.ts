import { Task, LaptopInfo, TimelineEvent, VoiceExchange, AppNotification, AppSettings } from '../types';

export const initialTasks: Task[] = [];

export const initialLaptop: LaptopInfo = {
  online: true,
  deviceName: 'Desktop Agent Node',
  ipAddress: '192.168.1.42:8420',
  os: 'macOS / Linux / Windows',
  batteryLevel: 92,
  isCharging: true,
  cpuLoad: 18,
  ramUsage: 36,
  lastHeartbeat: 'Connected',
  activeApp: 'Ready for tasks'
};

export const initialTimeline: TimelineEvent[] = [
  {
    id: 'tl-init',
    timestamp: new Date().toISOString(),
    timeFormatted: 'Ready',
    type: 'startup',
    title: 'Agent node linked',
    description: 'Secure companion tunnel active.'
  }
];

export const initialVoiceExchanges: VoiceExchange[] = [];

export const initialNotifications: AppNotification[] = [];

export const initialSettings: AppSettings = {
  laptopName: 'Desktop Agent Node',
  laptopIp: '192.168.1.42',
  laptopPort: 8420,
  authToken: 'kairo-local-session-dev',
  kairoPersonality: 'focused',
  voiceEnabled: true,
  voiceAutoSpeak: true,
  ttsSpeed: 1.0,
  ttsPitch: 1.0,
  autoApproveSafeTasks: false,
  confirmationTimeout: 60,
  defaultPriority: 'medium',
  defaultTrigger: 'next_startup',
  startupBehavior: 'resume_queue',
  notifications: {
    laptopOnline: true,
    kairoStarted: true,
    needsConfirmation: true,
    taskCompleted: true,
    taskFailed: true,
    taskSkipped: true,
    deadlines: true
  }
};
