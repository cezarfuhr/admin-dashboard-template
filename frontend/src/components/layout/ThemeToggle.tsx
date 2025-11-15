'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { useEffect } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme on mount
    setTheme(theme);
  }, []);

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
