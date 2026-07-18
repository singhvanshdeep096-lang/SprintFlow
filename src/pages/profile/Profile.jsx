import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, User, Mail, MapPin, Clock, Shield, Edit3, Save, X, Lock, Eye, EyeOff } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input/Input';
import Tabs from '../../components/common/Tabs/Tabs';
import { updateUser } from '../../redux/authSlice';
import { useToast } from '../../hooks/useToast';

function PersonalInfoForm({ user }) {
  const dispatch = useDispatch();
  const { success } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: user?.name, email: user?.email, role: user?.role, location: user?.location, timezone: user?.timezone, bio: user?.bio },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    dispatch(updateUser(data));
    success('Profile updated', 'Your changes have been saved.');
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-surface-900">Personal Information</h2>
        {!editing ? (
          <Button variant="secondary" size="sm" icon={<Edit3 size={13} />} onClick={() => setEditing(true)}>Edit</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" icon={<X size={13} />} onClick={() => { setEditing(false); reset(); }}>Cancel</Button>
            <Button size="sm" loading={saving} icon={<Save size={13} />} onClick={handleSubmit(onSubmit)}>Save</Button>
          </div>
        )}
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full name" disabled={!editing} icon={<User size={14} />}
          error={errors.name?.message} {...register('name', { required: 'Name is required' })} />
        <Input label="Email" type="email" disabled={!editing} icon={<Mail size={14} />}
          error={errors.email?.message} {...register('email', { required: 'Email is required' })} />
        <Input label="Role / Title" disabled={!editing} icon={<User size={14} />} {...register('role')} />
        <Input label="Location" disabled={!editing} icon={<MapPin size={14} />} {...register('location')} />
        <Input label="Timezone" disabled={!editing} icon={<Clock size={14} />} {...register('timezone')} />
        <div />
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Bio</label>
          <textarea {...register('bio')} disabled={!editing} rows={3}
            className={`input-base resize-none w-full ${!editing ? 'bg-surface-50 opacity-60 cursor-not-allowed' : ''}`}
            placeholder="Tell us about yourself..." />
        </div>
      </form>
    </div>
  );
}

function ChangePasswordForm() {
  const { success, error } = useToast();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const newPassword = watch('newPassword');

  const onSubmit = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    success('Password changed', 'Your password has been updated.');
    setSaving(false);
    reset();
  };

  return (
    <div className="card p-6">
      <h2 className="text-base font-semibold text-surface-900 mb-5">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <Input label="Current password" type="password" icon={<Lock size={14} />}
          error={errors.currentPassword?.message}
          {...register('currentPassword', { required: 'Current password is required' })} />
        <Input label="New password" type="password" icon={<Lock size={14} />}
          error={errors.newPassword?.message}
          hint="At least 8 characters with letters and numbers"
          {...register('newPassword', {
            required: 'New password is required',
            minLength: { value: 8, message: 'Must be at least 8 characters' },
          })} />
        <Input label="Confirm new password" type="password" icon={<Lock size={14} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (v) => v === newPassword || 'Passwords do not match',
          })} />
        <Button type="submit" loading={saving} size="sm">Update Password</Button>
      </form>
    </div>
  );
}

function SecuritySection() {
  const sessions = [
    { device: 'MacBook Pro', location: 'San Francisco, CA', lastActive: '2 minutes ago', current: true },
    { device: 'iPhone 15 Pro', location: 'San Francisco, CA', lastActive: '3 hours ago', current: false },
    { device: 'Windows PC', location: 'New York, NY', lastActive: '5 days ago', current: false },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-base font-semibold text-surface-900 mb-5">Active Sessions</h2>
      <div className="space-y-3">
        {sessions.map((session, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center justify-between p-4 rounded-xl border border-surface-100 hover:bg-surface-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-100 flex items-center justify-center">
                <Shield size={16} className="text-surface-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-800 flex items-center gap-2">
                  {session.device}
                  {session.current && (
                    <span className="text-[10px] font-bold text-success-600 bg-success-100 px-1.5 py-0.5 rounded-full">Current</span>
                  )}
                </p>
                <p className="text-xs text-surface-400">{session.location} · {session.lastActive}</p>
              </div>
            </div>
            {!session.current && (
              <Button variant="outline-danger" size="xs">Revoke</Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <PageTransition className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">My Profile</h1>

      {/* Avatar Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-5 flex items-center gap-5"
      >
        <div className="relative group">
          <Avatar name={user?.name || 'User'} size="2xl" />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center cursor-pointer"
          >
            <Camera size={18} className="text-white" />
          </motion.div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-surface-900">{user?.name}</h2>
          <p className="text-surface-500 text-sm">{user?.role}</p>
          <p className="text-surface-400 text-xs mt-1">{user?.email}</p>
          <p className="text-surface-400 text-xs mt-0.5 flex items-center gap-1">
            <Clock size={10} />{user?.timezone}
          </p>
        </div>
        <div className="ml-auto hidden sm:block">
          <div className="text-right">
            <p className="text-xs text-surface-400">Member since</p>
            <p className="text-sm font-semibold text-surface-700">
              {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>
      </motion.div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="pill" className="mb-5" />

      {activeTab === 'profile' && (
        <div className="space-y-5">
          <PersonalInfoForm user={user} />
          <ChangePasswordForm />
        </div>
      )}

      {activeTab === 'security' && <SecuritySection />}
    </PageTransition>
  );
}
