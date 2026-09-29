import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, X } from 'lucide-react';
import useDebounce from '../../../hooks/useDebounce';
import './SearchBar.css';

const SIZES = ['sm', 'md', 'lg'];
const iconSize = { sm: 14, md: 16, lg: 18 };

export default function SearchBar({
  value: externalValue,
  onChange,
  onDebounce,
  debounceDelay = 300,
  placeholder = 'Search...',
  onClear,
  size = 'md',
  className = '',
  fullWidth = true,
  autoFocus = false,
}) {
  const s = SIZES.includes(size) ? size : 'md';
  const [internalValue, setInternalValue] = useState(externalValue ?? '');
  const currentValue = externalValue !== undefined ? externalValue : internalValue;
  const debouncedValue = useDebounce(currentValue, debounceDelay);

  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  useEffect(() => {
    if (onDebounce) {
      onDebounce(debouncedValue);
    }
  }, [debouncedValue, onDebounce]);

  const handleChange = (e) => {
    const nextVal = e.target.value;
    if (externalValue === undefined) {
      setInternalValue(nextVal);
    }
    onChange?.(nextVal);
  };

  const handleClear = () => {
    if (externalValue === undefined) {
      setInternalValue('');
    }
    onChange?.('');
    onClear?.();
  };

  return (
    <div className={['searchbar-wrap', fullWidth ? 'searchbar-wrap--full' : '', className].filter(Boolean).join(' ')}>
      <Search
        size={iconSize[s]}
        className={`searchbar-icon-left searchbar-icon-left--${s}`}
      />
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`input-base searchbar-wrap--full searchbar-input--${s}`}
      />
      {currentValue && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleClear}
          className="searchbar-clear"
        >
          <X size={iconSize[s]} />
        </motion.button>
      )}
    </div>
  );
}
