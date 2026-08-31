import { Task, LaptopInfo, TimelineEvent, VoiceExchange, AppNotification, AppSettings } from '../types';

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Complete Java assignment',
    description: 'Implement Dijkstra shortest path algorithm with priority queues and verify against test cases in workspace.',
    priority: 'high',
    status: 'in_progress',
    trigger: 'today',
    scheduledTime: '09:15 AM',
    requiresConfirmation: true,
    estimatedDuration: 45,
    tags: ['Java', 'Algorithms', 'College'],
    dependencies: [],
    createdAt: '2026-08-31T09:00:00Z',
    progress: 68,
    position: 0,
    steps: [
      { id: 's1', title: 'Open VS Code and load Java environment', completed: true },
      { id: 's2', title: 'Implement Dijkstra graph traversal method', completed: true },
      { id: 's3', title: 'Run JUnit test suite for edge cases', completed: false, current: true },
      { id: 's4', title: 'Format code and push commit to GitHub repo', completed: false }
    ],
    executionLogs: [
      '[09:12:04] Initialized JDK 21 environment on Laptop',
      '[09:12:40] Opened c:/Projects/JavaAssignments/GraphProject',
      '[09:14:15] Synthesizing Dijkstra algorithm with Fibonnaci Heap',
      '[09:16:30] Ran 12 unit tests: 10 passed, 2 evaluating...'
    ]
  },
  {
    id: 'task-2',
    name: 'Solve 2 LeetCode problems',
    description: 'Daily interview prep: Solve Problem #23 (Merge k Sorted Lists) and Problem #42 (Trapping Rain Water).',
    priority: 'high',
    status: 'waiting',
    trigger: 'next_startup',
    requiresConfirmation: true,
    estimatedDuration: 30,
    tags: ['LeetCode', 'DSA', 'Interview'],
    dependencies: ['task-1'],
    createdAt: '2026-08-31T09:05:00Z',
    progress: 0,
    position: 1,
    steps: [
      { id: 'l1', title: 'Launch Chrome to LeetCode session', completed: false },
      { id: 'l2', title: 'Extract constraints and draft optimal approach', completed: false },
      { id: 'l3', title: 'Test edge cases and benchmark runtime', completed: false }
    ],
    executionLogs: []
  },
  {
    id: 'task-3',
    name: 'Review DBMS notes & normalization',
    description: 'Summarize 1NF to BCNF rules, indexing strategies, and ACID transaction guarantees for tomorrow quiz.',
    priority: 'medium',
    status: 'waiting',
    trigger: 'today',
    scheduledTime: '04:00 PM',
    requiresConfirmation: false,
    estimatedDuration: 40,
    tags: ['Study', 'DBMS', 'Notes'],
    dependencies: [],
    createdAt: '2026-08-31T09:10:00Z',
    progress: 0,
    position: 2,
    steps: [
      { id: 'db1', title: 'Open Notion workspace DBMS notes', completed: false },
      { id: 'db2', title: 'Generate high-yield flashcards', completed: false }
    ],
    executionLogs: []
  },
  {
    id: 'task-4',
    name: 'Submit assignment on University Portal',
    description: 'Upload exported ZIP bundle to student portal before 11:59 PM deadline.',
    priority: 'critical',
    status: 'waiting',
    trigger: 'after_task',
    afterTaskId: 'task-1',
    requiresConfirmation: true,
    estimatedDuration: 10,
    tags: ['Submission', 'Urgent'],
    dependencies: ['task-1'],
    createdAt: '2026-08-31T09:15:00Z',
    progress: 0,
    position: 3,
    steps: [
      { id: 'sub1', title: 'Zip project binaries and report PDF', completed: false },
      { id: 'sub2', title: 'Navigate to Canvas course portal', completed: false },
      { id: 'sub3', title: 'Wait for confirmation before final submit', completed: false }
    ],
    executionLogs: []
  },
  {
    id: 'task-5',
    name: 'Backup workspace & pull upstream changes',
    description: 'Run automated git fetch, stash local temp files, and sync configuration dots.',
    priority: 'low',
    status: 'completed',
    trigger: 'today',
    requiresConfirmation: false,
    estimatedDuration: 15,
    tags: ['DevOps', 'Maintenance'],
    dependencies: [],
    createdAt: '2026-08-31T08:30:00Z',
    completedAt: '2026-08-31T09:08:00Z',
    progress: 100,
    position: 4,
    steps: [
      { id: 'bk1', title: 'Sync dotfiles to private repo', completed: true },
      { id: 'bk2', title: 'Verify cloud backup snapshot', completed: true }
    ],
    executionLogs: [
      '[08:45:10] Cloud backup completed (1.4 GB synced)',
      '[09:08:00] All repository remotes up to date'
    ]
  }
];

