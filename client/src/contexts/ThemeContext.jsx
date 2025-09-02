import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('studymate-theme')
    if (saved && ['light', 'dark', 'high-contrast'].includes(saved)) {
      return saved
    }
    
    // Check system preference
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      return mediaQuery.matches ? 'dark' : 'light'
    }
    
    return 'light'
  })

  const [isSystemTheme, setIsSystemTheme] = useState(() => {
    const saved = localStorage.getItem('studymate-theme')
    return !saved || saved === 'system'
  })

  // Update theme when system preference changes
  useEffect(() => {
    if (!isSystemTheme) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      if (isSystemTheme) {
        const newTheme = e.matches ? 'dark' : 'light'
        setTheme(newTheme)
        applyTheme(newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [isSystemTheme])

  // Apply theme to document
  const applyTheme = (newTheme) => {
    const html = document.documentElement
    
    // Remove all theme classes
    html.classList.remove('light', 'dark', 'high-contrast')
    
    // Add new theme class
    html.classList.add(newTheme)
    
    // Set data attribute for CSS custom properties
    html.setAttribute('data-theme', newTheme)
    
    // Store in localStorage
    localStorage.setItem('studymate-theme', newTheme)
    
    // Force immediate background color update to prevent flash
    document.body.style.backgroundColor = getComputedStyle(html).getPropertyValue('--color-background')
    document.body.style.color = getComputedStyle(html).getPropertyValue('--color-text-primary')
  }

  // Apply theme when theme state changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setLightTheme = () => {
    setTheme('light')
    setIsSystemTheme(false)
  }

  const setDarkTheme = () => {
    setTheme('dark')
    setIsSystemTheme(false)
  }

  const setHighContrastTheme = () => {
    setTheme('high-contrast')
    setIsSystemTheme(false)
  }

  const followSystemTheme = () => {
    setIsSystemTheme(true)
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    setTheme(systemTheme)
    localStorage.removeItem('studymate-theme')
  }

  const toggleTheme = () => {
    if (theme === 'light') {
      setDarkTheme()
    } else if (theme === 'dark') {
      setHighContrastTheme()
    } else {
      setLightTheme()
    }
  }

  const value = {
    theme,
    isDarkMode: theme === 'dark',
    isLightMode: theme === 'light',
    isHighContrast: theme === 'high-contrast',
    isSystemTheme,
    setLightTheme,
    setDarkTheme,
    setHighContrastTheme,
    followSystemTheme,
    toggleTheme,
    setTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
