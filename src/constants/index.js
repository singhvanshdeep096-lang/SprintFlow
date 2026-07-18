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
  urgent: { label: 'Urgent', color: '#EF4444', bg: '#FEF2F2', text: 'text-red-600' },
  high: { label: 'High', color: '#F97316', bg: '#FFF7ED', text: 'text-orange-600' },
  medium: { label: 'Medium', color: '#F59E0B', bg: '#FFFBEB', text: 'text-yellow-600' },
  low: { label: 'Low', color: '#22C55E', bg: '#F0FDF4', text: 'text-green-600' },
};

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  DONE: 'done',
};

export const STATUS_CONFIG = {
  todo: { label: 'To Do', color: '#64748B', bg: '#F1F5F9', dotColor: '#94A3B8' },
  in_progress: { label: 'In Progress', color: '#2563EB', bg: '#DBEAFE', dotColor: '#3B82F6' },
  review: { label: 'In Review', color: '#D97706', bg: '#FEF3C7', dotColor: '#F59E0B' },
  done: { label: 'Done', color: '#16A34A', bg: '#DCFCE7', dotColor: '#22C55E' },
};

export const PROJECT_STATUS = {
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

export const PROJECT_STATUS_CONFIG = {
  active: { label: 'Active', color: '#16A34A', bg: '#DCFCE7' },
  on_hold: { label: 'On Hold', color: '#D97706', bg: '#FEF3C7' },
  completed: { label: 'Completed', color: '#2563EB', bg: '#DBEAFE' },
  archived: { label: 'Archived', color: '#64748B', bg: '#F1F5F9' },
};

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Workspaces', path: '/workspaces', icon: 'Building2' },
  { label: 'Projects', path: '/projects', icon: 'FolderKanban' },
  { label: 'Board', path: '/board', icon: 'Kanban' },
  { label: 'Tasks', path: '/tasks', icon: 'CheckSquare' },
  { label: 'Reports', path: '/reports', icon: 'BarChart3' },
  { label: 'Notifications', path: '/notifications', icon: 'Bell' },
];

export const SETTINGS_TABS = ['General', 'Appearance', 'Notifications', 'Security', 'Workspace'];

export const KANBAN_COLUMNS = [
  { id: 'todo', title: 'To Do', status: 'todo', color: '#94A3B8' },
  { id: 'in_progress', title: 'In Progress', status: 'in_progress', color: '#3B82F6' },
  { id: 'review', title: 'In Review', status: 'review', color: '#F59E0B' },
  { id: 'done', title: 'Done', status: 'done', color: '#22C55E' },
];
