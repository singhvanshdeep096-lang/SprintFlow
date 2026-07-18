import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md',
  secondary: 'bg-white hover:bg-surface-50 text-surface-700 border border-surface-200 hover:border-surface-300 shadow-sm',
  ghost: 'bg-transparent hover:bg-surface-100 text-surface-600 hover:text-surface-900',
  danger: 'bg-danger-500 hover:bg-danger-600 text-white shadow-sm hover:shadow-md',
  success: 'bg-success-500 hover:bg-success-600 text-white shadow-sm hover:shadow-md',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
  'outline-danger': 'border-2 border-danger-500 text-danger-500 hover:bg-danger-50',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs gap-1.5',
  sm: 'px-3 py-1.5 text-sm gap-2',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2.5',
  xl: 'px-6 py-3 text-base gap-3',
};

const iconSizes = {
  xs: 'p-1',
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5',
  xl: 'p-3',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconOnly = false,
  loading = false,
  disabled = false,
  fullWidth = false,
  rounded = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={[
        'inline-flex items-center justify-center font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        iconOnly ? iconSizes[size] : sizes[size],
        variants[variant] || variants.primary,
        rounded ? 'rounded-full' : 'rounded-lg',
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} className="animate-spin" />
      ) : icon && !children ? (
        icon
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
        </>
      )}
    </motion.button>
  );
}
