import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Plus, Search, Building2, Users, FolderKanban, MoreHorizontal,
  Edit3, Trash2, ExternalLink, Crown, Settings, CheckCircle,
  Layers, ArrowUpRight, Sparkles, Globe
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import Badge from '../../components/common/Badge/Badge';
import Avatar from '../../components/common/Avatar';
import Dropdown from '../../components/common/Dropdown/Dropdown';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import { addWorkspace, updateWorkspace, deleteWorkspace } from '../../redux/workspaceSlice';
import { MEMBERS } from '../../constants/data';
import { useToast } from '../../hooks/useToast';
import { useModal } from '../../hooks/useModal';

const WORKSPACE_ICONS = ['🚀', '🎨', '📊', '💡', '🔧', '🌟', '⚡', '🎯', '🔬', '📱', '🤖', '💎'];
const WORKSPACE_COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2', '#DB2777', '#65A30D'];
const PLAN_CONFIG = {
  Starter: { color: 'gray',    label: 'STARTER'  },
  Pro:     { color: 'primary', label: 'PRO'       },
  Business:{ color: 'purple',  label: 'BUSINESS'  },
};

// ─── Workspace Card ───────────────────────────────────────────────────────────
function WorkspaceCard({ workspace, onEdit, onDelete, delay }) {
  const navigate = useNavigate();
  const members = MEMBERS.filter((m) => workspace.members?.includes(m.id));
  const plan = PLAN_CONFIG[workspace.plan] || PLAN_CONFIG.Starter;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.38, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className="group relative bg-white rounded-2xl border border-surface-200 overflow-hidden cursor-pointer"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)' }}
      onClick={() => navigate(`/workspaces/${workspace.id}`)}
    >
      {/* Coloured top bar */}
      <div
        className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
        style={{ background: `linear-gradient(90deg, ${workspace.color}, ${workspace.color}99)` }}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0"
              style={{ backgroundColor: `${workspace.color}18`, border: `1.5px solid ${workspace.color}35` }}
            >
              {workspace.icon}
            </motion.div>

            <div>
              <h3 className="font-bold text-surface-900 text-[15px] leading-tight">{workspace.name}</h3>
              <div className="flex items-center gap-1.5 mt-1">
                {workspace.isOwner && (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                    <Crown size={9} />OWNER
                  </span>
                )}
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${workspace.color}15`,
                    color: workspace.color,
                  }}
                >
                  {plan.label}
                </span>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown
              trigger={
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-all"
                >
                  <MoreHorizontal size={15} />
                </motion.button>
              }
              align="right"
              width="sm"
            >
              <div className="py-1">
                <button className="dropdown-item" onClick={() => onEdit(workspace)}>
                  <Edit3 size={14} className="text-surface-400" />Edit workspace
                </button>
                <button className="dropdown-item" onClick={() => navigate('/settings')}>
                  <Settings size={14} className="text-surface-400" />Settings
                </button>
                <div className="my-1 border-t border-surface-100" />
                <button className="dropdown-item danger" onClick={() => onDelete(workspace)}>
                  <Trash2 size={14} className="text-danger-400" />Delete
                </button>
              </div>
            </Dropdown>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed line-clamp-2 mb-4"
          style={{ color: '#64748B', minHeight: 40 }}
        >
          {workspace.description}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-5 mb-4">
          <div className="flex items-center gap-1.5">
            <FolderKanban size={13} style={{ color: workspace.color }} />
            <span className="text-[13px] font-semibold" style={{ color: '#1e293b' }}>{workspace.projectCount}</span>
            <span className="text-[13px]" style={{ color: '#94a3b8' }}>projects</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={13} style={{ color: workspace.color }} />
            <span className="text-[13px] font-semibold" style={{ color: '#1e293b' }}>{members.length}</span>
            <span className="text-[13px]" style={{ color: '#94a3b8' }}>members</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-100">
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((m) => (
              <div key={m.id} className="ring-2 ring-white rounded-full">
                <Avatar name={m.name} size="xs" color={m.color} />
              </div>
            ))}
            {members.length > 5 && (
              <div className="w-6 h-6 rounded-full bg-surface-200 ring-2 ring-white flex items-center justify-center text-[9px] font-bold text-surface-600">
                +{members.length - 5}
              </div>
            )}
          </div>

          {/* Open link */}
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: workspace.color }}
          >
            Open <ArrowUpRight size={12} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Workspace Form ───────────────────────────────────────────────────────────
function WorkspaceForm({ defaultValues, onSubmit, onClose, loading }) {
  const [selectedIcon, setSelectedIcon] = useState(defaultValues?.icon || '🚀');
  const [selectedColor, setSelectedColor] = useState(defaultValues?.color || '#2563EB');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultValues || {},
  });

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, icon: selectedIcon, color: selectedColor });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <Input
        label="Workspace name"
        placeholder="e.g. Engineering Hub"
        error={errors.name?.message}
        required
        {...register('name', { required: 'Workspace name is required' })}
      />

      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">Description</label>
        <textarea
          {...register('description')}
          placeholder="Describe the purpose of this workspace..."
          rows={3}
          className="input-base resize-none"
        />
      </div>

      {/* Icon picker */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">Icon</label>
        <div className="flex flex-wrap gap-2">
          {WORKSPACE_ICONS.map((icon) => (
            <motion.button
              key={icon}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedIcon(icon)}
              className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border-2 transition-all ${
                selectedIcon === icon
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-surface-200 hover:border-surface-300 bg-white'
              }`}
            >
              {icon}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {WORKSPACE_COLORS.map((color) => (
            <motion.button
              key={color}
              type="button"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedColor(color)}
              className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
              style={{ backgroundColor: color }}
            >
              {selectedColor === color && <CheckCircle size={14} className="text-white" />}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={loading}>
          {defaultValues ? 'Save Changes' : 'Create Workspace'}
        </Button>
      </div>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Workspaces() {
  const dispatch = useDispatch();
  const { success, error } = useToast();
  const workspaces = useSelector((state) => state.workspaces.list);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();

  const filtered = workspaces.filter(
    (w) => w.name.toLowerCase().includes(search.toLowerCase()) ||
           w.description?.toLowerCase().includes(search.toLowerCase())
  );

  const totalProjects = workspaces.reduce((sum, w) => sum + (w.projectCount || 0), 0);
  const totalMembers = new Set(workspaces.flatMap((w) => w.members || [])).size;

  const handleCreate = async (data) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    dispatch(addWorkspace({
      id: `ws-${Date.now()}`,
      ...data,
      members: ['user-1'],
      projectCount: 0,
      createdAt: new Date().toISOString(),
      isOwner: true,
      plan: 'Starter',
    }));
    success('Workspace created', `"${data.name}" is ready to use.`);
    setSubmitting(false);
    createModal.close();
  };

  const handleEdit = async (data) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    dispatch(updateWorkspace({ id: editModal.data.id, ...data }));
    success('Workspace updated', 'Changes saved successfully.');
    setSubmitting(false);
    editModal.close();
  };

  const handleDelete = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    dispatch(deleteWorkspace(deleteModal.data.id));
    success('Workspace deleted', `"${deleteModal.data.name}" has been removed.`);
    setSubmitting(false);
    deleteModal.close();
  };

  return (
    <PageTransition className="p-6 max-w-[1400px] mx-auto">

      {/* ── Hero Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative rounded-2xl mb-7"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 45%, #7c3aed 100%)',
          padding: '20px 24px',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)', transform: 'translate(30%, -40%)' }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)', transform: 'translateY(50%)' }}
        />

        {/* Button — absolutely positioned top-right so it never overflows flex */}
        <div className="absolute top-5 right-6" onClick={createModal.open}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm"
            style={{ background: 'white', color: '#2563eb', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
          >
            <Plus size={15} />
            New Workspace
          </motion.button>
        </div>

        {/* Content */}
        <div className="relative pr-44">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Globe size={13} className="text-blue-300" />
            <span style={{ color: '#93c5fd', fontSize: 12, fontWeight: 500 }}>Organization</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-0.5">Workspaces</h1>
          <p style={{ color: '#93c5fd', fontSize: 13 }}>
            Manage all your team workspaces in one place
          </p>

          {/* Quick stats */}
          <div className="flex items-center gap-5 mt-4">
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
                className="flex items-center gap-2"
              >
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.15)' }}
                >
                  <Icon size={13} color="white" />
                </div>
                <div>
                  <p className="font-bold text-white leading-none" style={{ fontSize: 16 }}>{value}</p>
                  <p style={{ color: '#93c5fd', fontSize: 11, marginTop: 2 }}>{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Search bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative mb-6 max-w-sm"
      >
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search workspaces..."
          className="input-base pl-10 w-full"
        />
      </motion.div>

      {/* ── Cards grid ── */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((ws, i) => (
              <WorkspaceCard
                key={ws.id}
                workspace={ws}
                delay={i * 0.07}
                onEdit={editModal.open}
                onDelete={deleteModal.open}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ── Create Modal ── */}
      <Modal isOpen={createModal.isOpen} onClose={createModal.close} title="Create Workspace" subtitle="Set up a new workspace for your team" size="md">
        <WorkspaceForm onSubmit={handleCreate} onClose={createModal.close} loading={submitting} />
      </Modal>

      {/* ── Edit Modal ── */}
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

      {/* ── Delete Confirm Modal ── */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} title="Delete Workspace" size="sm">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-danger-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={22} className="text-danger-600" />
          </div>
          <p className="text-surface-700 mb-1 font-medium">Are you sure you want to delete</p>
          <p className="text-surface-900 font-bold mb-4">"{deleteModal.data?.name}"?</p>
          <p className="text-sm text-surface-500 mb-6">
            This action cannot be undone. All projects and data within this workspace will be permanently deleted.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={deleteModal.close}>Cancel</Button>
            <Button variant="danger" loading={submitting} onClick={handleDelete}>Delete Workspace</Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}
