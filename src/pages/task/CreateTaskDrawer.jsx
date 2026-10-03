import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import {
  X, Plus, Flag, Calendar, User, Tag, Clock, Layers,
  ChevronDown, CheckCircle2, AlertCircle, FileText, CheckSquare, Send, Kanban
} from 'lucide-react';
import Drawer from '../../components/common/Drawer/Drawer';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import { addTaskAsync, closeCreateTaskDrawer } from '../../redux/taskSlice';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../constants';
import { useToast } from '../../hooks/useToast';
import userService from '../../services/user.service';
import './CreateTaskDrawer.css';

const PRESET_LABELS = [
  'Frontend', 'Backend', 'UI/UX', 'Bug', 'Feature', 'API', 'Security', 'Database', 'DevOps', 'Mobile'
];

export default function CreateTaskDrawer() {
  const dispatch = useDispatch();
  const { success, error } = useToast();

  const isCreateDrawerOpen = useSelector((state) => state.tasks.isCreateDrawerOpen);
  const createDrawerDefaults = useSelector((state) => state.tasks.createDrawerDefaults);
  const projects = useSelector((state) => state.projects.list);
  const currentUser = useSelector((state) => state.auth.user);

  const [allUsers, setAllUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(8);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [onBoard, setOnBoard] = useState(true);

  // Dropdown toggles
  const [statusOpen, setStatusOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  // Validation
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    userService.getUsers().then((data) => setAllUsers(data)).catch(() => {});
  }, []);

  // Initialize or reset form when drawer opens or defaults change
  useEffect(() => {
    if (isCreateDrawerOpen) {
      const defaultProjId = createDrawerDefaults?.projectId || projects[0]?.id || '';
      setProjectId(defaultProjId);
      setStatus(createDrawerDefaults?.status || 'todo');
      setPriority(createDrawerDefaults?.priority || 'medium');
      setAssigneeId(currentUser?.id || '');
      setTitle('');
      setDescription('');
      
      // Default due date: 7 days from today
      const today = new Date();
      today.setDate(today.getDate() + 7);
      const defaultDateStr = today.toISOString().split('T')[0];
      setDueDate(defaultDateStr);

      setEstimatedHours(8);
      setSelectedLabels(['Feature']);
      setSubtasks([]);
      setOnBoard(createDrawerDefaults?.onBoard !== undefined ? Boolean(createDrawerDefaults.onBoard) : true);
      setTitleError(false);
      setIsSubmitting(false);
    }
  }, [isCreateDrawerOpen, createDrawerDefaults, projects, currentUser]);

  const currentProject = useMemo(() => {
    return projects.find((p) => p.id === projectId) || projects[0] || null;
  }, [projects, projectId]);

  const projectMembers = useMemo(() => {
    if (!currentProject || !currentProject.members) return allUsers;
    return allUsers.filter((u) => currentProject.members.includes(u.id));
  }, [currentProject, allUsers]);

  const handleClose = () => {
    dispatch(closeCreateTaskDrawer());
  };

  const toggleLabel = (label) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((l) => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const handleAddCustomTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && customTagInput.trim()) {
      e.preventDefault();
      const tag = customTagInput.trim().replace(/,/g, '');
      if (tag && !selectedLabels.includes(tag)) {
        setSelectedLabels([...selectedLabels, tag]);
      }
      setCustomTagInput('');
    }
  };

  const handleAddSubtask = (e) => {
    if (e.key === 'Enter' && newSubtaskTitle.trim()) {
      e.preventDefault();
      setSubtasks([
        ...subtasks,
        { id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, title: newSubtaskTitle.trim(), done: false }
      ]);
      setNewSubtaskTitle('');
    }
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      setTitleError(true);
      error('Title required', 'Please enter a title for the task.');
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        status: status || 'todo',
        priority: priority || 'medium',
        projectId: projectId || projects[0]?.id || 'proj-1',
        assigneeId: assigneeId || currentUser?.id,
        reporterId: currentUser?.id,
        dueDate: dueDate || null,
        estimatedHours: Number(estimatedHours) || 0,
        labels: selectedLabels,
        subtasks: subtasks,
        onBoard: Boolean(onBoard),
      };

      await dispatch(addTaskAsync(taskData)).unwrap();
      success('Task Created Successfully', `"${title.trim()}" has been created.`);
      handleClose();
    } catch (err) {
      error('Failed to create task', err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAssignee = allUsers.find((u) => u.id === assigneeId);
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.todo;
  const priorityCfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;

  return (
    <Drawer
      isOpen={isCreateDrawerOpen}
      onClose={handleClose}
      width="2xl"
      title="Create Task"
      subtitle="Fill in the details below to create a new task for your project"
    >
      <form onSubmit={handleSubmit} className="ctd-form-container">
        
        {/* Project Selector Bar */}
        <div className="ctd-section ctd-project-row">
          <label className="ctd-field-label">
            <Layers size={13} /> Project
          </label>
          <div className="ctd-dropdown-wrap">
            <button
              type="button"
              onClick={() => { setProjectOpen(!projectOpen); setStatusOpen(false); setPriorityOpen(false); setAssigneeOpen(false); }}
              className="ctd-selector-btn"
            >
              <span className="ctd-project-icon" style={{ backgroundColor: `${currentProject?.color || '#2563EB'}22` }}>
                {currentProject?.icon || '⚡'}
              </span>
              <span className="ctd-selector-text font-medium">{currentProject?.name || 'Select Project'}</span>
              {projects.length > 1 && <ChevronDown size={14} className="ctd-chevron-icon" />}
            </button>

            <AnimatePresence>
              {projectOpen && projects.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="ctd-dropdown-menu"
                >
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setProjectId(p.id); setProjectOpen(false); }}
                      className={`ctd-dropdown-option ${p.id === projectId ? 'active' : ''}`}
                    >
                      <span className="ctd-project-icon" style={{ backgroundColor: `${p.color || '#2563EB'}22` }}>
                        {p.icon || '⚡'}
                      </span>
                      <span>{p.name}</span>
                      {p.id === projectId && <CheckCircle2 size={14} style={{ marginLeft: 'auto', color: '#2563EB' }} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Board Visibility Toggle */}
        <div className="ctd-section ctd-board-toggle-row">
          <div className="ctd-board-toggle-info">
            <span className="ctd-field-label" style={{ marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Kanban size={13} /> Add to Kanban Board
            </span>
            <span className="ctd-field-hint">
              {onBoard ? 'Task will appear as a card on the project Kanban board' : 'Task list only (will not appear on the Kanban board)'}
            </span>
          </div>
          <label className="ctd-switch">
            <input
              type="checkbox"
              checked={onBoard}
              onChange={(e) => setOnBoard(e.target.checked)}
            />
            <span className="ctd-switch-slider" />
          </label>
        </div>

        {/* Task Title Input */}
        <div className="ctd-section">
          <div className="ctd-label-row">
            <label className="ctd-field-label">
              Task Title <span className="ctd-required-star">*</span>
            </label>
            {titleError && (
              <span className="ctd-error-hint">
                <AlertCircle size={12} /> Title is required
              </span>
            )}
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (titleError) setTitleError(false); }}
            placeholder="What needs to be done? (e.g. Implement user authentication)"
            className={`input-base ctd-title-input ${titleError ? 'ctd-input-error' : ''}`}
            autoFocus
          />
        </div>

        {/* Quick Attributes Row: Status & Priority */}
        <div className="ctd-grid-2">
          
          {/* Status Selector */}
          <div className="ctd-section">
            <label className="ctd-field-label">Status</label>
            <div className="ctd-dropdown-wrap">
              <button
                type="button"
                onClick={() => { setStatusOpen(!statusOpen); setPriorityOpen(false); setAssigneeOpen(false); setProjectOpen(false); }}
                className="ctd-badge-btn"
                style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
              >
                <span className="ctd-status-dot" style={{ backgroundColor: statusCfg.dotColor }} />
                <span>{statusCfg.label}</span>
                <ChevronDown size={13} style={{ marginLeft: 'auto' }} />
              </button>

              <AnimatePresence>
                {statusOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="ctd-dropdown-menu"
                  >
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => { setStatus(key); setStatusOpen(false); }}
                        className={`ctd-dropdown-option ${key === status ? 'active' : ''}`}
                      >
                        <span className="ctd-status-dot" style={{ backgroundColor: cfg.dotColor }} />
                        <span>{cfg.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Priority Selector */}
          <div className="ctd-section">
            <label className="ctd-field-label">Priority</label>
            <div className="ctd-dropdown-wrap">
              <button
                type="button"
                onClick={() => { setPriorityOpen(!priorityOpen); setStatusOpen(false); setAssigneeOpen(false); setProjectOpen(false); }}
                className="ctd-badge-btn"
                style={{ backgroundColor: priorityCfg.bg, color: priorityCfg.color }}
              >
                <Flag size={12} style={{ color: priorityCfg.color }} />
                <span>{priorityCfg.label}</span>
                <ChevronDown size={13} style={{ marginLeft: 'auto' }} />
              </button>

              <AnimatePresence>
                {priorityOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="ctd-dropdown-menu"
                  >
                    {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => { setPriority(key); setPriorityOpen(false); }}
                        className={`ctd-dropdown-option ${key === priority ? 'active' : ''}`}
                      >
                        <Flag size={12} style={{ color: cfg.color }} />
                        <span>{cfg.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Description Textarea */}
        <div className="ctd-section">
          <div className="ctd-label-row">
            <label className="ctd-field-label">
              <FileText size={13} /> Description
            </label>
            <span className="ctd-field-sublabel">Markdown supported</span>
          </div>
          <div className="ctd-desc-wrap">
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add detailed description, reproduction steps, acceptance criteria, or technical notes..."
              className="ctd-textarea"
            />
          </div>
        </div>

        {/* People: Assignee & Reporter */}
        <div className="ctd-grid-2">
          
          {/* Assignee */}
          <div className="ctd-section">
            <label className="ctd-field-label">
              <User size={13} /> Assignee
            </label>
            <div className="ctd-dropdown-wrap">
              <button
                type="button"
                onClick={() => { setAssigneeOpen(!assigneeOpen); setStatusOpen(false); setPriorityOpen(false); setProjectOpen(false); }}
                className="ctd-user-btn"
              >
                {selectedAssignee ? (
                  <>
                    <Avatar name={selectedAssignee.name} size="xs" color={selectedAssignee.color} />
                    <span className="ctd-user-name">{selectedAssignee.name}</span>
                  </>
                ) : (
                  <>
                    <div className="ctd-unassigned-avatar">
                      <User size={12} />
                    </div>
                    <span className="ctd-user-name-muted">Unassigned</span>
                  </>
                )}
                <ChevronDown size={13} style={{ marginLeft: 'auto' }} />
              </button>

              <AnimatePresence>
                {assigneeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="ctd-dropdown-menu"
                  >
                    <button
                      type="button"
                      onClick={() => { setAssigneeId(''); setAssigneeOpen(false); }}
                      className={`ctd-dropdown-option ${!assigneeId ? 'active' : ''}`}
                    >
                      <div className="ctd-unassigned-avatar">
                        <User size={12} />
                      </div>
                      <span>Unassigned</span>
                    </button>
                    {projectMembers.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => { setAssigneeId(m.id); setAssigneeOpen(false); }}
                        className={`ctd-dropdown-option ${m.id === assigneeId ? 'active' : ''}`}
                      >
                        <Avatar name={m.name} size="xs" color={m.color} />
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</span>
                          <span style={{ fontSize: 10, color: 'var(--color-surface-400)' }}>{m.role || 'Member'}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Reporter */}
          <div className="ctd-section">
            <label className="ctd-field-label">
              <User size={13} /> Reporter
            </label>
            <div className="ctd-readonly-user-box">
              <Avatar name={currentUser?.name || 'User'} size="xs" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="ctd-user-name">{currentUser?.name || 'User'} (You)</span>
                <span style={{ fontSize: 10, color: 'var(--color-surface-400)' }}>{currentUser?.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Planning: Due Date & Estimated Hours */}
        <div className="ctd-grid-2">
          
          {/* Due Date */}
          <div className="ctd-section">
            <label className="ctd-field-label">
              <Calendar size={13} /> Due Date
            </label>
            <div className="ctd-input-with-icon">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-base ctd-date-input"
              />
            </div>
          </div>

          {/* Story Points / Estimated Hours */}
          <div className="ctd-section">
            <label className="ctd-field-label">
              <Clock size={13} /> Estimated Time / Points
            </label>
            <div className="ctd-hours-input-wrap">
              <input
                type="number"
                min="0"
                max="100"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="input-base ctd-hours-input"
              />
              <span className="ctd-hours-suffix">hours</span>
            </div>
          </div>

        </div>

        {/* Labels / Tags */}
        <div className="ctd-section">
          <label className="ctd-field-label">
            <Tag size={13} /> Labels & Tags
          </label>
          
          <div className="ctd-labels-preset-wrap">
            {PRESET_LABELS.map((lbl) => {
              const isSelected = selectedLabels.includes(lbl);
              return (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => toggleLabel(lbl)}
                  className={`ctd-preset-tag ${isSelected ? 'active' : ''}`}
                >
                  {lbl}
                  {isSelected && <CheckCircle2 size={11} />}
                </button>
              );
            })}
          </div>

          <div className="ctd-custom-tag-row">
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={handleAddCustomTag}
              placeholder="Type a custom tag and press Enter..."
              className="input-base ctd-custom-tag-input"
            />
          </div>
        </div>

        {/* Subtask Checklist (Optional) */}
        <div className="ctd-section">
          <div className="ctd-label-row">
            <label className="ctd-field-label">
              <CheckSquare size={13} /> Subtasks / Acceptance Checklist
            </label>
            <span className="ctd-field-sublabel">{subtasks.length} items</span>
          </div>

          {subtasks.length > 0 && (
            <div className="ctd-subtasks-list">
              {subtasks.map((st) => (
                <div key={st.id} className="ctd-subtask-item">
                  <div className="ctd-subtask-bullet" />
                  <span className="ctd-subtask-text">{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="ctd-subtask-del-btn"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="ctd-add-subtask-input-wrap">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={handleAddSubtask}
              placeholder="Add a subtask or checklist item (Press Enter)..."
              className="input-base ctd-subtask-input"
            />
            {newSubtaskTitle.trim() && (
              <button
                type="button"
                onClick={handleAddSubtask}
                className="ctd-subtask-add-btn"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Actions Footer */}
        <div className="ctd-footer">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={<Send size={14} />}
            loading={isSubmitting}
            disabled={!title.trim() || isSubmitting}
          >
            Create Task
          </Button>
        </div>

      </form>
    </Drawer>
  );
}
