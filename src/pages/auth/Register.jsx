import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Building2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { registerAsync } from '../../redux/authSlice';
import { useToast } from '../../hooks/useToast';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const { loading } = useSelector((state) => state.auth);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await dispatch(registerAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'Developer'
      })).unwrap();
      success('Account created!', 'Welcome to SprintFlow.');
      navigate('/dashboard');
    } catch (err) {
      toastError('Registration failed', err || 'Error creating account');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 mb-2">Create your account</h1>
        <p className="text-surface-500 text-sm">Start your free 14-day trial. No credit card required.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Full name"
            icon={<User size={15} />}
            placeholder="Alex Morgan"
            error={errors.name?.message}
            required
            {...register('name', { required: 'Name is required' })}
          />
          <Input
            label="Company"
            icon={<Building2 size={15} />}
            placeholder="Acme Corp"
            {...register('company')}
          />
        </div>

        <Input
          label="Work email"
          type="email"
          icon={<Mail size={15} />}
          placeholder="alex@company.com"
          error={errors.email?.message}
          required
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
          })}
        />

        <Input
          label="Password"
          type="password"
          icon={<Lock size={15} />}
          placeholder="At least 8 characters"
          error={errors.password?.message}
          hint="Use a combination of letters, numbers, and symbols"
          required
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
          })}
        />

        <Input
          label="Confirm password"
          type="password"
          icon={<Lock size={15} />}
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          required
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === password || 'Passwords do not match',
          })}
        />

        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="terms"
            {...register('terms', { required: 'You must accept the terms' })}
            className="mt-0.5 w-4 h-4 accent-primary-600"
          />
          <label htmlFor="terms" className="text-xs text-surface-500 leading-relaxed">
            I agree to the{' '}
            <span className="text-primary-600 hover:underline cursor-pointer">Terms of Service</span>
            {' '}and{' '}
            <span className="text-primary-600 hover:underline cursor-pointer">Privacy Policy</span>
          </label>
        </div>
        {errors.terms && <p className="text-xs text-danger-600">{errors.terms.message}</p>}

        <Button type="submit" fullWidth loading={loading} size="lg" icon={<ArrowRight size={16} />}>
          Create Free Account
        </Button>
      </form>

      <p className="text-center text-sm text-surface-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
