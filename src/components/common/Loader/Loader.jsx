import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function Loader({ size = 'md', text, fullPage = false, color = 'primary' }) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 36,
    xl: 48,
  };

  const colorMap = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-surface-400',
  };

  const spinner = (
    <div className={`flex flex-col items-center gap-3 ${colorMap[color]}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 size={sizeMap[size]} />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-sm font-medium ${color === 'white' ? 'text-white/80' : 'text-surface-500'}`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
