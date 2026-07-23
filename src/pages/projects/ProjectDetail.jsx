import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { ArrowLeft, Kanban, Users, Calendar, Tag, Settings } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import { PROJECT_STATUS_CONFIG, PRIORITY_CONFIG } from '../../constants';
import userService from '../../services/user.service';

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
      <PageTransition className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-surface-500 mb-4">Project not found</p>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </PageTransition>
    );
  }

  const members = allMembers.filter((m) => project.members?.includes(m.id));
  const projectTasks = tasks.filter((t) => t.projectId === id);
  const statusCfg = PROJECT_STATUS_CONFIG[project.status] || PROJECT_STATUS_CONFIG.active;
  const priorityCfg = PRIORITY_CONFIG[project.priority] || PRIORITY_CONFIG.medium;

  const tasksByStatus = {
    todo: projectTasks.filter((t) => t.status === 'todo'),
    in_progress: projectTasks.filter((t) => t.status === 'in_progress'),
    review: projectTasks.filter((t) => t.status === 'review'),
    done: projectTasks.filter((t) => t.status === 'done'),
  };

  return (
    <PageTransition className="p-6 max-w-[1200px] mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-surface-500 hover:text-surface-700 text-sm font-medium mb-5 transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Projects
      </motion.button>

      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm" style={{ backgroundColor: `${project.color || '#2563EB'}18` }}>
              {project.icon || '⚡'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface-900">{project.name}</h1>
              <p className="text-surface-500 text-sm mt-1 max-w-lg">{project.description}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
                  {statusCfg.label}
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${priorityCfg.color}18`, color: priorityCfg.color }}>
                  {priorityCfg.label} Priority
                </span>
                {project.tags?.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-100 text-surface-600 rounded-full text-xs">
                    <Tag size={9} />{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<Settings size={14} />}>Settings</Button>
            <Button variant="primary" size="sm" icon={<Kanban size={14} />} onClick={() => navigate(`/board`)}>
              Open Board
            </Button>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-surface-100">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-surface-600 font-medium">{project.completedTasks || 0} of {project.taskCount || 0} tasks completed</span>
            <span className="font-bold text-surface-900">{project.progress || 0}%</span>
          </div>
          <div className="progress-bar h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress || 0}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="progress-fill h-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-6">
        {Object.entries(tasksByStatus).map(([status, statusTasks], i) => {
          const labels = { todo: 'To Do', in_progress: 'In Progress', review: 'In Review', done: 'Done' };
          const colors = { todo: '#94A3B8', in_progress: '#3B82F6', review: '#F59E0B', done: '#22C55E' };
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card p-4 text-center"
            >
              <div className="w-2.5 h-2.5 rounded-full mx-auto mb-2" style={{ backgroundColor: colors[status] }} />
              <p className="text-2xl font-bold text-surface-900">{statusTasks.length}</p>
              <p className="text-xs text-surface-500 font-medium mt-0.5">{labels[status]}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-surface-900 mb-4 flex items-center gap-2"><Users size={15} />Team Members</h2>
          <div className="space-y-2">
            {members.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-50 transition-colors">
                <Avatar name={m.name} size="md" color={m.color} />
                <div>
                  <p className="text-sm font-medium text-surface-800">{m.name}</p>
                  <p className="text-xs text-surface-400">{m.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold text-surface-900 mb-4 flex items-center gap-2"><Calendar size={15} />Timeline</h2>
          <div className="space-y-3">
            {[
              { label: 'Start Date', value: project.startDate || 'N/A' },
              { label: 'Due Date', value: project.dueDate || 'N/A' },
              { label: 'Total Tasks', value: `${project.taskCount || 0} tasks` },
              { label: 'Completed', value: `${project.completedTasks || 0} tasks` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-surface-50">
                <span className="text-sm text-surface-500">{label}</span>
                <span className="text-sm font-semibold text-surface-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
