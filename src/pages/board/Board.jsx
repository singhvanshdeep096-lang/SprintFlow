import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Plus, MessageSquare, Paperclip, Flag, Calendar,
  CheckSquare, User, Search, AlertTriangle, ShieldAlert,
  SlidersHorizontal, CheckCircle2, Zap
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Drawer from '../../components/common/Drawer/Drawer';
import { updateTaskStatusAsync, addTaskAsync, openTaskDrawer, closeTaskDrawer } from '../../redux/taskSlice';
import { KANBAN_COLUMNS, PRIORITY_CONFIG } from '../../constants';
import { useToast } from '../../hooks/useToast';
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

/* ---- Individual Task Card Component ---- */
function TaskCard({ task, members, onOpen, delay }) {
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
        <PriorityBadge priority={task.priority} />
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

        {/* Assignee Avatar at bottom-right */}
        <div>
          {assignee ? (
            <Avatar name={assignee.name} size="xs" color={assignee.color} />
          ) : (
            <div style={{ width: 20, height: 20, borderRadius: 9999, background: 'var(--color-surface-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={10} style={{ color: 'var(--color-surface-400)' }} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ---- Inline Quick Add Task Form ---- */
function AddTaskInline({ columnStatus, onAdd, onCancel }) {
  const [title, setTitle] = useState('');
  const { success }       = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      status: columnStatus,
      priority: 'medium',
      projectId: 'proj-1',
      assigneeId: 'user-1',
      labels: ['Frontend'],
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
        <Button type="submit" size="xs" disabled={!title.trim()}>Add Issue</Button>
        <Button type="button" size="xs" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </motion.form>
  );
}

/* ---- Kanban Column Component ---- */
function KanbanColumn({ column, tasks, members, onAddTask, onOpenTask }) {
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

  // Sum estimated story points
  const points = tasks.reduce((sum, t) => sum + (t.estimatedHours || 3), 0);

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
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-surface-400)', marginRight: 4 }}>
            {points} pts
          </span>
          <button
            onClick={() => setAddingTask(true)}
            className="kanban-col-add-icon-btn"
            title="Add issue"
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
        <AnimatePresence mode="popLayout">
          {tasks.map((task, i) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
            >
              <TaskCard task={task} members={members} onOpen={onOpenTask} delay={i * 0.03} />
            </div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {addingTask && (
            <AddTaskInline
              columnStatus={column.status}
              onAdd={onAddTask}
              onCancel={() => setAddingTask(false)}
            />
          )}
        </AnimatePresence>

        {tasks.length === 0 && !addingTask && (
          <div className="kanban-empty-drop-msg">
            <CheckSquare size={20} style={{ opacity: 0.4 }} />
            <p className="kanban-empty-drop-text">No issues in {column.title}</p>
          </div>
        )}
      </div>

      {/* Bottom Add Task Button */}
      {!addingTask && (
        <button
          onClick={() => setAddingTask(true)}
          className="kanban-col-add-bottom-btn"
        >
          <Plus size={14} /> Create issue
        </button>
      )}
    </div>
  );
}

/* ---- Main Board Page Component ---- */
export default function Board() {
  const dispatch = useDispatch();
  const tasks    = useSelector((state) => state.tasks.list);
  const selectedTask = useSelector((state) => state.tasks.selected);
  const isDrawerOpen = useSelector((state) => state.tasks.isDrawerOpen);

  const [search, setSearch]                 = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [activeTab, setActiveTab]           = useState('all');
  const [members, setMembers]               = useState([]);

  useEffect(() => {
    userService.getUsers().then((data) => setMembers(data)).catch(() => {});
  }, []);

  // Filtering
  const filteredTasks = tasks.filter((t) => {
    const matchSearch   = t.title.toLowerCase().includes(search.toLowerCase()) ||
                          t.id?.toLowerCase().includes(search.toLowerCase());
    const matchAssignee = assigneeFilter === 'all' || t.assigneeId === assigneeFilter;
    const matchTab      = activeTab === 'all' || (activeTab === 'my' && t.assigneeId === 'user-1');
    return matchSearch && matchAssignee && matchTab;
  });

  const getColumnTasks = (status) => filteredTasks.filter((t) => t.status === status);

  const totalPoints = tasks.reduce((sum, t) => sum + (t.estimatedHours || 3), 0);
  const doneTasks   = tasks.filter((t) => t.status === 'done').length;
  const progressPct = Math.round((doneTasks / (tasks.length || 1)) * 100);

  const handleAddTask     = (taskData) => dispatch(addTaskAsync(taskData));
  const handleOpenTask    = (task) => dispatch(openTaskDrawer(task));
  const handleCloseDrawer = () => dispatch(closeTaskDrawer());

  return (
    <PageTransition className="board-page-container">

      {/* ------------------------------------------------
          1. Sprint Top Header Bar (Jira / Linear Style)
         ------------------------------------------------ */}
      <div className="sprint-header-bar">
        <div className="sprint-info-left">
          <span className="sprint-tag-badge">
            <Zap size={11} /> ACTIVE SPRINT
          </span>
          <h2 className="sprint-title-text">RP1 Sprint 2 · SprintFlow v2.0</h2>
          <span className="sprint-date-range">Jul 20 – Jul 31</span>

          <div className="sprint-header-divider" />

          <div className="sprint-stats-summary">
            <div className="sprint-stat-box">
              <span className="sprint-stat-label">Progress</span>
              <span className="sprint-stat-val sprint-stat-val--highlight">{progressPct}% ({doneTasks}/{tasks.length})</span>
            </div>
            <div className="sprint-stat-box">
              <span className="sprint-stat-label">Story Points</span>
              <span className="sprint-stat-val">{totalPoints} pts</span>
            </div>
          </div>

          <div className="sprint-health-banner">
            <ShieldAlert size={13} />
            <span>Sprint Health: 85% On Track</span>
          </div>
        </div>

        <div className="sprint-header-actions">
          <button className="sprint-action-btn-secondary">
            <SlidersHorizontal size={13} /> Sprint Options
          </button>
          <button className="sprint-action-btn-primary" onClick={() => dispatch(addTaskAsync({ title: 'New Board Issue', status: 'todo', priority: 'high', projectId: 'proj-1' }))}>
            <Plus size={14} /> + New Issue
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
              All Issues ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`board-tab-btn ${activeTab === 'my' ? 'active' : ''}`}
            >
              My Issues
            </button>
          </div>

          {/* Member Avatar Filter */}
          <div className="board-avatars-filter">
            {[{ id: 'all', name: 'All' }, ...members.slice(0, 5)].map((m) => (
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
      <div className="board-canvas-area">
        <div className="board-columns-flex">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getColumnTasks(column.status)}
              members={members}
              onAddTask={handleAddTask}
              onOpenTask={handleOpenTask}
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
    </PageTransition>
  );
}
