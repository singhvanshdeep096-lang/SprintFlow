import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Filter, Search, CheckSquare, Flag, Calendar, FolderKanban, Trash2 } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Tabs from '../../components/common/Tabs/Tabs';
import Drawer from '../../components/common/Drawer/Drawer';
import Modal from '../../components/common/Modal/Modal';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import TaskDetail from './TaskDetail';
import { openTaskDrawer, closeTaskDrawer, openCreateTaskDrawer, deleteTaskAsync } from '../../redux/taskSlice';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../constants';
import useDebounce from '../../hooks/useDebounce';
import { useToast } from '../../hooks/useToast';
import userService from '../../services/user.service';
import './Tasks.css';

function TaskRow({ task, members, projects, onOpen, delay, isAdmin, onDelete }) {
  const assignee    = members.find((m) => m.id === task.assigneeId);
  const project     = projects.find((p) => p.id === task.projectId);
  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const statusCfg   = STATUS_CONFIG[task.status]     || STATUS_CONFIG.todo;
  const isOverdue   = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.25 }}
      onClick={() => onOpen(task)}
      className="tasks-tr"
    >
      <td className="tasks-td tasks-td--first">
        <div className="tasks-row-main">
          <div className="tasks-row-stripe" style={{ backgroundColor: priorityCfg.color }} />
          <div>
            <p className="tasks-row-title">{task.title}</p>
            <p className="tasks-row-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>{project?.icon || '📁'}</span>
              <span>{project?.name || task.projectId}</span>
              {task.onBoard === false ? (
                <span style={{ marginLeft: 6, fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: 'var(--color-surface-200, #E2E8F0)', color: 'var(--color-surface-600, #475569)', fontWeight: 500 }}>
                  Task Only
                </span>
              ) : (
                <span style={{ marginLeft: 6, fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', fontWeight: 500 }}>
                  Board
                </span>
              )}
            </p>
          </div>
        </div>
      </td>

      <td className="tasks-td">
        <span className="tasks-status-badge" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
          {statusCfg.label}
        </span>
      </td>

      <td className="tasks-td">
        <span className="tasks-priority-cell" style={{ color: priorityCfg.color }}>
          <Flag size={10} />{priorityCfg.label}
        </span>
      </td>

      <td className="tasks-td">
        {assignee ? (
          <div className="tasks-assignee-cell">
            <Avatar name={assignee.name} size="xs" color={assignee.color} />
            <span className="tasks-assignee-name">{assignee.name.split(' ')[0]}</span>
          </div>
        ) : (
          <span className="tasks-unassigned">Unassigned</span>
        )}
      </td>

      <td className="tasks-td">
        {task.dueDate && (
          <span className={`tasks-due-cell ${isOverdue ? 'tasks-due-cell--overdue' : 'tasks-due-cell--normal'}`}>
            <Calendar size={10} />
            {task.dueDate}
          </span>
        )}
      </td>

      <td className={`tasks-td ${!isAdmin ? 'tasks-td--last' : ''}`}>
        {task.labels?.length > 0 && (
          <div className="tasks-labels">
            {task.labels.slice(0, 2).map((l) => (
              <span key={l} className="tasks-label">{l}</span>
            ))}
          </div>
        )}
      </td>

      {isAdmin && (
        <td className="tasks-td tasks-td--last" style={{ textAlign: 'right', width: 44 }} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="tasks-row-del-btn"
            title="Delete task (Admin only)"
          >
            <Trash2 size={13} />
          </button>
        </td>
      )}
    </motion.tr>
  );
}

