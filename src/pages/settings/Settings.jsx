import { useState } from 'react';
import { motion } from 'motion/react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Globe, Bell, Shield, Palette,
  Moon, Sun, Monitor, ChevronDown, Check,
  Smartphone, Laptop, ShieldCheck, KeyRound
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Tabs from '../../components/common/Tabs/Tabs';
import Button from '../../components/common/Button';
import { toggleTheme } from '../../redux/uiSlice';
import { useToast } from '../../hooks/useToast';
import './Settings.css';

function ToggleSwitch({ checked, onChange }) {
  return (
    <motion.button
      type="button"
      onClick={() => onChange(!checked)}
      className={`toggle-switch ${checked ? 'toggle-switch--on' : 'toggle-switch--off'}`}
      aria-checked={checked}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="toggle-knob"
      />
    </motion.button>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="setting-row">
      <div className="setting-row-text">
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
      <div className="settings-card">
        <div className="settings-card-header">
          <h3 className="settings-card-title">General Preferences</h3>
          <p className="settings-card-subtitle">Configure workspace language, timezones, and display formats</p>
        </div>

        <div className="settings-rows-group">
          <SettingRow label="Interface Language" description="Select the language displayed across SprintFlow">
            <div className="settings-select-wrapper">
              <select className="settings-select" defaultValue="English (US)">
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish (Español)</option>
                <option>French (Français)</option>
                <option>German (Deutsch)</option>
              </select>
              <ChevronDown size={15} className="settings-select-arrow" />
            </div>
          </SettingRow>

          <SettingRow label="Date Format" description="How calendar and task dates are displayed">
            <div className="settings-select-wrapper">
              <select className="settings-select" defaultValue="MM/DD/YYYY">
                <option>MM/DD/YYYY (12/31/2026)</option>
                <option>DD/MM/YYYY (31/12/2026)</option>
                <option>YYYY-MM-DD (2026-12-31)</option>
              </select>
              <ChevronDown size={15} className="settings-select-arrow" />
            </div>
          </SettingRow>

          <SettingRow label="Time Format" description="Choose 12-hour AM/PM or 24-hour clock">
            <div className="settings-select-wrapper">
              <select className="settings-select" defaultValue="12-hour">
                <option>12-hour (02:30 PM)</option>
                <option>24-hour (14:30)</option>
              </select>
              <ChevronDown size={15} className="settings-select-arrow" />
            </div>
          </SettingRow>

          <SettingRow label="First Day of Week" description="Determines which day starts calendar views">
            <div className="settings-select-wrapper">
              <select className="settings-select" defaultValue="Sunday">
                <option>Sunday</option>
                <option>Monday</option>
              </select>
              <ChevronDown size={15} className="settings-select-arrow" />
            </div>
          </SettingRow>
        </div>

        <div className="settings-save-footer">
          <Button size="sm" onClick={() => success('Settings saved', 'General preferences updated.')}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const [density, setDensity] = useState('Default');

  const themes = [
    { id: 'light', label: 'Light', desc: 'Clean, high-contrast light theme', type: 'light', icon: Sun },
    { id: 'dark',  label: 'Dark',  desc: 'Dark mode for low light', type: 'dark', icon: Moon },
    { id: 'system', label: 'System', desc: 'Syncs with device settings', type: 'system', icon: Monitor },
  ];

  return (
    <div className="settings-section-stack">
      <div className="settings-card">
        <div className="settings-card-header">
          <h3 className="settings-card-title">Color Mode</h3>
          <p className="settings-card-subtitle">Choose your preferred visual theme for the workspace</p>
        </div>

        <div className="settings-theme-preview-grid">
          {themes.map(({ id, label, desc, type, icon: Icon }) => {
            const isActive = theme === id;
            return (
              <motion.button
                key={id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => dispatch(toggleTheme())}
                className={`theme-preview-card ${isActive ? 'theme-preview-card--active' : ''}`}
              >
                <div className={`theme-mockup-frame mockup-${type}`}>
                  <div className="mockup-sidebar" />
                  <div className="mockup-main">
                    <div className="mockup-header" />
                    <div className="mockup-content">
                      <div className="mockup-bar" />
                      <div className="mockup-bar short" />
                    </div>
                  </div>
                </div>

                <div className="theme-preview-footer">
                  <div className="theme-preview-title">
                    <Icon size={15} />
                    <span>{label}</span>
                  </div>
                  {isActive && <Check size={14} className="theme-active-check" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <h3 className="settings-card-title">Layout Density</h3>
          <p className="settings-card-subtitle">Adjust spacing and height of lists and board items</p>
        </div>

        <div className="density-picker-grid">
          {['Compact', 'Default', 'Comfortable'].map((d) => {
            const isActive = density === d;
            return (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={`density-option-btn ${isActive ? 'density-option-btn--active' : ''}`}
              >
                <span className="density-label">{d}</span>
              </button>
            );
          })}
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
      title: 'Delivery Channels',
      desc: 'Choose how and where notifications are delivered',
      items: [
        { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive real-time alerts via email' },
        { key: 'pushNotifs',  label: 'Desktop & Mobile Push', desc: 'Browser push notifications when active' },
        { key: 'weeklyDigest', label: 'Weekly Summary Digest', desc: 'Comprehensive email digest sent every Monday' },
      ],
    },
    {
      title: 'Activity Alerts',
      desc: 'Select actions that trigger notifications',
      items: [
        { key: 'mentions',       label: 'Direct Mentions',       desc: 'When someone @mentions you in a comment' },
        { key: 'assignments',    label: 'Task Assignments',      desc: 'When a sprint issue is assigned to you' },
        { key: 'statusChanges',  label: 'Task Status Updates',   desc: 'When an issue moves across board columns' },
        { key: 'dueDateReminders', label: 'Due Date Reminders',   desc: 'Alert 24 hours before issue deadline' },
        { key: 'teamActivity',   label: 'Team Activity Stream',  desc: 'All project changes made by team members' },
      ],
    },
  ];

  return (
    <div className="settings-section-stack">
      {sections.map((section) => (
        <div key={section.title} className="settings-card">
          <div className="settings-card-header">
            <h3 className="settings-card-title">{section.title}</h3>
            <p className="settings-card-subtitle">{section.desc}</p>
          </div>

          <div className="settings-rows-group">
            {section.items.map((item) => (
              <SettingRow key={item.key} label={item.label} description={item.desc}>
                <ToggleSwitch checked={settings[item.key]} onChange={() => toggle(item.key)} />
              </SettingRow>
            ))}
          </div>
        </div>
      ))}

      <div className="settings-save-footer">
        <Button size="sm" onClick={() => success('Preferences saved', 'Notification settings updated.')}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const { success } = useToast();
  const [twoFA, setTwoFA] = useState(false);

  const loginHistory = [
    { action: 'Current Session (Web)', location: 'San Francisco, CA · 192.168.1.42', time: 'Active now', device: Laptop, ok: true },
    { action: 'Mobile App Sign-in',   location: 'San Jose, CA · 10.0.0.12',         time: '3 days ago',  device: Smartphone, ok: true },
    { action: 'Password Verification', location: 'Unknown Location · 172.16.0.1',    time: '1 week ago',  device: ShieldCheck, ok: false },
  ];

  return (
    <div className="settings-section-stack">
      <div className="settings-card">
        <div className="settings-card-header">
          <h3 className="settings-card-title">Two-Factor Authentication (2FA)</h3>
          <p className="settings-card-subtitle">Protect your account with an extra verification layer</p>
        </div>

        <div className="settings-rows-group">
          <SettingRow label="Authenticator App (TOTP)" description="Use Google Authenticator, 1Password, or Authy">
            <ToggleSwitch
              checked={twoFA}
              onChange={(v) => { setTwoFA(v); success(v ? '2FA Protection Enabled' : '2FA Protection Disabled', ''); }}
            />
          </SettingRow>

          <SettingRow label="SMS Security Codes" description="Receive single-use codes via SMS phone text">
            <ToggleSwitch checked={false} onChange={() => {}} />
          </SettingRow>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <h3 className="settings-card-title">Active Devices & Sign-in History</h3>
          <p className="settings-card-subtitle">Recent login sessions and security activity log</p>
        </div>

        <div className="settings-rows-group">
          {loginHistory.map((item, i) => {
            const DeviceIcon = item.device;
            return (
              <div key={i} className="login-history-item">
                <div className={`login-icon-box ${item.ok ? 'login-icon--ok' : 'login-icon--bad'}`}>
                  <DeviceIcon size={18} />
                </div>
                <div className="login-item-details">
                  <div className="login-item-top">
                    <span className="login-item-action">{item.action}</span>
                    <span className={`login-status-badge ${item.ok ? 'badge--ok' : 'badge--bad'}`}>
                      {item.time}
                    </span>
                  </div>
                  <span className="login-item-meta">{item.location}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general',       label: 'General',       icon: <Globe size={15} /> },
    { id: 'appearance',    label: 'Appearance',    icon: <Palette size={15} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
    { id: 'security',      label: 'Security',      icon: <Shield size={15} /> },
  ];

  const panels = {
    general:       <GeneralSettings />,
    appearance:    <AppearanceSettings />,
    notifications: <NotificationSettings />,
    security:      <SecuritySettings />,
  };

  return (
    <PageTransition className="settings-page">
      <div className="settings-page-container">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage workspace defaults, themes, notifications, and security</p>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="pill" className="settings-tabs-bar" />

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="settings-tab-panel"
        >
          {panels[activeTab]}
        </motion.div>
      </div>
    </PageTransition>
  );
}

