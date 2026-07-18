import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, Search, Plus, Sun, Moon, ChevronDown, User, Settings, LogOut, Menu, X, Zap } from 'lucide-react';
import Avatar from '../common/Avatar';
import Dropdown from '../common/Dropdown';
import { toggleTheme, toggleMobileSidebar } from '../../redux/uiSlice';
import { logoutAsync } from '../../redux/authSlice';
import { useToast } from '../../hooks/useToast';

function ProfileMenu({ user, onLogout }) {
  return (
    <div className="py-2 w-56">
      {/* User Info */}
      <div className="px-4 pb-3 mb-1 border-b border-surface-100">
        <p className="text-sm font-semibold text-surface-900">{user?.name}</p>
        <p className="text-xs text-surface-500 truncate">{user?.email}</p>
      </div>
      {/* Menu Items */}
      {[
        { icon: User, label: 'View Profile', path: '/profile' },
        { icon: Settings, label: 'Settings', path: '/settings' },
      ].map(({ icon: Icon, label, path }) => (
        <a key={label} href={path} className="dropdown-item">
          <Icon size={15} className="text-surface-400" />
          {label}
        </a>
      ))}
      <div className="my-1 border-t border-surface-100" />
      <button onClick={onLogout} className="dropdown-item danger w-full text-left">
        <LogOut size={15} className="text-danger-400" />
        Sign Out
      </button>
    </div>
  );
}

function NotificationPreview({ notifications, onViewAll }) {
  return (
    <div className="w-80">
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100">
        <h3 className="text-sm font-semibold text-surface-900">Notifications</h3>
        <button onClick={onViewAll} className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">
          View all
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.slice(0, 4).map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`flex gap-3 px-4 py-3 hover:bg-surface-50 cursor-pointer border-b border-surface-50 transition-colors ${!n.isRead ? 'bg-primary-50/40' : ''}`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ backgroundColor: n.avatarColor || '#64748B' }}
            >
              {n.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-800 leading-snug">{n.title}</p>
              <p className="text-xs text-surface-500 mt-0.5 truncate">{n.description}</p>
            </div>
            {!n.isRead && (
              <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 shrink-0" />
            )}
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

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-surface-100 h-[60px] flex items-center px-5 gap-3"
      style={{ left: collapsed ? '70px' : '256px', transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      {/* Mobile Menu */}
      <button
        onClick={() => dispatch(toggleMobileSidebar())}
        className="md:hidden p-2 rounded-lg text-surface-500 hover:bg-surface-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Page Title / Breadcrumb placeholder */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {searchOpen ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 max-w-md"
            >
              <Search size={16} className="text-surface-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search tasks, projects, workspaces..."
                className="flex-1 bg-transparent outline-none text-sm text-surface-900 placeholder:text-surface-400"
              />
              <button onClick={() => { setSearchOpen(false); setSearchValue(''); }}>
                <X size={16} className="text-surface-400 hover:text-surface-600" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="search-trigger"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-surface-400 hover:text-surface-600 transition-colors"
            >
              <Search size={16} />
              <span className="text-sm hidden sm:block">Search...</span>
              <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] text-surface-400 bg-surface-100 border border-surface-200 rounded px-1.5 py-0.5 font-mono">
                ⌘K
              </kbd>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Create Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/projects')}
          className="hidden sm:flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={15} />
          <span className="hidden md:inline">Create</span>
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-surface-700 transition-colors"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </motion.button>

        {/* Notifications */}
        <Dropdown
          trigger={
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-surface-700 transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>
          }
          align="right"
          width="auto"
        >
          <NotificationPreview notifications={notifications} onViewAll={() => navigate('/notifications')} />
        </Dropdown>

        {/* Profile */}
        <Dropdown
          trigger={
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-surface-100 transition-colors"
            >
              <Avatar name={user?.name || 'User'} size="sm" />
              <ChevronDown size={14} className="text-surface-400 hidden sm:block" />
            </motion.button>
          }
          align="right"
          width="auto"
        >
          <ProfileMenu user={user} onLogout={handleLogout} />
        </Dropdown>
      </div>
    </motion.header>
  );
}
