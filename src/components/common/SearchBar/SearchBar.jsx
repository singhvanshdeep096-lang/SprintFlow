import { motion } from 'motion/react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

const SIZES = ['sm', 'md', 'lg'];
const iconSize = { sm: 14, md: 16, lg: 18 };

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
  const s = SIZES.includes(size) ? size : 'md';

  return (
    <div className={['searchbar-wrap', fullWidth ? 'searchbar-wrap--full' : '', className].filter(Boolean).join(' ')}>
      <Search
        size={iconSize[s]}
        className={`searchbar-icon-left searchbar-icon-left--${s}`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`input-base searchbar-wrap--full searchbar-input--${s}`}
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => { onChange(''); onClear?.(); }}
          className="searchbar-clear"
        >
          <X size={iconSize[s]} />
        </motion.button>
      )}
    </div>
  );
}
