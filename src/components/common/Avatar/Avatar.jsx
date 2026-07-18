const sizeMap = {
  xs: { container: 'w-6 h-6', text: 'text-[10px]' },
  sm: { container: 'w-7 h-7', text: 'text-xs' },
  md: { container: 'w-8 h-8', text: 'text-sm' },
  lg: { container: 'w-10 h-10', text: 'text-sm' },
  xl: { container: 'w-12 h-12', text: 'text-base' },
  '2xl': { container: 'w-16 h-16', text: 'text-xl' },
};

export default function Avatar({
  name = '',
  src,
  size = 'md',
  color,
  className = '',
  badge,
  badgeColor = '#EF4444',
  onClick,
  style,
}) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || '')
    .join('');

  const defaultColors = [
    '#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626',
    '#0891B2', '#DB2777', '#65A30D', '#9333EA', '#1D4ED8',
  ];

  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % defaultColors.length;
  const bgColor = color || defaultColors[colorIndex];

  const sizes = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative inline-flex shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizes.container} rounded-full object-cover ring-2 ring-white`}
        />
      ) : (
        <div
          className={`${sizes.container} rounded-full flex items-center justify-center ring-2 ring-white font-semibold text-white select-none`}
          style={{ backgroundColor: bgColor }}
        >
          <span className={sizes.text}>{initials || '?'}</span>
        </div>
      )}
      {badge && (
        <span
          className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
          style={{ backgroundColor: badgeColor }}
        />
      )}
    </div>
  );
}
