import './Loader.css';

export function Skeleton({ className = '', width, height, rounded = false }) {
  return (
    <div
      className={['shimmer', 'skeleton', rounded ? 'skeleton--rounded' : '', className].filter(Boolean).join(' ')}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="skeleton-card-header">
        <Skeleton width={40} height={40} rounded />
        <div className="skeleton-card-header-text">
          <Skeleton height={14} style={{ width: '75%' }} />
          <Skeleton height={12} style={{ width: '50%' }} />
        </div>
      </div>
      <div className="skeleton-card-lines">
        <Skeleton height={12} style={{ width: '100%' }} />
        <Skeleton height={12} style={{ width: '83%' }} />
        <Skeleton height={12} style={{ width: '66%' }} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-table-row">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} height={36} style={{ flex: 1 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-list-item">
          <Skeleton width={36} height={36} rounded />
          <div className="skeleton-list-item-text">
            <Skeleton height={13} style={{ width: '66%' }} />
            <Skeleton height={11} style={{ width: '33%' }} />
          </div>
          <Skeleton width={60} height={24} rounded />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
