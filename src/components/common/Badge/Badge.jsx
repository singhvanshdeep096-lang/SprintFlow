import { motion } from 'motion/react';
import './Badge.css';

const COLORS = ['primary', 'success', 'warning', 'danger', 'purple', 'cyan', 'gray', 'orange', 'pink'];
const SIZES  = ['xs', 'sm', 'md'];

export default function Badge({
  children,
  color = 'gray',
  size = 'sm',
  dot = false,
  dotColor,
  icon,
  className = '',
  style,
  animate = false,
}) {
  const Component = animate ? motion.span : 'span';
  const animProps = animate
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }
    : {};

  const safeColor = COLORS.includes(color) ? color : 'gray';
  const safeSize  = SIZES.includes(size)   ? size  : 'sm';

  return (
    <Component
      className={[
        'badge-base',
        `badge--${safeColor}`,
        `badge--${safeSize}`,
        className,
      ].filter(Boolean).join(' ')}
      style={style}
      {...animProps}
    >
      {dot && (
        <span
          className="badge-dot"
          style={{ backgroundColor: dotColor || 'currentColor' }}
        />
      )}
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </Component>
  );
}
