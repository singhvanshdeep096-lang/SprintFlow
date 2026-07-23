import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDispatch } from 'react-redux';
import {
  Flag, Calendar, User, Tag, MessageSquare, CheckSquare,
  ChevronDown, Send, Clock, CheckCircle2
} from 'lucide-react';
import Avatar from '../../components/common/Avatar';
import { updateTaskAsync, updateTaskStatusAsync } from '../../redux/taskSlice';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../constants';
import { useToast } from '../../hooks/useToast';
import userService from '../../services/user.service';
import taskService from '../../services/task.service';

function StatusSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const statusCfg = STATUS_CONFIG[value] || STATUS_CONFIG.todo;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80 cursor-pointer"
        style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusCfg.dotColor }} />
        {statusCfg.label}
        <ChevronDown size={12} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute top-full mt-1 left-0 bg-white border border-surface-200 rounded-xl shadow-panel z-10 overflow-hidden min-w-[140px]"
          >
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => { onChange(key); setOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium hover:bg-surface-50 transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.dotColor }} />
                {cfg.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PrioritySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const cfg = PRIORITY_CONFIG[value] || PRIORITY_CONFIG.medium;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80 transition-all cursor-pointer"
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
            className="absolute top-full mt-1 left-0 bg-white border border-surface-200 rounded-xl shadow-panel z-10 overflow-hidden min-w-[130px]"
          >
            {Object.entries(PRIORITY_CONFIG).map(([key, c]) => (
              <button
                key={key}
                onClick={() => { onChange(key); setOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium hover:bg-surface-50 transition-colors cursor-pointer"
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

function SubtaskItem({ subtask, onToggle }) {
  return (
    <motion.div
      layout
      className="flex items-center gap-2.5 py-2 border-b border-surface-50 last:border-0 group"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggle(subtask.id)}
        className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-all cursor-pointer ${
          subtask.done
            ? 'border-success-500 bg-success-500'
            : 'border-surface-300 hover:border-primary-400'
        }`}
      >
        {subtask.done && <CheckCircle2 size={10} className="text-white" />}
      </motion.button>
      <span className={`text-sm flex-1 ${subtask.done ? 'line-through text-surface-400' : 'text-surface-700'}`}>
        {subtask.title}
      </span>
    </motion.div>
  );
}

function CommentItem({ comment, members, delay }) {
  const author = members.find((m) => m.id === comment.authorId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex gap-3 group"
    >
      <Avatar name={author?.name || 'User'} size="sm" color={author?.color} className="mt-0.5 shrink-0" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-surface-800">{author?.name || 'User'}</span>
          <span className="text-xs text-surface-400">
            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
          </span>
        </div>
        <div className="bg-surface-50 rounded-xl rounded-tl-sm p-3">
          <p className="text-sm text-surface-700 leading-relaxed">{comment.content}</p>
        </div>
        {comment.reactions?.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {comment.reactions.map((r, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-100 rounded-full text-xs font-medium text-surface-600 hover:bg-surface-200 cursor-pointer transition-colors">
                {r.emoji} {r.count}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function TaskDetail({ task }) {
  const dispatch = useDispatch();
  const { success } = useToast();
  const [commentText, setCommentText] = useState('');
  const [localTask, setLocalTask] = useState(task);
  const [localSubtasks, setLocalSubtasks] = useState(task.subtasks || []);
  const [members, setMembers] = useState([]);
  const [taskComments, setTaskComments] = useState([]);

  useEffect(() => {
    userService.getUsers().then((data) => setMembers(data)).catch(() => {});
    if (task.id) {
      taskService.getComments(task.id).then((data) => setTaskComments(data)).catch(() => {});
    }
  }, [task.id]);

  const assignee = members.find((m) => m.id === localTask.assigneeId);
  const reporter = members.find((m) => m.id === localTask.reporterId);

  const handleStatusChange = (status) => {
    dispatch(updateTaskStatusAsync({ taskId: task.id, status }));
    setLocalTask((prev) => ({ ...prev, status }));
    success('Status updated', `Task moved to ${STATUS_CONFIG[status]?.label}`);
  };

  const handlePriorityChange = (priority) => {
    dispatch(updateTaskAsync({ id: task.id, data: { priority } }));
    setLocalTask((prev) => ({ ...prev, priority }));
  };

  const toggleSubtask = (subtaskId) => {
    const updated = localSubtasks.map((s) => s.id === subtaskId ? { ...s, done: !s.done } : s);
    setLocalSubtasks(updated);
    dispatch(updateTaskAsync({ id: task.id, data: { subtasks: updated } }));
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = await taskService.addComment({
        taskId: task.id,
        authorId: 'user-1',
        content: commentText.trim()
      });
      setTaskComments((prev) => [...prev, newComment]);
      success('Comment added', 'Your comment has been posted.');
      setCommentText('');
    } catch (e) {
      // ignore
    }
  };

  const completedSubtasks = localSubtasks.filter((s) => s.done).length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusSelect value={localTask.status} onChange={handleStatusChange} />
          <PrioritySelect value={localTask.priority} onChange={handlePriorityChange} />
        </div>

        <div>
          <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Description</h3>
          <div className="text-sm text-surface-700 leading-relaxed bg-surface-50 rounded-xl p-4 border border-surface-100">
            {localTask.description || <span className="text-surface-400 italic">No description provided.</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <User size={11} />Assignee
            </p>
            {assignee ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-50 border border-surface-100">
                <Avatar name={assignee.name} size="sm" color={assignee.color} />
                <div>
                  <p className="text-xs font-semibold text-surface-800">{assignee.name}</p>
                  <p className="text-[10px] text-surface-400">{assignee.role}</p>
                </div>
              </div>
            ) : (
              <button className="flex items-center gap-2 p-2.5 rounded-xl border border-dashed border-surface-300 text-surface-400 text-xs w-full hover:border-primary-300 hover:text-primary-500 transition-colors">
                <User size={13} />Unassigned
              </button>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <User size={11} />Reporter
            </p>
            {reporter ? (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-50 border border-surface-100">
                <Avatar name={reporter.name} size="sm" color={reporter.color} />
                <div>
                  <p className="text-xs font-semibold text-surface-800">{reporter.name}</p>
                  <p className="text-[10px] text-surface-400">{reporter.role}</p>
                </div>
              </div>
            ) : null}
          </div>

          {localTask.dueDate && (
            <div>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Calendar size={11} />Due Date
              </p>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-50 border border-surface-100 text-xs font-medium text-surface-700">
                <Calendar size={12} className="text-surface-400" />
                {localTask.dueDate}
              </div>
            </div>
          )}

          {localTask.estimatedHours && (
            <div>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Clock size={11} />Time
              </p>
              <div className="p-2.5 rounded-xl bg-surface-50 border border-surface-100">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-surface-500">{localTask.loggedHours || 0}h logged</span>
                  <span className="text-surface-500">/{localTask.estimatedHours}h est.</span>
                </div>
                <div className="h-1.5 bg-surface-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-500"
                    style={{ width: `${Math.min(((localTask.loggedHours || 0) / localTask.estimatedHours) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {localTask.labels?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Tag size={11} />Labels
            </p>
            <div className="flex flex-wrap gap-1.5">
              {localTask.labels.map((label) => (
                <span key={label} className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium border border-primary-100">
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {localSubtasks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider flex items-center gap-1">
                <CheckSquare size={11} />Subtasks
              </p>
              <span className="text-xs text-surface-400 font-medium">{completedSubtasks}/{localSubtasks.length}</span>
            </div>
            <div className="bg-surface-50 rounded-xl border border-surface-100 px-4 divide-y divide-surface-100">
              {localSubtasks.map((subtask) => (
                <SubtaskItem key={subtask.id} subtask={subtask} onToggle={toggleSubtask} />
              ))}
            </div>
            {localSubtasks.length > 0 && (
              <div className="mt-2 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(completedSubtasks / localSubtasks.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-full bg-success-500"
                />
              </div>
            )}
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3 flex items-center gap-1">
            <MessageSquare size={11} />Comments ({taskComments.length})
          </p>
          <div className="space-y-4">
            {taskComments.map((c, i) => (
              <CommentItem key={c.id} comment={c} members={members} delay={i * 0.05} />
            ))}
            {taskComments.length === 0 && (
              <p className="text-sm text-surface-400 italic text-center py-4">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-surface-100 p-4">
        <div className="flex gap-3">
          <Avatar name="Alex Morgan" size="sm" />
          <div className="flex-1 flex items-end gap-2 bg-surface-50 border border-surface-200 rounded-xl p-3 focus-within:border-primary-400 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
              className="flex-1 bg-transparent outline-none text-sm text-surface-800 placeholder:text-surface-400 resize-none"
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddComment(); }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="p-1.5 rounded-lg bg-primary-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer"
            >
              <Send size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
