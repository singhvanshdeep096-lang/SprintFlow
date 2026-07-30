import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Building2, FolderKanban, Kanban, CheckSquare,
  BarChart3, Bell, Settings, User, LogOut, ChevronLeft, Zap,
  ChevronRight, Plus, ShieldCheck
} from 'lucide-react';
import { toggleSidebar } from '../../redux/uiSlice';
import { logoutAsync } from '../../redux/authSlice';
import Avatar from '../common/Avatar';
import Tooltip from '../common/Tooltip';
import { useToast } from '../../hooks/useToast';
import './Layout.css';

const ADMIN_NAV_SECTIONS = [
  {
    title: 'Administration',
    items: [
      { label: 'Admin Panel', path: '/admin', icon: ShieldCheck }
    ]
  },
  {
    title: 'Main',
    items: [
      { label: 'Dashboard',  path: '/dashboard',     icon: LayoutDashboard },
      { label: 'Workspaces', path: '/workspaces',    icon: Building2 },
      { label: 'Projects',   path: '/projects',      icon: FolderKanban },
    ],
  },
  {
    title: 'Work',
    items: [
      { label: 'Board',   path: '/board',   icon: Kanban },
      { label: 'Tasks',   path: '/tasks',   icon: CheckSquare },
      { label: 'Reports', path: '/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Notifications', path: '/notifications', icon: Bell,     badge: true },
      { label: 'Settings',      path: '/settings',      icon: Settings },
      { label: 'Profile',       path: '/profile',       icon: User },
    ],
  },
];

const USER_NAV_SECTIONS = [
  {
    title: 'Main',
    items: [
      { label: 'Projects', path: '/projects', icon: FolderKanban },
    ],
  },
  {
    title: 'Work',
    items: [
      { label: 'Board',   path: '/board',   icon: Kanban },
      { label: 'Tasks',   path: '/tasks',   icon: CheckSquare },
      { label: 'Reports', path: '/reports', icon: BarChart3 },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Notifications', path: '/notifications', icon: Bell,     badge: true },
      { label: 'Settings',      path: '/settings',      icon: Settings },
      { label: 'Profile',       path: '/profile',       icon: User },
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
            <div className="sidebar-nav-icon-wrap">
              <Icon
                size={18}
                style={{ color: isActive ? '#2563EB' : 'var(--color-surface-400)' }}
              />
              {showBadge && <span className="sidebar-nav-badge" />}
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden', whiteSpace: 'nowrap', fontSize: '0.875rem' }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {isActive && !collapsed && (
              <motion.div layoutId="active-indicator" className="sidebar-active-dot" />
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

  const isAdmin = user?.role?.toLowerCase() === 'admin' || user?.is_superuser === true;

  const sectionsToRender = isAdmin ? ADMIN_NAV_SECTIONS : USER_NAV_SECTIONS;

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
      className="sidebar"
    >
      {/* Logo */}
      <div className={`sidebar-logo-wrap ${collapsed ? 'sidebar-logo-wrap--collapsed' : 'sidebar-logo-wrap--expanded'}`}>
        <motion.div whileHover={{ scale: 1.05 }} className="sidebar-logo-btn" onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}>
          <div className="sidebar-logo-icon gradient-primary">
            <Zap size={16} style={{ color: '#ffffff' }} />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
              >
                <span className="sidebar-logo-text">
                  Sprint<span className="text-gradient">Flow</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Create button */}
      <div className={`sidebar-create-wrap ${collapsed ? 'sidebar-create-wrap--collapsed' : ''}`}>
        <Tooltip content={collapsed ? 'New Task' : null} placement="right">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/projects')}
            className={`sidebar-create-btn ${collapsed ? 'sidebar-create-btn--icon' : 'sidebar-create-btn--full'}`}
          >
            <Plus size={16} style={{ flexShrink: 0 }} />
            {!collapsed && <span>New Task</span>}
          </motion.button>
        </Tooltip>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {sectionsToRender.map((section) => (
          <div key={section.title} className="sidebar-nav-section">
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="sidebar-section-title"
                >
                  {section.title}
                </motion.span>
              )}
            </AnimatePresence>
            <div className="sidebar-nav-items">
              {section.items.map((item) => (
                <NavItem key={item.path} item={item} collapsed={collapsed} unreadCount={unreadCount} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className={`sidebar-footer ${collapsed ? 'sidebar-footer--collapsed' : ''}`}>
        {!collapsed ? (
          <div className="sidebar-user-row">
            <Avatar name={user?.name || 'User'} size="sm" />
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user?.name}</p>
              <p className="sidebar-user-role">{user?.role}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="sidebar-logout-btn"
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
              className="navbar-icon-btn"
              style={{ color: 'var(--color-surface-400)' }}
            >
              <LogOut size={18} />
            </motion.button>
          </Tooltip>
        )}
      </div>

      {/* Collapse toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch(toggleSidebar())}
        className="sidebar-collapse-btn"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </motion.button>
    </motion.aside>
  );
}
