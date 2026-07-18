import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { loginAsync } from '../../redux/authSlice';
import { useToast } from '../../hooks/useToast';
import { useEffect, useState } from 'react';

// Self-contained premium Input
function AuthInput({ label, type = 'text', icon: Icon, placeholder, error, required, name, register, validation }) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {label}{required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none', display: 'flex' }}>
            <Icon size={15} />
          </div>
        )}
        <input
          type={isPassword ? (showPass ? 'text' : 'password') : type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...register(name, validation)}
          style={{
            width: '100%',
            padding: '11px 14px',
            paddingLeft: Icon ? 42 : 14,
            paddingRight: isPassword ? 42 : 14,
            border: `1.5px solid ${error ? '#EF4444' : focused ? '#2563EB' : '#E2E8F0'}`,
            borderRadius: 10,
            fontSize: 14,
            fontFamily: 'inherit',
            color: '#0F172A',
            background: '#FFFFFF',
            outline: 'none',
            boxShadow: focused ? (error ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3px rgba(37,99,235,0.1)') : 'none',
            transition: 'all 0.18s ease',
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {showPass
                ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
              }
            </svg>
          </button>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 12, color: '#EF4444', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success } = useToast();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: 'alex.morgan@sprintflow.io', password: 'password123' },
  });

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const onSubmit = () => {
    dispatch(loginAsync());
    setTimeout(() => {
      success('Welcome back!', 'You have been successfully signed in.');
      navigate('/dashboard');
    }, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', marginBottom: 6, letterSpacing: '-0.03em' }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 14, color: '#64748B' }}>Sign in to your SprintFlow workspace</p>
      </div>

      {/* Google SSO */}
      <motion.button
        whileHover={{ scale: 1.01, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}
        whileTap={{ scale: 0.99 }}
        type="button"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '11px 16px',
          border: '1.5px solid #E2E8F0',
          borderRadius: 10,
          background: '#FFFFFF',
          color: '#374151',
          fontFamily: 'inherit',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 20,
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </motion.button>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
        <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, whiteSpace: 'nowrap' }}>or continue with email</span>
        <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AuthInput
          label="Email address"
          type="email"
          icon={Mail}
          placeholder="you@company.com"
          error={errors.email?.message}
          required
          name="email"
          register={register}
          validation={{ required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' } }}
        />

        <div>
          <AuthInput
            label="Password"
            type="password"
            icon={Lock}
            placeholder="Enter your password"
            error={errors.password?.message}
            required
            name="password"
            register={register}
            validation={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Link
              to="/forgot-password"
              style={{ fontSize: 12, color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.01, boxShadow: '0 8px 24px rgba(37,99,235,0.35)' } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '13px 20px',
            background: loading ? '#93C5FD' : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
            transition: 'all 0.2s ease',
            marginTop: 4,
          }}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%' }}
            />
          ) : (
            <>Sign In <ArrowRight size={16} /></>
          )}
        </motion.button>
      </form>

      {/* Footer */}
      <p style={{ textAlign: 'center', fontSize: 14, color: '#64748B', marginTop: 20 }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
          Sign up free
        </Link>
      </p>

      {/* Demo hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: 20,
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
          border: '1px solid #BFDBFE',
          borderRadius: 10,
          textAlign: 'center',
          fontSize: 13,
          color: '#1D4ED8',
        }}
      >
        <span style={{ fontWeight: 700 }}>✦ Demo Mode</span> — Credentials are pre-filled. Just click Sign In.
      </motion.div>
    </motion.div>
  );
}
