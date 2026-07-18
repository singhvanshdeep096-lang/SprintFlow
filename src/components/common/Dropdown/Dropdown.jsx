import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Dropdown({
  trigger,
  children,
  align = 'left',
  width = 'auto',
  className = '',
  closeOnSelect = true,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  const widthClasses = {
    auto: 'min-w-[160px]',
    sm: 'w-40',
    md: 'w-52',
    lg: 'w-64',
    xl: 'w-80',
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setOpen((prev) => !prev)}>
        {typeof trigger === 'function' ? trigger(open) : trigger}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            onClick={closeOnSelect ? () => setOpen(false) : undefined}
            className={[
              'absolute top-full mt-2 z-50 dropdown-content',
              alignClasses[align] || alignClasses.left,
              widthClasses[width] || widthClasses.auto,
            ].join(' ')}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
