// Minimal theme context replacing next-themes.
// Applies the theme as a CSS class on <html>, matching the previous next-themes setup
// (attribute="class", defaultTheme="velo", themes=["velo","light"]).

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'velo' | 'light'

const STORAGE_KEY = 'theme'
const DEFAULT_THEME: Theme = 'velo'
const THEMES: Theme[] = ['velo', 'light']

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
})

function resolveTheme(stored: string | null): Theme {
  if (stored && THEMES.includes(stored as Theme)) return stored as Theme
  return DEFAULT_THEME
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() =>
    resolveTheme(
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    )
  )

  // Apply class to <html> whenever theme changes (client-only)
  useEffect(() => {
    const root = document.documentElement
    THEMES.forEach((t) => root.classList.remove(t))
    root.classList.add(theme)
  }, [theme])

  function setTheme(next: Theme) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, next)
    }
    setThemeState(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
