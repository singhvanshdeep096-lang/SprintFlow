import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Plus, Search, Building2, Users, FolderKanban, MoreHorizontal,
  Edit3, Trash2, Crown, Settings, CheckCircle,
  Layers, ArrowUpRight, Globe
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import Avatar from '../../components/common/Avatar';
import Dropdown from '../../components/common/Dropdown/Dropdown';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import { addWorkspaceAsync, updateWorkspaceAsync, deleteWorkspaceAsync } from '../../redux/workspaceSlice';
import { useToast } from '../../hooks/useToast';
import { useModal } from '../../hooks/useModal';
import userService from '../../services/user.service';
import './Workspaces.css';

const WORKSPACE_ICONS = ['🚀', '🎨', '📊', '💡', '🔧', '🌟', '⚡', '🎯', '🔬', '📱', '🤖', '💎'];
const WORKSPACE_COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2', '#DB2777', '#65A30D'];
const PLAN_CONFIG = {
  Starter:  { color: 'gray',    label: 'STARTER'  },
  Pro:      { color: 'primary', label: 'PRO'       },
  Business: { color: 'purple',  label: 'BUSINESS'  },
};

function WorkspaceCard({ workspace, allMembers, onEdit, onDelete, delay }) {
  const navigate = useNavigate();
  const members  = allMembers.filter((m) => workspace.members?.includes(m.id));
  const plan     = PLAN_CONFIG[workspace.plan] || PLAN_CONFIG.Starter;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.38, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className="ws-card group"
      onClick={() => navigate(`/workspaces/${workspace.id}`)}
    >
      <div
        className="ws-card-stripe"
        style={{ background: `linear-gradient(90deg, ${workspace.color || '#2563EB'}, ${workspace.color || '#2563EB'}99)` }}
      />

      <div className="ws-card-inner">
        <div className="ws-card-top">
          <div className="ws-card-left">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              className="ws-card-icon-box"
              style={{ backgroundColor: `${workspace.color || '#2563EB'}18`, border: `1.5px solid ${workspace.color || '#2563EB'}35` }}
            >
              {workspace.icon || '🚀'}
            </motion.div>

            <div>
              <h3 className="ws-card-title">{workspace.name}</h3>
              <div className="ws-card-tags">
                {workspace.isOwner && (
                  <span className="ws-owner-badge">
                    <Crown size={9} />OWNER
                  </span>
                )}
                <span
                  className="ws-plan-badge"
                  style={{
                    backgroundColor: `${workspace.color || '#2563EB'}15`,
                    color: workspace.color || '#2563EB',
                  }}
                >
                  {plan.label}
                </span>
              </div>
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown
              trigger={
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="ws-more-btn"
                >
                  <MoreHorizontal size={15} />
                </motion.button>
              }
              align="right"
              width="sm"
            >
              <div style={{ paddingBlock: 4 }}>
                <button className="dropdown-item" onClick={() => onEdit(workspace)}>
                  <Edit3 size={14} style={{ color: 'var(--color-surface-400)' }} />Edit workspace
                </button>
                <button className="dropdown-item" onClick={() => navigate('/settings')}>
                  <Settings size={14} style={{ color: 'var(--color-surface-400)' }} />Settings
                </button>
                <hr className="profile-menu-divider" />
                <button className="dropdown-item danger" onClick={() => onDelete(workspace)}>
                  <Trash2 size={14} style={{ color: '#F87171' }} />Delete
                </button>
              </div>
            </Dropdown>
          </div>
        </div>

        <p className="ws-card-desc">
          {workspace.description}
        </p>

        <div className="ws-card-counts">
          <div className="ws-card-count-item">
            <FolderKanban size={13} style={{ color: workspace.color || '#2563EB' }} />
            <span className="ws-card-count-val">{workspace.projectCount || 0}</span>
            <span className="ws-card-count-lbl">projects</span>
          </div>
          <div className="ws-card-count-item">
            <Users size={13} style={{ color: workspace.color || '#2563EB' }} />
            <span className="ws-card-count-val">{members.length}</span>
            <span className="ws-card-count-lbl">members</span>
          </div>
        </div>

        <div className="ws-card-footer">
          <div className="ws-card-members">
            {members.slice(0, 5).map((m) => (
              <div key={m.id} className="ws-card-member-avatar">
                <Avatar name={m.name} size="xs" color={m.color} />
              </div>
            ))}
            {members.length > 5 && (
              <div className="ws-card-member-more">
                +{members.length - 5}
              </div>
            )}
          </div>

          <div
            className="ws-card-open-link"
            style={{ color: workspace.color || '#2563EB' }}
          >
            Open <ArrowUpRight size={12} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function WorkspaceForm({ defaultValues, onSubmit, onClose, loading }) {
  const [selectedIcon, setSelectedIcon]   = useState(defaultValues?.icon  || '🚀');
  const [selectedColor, setSelectedColor] = useState(defaultValues?.color || '#2563EB');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultValues || {},
  });

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, icon: selectedIcon, color: selectedColor });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Input
        label="Workspace name"
        placeholder="e.g. Engineering Hub"
        error={errors.name?.message}
        required
        {...register('name', { required: 'Workspace name is required' })}
      />

      <div>
        <label className="profile-bio-label">Description</label>
        <textarea
          {...register('description')}
          placeholder="Describe the purpose of this workspace..."
          rows={3}
          className="input-base input-wrap--full"
          style={{ resize: 'none' }}
        />
      </div>

      <div>
        <label className="profile-bio-label">Icon</label>
        <div className="ws-icon-picker">
          {WORKSPACE_ICONS.map((icon) => (
            <motion.button
              key={icon}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedIcon(icon)}
              className={`ws-icon-btn ${selectedIcon === icon ? 'ws-icon-btn--active' : 'ws-icon-btn--inactive'}`}
            >
              {icon}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="profile-bio-label">Color</label>
        <div className="ws-color-picker">
          {WORKSPACE_COLORS.map((color) => (
            <motion.button
              key={color}
              type="button"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedColor(color)}
              className="ws-color-btn"
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && <CheckCircle size={14} style={{ color: '#ffffff' }} />}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 }}>
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={loading}>
          {defaultValues ? 'Save Changes' : 'Create Workspace'}
        </Button>
      </div>
    </form>
  );
}

