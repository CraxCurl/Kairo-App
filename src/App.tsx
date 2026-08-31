import React, { useState } from 'react';
import { KairoProvider } from './context/KairoContext';
import { DeviceFrameWrapper } from './components/common/DeviceFrameWrapper';
import { StatusBar } from './components/common/StatusBar';
import { Header } from './components/common/Header';
import { BottomNav, TabType } from './components/common/BottomNav';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { DashboardTab } from './components/dashboard/DashboardTab';
import { QueueTab } from './components/queue/QueueTab';
import { VoiceTab } from './components/voice/VoiceTab';
import { HistoryTab } from './components/history/HistoryTab';
import { SettingsTab } from './components/settings/SettingsTab';
import { CreateTaskModal } from './components/tasks/CreateTaskModal';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { Task } from './types';

export const KairoAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col relative bg-[#000000] text-[#EDEDED] font-sans">
      {/* Mobile Top Status Bar */}
      <StatusBar />

      {/* Main Header */}
      <Header
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenCreateTask={() => setIsCreateModalOpen(true)}
      />

      {/* Main Tab Content Viewport */}
      <main className="w-full flex-1 px-4 pt-3 overflow-y-auto overscroll-none">
        {currentTab === 'dashboard' && (
          <DashboardTab
            onSelectTab={setCurrentTab}
            onOpenCreateTask={() => setIsCreateModalOpen(true)}
          />
        )}

        {currentTab === 'queue' && (
          <QueueTab
            onOpenCreateTask={() => setIsCreateModalOpen(true)}
            onOpenEditTask={(task) => setSelectedTask(task)}
          />
        )}

        {currentTab === 'voice' && (
          <VoiceTab />
        )}

        {currentTab === 'history' && (
          <HistoryTab />
        )}

        {currentTab === 'settings' && (
          <SettingsTab />
        )}
      </main>

      {/* Bottom Navigation Dock */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCreateTask={() => setIsCreateModalOpen(true)}
      />

      {/* Execution Confirmation Modal Overlay */}
      <ConfirmationModal />

      {/* Create Task Modal (AI + Manual) */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Task Detail / Edit Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      {/* Push Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onNavigateToTask={() => {
          setCurrentTab('queue');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <KairoProvider>
      <DeviceFrameWrapper>
        <KairoAppContent />
      </DeviceFrameWrapper>
    </KairoProvider>
  );
}
