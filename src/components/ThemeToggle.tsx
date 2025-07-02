
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="rounded-full border border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-pink-400" />
      ) : (
        <Moon className="h-5 w-5 text-pink-600" />
      )}
    </Button>
  );
};
