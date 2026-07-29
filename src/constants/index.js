export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  WORKSPACES: '/workspaces',
  WORKSPACE_DETAIL: '/workspaces/:id',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  BOARD: '/projects/:id/board',
  TASK_DETAIL: '/tasks/:id',
  NOTIFICATIONS: '/notifications',
  REPORTS: '/reports',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '*',
};

export const PRIORITY_LEVELS = {
  URGENT: 'urgent',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

export const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', text: 'text-red-600' },
  high:   { label: 'High',   color: '#F97316', bg: 'rgba(249, 115, 22, 0.12)', text: 'text-orange-600' },
  medium: { label: 'Medium', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', text: 'text-yellow-600' },
  low:    { label: 'Low',    color: '#22C55E', bg: 'rgba(34, 197, 94, 0.12)', text: 'text-green-600' },
};

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  QA: 'qa',
  DONE: 'done',
};

export const STATUS_CONFIG = {
  todo:        { label: 'To Do',        color: '#94A3B8', bg: 'rgba(148, 163, 184, 0.12)', dotColor: '#94A3B8' },
  in_progress: { label: 'In Progress',  color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)',  dotColor: '#3B82F6' },
  review:      { label: 'In Review',    color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)',  dotColor: '#F59E0B' },
  qa:          { label: 'QA & Testing', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)',  dotColor: '#8B5CF6' },
  done:        { label: 'Done',         color: '#22C55E', bg: 'rgba(34, 197, 94, 0.12)',   dotColor: '#22C55E' },
};

export const PROJECT_STATUS = {
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

export const PROJECT_STATUS_CONFIG = {
  active:    { label: 'Active',    color: '#16A34A', bg: '#DCFCE7' },
  on_hold:   { label: 'On Hold',   color: '#D97706', bg: '#FEF3C7' },
  completed: { label: 'Completed', color: '#2563EB', bg: '#DBEAFE' },
  archived:  { label: 'Archived',  color: '#64748B', bg: '#F1F5F9' },
};

export const NAV_ITEMS = [
  { label: 'Dashboard',     path: '/dashboard',     icon: 'LayoutDashboard' },
  { label: 'Workspaces',    path: '/workspaces',    icon: 'Building2' },
  { label: 'Projects',      path: '/projects',      icon: 'FolderKanban' },
  { label: 'Board',         path: '/board',         icon: 'Kanban' },
  { label: 'Tasks',         path: '/tasks',         icon: 'CheckSquare' },
  { label: 'Reports',       path: '/reports',       icon: 'BarChart3' },
  { label: 'Notifications', path: '/notifications', icon: 'Bell' },
];

export const SETTINGS_TABS = ['General', 'Appearance', 'Notifications', 'Security', 'Workspace'];

export const KANBAN_COLUMNS = [
  { id: 'todo',        title: 'TO DO',        status: 'todo',        color: '#94A3B8' },
  { id: 'in_progress', title: 'IN PROGRESS',  status: 'in_progress', color: '#3B82F6' },
  { id: 'review',      title: 'IN REVIEW',    status: 'review',      color: '#F59E0B' },
  { id: 'qa',          title: 'QA & TESTING', status: 'qa',          color: '#8B5CF6' },
  { id: 'done',        title: 'DONE',         color: '#22C55E', status: 'done' },
];
