import { Task, LaptopInfo, TimelineEvent, VoiceExchange, AppNotification, AppSettings } from '../types';

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    name: 'Finish Java OOP Assignment & Unit Tests',
    description: 'Implement polymorphous shapes, interface abstractions, and run test suites on desktop.',
    priority: 'critical',
    status: 'in_progress',
    trigger: 'next_startup',
    requiresConfirmation: true,
    estimatedDuration: 45,
    tags: ['Java', 'Academic', 'VSCode'],
    dependencies: [],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    progress: 35,
    position: 0,
    steps: [
      { id: 's1', title: 'Initialize Gradle workspace and check JDK 21', completed: true, current: false },
      { id: 's2', title: 'Compile ShapeHierarchy.java & AbstractFactory.java', completed: true, current: false },
      { id: 's3', title: 'Run JUnit 5 assertions & verify output coverage', completed: false, current: true },
      { id: 's4', title: 'Commit repository changes & generate submission ZIP', completed: false, current: false }
    ],
    executionLogs: [
      `[${new Date(Date.now() - 1800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] Task dispatched to desktop agent`,
      `[${new Date(Date.now() - 1200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] JDK 21.0.2 detected on host node`,
      `[${new Date(Date.now() - 600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] Gradle build SUCCESSFUL in 4s`,
      `[${new Date(Date.now() - 100000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] Executing TestSuiteRunner... 8/12 passing`
    ]
  },
  {
    id: 'task-2',
    name: 'Solve 2 LeetCode Array Problems',
    description: 'Solve Two Sum II and Container With Most Water on LeetCode desktop environment.',
    priority: 'high',
    status: 'waiting',
    trigger: 'today',
    requiresConfirmation: false,
    estimatedDuration: 30,
    tags: ['LeetCode', 'DSA', 'Algorithms'],
    dependencies: ['task-1'],
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    progress: 0,
    position: 1,
    steps: [
      { id: 's2-1', title: 'Open Chrome & navigate to LeetCode workspace', completed: false },
      { id: 's2-2', title: 'Write two-pointer O(N) solution for Two Sum II', completed: false },
      { id: 's2-3', title: 'Submit solution & verify test cases pass', completed: false }
    ],
    executionLogs: []
  },
  {
    id: 'task-3',
    name: 'Spin up Docker Dev Cluster & Run Migrations',
    description: 'Launch PostgreSQL & Redis services via docker-compose and execute Prisma migrations.',
    priority: 'medium',
    status: 'waiting',
    trigger: 'next_startup',
    requiresConfirmation: true,
    estimatedDuration: 20,
    tags: ['Docker', 'Database', 'DevOps'],
    dependencies: [],
    createdAt: new Date(Date.now() - 900000).toISOString(),
    progress: 0,
    position: 2,
    steps: [
      { id: 's3-1', title: 'Verify Docker Daemon active', completed: false },
      { id: 's3-2', title: 'Execute docker-compose up -d postgres redis', completed: false },
      { id: 's3-3', title: 'Run npx prisma db push', completed: false }
    ],
    executionLogs: []
  },
  {
    id: 'task-4',
    name: 'DBMS Normalization & B+ Tree Notes Review',
    description: 'Read Chapter 4 on 3NF, BCNF and indexing strategies for DBMS midterm.',
    priority: 'low',
    status: 'completed',
    trigger: 'today',
    completedAt: new Date(Date.now() - 7200000).toISOString(),
    requiresConfirmation: false,
    estimatedDuration: 40,
    tags: ['DBMS', 'Study', 'Notes'],
    dependencies: [],
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    progress: 100,
    position: 3,
    steps: [
      { id: 's4-1', title: 'Open Obsidian DBMS vault', completed: true },
      { id: 's4-2', title: 'Summarize 3NF vs BCNF functional dependencies', completed: true }
    ],
    executionLogs: [
      `[${new Date(Date.now() - 7200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] Task marked resolved`
    ]
  }
];

export const initialLaptop: LaptopInfo = {
  online: true,
  deviceName: 'Desktop Agent Node',
  ipAddress: '192.168.1.42:8420',
  os: 'macOS / Linux / Windows',
  batteryLevel: 92,
  isCharging: true,
  cpuLoad: 24,
  ramUsage: 42,
  lastHeartbeat: 'Connected',
  activeApp: 'VS Code - ShapeHierarchy.java'
};

export const initialTimeline: TimelineEvent[] = [
  {
    id: 'tl-1',
    timestamp: new Date().toISOString(),
    timeFormatted: 'Just now',
    type: 'task_start',
    title: 'Started "Finish Java OOP Assignment"',
    description: 'Worker thread #1 spawned on desktop node.',
    taskId: 'task-1'
  },
  {
    id: 'tl-init',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    timeFormatted: '1h ago',
    type: 'startup',
    title: 'Agent node linked',
    description: 'Secure companion tunnel active.'
  }
];

export const initialVoiceExchanges: VoiceExchange[] = [
  {
    id: 'vx-1',
    timestamp: '10:42 AM',
    userInput: "What's next in my queue?",
    kairoResponse: 'Currently executing "Finish Java OOP Assignment". Up next: "Solve 2 LeetCode Array Problems".',
    actionTaken: 'Queried active pipeline'
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    timestamp: '10:40 AM',
    title: 'Task Execution Active',
    body: 'Kairo started executing "Finish Java OOP Assignment & Unit Tests" on your desktop node.',
    type: 'kairo_started',
    read: false,
    taskId: 'task-1'
  }
];

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
