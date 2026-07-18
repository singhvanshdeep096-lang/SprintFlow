import { motion } from 'motion/react';

const colorMap = {
  primary: 'bg-primary-100 text-primary-700 border border-primary-200',
  success: 'bg-success-100 text-success-700 border border-green-200',
  warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  danger: 'bg-danger-100 text-danger-700 border border-red-200',
  purple: 'bg-purple-100 text-purple-700 border border-purple-200',
  cyan: 'bg-cyan-100 text-cyan-700 border border-cyan-200',
  gray: 'bg-surface-100 text-surface-600 border border-surface-200',
  orange: 'bg-orange-100 text-orange-700 border border-orange-200',
  pink: 'bg-pink-100 text-pink-700 border border-pink-200',
};

const sizeMap = {
  xs: 'text-[10px] px-1.5 py-0.5',
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

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
    ? { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: 'spring', stiffness: 400, damping: 25 } }
    : {};

  return (
    <Component
      className={[
        'inline-flex items-center gap-1 font-semibold rounded-full tracking-wide uppercase leading-none',
        colorMap[color] || colorMap.gray,
        sizeMap[size],
        className,
      ].filter(Boolean).join(' ')}
      style={style}
      {...animProps}
    >
      {dot && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: dotColor || 'currentColor' }}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </Component>
  );
}
