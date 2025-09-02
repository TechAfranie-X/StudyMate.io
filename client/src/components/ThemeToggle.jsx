import React, { useState } from 'react'
import { Sun, Moon, Monitor, Eye } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = ({ className = '', size = 'default' }) => {
  const { 
    theme, 
    isSystemTheme, 
    setLightTheme, 
    setDarkTheme, 
    setHighContrastTheme, 
    followSystemTheme 
  } = useTheme()
  
  const [isAnimating, setIsAnimating] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const themes = [
    {
      id: 'light',
      name: 'Light',
      icon: Sun,
      color: '#fbbf24',
      description: 'Clean, bright interface'
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: Moon,
      color: '#7c3aed',
      description: 'Easy on the eyes'
    },
    {
      id: 'high-contrast',
      name: 'High Contrast',
      icon: Eye,
      color: '#ffffff',
      description: 'Maximum accessibility'
    },
    {
      id: 'system',
      name: 'System',
      icon: Monitor,
      color: '#10b981',
      description: 'Follows your OS preference'
    }
  ]

  const handleThemeChange = async (themeId) => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setShowMenu(false)
    
    switch (themeId) {
      case 'light':
        setLightTheme()
        break
      case 'dark':
        setDarkTheme()
        break
      case 'high-contrast':
        setHighContrastTheme()
        break
      case 'system':
        followSystemTheme()
        break
      default:
        break
    }
    
    // Reset animation state
    setTimeout(() => setIsAnimating(false), 300)
  }

  const getCurrentThemeIcon = () => {
    if (isSystemTheme) return Monitor
    switch (theme) {
      case 'light': return Sun
      case 'dark': return Moon
      case 'high-contrast': return Eye
      default: return Sun
    }
  }

  const getCurrentThemeColor = () => {
    if (isSystemTheme) return themes[3].color
    const currentTheme = themes.find(t => t.id === theme)
    return currentTheme ? currentTheme.color : themes[0].color
  }

  const IconComponent = getCurrentThemeIcon()
  const iconColor = getCurrentThemeColor()

  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-10 h-10',
    large: 'w-12 h-12'
  }

  const iconSizes = {
    small: 16,
    default: 20,
    large: 24
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Toggle Button */}
      <button
        className={`
          ${sizeClasses[size]} 
          relative flex items-center justify-center 
          bg-surface border border-border rounded-full
          shadow-sm hover:shadow-md
          transition-all duration-300 ease-out
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${isAnimating ? 'scale-95' : 'scale-100'}
          ${showMenu ? 'ring-2 ring-primary ring-offset-2' : ''}
        `}
        onClick={() => setShowMenu(!showMenu)}
        onBlur={() => setTimeout(() => setShowMenu(false), 150)}
        aria-label="Toggle theme"
        aria-expanded={showMenu}
        aria-haspopup="true"
      >
        {/* Animated Icon */}
        <div className="relative">
          <IconComponent 
            size={iconSizes[size]} 
            className="transition-all duration-300"
            style={{ color: iconColor }}
          />
          
          {/* Morphing Animation */}
          {isAnimating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-primary rounded-full animate-ping opacity-75" />
            </div>
          )}
        </div>

        {/* Active Indicator */}
        <div className={`
          absolute -bottom-1 left-1/2 w-1 h-1 
          bg-primary rounded-full
          transition-all duration-300
          ${isAnimating ? 'scale-150' : 'scale-100'}
        `} />
      </button>

      {/* Theme Menu */}
      {showMenu && (
        <div className="
          absolute top-full right-0 mt-2 w-64 
          bg-surface border border-border rounded-xl
          shadow-xl backdrop-blur-sm z-50
          animate-scale-in origin-top-right
        ">
          <div className="p-2">
            {themes.map((themeOption) => {
              const ThemeIcon = themeOption.icon
              const isActive = (isSystemTheme && themeOption.id === 'system') || 
                              (!isSystemTheme && themeOption.id === theme)
              
              return (
                <button
                  key={themeOption.id}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5
                    rounded-lg text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                    }
                  `}
                  onClick={() => handleThemeChange(themeOption.id)}
                >
                  <div className={`
                    w-8 h-8 flex items-center justify-center rounded-lg
                    ${isActive ? 'bg-white/20' : 'bg-surface-elevated'}
                  `}>
                    <ThemeIcon 
                      size={16} 
                      style={{ color: isActive ? 'white' : themeOption.color }} 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`
                      font-medium text-sm
                      ${isActive ? 'text-white' : 'text-text-primary'}
                    `}>
                      {themeOption.name}
                    </div>
                    <div className={`
                      text-xs truncate
                      ${isActive ? 'text-white/80' : 'text-text-secondary'}
                    `}>
                      {themeOption.description}
                    </div>
                  </div>

                  {/* Active Checkmark */}
                  {isActive && (
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Backdrop for menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
}

export default ThemeToggle
