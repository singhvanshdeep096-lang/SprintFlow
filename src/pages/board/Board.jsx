import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Plus, MessageSquare, Paperclip, Flag, Calendar,
  CheckSquare, User, Search, AlertTriangle,
  SlidersHorizontal, CheckCircle2, Zap, ChevronDown, FolderKanban, Layers,
  Check, X, Trash2
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Drawer from '../../components/common/Drawer/Drawer';
import Modal from '../../components/common/Modal/Modal';
import {
  updateTaskStatusAsync,
  updateTaskAsync,
  addTaskAsync,
  openTaskDrawer,
  closeTaskDrawer,
  openCreateTaskDrawer,
  deleteTaskAsync
} from '../../redux/taskSlice';
import { KANBAN_COLUMNS, PRIORITY_CONFIG, PROJECT_STATUS_CONFIG } from '../../constants';
import { useToast } from '../../hooks/useToast';
import useDebounce from '../../hooks/useDebounce';
import TaskDetail from '../task/TaskDetail';
import userService from '../../services/user.service';
import './Board.css';

/* ---- Task Priority Flag & Badge ---- */
function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;
  return (
    <span
      className="kc-priority-flag"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      <Flag size={10} style={{ color: cfg.color }} />
      {cfg.label}
    </span>
  );
}

