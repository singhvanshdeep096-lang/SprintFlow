import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import './Loader.css';

const sizeMap  = { sm: 16, md: 24, lg: 36, xl: 48 };
const COLORS   = ['primary', 'white', 'gray'];

export default function Loader({ size = 'md', text, fullPage = false, color = 'primary' }) {
  const safeColor = COLORS.includes(color) ? color : 'primary';
  const iconSize  = sizeMap[size] || sizeMap.md;

  const spinner = (
    <div className={`loader-wrap loader--${safeColor}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 size={iconSize} />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`loader-text${safeColor === 'white' ? ' loader-text--white' : ''}`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullPage) {
    return <div className="loader-fullpage">{spinner}</div>;
  }

  return spinner;
}
