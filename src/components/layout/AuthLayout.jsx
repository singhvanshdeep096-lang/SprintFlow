import { Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, CheckCircle } from 'lucide-react';
import ToastContainer from '../common/Toast';
import './Layout.css';

const FEATURES = [
  'Kanban boards with real-time updates',
  'Sprint planning & velocity tracking',
  'Intelligent task prioritization',
  'Team collaboration & mentions',
];

export default function AuthLayout() {
  return (
    <div className="auth-layout">

      {/* ===== Left branding panel ===== */}
      <div
        className="auth-brand"
        style={{
          background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 30%, #2563eb 55%, #7c3aed 85%, #6d28d9 100%)',
        }}
      >
        {/* Radial glow */}
        <div
          className="auth-brand-glow"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 60% 50% at 20% 20%, rgba(255,255,255,0.07) 0%, transparent 70%),
              radial-gradient(ellipse 50% 60% at 80% 80%, rgba(109,40,217,0.3) 0%, transparent 70%)
            `,
          }}
        />

        {/* Floating blobs */}
        {[
          { w: 80,  h: 80,  top: '8%',  left: '72%', delay: 0 },
          { w: 56,  h: 56,  top: '22%', left: '12%', delay: 0.8 },
          { w: 100, h: 100, top: '55%', left: '68%', delay: 1.4 },
          { w: 44,  h: 44,  top: '70%', left: '20%', delay: 0.4 },
          { w: 64,  h: 64,  top: '38%', left: '80%', delay: 1.8 },
        ].map((blob, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -16, 0], rotate: [0, 8, 0], opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: blob.delay, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: blob.w, height: blob.h,
              top: blob.top, left: blob.left,
              background: 'rgba(255,255,255,1)',
              borderRadius: 16,
            }}
          />
        ))}

        {/* Dot grid */}
        <div className="auth-brand-dots" />

        {/* Content */}
        <div className="auth-brand-content">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="auth-brand-logo"
          >
            <div
              className="auth-brand-logo-icon"
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              <Zap size={20} style={{ color: '#ffffff' }} />
            </div>
            <span className="auth-brand-logo-text">SprintFlow</span>
          </motion.div>

          {/* Hero */}
          <div className="auth-brand-hero">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
            >
              Ship faster.<br />
              <span style={{ color: 'rgba(191,219,254,0.95)' }}>Stay aligned.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              style={{ color: 'rgba(255,255,255,0.72)' }}
            >
              The modern project management platform built for high-performing engineering teams.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.5 }}
              className="auth-brand-features"
            >
              {FEATURES.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  className="auth-brand-feature"
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
            className="auth-brand-testimonial"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.88)' }}>
              "SprintFlow transformed how our team ships product. We cut cycle time by 40% in the first quarter."
            </p>
            <div className="auth-brand-testimonial-meta">
              <div className="auth-testimonial-avatar" style={{ background: 'rgba(255,255,255,0.25)' }}>JM</div>
              <div>
                <p className="auth-testimonial-name">Jamie Martinez</p>
                <p className="auth-testimonial-role" style={{ color: 'rgba(255,255,255,0.55)' }}>VP Engineering, Acme Corp</p>
              </div>
              <div className="auth-testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: '#fbbf24', fontSize: 13 }}>★</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== Right form panel ===== */}
      <div className="auth-form-panel">
        <div className="auth-form-wrap">
          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="auth-mobile-logo"
          >
            <div
              className="auth-mobile-logo-icon"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
            >
              <Zap size={18} style={{ color: '#ffffff' }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#0F172A' }}>SprintFlow</span>
          </motion.div>

          <Outlet />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
