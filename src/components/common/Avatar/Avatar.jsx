import './Avatar.css';

const SIZE_KEYS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];

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

  const colorIndex =
    name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    defaultColors.length;
  const bgColor = color || defaultColors[colorIndex];

  const safeSize = SIZE_KEYS.includes(size) ? size : 'md';

  return (
    <div
      className={[
        'avatar-wrap',
        onClick ? 'avatar-wrap--clickable' : '',
        `avatar--${safeSize}`,
        className,
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      style={style}
    >
      {src ? (
        <img src={src} alt={name} className="avatar-img" />
      ) : (
        <div
          className="avatar-initials"
          style={{ backgroundColor: bgColor }}
        >
          <span className={`avatar-text--${safeSize}`}>{initials || '?'}</span>
        </div>
      )}
      {badge && (
        <span
          className="avatar-badge"
          style={{ backgroundColor: badgeColor }}
        />
      )}
    </div>
  );
}
