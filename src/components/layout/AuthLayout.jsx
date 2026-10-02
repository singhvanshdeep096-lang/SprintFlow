import { Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { Zap, Sun, Moon } from 'lucide-react';
import { toggleTheme } from '../../redux/uiSlice';
import ToastContainer from '../common/Toast';
import './Layout.css';

export default function AuthLayout() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  const handleThemeToggle = (e) => {
    if (!document.startViewTransition) {
      dispatch(toggleTheme());
      return;
    }
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = Math.round(rect.left + rect.width / 2);
    const y = Math.round(rect.top + rect.height / 2);
    const transition = document.startViewTransition(() => dispatch(toggleTheme()));
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(200vmax at ${x}px ${y}px)`] },
        { duration: 1100, easing: 'cubic-bezier(0.45, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    });
  };

  return (
    <div className="auth-layout">
      {/* Top right theme toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleThemeToggle}
        className="auth-theme-toggle"
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </motion.button>

      {/* ===== Center form panel ===== */}
      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="auth-mobile-logo"
          >
            <div
              className="auth-mobile-logo-icon"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
            >
              <Zap size={18} style={{ color: '#ffffff' }} />
            </div>
            <span className="auth-mobile-logo-title">SprintFlow</span>
          </motion.div>

          <Outlet />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
