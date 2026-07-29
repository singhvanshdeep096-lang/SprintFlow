import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { TrendingUp, CheckCircle2, Clock, Users, ArrowUpRight, Target } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import reportService from '../../services/report.service';
import './Reports.css';

function MetricCard({ label, value, change, icon: Icon, color, delay }) {
  const isPositive = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card p-5"
    >
      <div className="metric-card-top">
        <div className={`metric-card-icon-box ${color}`}>
          <Icon size={18} style={{ color: 'currentColor' }} />
        </div>
        <span className={`metric-card-change ${isPositive ? 'metric-card-change--up' : 'metric-card-change--down'}`}>
          <TrendingUp size={11} className={!isPositive ? 'rotate-180' : ''} />
          {Math.abs(change)}%
        </span>
      </div>
      <motion.p
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, delay: delay + 0.1 }}
        className="metric-card-val"
      >
        {value}
      </motion.p>
      <p className="metric-card-lbl">{label}</p>
    </motion.div>
  );
}

function ChartBar({ data, index, maxVal }) {
  const height  = (data.completed / (maxVal || 100)) * 100;
  const height2 = (data.created   / (maxVal || 100)) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, flex: 1, width: '100%', height: 120 }}>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${height2}%` }}
          transition={{ delay: index * 0.07 + 0.2, duration: 0.5, ease: 'easeOut' }}
          style={{ flex: 1, borderRadius: '6px 6px 0 0', opacity: 0.3, background: '#2563EB', alignSelf: 'flex-end', minHeight: 4 }}
        />
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ delay: index * 0.07 + 0.3, duration: 0.5, ease: 'easeOut' }}
          style={{ flex: 1, borderRadius: '6px 6px 0 0', background: 'linear-gradient(180deg, #2563EB, #7C3AED)', alignSelf: 'flex-end', minHeight: 4 }}
        />
      </div>
      <span style={{ fontSize: 10, color: 'var(--color-surface-400)', fontWeight: 500 }}>{data.month}</span>
    </div>
  );
}

function ProgressRow({ name, progress, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="reports-progress-row"
    >
      <p className="reports-progress-name">{name}</p>
      <div className="progress-bar" style={{ flex: 1 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ delay: delay + 0.1, duration: 0.8, ease: 'easeOut' }}
          className="progress-fill"
        />
      </div>
      <span className="reports-progress-val">{progress}%</span>
    </motion.div>
  );
}

export default function Reports() {
  const projects = useSelector((state) => state.projects.list);
  const [stats, setStats] = useState({
    completedTasks: 0,
    totalProjects: 0,
    teamMembers: 0
  });

  const [chartData, setChartData] = useState({
    taskCompletion: [],
    projectProgress: [],
    priorityDistribution: []
  });

  useEffect(() => {
    reportService.getDashboardStats().then((data) => setStats(data)).catch(() => { });
    reportService.getChartData().then((data) => setChartData(data)).catch(() => { });
  }, []);

  const taskCompletion = chartData.taskCompletion.length > 0 ? chartData.taskCompletion : [
    { month: 'Feb', completed: 42, created: 55 },
    { month: 'Mar', completed: 58, created: 62 },
    { month: 'Apr', completed: 73, created: 78 },
    { month: 'May', completed: 61, created: 70 },
    { month: 'Jun', completed: 85, created: 88 },
    { month: 'Jul', completed: 67, created: 72 },
  ];

  const maxVal = Math.max(...taskCompletion.map((d) => d.created));
  const projectProgress = projects.length > 0 ? projects.map(p => ({ name: p.name, progress: p.progress || 0 })) : chartData.projectProgress;

  return (
    <PageTransition className="reports-page">
      <div className="reports-header">
        <div>
          <h1 className="reports-title">Reports & Analytics</h1>
          <p className="reports-subtitle">Insights for the last 6 months</p>
        </div>
        <div className="reports-updated-badge">
          <Clock size={12} />Last updated just now
        </div>
      </div>

      <div className="reports-metrics-grid">
        <MetricCard label="Tasks Completed" value={stats.completedTasks} change={24} icon={CheckCircle2} color="icon-green-bg icon-green-fg" delay={0.05} />
        <MetricCard label="Active Projects" value={stats.totalProjects || projects.length} change={12} icon={Target} color="icon-blue-bg icon-blue-fg" delay={0.1} />
        <MetricCard label="Team Velocity" value="8.4" change={-3} icon={TrendingUp} color="icon-yellow-bg icon-yellow-fg" delay={0.15} />
        <MetricCard label="Team Members" value={stats.teamMembers || 6} change={33} icon={Users} color="icon-purple-bg icon-purple-fg" delay={0.2} />
      </div>

      <div className="reports-charts-row">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5"
        >
          <div className="reports-chart-header">
            <div>
              <h3 className="setting-row-label">Task Completion</h3>
              <p className="setting-row-desc">Completed vs Created</p>
            </div>
            <div className="reports-chart-legend">
              <div className="reports-legend-item">
                <div className="reports-legend-box" style={{ background: '#2563EB', opacity: 0.3 }} />
                Created
              </div>
              <div className="reports-legend-item">
                <div className="reports-legend-box" style={{ background: 'linear-gradient(180deg, #2563EB, #7C3AED)' }} />
                Completed
              </div>
            </div>
          </div>
          <div className="reports-chart-bars">
            {taskCompletion.map((d, i) => (
              <ChartBar key={i} data={d} index={i} maxVal={maxVal} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-5"
        >
          <h3 className="setting-row-label" style={{ marginBottom: 20 }}>Priority Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(chartData.priorityDistribution || []).map((item, i) => (
              <div key={item.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 9999, backgroundColor: item.color }} />
                    <span style={{ fontWeight: 500, color: 'var(--color-surface-700)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-surface-800)' }}>{item.value} tasks</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / 20) * 100}%` }}
                    transition={{ delay: i * 0.08 + 0.3, duration: 0.7 }}
                    className="progress-fill"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-5"
      >
        <div className="reports-chart-header">
          <h3 className="setting-row-label">Project Progress</h3>
          <button className="dash-chart-link" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            View all <ArrowUpRight size={11} />
          </button>
        </div>
        <div className="reports-progress-stack">
          {(projectProgress || []).map((project, i) => (
            <ProgressRow key={project.name} name={project.name} progress={project.progress} delay={i * 0.06 + 0.1} />
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}
