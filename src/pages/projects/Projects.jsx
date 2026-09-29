import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Plus, Search, FolderKanban, MoreHorizontal, Edit3, Trash2,
  Kanban, Calendar, Grid3X3, List, Tag, ArrowRight, Users,
  CheckCircle2, ShieldCheck, UserCheck
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import Avatar from '../../components/common/Avatar';
import Dropdown from '../../components/common/Dropdown/Dropdown';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import { addProjectAsync, updateProjectAsync, deleteProjectAsync } from '../../redux/projectSlice';
import { PROJECT_STATUS_CONFIG, PRIORITY_CONFIG } from '../../constants';
import { useToast } from '../../hooks/useToast';
import { useModal } from '../../hooks/useModal';
import useDebounce from '../../hooks/useDebounce';
import userService from '../../services/user.service';
import './Projects.css';

function ProjectCard({ project, allMembers, onEdit, onDelete, delay, view, isAdmin }) {
  const navigate = useNavigate();
  const members = allMembers.filter((m) => project.members?.includes(m.id));
  const statusCfg = PROJECT_STATUS_CONFIG[project.status] || PROJECT_STATUS_CONFIG.active;
  const priorityCfg = PRIORITY_CONFIG[project.priority] || PRIORITY_CONFIG.medium;

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="card-flat pc-list"
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        <div
          className="pc-icon-lg"
          style={{ backgroundColor: `${project.color || '#2563EB'}18` }}
        >
          {project.icon || '⚡'}
        </div>

        <div className="pc-list-info">
          <p className="pc-list-name">{project.name}</p>
          <p className="pc-list-desc">{project.description}</p>
        </div>

        <div className="pc-list-right">
          <div className="pc-list-members">
            {members.slice(0, 3).map((m) => (
              <Avatar key={m.id} name={m.name} size="xs" color={m.color} />
            ))}
          </div>

          <div className="pc-list-progress">
            <div className="pc-list-progress-label">
              <span>Progress</span>
              <span>{project.progress || 0}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.progress || 0}%` }}
                transition={{ delay: delay + 0.2, duration: 0.8 }}
                className="progress-fill"
              />
            </div>
          </div>

          <div
            className="pc-list-status"
            style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
          >
            {statusCfg.label}
          </div>

          <ArrowRight size={14} className="pc-arrow" />
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
      className="card pc-grid"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Colour accent stripe */}
      <div
        className="pc-grid-accent"
        style={{
          background: `linear-gradient(90deg, ${project.color || '#2563EB'}, ${project.color || '#2563EB'}80)`,
        }}
      />

      <div className="pc-grid-top">
        <div className="pc-grid-identity">
          <div
            className="pc-icon"
            style={{ backgroundColor: `${project.color || '#2563EB'}18` }}
          >
            {project.icon || '⚡'}
          </div>
          <div>
            <h3 className="pc-name">{project.name}</h3>
            <div className="pc-status-row">
              <span
                className="pc-status-badge"
                style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
              >
                {statusCfg.label}
              </span>
            </div>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown
            trigger={
              <button className="pc-menu-btn">
                <MoreHorizontal size={15} />
              </button>
            }
            align="right"
            width="sm"
          >
            <div className="pc-dropdown-inner">
              <button className="dropdown-item" onClick={() => { onEdit(project); }}>
                <Edit3 size={14} style={{ color: 'var(--color-surface-400)' }} />
                Edit project
              </button>
              <button className="dropdown-item" onClick={() => navigate(`/board?project=${project.id}`)}>
                <Kanban size={14} style={{ color: 'var(--color-surface-400)' }} />
                Open board
              </button>
              {isAdmin && (
                <>
                  <hr className="pc-dropdown-divider" />
                  <button className="dropdown-item danger" onClick={() => onDelete(project)}>
                    <Trash2 size={14} style={{ color: '#F87171' }} />
                    Delete
                  </button>
                </>
              )}
            </div>
          </Dropdown>
        </div>
      </div>

      <p className="pc-description">{project.description}</p>

      {project.tags && project.tags.length > 0 && (
        <div className="pc-tags">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="pc-tag">
              <Tag size={9} />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="pc-progress-wrap">
        <div className="pc-progress-label">
          <span className="pc-progress-label-left">
            {project.completedTasks || 0}/{project.taskCount || 0} tasks
          </span>
          <span className="pc-progress-label-right">{project.progress || 0}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress || 0}%` }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
            className="progress-fill"
          />
        </div>
      </div>

      <div className="pc-footer">
        <div className="pc-members">
          {members.slice(0, 4).map((m) => (
            <Avatar key={m.id} name={m.name} size="xs" color={m.color} />
          ))}
          {members.length > 4 && (
            <div className="pc-members-overflow">+{members.length - 4}</div>
          )}
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-surface-400)', marginLeft: 6 }}>
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </span>
        </div>

        <div className="pc-meta">
          <div className="pc-meta-item">
            <Calendar size={11} />
            <span>{project.dueDate || 'No due date'}</span>
          </div>
          <div className="pc-meta-item" style={{ color: priorityCfg.color }}>
            <span
              className="pc-priority-dot"
              style={{ backgroundColor: priorityCfg.color }}
            />
            {priorityCfg.label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectForm({ defaultValues, allMembers = [], onSubmit, onClose, loading, currentUser }) {
  const [selectedMembers, setSelectedMembers] = useState(
    defaultValues?.members || (currentUser?.id ? [currentUser.id] : ['user-1'])
  );

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultValues || {},
  });

  const toggleMember = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      members: selectedMembers.length > 0 ? selectedMembers : [currentUser?.id || 'user-1'],
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="pf-form">
      <Input
        label="Project name"
        placeholder="e.g. SprintFlow v2.0"
        error={errors.name?.message}
        required
        {...register('name', { required: 'Project name is required' })}
      />

      <div>
        <label className="pf-label">Description</label>
        <textarea
          {...register('description')}
          placeholder="Describe the project goals..."
          rows={3}
          className="input-base"
          style={{ resize: 'none' }}
        />
      </div>

      <div className="pf-two-col">
        <div>
          <label className="pf-label">Status</label>
          <select {...register('status')} className="input-base">
            <option value="active">Active (Running)</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="pf-label">Priority</label>
          <select {...register('priority')} className="input-base">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="pf-two-col">
        <Input label="Start date" type="date" {...register('startDate')} />
        <Input label="Due date" type="date" {...register('dueDate')} />
      </div>

      {/* Team Member Selection Section */}
      <div className="pf-members-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <label className="pf-label" style={{ marginBottom: 0 }}>
            <Users size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            Assigned Team Members ({selectedMembers.length})
          </label>
          <span style={{ fontSize: 11, color: 'var(--color-surface-400)' }}>
            Only selected members can view this project & board
          </span>
        </div>

        <div className="pf-member-selector-grid">
          {allMembers.map((m) => {
            const isAssigned = selectedMembers.includes(m.id);
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => toggleMember(m.id)}
                className={`pf-member-toggle-chip ${isAssigned ? 'active' : ''}`}
              >
                <Avatar name={m.name} size="xs" color={m.color} />
                <div className="pf-member-chip-text">
                  <span className="pf-member-chip-name">{m.name}</span>
                  <span className="pf-member-chip-role">{m.role || m.department || 'Member'}</span>
                </div>
                {isAssigned && <CheckCircle2 size={14} style={{ color: '#2563EB', marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pf-actions">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={loading}>
          {defaultValues ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
}

export default function Projects() {
  const dispatch = useDispatch();
  const { success } = useToast();
  const currentUser = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.projects.list);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState('grid');
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState([]);
  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();

  const isAdmin = currentUser?.role?.toLowerCase() === 'admin' || currentUser?.is_superuser === true;

  useEffect(() => {
    userService.getUsers().then((data) => setMembers(data)).catch(() => { });
  }, []);

  const filtered = projects.filter((p) => {
    const query = debouncedSearch.toLowerCase().trim();
    const matchSearch = !query ||
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.tags?.some((t) => t.toLowerCase().includes(query));
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await dispatch(addProjectAsync({
        ...data,
        workspaceId: 'ws-1',
        progress: 0,
        color: '#2563EB',
        icon: '📁',
        tags: ['Project'],
      })).unwrap();
      success('Project created', `"${data.name}" has been created with assigned members.`);
      createModal.close();
    } catch (e) {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (data) => {
    setSubmitting(true);
    try {
      await dispatch(updateProjectAsync({ id: editModal.data.id, data })).unwrap();
      success('Project updated', 'Project settings and members updated successfully.');
      editModal.close();
    } catch (e) {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await dispatch(deleteProjectAsync(deleteModal.data.id)).unwrap();
      success('Project deleted', `"${deleteModal.data.name}" removed.`);
      deleteModal.close();
    } catch (e) {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions = ['all', 'active', 'in_progress', 'on_hold', 'completed', 'archived'];

  return (
    <PageTransition className="projects-page">
      {/* Header */}
      <div className="projects-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 className="projects-title">Projects</h1>
            {isAdmin ? (
              <span className="projects-role-badge admin">
                <ShieldCheck size={12} /> Admin View · All Projects
              </span>
            ) : (
              <span className="projects-role-badge user">
                <UserCheck size={12} /> Assigned Projects Only
              </span>
            )}
          </div>
          <p className="projects-subtitle">
            {isAdmin
              ? `${projects.length} total projects across organization`
              : `You are assigned to ${projects.length} active project${projects.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={createModal.open}>
          New Project
        </Button>
      </div>

      {/* Toolbar */}
      <div className="projects-toolbar">
        {/* Search */}
        <div className="projects-search-wrap">
          <Search size={15} className="projects-search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="input-base projects-search-input"
          />
        </div>

        {/* Status filter */}
        <div className="projects-filter-group">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`projects-filter-btn${statusFilter === s ? ' active' : ''}`}
            >
              {s === 'all' ? 'All' : PROJECT_STATUS_CONFIG[s]?.label || s}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="projects-view-group">
          <button
            onClick={() => setView('grid')}
            className={`projects-view-btn${view === 'grid' ? ' active' : ''}`}
          >
            <Grid3X3 size={15} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`projects-view-btn${view === 'list' ? ' active' : ''}`}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Project list / grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={32} />}
          title={search ? 'No projects found' : 'No projects assigned'}
          description={
            search
              ? 'Try adjusting your filters.'
              : isAdmin
              ? 'Create your first project to get started.'
              : 'You have not been assigned to any projects yet. Contact your administrator.'
          }
          action={isAdmin && !search ? createModal.open : undefined}
          actionLabel="Create Project"
        />
      ) : (
        <div className={view === 'grid' ? 'projects-grid' : 'projects-list'}>
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              allMembers={members}
              isAdmin={isAdmin}
              delay={i * 0.05}
              view={view}
              onEdit={editModal.open}
              onDelete={deleteModal.open}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Create Project"
        subtitle="Set up a new project and assign team members"
        size="md"
      >
        <ProjectForm
          allMembers={members}
          currentUser={currentUser}
          onSubmit={handleCreate}
          onClose={createModal.close}
          loading={submitting}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Edit Project"
        subtitle="Modify project settings and manage assigned team members"
        size="md"
      >
        {editModal.data && (
          <ProjectForm
            defaultValues={editModal.data}
            allMembers={members}
            currentUser={currentUser}
            onSubmit={handleEdit}
            onClose={editModal.close}
            loading={submitting}
          />
        )}
      </Modal>

      {/* Delete modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        title="Delete Project"
        size="sm"
      >
        <div className="del-center">
          <div className="del-icon-wrap">
            <Trash2 size={20} style={{ color: '#DC2626' }} />
          </div>
          <p className="del-q">Are you sure you want to delete</p>
          <p className="del-name">"{deleteModal.data?.name}"?</p>
          <p className="del-warn">All tasks and data will be permanently deleted.</p>
          <div className="del-actions">
            <Button variant="secondary" onClick={deleteModal.close}>Cancel</Button>
            <Button variant="danger" loading={submitting} onClick={handleDelete}>
              Delete Project
            </Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}

