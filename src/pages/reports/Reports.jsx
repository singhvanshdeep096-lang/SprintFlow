import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { TrendingUp, CheckCircle2, Clock, Users, ArrowUpRight, Target } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import reportService from '../../services/report.service';
import './Reports.css';

function MetricCard({ label, value, change, icon: Icon, colorTheme, delay }) {
  const isPositive = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`reports-metric-card ${colorTheme}`}
    >
      <div className="metric-card-top">
        <div className="metric-icon-box">
          <Icon size={20} />
        </div>
        <span className={`metric-badge ${isPositive ? 'metric-badge--up' : 'metric-badge--down'}`}>
          <TrendingUp size={12} className={!isPositive ? 'rotate-180' : ''} />
          {isPositive ? `+${change}%` : `${change}%`}
        </span>
      </div>
      <div className="metric-card-body">
        <motion.span
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: delay + 0.08 }}
          className="metric-card-value"
        >
          {value}
        </motion.span>
        <span className="metric-card-label">{label}</span>
      </div>
    </motion.div>
  );
}

function ChartBar({ data, index, maxVal }) {
  const [hovered, setHovered] = useState(false);
  const completedHeight = Math.max(6, Math.round((data.completed / (maxVal || 100)) * 100));
  const createdHeight   = Math.max(6, Math.round((data.created   / (maxVal || 100)) * 100));

  return (
    <div
      className="chart-column-group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="chart-bars-wrapper">
        {hovered && (
          <div className="chart-popover-tooltip">
            <div className="tooltip-title">{data.month} Stats</div>
            <div className="tooltip-item">
              <span className="dot dot-created" /> Created: <strong>{data.created}</strong>
            </div>
            <div className="tooltip-item">
              <span className="dot dot-completed" /> Completed: <strong>{data.completed}</strong>
            </div>
          </div>
        )}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${createdHeight}%` }}
          transition={{ delay: index * 0.06 + 0.1, duration: 0.5, ease: 'easeOut' }}
          className="chart-bar bar-created"
        />
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${completedHeight}%` }}
          transition={{ delay: index * 0.06 + 0.18, duration: 0.5, ease: 'easeOut' }}
          className="chart-bar bar-completed"
        />
      </div>
      <span className="chart-x-label">{data.month}</span>
    </div>
  );
}

