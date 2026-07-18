import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../../../redux/uiSlice';

const toastConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-white border-l-4 border-l-success-500',
    iconColor: 'text-success-500',
    titleColor: 'text-surface-900',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-white border-l-4 border-l-danger-500',
    iconColor: 'text-danger-500',
    titleColor: 'text-surface-900',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-white border-l-4 border-l-warning-500',
    iconColor: 'text-warning-500',
    titleColor: 'text-surface-900',
  },
  info: {
    icon: Info,
    bg: 'bg-white border-l-4 border-l-primary-500',
    iconColor: 'text-primary-500',
    titleColor: 'text-surface-900',
  },
};

function Toast({ toast }) {
  const dispatch = useDispatch();
  const config = toastConfig[toast.type] || toastConfig.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(toast.id)), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, dispatch]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className={`flex items-start gap-3 p-4 rounded-xl shadow-lg max-w-sm w-full pointer-events-auto ${config.bg}`}
    >
      <Icon size={18} className={`${config.iconColor} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`text-sm font-semibold ${config.titleColor} leading-snug`}>{toast.title}</p>
        )}
        {toast.message && (
          <p className="text-sm text-surface-500 mt-0.5 leading-snug">{toast.message}</p>
        )}
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch(removeToast(toast.id))}
        className="text-surface-400 hover:text-surface-600 transition-colors shrink-0 p-0.5"
      >
        <X size={14} />
      </motion.button>
    </motion.div>
  );
}

export default function ToastContainer() {
  const toasts = useSelector((state) => state.ui.toasts);

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
