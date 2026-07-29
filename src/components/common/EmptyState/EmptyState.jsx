import { motion } from 'motion/react';
import Button from '../Button';
import './EmptyState.css';

const SIZES = ['sm', 'md', 'lg'];

export default function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
  secondaryAction,
  secondaryLabel,
  size = 'md',
  className = '',
}) {
  const s = SIZES.includes(size) ? size : 'md';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={['empty-state', className].filter(Boolean).join(' ')}
    >
      {icon && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className={`empty-state-icon empty-state-icon--${s}`}
        >
          <span className={`empty-state-icon-inner--${s}`}>{icon}</span>
        </motion.div>
      )}
      <h3 className={`empty-state-title empty-state-title--${s}`}>{title}</h3>
      {description && (
        <p className={`empty-state-desc empty-state-desc--${s}`}>{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="empty-state-actions">
          {action && (
            <Button onClick={action} variant="primary">{actionLabel || 'Get Started'}</Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction} variant="secondary">{secondaryLabel || 'Learn More'}</Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
