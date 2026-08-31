export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type TaskStatus = 
  | 'waiting' 
  | 'in_progress' 
  | 'paused' 
  | 'completed' 
  | 'failed' 
  | 'skipped' 
  | 'pending_confirmation';

export type TaskTrigger = 
  | 'next_startup' 
  | 'today' 
  | 'tomorrow' 
  | 'specific_datetime' 
  | 'after_task' 
  | 'manual';

export interface TaskStep {
  id: string;
  title: string;
  completed: boolean;
  current?: boolean;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  trigger: TaskTrigger;
  scheduledAt?: string;
  scheduledTime?: string;
  afterTaskId?: string;
  requiresConfirmation: boolean;
  estimatedDuration?: number; // minutes
  tags: string[];
  dependencies: string[];
  createdAt: string;
  completedAt?: string;
  progress: number; // 0 - 100
  steps?: TaskStep[];
  executionLogs?: string[];
  position: number;
}

export type KairoStatusMode = 'idle' | 'executing' | 'waiting_confirmation' | 'paused' | 'thinking';

export interface LaptopInfo {
  online: boolean;
  deviceName: string;
  ipAddress: string;
  os: string;
  batteryLevel: number;
  isCharging: boolean;
  cpuLoad: number;
  ramUsage: number;
  lastHeartbeat: string;
  activeApp?: string;
}

export interface ConfirmationRequest {
  id: string;
  taskId: string;
  taskName: string;
  action: string;
  commandToExecute: string;
  riskLevel: 'low' | 'medium' | 'high';
  timeoutSeconds: number;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeFormatted: string;
  type: 
    | 'startup' 
    | 'task_start' 
    | 'task_complete' 
    | 'task_pause' 
    | 'confirmation_approved' 
    | 'confirmation_denied' 
    | 'app_launch' 
    | 'system' 
    | 'voice_command';
  title: string;
  description?: string;
  taskId?: string;
}

export interface VoiceExchange {
  id: string;
  timestamp: string;
  userInput: string;
  kairoResponse: string;
  actionTaken?: string;
}

export interface AppNotification {
  id: string;
  timestamp: string;
  title: string;
  body: string;
  type: 
    | 'laptop_online' 
    | 'kairo_started' 
    | 'needs_confirmation' 
    | 'task_completed' 
    | 'task_failed' 
    | 'task_skipped' 
    | 'deadline_warning' 
    | 'input_required';
  read: boolean;
  taskId?: string;
}

export interface AppSettings {
  laptopName: string;
  laptopIp: string;
  laptopPort: number;
  authToken: string;
  kairoPersonality: 'focused' | 'buddy' | 'strict' | 'concise';
  voiceEnabled: boolean;
  voiceAutoSpeak: boolean;
  ttsSpeed: number;
  ttsPitch: number;
  autoApproveSafeTasks: boolean;
  confirmationTimeout: number;
  defaultPriority: Priority;
  defaultTrigger: TaskTrigger;
  startupBehavior: 'resume_queue' | 'wait_for_user' | 'prompt_plan';
  notifications: {
    laptopOnline: boolean;
    kairoStarted: boolean;
    needsConfirmation: boolean;
    taskCompleted: boolean;
    taskFailed: boolean;
    taskSkipped: boolean;
    deadlines: boolean;
  };
}
