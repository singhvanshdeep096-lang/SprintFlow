import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../../../redux/uiSlice';
import './Toast.css';

const CONFIG = {
  success: { Icon: CheckCircle, typeClass: 'toast--success', iconClass: 'toast-icon--success' },
  error:   { Icon: AlertCircle, typeClass: 'toast--error',   iconClass: 'toast-icon--error'   },
  warning: { Icon: AlertTriangle, typeClass: 'toast--warning', iconClass: 'toast-icon--warning' },
  info:    { Icon: Info,          typeClass: 'toast--info',    iconClass: 'toast-icon--info'    },
};

function Toast({ toast }) {
  const dispatch = useDispatch();
  const cfg = CONFIG[toast.type] || CONFIG.info;
  const { Icon, typeClass, iconClass } = cfg;

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
      className={`toast ${typeClass}`}
    >
      <Icon size={18} className={`toast-icon ${iconClass}`} />
      <div className="toast-body">
        {toast.title   && <p className="toast-title">{toast.title}</p>}
        {toast.message && <p className="toast-message">{toast.message}</p>}
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => dispatch(removeToast(toast.id))}
        className="toast-close"
      >
        <X size={14} />
      </motion.button>
    </motion.div>
  );
}

export default function ToastContainer() {
  const toasts = useSelector((state) => state.ui.toasts);
  return (
    <div className="toast-container">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => <Toast key={toast.id} toast={toast} />)}
      </AnimatePresence>
    </div>
  );
}
