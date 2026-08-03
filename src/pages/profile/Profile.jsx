import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, User, Mail, MapPin, Clock, Shield, Edit3, Save, X, Lock, Calendar, Briefcase } from 'lucide-react';
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
      name: user?.name || 'Alex Morgan',
      email: user?.email || 'alex.morgan@sprintflow.io',
      role: user?.role || 'Product Manager',
      location: user?.location || 'San Francisco, CA',
      timezone: user?.timezone || 'America/Los_Angeles',
      bio: user?.bio || 'Building products that people love. PM by day, designer by night.',
    },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    dispatch(updateUser(data));
    success('Profile updated', 'Your changes have been saved successfully.');
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div>
          <h2 className="profile-card-title">Personal Details</h2>
          <p className="profile-card-subtitle">Manage your personal information and contact options</p>
        </div>
        {!editing ? (
          <Button variant="secondary" size="sm" icon={<Edit3 size={13} />} onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="profile-card-actions">
            <Button variant="ghost" size="sm" icon={<X size={13} />} onClick={() => { setEditing(false); reset(); }}>
              Cancel
            </Button>
            <Button size="sm" loading={saving} icon={<Save size={13} />} onClick={handleSubmit(onSubmit)}>
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <form className="profile-form-grid">
        <Input
          label="Full name"
          disabled={!editing}
          icon={<User size={14} />}
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <Input
          label="Email address"
          disabled={!editing}
          icon={<Mail size={14} />}
          error={errors.email?.message}
          type="email"
          {...register('email', { required: 'Email is required' })}
        />
        <Input
          label="Role / Job Title"
          disabled={!editing}
          icon={<Briefcase size={14} />}
          {...register('role')}
        />
        <Input
          label="Location"
          disabled={!editing}
          icon={<MapPin size={14} />}
          {...register('location')}
        />
        <Input
          label="Timezone"
          disabled={!editing}
          icon={<Clock size={14} />}
          {...register('timezone')}
        />

        <div className="profile-form-full">
          <label className="profile-bio-label">Biography</label>
          <textarea
            {...register('bio')}
            disabled={!editing}
            rows={3}
            className={`profile-bio-textarea ${!editing ? 'textarea-disabled' : ''}`}
            placeholder="Tell your team about yourself..."
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
    await new Promise((r) => setTimeout(r, 600));
    success('Password updated', 'Your account password has been changed.');
    setSaving(false);
    reset();
  };

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div>
          <h2 className="profile-card-title">Security & Credentials</h2>
          <p className="profile-card-subtitle">Update your password to keep your account secure</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="password-form-stack">
        <Input
          label="Current password"
          type="password"
          icon={<Lock size={14} />}
          error={errors.currentPassword?.message}
          {...register('currentPassword', { required: 'Current password is required' })}
        />
        <div className="password-grid">
          <Input
            label="New password"
            type="password"
            icon={<Lock size={14} />}
            error={errors.newPassword?.message}
            hint="At least 8 characters with letters & numbers"
            {...register('newPassword', {
              required: 'New password is required',
              minLength: { value: 8, message: 'Must be at least 8 characters' }
            })}
          />
          <Input
            label="Confirm new password"
            type="password"
            icon={<Lock size={14} />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (v) => v === newPassword || 'Passwords do not match'
            })}
          />
        </div>

        <div className="profile-save-row">
          <Button type="submit" loading={saving} size="sm">
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}

function SecuritySection() {
  const sessions = [
    { device: 'MacBook Pro 16"', location: 'San Francisco, CA · 192.168.1.42', lastActive: 'Active now', current: true },
    { device: 'iPhone 15 Pro',   location: 'San Francisco, CA · 10.0.0.12',   lastActive: '3 hours ago', current: false },
    { device: 'Windows Desktop', location: 'New York, NY · 172.16.0.4',       lastActive: '5 days ago',  current: false },
  ];

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div>
          <h2 className="profile-card-title">Active Devices & Sessions</h2>
          <p className="profile-card-subtitle">Manage devices logged into your account</p>
        </div>
      </div>

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
              <div className={`session-icon-box ${session.current ? 'session-icon--active' : ''}`}>
                <Shield size={18} />
              </div>
              <div className="session-info">
                <div className="session-device-row">
                  <span className="profile-session-device">{session.device}</span>
                  {session.current && <span className="profile-current-badge">Current device</span>}
                </div>
                <p className="profile-session-meta">{session.location} · {session.lastActive}</p>
              </div>
            </div>
            {!session.current && (
              <Button variant="outline-danger" size="xs">Revoke Session</Button>
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
    { id: 'profile',  label: 'Profile' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <PageTransition className="profile-page">
      <div className="profile-page-container">
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">View and update your account details, role preferences, and security settings</p>
        </div>

        {/* Top Avatar Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="profile-hero-card"
        >
          <div className="profile-hero-banner" />
          <div className="profile-avatar-card">
            <div className="profile-avatar-wrap">
              <Avatar name={user?.name || 'Alex Morgan'} size="2xl" color="#2563EB" />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="profile-avatar-overlay"
              >
                <Camera size={18} style={{ color: '#ffffff' }} />
              </motion.div>
            </div>

            <div className="profile-avatar-info">
              <div className="profile-name-row">
                <h2>{user?.name || 'Alex Morgan'}</h2>
                <span className="profile-role-badge">{user?.role || 'Product Manager'}</span>
              </div>
              <p className="profile-avatar-email">
                <Mail size={13} />
                <span>{user?.email || 'alex.morgan@sprintflow.io'}</span>
              </p>
              <p className="profile-avatar-tz">
                <Clock size={13} />
                <span>{user?.timezone || 'America/Los_Angeles'}</span>
              </p>
            </div>

            <div className="profile-avatar-joined">
              <span className="profile-joined-label">Member since</span>
              <span className="profile-joined-date">
                <Calendar size={13} />
                {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2026'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="pill" className="profile-tabs-bar" />

        {activeTab === 'profile' && (
          <div className="profile-section-stack">
            <PersonalInfoForm user={user} />
            <ChangePasswordForm />
          </div>
        )}

        {activeTab === 'security' && <SecuritySection />}
      </div>
    </PageTransition>
  );
}

