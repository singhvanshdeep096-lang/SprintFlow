import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'motion/react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ToastContainer from '../common/Toast';
import { fetchWorkspaces } from '../../redux/workspaceSlice';
import { fetchProjects } from '../../redux/projectSlice';
import { fetchTasks } from '../../redux/taskSlice';
import { fetchNotifications } from '../../redux/notificationSlice';
import { checkAuthAsync } from '../../redux/authSlice';

export default function AppLayout() {
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const theme = useSelector((state) => state.ui.theme);
  const sidebarWidth = collapsed ? 70 : 256;

  // Sync theme class to <html> so all CSS dark overrides activate
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    dispatch(checkAuthAsync());
    dispatch(fetchWorkspaces());
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: sidebarWidth,
          transition: 'margin-left 0.35s cubic-bezier(0.4,0,0.2,1)',
          minWidth: 0,
        }}
      >
        <Navbar />
        <main
          style={{
            flex: 1,
            paddingTop: 60,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
