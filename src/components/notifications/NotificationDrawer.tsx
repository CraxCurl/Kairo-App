import React from 'react';
import { 
  X, 
  Trash2,
  Bell
} from 'lucide-react';
import { useKairo } from '../../context/KairoContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTask?: (taskId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ 
  isOpen, 
  onClose,
  onNavigateToTask 
}) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications, 
    unreadNotificationCount 
  } = useKairo();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-md h-full sm:h-auto sm:max-h-[80vh] bg-[#0A0A0A] border-x sm:border border-[#282828] sm:rounded-2xl p-4 shadow-vercel-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A] shrink-0 font-mono">
          <div>
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">
              Notification Feed
            </h3>
            <span className="text-[10px] text-[#666666]">
              {unreadNotificationCount} unread
            </span>
          </div>

          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="p-1 rounded-lg bg-[#111111] text-[#666666] hover:text-[#FF4444] border border-[#222222]"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-[#111111] text-[#888888] hover:text-white border border-[#222222]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2 overflow-y-auto py-3 pr-1 flex-1 font-mono text-xs">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-[#555555] space-y-1">
              <Bell className="w-6 h-6 mx-auto opacity-40" />
              <p className="text-xs">No pending alerts.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.taskId && onNavigateToTask) {
                    onNavigateToTask(notif.taskId);
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1 ${
                  notif.read
                    ? 'bg-[#080808] border-[#1A1A1A] opacity-60'
                    : 'bg-[#111111] border-[#2A2A2A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white font-sans">
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-[#666666]">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-[#888888] leading-snug">
                  {notif.body}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
