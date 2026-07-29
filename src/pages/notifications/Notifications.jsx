import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bell, CheckCheck, Trash2, AtSign, GitPullRequest,
  MessageSquare, Clock, FolderKanban, MailOpen, Inbox,
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/common/Button';
import { markAsRead, markAllAsRead, deleteNotification } from '../../redux/notificationSlice';
import { useToast } from '../../hooks/useToast';

const TYPE_CONFIG = {
  mention:      { icon: AtSign,        color: '#3B82F6', bg: '#EFF6FF', label: 'Mention'    },
  assignment:   { icon: GitPullRequest, color: '#8B5CF6', bg: '#F5F3FF', label: 'Assignment' },
  comment:      { icon: MessageSquare,  color: '#F59E0B', bg: '#FFFBEB', label: 'Comment'    },
  status_change:{ icon: GitPullRequest, color: '#10B981', bg: '#F0FDF4', label: 'Status'     },
  due_date:     { icon: Clock,          color: '#EF4444', bg: '#FEF2F2', label: 'Due Date'   },
  project:      { icon: FolderKanban,   color: '#06B6D4', bg: '#ECFEFF', label: 'Project'    },
};

const TABS = [
  { id: 'all',        label: 'All'         },
  { id: 'unread',     label: 'Unread'      },
  { id: 'mention',    label: 'Mentions'    },
  { id: 'assignment', label: 'Assignments' },
];

function formatTime(dateStr) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Just now';
  if (mins < 60)  return mins + 'm ago';
  if (hours < 24) return hours + 'h ago';
  return days + 'd ago';
}

function NotificationItem({ notification, onMarkRead, onDelete, delay }) {
  const cfg  = TYPE_CONFIG[notification.type] || TYPE_CONFIG.mention;
  const Icon = cfg.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, scale: 0.96 }}
      transition={{ delay, duration: 0.25 }}
      className="group relative flex gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-150"
      style={{
        background:  !notification.isRead ? '#F0F7FF' : '#FFFFFF',
        borderColor: !notification.isRead ? '#BFDBFE' : '#E2E8F0',
      }}
      onClick={() => !notification.isRead && onMarkRead(notification.id)}
    >
      {!notification.isRead && (
        <div
          className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
          style={{ background: cfg.color }}
        />
      )}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: cfg.bg }}
      >
        <Icon size={16} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-0.5">
          <div className="flex items-center gap-2 min-w-0">
            <p
              className="text-sm leading-snug truncate"
              style={{ fontWeight: notification.isRead ? 500 : 700, color: '#0F172A' }}
            >
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />
            )}
          </div>
          <span className="text-xs shrink-0" style={{ color: '#94A3B8' }}>
            {formatTime(notification.createdAt)}
          </span>
        </div>
        <p className="text-sm leading-snug" style={{ color: '#64748B' }}>
          {notification.description}
        </p>
        <span
          className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {cfg.label}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.isRead && (
          <button
            onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id); }}
            className="p-1.5 rounded-lg transition-colors hover:bg-blue-50"
            style={{ color: '#94A3B8' }}
            title="Mark as read"
          >
            <MailOpen size={13} />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
          className="p-1.5 rounded-lg transition-colors hover:bg-red-50 hover:text-red-500"
          style={{ color: '#94A3B8' }}
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Notifications() {
  const dispatch      = useDispatch();
  const { success }   = useToast();
  const notifications = useSelector((state) => state.notifications.list);
  const unreadCount   = useSelector((state) => state.notifications.unreadCount);
  const [activeTab, setActiveTab] = useState('all');

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all')    return true;
    if (activeTab === 'unread') return !n.isRead;
    return n.type === activeTab;
  });

  const handleMarkAll = () => {
    dispatch(markAllAsRead());
    success('All caught up!', 'All notifications marked as read.');
  };

  return (
    <PageTransition className="p-6 w-full max-w-[1700px] mx-auto">

      {/* Header — mirrors Projects page */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Notifications</h1>
          <p className="text-surface-500 text-sm mt-1">
            {unreadCount > 0
              ? unreadCount + ' unread notification' + (unreadCount > 1 ? 's' : '')
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" icon={<CheckCheck size={14} />} onClick={handleMarkAll}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* Toolbar — mirrors Projects filter/view bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-1 bg-surface-100 p-1 rounded-xl">
          {TABS.map((tab) => {
            const count = tab.id === 'all'    ? notifications.length
                        : tab.id === 'unread' ? unreadCount
                        : notifications.filter(n => n.type === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-surface-900 shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: activeTab === tab.id ? '#EFF6FF' : '#E2E8F0',
                      color:      activeTab === tab.id ? '#3B82F6' : '#94A3B8',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 px-6 text-center rounded-2xl border border-surface-100 bg-white"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#EFF6FF' }}
          >
            <Inbox size={26} style={{ color: '#3B82F6' }} />
          </div>
          <p className="font-semibold text-surface-700 text-base">
            {activeTab === 'unread' ? 'All caught up!' : 'No notifications'}
          </p>
          <p className="text-sm text-surface-400 mt-1">
            {activeTab === 'unread'
              ? "You've read everything — great job."
              : 'New activity will appear here as your team works.'}
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-2.5">
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
        </div>
      )}
    </PageTransition>
  );
}
