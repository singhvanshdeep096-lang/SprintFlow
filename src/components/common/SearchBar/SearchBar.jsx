import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  size = 'md',
  className = '',
  fullWidth = true,
  autoFocus = false,
}) {
  const sizeClasses = {
    sm: 'pl-8 pr-8 py-1.5 text-sm',
    md: 'pl-10 pr-10 py-2.5 text-sm',
    lg: 'pl-11 pr-11 py-3 text-base',
  };

  const iconSize = { sm: 14, md: 16, lg: 18 };
  const iconPos = {
    sm: 'left-2.5 top-1/2 -translate-y-1/2',
    md: 'left-3.5 top-1/2 -translate-y-1/2',
    lg: 'left-3.5 top-1/2 -translate-y-1/2',
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''} ${className}`}>
      <Search
        size={iconSize[size]}
        className={`absolute ${iconPos[size]} text-surface-400 pointer-events-none`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={[
          'input-base w-full',
          sizeClasses[size],
        ].join(' ')}
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => { onChange(''); onClear?.(); }}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors`}
        >
          <X size={iconSize[size]} />
        </motion.button>
      )}
    </div>
  );
}
