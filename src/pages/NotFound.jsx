import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Zap } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-lg"
      >
        {/* Animated 404 */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-8"
        >
          <div className="text-[120px] font-black text-gradient leading-none select-none">
            404
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute -top-2 -right-2 w-10 h-10 rounded-xl gradient-primary flex items-center justify-center"
          >
            <Zap size={20} className="text-white" />
          </motion.div>
        </motion.div>

        <h1 className="text-2xl font-bold text-surface-900 mb-3">
          Page not found
        </h1>
        <p className="text-surface-500 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            variant="secondary"
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            icon={<Home size={16} />}
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
