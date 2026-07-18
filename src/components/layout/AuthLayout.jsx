import { Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, CheckCircle } from 'lucide-react';
import ToastContainer from '../common/Toast';

const FEATURES = [
  'Kanban boards with real-time updates',
  'Sprint planning & velocity tracking',
  'Intelligent task prioritization',
  'Team collaboration & mentions',
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex" style={{ background: '#F8FAFC' }}>

      {/* ========= LEFT BRANDING PANEL ========= */}
      <div
        className="hidden lg:flex lg:w-[480px] xl:w-[520px] relative overflow-hidden flex-col flex-shrink-0"
        style={{
          background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 30%, #2563eb 55%, #7c3aed 85%, #6d28d9 100%)',
        }}
      >
        {/* Radial glow blobs */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 60% 50% at 20% 20%, rgba(255,255,255,0.07) 0%, transparent 70%),
              radial-gradient(ellipse 50% 60% at 80% 80%, rgba(109,40,217,0.3) 0%, transparent 70%)
            `,
          }}
        />

        {/* Floating blobs */}
        {[
          { w: 80, h: 80, top: '8%', left: '72%', delay: 0 },
          { w: 56, h: 56, top: '22%', left: '12%', delay: 0.8 },
          { w: 100, h: 100, top: '55%', left: '68%', delay: 1.4 },
          { w: 44, h: 44, top: '70%', left: '20%', delay: 0.4 },
          { w: 64, h: 64, top: '38%', left: '80%', delay: 1.8 },
        ].map((blob, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -16, 0], rotate: [0, 8, 0], opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: blob.delay, ease: 'easeInOut' }}
            className="absolute rounded-2xl"
            style={{
              width: blob.w, height: blob.h,
              top: blob.top, left: blob.left,
              background: 'rgba(255,255,255,1)',
            }}
          />
        ))}

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 h-full">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">SprintFlow</span>
          </motion.div>

          {/* Hero */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
              className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5"
            >
              Ship faster.<br />
              <span style={{ color: 'rgba(191,219,254,0.95)' }}>Stay aligned.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-lg leading-relaxed max-w-sm"
              style={{ color: 'rgba(255,255,255,0.72)' }}
            >
              The modern project management platform built for high-performing engineering teams.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.5 }}
              className="mt-8 space-y-3"
            >
              {FEATURES.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  className="flex items-center gap-3 text-sm"
                  style={{ color: 'rgba(255,255,255,0.82)' }}
                >
                  <CheckCircle size={16} style={{ color: '#86efac', flexShrink: 0 }} />
                  {f}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <p
              className="text-sm leading-relaxed italic mb-4"
              style={{ color: 'rgba(255,255,255,0.88)' }}
            >
              "SprintFlow transformed how our team ships product. We cut cycle time by 40% in the first quarter."
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'rgba(255,255,255,0.25)' }}
              >
                JM
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Jamie Martinez</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>VP Engineering, Acme Corp</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ========= RIGHT FORM PANEL ========= */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 mb-8 lg:hidden"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
            >
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl" style={{ color: '#0F172A' }}>SprintFlow</span>
          </motion.div>

          <Outlet />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
