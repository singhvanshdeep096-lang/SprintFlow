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

function TaskRow({ task, members, onOpen, delay }) {
  const assignee = members.find((m) => m.id === task.assigneeId);
  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.25 }}
      onClick={() => onOpen(task)}
      className="border-b border-surface-100 hover:bg-surface-50 cursor-pointer group transition-colors"
    >
      <td className="py-3 pl-5 pr-3">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full shrink-0" style={{ backgroundColor: priorityCfg.color }} />
          <div>
            <p className="text-sm font-semibold text-surface-800 group-hover:text-primary-600 transition-colors leading-snug">{task.title}</p>
            <p className="text-xs text-surface-400 mt-0.5">{task.projectId}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-3">
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}>
          {statusCfg.label}
        </span>
      </td>
      <td className="py-3 px-3">
        <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: priorityCfg.color }}>
          <Flag size={10} />{priorityCfg.label}
        </span>
      </td>
      <td className="py-3 px-3">
        {assignee ? (
          <div className="flex items-center gap-1.5">
            <Avatar name={assignee.name} size="xs" color={assignee.color} />
            <span className="text-xs text-surface-600">{assignee.name.split(' ')[0]}</span>
          </div>
        ) : (
          <span className="text-xs text-surface-400">Unassigned</span>
        )}
      </td>
      <td className="py-3 px-3">
        {task.dueDate && (
          <span className={`flex items-center gap-1 text-xs font-medium ${isOverdue ? 'text-danger-600' : 'text-surface-500'}`}>
            <Calendar size={10} />
            {task.dueDate}
          </span>
        )}
      </td>
      <td className="py-3 px-3 pr-5">
        {task.labels?.length > 0 && (
          <div className="flex gap-1">
            {task.labels.slice(0, 2).map((l) => (
              <span key={l} className="px-1.5 py-0.5 bg-surface-100 text-surface-600 rounded text-[10px] font-medium">{l}</span>
            ))}
          </div>
        )}
      </td>
    </motion.tr>
  );
}

export default function Tasks() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.list);
  const selectedTask = useSelector((state) => state.tasks.selected);
  const isDrawerOpen = useSelector((state) => state.tasks.isDrawerOpen);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    userService.getUsers().then((data) => setMembers(data)).catch(() => {});
  }, []);

  const tabsData = [
    { id: 'all', label: 'All Tasks', badge: tasks.length },
    { id: 'todo', label: 'To Do', badge: tasks.filter((t) => t.status === 'todo').length },
    { id: 'in_progress', label: 'In Progress', badge: tasks.filter((t) => t.status === 'in_progress').length },
    { id: 'review', label: 'In Review', badge: tasks.filter((t) => t.status === 'review').length },
    { id: 'done', label: 'Done', badge: tasks.filter((t) => t.status === 'done').length },
  ];

  const filtered = tasks.filter((t) => {
    const matchTab = activeTab === 'all' || t.status === activeTab;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <PageTransition className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Tasks</h1>
          <p className="text-surface-500 text-sm mt-1">{tasks.length} tasks across all projects</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />}>New Task</Button>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-surface-100">
          <Tabs tabs={tabsData} activeTab={activeTab} onTabChange={setActiveTab} variant="line" />
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..." className="input-base pl-9 py-1.5 text-sm w-44" />
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50">
                <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 pl-5 pr-3">Task</th>
                <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 px-3">Status</th>
                <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 px-3">Priority</th>
                <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 px-3">Assignee</th>
                <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 px-3">Due Date</th>
                <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider py-3 px-3 pr-5">Labels</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task, i) => (
                <TaskRow key={task.id} task={task} members={members} delay={i * 0.03} onOpen={(t) => dispatch(openTaskDrawer(t))} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => dispatch(closeTaskDrawer())} width="xl"
        title={selectedTask?.title}
        subtitle={selectedTask ? `#${selectedTask.id?.split('-').pop()?.toUpperCase()} · ${selectedTask.projectId}` : ''}>
        {selectedTask && <TaskDetail task={selectedTask} />}
      </Drawer>
    </PageTransition>
  );
}