export const initialLaptop: LaptopInfo = {
  online: true,
  deviceName: 'MacBook Pro M3 Max (Dev-Station)',
  ipAddress: '192.168.1.42:8420',
  os: 'macOS Sonoma 14.5',
  batteryLevel: 88,
  isCharging: true,
  cpuLoad: 24,
  ramUsage: 48,
  lastHeartbeat: 'Just now (1s ago)',
  activeApp: 'Visual Studio Code'
};

export const initialTimeline: TimelineEvent[] = [
  {
    id: 'tl-1',
    timestamp: '2026-08-31T09:10:00Z',
    timeFormatted: '09:10',
    type: 'startup',
    title: 'Laptop started & connected',
    description: 'Agent runtime initialized in background. Secure WS link established.'
  },
  {
    id: 'tl-2',
    timestamp: '2026-08-31T09:11:00Z',
    timeFormatted: '09:11',
    type: 'system',
    title: 'Kairo loaded 4 queued tasks',
    description: 'Assessed dependencies and verified trigger conditions.'
  },
  {
    id: 'tl-3',
    timestamp: '2026-08-31T09:12:00Z',
    timeFormatted: '09:12',
    type: 'confirmation_approved',
    title: 'User approved Java assignment',
    description: 'Remote permission granted via Mobile Companion.'
  },
  {
    id: 'tl-4',
    timestamp: '2026-08-31T09:13:00Z',
    timeFormatted: '09:13',
    type: 'app_launch',
    title: 'VS Code opened',
    description: 'Target workspace /Projects/JavaAssignments mounted with JDK 21.'
  },
  {
    id: 'tl-5',
    timestamp: '2026-08-31T09:18:00Z',
    timeFormatted: '09:18',
    type: 'task_start',
    title: 'Executing Dijkstra algorithm implementation',
    description: 'Running subagent coder on Graph.java and testing performance.'
  }
];

export const initialVoiceExchanges: VoiceExchange[] = [
  {
    id: 'vx-1',
    timestamp: '09:12 AM',
    userInput: "What's next?",
    kairoResponse: "Currently working on your Java assignment (68% complete). Up next is solving 2 LeetCode problems scheduled for next startup.",
    actionTaken: "Reported status"
  },
  {
    id: 'vx-2',
    timestamp: '09:05 AM',
    userInput: "Add finish my Java assignment to today.",
    kairoResponse: "Added 'Complete Java assignment' to today's queue with High priority and confirmation requirement.",
    actionTaken: "Created task-1"
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    timestamp: '09:10 AM',
    title: 'Laptop Came Online',
    body: 'Dev-Station is now online. Kairo agent is active and ready.',
    type: 'laptop_online',
    read: false
  },
  {
    id: 'notif-2',
    timestamp: '09:12 AM',
    title: 'Confirmation Requested',
    body: 'Kairo is waiting for your confirmation to execute "Open VS Code and run the Java project".',
    type: 'needs_confirmation',
    read: true,
    taskId: 'task-1'
  },
  {
    id: 'notif-3',
    timestamp: '08:45 AM',
    title: 'Task Completed',
    body: '"Backup workspace & pull upstream changes" finished successfully.',
    type: 'task_completed',
    read: true,
    taskId: 'task-5'
  }
];

export const initialSettings: AppSettings = {
  laptopName: 'MacBook Pro M3 Max (Dev-Station)',
  laptopIp: '192.168.1.42',
  laptopPort: 8420,
  authToken: 'kairo_live_jwt_7f8a9e2d_prod',
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
