import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, User, Mail, MapPin, Clock, Shield, Edit3, Save, X, Lock } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input/Input';
import Tabs from '../../components/common/Tabs/Tabs';
import { updateUser } from '../../redux/authSlice';
import { useToast } from '../../hooks/useToast';
import './Profile.css';

function PersonalInfoForm({ user }) {
  const dispatch = useDispatch();
  const { success } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name, email: user?.email, role: user?.role,
      location: user?.location, timezone: user?.timezone, bio: user?.bio,
    },
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
      <div className="profile-card-title-row">
        <h2 className="profile-card-title">Personal Information</h2>
        {!editing ? (
          <Button variant="secondary" size="sm" icon={<Edit3 size={13} />} onClick={() => setEditing(true)}>Edit</Button>
        ) : (
          <div className="profile-card-actions">
            <Button variant="ghost" size="sm" icon={<X size={13} />} onClick={() => { setEditing(false); reset(); }}>Cancel</Button>
            <Button size="sm" loading={saving} icon={<Save size={13} />} onClick={handleSubmit(onSubmit)}>Save</Button>
          </div>
        )}
      </div>

      <form className="profile-form-grid">
        <Input label="Full name"   disabled={!editing} icon={<User   size={14} />} error={errors.name?.message}  {...register('name',  { required: 'Name is required' })} />
        <Input label="Email"       disabled={!editing} icon={<Mail   size={14} />} error={errors.email?.message} type="email" {...register('email', { required: 'Email is required' })} />
        <Input label="Role / Title" disabled={!editing} icon={<User  size={14} />} {...register('role')} />
        <Input label="Location"    disabled={!editing} icon={<MapPin size={14} />} {...register('location')} />
        <Input label="Timezone"    disabled={!editing} icon={<Clock  size={14} />} {...register('timezone')} />
        <div />
        <div className="profile-form-full">
          <label className="profile-bio-label">Bio</label>
          <textarea
            {...register('bio')}
            disabled={!editing}
            rows={3}
            className={`input-base input-wrap--full${!editing ? ' opacity-60 cursor-not-allowed' : ''}`}
            style={{ resize: 'none' }}
            placeholder="Tell us about yourself..."
          />
        </div>
      </form>
    </div>
  );
}

function ChangePasswordForm() {
  const { success } = useToast();
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
      <h2 className="profile-card-title" style={{ marginBottom: 20 }}>Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Current password" type="password" icon={<Lock size={14} />}
          error={errors.currentPassword?.message}
          {...register('currentPassword', { required: 'Current password is required' })} />
        <Input label="New password" type="password" icon={<Lock size={14} />}
          error={errors.newPassword?.message}
          hint="At least 8 characters with letters and numbers"
          {...register('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'Must be at least 8 characters' } })} />
        <Input label="Confirm new password" type="password" icon={<Lock size={14} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', { required: 'Please confirm your password', validate: (v) => v === newPassword || 'Passwords do not match' })} />
        <Button type="submit" loading={saving} size="sm">Update Password</Button>
      </form>
    </div>
  );
}

function SecuritySection() {
  const sessions = [
    { device: 'MacBook Pro',   location: 'San Francisco, CA', lastActive: '2 minutes ago', current: true },
    { device: 'iPhone 15 Pro', location: 'San Francisco, CA', lastActive: '3 hours ago',   current: false },
    { device: 'Windows PC',    location: 'New York, NY',      lastActive: '5 days ago',    current: false },
  ];

  return (
    <div className="card p-6">
      <h2 className="profile-card-title" style={{ marginBottom: 20 }}>Active Sessions</h2>
      <div className="profile-session-stack">
        {sessions.map((session, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="profile-session-row"
          >
            <div className="profile-session-left">
              <div className="profile-session-icon">
                <Shield size={16} style={{ color: 'var(--color-surface-500)' }} />
              </div>
              <div>
                <p className="profile-session-device">
                  {session.device}
                  {session.current && <span className="profile-current-badge">Current</span>}
                </p>
                <p className="profile-session-meta">{session.location} · {session.lastActive}</p>
              </div>
            </div>
            {!session.current && <Button variant="outline-danger" size="xs">Revoke</Button>}
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
    { id: 'profile',  label: 'Profile' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <PageTransition className="profile-page">
      <h1 className="profile-title">My Profile</h1>

      {/* Avatar Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
        style={{ marginBottom: 20 }}
      >
        <div className="profile-avatar-card">
          <div className="profile-avatar-wrap">
            <Avatar name={user?.name || 'User'} size="2xl" />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="profile-avatar-overlay"
            >
              <Camera size={18} style={{ color: '#ffffff' }} />
            </motion.div>
          </div>
          <div className="profile-avatar-info">
            <h2>{user?.name}</h2>
            <p className="profile-avatar-role">{user?.role}</p>
            <p className="profile-avatar-email">{user?.email}</p>
            <p className="profile-avatar-tz"><Clock size={10} />{user?.timezone}</p>
          </div>
          <div className="profile-avatar-joined">
            <p className="profile-avatar-joined-label">Member since</p>
            <p className="profile-avatar-joined-date">
              {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>
      </motion.div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="pill" className="mb-5" />

      {activeTab === 'profile' && (
        <div className="profile-section-stack">
          <PersonalInfoForm user={user} />
          <ChangePasswordForm />
        </div>
      )}
      {activeTab === 'security' && <SecuritySection />}
    </PageTransition>
  );
}
