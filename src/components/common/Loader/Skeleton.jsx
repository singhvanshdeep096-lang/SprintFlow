export function Skeleton({ className = '', width, height, rounded = false }) {
  return (
    <div
      className={`shimmer ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton width={40} height={40} rounded />
        <div className="flex-1 space-y-2">
          <Skeleton height={14} className="w-3/4" />
          <Skeleton height={12} className="w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton height={12} className="w-full" />
        <Skeleton height={12} className="w-5/6" />
        <Skeleton height={12} className="w-4/6" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} height={36} className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-surface-100">
          <Skeleton width={36} height={36} rounded />
          <div className="flex-1 space-y-2">
            <Skeleton height={13} className="w-2/3" />
            <Skeleton height={11} className="w-1/3" />
          </div>
          <Skeleton width={60} height={24} className="rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
