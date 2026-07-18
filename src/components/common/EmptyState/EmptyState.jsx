import { motion } from 'motion/react';
import Button from '../Button';

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
  const sizeMap = {
    sm: { icon: 'w-12 h-12', iconInner: 'w-6 h-6', title: 'text-base', desc: 'text-sm' },
    md: { icon: 'w-16 h-16', iconInner: 'w-8 h-8', title: 'text-lg', desc: 'text-sm' },
    lg: { icon: 'w-20 h-20', iconInner: 'w-10 h-10', title: 'text-xl', desc: 'text-base' },
  };

  const s = sizeMap[size] || sizeMap.md;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}
    >
      {icon && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className={`${s.icon} rounded-2xl bg-surface-100 flex items-center justify-center mb-5 text-surface-400`}
        >
          <span className={s.iconInner}>{icon}</span>
        </motion.div>
      )}
      <h3 className={`${s.title} font-semibold text-surface-800 mb-2`}>{title}</h3>
      {description && (
        <p className={`${s.desc} text-surface-500 max-w-xs leading-relaxed mb-6`}>{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex gap-3">
          {action && (
            <Button onClick={action} variant="primary">
              {actionLabel || 'Get Started'}
            </Button>
          )}
          {secondaryAction && (
            <Button onClick={secondaryAction} variant="secondary">
              {secondaryLabel || 'Learn More'}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
