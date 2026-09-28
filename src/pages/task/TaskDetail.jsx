import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Flag, Calendar, User, Tag, MessageSquare, CheckSquare,
  ChevronDown, Send, Clock, CheckCircle2, Edit2, Check, X,
  Zap, Search
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import { updateTaskAsync, updateTaskStatusAsync } from '../../redux/taskSlice';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../constants';
import { useToast } from '../../hooks/useToast';
import userService from '../../services/user.service';
import taskService from '../../services/task.service';
import './Tasks.css';

/* ---- Inline status dropdown ---- */
function StatusSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const statusCfg = STATUS_CONFIG[value] || STATUS_CONFIG.todo;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="td-select-btn"
        style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
      >
        <span className="td-select-dot" style={{ backgroundColor: statusCfg.dotColor }} />
        {statusCfg.label}
        <ChevronDown size={12} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="td-dropdown"
          >
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => { onChange(key); setOpen(false); }}
                className="td-dropdown-item"
              >
                <span className="td-select-dot" style={{ backgroundColor: cfg.dotColor }} />
                {cfg.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- Inline priority dropdown ---- */
function PrioritySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const cfg = PRIORITY_CONFIG[value] || PRIORITY_CONFIG.medium;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="td-select-btn"
        style={{ backgroundColor: cfg.bg, color: cfg.color }}
      >
        <Flag size={11} />
        {cfg.label}
        <ChevronDown size={11} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="td-dropdown"
          >
            {Object.entries(PRIORITY_CONFIG).map(([key, c]) => (
              <button
                key={key}
                onClick={() => { onChange(key); setOpen(false); }}
                className="td-dropdown-item"
              >
                <Flag size={11} style={{ color: c.color }} />
                {c.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- Subtask row ---- */
function SubtaskItem({ subtask, onToggle }) {
  return (
    <motion.div layout className="td-subtask-row">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggle(subtask.id)}
        className={`td-subtask-check ${subtask.done ? 'td-subtask-check--done' : 'td-subtask-check--todo'}`}
      >
        {subtask.done && <CheckCircle2 size={10} style={{ color: '#ffffff' }} />}
      </motion.button>
      <span className={`td-subtask-label ${subtask.done ? 'td-subtask-label--done' : 'td-subtask-label--todo'}`}>
        {subtask.title}
      </span>
    </motion.div>
  );
}

/* ---- Comment item ---- */
function CommentItem({ comment, members, delay }) {
  const author = members.find((m) => m.id === comment.authorId);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="td-comment-row"
    >
      <Avatar name={author?.name || 'User'} size="sm" color={author?.color} style={{ marginTop: 2, flexShrink: 0 }} />
      <div className="td-comment-body">
        <div className="td-comment-meta">
          <span className="td-comment-author">{author?.name || 'User'}</span>
          <span className="td-comment-time">
            {comment.createdAt
              ? new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              : 'Just now'}
          </span>
        </div>
        <div className="td-comment-bubble">
          <p className="td-comment-text">{comment.content}</p>
        </div>
        {comment.reactions?.length > 0 && (
          <div className="td-reactions">
            {comment.reactions.map((r, i) => (
              <span key={i} className="td-reaction">{r.emoji} {r.count}</span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ---- Inline Assignee dropdown ---- */
function AssigneeSelect({ value, members, currentUser, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selectRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const currentAssignee = members.find((m) => m.id === value);
  const isAssignedToCurrent = currentUser?.id && value === currentUser.id;

  const filteredMembers = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      (m.role && m.role.toLowerCase().includes(search.toLowerCase())) ||
      (m.email && m.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ position: 'relative' }} ref={selectRef}>
      {currentAssignee ? (
        <button
          type="button"
          onClick={() => { setOpen(!open); setSearch(''); }}
          className="td-person-card td-person-card--interactive"
          title="Click to change assignee"
        >
          <Avatar name={currentAssignee.name} size="sm" color={currentAssignee.color} />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <p className="td-person-name">
              {currentAssignee.name} {isAssignedToCurrent && <span className="kc-you-badge">You</span>}
            </p>
            <p className="td-person-role">{currentAssignee.role || 'Team Member'}</p>
          </div>
          <ChevronDown size={14} className={`td-chevron ${open ? 'open' : ''}`} />
        </button>
      ) : (
        <div style={{ display: 'flex', gap: 6, width: '100%' }}>
          <button
            type="button"
            onClick={() => { setOpen(!open); setSearch(''); }}
            className="td-unassigned-btn"
            style={{ flex: 1 }}
          >
            <User size={13} /> Unassigned
            <ChevronDown size={12} style={{ marginLeft: 'auto' }} />
          </button>
          {currentUser && (
            <button
              type="button"
              className="td-quick-claim-btn"
              onClick={() => onChange(currentUser.id)}
              title="Claim task (Assign to me)"
            >
              <Zap size={11} /> Claim
            </button>
          )}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="td-dropdown td-assignee-dropdown"
          >
            {currentUser && !isAssignedToCurrent && (
              <button
                type="button"
                className="kc-claim-btn"
                style={{ margin: '6px 8px', width: 'calc(100% - 16px)' }}
                onClick={() => { onChange(currentUser.id); setOpen(false); }}
              >
                <Zap size={12} className="kc-claim-icon" />
                <span>Assign to me ({currentUser.name})</span>
              </button>
            )}

            {members.length > 3 && (
              <div className="kc-assignee-search-wrap" style={{ margin: '4px 8px 6px' }}>
                <Search size={11} className="kc-assignee-search-icon" />
                <input
                  type="text"
                  placeholder="Filter team..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="kc-assignee-search-input"
                  autoFocus
                />
              </div>
            )}

            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              <button
                type="button"
                className={`td-dropdown-item ${!value ? 'active' : ''}`}
                onClick={() => { onChange(null); setOpen(false); }}
              >
                <div className="kc-unassigned-mini-avatar" style={{ marginRight: 8 }}>
                  <User size={11} />
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>Unassigned</div>
                  <div style={{ fontSize: 10, color: 'var(--color-surface-400)' }}>Clear assignee</div>
                </div>
                {!value && <Check size={13} style={{ color: '#2563EB', marginLeft: 'auto' }} />}
              </button>

              {filteredMembers.map((m) => {
                const isSelected = m.id === value;
                const isMe = m.id === currentUser?.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`td-dropdown-item ${isSelected ? 'active' : ''}`}
                    onClick={() => { onChange(m.id); setOpen(false); }}
                  >
                    <Avatar name={m.name} size="xs" color={m.color} style={{ marginRight: 8 }} />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {m.name} {isMe && <span className="kc-you-badge">You</span>}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--color-surface-400)' }}>{m.role || m.email || 'Member'}</div>
                    </div>
                    {isSelected && <Check size={13} style={{ color: '#2563EB', marginLeft: 'auto' }} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- Main TaskDetail component ---- */
export default function TaskDetail({ task }) {
  const dispatch = useDispatch();
  const { success } = useToast();
  const [commentText, setCommentText] = useState('');
  const [localTask, setLocalTask]       = useState(task);
  const [localSubtasks, setLocalSubtasks] = useState(task.subtasks || []);
  const [members, setMembers]           = useState([]);
  const [taskComments, setTaskComments] = useState([]);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descDraft, setDescDraft]       = useState(task.description || '');

  useEffect(() => {
    setLocalTask(task);
    setLocalSubtasks(task.subtasks || []);
    setDescDraft(task.description || '');
    setIsEditingDesc(false);
  }, [task]);

  useEffect(() => {
    userService.getUsers().then((data) => setMembers(data)).catch(() => {});
    if (task.id) {
      taskService.getComments(task.id).then((data) => setTaskComments(data)).catch(() => {});
    }
  }, [task.id]);

  const assignee = members.find((m) => m.id === localTask.assigneeId);
  const reporter = members.find((m) => m.id === localTask.reporterId);

  const currentUser = useSelector((state) => state.auth.user);

  const handleStatusChange = (status) => {
    dispatch(updateTaskStatusAsync({ taskId: task.id, status }));
    setLocalTask((prev) => ({ ...prev, status }));
    success('Status updated', `Task moved to ${STATUS_CONFIG[status]?.label}`);
  };

  const handleAssigneeChange = (newAssigneeId) => {
    dispatch(updateTaskAsync({ id: task.id, data: { assigneeId: newAssigneeId || null } }));
    setLocalTask((prev) => ({ ...prev, assigneeId: newAssigneeId || null }));
    const target = members.find((m) => m.id === newAssigneeId);
    if (newAssigneeId === currentUser?.id) {
      success('Task Claimed', 'You have been assigned to this task.');
    } else if (newAssigneeId) {
      success('Assignee Updated', `Task assigned to ${target?.name || 'team member'}.`);
    } else {
      success('Assignee Removed', 'Task is now unassigned.');
    }
  };

  const handlePriorityChange = (priority) => {
    dispatch(updateTaskAsync({ id: task.id, data: { priority } }));
    setLocalTask((prev) => ({ ...prev, priority }));
  };

  const handleSaveDesc = () => {
    dispatch(updateTaskAsync({ id: task.id, data: { description: descDraft } }));
    setLocalTask((prev) => ({ ...prev, description: descDraft }));
    setIsEditingDesc(false);
    success('Description updated', 'Issue description has been saved.');
  };

  const toggleSubtask = (subtaskId) => {
    const updated = localSubtasks.map((s) => s.id === subtaskId ? { ...s, done: !s.done } : s);
    setLocalSubtasks(updated);
    dispatch(updateTaskAsync({ id: task.id, data: { subtasks: updated } }));
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = await taskService.addComment({ taskId: task.id, authorId: 'user-1', content: commentText.trim() });
      setTaskComments((prev) => [...prev, newComment]);
      success('Comment added', 'Your comment has been posted.');
      setCommentText('');
    } catch (e) { /* ignore */ }
  };

  const completedSubtasks = localSubtasks.filter((s) => s.done).length;

  return (
    <div className="td-wrap">
      <div className="td-scroll">

        {/* Status + Priority selectors */}
        <div className="td-controls">
          <StatusSelect value={localTask.status} onChange={handleStatusChange} />
          <PrioritySelect value={localTask.priority} onChange={handlePriorityChange} />
        </div>

        {/* Description */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <p className="td-section-label" style={{ marginBottom: 0 }}>Description</p>
            {!isEditingDesc ? (
              <button
                type="button"
                onClick={() => setIsEditingDesc(true)}
                style={{ background: 'transparent', border: 'none', color: '#2563EB', fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Edit2 size={11} /> Edit
              </button>
            ) : null}
          </div>

          {isEditingDesc ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <textarea
                value={descDraft}
                onChange={(e) => setDescDraft(e.target.value)}
                placeholder="Add detailed description..."
                rows={4}
                className="input-base"
                style={{ width: '100%', resize: 'vertical', fontSize: 13, minHeight: 90 }}
                autoFocus
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => { setDescDraft(localTask.description || ''); setIsEditingDesc(false); }}
                  style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid var(--color-surface-200)', background: 'transparent', cursor: 'pointer', color: 'var(--color-surface-600)' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveDesc}
                  style={{ padding: '4px 12px', fontSize: 12, borderRadius: 6, border: 'none', background: '#2563EB', color: '#fff', cursor: 'pointer', fontWeight: 500 }}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div
              className="td-desc-box"
              onClick={() => setIsEditingDesc(true)}
              style={{ cursor: 'pointer' }}
              title="Click to edit description"
            >
              {localTask.description ? (
                <span>{localTask.description}</span>
              ) : (
                <span className="td-desc-empty">No description provided. Click to add one.</span>
              )}
            </div>
          )}
        </div>

        {/* Assignee / Reporter / Date / Time */}
        <div className="td-meta-grid">
          <div>
            <p className="td-section-label"><User size={11} />Assignee</p>
            <AssigneeSelect
              value={localTask.assigneeId}
              members={members}
              currentUser={currentUser}
              onChange={handleAssigneeChange}
            />
          </div>

          <div>
            <p className="td-section-label"><User size={11} />Reporter</p>
            {reporter ? (
              <div className="td-person-card">
                <Avatar name={reporter.name} size="sm" color={reporter.color} />
                <div>
                  <p className="td-person-name">{reporter.name}</p>
                  <p className="td-person-role">{reporter.role}</p>
                </div>
              </div>
            ) : null}
          </div>

          {localTask.dueDate && (
            <div>
              <p className="td-section-label"><Calendar size={11} />Due Date</p>
              <div className="td-info-card">
                <Calendar size={12} style={{ color: 'var(--color-surface-400)' }} />
                {localTask.dueDate}
              </div>
            </div>
          )}

          {localTask.estimatedHours && (
            <div>
              <p className="td-section-label"><Clock size={11} />Time</p>
              <div className="td-time-card">
                <div className="td-time-labels">
                  <span>{localTask.loggedHours || 0}h logged</span>
                  <span>/{localTask.estimatedHours}h est.</span>
                </div>
                <div className="td-time-bar">
                  <div
                    className="td-time-fill"
                    style={{ width: `${Math.min(((localTask.loggedHours || 0) / localTask.estimatedHours) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Labels */}
        {localTask.labels?.length > 0 && (
          <div>
            <p className="td-section-label"><Tag size={11} />Labels</p>
            <div className="td-labels-wrap">
              {localTask.labels.map((label) => (
                <span key={label} className="td-label">{label}</span>
              ))}
            </div>
          </div>
        )}

        {/* Subtasks */}
        {localSubtasks.length > 0 && (
          <div>
            <div className="td-subtasks-header">
              <p className="td-section-label"><CheckSquare size={11} />Subtasks</p>
              <span className="td-subtasks-count">{completedSubtasks}/{localSubtasks.length}</span>
            </div>
            <div className="td-subtasks-box">
              {localSubtasks.map((subtask) => (
                <SubtaskItem key={subtask.id} subtask={subtask} onToggle={toggleSubtask} />
              ))}
            </div>
            <div className="td-subtask-progress">
              <motion.div
                animate={{ width: `${(completedSubtasks / localSubtasks.length) * 100}%` }}
                transition={{ duration: 0.4 }}
                className="td-subtask-progress-fill"
              />
            </div>
          </div>
        )}

        {/* Comments */}
        <div>
          <p className="td-section-label"><MessageSquare size={11} />Comments ({taskComments.length})</p>
          <div className="td-comments-list">
            {taskComments.map((c, i) => (
              <CommentItem key={c.id} comment={c} members={members} delay={i * 0.05} />
            ))}
            {taskComments.length === 0 && (
              <p className="td-comment-empty">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>

      {/* Comment input */}
      <div className="td-comment-footer">
        <div className="td-comment-input-row">
          <Avatar name="Alex Morgan" size="sm" />
          <div className="td-comment-input-wrap">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
              className="td-comment-textarea"
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddComment(); }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="td-comment-send"
            >
              <Send size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
