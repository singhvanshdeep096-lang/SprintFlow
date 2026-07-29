import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { ArrowLeft, Kanban, Users, Calendar, Tag, Settings } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import { PROJECT_STATUS_CONFIG, PRIORITY_CONFIG } from '../../constants';
import userService from '../../services/user.service';
import { useEffect } from 'react';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projects = useSelector((state) => state.projects.list);
  const tasks = useSelector((state) => state.tasks.list);
  const [allMembers, setAllMembers] = useState([]);

  useEffect(() => {
    userService.getUsers().then((data) => setAllMembers(data)).catch(() => {});
  }, []);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <PageTransition className="pd-not-found">
        <div className="pd-not-found-inner">
          <p className="pd-not-found-text">Project not found</p>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </PageTransition>
    );
  }

  const members = allMembers.filter((m) => project.members?.includes(m.id));
  const projectTasks = tasks.filter((t) => t.projectId === id);
  const statusCfg   = PROJECT_STATUS_CONFIG[project.status]   || PROJECT_STATUS_CONFIG.active;
  const priorityCfg = PRIORITY_CONFIG[project.priority] || PRIORITY_CONFIG.medium;

  const tasksByStatus = {
    todo:        projectTasks.filter((t) => t.status === 'todo'),
    in_progress: projectTasks.filter((t) => t.status === 'in_progress'),
    review:      projectTasks.filter((t) => t.status === 'review'),
    done:        projectTasks.filter((t) => t.status === 'done'),
  };

  const statusLabels = { todo: 'To Do', in_progress: 'In Progress', review: 'In Review', done: 'Done' };
  const statusColors = { todo: '#94A3B8', in_progress: '#3B82F6', review: '#F59E0B', done: '#22C55E' };

  return (
    <PageTransition className="pd-page">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/projects')}
        className="pd-back-btn"
      >
        <ArrowLeft size={16} /> Back to Projects
      </motion.button>

      {/* Header card */}
      <div className="card p-6" style={{ marginBottom: 24 }}>
        <div className="pd-header-top">
          <div className="pd-header-left">
            <div
              className="pd-header-icon"
              style={{ backgroundColor: `${project.color || '#2563EB'}18` }}
            >
              {project.icon || '⚡'}
            </div>
            <div>
              <h1 className="pd-name">{project.name}</h1>
              <p className="pd-desc">{project.description}</p>
              <div className="pd-badge-row">
                <span className="pd-status-badge" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
                  {statusCfg.label}
                </span>
                <span className="pd-priority-badge" style={{ backgroundColor: `${priorityCfg.color}18`, color: priorityCfg.color }}>
                  {priorityCfg.label} Priority
                </span>
                {project.tags?.map((tag) => (
                  <span key={tag} className="pd-tag">
                    <Tag size={9} />{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="pd-header-actions">
            <Button variant="secondary" size="sm" icon={<Settings size={14} />}>Settings</Button>
            <Button variant="primary" size="sm" icon={<Kanban size={14} />} onClick={() => navigate('/board')}>
              Open Board
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="pd-progress-wrap">
          <div className="pd-progress-label-row">
            <span className="pd-progress-label-left">
              {project.completedTasks || 0} of {project.taskCount || 0} tasks completed
            </span>
            <span className="pd-progress-label-right">{project.progress || 0}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress || 0}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="progress-fill"
            />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="pd-stats-grid">
        {Object.entries(tasksByStatus).map(([status, statusTasks], i) => (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card pd-stat-card"
          >
            <div className="pd-stat-dot" style={{ backgroundColor: statusColors[status] }} />
            <p className="pd-stat-value">{statusTasks.length}</p>
            <p className="pd-stat-label">{statusLabels[status]}</p>
          </motion.div>
        ))}
      </div>

      {/* Team + Timeline */}
      <div className="pd-bottom-grid">
        <div className="card p-5">
          <h2 className="pd-section-title"><Users size={15} />Team Members</h2>
          <div className="pd-member-stack">
            {members.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="pd-member-row"
              >
                <Avatar name={m.name} size="md" color={m.color} />
                <div>
                  <p className="pd-member-name">{m.name}</p>
                  <p className="pd-member-role">{m.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="pd-section-title"><Calendar size={15} />Timeline</h2>
          <div className="pd-timeline-stack">
            {[
              { label: 'Start Date',   value: project.startDate     || 'N/A' },
              { label: 'Due Date',     value: project.dueDate       || 'N/A' },
              { label: 'Total Tasks',  value: `${project.taskCount  || 0} tasks` },
              { label: 'Completed',    value: `${project.completedTasks || 0} tasks` },
            ].map(({ label, value }) => (
              <div key={label} className="pd-timeline-row">
                <span className="pd-timeline-label">{label}</span>
                <span className="pd-timeline-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
