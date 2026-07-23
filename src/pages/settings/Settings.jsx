import { useState } from 'react';
import { motion } from 'motion/react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Settings as SettingsIcon, Globe, Bell, Shield, Building2, Palette,
  Moon, Sun, Monitor, ChevronRight
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import Tabs from '../../components/common/Tabs/Tabs';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input/Input';
import { toggleTheme } from '../../redux/uiSlice';
import { useToast } from '../../hooks/useToast';

function ToggleSwitch({ checked, onChange }) {
  return (
    <motion.button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors ${checked ? 'bg-primary-600' : 'bg-surface-300'}`}
      style={{ width: 40, height: 22 }}
    >
      <motion.div
        animate={{ x: checked ? 19 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </motion.button>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-surface-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-surface-800">{label}</p>
        {description && <p className="text-xs text-surface-400 mt-0.5">{description}</p>}
      </div>
      <div className="ml-4 shrink-0">{children}</div>
    </div>
  );
}

function GeneralSettings() {
  const { success } = useToast();
  return (
    <div className="space-y-5">
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-surface-900 mb-1">General Settings</h3>
        <p className="text-xs text-surface-400 mb-4">Configure your workspace preferences</p>
        <div>
          <SettingRow label="Language" description="Interface display language">
            <select className="input-base py-1.5 text-sm w-36">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </SettingRow>
          <SettingRow label="Date Format" description="How dates are displayed across the app">
            <select className="input-base py-1.5 text-sm w-40">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </SettingRow>
          <SettingRow label="Time Format" description="12-hour or 24-hour clock">
            <select className="input-base py-1.5 text-sm w-36">
              <option>12-hour</option>
              <option>24-hour</option>
            </select>
          </SettingRow>
          <SettingRow label="First Day of Week" description="Calendar week starts on">
            <select className="input-base py-1.5 text-sm w-36">
              <option>Sunday</option>
              <option>Monday</option>
            </select>
          </SettingRow>
        </div>
        <div className="pt-4">
          <Button size="sm" onClick={() => success('Settings saved', 'General settings updated.')}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const { success } = useToast();

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {themes.map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch(toggleTheme())}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                theme === id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-surface-200 hover:border-surface-300'
              }`}
            >
              <Icon size={20} className={theme === id ? 'text-primary-600' : 'text-surface-500'} />
              <span className={`text-xs font-medium ${theme === id ? 'text-primary-700' : 'text-surface-600'}`}>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-semibold text-surface-900 mb-1">Density</h3>
        <p className="text-xs text-surface-400 mb-4">Adjust the spacing and size of elements</p>
        <div className="grid grid-cols-3 gap-3">
          {['Compact', 'Default', 'Comfortable'].map((d, i) => (
            <motion.button
              key={d}
              whileHover={{ scale: 1.02 }}
              className={`py-3 rounded-xl border-2 text-xs font-medium transition-all ${
                i === 1 ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-surface-200 text-surface-600 hover:border-surface-300'
              }`}
            >
              {d}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifs: true,
    pushNotifs: true,
    mentions: true,
    assignments: true,
    statusChanges: false,
    weeklyDigest: true,
    dueDateReminders: true,
    teamActivity: false,
  });

  const { success } = useToast();
  const toggle = (key) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const sections = [
    {
      title: 'Delivery', items: [
        { key: 'emailNotifs', label: 'Email Notifications', desc: 'Receive notifications via email' },
        { key: 'pushNotifs', label: 'Push Notifications', desc: 'Browser and mobile push alerts' },
        { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary email every Monday morning' },
      ],
    },
    {
      title: 'Activity', items: [
        { key: 'mentions', label: 'Mentions', desc: 'When someone @mentions you' },
        { key: 'assignments', label: 'Task Assignments', desc: 'When a task is assigned to you' },
        { key: 'statusChanges', label: 'Status Changes', desc: 'When task status changes' },
        { key: 'dueDateReminders', label: 'Due Date Reminders', desc: 'Reminders 24 hours before due date' },
        { key: 'teamActivity', label: 'Team Activity', desc: 'All team member actions' },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div key={section.title} className="card p-5">
          <h3 className="text-sm font-semibold text-surface-900 mb-1">{section.title}</h3>
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
    <div className="space-y-5">
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-surface-900 mb-1">Two-Factor Authentication</h3>
        <p className="text-xs text-surface-400 mb-4">Add an extra layer of security to your account</p>
        <SettingRow label="Authenticator App" description="Use Google Authenticator or similar">
          <ToggleSwitch checked={twoFA} onChange={(v) => { setTwoFA(v); success(v ? '2FA Enabled' : '2FA Disabled', ''); }} />
        </SettingRow>
        <SettingRow label="SMS Authentication" description="Receive codes via text message">
          <ToggleSwitch checked={false} onChange={() => {}} />
        </SettingRow>
      </div>

      <div className="card p-5">
        <h3 className="text-sm font-semibold text-surface-900 mb-1">Login History</h3>
        <p className="text-xs text-surface-400 mb-4">Recent sign-in activity</p>
        {[
          { action: 'Signed in', location: 'San Francisco, CA', time: '2 minutes ago', ok: true },
          { action: 'Signed in', location: 'San Francisco, CA', time: '3 days ago', ok: true },
          { action: 'Failed attempt', location: 'Unknown', time: '1 week ago', ok: false },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-surface-100 last:border-0">
            <div className={`w-2 h-2 rounded-full shrink-0 ${item.ok ? 'bg-success-500' : 'bg-danger-500'}`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-surface-800">{item.action}</p>
              <p className="text-xs text-surface-400">{item.location} · {item.time}</p>
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
    { id: 'general', label: 'General', icon: <Globe size={14} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={14} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={14} /> },
    { id: 'security', label: 'Security', icon: <Shield size={14} /> },
  ];

  const panels = {
    general: <GeneralSettings />,
    appearance: <AppearanceSettings />,
    notifications: <NotificationSettings />,
    security: <SecuritySettings />,
  };

  return (
    <PageTransition className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Settings</h1>

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
