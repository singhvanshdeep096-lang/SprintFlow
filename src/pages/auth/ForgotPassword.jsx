import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input/Input';
import './Auth.css';

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 1000));
    setEmail(data.email);
    setSubmitted(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!submitted ? (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          <div className="auth-page-heading">
            <h1 className="auth-page-title">Reset password</h1>
            <p className="auth-page-subtitle">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <Input
              label="Email address"
              type="email"
              icon={<Mail size={15} />}
              placeholder="you@company.com"
              error={errors.email?.message}
              required
              autoFocus
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
              })}
            />

            <Button type="submit" fullWidth loading={isSubmitting} size="lg" icon={<ArrowRight size={16} />}>
              Send Reset Link
            </Button>
          </form>

          <Link to="/login" className="auth-back-link">
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </motion.div>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="auth-success"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="auth-success-icon-wrap"
          >
            <CheckCircle size={32} style={{ color: '#16A34A' }} />
          </motion.div>
          <h2 className="auth-success-title">Check your inbox</h2>
          <p className="auth-success-body">
            We sent a password reset link to<br />
            <span className="auth-success-email">{email}</span>
          </p>
          <p className="auth-success-resend">
            Didn't receive it? Check spam or{' '}
            <button
              onClick={() => setSubmitted(false)}
            >
              try a different email
            </button>
          </p>
          <Link to="/login">
            <Button variant="secondary" fullWidth icon={<ArrowLeft size={14} />}>
              Back to sign in
            </Button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
