import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Tooltip.css';

const placementMap = {
  top:    { initial: { y: 8, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 8, opacity: 0 } },
  bottom: { initial: { y: -8, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -8, opacity: 0 } },
  left:   { initial: { x: 8, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: 8, opacity: 0 } },
  right:  { initial: { x: -8, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: -8, opacity: 0 } },
};

const PLACEMENTS = ['top', 'bottom', 'left', 'right'];

export default function Tooltip({ children, content, placement = 'top', delay = 300, className = '' }) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const show = () => { timeoutRef.current = setTimeout(() => setVisible(true), delay); };
  const hide = () => { clearTimeout(timeoutRef.current); setVisible(false); };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const safePlacement = PLACEMENTS.includes(placement) ? placement : 'top';
  const variant = placementMap[safePlacement];

  if (!content) return children;

  return (
    <div className="tooltip-wrap" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className={[`tooltip-panel tooltip-panel--${safePlacement}`, className].filter(Boolean).join(' ')}
          >
            <div className="tooltip-content">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
