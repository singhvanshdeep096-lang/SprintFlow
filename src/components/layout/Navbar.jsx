import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, Search, Plus, Sun, Moon, ChevronDown, User, Settings, LogOut, Menu, X } from 'lucide-react';
import Avatar from '../common/Avatar';
import Dropdown from '../common/Dropdown';
import { toggleTheme, toggleMobileSidebar } from '../../redux/uiSlice';
import { logoutAsync } from '../../redux/authSlice';
import { useToast } from '../../hooks/useToast';
import './Layout.css';

function ProfileMenu({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <div className="profile-menu">
      <div className="profile-menu-info">
        <p className="profile-menu-name">{user?.name}</p>
        <p className="profile-menu-email">{user?.email}</p>
      </div>
      {[
        { icon: User, label: 'View Profile', path: '/profile' },
        { icon: Settings, label: 'Settings', path: '/settings' },
      ].map(({ icon: Icon, label, path }) => (
        <a key={label} href={path} className="dropdown-item">
          <Icon size={15} style={{ color: 'var(--color-surface-400)' }} />
          {label}
        </a>
      ))}
      <hr className="profile-menu-divider" />
      <button onClick={onLogout} className="dropdown-item danger">
        <LogOut size={15} style={{ color: '#F87171' }} />
        Sign Out
      </button>
    </div>
  );
}

function NotificationPreview({ notifications, onViewAll }) {
  return (
    <div className="notif-panel dropdown-content">
      <div className="notif-panel-header">
        <h3 className="notif-panel-title">Notifications</h3>
        <button onClick={onViewAll} className="notif-panel-link">View all</button>
      </div>
      <div className="notif-panel-list">
        {notifications.slice(0, 4).map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`notif-item${!n.isRead ? ' notif-item--unread' : ''}`}
          >
            <div
              className="notif-avatar"
              style={{ backgroundColor: n.avatarColor || '#64748B' }}
            >
              {n.avatar}
            </div>
            <div className="notif-content">
              <p className="notif-title">{n.title}</p>
              <p className="notif-desc">{n.description}</p>
            </div>
            {!n.isRead && <div className="notif-dot" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const user = useSelector((state) => state.auth.user);
  const theme = useSelector((state) => state.ui.theme);
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const notifications = useSelector((state) => state.notifications.list);

  const handleLogout = () => {
    dispatch(logoutAsync());
    success('Signed out', 'You have been successfully signed out.');
    navigate('/login');
  };

  const handleThemeToggle = (e) => {
    if (!document.startViewTransition) { dispatch(toggleTheme()); return; }
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = Math.round(rect.left + rect.width / 2);
    const y = Math.round(rect.top + rect.height / 2);
    const transition = document.startViewTransition(() => dispatch(toggleTheme()));
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(200vmax at ${x}px ${y}px)`] },
        { duration: 1100, easing: 'cubic-bezier(0.45, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  };

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="navbar"
      style={{ left: collapsed ? '70px' : '256px' }}
    >
      {/* Mobile menu */}
      <button
        onClick={() => dispatch(toggleMobileSidebar())}
        className="navbar-mobile-menu"
      >
        <Menu size={20} />
      </button>

      {/* Search area */}
      <div className="navbar-search-area">
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="navbar-search-open"
            >
              <Search size={16} style={{ color: 'var(--color-surface-400)', flexShrink: 0 }} />
              <input
                type="text"
                autoFocus
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search tasks, projects, workspaces..."
              />
              <button onClick={() => { setSearchOpen(false); setSearchValue(''); }}>
                <X size={16} style={{ color: 'var(--color-surface-400)' }} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="search-trigger"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSearchOpen(true)}
              className="navbar-search-trigger"
            >
              <Search size={16} />
              <span className="navbar-search-text">Search...</span>
              <kbd className="navbar-kbd">⌘K</kbd>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="navbar-actions">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/projects')}
          className="navbar-create-btn"
        >
          <Plus size={15} />
          <span className="navbar-create-label">Create</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleThemeToggle}
          className="navbar-icon-btn"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </motion.button>

        {/* Notifications */}
        <Dropdown trigger={
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="navbar-icon-btn navbar-notif-wrap"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="navbar-notif-badge"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </motion.button>
        } align="right" width="auto">
          <NotificationPreview notifications={notifications} onViewAll={() => navigate('/notifications')} />
        </Dropdown>

        {/* Profile */}
        <Dropdown trigger={
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="navbar-profile-btn"
          >
            <Avatar name={user?.name || 'User'} size="sm" />
            <ChevronDown size={14} className="navbar-chevron" />
          </motion.button>
        } align="right" width="auto">
          <ProfileMenu user={user} onLogout={handleLogout} />
        </Dropdown>
      </div>
    </motion.header>
  );
}
