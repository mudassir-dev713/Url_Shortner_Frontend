// In your root React component or theme context effect:
import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export function ThemeColorUpdater() {
  const { theme } = useTheme();

  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    if (metaThemeColor) {
      if (theme === 'dark') {
        metaThemeColor.setAttribute('content', '#101729'); // your dark color
      } else {
        metaThemeColor.setAttribute('content', '#ffffff'); // your light color
      }
    }
  }, [theme]);

  return null;
}
