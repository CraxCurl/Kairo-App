import React from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Laptop, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Sparkles, 
  Trash2
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

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'laptop_online': return <Laptop className="w-4 h-4 text-emerald-400" />;
      case 'needs_confirmation': return <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />;
      case 'task_completed': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'task_failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'deadline_warning': return <Clock className="w-4 h-4 text-amber-400" />;
      default: return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full sm:h-auto sm:max-h-[85vh] bg-[#11121F] border-x sm:border border-purple-500/20 sm:rounded-3xl p-5 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-top-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Notifications</h3>
              <span className="text-[11px] text-slate-400">
                {unreadNotificationCount} unread alert{unreadNotificationCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-red-400 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5 overflow-y-auto py-3 pr-1 flex-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs space-y-2">
              <Bell className="w-8 h-8 mx-auto opacity-30" />
              <p>No notifications yet. You&apos;re all caught up!</p>
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
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  notif.read
                    ? 'bg-slate-900/40 border-white/5 opacity-70'
                    : 'bg-[#18192E]/90 border-purple-500/30 shadow-sm'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {getNotifIcon(notif.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white leading-snug">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {notif.body}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
