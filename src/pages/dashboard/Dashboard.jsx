import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import {
  FolderKanban, CheckSquare, CheckCircle2, Clock, AlertTriangle,
  Users, TrendingUp, ArrowUpRight, Plus, BarChart3, Calendar, Activity
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge/Badge';
import { DASHBOARD_STATS, ACTIVITY, MEMBERS, CHART_DATA } from '../../constants/data';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../constants';
import { useNavigate } from 'react-router-dom';

// ===== Stat Card =====
function StatCard({ label, value, icon: Icon, color, trend, trendLabel, delay = 0 }) {
  const colorMap = {
    blue: { bg: 'stat-card-blue', iconBg: 'bg-primary-100', iconColor: 'text-primary-600' },
    green: { bg: 'stat-card-green', iconBg: 'bg-success-100', iconColor: 'text-success-600' },
    yellow: { bg: 'stat-card-yellow', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    red: { bg: 'stat-card-red', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
    purple: { bg: 'stat-card-purple', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`${c.bg} rounded-2xl p-5 border border-white/60 relative overflow-hidden`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${c.iconBg} rounded-xl p-2.5`}>
          <Icon size={20} className={c.iconColor} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.1, type: 'spring', stiffness: 300 }}
          className="text-3xl font-bold text-surface-900 mb-1"
        >
          {value.toLocaleString()}
        </motion.p>
        <p className="text-sm font-medium text-surface-600">{label}</p>
        {trendLabel && <p className="text-xs text-surface-400 mt-1">{trendLabel}</p>}
      </div>
    </motion.div>
  );
}

// ===== Activity Item =====
function ActivityItem({ activity, delay }) {
  const member = MEMBERS.find((m) => m.id === activity.userId);

  const actionColors = {
    moved: 'text-primary-600',
    completed: 'text-success-600',
    created: 'text-purple-600',
    commented: 'text-yellow-600',
    started: 'text-blue-600',
    'created project': 'text-indigo-600',
  };

  const formatTime = (dateStr) => {
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
      className="flex gap-3 py-3 border-b border-surface-50 last:border-0"
    >
      <Avatar name={member?.name || 'User'} size="sm" color={member?.color} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-surface-700 leading-snug">
          <span className="font-semibold text-surface-900">{member?.name}</span>{' '}
          <span className={actionColors[activity.action] || 'text-surface-600'}>{activity.action}</span>{' '}
          <span className="font-medium text-surface-800">{activity.target}</span>
          {activity.from && activity.to && (
            <span className="text-surface-500"> from <span className="font-medium">{activity.from}</span> to <span className="font-medium">{activity.to}</span></span>
          )}
        </p>
        <p className="text-xs text-surface-400 mt-0.5">{formatTime(activity.createdAt)}</p>
      </div>
    </motion.div>
  );
}

// ===== Chart Placeholder =====
function ChartPlaceholder({ title, subtitle, height = 160, children }) {
  return (
    <div className="card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-surface-900">{title}</h3>
          {subtitle && <p className="text-xs text-surface-400 mt-0.5">{subtitle}</p>}
        </div>
        <button className="text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors">View All</button>
      </div>
      {children || (
        <div className="chart-area rounded-xl flex items-end justify-around gap-1.5 px-2" style={{ height }}>
          {CHART_DATA.taskCompletion.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div className="w-full flex flex-col gap-0.5 justify-end" style={{ height: height - 24 }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.created / 100) * 70}%` }}
                  transition={{ delay: i * 0.06 + 0.2, duration: 0.5, ease: 'easeOut' }}
                  className="w-full rounded-t-sm"
                  style={{ background: 'rgba(37, 99, 235, 0.15)', minHeight: 4 }}
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.completed / 100) * 70}%` }}
                  transition={{ delay: i * 0.06 + 0.3, duration: 0.5, ease: 'easeOut' }}
                  className="w-full rounded-t-sm"
                  style={{ background: 'linear-gradient(180deg, #2563EB, #7C3AED)', minHeight: 4 }}
                />
              </div>
              <span className="text-[9px] text-surface-400 font-medium">{d.month}</span>
            </div>
          ))}
        </div>
      )}
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
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 cursor-pointer group transition-colors"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
        style={{ backgroundColor: `${project.color}15` }}
      >
        {project.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-surface-800 truncate">{project.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="progress-bar flex-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
              className="progress-fill"
            />
          </div>
          <span className="text-xs text-surface-500 shrink-0">{project.progress}%</span>
        </div>
      </div>
      <ArrowUpRight size={14} className="text-surface-300 group-hover:text-primary-500 transition-colors shrink-0" />
    </motion.div>
  );
}

// ===== Main Dashboard =====
export default function Dashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.projects.list);
  const tasks = useSelector((state) => state.tasks.list);

  const stats = DASHBOARD_STATS;

  const overdueTasks = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done');
  const recentProjects = projects.slice(0, 4);

  return (
    <PageTransition className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-surface-900"
          >
            Good morning, {user?.name?.split(' ')[0]} 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-surface-500 mt-1 text-sm"
          >
            Here's what's happening across your workspaces today.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2"
        >
          <Button variant="secondary" icon={<Calendar size={15} />} size="sm">
            This Week
          </Button>
          <Button variant="primary" icon={<Plus size={15} />} size="sm" onClick={() => navigate('/projects')}>
            New Project
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Projects" value={stats.totalProjects} icon={FolderKanban} color="blue" trend={12} trendLabel="vs last month" delay={0.05} />
        <StatCard label="Total Tasks" value={stats.totalTasks} icon={CheckSquare} color="purple" trend={8} trendLabel="vs last month" delay={0.1} />
        <StatCard label="Completed" value={stats.completedTasks} icon={CheckCircle2} color="green" trend={24} trendLabel="this month" delay={0.15} />
        <StatCard label="In Progress" value={stats.pendingTasks} icon={Clock} color="yellow" delay={0.2} />
        <StatCard label="Overdue" value={stats.overdueTasks} icon={AlertTriangle} color="red" delay={0.25} />
        <StatCard label="Team Members" value={stats.teamMembers} icon={Users} color="blue" trend={2} trendLabel="new this month" delay={0.3} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Chart */}
        <div className="xl:col-span-2">
          <ChartPlaceholder
            title="Task Completion"
            subtitle="Tasks completed vs created over time"
            height={180}
          />
        </div>

        {/* Priority Distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Priority Distribution</h3>
          <div className="space-y-3">
            {CHART_DATA.priorityDistribution.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.2 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-surface-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-surface-800">{item.value}</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / 120) * 100}%` }}
                    transition={{ delay: i * 0.08 + 0.3, duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-surface-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-surface-500">This week's completion</span>
              <span className="font-semibold text-success-600">{stats.thisWeekCompleted} tasks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-surface-400" />
              <h3 className="text-sm font-semibold text-surface-900">Recent Activity</h3>
            </div>
            <button className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">
              View all
            </button>
          </div>
          <div className="divide-y divide-surface-50">
            {ACTIVITY.map((activity, i) => (
              <ActivityItem key={activity.id} activity={activity} delay={i * 0.05} />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Projects Progress */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-surface-900">Active Projects</h3>
              <button onClick={() => navigate('/projects')} className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">
                All projects
              </button>
            </div>
            <div className="space-y-1">
              {recentProjects.map((project, i) => (
                <ProjectMiniCard key={project.id} project={project} delay={i * 0.06} />
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-surface-900">Team</h3>
              <span className="text-xs text-surface-400">{MEMBERS.length} members</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {MEMBERS.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05 + 0.1, type: 'spring', stiffness: 300 }}
                >
                  <Avatar name={member.name} size="md" color={member.color} badge badgeColor="#22C55E" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Create a task', icon: CheckSquare, path: '/tasks', color: 'text-primary-600' },
                { label: 'New project', icon: FolderKanban, path: '/projects', color: 'text-purple-600' },
                { label: 'View reports', icon: BarChart3, path: '/reports', color: 'text-success-600' },
              ].map(({ label, icon: Icon, path, color }, i) => (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 4 }}
                  onClick={() => navigate(path)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-surface-50 transition-colors text-left group"
                >
                  <Icon size={15} className={color} />
                  <span className="text-sm text-surface-700 group-hover:text-surface-900 transition-colors">{label}</span>
                  <ArrowUpRight size={12} className="ml-auto text-surface-300 group-hover:text-surface-500 transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
