import React, { useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { $theme, setTheme, allThemes, themeLabels, type Theme } from '@/stores/theme';

const themeColors: Record<Theme, string> = {
  velo: 'hsl(218 100% 55%)',
  light: 'hsl(213 65% 32%)',
  editorial: 'hsl(28 80% 44%)',
  forest: 'hsl(153 55% 18%)',
  copper: 'hsl(28 55% 46%)',
};

const ThemePicker: React.FC = () => {
  const current = useStore($theme);

  const handleClick = useCallback((theme: Theme) => {
    setTheme(theme);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {allThemes.map((theme) => (
        <button
          key={theme}
          onClick={() => handleClick(theme)}
          aria-label={`Switch to ${themeLabels[theme]} theme`}
          className="relative h-6 w-6 rounded-full transition-transform hover:scale-110"
          style={{
            backgroundColor: themeColors[theme],
            outline: current === theme ? `2px solid ${themeColors[theme]}` : 'none',
            outlineOffset: current === theme ? '3px' : '0',
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(ThemePicker);