function ProgressRow({ name, progress, delay }) {
  const getGradient = (val) => {
    if (val >= 70) return 'linear-gradient(90deg, #10B981, #059669)';
    if (val >= 40) return 'linear-gradient(90deg, #3B82F6, #6366F1)';
    return 'linear-gradient(90deg, #F59E0B, #EF4444)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="reports-progress-row"
    >
      <div className="progress-row-info">
        <span className="progress-row-name" title={name}>{name}</span>
      </div>
      <div className="progress-track-bg">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ delay: delay + 0.08, duration: 0.7, ease: 'easeOut' }}
          className="progress-track-fill"
          style={{ background: getGradient(progress) }}
        />
      </div>
      <span className="progress-row-badge">{progress}%</span>
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

  const priorityItems = (chartData.priorityDistribution && chartData.priorityDistribution.length > 0)
    ? chartData.priorityDistribution
    : [
        { name: 'Urgent', value: 2, color: '#EF4444' },
        { name: 'High', value: 4, color: '#F59E0B' },
        { name: 'Medium', value: 2, color: '#3B82F6' },
        { name: 'Low', value: 2, color: '#10B981' },
      ];

  const totalPriorityTasks = priorityItems.reduce((acc, curr) => acc + curr.value, 0) || 10;

  const projectProgress = projects.length > 0 
    ? projects.map(p => ({ name: p.name, progress: p.progress || 0 })) 
    : (chartData.projectProgress.length > 0 ? chartData.projectProgress : [
        { name: 'SprintFlow v2.0', progress: 68 },
        { name: 'API Gateway Migration', progress: 35 },
        { name: 'Design System 3.0', progress: 52 },
        { name: 'Mobile App (iOS/Android)', progress: 18 },
      ]);

  return (
    <PageTransition className="reports-page">
      {/* Top Page Header */}
      <div className="reports-header">
        <div className="reports-header-text">
          <h1 className="reports-title">Reports & Analytics</h1>
          <p className="reports-subtitle">Performance breakdown and productivity metrics for the last 6 months</p>
        </div>
        <div className="reports-live-badge">
          <span className="live-dot" />
          <Clock size={13} />
          <span>Updated live</span>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="reports-metrics-grid">
        <MetricCard
          label="Tasks Completed"
          value={stats.completedTasks || 24}
          change={24}
          icon={CheckCircle2}
          colorTheme="theme-green"
          delay={0.04}
        />
        <MetricCard
          label="Active Projects"
          value={stats.totalProjects || projects.length || 6}
          change={12}
          icon={Target}
          colorTheme="theme-blue"
          delay={0.08}
        />
        <MetricCard
          label="Team Velocity"
          value="8.4"
          change={-3}
          icon={TrendingUp}
          colorTheme="theme-amber"
          delay={0.12}
        />
        <MetricCard
          label="Team Members"
          value={stats.teamMembers || 7}
          change={33}
          icon={Users}
          colorTheme="theme-purple"
          delay={0.16}
        />
      </div>

      {/* Main Charts Row */}
      <div className="reports-charts-grid">
        {/* Task Completion Bar Chart Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="reports-card chart-card"
        >
          <div className="reports-card-header">
            <div>
              <h3 className="reports-card-title">Task Completion</h3>
              <p className="reports-card-desc">Completed vs Created Tasks per month</p>
            </div>
            <div className="reports-legend-group">
              <div className="legend-item">
                <span className="legend-swatch swatch-created" />
                <span>Created</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch swatch-completed" />
                <span>Completed</span>
              </div>
            </div>
          </div>

          <div className="chart-canvas-area">
            {/* Horizontal Grid lines */}
            <div className="chart-grid-lines">
              <div className="grid-line"><span className="grid-label">100</span></div>
              <div className="grid-line"><span className="grid-label">75</span></div>
              <div className="grid-line"><span className="grid-label">50</span></div>
              <div className="grid-line"><span className="grid-label">25</span></div>
              <div className="grid-line"><span className="grid-label">0</span></div>
            </div>
            <div className="chart-columns-container">
              {taskCompletion.map((d, i) => (
                <ChartBar key={d.month} data={d} index={i} maxVal={maxVal} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Priority Distribution Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="reports-card priority-card"
        >
          <div className="reports-card-header">
            <div>
              <h3 className="reports-card-title">Priority Distribution</h3>
              <p className="reports-card-desc">Active issues breakdown by urgency</p>
            </div>
          </div>

          <div className="priority-list">
            {priorityItems.map((item, i) => {
              const percentage = Math.round((item.value / totalPriorityTasks) * 100);
              return (
                <div key={item.name} className="priority-row-item">
                  <div className="priority-row-header">
                    <div className="priority-label-group">
                      <span className="priority-dot" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}40` }} />
                      <span className="priority-name">{item.name}</span>
                    </div>
                    <span className="priority-badge-count">{item.value} tasks</span>
                  </div>
                  <div className="priority-track-bg">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: i * 0.08 + 0.3, duration: 0.7, ease: 'easeOut' }}
                      className="priority-track-fill"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Project Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="reports-card progress-card"
      >
        <div className="reports-card-header">
          <div>
            <h3 className="reports-card-title">Project Progress</h3>
            <p className="reports-card-desc">Overall milestone completion across active projects</p>
          </div>
          <button className="reports-action-btn">
            <span>View details</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="reports-progress-stack">
          {projectProgress.map((project, i) => (
            <ProgressRow
              key={project.name}
              name={project.name}
              progress={project.progress}
              delay={i * 0.06 + 0.1}
            />
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}

