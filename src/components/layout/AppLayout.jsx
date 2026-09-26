import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence } from 'motion/react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ToastContainer from '../common/Toast';
import CreateTaskDrawer from '../../pages/task/CreateTaskDrawer';
import { fetchWorkspaces } from '../../redux/workspaceSlice';
import { fetchProjects } from '../../redux/projectSlice';
import { fetchTasks } from '../../redux/taskSlice';
import { fetchNotifications } from '../../redux/notificationSlice';
import { checkAuthAsync } from '../../redux/authSlice';
import { setSidebarCollapsed } from '../../redux/uiSlice';

export default function AppLayout() {
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    dispatch(checkAuthAsync());
    dispatch(fetchWorkspaces());
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Responsive resize tracking & laptop optimization
  useEffect(() => {
    // If opening on a laptop screen (< 1280px), default sidebar to collapsed
    // so board and tables get immediate full width without feeling cramped
    if (window.innerWidth < 1280) {
      dispatch(setSidebarCollapsed(true));
    }

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const isMobile = windowWidth < 768;
  const sidebarWidth = isMobile ? 0 : (collapsed ? 70 : 256);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface-50, #F8FAFC)', width: '100%', overflowX: 'hidden' }}>
      <Sidebar isMobile={isMobile} />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: sidebarWidth,
          transition: 'margin-left 0.35s cubic-bezier(0.4,0,0.2,1)',
          minWidth: 0,
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
        }}
      >
        <Navbar isMobile={isMobile} />
        <main
          style={{
            flex: 1,
            paddingTop: 60,
            overflowY: 'auto',
            overflowX: 'auto',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </div>
      <CreateTaskDrawer />
      <ToastContainer />
    </div>
  );
}