/* ---- Card Assignee Picker & Popover Dropdown ---- */
function CardAssigneePicker({ task, assignee, members, currentUser, onUpdateAssignee }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 200);
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
    setSearch('');
  };

  const handleSelect = (e, memberId) => {
    e.stopPropagation();
    if (onUpdateAssignee) {
      onUpdateAssignee(task.id, memberId);
    }
    setIsOpen(false);
  };

  const isAssignedToCurrent = currentUser?.id && task.assigneeId === currentUser.id;

  const filteredMembers = (members || []).filter((m) => {
    const query = debouncedSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      m.name?.toLowerCase().includes(query) ||
      (m.role && m.role.toLowerCase().includes(query)) ||
      (m.email && m.email.toLowerCase().includes(query))
    );
  });

  return (
    <div
      className={`kc-assignee-picker ${isOpen ? 'open' : ''}`}
      ref={pickerRef}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="kc-assignee-trigger"
        onClick={handleToggle}
        title={assignee ? `Assignee: ${assignee.name} (Click to change)` : 'Unassigned (Click to assign)'}
      >
        {assignee ? (
          <div className="kc-assignee-avatar-wrap">
            <Avatar name={assignee.name} size="xs" color={assignee.color} />
            <span className="kc-assignee-change-hint">
              <ChevronDown size={8} />
            </span>
          </div>
        ) : (
          <div className="kc-unassigned-avatar-wrap">
            <User size={11} />
            <span className="kc-assignee-plus">+</span>
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.14 }}
            className="kc-assignee-menu"
          >
            <div className="kc-assignee-menu-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <User size={12} style={{ color: '#2563EB' }} />
                <span>Change Assignee</span>
              </div>
              <button
                type="button"
                className="kc-assignee-menu-close"
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              >
                <X size={12} />
              </button>
            </div>

            {/* Quick "Assign to Me" Button (User can get a task) */}
            {currentUser && (
              <div className="kc-assignee-quick-claim">
                {!isAssignedToCurrent ? (
                  <button
                    type="button"
                    className="kc-claim-btn"
                    onClick={(e) => handleSelect(e, currentUser.id)}
                  >
                    <Zap size={12} className="kc-claim-icon" />
                    <span>Assign to me</span>
                  </button>
                ) : (
                  <div className="kc-already-claimed-tag">
                    <CheckCircle2 size={12} />
                    <span>Assigned to you</span>
                  </div>
                )}
              </div>
            )}

            {/* Search if more than 3 members */}
            {members && members.length > 3 && (
              <div className="kc-assignee-search-wrap">
                <Search size={11} className="kc-assignee-search-icon" />
                <input
                  type="text"
                  placeholder="Filter team..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="kc-assignee-search-input"
                  autoFocus
                />
              </div>
            )}

            <div className="kc-assignee-list">
              {/* Unassigned option */}
              <button
                type="button"
                className={`kc-assignee-item ${!task.assigneeId ? 'active' : ''}`}
                onClick={(e) => handleSelect(e, null)}
              >
                <div className="kc-unassigned-mini-avatar">
                  <User size={11} />
                </div>
                <div className="kc-assignee-item-details">
                  <span className="kc-assignee-item-name">Unassigned</span>
                  <span className="kc-assignee-item-sub">Remove current assignee</span>
                </div>
                {!task.assigneeId && <Check size={13} className="kc-assignee-check" />}
              </button>

              {/* Members */}
              {filteredMembers.map((m) => {
                const isSelected = m.id === task.assigneeId;
                const isMe = m.id === currentUser?.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`kc-assignee-item ${isSelected ? 'active' : ''}`}
                    onClick={(e) => handleSelect(e, m.id)}
                  >
                    <Avatar name={m.name} size="xs" color={m.color} />
                    <div className="kc-assignee-item-details">
                      <span className="kc-assignee-item-name">
                        {m.name} {isMe && <span className="kc-you-badge">You</span>}
                      </span>
                      <span className="kc-assignee-item-sub">{m.role || m.email || 'Team Member'}</span>
                    </div>
                    {isSelected && <Check size={13} className="kc-assignee-check" />}
                  </button>
                );
              })}

              {filteredMembers.length === 0 && (
                <div className="kc-assignee-empty">No members found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- Individual Task Card Component ---- */
function TaskCard({ task, members, currentUser, onOpen, onUpdateAssignee, delay, isAdmin, onDelete }) {
  const assignee  = members.find((m) => m.id === task.assigneeId);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const completedSubtasks = task.subtasks?.filter((s) => s.done).length || 0;
  const totalSubtasks     = task.subtasks?.length || 0;

  // Format issue key e.g. SF-101
  const issueKey = `SF-${task.id?.split('-').pop()?.padStart(3, '0') || '100'}`;

  const statusStripeColors = {
    todo:        '#94A3B8',
    in_progress: '#3B82F6',
    review:      '#F59E0B',
    qa:          '#8B5CF6',
    done:        '#22C55E',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ delay: Math.min(delay, 0.3), duration: 0.22 }}
      onClick={() => onOpen(task)}
      className="kc-card"
    >
      {/* Accent left stripe */}
      <div
        className="kc-stripe"
        style={{ backgroundColor: statusStripeColors[task.status] || '#3B82F6' }}
      />

      {/* Top row: Issue Key + Tag + Priority */}
      <div className="kc-top-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="kc-key-badge">{issueKey}</span>
          {task.labels && task.labels.length > 0 && (
            <span className="kc-label-tag">{task.labels[0]}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <PriorityBadge priority={task.priority} />
          {isAdmin && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(task); }}
              className="kc-del-btn"
              title="Delete ticket (Admin only)"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h4 className="kc-title">{task.title}</h4>

      {/* Subtasks Progress */}
      {totalSubtasks > 0 && (
        <div className="kc-subtasks-wrap">
          <div className="kc-subtasks-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <CheckSquare size={10} />
              <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
            </div>
            <span>{Math.round((completedSubtasks / totalSubtasks) * 100)}%</span>
          </div>
          <div className="kc-progress-track">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="kc-progress-fill-bar"
            />
          </div>
        </div>
      )}

      {/* Footer Meta Row */}
      <div className="kc-footer">
        <div className="kc-footer-left">
          {task.dueDate && (
            <span className={`kc-due-badge ${isOverdue ? 'kc-due-badge--overdue' : 'kc-due-badge--normal'}`}>
              <Calendar size={10} />
              {task.dueDate}
            </span>
          )}
          {task.commentCount > 0 && (
            <span className="kc-counter-item">
              <MessageSquare size={10} />
              {task.commentCount}
            </span>
          )}
          {task.attachmentCount > 0 && (
            <span className="kc-counter-item">
              <Paperclip size={10} />
              {task.attachmentCount}
            </span>
          )}
        </div>

        {/* Interactive Assignee Picker at bottom-right */}
        <CardAssigneePicker
          task={task}
          assignee={assignee}
          members={members}
          currentUser={currentUser}
          onUpdateAssignee={onUpdateAssignee}
        />
      </div>
    </motion.div>
  );
}

/* ---- Inline Quick Add Task Form ---- */
function AddTaskInline({ columnStatus, projectId, onAdd, onCancel }) {
  const [title, setTitle] = useState('');
  const { success }       = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      status: columnStatus,
      priority: 'medium',
      projectId: projectId || 'proj-1',
      labels: ['General'],
      subtasks: [],
    });
    success('Task created', `"${title}" added to the board.`);
    setTitle('');
    onCancel();
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="kanban-inline-add-card"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="kanban-inline-add-input"
        onKeyDown={(e) => e.key === 'Escape' && onCancel()}
      />
      <div className="kanban-inline-add-btns">
        <Button type="submit" size="xs" disabled={!title.trim()}>Add Task</Button>
        <Button type="button" size="xs" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </motion.form>
  );
}

