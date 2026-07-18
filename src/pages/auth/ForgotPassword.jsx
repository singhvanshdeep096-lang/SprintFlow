import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input/Input';

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm();

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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-surface-900 mb-2">Reset password</h1>
            <p className="text-surface-500 text-sm">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Link to="/login" className="flex items-center gap-2 justify-center mt-6 text-sm text-surface-500 hover:text-surface-700 transition-colors">
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
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={32} className="text-success-600" />
          </motion.div>
          <h2 className="text-xl font-bold text-surface-900 mb-2">Check your inbox</h2>
          <p className="text-surface-500 text-sm mb-6">
            We sent a password reset link to<br />
            <span className="font-semibold text-surface-700">{email}</span>
          </p>
          <p className="text-xs text-surface-400 mb-6">
            Didn't receive it? Check spam or{' '}
            <button
              onClick={() => setSubmitted(false)}
              className="text-primary-600 hover:underline font-medium"
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
