import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage for saved theme preference
    try {
      const saved = localStorage.getItem('studymate_theme');
      if (saved) {
        return saved === 'dark';
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }
    
    // Default to system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Fallback to light theme
    return false;
  });

  const [isSystemTheme, setIsSystemTheme] = useState(false);

  // Memoized theme value to prevent unnecessary re-renders
  const theme = useMemo(() => isDark ? 'dark' : 'light', [isDark]);

  // Apply theme to document with performance optimization
  const applyTheme = useCallback((darkMode) => {
    const root = document.documentElement;
    
    // Use requestAnimationFrame for smooth theme transitions
    requestAnimationFrame(() => {
      if (darkMode) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    });
  }, []);

  // Save theme preference to localStorage
  const saveTheme = useCallback((darkMode) => {
    try {
      localStorage.setItem('studymate_theme', darkMode ? 'dark' : 'light');
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, []);

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
    setIsSystemTheme(false);
  }, []);

  // Set specific theme
  const setTheme = useCallback((newTheme) => {
    const darkMode = newTheme === 'dark';
    setIsDark(darkMode);
    setIsSystemTheme(false);
  }, []);

  // Follow system theme
  const followSystemTheme = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(mediaQuery.matches);
      setIsSystemTheme(true);
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (isSystemTheme) {
        setIsDark(e.matches);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [isSystemTheme]);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(isDark);
    saveTheme(isDark);
  }, [isDark, applyTheme, saveTheme]);

  // Initialize theme on mount
  useEffect(() => {
    applyTheme(isDark);
  }, []); // Only run on mount

  // Context value with memoization
  const contextValue = useMemo(() => ({
    isDark,
    isSystemTheme,
    theme,
    toggleTheme,
    setTheme,
    followSystemTheme
  }), [isDark, isSystemTheme, theme, toggleTheme, setTheme, followSystemTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for getting theme-aware styles
export const useThemeStyles = (lightStyles, darkStyles) => {
  const { isDark } = useTheme();
  return useMemo(() => isDark ? darkStyles : lightStyles, [isDark, lightStyles, darkStyles]);
};

// Hook for conditional theme-based rendering
export const useThemeCondition = (lightComponent, darkComponent) => {
  const { isDark } = useTheme();
  return useMemo(() => isDark ? darkComponent : lightComponent, [isDark, lightComponent, darkComponent]);
};