export default function Workspaces() {
  const dispatch    = useDispatch();
  const { success } = useToast();
  const workspaces  = useSelector((state) => state.workspaces.list);
  const [search, setSearch]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers]       = useState([]);
  const createModal = useModal();
  const editModal   = useModal();
  const deleteModal = useModal();

  useEffect(() => {
    userService.getUsers().then((data) => setMembers(data)).catch(() => {});
  }, []);

  const filtered = workspaces.filter(
    (w) => w.name.toLowerCase().includes(search.toLowerCase()) ||
           w.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalProjects = workspaces.reduce((sum, w) => sum + (w.projectCount || 0), 0);
  const totalMembers  = members.length;

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await dispatch(addWorkspaceAsync({ ...data, members: ['user-1'], plan: 'Starter' })).unwrap();
      success('Workspace created', `"${data.name}" is ready to use.`);
      createModal.close();
    } catch (e) { /* ignore */ } finally { setSubmitting(false); }
  };

  const handleEdit = async (data) => {
    setSubmitting(true);
    try {
      await dispatch(updateWorkspaceAsync({ id: editModal.data.id, data })).unwrap();
      success('Workspace updated', 'Changes saved successfully.');
      editModal.close();
    } catch (e) { /* ignore */ } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await dispatch(deleteWorkspaceAsync(deleteModal.data.id)).unwrap();
      success('Workspace deleted', `"${deleteModal.data.name}" has been removed.`);
      deleteModal.close();
    } catch (e) { /* ignore */ } finally { setSubmitting(false); }
  };

  return (
    <PageTransition className="ws-page">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="ws-banner"
      >
        <div className="ws-banner-glow-tr" />
        <div className="ws-banner-glow-bl" />

        <div className="ws-banner-btn-wrap" onClick={createModal.open}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="ws-create-btn"
          >
            <Plus size={15} />
            New Workspace
          </motion.button>
        </div>

        <div className="ws-banner-content">
          <div className="ws-banner-org-tag">
            <Globe size={13} style={{ color: '#93c5fd', opacity: 0.85 }} />
            <span className="ws-banner-org-label">Organization</span>
          </div>
          <h1 className="ws-banner-title">Workspaces</h1>
          <p className="ws-banner-subtitle">
            Manage all your team workspaces in one place
          </p>

          <div className="ws-banner-stats-row">
            {[
              { label: 'Workspaces', value: workspaces.length, icon: Layers },
              { label: 'Projects',   value: totalProjects,     icon: FolderKanban },
              { label: 'Members',    value: totalMembers,      icon: Users },
            ].map(({ label, value, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="ws-banner-stat-item"
              >
                <div className="ws-banner-stat-icon-box">
                  <Icon size={13} color="white" />
                </div>
                <div>
                  <p className="ws-banner-stat-val">{value}</p>
                  <p className="ws-banner-stat-lbl">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="ws-search-wrap"
      >
        <Search size={15} className="ws-search-icon" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search workspaces..."
          className="input-base ws-search-input"
        />
      </motion.div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Building2 size={32} />}
            title={search ? 'No workspaces found' : 'No workspaces yet'}
            description={
              search
                ? 'Try a different search term.'
                : 'Create your first workspace to organize your team and projects.'
            }
            action={!search ? createModal.open : undefined}
            actionLabel="Create Workspace"
          />
        ) : (
          <div className="ws-grid">
            {filtered.map((ws, i) => (
              <WorkspaceCard
                key={ws.id}
                workspace={ws}
                allMembers={members}
                delay={i * 0.07}
                onEdit={editModal.open}
                onDelete={deleteModal.open}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <Modal isOpen={createModal.isOpen} onClose={createModal.close} title="Create Workspace" subtitle="Set up a new workspace for your team" size="md">
        <WorkspaceForm onSubmit={handleCreate} onClose={createModal.close} loading={submitting} />
      </Modal>

      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="Edit Workspace" size="md">
        {editModal.data && (
          <WorkspaceForm
            defaultValues={editModal.data}
            onSubmit={handleEdit}
            onClose={editModal.close}
            loading={submitting}
          />
        )}
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} title="Delete Workspace" size="sm">
        <div style={{ textAlign: 'center' }}>
          <div className="auth-success-icon-wrap" style={{ background: '#FEE2E2', marginBottom: 16 }}>
            <Trash2 size={22} style={{ color: '#EF4444' }} />
          </div>
          <p className="setting-row-label" style={{ marginBottom: 4 }}>Are you sure you want to delete</p>
          <p className="setting-row-label" style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>"{deleteModal.data?.name}"?</p>
          <p className="setting-row-desc" style={{ fontSize: 13, marginBottom: 24 }}>
            This action cannot be undone. All projects and data within this workspace will be permanently deleted.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button variant="secondary" onClick={deleteModal.close}>Cancel</Button>
            <Button variant="danger" loading={submitting} onClick={handleDelete}>Delete Workspace</Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
