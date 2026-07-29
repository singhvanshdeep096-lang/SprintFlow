import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import './Drawer.css';

const WIDTH_KEYS = ['sm', 'md', 'lg', 'xl', '2xl'];

export default function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'lg',
  side = 'right',
  closeOnOverlay = true,
  showCloseButton = true,
  className = '',
}) {
  const sidebarCollapsed = useSelector((state) => state.ui?.sidebarCollapsed ?? false);
  const sidebarWidth = sidebarCollapsed ? 70 : 256;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const slideVariants = {
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    left:  { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
  };
  const v = slideVariants[side] || slideVariants.right;

  const safeWidth = WIDTH_KEYS.includes(width) ? width : 'lg';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnOverlay ? onClose : undefined}
            className="drawer-overlay"
            style={{
              left: sidebarWidth,
              right: 0,
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(3px)',
            }}
          />
          {/* Panel */}
          <motion.div
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={[
              'drawer-panel',
              `drawer-panel--${side}`,
              `drawer--${safeWidth}`,
              className,
            ].filter(Boolean).join(' ')}
          >
            {(title || showCloseButton) && (
              <div className="drawer-header">
                <div>
                  {title    && <h2 className="drawer-title">{title}</h2>}
                  {subtitle && <p className="drawer-subtitle">{subtitle}</p>}
                </div>
                {showCloseButton && (
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="drawer-close-btn"
                  >
                    <X size={18} />
                  </motion.button>
                )}
              </div>
            )}
            <div className="drawer-body">{children}</div>
            {footer && <div className="drawer-footer">{footer}</div>}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