export default function Tasks() {
  const dispatch      = useDispatch();
  const tasks         = useSelector((state) => state.tasks.list);
  const projects      = useSelector((state) => state.projects.list);
  const selectedTask  = useSelector((state) => state.tasks.selected);
  const isDrawerOpen  = useSelector((state) => state.tasks.isDrawerOpen);
  const currentUser   = useSelector((state) => state.auth.user);
  const isAdmin       = currentUser?.role?.toLowerCase() === 'admin' || currentUser?.is_superuser === true;

  const { success, error } = useToast();
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting]     = useState(false);

  const [search, setSearch]                 = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
  const [activeTab, setActiveTab]           = useState('all');
  const [members, setMembers]               = useState([]);

  useEffect(() => {
    userService.getUsers().then((data) => setMembers(data)).catch(() => {});
  }, []);

  const projectFilteredTasks = selectedProjectFilter === 'all'
    ? tasks
    : tasks.filter((t) => t.projectId === selectedProjectFilter);

  const tabsData = [
    { id: 'all',         label: 'All Tasks',   badge: projectFilteredTasks.length },
    { id: 'todo',        label: 'To Do',       badge: projectFilteredTasks.filter((t) => t.status === 'todo').length },
    { id: 'in_progress', label: 'In Progress', badge: projectFilteredTasks.filter((t) => t.status === 'in_progress').length },
    { id: 'review',      label: 'In Review',   badge: projectFilteredTasks.filter((t) => t.status === 'review').length },
    { id: 'done',        label: 'Done',        badge: projectFilteredTasks.filter((t) => t.status === 'done').length },
  ];

  const filtered = projectFilteredTasks.filter((t) => {
    const matchTab = activeTab === 'all' || t.status === activeTab;
    const query = debouncedSearch.toLowerCase().trim();
    const matchSearch = !query ||
      t.title.toLowerCase().includes(query) ||
      t.id?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query);
    return matchTab && matchSearch;
  });

  return (
    <PageTransition className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1 className="tasks-title">Tasks</h1>
          <p className="tasks-subtitle">{tasks.length} tasks across your accessible projects</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => dispatch(openCreateTaskDrawer({
            projectId: selectedProjectFilter !== 'all' ? selectedProjectFilter : projects[0]?.id,
            onBoard: false
          }))}
        >
          New Task
        </Button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="tasks-card-toolbar">
          <Tabs tabs={tabsData} activeTab={activeTab} onTabChange={setActiveTab} variant="line" />
          <div className="tasks-toolbar-right">
            
            {/* Project Filter */}
            {projects.length > 1 && (
              <select
                value={selectedProjectFilter}
                onChange={(e) => setSelectedProjectFilter(e.target.value)}
                className="input-base"
                style={{ padding: '5px 10px', fontSize: 12, height: 32 }}
              >
                <option value="all">All Accessible Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.name}
                  </option>
                ))}
              </select>
            )}

            <div className="tasks-search-wrap">
              <Search size={14} className="tasks-search-icon" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="input-base tasks-search-input"
              />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<CheckSquare size={28} />}
            title="No tasks found"
            description={search ? 'Try adjusting your search filters.' : 'No tasks in this status.'}
            size="sm"
          />
        ) : (
          <div className="tasks-table-wrap">
            <table className="tasks-table">
              <thead>
                <tr>
                  {['Task / Project', 'Status', 'Priority', 'Assignee', 'Due Date', 'Labels'].map((h, i) => (
                    <th
                      key={h}
                      className={`tasks-th${i === 0 ? ' tasks-th--first' : i === 5 && !isAdmin ? ' tasks-th--last' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                  {isAdmin && <th className="tasks-th tasks-th--last" style={{ width: 44, textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((task, i) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    members={members}
                    projects={projects}
                    delay={i * 0.03}
                    isAdmin={isAdmin}
                    onOpen={(t) => dispatch(openTaskDrawer(t))}
                    onDelete={(t) => setTaskToDelete(t)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => dispatch(closeTaskDrawer())}
        width="xl"
        title={selectedTask?.title}
        subtitle={selectedTask ? `#${selectedTask.id?.split('-').pop()?.toUpperCase()} · ${selectedTask.projectId}` : ''}
      >
        {selectedTask && <TaskDetail task={selectedTask} />}
      </Drawer>

      {/* Admin Task Deletion Modal */}
      <Modal
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        title="Delete Task"
        size="sm"
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="ghost" onClick={() => setTaskToDelete(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (!taskToDelete) return;
                setIsDeleting(true);
                try {
                  await dispatch(deleteTaskAsync(taskToDelete.id)).unwrap();
                  success('Task Deleted', `"${taskToDelete.title}" has been deleted.`);
                  setTaskToDelete(null);
                } catch (err) {
                  error('Delete Failed', err?.message || 'Could not delete task.');
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
          Are you sure you want to delete <strong>"{taskToDelete?.title}"</strong>? This will permanently delete the task from the system.
        </p>
      </Modal>
    </PageTransition>
  );
}

