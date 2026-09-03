import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppRouter from './routes/AppRouter';

export default function App() {
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    const applyTheme = () => {
      let isDark = false;
      if (theme === 'dark') {
        isDark = true;
      } else if (theme === 'system') {
        isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = false;
      }

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    if (theme === 'system' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return <AppRouter />;
}
