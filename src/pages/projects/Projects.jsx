import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Plus, Search, FolderKanban, MoreHorizontal, Edit3, Trash2,
  Kanban, Calendar, Users, CheckSquare, Filter, Grid3X3, List, Tag, ArrowRight, ExternalLink
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import Badge from '../../components/common/Badge/Badge';
import Avatar from '../../components/common/Avatar';
import Dropdown from '../../components/common/Dropdown/Dropdown';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import { addProject, updateProject, deleteProject } from '../../redux/projectSlice';
import { MEMBERS, LABELS } from '../../constants/data';
import { PROJECT_STATUS_CONFIG, PRIORITY_CONFIG } from '../../constants';
import { useToast } from '../../hooks/useToast';
import { useModal } from '../../hooks/useModal';

function ProjectCard({ project, onEdit, onDelete, delay, view }) {
  const navigate = useNavigate();
  const members = MEMBERS.filter((m) => project.members?.includes(m.id));
  const statusCfg = PROJECT_STATUS_CONFIG[project.status] || PROJECT_STATUS_CONFIG.active;
  const priorityCfg = PRIORITY_CONFIG[project.priority] || PRIORITY_CONFIG.medium;

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="card-flat p-4 flex items-center gap-4 hover:shadow-card hover:border-surface-300 transition-all cursor-pointer group"
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: `${project.color}18` }}>
          {project.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-surface-900 truncate">{project.name}</p>
          <p className="text-sm text-surface-500 truncate">{project.description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex -space-x-1.5">
            {members.slice(0, 3).map((m) => <Avatar key={m.id} name={m.name} size="xs" color={m.color} />)}
          </div>
          <div className="w-24">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-surface-500">Progress</span>
              <span className="font-medium text-surface-700">{project.progress}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ delay: delay + 0.2, duration: 0.8 }}
                className="progress-fill"
              />
            </div>
          </div>
          <div className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
            {statusCfg.label}
          </div>
          <ArrowRight size={14} className="text-surface-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card p-5 group cursor-pointer relative overflow-hidden"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Color stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}80)` }} />

      {/* Header */}
      <div className="flex items-start justify-between mt-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${project.color}18` }}>
            {project.icon}
          </div>
          <div>
            <h3 className="font-semibold text-surface-900 leading-tight">{project.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
                {statusCfg.label}
              </span>
            </div>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown
            trigger={
              <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-surface-100 text-surface-400 transition-all">
                <MoreHorizontal size={15} />
              </button>
            }
            align="right" width="sm"
          >
            <div className="py-1">
              <button className="dropdown-item" onClick={() => { onEdit(project); }}>
                <Edit3 size={14} className="text-surface-400" />Edit project
              </button>
              <button className="dropdown-item" onClick={() => navigate(`/projects/${project.id}/board`)}>
                <Kanban size={14} className="text-surface-400" />Open board
              </button>
              <div className="my-1 border-t border-surface-100" />
              <button className="dropdown-item danger" onClick={() => onDelete(project)}>
                <Trash2 size={14} className="text-danger-400" />Delete
              </button>
            </div>
          </Dropdown>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-surface-500 mb-4 line-clamp-2 leading-relaxed">{project.description}</p>

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-100 text-surface-600 rounded-full text-xs font-medium">
              <Tag size={9} />{tag}
            </span>
          ))}
        </div>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-surface-500">{project.completedTasks}/{project.taskCount} tasks</span>
          <span className="font-semibold text-surface-700">{project.progress}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
            className="progress-fill"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-100">
        <div className="flex -space-x-2">
          {members.slice(0, 4).map((m) => <Avatar key={m.id} name={m.name} size="xs" color={m.color} />)}
          {members.length > 4 && (
            <div className="w-6 h-6 rounded-full bg-surface-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-surface-600">
              +{members.length - 4}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-surface-400">
          <div className="flex items-center gap-1">
            <Calendar size={11} />
            <span>{new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1" style={{ color: priorityCfg.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: priorityCfg.color }} />
            {priorityCfg.label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectForm({ defaultValues, onSubmit, onClose, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: defaultValues || {} });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Project name" placeholder="e.g. SprintFlow v2.0" error={errors.name?.message} required
        {...register('name', { required: 'Project name is required' })} />
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-1.5">Description</label>
        <textarea {...register('description')} placeholder="Describe the project goals..." rows={3} className="input-base resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Status</label>
          <select {...register('status')} className="input-base">
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Priority</label>
          <select {...register('priority')} className="input-base">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Start date" type="date" {...register('startDate')} />
        <Input label="Due date" type="date" {...register('dueDate')} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={loading}>{defaultValues ? 'Save Changes' : 'Create Project'}</Button>
      </div>
    </form>
  );
}

export default function Projects() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success } = useToast();
  const projects = useSelector((state) => state.projects.list);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState('grid');
  const [submitting, setSubmitting] = useState(false);
  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = async (data) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    dispatch(addProject({
      id: `proj-${Date.now()}`,
      ...data,
      workspaceId: 'ws-1',
      progress: 0,
      color: '#2563EB',
      icon: '📁',
      members: ['user-1'],
      taskCount: 0,
      completedTasks: 0,
      tags: [],
    }));
    success('Project created', `"${data.name}" is ready.`);
    setSubmitting(false);
    createModal.close();
  };

  const handleEdit = async (data) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    dispatch(updateProject({ id: editModal.data.id, ...data }));
    success('Project updated', 'Changes saved.');
    setSubmitting(false);
    editModal.close();
  };

  const handleDelete = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    dispatch(deleteProject(deleteModal.data.id));
    success('Project deleted', `"${deleteModal.data.name}" removed.`);
    setSubmitting(false);
    deleteModal.close();
  };

  const statusOptions = ['all', 'active', 'on_hold', 'completed', 'archived'];

  return (
    <PageTransition className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Projects</h1>
          <p className="text-surface-500 text-sm mt-1">{projects.length} projects across all workspaces</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={createModal.open}>New Project</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..." className="input-base pl-10 w-full" />
        </div>

        <div className="flex gap-1 bg-surface-100 p-1 rounded-xl">
          {statusOptions.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${statusFilter === s ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-700'}`}>
              {s === 'all' ? 'All' : PROJECT_STATUS_CONFIG[s]?.label || s}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-surface-100 p-1 rounded-xl">
          <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm text-surface-900' : 'text-surface-400'}`}>
            <Grid3X3 size={15} />
          </button>
          <button onClick={() => setView('list')} className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-surface-900' : 'text-surface-400'}`}>
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={32} />}
          title={search ? 'No projects found' : 'No projects yet'}
          description={search ? 'Try adjusting your filters.' : 'Create your first project to get started.'}
          action={!search ? createModal.open : undefined}
          actionLabel="Create Project"
        />
      ) : (
        <div className={view === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
          : 'flex flex-col gap-3'
        }>
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} delay={i * 0.05} view={view}
              onEdit={editModal.open} onDelete={deleteModal.open} />
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.close} title="Create Project" subtitle="Set up a new project for your team" size="md">
        <ProjectForm onSubmit={handleCreate} onClose={createModal.close} loading={submitting} />
      </Modal>

      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Edit Project" size="md">
        {editModal.data && <ProjectForm defaultValues={editModal.data} onSubmit={handleEdit} onClose={editModal.close} loading={submitting} />}
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} title="Delete Project" size="sm">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-danger-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={20} className="text-danger-600" />
          </div>
          <p className="text-surface-700 mb-1">Are you sure you want to delete</p>
          <p className="font-bold text-surface-900 mb-4">"{deleteModal.data?.name}"?</p>
          <p className="text-sm text-surface-500 mb-6">All tasks and data will be permanently deleted.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={deleteModal.close}>Cancel</Button>
            <Button variant="danger" loading={submitting} onClick={handleDelete}>Delete Project</Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
