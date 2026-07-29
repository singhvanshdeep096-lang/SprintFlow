import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import {
  FolderKanban, CheckSquare, CheckCircle2, Clock, AlertTriangle,
  Users, TrendingUp, ArrowUpRight, Plus, BarChart3, Calendar, Activity
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';
import reportService from '../../services/report.service';
import userService from '../../services/user.service';
import './Dashboard.css';

// ===== Stat Card =====
function StatCard({ label, value, icon: Icon, color, trend, delay = 0 }) {
  const colorMap = {
    blue:   { iconBg: 'icon-blue-bg',   iconColor: 'icon-blue-fg'   },
    green:  { iconBg: 'icon-green-bg',  iconColor: 'icon-green-fg'  },
    yellow: { iconBg: 'icon-yellow-bg', iconColor: 'icon-yellow-fg' },
    red:    { iconBg: 'icon-red-bg',    iconColor: 'icon-red-fg'    },
    purple: { iconBg: 'icon-purple-bg', iconColor: 'icon-purple-fg' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card stat-card-wrap"
    >
      <div className="stat-card-top">
        <div className={`stat-card-icon-wrap ${c.iconBg}`}>
          <Icon size={20} className={c.iconColor} />
        </div>
        {trend !== undefined && (
          <span className={`stat-card-trend ${trend >= 0 ? 'stat-card-trend--up' : 'stat-card-trend--down'}`}>
            <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="stat-card-body">
        <motion.p
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.1, type: 'spring', stiffness: 260 }}
          className="stat-card-value"
        >
          {(value || 0).toLocaleString()}
        </motion.p>
        <p className="stat-card-label">{label}</p>
      </div>
    </motion.div>
  );
}

// ===== Activity Item =====
function ActivityItem({ activity, members, delay }) {
  const member = members.find((m) => m.id === activity.userId);

  const actionColors = {
    moved: '#2563EB',
    completed: '#16A34A',
    created: '#9333EA',
    commented: '#CA8A04',
    started: '#2563EB',
    'created project': '#4F46E5',
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Just now';
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="dash-activity-row"
    >
      <Avatar name={member?.name || 'User'} size="md" color={member?.color} style={{ marginTop: 2, flexShrink: 0 }} />
      <div className="dash-activity-body">
        <p className="dash-activity-text">
          <span style={{ fontWeight: 700, color: '#0F172A' }}>{member?.name || 'User'}</span>{' '}
          <span style={{ fontWeight: 600, color: actionColors[activity.action] || '#475569' }}>{activity.action}</span>{' '}
          <span style={{ fontWeight: 600, color: '#1E293B' }}>{activity.target}</span>
          {activity.from && activity.to && (
            <span style={{ color: '#64748B' }}> from <span style={{ fontWeight: 600 }}>{activity.from}</span> to <span style={{ fontWeight: 600 }}>{activity.to}</span></span>
          )}
        </p>
        <p className="dash-activity-time">{formatTime(activity.createdAt)}</p>
      </div>
    </motion.div>
  );
}

// ===== Chart Placeholder =====
function ChartPlaceholder({ title, subtitle, chartData, height = 220 }) {
  const completion = chartData?.taskCompletion || [
    { month: 'Feb', completed: 42, created: 55 },
    { month: 'Mar', completed: 58, created: 62 },
    { month: 'Apr', completed: 73, created: 78 },
    { month: 'May', completed: 61, created: 70 },
    { month: 'Jun', completed: 85, created: 88 },
    { month: 'Jul', completed: 67, created: 72 },
  ];

  return (
    <div className="card dash-chart-card">
      <div className="dash-chart-header">
        <div>
          <h3 className="dash-chart-title">{title}</h3>
          {subtitle && <p className="dash-chart-subtitle">{subtitle}</p>}
        </div>
        <button className="dash-chart-link">
          View All
        </button>
      </div>

      <div className="dash-chart-canvas" style={{ height }}>
        {completion.map((d, i) => (
          <div key={i} className="dash-bar-col">
            <div className="dash-bar-stack" style={{ height: height - 40 }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.created / 100) * 70}%` }}
                transition={{ delay: i * 0.06 + 0.2, duration: 0.5, ease: 'easeOut' }}
                className="dash-bar-top"
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.completed / 100) * 70}%` }}
                transition={{ delay: i * 0.06 + 0.3, duration: 0.5, ease: 'easeOut' }}
                className="dash-bar-bottom"
              />
            </div>
            <span className="dash-bar-label">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== Project Mini Card =====
function ProjectMiniCard({ project, delay }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ x: 4 }}
      onClick={() => navigate(`/projects/${project.id}`)}
      className="dash-project-mini"
    >
      <div
        className="dash-project-mini-icon"
        style={{ backgroundColor: `${project.color || '#2563EB'}18` }}
      >
        {project.icon || '⚡'}
      </div>
      <div className="dash-project-mini-info">
        <p className="dash-project-mini-name">{project.name}</p>
        <div className="dash-project-mini-bar-row">
          <div className="progress-bar" style={{ flex: 1 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress || 0}%` }}
              transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
              className="progress-fill"
            />
          </div>
          <span className="dash-project-mini-percent">{project.progress || 0}%</span>
        </div>
      </div>
      <ArrowUpRight size={16} style={{ color: 'var(--color-surface-400)', flexShrink: 0 }} />
    </motion.div>
  );
}

// ===== Main Dashboard Component =====
export default function Dashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.projects.list);
  const tasks = useSelector((state) => state.tasks.list);

  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    teamMembers: 0,
    activeWorkspaces: 0,
    thisWeekCompleted: 0
  });

  const [chartData, setChartData] = useState({
    taskCompletion: [],
    priorityDistribution: []
  });

  const [members, setMembers] = useState([]);

  useEffect(() => {
    reportService.getDashboardStats().then((data) => setStats(data)).catch(() => { });
    reportService.getChartData().then((data) => setChartData(data)).catch(() => { });
    userService.getUsers().then((data) => setMembers(data)).catch(() => { });
  }, []);

  const recentProjects = projects.slice(0, 4);

  const mockActivities = [
    { id: 'act-1', userId: 'user-2', action: 'moved', target: '"Redesign dashboard"', from: 'Todo', to: 'In Progress', createdAt: new Date().toISOString() },
    { id: 'act-2', userId: 'user-3', action: 'completed', target: '"GraphQL schema design"', createdAt: new Date().toISOString() },
    { id: 'act-3', userId: 'user-1', action: 'created', target: '"Build notification system"', createdAt: new Date().toISOString() },
  ];

  return (
    <PageTransition className="dash-page">

      {/* Header Section */}
      <div className="dash-header">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="dash-header-title"
          >
            Good morning, {user?.name?.split(' ')[0] || 'User'} 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="dash-header-subtitle"
          >
            Here's what's happening across your workspaces today.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="dash-header-actions"
        >
          <Button variant="secondary" icon={<Calendar size={16} />} size="md">
            This Week
          </Button>
          <Button variant="primary" icon={<Plus size={16} />} size="md" onClick={() => navigate('/projects')}>
            New Project
          </Button>
        </motion.div>
      </div>

      {/* Stat Cards Row */}
      <div className="dash-stats-grid">
        <StatCard label="Total Projects" value={stats.totalProjects || projects.length} icon={FolderKanban} color="blue" trend={12} delay={0.05} />
        <StatCard label="Total Tasks" value={stats.totalTasks || tasks.length} icon={CheckSquare} color="purple" trend={8} delay={0.1} />
        <StatCard label="Completed" value={stats.completedTasks} icon={CheckCircle2} color="green" trend={24} delay={0.15} />
        <StatCard label="In Progress" value={stats.pendingTasks} icon={Clock} color="yellow" delay={0.2} />
        <StatCard label="Overdue" value={stats.overdueTasks} icon={AlertTriangle} color="red" delay={0.25} />
        <StatCard label="Team Members" value={stats.teamMembers || members.length} icon={Users} color="blue" trend={2} delay={0.3} />
      </div>

      {/* Main Charts & Priority Grid */}
      <div className="dash-two-col">

        {/* Chart Column */}
        <div>
          <ChartPlaceholder
            title="Task Completion"
            subtitle="Tasks completed vs created over time"
            chartData={chartData}
            height={220}
          />
        </div>

        {/* Priority Distribution Widget */}
        <div className="card dash-priority-card">
          <div>
            <h3 className="dash-chart-title" style={{ fontSize: '1.25rem' }}>Priority Distribution</h3>
            <p className="dash-chart-subtitle" style={{ marginBottom: 24 }}>Task workload breakdown</p>

            <div>
              {(chartData.priorityDistribution || []).map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i + 0.2 }}
                  className="dash-priority-item"
                >
                  <div className="dash-priority-row">
                    <div className="dash-priority-left">
                      <div className="dash-priority-dot" style={{ backgroundColor: item.color }} />
                      <span className="dash-priority-name">{item.name}</span>
                    </div>
                    <span className="dash-priority-val">{item.value}</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (item.value / 20) * 100)}%` }}
                      transition={{ delay: i * 0.08 + 0.3, duration: 0.6, ease: 'easeOut' }}
                      className="progress-fill"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="dash-priority-footer">
            <div className="dash-priority-footer-row">
              <span style={{ color: 'var(--color-surface-500)', fontWeight: 500 }}>This week's completion</span>
              <span style={{ fontWeight: 700, color: '#16A34A' }}>{stats.thisWeekCompleted || 18} tasks</span>
            </div>
          </div>
        </div>

      </div>

      {/* Activity & Sidebar Section */}
      <div className="dash-two-col">

        {/* Activity Feed Column */}
        <div className="card dash-activity-card">
          <div className="dash-activity-header">
            <div className="dash-activity-title-wrap">
              <Activity size={20} style={{ color: '#2563EB' }} />
              <h3 className="dash-chart-title" style={{ fontSize: '1.25rem' }}>Recent Activity</h3>
            </div>
            <button className="dash-chart-link">
              View all
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mockActivities.map((activity, i) => (
              <ActivityItem key={activity.id} activity={activity} members={members} delay={i * 0.05} />
            ))}
          </div>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="dash-sidebar-stack">

          {/* Active Projects Widget */}
          <div className="card p-6">
            <div className="dash-widget-header">
              <h3 className="dash-widget-title">Active Projects</h3>
              <button
                onClick={() => navigate('/projects')}
                className="dash-chart-link"
                style={{ fontSize: 13 }}
              >
                All projects
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentProjects.map((project, i) => (
                <ProjectMiniCard key={project.id} project={project} delay={i * 0.06} />
              ))}
            </div>
          </div>

          {/* Team Widget */}
          <div className="card p-6">
            <div className="dash-widget-header">
              <h3 className="dash-widget-title">Team Members</h3>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-surface-500)' }}>{members.length} members</span>
            </div>
            <div className="dash-team-avatars">
              {members.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05 + 0.1, type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.1 }}
                  style={{ cursor: 'pointer' }}
                >
                  <Avatar name={member.name} size="sm" color={member.color} badge badgeColor="#22C55E" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions Widget */}
          <div className="card p-6">
            <h3 className="dash-widget-title" style={{ marginBottom: 16 }}>Quick Actions</h3>
            <div className="dash-actions-stack">
              {[
                { label: 'Create a task', icon: CheckSquare, path: '/tasks',    iconColor: '#2563EB' },
                { label: 'New project',   icon: FolderKanban, path: '/projects', iconColor: '#9333EA' },
                { label: 'View reports',  icon: BarChart3,    path: '/reports',  iconColor: '#16A34A' },
              ].map(({ label, icon: Icon, path, iconColor }, i) => (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 4 }}
                  onClick={() => navigate(path)}
                  className="dash-action-btn"
                >
                  <div className="dash-action-icon">
                    <Icon size={16} style={{ color: iconColor }} />
                  </div>
                  <span className="dash-action-label">
                    {label}
                  </span>
                  <ArrowUpRight size={14} style={{ marginLeft: 'auto', color: 'var(--color-surface-400)' }} />
                </motion.button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </PageTransition>
  );
}
