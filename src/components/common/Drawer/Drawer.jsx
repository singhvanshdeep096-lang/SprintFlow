import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const widthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

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
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const slideVariants = {
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
  };

  const variant = slideVariants[side] || slideVariants.right;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnOverlay ? onClose : undefined}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(3px)' }}
          />
          <motion.div
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={[
              'fixed top-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl w-full',
              widthMap[width] || widthMap.lg,
              side === 'right' ? 'right-0' : 'left-0',
              className,
            ].join(' ')}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between px-6 py-5 border-b border-surface-100 shrink-0">
                <div>
                  {title && <h2 className="text-lg font-semibold text-surface-900">{title}</h2>}
                  {subtitle && <p className="text-sm text-surface-500 mt-0.5">{subtitle}</p>}
                </div>
                {showCloseButton && (
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors ml-4 shrink-0"
                  >
                    <X size={18} />
                  </motion.button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="border-t border-surface-100 px-6 py-4 shrink-0 bg-surface-50">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
