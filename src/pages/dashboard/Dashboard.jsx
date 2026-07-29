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

// ===== Stat Card =====
function StatCard({ label, value, icon: Icon, color, trend, delay = 0 }) {
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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`${c.bg} rounded-[16px] border border-white/60 dark:border-surface-700/50 p-6 flex flex-col justify-between h-full shadow-card hover:shadow-panel transition-all`}
    >
      <div className="flex items-center justify-between">
        <div className={`${c.iconBg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
          <Icon size={20} className={c.iconColor} />
        </div>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-1 text-[13px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${trend >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400'
              }`}
          >
            <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="mt-6">
        <motion.p
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.1, type: 'spring', stiffness: 260 }}
          className="text-[36px] font-bold text-surface-900 leading-tight tracking-tight"
        >
          {(value || 0).toLocaleString()}
        </motion.p>
        <p className="text-[15px] font-medium text-surface-500 mt-2">{label}</p>
      </div>
    </motion.div>
  );
}

// ===== Activity Item =====
function ActivityItem({ activity, members, delay }) {
  const member = members.find((m) => m.id === activity.userId);

  const actionColors = {
    moved: 'text-primary-600 font-semibold',
    completed: 'text-success-600 font-semibold',
    created: 'text-purple-600 font-semibold',
    commented: 'text-yellow-600 font-semibold',
    started: 'text-blue-600 font-semibold',
    'created project': 'text-indigo-600 font-semibold',
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
      className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-50/80 transition-colors"
    >
      <Avatar name={member?.name || 'User'} size="md" color={member?.color} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-surface-700 leading-relaxed">
          <span className="font-bold text-surface-900">{member?.name || 'User'}</span>{' '}
          <span className={actionColors[activity.action] || 'text-surface-600'}>{activity.action}</span>{' '}
          <span className="font-semibold text-surface-800">{activity.target}</span>
          {activity.from && activity.to && (
            <span className="text-surface-500"> from <span className="font-semibold">{activity.from}</span> to <span className="font-semibold">{activity.to}</span></span>
          )}
        </p>
        <p className="text-[13px] text-surface-400 mt-1">{formatTime(activity.createdAt)}</p>
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
    <div className="card p-6 rounded-[16px] h-full flex flex-col justify-between shadow-card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[20px] font-bold text-surface-900">{title}</h3>
          {subtitle && <p className="text-[14px] text-surface-500 mt-1 font-medium">{subtitle}</p>}
        </div>
        <button className="text-[14px] text-primary-600 font-semibold hover:text-primary-700 transition-colors cursor-pointer">
          View All
        </button>
      </div>

      <div className="chart-area rounded-xl flex items-end justify-around gap-3 px-6 py-4 bg-surface-50/50" style={{ height }}>
        {completion.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <div className="w-full flex flex-col gap-1 justify-end" style={{ height: height - 40 }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.created / 100) * 70}%` }}
                transition={{ delay: i * 0.06 + 0.2, duration: 0.5, ease: 'easeOut' }}
                className="w-full rounded-t-md"
                style={{ background: 'rgba(37, 99, 235, 0.2)', minHeight: 6 }}
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.completed / 100) * 70}%` }}
                transition={{ delay: i * 0.06 + 0.3, duration: 0.5, ease: 'easeOut' }}
                className="w-full rounded-t-md shadow-xs"
                style={{ background: 'linear-gradient(180deg, #2563EB, #7C3AED)', minHeight: 6 }}
              />
            </div>
            <span className="text-[13px] text-surface-500 font-semibold">{d.month}</span>
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
      className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-surface-50 cursor-pointer group transition-all"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-xs"
        style={{ backgroundColor: `${project.color || '#2563EB'}18` }}
      >
        {project.icon || '⚡'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-surface-900 truncate">{project.name}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <div className="progress-bar flex-1 h-2 rounded-full overflow-hidden bg-surface-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress || 0}%` }}
              transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
              className="progress-fill h-full rounded-full bg-primary-600"
            />
          </div>
          <span className="text-[13px] font-semibold text-surface-500 shrink-0">{project.progress || 0}%</span>
        </div>
      </div>
      <ArrowUpRight size={16} className="text-surface-400 group-hover:text-primary-600 transition-colors shrink-0" />
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
    <PageTransition className="px-8 pt-8 pb-12 w-full max-w-[1600px] mx-auto space-y-8">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[36px] font-bold text-surface-900 leading-tight tracking-tight"
          >
            Good morning, {user?.name?.split(' ')[0] || 'User'} 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[15px] font-medium text-surface-500 mt-2"
          >
            Here's what's happening across your workspaces today.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-4 shrink-0"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard label="Total Projects" value={stats.totalProjects || projects.length} icon={FolderKanban} color="blue" trend={12} delay={0.05} />
        <StatCard label="Total Tasks" value={stats.totalTasks || tasks.length} icon={CheckSquare} color="purple" trend={8} delay={0.1} />
        <StatCard label="Completed" value={stats.completedTasks} icon={CheckCircle2} color="green" trend={24} delay={0.15} />
        <StatCard label="In Progress" value={stats.pendingTasks} icon={Clock} color="yellow" delay={0.2} />
        <StatCard label="Overdue" value={stats.overdueTasks} icon={AlertTriangle} color="red" delay={0.25} />
        <StatCard label="Team Members" value={stats.teamMembers || members.length} icon={Users} color="blue" trend={2} delay={0.3} />
      </div>

      {/* Main Charts & Priority Grid (70% / 30% Desktop Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-6">

        {/* Main Content Column (70%) */}
        <div className="lg:col-span-7">
          <ChartPlaceholder
            title="Task Completion"
            subtitle="Tasks completed vs created over time"
            chartData={chartData}
            height={220}
          />
        </div>

        {/* Priority Distribution Widget (30%) */}
        <div className="lg:col-span-3 card p-6 rounded-[16px] flex flex-col justify-between shadow-card">
          <div>
            <h3 className="text-[20px] font-bold text-surface-900 mb-1">Priority Distribution</h3>
            <p className="text-[13px] text-surface-500 mb-6">Task workload breakdown</p>

            <div className="space-y-4">
              {(chartData.priorityDistribution || []).map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i + 0.2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[14px] font-semibold text-surface-800">{item.name}</span>
                    </div>
                    <span className="text-[14px] font-bold text-surface-900">{item.value}</span>
                  </div>
                  <div className="progress-bar h-2 rounded-full overflow-hidden bg-surface-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (item.value / 20) * 100)}%` }}
                      transition={{ delay: i * 0.08 + 0.3, duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-surface-100">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-surface-500 font-medium">This week's completion</span>
              <span className="font-bold text-success-600">{stats.thisWeekCompleted || 18} tasks</span>
            </div>
          </div>
        </div>

      </div>

      {/* Activity & Sidebar Section (70% / 30% Desktop Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-6">

        {/* Activity Feed Column (70%) */}
        <div className="lg:col-span-7 card p-6 rounded-[16px] shadow-card">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-100">
            <div className="flex items-center gap-2.5">
              <Activity size={20} className="text-primary-600" />
              <h3 className="text-[20px] font-bold text-surface-900">Recent Activity</h3>
            </div>
            <button className="text-[14px] font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer">
              View all
            </button>
          </div>

          <div className="space-y-3">
            {mockActivities.map((activity, i) => (
              <ActivityItem key={activity.id} activity={activity} members={members} delay={i * 0.05} />
            ))}
          </div>
        </div>

        {/* Sidebar Widgets Column (30%) */}
        <div className="lg:col-span-3 space-y-6">

          {/* Active Projects Widget */}
          <div className="card p-6 rounded-[16px] shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-surface-900">Active Projects</h3>
              <button
                onClick={() => navigate('/projects')}
                className="text-[13px] font-semibold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
              >
                All projects
              </button>
            </div>
            <div className="space-y-2">
              {recentProjects.map((project, i) => (
                <ProjectMiniCard key={project.id} project={project} delay={i * 0.06} />
              ))}
            </div>
          </div>

          {/* Team Widget */}
          <div className="card p-6 rounded-[16px] shadow-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold text-surface-900">Team Members</h3>
              <span className="text-[13px] font-semibold text-surface-500">{members.length} members</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {members.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05 + 0.1, type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.1 }}
                  className="cursor-pointer"
                >
                  <Avatar name={member.name} size="md" color={member.color} badge badgeColor="#22C55E" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions Widget */}
          <div className="card p-6 rounded-[16px] shadow-card">
            <h3 className="text-[16px] font-bold text-surface-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
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
                  className="w-full flex items-center gap-3.5 p-3 rounded-xl hover:bg-surface-50 transition-all text-left group border border-surface-100 hover:border-surface-200 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center shrink-0">
                    <Icon size={16} className={color} />
                  </div>
                  <span className="text-[14px] font-semibold text-surface-800 group-hover:text-surface-900 transition-colors">
                    {label}
                  </span>
                  <ArrowUpRight size={14} className="ml-auto text-surface-400 group-hover:text-primary-600 transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </PageTransition>
  );
}
