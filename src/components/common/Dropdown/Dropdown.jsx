import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Dropdown.css';

const ALIGNS = ['left', 'right', 'center'];
const WIDTHS  = ['auto', 'sm', 'md', 'lg', 'xl'];

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

  const safeAlign = ALIGNS.includes(align) ? align : 'left';
  const safeWidth = WIDTHS.includes(width)  ? width : 'auto';

  return (
    <div ref={containerRef} className={`dropdown-wrap ${className}`}>
      <div onClick={() => setOpen((prev) => !prev)} className="dropdown-trigger">
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
              'dropdown-panel',
              'dropdown-content',
              `dropdown-panel--${safeAlign}`,
              `dropdown-panel--${safeWidth}`,
            ].join(' ')}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
