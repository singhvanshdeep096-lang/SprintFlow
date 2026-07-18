import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'motion/react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ToastContainer from '../common/Toast';

export default function AppLayout() {
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const sidebarWidth = collapsed ? 70 : 256;

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
