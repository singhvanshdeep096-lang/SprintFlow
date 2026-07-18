import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const placementMap = {
  top: { initial: { y: 8, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 8, opacity: 0 } },
  bottom: { initial: { y: -8, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -8, opacity: 0 } },
  left: { initial: { x: 8, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: 8, opacity: 0 } },
  right: { initial: { x: -8, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: -8, opacity: 0 } },
};

export default function Tooltip({ children, content, placement = 'top', delay = 300, className = '' }) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const variant = placementMap[placement] || placementMap.top;

  if (!content) return children;

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className={[
              'absolute z-[100] pointer-events-none',
              positionClasses[placement],
              className,
            ].join(' ')}
          >
            <div className="bg-surface-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg max-w-[200px] text-center leading-snug">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
