import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Filter, Search, CheckSquare, Flag, Calendar } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Tabs from '../../components/common/Tabs/Tabs';
import Drawer from '../../components/common/Drawer/Drawer';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import TaskDetail from './TaskDetail';
import { openTaskDrawer, closeTaskDrawer } from '../../redux/taskSlice';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../../constants';
import userService from '../../services/user.service';
import './Tasks.css';

function TaskRow({ task, members, onOpen, delay }) {
  const assignee    = members.find((m) => m.id === task.assigneeId);
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
            <p className="tasks-row-subtitle">{task.projectId}</p>
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

      <td className="tasks-td tasks-td--last">
        {task.labels?.length > 0 && (
          <div className="tasks-labels">
            {task.labels.slice(0, 2).map((l) => (
              <span key={l} className="tasks-label">{l}</span>
            ))}
          </div>
        )}
      </td>
    </motion.tr>
  );
}

export default function Tasks() {
  const dispatch      = useDispatch();
  const tasks         = useSelector((state) => state.tasks.list);
  const selectedTask  = useSelector((state) => state.tasks.selected);
  const isDrawerOpen  = useSelector((state) => state.tasks.isDrawerOpen);
  const [search, setSearch]   = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    userService.getUsers().then((data) => setMembers(data)).catch(() => {});
  }, []);

  const tabsData = [
    { id: 'all',         label: 'All Tasks',   badge: tasks.length },
    { id: 'todo',        label: 'To Do',       badge: tasks.filter((t) => t.status === 'todo').length },
    { id: 'in_progress', label: 'In Progress', badge: tasks.filter((t) => t.status === 'in_progress').length },
    { id: 'review',      label: 'In Review',   badge: tasks.filter((t) => t.status === 'review').length },
    { id: 'done',        label: 'Done',        badge: tasks.filter((t) => t.status === 'done').length },
  ];

  const filtered = tasks.filter((t) => {
    const matchTab    = activeTab === 'all' || t.status === activeTab;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <PageTransition className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1 className="tasks-title">Tasks</h1>
          <p className="tasks-subtitle">{tasks.length} tasks across all projects</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />}>New Task</Button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="tasks-card-toolbar">
          <Tabs tabs={tabsData} activeTab={activeTab} onTabChange={setActiveTab} variant="line" />
          <div className="tasks-toolbar-right">
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
            <Button variant="secondary" size="sm" icon={<Filter size={14} />}>Filter</Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<CheckSquare size={28} />}
            title="No tasks found"
            description={search ? 'Try adjusting your search.' : 'No tasks in this status.'}
            size="sm"
          />
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                {['Task', 'Status', 'Priority', 'Assignee', 'Due Date', 'Labels'].map((h, i) => (
                  <th
                    key={h}
                    className={`tasks-th${i === 0 ? ' tasks-th--first' : i === 5 ? ' tasks-th--last' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((task, i) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  members={members}
                  delay={i * 0.03}
                  onOpen={(t) => dispatch(openTaskDrawer(t))}
                />
              ))}
            </tbody>
          </table>
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
    </PageTransition>
  );
}
