import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, CheckCheck, Trash2, AtSign, GitPullRequest, MessageSquare, Clock, FolderKanban } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge/Badge';
import Tabs from '../../components/common/Tabs/Tabs';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import { markAsRead, markAllAsRead, deleteNotification } from '../../redux/notificationSlice';
import { useToast } from '../../hooks/useToast';

const TYPE_CONFIG = {
  mention: { icon: AtSign, color: 'text-primary-500', bg: 'bg-primary-100' },
  assignment: { icon: GitPullRequest, color: 'text-purple-500', bg: 'bg-purple-100' },
  comment: { icon: MessageSquare, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  status_change: { icon: GitPullRequest, color: 'text-success-500', bg: 'bg-success-100' },
  due_date: { icon: Clock, color: 'text-danger-500', bg: 'bg-danger-100' },
  project: { icon: FolderKanban, color: 'text-cyan-500', bg: 'bg-cyan-100' },
};

function NotificationItem({ notification, onMarkRead, onDelete, delay }) {
  const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.mention;
  const Icon = cfg.icon;

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ delay, duration: 0.25 }}
      className={`flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
        !notification.isRead
          ? 'bg-primary-50/60 border-primary-100 hover:bg-primary-50'
          : 'bg-white border-surface-100 hover:bg-surface-50'
      }`}
      onClick={() => !notification.isRead && onMarkRead(notification.id)}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
        <Icon size={16} className={cfg.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-semibold ${!notification.isRead ? 'text-surface-900' : 'text-surface-700'}`}>
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
            )}
          </div>
          <span className="text-xs text-surface-400 shrink-0">{formatTime(notification.createdAt)}</span>
        </div>
        <p className="text-sm text-surface-500 mt-0.5 leading-snug">{notification.description}</p>
      </div>

      {/* Delete */}
      <motion.button
        initial={{ opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-50 transition-all shrink-0 self-center"
      >
        <Trash2 size={13} />
      </motion.button>
    </motion.div>
  );
}

export default function Notifications() {
  const dispatch = useDispatch();
  const { success } = useToast();
  const notifications = useSelector((state) => state.notifications.list);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All', badge: notifications.length },
    { id: 'unread', label: 'Unread', badge: unreadCount },
    { id: 'mention', label: 'Mentions' },
    { id: 'assignment', label: 'Assignments' },
  ];

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.isRead;
    return n.type === activeTab;
  });

  const handleMarkAll = () => {
    dispatch(markAllAsRead());
    success('All caught up!', 'All notifications marked as read.');
  };

  return (
    <PageTransition className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Notifications</h1>
          <p className="text-surface-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" icon={<CheckCheck size={14} />} onClick={handleMarkAll}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-surface-100 px-5">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="line" />
        </div>

        <div className="p-4 space-y-2">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Bell size={28} />}
              title={activeTab === 'unread' ? 'All caught up!' : 'No notifications'}
              description={activeTab === 'unread'
                ? "You've read all your notifications."
                : "You'll see new notifications here."}
              size="sm"
            />
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((n, i) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  delay={i * 0.04}
                  onMarkRead={(id) => dispatch(markAsRead(id))}
                  onDelete={(id) => {
                    dispatch(deleteNotification(id));
                    success('Notification removed', '');
                  }}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
