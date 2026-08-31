import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'motion/react';
import {
  ArrowLeft, Kanban, Users, Calendar, Tag, Settings, Plus,
  ShieldCheck, UserPlus, CheckCircle2, Search, X, Lock
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal/Modal';
import { PROJECT_STATUS_CONFIG, PRIORITY_CONFIG } from '../../constants';
import { updateProjectAsync } from '../../redux/projectSlice';
import { useToast } from '../../hooks/useToast';
import { useModal } from '../../hooks/useModal';
import userService from '../../services/user.service';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success, error: toastError } = useToast();
  
  const currentUser = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.projects.list);
  const tasks = useSelector((state) => state.tasks.list);
  const [allMembers, setAllMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [updatingMembers, setUpdatingMembers] = useState(false);

  const manageMembersModal = useModal();

  const isAdmin = currentUser?.role?.toLowerCase() === 'admin' || currentUser?.is_superuser === true;

  useEffect(() => {
    userService.getUsers().then((data) => setAllMembers(data)).catch(() => {});
  }, []);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <PageTransition className="pd-not-found">
        <div className="pd-not-found-inner">
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#2563EB' }}>
            <Lock size={22} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 6 }}>Project Not Accessible</h2>
          <p className="pd-not-found-text">This project does not exist or you do not have permission to view it.</p>
          <Button onClick={() => navigate('/projects')}>Back to Assigned Projects</Button>
        </div>
      </PageTransition>
    );
  }

  const isMember = project.members?.includes(currentUser?.id);

  // Non-admin users who are not members cannot access this project
  if (!isAdmin && !isMember) {
    return (
      <PageTransition className="pd-not-found">
        <div className="pd-not-found-inner">
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#DC2626' }}>
            <Lock size={22} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#DC2626', marginBottom: 6 }}>Access Restricted</h2>
          <p className="pd-not-found-text">You are not a member of "{project.name}". Only assigned team members can view this project.</p>
          <Button onClick={() => navigate('/projects')}>View My Assigned Projects</Button>
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

  const handleToggleMember = async (userId) => {
    const currentMembers = project.members || [];
    let updatedMembers;
    if (currentMembers.includes(userId)) {
      if (currentMembers.length <= 1) {
        toastError('Cannot Remove', 'Project must have at least one team member.');
        return;
      }
      updatedMembers = currentMembers.filter((uid) => uid !== userId);
    } else {
      updatedMembers = [...currentMembers, userId];
    }

    setUpdatingMembers(true);
    try {
      await dispatch(updateProjectAsync({ id: project.id, data: { members: updatedMembers } })).unwrap();
      success('Team Updated', 'Project team membership has been updated.');
    } catch (err) {
      toastError('Update Failed', err.message || 'Could not update project members');
    } finally {
      setUpdatingMembers(false);
    }
  };

  const filteredDirectory = allMembers.filter(
    (m) => m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
           m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

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
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 className="pd-name">{project.name}</h1>
                {isAdmin && (
                  <span className="projects-role-badge admin" style={{ fontSize: 10 }}>
                    <ShieldCheck size={10} /> Admin Control
                  </span>
                )}
              </div>
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
            {isAdmin && (
              <Button
                variant="secondary"
                size="sm"
                icon={<UserPlus size={14} />}
                onClick={manageMembersModal.open}
              >
                Manage Members
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              icon={<Kanban size={14} />}
              onClick={() => navigate(`/board?project=${project.id}`)}
            >
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 className="pd-section-title" style={{ marginBottom: 0 }}>
              <Users size={15} /> Assigned Team Members ({members.length})
            </h2>
            {isAdmin && (
              <button
                onClick={manageMembersModal.open}
                className="pd-manage-link"
              >
                + Manage Team
              </button>
            )}
          </div>
          
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
                <div style={{ flex: 1 }}>
                  <p className="pd-member-name">{m.name}</p>
                  <p className="pd-member-role">{m.role || m.department || 'Team Member'}</p>
                </div>
                {isAdmin && (
                  <span className="pd-member-access-tag">Assigned Access</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="pd-section-title"><Calendar size={15} />Timeline & Delivery</h2>
          <div className="pd-timeline-stack">
            {[
              { label: 'Project Status', value: statusCfg.label },
              { label: 'Start Date',     value: project.startDate     || 'N/A' },
              { label: 'Target Due Date',value: project.dueDate       || 'N/A' },
              { label: 'Total Tasks',    value: `${project.taskCount  || 0} tasks` },
              { label: 'Completed',      value: `${project.completedTasks || 0} tasks` },
            ].map(({ label, value }) => (
              <div key={label} className="pd-timeline-row">
                <span className="pd-timeline-label">{label}</span>
                <span className="pd-timeline-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manage Members Modal for Admin */}
      <Modal
        isOpen={manageMembersModal.isOpen}
        onClose={manageMembersModal.close}
        title="Manage Team Members"
        subtitle={`Assign or remove members for "${project.name}"`}
        size="md"
      >
        <div className="pd-modal-content">
          <div className="pd-modal-search-wrap">
            <Search size={14} className="pd-modal-search-icon" />
            <input
              type="text"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="input-base pd-modal-search-input"
            />
          </div>

          <div className="pd-modal-users-list">
            {filteredDirectory.map((user) => {
              const isAssigned = project.members?.includes(user.id);
              return (
                <div
                  key={user.id}
                  className={`pd-modal-user-row ${isAssigned ? 'assigned' : ''}`}
                >
                  <Avatar name={user.name} size="sm" color={user.color} />
                  <div className="pd-modal-user-info">
                    <span className="pd-modal-user-name">{user.name}</span>
                    <span className="pd-modal-user-email">{user.email} · {user.role || 'Member'}</span>
                  </div>
                  
                  <button
                    type="button"
                    disabled={updatingMembers}
                    onClick={() => handleToggleMember(user.id)}
                    className={`pd-member-action-btn ${isAssigned ? 'remove' : 'add'}`}
                  >
                    {isAssigned ? (
                      <>
                        <CheckCircle2 size={13} /> Assigned (Click to remove)
                      </>
                    ) : (
                      <>
                        <Plus size={13} /> Add to Project
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pd-modal-footer">
            <span style={{ fontSize: 12, color: 'var(--color-surface-500)' }}>
              {project.members?.length || 0} members have access to this project and its board.
            </span>
            <Button variant="primary" size="sm" onClick={manageMembersModal.close}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}

