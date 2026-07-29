import { useState } from 'react';
import { motion } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Settings as SettingsIcon, Globe, Bell, Shield, Palette,
  Moon, Sun, Monitor, ChevronRight
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Tabs from '../../components/common/Tabs/Tabs';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input/Input';
import { toggleTheme } from '../../redux/uiSlice';
import { useToast } from '../../hooks/useToast';
import './Settings.css';

function ToggleSwitch({ checked, onChange }) {
  return (
    <motion.button
      type="button"
      onClick={() => onChange(!checked)}
      className={`toggle-switch ${checked ? 'toggle-switch--on' : 'toggle-switch--off'}`}
    >
      <motion.div
        animate={{ x: checked ? 19 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="toggle-knob"
      />
    </motion.button>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="setting-row">
      <div>
        <p className="setting-row-label">{label}</p>
        {description && <p className="setting-row-desc">{description}</p>}
      </div>
      <div className="setting-row-control">{children}</div>
    </div>
  );
}

function GeneralSettings() {
  const { success } = useToast();
  return (
    <div className="settings-section-stack">
      <div className="card p-5">
        <h3 className="settings-card-title">General Settings</h3>
        <p className="settings-card-subtitle">Configure your workspace preferences</p>
        <div>
          <SettingRow label="Language" description="Interface display language">
            <select className="input-base settings-select">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </SettingRow>
          <SettingRow label="Date Format" description="How dates are displayed across the app">
            <select className="input-base settings-select">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </SettingRow>
          <SettingRow label="Time Format" description="12-hour or 24-hour clock">
            <select className="input-base settings-select">
              <option>12-hour</option>
              <option>24-hour</option>
            </select>
          </SettingRow>
          <SettingRow label="First Day of Week" description="Calendar week starts on">
            <select className="input-base settings-select">
              <option>Sunday</option>
              <option>Monday</option>
            </select>
          </SettingRow>
        </div>
        <div className="settings-save-row">
          <Button size="sm" onClick={() => success('Settings saved', 'General settings updated.')}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const themes = [
    { id: 'light', label: 'Light', Icon: Sun },
    { id: 'dark',  label: 'Dark',  Icon: Moon },
    { id: 'system', label: 'System', Icon: Monitor },
  ];

  return (
    <div className="settings-section-stack">
      <div className="card p-5">
        <h3 className="settings-card-title">Theme</h3>
        <div className="settings-theme-grid">
          {themes.map(({ id, label, Icon }) => {
            const isActive = theme === id;
            return (
              <motion.button
                key={id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => dispatch(toggleTheme())}
                className={`settings-theme-btn ${isActive ? 'settings-theme-btn--active' : 'settings-theme-btn--inactive'}`}
              >
                <Icon size={20} style={{ color: isActive ? '#2563EB' : 'var(--color-surface-500)' }} />
                <span className={isActive ? 'settings-theme-label--active' : 'settings-theme-label--inactive'}>{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="settings-card-title">Density</h3>
        <p className="settings-card-subtitle">Adjust the spacing and size of elements</p>
        <div className="settings-theme-grid">
          {['Compact', 'Default', 'Comfortable'].map((d, i) => (
            <motion.button
              key={d}
              whileHover={{ scale: 1.02 }}
              className={`settings-theme-btn ${i === 1 ? 'settings-theme-btn--active' : 'settings-theme-btn--inactive'}`}
            >
              <span className={i === 1 ? 'settings-theme-label--active' : 'settings-theme-label--inactive'}>{d}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const { success } = useToast();
  const [settings, setSettings] = useState({
    emailNotifs: true, pushNotifs: true, mentions: true, assignments: true,
    statusChanges: false, weeklyDigest: true, dueDateReminders: true, teamActivity: false,
  });
  const toggle = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const sections = [
    {
      title: 'Delivery', items: [
        { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive notifications via email' },
        { key: 'pushNotifs',  label: 'Push Notifications',  desc: 'Browser and mobile push alerts' },
        { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary email every Monday morning' },
      ],
    },
    {
      title: 'Activity', items: [
        { key: 'mentions',       label: 'Mentions',         desc: 'When someone @mentions you' },
        { key: 'assignments',    label: 'Task Assignments',  desc: 'When a task is assigned to you' },
        { key: 'statusChanges',  label: 'Status Changes',    desc: 'When task status changes' },
        { key: 'dueDateReminders', label: 'Due Date Reminders', desc: 'Reminders 24 hours before due date' },
        { key: 'teamActivity',   label: 'Team Activity',     desc: 'All team member actions' },
      ],
    },
  ];

  return (
    <div className="settings-section-stack">
      {sections.map((section) => (
        <div key={section.title} className="card p-5">
          <h3 className="settings-card-title">{section.title}</h3>
          <div>
            {section.items.map((item) => (
              <SettingRow key={item.key} label={item.label} description={item.desc}>
                <ToggleSwitch checked={settings[item.key]} onChange={() => toggle(item.key)} />
              </SettingRow>
            ))}
          </div>
        </div>
      ))}
      <Button size="sm" onClick={() => success('Settings saved', 'Notification preferences updated.')}>Save Preferences</Button>
    </div>
  );
}

function SecuritySettings() {
  const { success } = useToast();
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="settings-section-stack">
      <div className="card p-5">
        <h3 className="settings-card-title">Two-Factor Authentication</h3>
        <p className="settings-card-subtitle">Add an extra layer of security to your account</p>
        <SettingRow label="Authenticator App" description="Use Google Authenticator or similar">
          <ToggleSwitch checked={twoFA} onChange={(v) => { setTwoFA(v); success(v ? '2FA Enabled' : '2FA Disabled', ''); }} />
        </SettingRow>
        <SettingRow label="SMS Authentication" description="Receive codes via text message">
          <ToggleSwitch checked={false} onChange={() => {}} />
        </SettingRow>
      </div>

      <div className="card p-5">
        <h3 className="settings-card-title">Login History</h3>
        <p className="settings-card-subtitle">Recent sign-in activity</p>
        {[
          { action: 'Signed in',    location: 'San Francisco, CA', time: '2 minutes ago', ok: true },
          { action: 'Signed in',    location: 'San Francisco, CA', time: '3 days ago',    ok: true },
          { action: 'Failed attempt', location: 'Unknown',         time: '1 week ago',    ok: false },
        ].map((item, i) => (
          <div key={i} className="settings-login-row">
            <div className={`settings-login-dot ${item.ok ? 'settings-login-dot--ok' : 'settings-login-dot--bad'}`} />
            <div className="settings-login-info">
              <p className="settings-login-action">{item.action}</p>
              <p className="settings-login-meta">{item.location} · {item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general',       label: 'General',       icon: <Globe size={14} /> },
    { id: 'appearance',    label: 'Appearance',    icon: <Palette size={14} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
    { id: 'security',      label: 'Security',      icon: <Shield size={14} /> },
  ];

  const panels = {
    general:       <GeneralSettings />,
    appearance:    <AppearanceSettings />,
    notifications: <NotificationSettings />,
    security:      <SecuritySettings />,
  };

  return (
    <PageTransition className="settings-page">
      <h1 className="settings-title">Settings</h1>
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="pill" className="mb-5" />
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {panels[activeTab]}
      </motion.div>
    </PageTransition>
  );
}
