import { useState } from 'react';
import { motion } from 'motion/react';

export default function Tabs({ tabs, activeTab, onTabChange, variant = 'line', className = '' }) {
  const variants = {
    line: {
      container: 'border-b border-surface-200',
      tab: 'px-4 py-3 text-sm font-medium border-b-2 transition-all duration-150',
      active: 'border-primary-600 text-primary-600',
      inactive: 'border-transparent text-surface-500 hover:text-surface-800 hover:border-surface-300',
    },
    pill: {
      container: 'flex gap-1 bg-surface-100 p-1 rounded-xl',
      tab: 'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150',
      active: 'bg-white text-surface-900 shadow-sm',
      inactive: 'text-surface-500 hover:text-surface-700',
    },
    button: {
      container: 'flex gap-2',
      tab: 'px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-150',
      active: 'bg-primary-600 text-white border-primary-600',
      inactive: 'bg-white text-surface-600 border-surface-200 hover:border-surface-300',
    },
  };

  const v = variants[variant] || variants.line;

  return (
    <div className={`flex ${v.container} ${className}`}>
      {tabs.map((tab) => {
        const isActive = (typeof tab === 'string' ? tab : tab.id) === activeTab;
        const label = typeof tab === 'string' ? tab : tab.label;
        const id = typeof tab === 'string' ? tab : tab.id;
        const icon = typeof tab === 'object' ? tab.icon : null;
        const badge = typeof tab === 'object' ? tab.badge : null;

        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            whileTap={{ scale: 0.97 }}
            className={`${v.tab} ${isActive ? v.active : v.inactive} flex items-center gap-2 whitespace-nowrap`}
          >
            {icon && <span>{icon}</span>}
            {label}
            {badge !== undefined && badge !== null && (
              <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1 ${isActive ? 'bg-primary-100 text-primary-700' : 'bg-surface-200 text-surface-600'}`}>
                {badge}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
