import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertTriangle, Users, ArrowUpRight, Target } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import { CHART_DATA, DASHBOARD_STATS } from '../../constants/data';

function MetricCard({ label, value, change, icon: Icon, color, delay }) {
  const isPositive = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon size={18} className="text-current" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
          <TrendingUp size={11} className={!isPositive ? 'rotate-180' : ''} />
          {Math.abs(change)}%
        </span>
      </div>
      <motion.p
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, delay: delay + 0.1 }}
        className="text-2xl font-bold text-surface-900 mb-0.5"
      >
        {value}
      </motion.p>
      <p className="text-xs font-medium text-surface-500">{label}</p>
    </motion.div>
  );
}

function ChartBar({ data, index, maxVal }) {
  const height = (data.completed / maxVal) * 100;
  const height2 = (data.created / maxVal) * 100;

  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className="flex items-end gap-0.5 flex-1 w-full" style={{ height: 120 }}>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${height2}%` }}
          transition={{ delay: index * 0.07 + 0.2, duration: 0.5, ease: 'easeOut' }}
          className="flex-1 rounded-t-md opacity-30"
          style={{ background: '#2563EB', alignSelf: 'flex-end', minHeight: 4 }}
        />
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ delay: index * 0.07 + 0.3, duration: 0.5, ease: 'easeOut' }}
          className="flex-1 rounded-t-md"
          style={{ background: 'linear-gradient(180deg, #2563EB, #7C3AED)', alignSelf: 'flex-end', minHeight: 4 }}
        />
      </div>
      <span className="text-[10px] text-surface-400 font-medium">{data.month}</span>
    </div>
  );
}

function ProgressRow({ name, progress, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3"
    >
      <p className="text-sm text-surface-700 w-40 shrink-0 truncate">{name}</p>
      <div className="flex-1 progress-bar">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ delay: delay + 0.1, duration: 0.8, ease: 'easeOut' }}
          className="progress-fill"
        />
      </div>
      <span className="text-sm font-semibold text-surface-700 w-10 text-right shrink-0">{progress}%</span>
    </motion.div>
  );
}

export default function Reports() {
  const projects = useSelector((state) => state.projects.list);
  const stats = DASHBOARD_STATS;
  const maxVal = Math.max(...CHART_DATA.taskCompletion.map((d) => d.created));

  return (
    <PageTransition className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Reports & Analytics</h1>
          <p className="text-surface-500 text-sm mt-1">Insights for the last 6 months</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-surface-500 bg-surface-100 px-3 py-1.5 rounded-lg">
          <Clock size={12} />Last updated just now
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Tasks Completed" value={stats.completedTasks} change={24} icon={CheckCircle2} color="bg-success-100 text-success-600" delay={0.05} />
        <MetricCard label="Active Projects" value={stats.totalProjects} change={12} icon={Target} color="bg-primary-100 text-primary-600" delay={0.1} />
        <MetricCard label="Team Velocity" value="8.4" change={-3} icon={TrendingUp} color="bg-warning-100 text-yellow-600" delay={0.15} />
        <MetricCard label="Team Members" value={stats.teamMembers} change={33} icon={Users} color="bg-purple-100 text-purple-600" delay={0.2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Task Completion Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-surface-900">Task Completion</h3>
              <p className="text-xs text-surface-400 mt-0.5">Completed vs Created</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-surface-500">
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm opacity-30" style={{ background: '#2563EB' }} />Created</div>
              <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'linear-gradient(180deg, #2563EB, #7C3AED)' }} />Completed</div>
            </div>
          </div>
          <div className="flex items-end gap-2 h-36">
            {CHART_DATA.taskCompletion.map((d, i) => (
              <ChartBar key={i} data={d} index={i} maxVal={maxVal} />
            ))}
          </div>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-5"
        >
          <h3 className="text-sm font-semibold text-surface-900 mb-5">Priority Distribution</h3>
          <div className="space-y-4">
            {CHART_DATA.priorityDistribution.map((item, i) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-surface-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-surface-800">{item.value} tasks</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / 120) * 100}%` }}
                    transition={{ delay: i * 0.08 + 0.3, duration: 0.7 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Project Progress */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-surface-900">Project Progress</h3>
          <button className="text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors flex items-center gap-1">
            View all <ArrowUpRight size={11} />
          </button>
        </div>
        <div className="space-y-4">
          {CHART_DATA.projectProgress.map((project, i) => (
            <ProgressRow key={project.name} name={project.name} progress={project.progress} delay={i * 0.06 + 0.1} />
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}
