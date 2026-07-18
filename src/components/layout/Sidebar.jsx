import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Building2, FolderKanban, Kanban, CheckSquare,
  BarChart3, Bell, Settings, User, LogOut, ChevronLeft, Zap,
  ChevronRight, Plus
} from 'lucide-react';
import { toggleSidebar } from '../../redux/uiSlice';
import { logoutAsync } from '../../redux/authSlice';
import Avatar from '../common/Avatar';
import Tooltip from '../common/Tooltip';
import { useToast } from '../../hooks/useToast';

const NAV_SECTIONS = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Workspaces', path: '/workspaces', icon: Building2 },
      { label: 'Projects', path: '/projects', icon: FolderKanban },
    ],
  },
  {
    title: 'Work',
    items: [
      { label: 'Board', path: '/board', icon: Kanban },
      { label: 'Tasks', path: '/tasks', icon: CheckSquare },
      { label: 'Reports', path: '/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Notifications', path: '/notifications', icon: Bell, badge: true },
      { label: 'Settings', path: '/settings', icon: Settings },
      { label: 'Profile', path: '/profile', icon: User },
    ],
  },
];

function NavItem({ item, collapsed, unreadCount }) {
  const Icon = item.icon;
  const showBadge = item.badge && unreadCount > 0;

  return (
    <Tooltip content={collapsed ? item.label : null} placement="right">
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
        }
      >
        {({ isActive }) => (
          <>
            <div className="relative shrink-0">
              <Icon
                size={18}
                className={`sidebar-icon transition-colors ${isActive ? 'text-primary-600' : 'text-surface-400'}`}
              />
              {showBadge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger-500 rounded-full border border-white" />
              )}
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap text-sm"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {isActive && !collapsed && (
              <motion.div
                layoutId="active-indicator"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"
              />
            )}
          </>
        )}
      </NavLink>
    </Tooltip>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success } = useToast();
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const user = useSelector((state) => state.auth.user);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  const handleLogout = () => {
    dispatch(logoutAsync());
    success('Signed out', 'You have been successfully signed out.');
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 70 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full bg-white border-r border-surface-100 z-30 flex flex-col overflow-hidden shadow-sm"
    >
      {/* Logo */}
      <div className={`flex items-center h-[60px] border-b border-surface-100 shrink-0 ${collapsed ? 'justify-center px-4' : 'px-5'}`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
              >
                <span className="font-bold text-surface-900 text-lg tracking-tight">Sprint<span className="text-gradient">Flow</span></span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Create Button */}
      <div className={`px-3 py-3 shrink-0 ${collapsed ? 'flex justify-center' : ''}`}>
        <Tooltip content={collapsed ? 'New Task' : null} placement="right">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/projects')}
            className={`flex items-center gap-2 font-medium text-sm rounded-lg py-2 transition-all ${
              collapsed
                ? 'w-10 h-10 justify-center bg-primary-600 text-white hover:bg-primary-700'
                : 'w-full px-3 bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
            }`}
          >
            <Plus size={16} className="shrink-0" />
            {!collapsed && <span>New Task</span>}
          </motion.button>
        </Tooltip>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-5 scrollbar-none">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[10px] font-semibold text-surface-400 uppercase tracking-widest px-3 mb-1.5"
                >
                  {section.title}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem key={item.path} item={item} collapsed={collapsed} unreadCount={unreadCount} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className={`border-t border-surface-100 p-3 shrink-0 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-50 transition-colors group cursor-pointer">
            <Avatar name={user?.name || 'User'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-800 truncate">{user?.name}</p>
              <p className="text-xs text-surface-500 truncate">{user?.role}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="opacity-0 group-hover:opacity-100 p-1 rounded text-surface-400 hover:text-danger-500 transition-all"
            >
              <LogOut size={14} />
            </motion.button>
          </div>
        ) : (
          <Tooltip content="Logout" placement="right">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-2 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-50 transition-all"
            >
              <LogOut size={18} />
            </motion.button>
          </Tooltip>
        )}
      </div>

      {/* Collapse Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch(toggleSidebar())}
        className="absolute top-[60px] -right-3 w-6 h-6 bg-white border border-surface-200 rounded-full flex items-center justify-center shadow-sm text-surface-500 hover:text-primary-600 hover:border-primary-300 transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </motion.button>
    </motion.aside>
  );
}
