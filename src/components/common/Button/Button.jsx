import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import './Button.css';

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger', 'success', 'outline', 'outline-danger'];
const SIZES    = ['xs', 'sm', 'md', 'lg', 'xl'];

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

  const safeVariant = VARIANTS.includes(variant) ? variant : 'primary';
  const safeSize    = SIZES.includes(size)        ? size    : 'md';

  const spinnerSize = safeSize === 'xs' ? 12 : safeSize === 'sm' ? 14 : 16;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled   ? { scale: 0.97 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={[
        'btn',
        `btn--${safeVariant}`,
        iconOnly ? `btn--icon-${safeSize}` : `btn--${safeSize}`,
        rounded   ? 'btn--rounded'  : '',
        fullWidth ? 'btn--full'     : '',
        isDisabled ? 'btn--disabled' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {loading ? (
        <Loader2 size={spinnerSize} className="btn-spinner" />
      ) : icon && !children ? (
        icon
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children && <span className="btn-label">{children}</span>}
        </>
      )}
    </motion.button>
  );
}
