import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { loginAsync } from '../../redux/authSlice';
import { useToast } from '../../hooks/useToast';
import { useEffect, useState } from 'react';
import './Auth.css';

function AuthInput({ label, type = 'text', icon: Icon, placeholder, error, required, name, register, validation }) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="auth-input-group">
      <label className="auth-input-label">
        {label}{required && <span className="auth-input-required">*</span>}
      </label>
      <div className="auth-input-wrap">
        {Icon && (
          <div className="auth-input-icon-left">
            <Icon size={15} />
          </div>
        )}
        <input
          type={isPassword ? (showPass ? 'text' : 'password') : type}
          placeholder={placeholder}
          {...register(name, validation)}
          className={`auth-input-field ${Icon ? 'auth-input-field--has-left' : ''} ${isPassword ? 'auth-input-field--has-right' : ''} ${error ? 'auth-input-field--error' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="auth-input-pw-toggle"
            aria-label={showPass ? 'Hide password' : 'Show password'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {showPass
                ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
              }
            </svg>
          </button>
        )}
      </div>
      {error && (
        <p className="auth-input-error">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { loading, isAuthenticated, user } = useSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState('user'); // 'user' or 'admin'

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: 'alex.morgan@sprintflow.io', password: 'password123' },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user?.role?.toLowerCase();
      if (userRole === 'admin' || user?.is_superuser) {
        navigate('/admin');
      } else {
        navigate('/projects');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const selectRoleDemo = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setValue('email', 'admin@sprintflow.io');
      setValue('password', 'password123');
    } else {
      setValue('email', 'alex.morgan@sprintflow.io');
      setValue('password', 'password123');
    }
  };

  const onSubmit = async (data) => {
    try {
      const loggedUser = await dispatch(loginAsync(data)).unwrap();
      const roleName = loggedUser?.role?.toLowerCase();
      if (roleName === 'admin' || loggedUser?.is_superuser) {
        success('Administrator Access', 'Credentials verified! Redirecting to Admin Panel...');
        navigate('/admin');
      } else {
        success('Welcome back!', 'Credentials verified! Redirecting to Projects...');
        navigate('/projects');
      }
    } catch (err) {
      toastError('Login failed', err || 'Invalid credentials');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="auth-page-heading">
        <h1 className="auth-page-title">
          Welcome back
        </h1>
        <p className="auth-page-subtitle">Sign in to your SprintFlow workspace</p>
      </div>

      {/* Role Selection Tabs */}
      <div className="auth-role-tabs-wrap">
        <label className="auth-role-tabs-label">
          Select Login Role
        </label>
        <div className="auth-role-tabs">
          <button
            type="button"
            onClick={() => selectRoleDemo('user')}
            className={`auth-role-tab ${selectedRole === 'user' ? 'auth-role-tab--active-user' : ''}`}
          >
            <span>👤 User Login</span>
          </button>
          <button
            type="button"
            onClick={() => selectRoleDemo('admin')}
            className={`auth-role-tab ${selectedRole === 'admin' ? 'auth-role-tab--active-admin' : ''}`}
          >
            <span>🛡️ Admin Login</span>
          </button>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="button"
        className="auth-google-btn"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
          <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
        Continue with Google
      </motion.button>

      <div className="auth-divider">
        <div className="auth-divider-line" />
        <span className="auth-divider-text">or continue with email</span>
        <div className="auth-divider-line" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
          <div className="auth-forgot-row">
            <Link
              to="/forgot-password"
              className="auth-forgot-link"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={!loading ? { scale: 1.01 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className="auth-submit-btn"
        >
          {loading ? (
            <div className="auth-submit-spinner" />
          ) : (
            <>Sign In <ArrowRight size={16} /></>
          )}
        </motion.button>
      </form>

      <p className="auth-switch">
        Don't have an account?{' '}
        <Link to="/register">
          Sign up free
        </Link>
      </p>
    </motion.div>
  );
}