/* ---- Kanban Column Component ---- */
function KanbanColumn({ column, tasks, members, currentUser, projectId, onAddTask, onOpenTask, onUpdateAssignee, isAdmin, onDeleteTask }) {
  const [addingTask, setAddingTask] = useState(false);
  const dispatch = useDispatch();
  const [dragOver, setDragOver]     = useState(false);

  const handleDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop      = (e) => {
    e.preventDefault();
    setDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      dispatch(updateTaskStatusAsync({ taskId, status: column.status }));
    }
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const handleOpenCreateDrawer = () => {
    dispatch(openCreateTaskDrawer({ projectId, status: column.status, onBoard: true }));
  };

  return (
    <div className="kanban-col">

      {/* Header */}
      <div className="kanban-col-header">
        <div className="kanban-col-title-left">
          <div className="kanban-col-status-dot" style={{ backgroundColor: column.color }} />
          <span className="kanban-col-title-name">{column.title}</span>
          <span className="kanban-col-count-pill">{tasks.length}</span>
        </div>
        <div className="kanban-col-header-right">
          <button
            onClick={handleOpenCreateDrawer}
            className="kanban-col-add-icon-btn"
            title={`Add task to ${column.title}`}
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Cards Dropzone Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`kanban-col-dropzone ${dragOver ? 'kanban-col-dropzone--active' : ''}`}
      >
        <AnimatePresence>
          {tasks.map((task, i) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
            >
              <TaskCard
                task={task}
                members={members}
                currentUser={currentUser}
                onOpen={onOpenTask}
                onUpdateAssignee={onUpdateAssignee}
                delay={i * 0.03}
                isAdmin={isAdmin}
                onDelete={onDeleteTask}
              />
            </div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {addingTask && (
            <AddTaskInline
              columnStatus={column.status}
              projectId={projectId}
              onAdd={onAddTask}
              onCancel={() => setAddingTask(false)}
            />
          )}
        </AnimatePresence>

        {tasks.length === 0 && !addingTask && (
          <div className="kanban-empty-drop-msg">
            <CheckSquare size={20} style={{ opacity: 0.4 }} />
            <p className="kanban-empty-drop-text">No tasks in {column.title}</p>
          </div>
        )}
      </div>

    </div>
  );
}

/* ---- Main Board Page Component ---- */
export default function Board() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentUser = useSelector((state) => state.auth.user);
  const projects = useSelector((state) => state.projects.list);
  const tasks    = useSelector((state) => state.tasks.list);
  const selectedTask = useSelector((state) => state.tasks.selected);
  const isDrawerOpen = useSelector((state) => state.tasks.isDrawerOpen);
  const { success, error: toastError } = useToast();

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [search, setSearch]                 = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [activeTab, setActiveTab]           = useState('all');
  const [allUsers, setAllUsers]             = useState([]);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [isDeleting, setIsDeleting]         = useState(false);
  const isAdmin = currentUser?.role?.toLowerCase() === 'admin' || currentUser?.is_superuser === true;

  useEffect(() => {
    userService.getUsers().then((data) => setAllUsers(data)).catch(() => {});
  }, []);

  // Initialize selected project
  useEffect(() => {
    if (projects.length === 0) return;

    const paramProjectId = searchParams.get('project');
    if (paramProjectId && projects.some((p) => p.id === paramProjectId)) {
      setSelectedProjectId(paramProjectId);
      return;
    }

    if (!selectedProjectId || !projects.some((p) => p.id === selectedProjectId)) {
      // Pick first active running project, or fallback to first project
      const activeRunningProject = projects.find(
        (p) => (p.status === 'active' || p.status === 'in_progress')
      ) || projects[0];
      
      setSelectedProjectId(activeRunningProject?.id || null);
      if (activeRunningProject) {
        setSearchParams({ project: activeRunningProject.id }, { replace: true });
      }
    }
  }, [projects, searchParams, selectedProjectId, setSearchParams]);

  const handleSelectProject = (projId) => {
    setSelectedProjectId(projId);
    setSearchParams({ project: projId });
    setProjectDropdownOpen(false);
    setAssigneeFilter('all');
  };

  // Find currently selected project object
  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0] || null;
  }, [projects, selectedProjectId]);

  // Project-specific members
  const projectMembers = useMemo(() => {
    if (!currentProject || !currentProject.members) return allUsers;
    return allUsers.filter((u) => currentProject.members.includes(u.id));
  }, [currentProject, allUsers]);

  // Tasks scoped to the selected project (only tasks designated for board)
  const projectTasks = useMemo(() => {
    if (!currentProject) return [];
    return tasks.filter((t) => t.projectId === currentProject.id && t.onBoard !== false);
  }, [tasks, currentProject]);

  // Filter tasks based on search, assignee, and activeTab
  const filteredTasks = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    return projectTasks.filter((t) => {
      const matchSearch   = !query ||
                            t.title.toLowerCase().includes(query) ||
                            t.id?.toLowerCase().includes(query) ||
                            t.description?.toLowerCase().includes(query);
      const matchAssignee = assigneeFilter === 'all' || t.assigneeId === assigneeFilter;
      const matchTab      = activeTab === 'all' || (activeTab === 'my' && t.assigneeId === currentUser?.id);
      return matchSearch && matchAssignee && matchTab;
    });
  }, [projectTasks, debouncedSearch, assigneeFilter, activeTab, currentUser]);

  const getColumnTasks = (status) => filteredTasks.filter((t) => t.status === status);

  const doneTasks   = projectTasks.filter((t) => t.status === 'done').length;
  const progressPct = projectTasks.length > 0 ? Math.round((doneTasks / projectTasks.length) * 100) : 0;

  const handleAddTask     = (taskData) => dispatch(addTaskAsync({ ...taskData, projectId: currentProject?.id, onBoard: true }));
  const handleOpenTask    = (task) => dispatch(openTaskDrawer(task));
  const handleCloseDrawer = () => dispatch(closeTaskDrawer());

  const handleUpdateAssignee = async (taskId, newAssigneeId) => {
    try {
      await dispatch(updateTaskAsync({ id: taskId, data: { assigneeId: newAssigneeId || null } })).unwrap();
      const allAvailable = projectMembers.length > 0 ? projectMembers : allUsers;
      const target = allAvailable.find((u) => u.id === newAssigneeId);
      if (newAssigneeId === currentUser?.id) {
        success('Task Claimed', 'You have been assigned to this task.');
      } else if (newAssigneeId) {
        success('Assignee Updated', `Task assigned to ${target?.name || 'team member'}.`);
      } else {
        success('Assignee Removed', 'Task is now unassigned.');
      }
    } catch (err) {
      toastError('Update Failed', err.message || 'Could not update task assignee');
    }
  };

  // Empty state if no assigned projects exist
  if (projects.length === 0) {
    return (
      <PageTransition className="board-page-container">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <EmptyState
            icon={<FolderKanban size={40} />}
            title="No Assigned Projects Found"
            description="You are not currently assigned to any active projects. Contact an administrator to be added to a project board."
          />
        </div>
      </PageTransition>
    );
  }

  const projectStatusCfg = currentProject
    ? PROJECT_STATUS_CONFIG[currentProject.status] || PROJECT_STATUS_CONFIG.active
    : PROJECT_STATUS_CONFIG.active;

  return (
    <PageTransition className="board-page-container">

      {/* ------------------------------------------------
          1. Sprint Top Header Bar with Project Selector
         ------------------------------------------------ */}
      <div className="sprint-header-bar">
        <div className="sprint-info-left">
          
          {/* Project Selector Dropdown */}
          <div className="board-project-selector-wrap">
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className="board-project-selector-btn"
              title="Switch Project Board"
            >
              <span className="board-project-icon" style={{ backgroundColor: `${currentProject?.color || '#2563EB'}22` }}>
                {currentProject?.icon || '⚡'}
              </span>
              <div className="board-project-title-group">
                <span className="board-project-name">{currentProject?.name || 'Select Project'}</span>
                <span className="board-project-badge" style={{ backgroundColor: projectStatusCfg.bg, color: projectStatusCfg.color }}>
                  {projectStatusCfg.label}
                </span>
              </div>
              {projects.length > 1 && <ChevronDown size={14} className={`board-chevron ${projectDropdownOpen ? 'open' : ''}`} />}
            </button>

            {/* Project Picker Dropdown Menu */}
            <AnimatePresence>
              {projectDropdownOpen && projects.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="board-project-dropdown-menu"
                >
                  <div className="board-project-dropdown-header">
                    <Layers size={13} />
                    <span>Your Assigned Projects ({projects.length})</span>
                  </div>
                  <div className="board-project-dropdown-list">
                    {projects.map((p) => {
                      const isSelected = p.id === currentProject?.id;
                      const sCfg = PROJECT_STATUS_CONFIG[p.status] || PROJECT_STATUS_CONFIG.active;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSelectProject(p.id)}
                          className={`board-project-dropdown-item ${isSelected ? 'active' : ''}`}
                        >
                          <span className="board-project-item-icon" style={{ backgroundColor: `${p.color || '#2563EB'}20` }}>
                            {p.icon || '⚡'}
                          </span>
                          <div className="board-project-item-text">
                            <span className="board-project-item-name">{p.name}</span>
                            <span className="board-project-item-status" style={{ color: sCfg.color }}>
                              ● {sCfg.label} · {p.taskCount || 0} issues
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 size={15} style={{ color: '#2563EB', marginLeft: 'auto' }} />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="sprint-header-divider" />

          <div className="sprint-stats-summary">
            <div className="sprint-stat-box">
              <span className="sprint-stat-label">Progress</span>
              <span className="sprint-stat-val sprint-stat-val--highlight">{progressPct}% ({doneTasks}/{projectTasks.length})</span>
            </div>
            <div className="sprint-stat-box">
              <span className="sprint-stat-label">Team Members</span>
              <span className="sprint-stat-val">{projectMembers.length} active</span>
            </div>
          </div>
        </div>

        <div className="sprint-header-actions">
          <button
            className="sprint-action-btn-secondary"
            onClick={() => navigate(`/projects/${currentProject?.id}`)}
          >
            <SlidersHorizontal size={13} /> Project Details
          </button>
          <button
            className="sprint-action-btn-primary"
            onClick={() => dispatch(openCreateTaskDrawer({ projectId: currentProject?.id, status: 'todo', onBoard: true }))}
          >
            <Plus size={14} /> New Task
          </button>
        </div>
      </div>

      {/* ------------------------------------------------
          2. Filters & Search Control Bar
         ------------------------------------------------ */}
      <div className="board-toolbar">
        <div className="board-filter-left">
          {/* Quick Tabs */}
          <div className="board-filter-tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`board-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              All Tasks ({projectTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`board-tab-btn ${activeTab === 'my' ? 'active' : ''}`}
            >
              My Tasks
            </button>
          </div>

          {/* Member Avatar Filter (Scoped to Project Members) */}
          <div className="board-avatars-filter">
            {[{ id: 'all', name: 'All' }, ...projectMembers.slice(0, 6)].map((m) => (
              <button
                key={m.id}
                onClick={() => setAssigneeFilter(m.id)}
                className={`board-avatar-btn ${assigneeFilter === m.id ? 'active' : ''}`}
                title={m.name}
              >
                {m.id === 'all' ? (
                  <div className="board-all-pill">ALL</div>
                ) : (
                  <Avatar name={m.name} size="xs" color={m.color} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="board-filter-right">
          {/* Search Box */}
          <div className="board-search-box">
            <Search size={13} className="board-search-icon-inside" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or key..."
              className="board-search-input-field"
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------
          3. Kanban Columns Flex Canvas Area
         ------------------------------------------------ */}
      <div className="board-canvas-area" onClick={() => projectDropdownOpen && setProjectDropdownOpen(false)}>
        <div className="board-columns-flex">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getColumnTasks(column.status)}
              members={projectMembers.length > 0 ? projectMembers : allUsers}
              currentUser={currentUser}
              projectId={currentProject?.id}
              onAddTask={handleAddTask}
              onOpenTask={handleOpenTask}
              onUpdateAssignee={handleUpdateAssignee}
              isAdmin={isAdmin}
              onDeleteTask={(t) => setTicketToDelete(t)}
            />
          ))}
        </div>
      </div>

      {/* Task Detail Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        width="xl"
        title={selectedTask?.title}
        subtitle={`#SF-${selectedTask?.id?.split('-').pop()?.padStart(3, '0')} · ${selectedTask?.projectId}`}
      >
        {selectedTask && <TaskDetail task={selectedTask} />}
      </Drawer>

      {/* Admin Ticket Deletion Modal */}
      <Modal
        isOpen={Boolean(ticketToDelete)}
        onClose={() => setTicketToDelete(null)}
        title="Delete Ticket"
        size="sm"
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="ghost" onClick={() => setTicketToDelete(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!ticketToDelete) return;
                setIsDeleting(true);
                try {
                  await dispatch(deleteTaskAsync(ticketToDelete.id)).unwrap();
                  success('Ticket Deleted', `"${ticketToDelete.title}" has been deleted.`);
                  setTicketToDelete(null);
                } catch (err) {
                  error('Delete Failed', err?.message || 'Could not delete ticket.');
                } finally {
                  setIsDeleting(false);
                }
              }}
              loading={isDeleting}
              icon={<Trash2 size={14} />}
            >
              Delete Permanently
            </Button>
          </div>
        }
      >
        <p style={{ fontSize: 14, color: 'var(--color-surface-600)', lineHeight: 1.6 }}>
          Are you sure you want to delete ticket <strong>"{ticketToDelete?.title}"</strong>? This will permanently remove the ticket from the board.
        </p>
      </Modal>
    </PageTransition>
  );
}

