import { motion } from 'motion/react';
import './Tabs.css';

const VARIANTS  = ['line', 'pill', 'button'];
const PLACEMENTS = {
  line:   { wrap: 'tabs-line',   btn: 'tab-line-btn'   },
  pill:   { wrap: 'tabs-pill',   btn: 'tab-pill-btn'   },
  button: { wrap: 'tabs-button', btn: 'tab-button-btn' },
};

export default function Tabs({ tabs, activeTab, onTabChange, variant = 'line', className = '' }) {
  const safeVariant = VARIANTS.includes(variant) ? variant : 'line';
  const v = PLACEMENTS[safeVariant];

  return (
    <div className={[v.wrap, className].filter(Boolean).join(' ')}>
      {tabs.map((tab) => {
        const id      = typeof tab === 'string' ? tab : tab.id;
        const label   = typeof tab === 'string' ? tab : tab.label;
        const icon    = typeof tab === 'object' ? tab.icon  : null;
        const badge   = typeof tab === 'object' ? tab.badge : null;
        const isActive = id === activeTab;

        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            whileTap={{ scale: 0.97 }}
            className={[v.btn, isActive ? 'active' : ''].filter(Boolean).join(' ')}
          >
            {icon  && <span>{icon}</span>}
            {label}
            {badge !== undefined && badge !== null && (
              <span className={`tab-badge ${isActive ? 'tab-badge--active' : 'tab-badge--inactive'}`}>
                {badge}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
