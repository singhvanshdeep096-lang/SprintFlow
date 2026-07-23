import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Plus, MessageSquare, Paperclip, Flag, Calendar,
  CheckSquare, User, Search
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

function PriorityIcon({ priority }) {
  const config = PRIORITY_CONFIG[priority];
  if (!config) return null;
  return (
    <div className="flex items-center gap-1">
      <Flag size={11} style={{ color: config.color }} />
    </div>
  );
}

function TaskCard({ task, members, onOpen, delay }) {
  const assignee = members.find((m) => m.id === task.assigneeId);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const completedSubtasks = task.subtasks?.filter((s) => s.done).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ delay: Math.min(delay, 0.3), duration: 0.25 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.1)' }}
      onClick={() => onOpen(task)}
      className="task-card bg-white cursor-pointer"
    >
      <div className="flex items-start gap-2 mb-3">
        <PriorityIcon priority={task.priority} />
        <h4 className="text-sm font-semibold text-surface-800 leading-snug flex-1">{task.title}</h4>
      </div>

      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.slice(0, 2).map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-primary-50 text-primary-600"
            >
              {label}
            </span>
          ))}
          {task.labels.length > 2 && (
            <span className="text-[10px] text-surface-400 px-1">+{task.labels.length - 2}</span>
          )}
        </div>
      )}

      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-surface-400 mb-1">
            <div className="flex items-center gap-1">
              <CheckSquare size={9} />
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
            <span>{Math.round((completedSubtasks / totalSubtasks) * 100)}%</span>
          </div>
          <div className="h-1 bg-surface-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full rounded-full bg-primary-500"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          {assignee ? (
            <Avatar name={assignee.name} size="xs" color={assignee.color} />
          ) : (
            <div className="w-5 h-5 rounded-full bg-surface-200 flex items-center justify-center">
              <User size={9} className="text-surface-400" />
            </div>
          )}
          {task.dueDate && (
            <span className={`flex items-center gap-0.5 text-[10px] font-medium ${isOverdue ? 'text-danger-600' : 'text-surface-400'}`}>
              <Calendar size={9} />
              {task.dueDate}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-surface-400">
          {task.commentCount > 0 && (
            <span className="flex items-center gap-0.5">
              <MessageSquare size={9} />
              {task.commentCount}
            </span>
          )}
          {task.attachmentCount > 0 && (
            <span className="flex items-center gap-0.5">
              <Paperclip size={9} />
              {task.attachmentCount}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AddTaskInline({ columnStatus, onAdd, onCancel }) {
  const [title, setTitle] = useState('');
  const { success } = useToast();

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
      className="bg-white rounded-xl border border-primary-300 shadow-sm p-3"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className="w-full text-sm outline-none text-surface-800 placeholder:text-surface-400 mb-2"
        onKeyDown={(e) => e.key === 'Escape' && onCancel()}
      />
      <div className="flex gap-2">
        <Button type="submit" size="xs" disabled={!title.trim()}>Add</Button>
        <Button type="button" size="xs" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </motion.form>
  );
}

function KanbanColumn({ column, tasks, members, onAddTask, onOpenTask }) {
  const [addingTask, setAddingTask] = useState(false);
  const dispatch = useDispatch();
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="kanban-column"
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
          <h3 className="text-sm font-semibold text-surface-700">{column.title}</h3>
          <span className="min-w-[20px] h-5 rounded-full bg-surface-200 text-surface-500 text-[11px] font-bold flex items-center justify-center px-1.5">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setAddingTask(true)}
            className="p-1 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-all"
          >
            <Plus size={15} />
          </motion.button>
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col gap-2.5 min-h-[200px] rounded-2xl p-2 transition-all ${
          dragOver ? 'bg-primary-50 border-2 border-dashed border-primary-300' : 'bg-surface-50/50'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task, i) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
            >
              <TaskCard task={task} members={members} onOpen={onOpenTask} delay={i * 0.04} />
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8 gap-2 text-surface-300"
          >
            <CheckSquare size={22} className="opacity-40" />
            <p className="text-xs font-medium">Drop tasks here</p>
          </motion.div>
        )}
      </div>

      {!addingTask && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setAddingTask(true)}
          className="mt-2 w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-all"
        >
          <Plus size={14} />Add task
        </motion.button>
      )}
    </motion.div>
  );
}

export default function Board() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.list);
  const selectedTask = useSelector((state) => state.tasks.selected);
  const isDrawerOpen = useSelector((state) => state.tasks.isDrawerOpen);
  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    userService.getUsers().then((data) => setMembers(data)).catch(() => {});
  }, []);

  const filteredTasks = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchAssignee = assigneeFilter === 'all' || t.assigneeId === assigneeFilter;
    return matchSearch && matchAssignee;
  });

  const getColumnTasks = (status) => filteredTasks.filter((t) => t.status === status);

  const handleAddTask = (taskData) => dispatch(addTaskAsync(taskData));
  const handleOpenTask = (task) => dispatch(openTaskDrawer(task));
  const handleCloseDrawer = () => dispatch(closeTaskDrawer());

  return (
    <PageTransition className="flex flex-col h-full">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-white border-b border-surface-100">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Kanban Board</h1>
          <p className="text-sm text-surface-500 mt-0.5">SprintFlow v2.0 · Sprint 7</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="input-base pl-9 py-2 text-sm w-48"
            />
          </div>

          <div className="flex items-center gap-1">
            {[{ id: 'all', name: 'All' }, ...members.slice(0, 4)].map((m) => (
              <motion.button
                key={m.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAssigneeFilter(m.id)}
                className={`transition-all ${assigneeFilter === m.id ? 'ring-2 ring-primary-500 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
              >
                {m.id === 'all' ? (
                  <div className={`w-7 h-7 rounded-full bg-surface-200 flex items-center justify-center text-[10px] font-bold text-surface-600`}>All</div>
                ) : (
                  <Avatar name={m.name} size="sm" color={m.color} />
                )}
              </motion.button>
            ))}
          </div>

          <Button variant="primary" size="sm" icon={<Plus size={14} />}>
            New Task
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-5 min-w-max pb-6">
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

      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        width="xl"
        title={selectedTask?.title}
        subtitle={`#${selectedTask?.id?.split('-').pop()?.toUpperCase()} · ${selectedTask?.projectId}`}
      >
        {selectedTask && <TaskDetail task={selectedTask} />}
      </Drawer>
    </PageTransition>
  );
}
