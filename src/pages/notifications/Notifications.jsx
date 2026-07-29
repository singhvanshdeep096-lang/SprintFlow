import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, CheckCheck, Trash2, AtSign, GitPullRequest, MessageSquare, Clock, FolderKanban, MailOpen, Inbox } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/common/Button';
import { markAsRead, markAllAsRead, deleteNotification } from '../../redux/notificationSlice';
import { useToast } from '../../hooks/useToast';
import './Notifications.css';

const TYPE_CONFIG = {
  mention:       { icon: AtSign,         color: '#3B82F6', bgLight: 'rgba(59, 130, 246, 0.12)',  label: 'Mention'    },
  assignment:    { icon: GitPullRequest,  color: '#8B5CF6', bgLight: 'rgba(139, 92, 246, 0.12)', label: 'Assignment' },
  comment:       { icon: MessageSquare,   color: '#F59E0B', bgLight: 'rgba(245, 158, 11, 0.12)', label: 'Comment'    },
  status_change: { icon: GitPullRequest,  color: '#10B981', bgLight: 'rgba(16, 185, 129, 0.12)', label: 'Status'     },
  due_date:      { icon: Clock,           color: '#EF4444', bgLight: 'rgba(239, 68, 68, 0.12)',  label: 'Due Date'   },
  project:       { icon: FolderKanban,    color: '#06B6D4', bgLight: 'rgba(6, 182, 212, 0.12)',  label: 'Project'    },
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
      className={`notif-row ${!notification.isRead ? 'notif-row--unread' : ''}`}
      onClick={() => !notification.isRead && onMarkRead(notification.id)}
    >
      {!notification.isRead && (
        <div className="notif-row-stripe" style={{ backgroundColor: cfg.color }} />
      )}

      <div className="notif-type-icon" style={{ backgroundColor: cfg.bgLight }}>
        <Icon size={16} style={{ color: cfg.color }} />
      </div>

      <div className="notif-row-body">
        <div className="notif-row-top">
          <div className="notif-row-title-wrap">
            <p className="notif-row-title">
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className="notif-row-unread-dot" style={{ backgroundColor: cfg.color }} />
            )}
          </div>
          <span className="notif-row-time">{formatTime(notification.createdAt)}</span>
        </div>
        <p className="notif-row-desc">{notification.description}</p>
        <span
          className="notif-type-badge"
          style={{ backgroundColor: cfg.bgLight, color: cfg.color }}
        >
          {cfg.label}
        </span>
      </div>

      <div className="notif-row-actions">
        {!notification.isRead && (
          <button
            onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id); }}
            className="notif-action-btn"
            title="Mark as read"
          >
            <MailOpen size={13} />
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
          className="notif-action-btn danger"
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
    <PageTransition className="notif-page">

      {/* Header */}
      <div className="notif-page-header">
        <div>
          <h1 className="notif-page-title">Notifications</h1>
          <p className="notif-page-subtitle">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" icon={<CheckCheck size={14} />} onClick={handleMarkAll}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter bar */}
      <div className="notif-filter-bar">
        <div className="notif-filter-group">
          {TABS.map((tab) => {
            const count = tab.id === 'all'    ? notifications.length
                        : tab.id === 'unread' ? unreadCount
                        : notifications.filter((n) => n.type === tab.id).length;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`notif-filter-btn${isActive ? ' active' : ''}`}
              >
                {tab.label}
                {count > 0 && (
                  <span className="notif-filter-count">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="notif-empty"
        >
          <div className="notif-empty-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
            <Inbox size={26} style={{ color: '#3B82F6' }} />
          </div>
          <p className="notif-empty-title">
            {activeTab === 'unread' ? 'All caught up!' : 'No notifications'}
          </p>
          <p className="notif-empty-desc">
            {activeTab === 'unread'
              ? "You've read everything — great job."
              : 'New activity will appear here as your team works.'}
          </p>
        </motion.div>
      ) : (
        <div className="notif-list">
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
