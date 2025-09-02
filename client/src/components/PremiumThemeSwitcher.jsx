import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAnimation } from '../contexts/AnimationContext'

const PremiumThemeSwitcher = () => {
  const { isDarkMode, toggleTheme } = useTheme()
  const { reducedMotion, getAnimationVariants } = useAnimation()
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredTheme, setHoveredTheme] = useState(null)
  const [showTooltip, setShowTooltip] = useState(false)

  const themes = [
    { id: 'light', icon: Sun, label: 'Light', color: '#fbbf24' },
    { id: 'dark', icon: Moon, label: 'Dark', color: '#7c3aed' },
    { id: 'system', icon: Monitor, label: 'System', color: '#10b981' }
  ]

  const currentTheme = isDarkMode ? 'dark' : 'light'

  const handleThemeChange = async (themeId) => {
    if (isAnimating) return

    setIsAnimating(true)
    
    if (themeId === 'system') {
      // System theme logic
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      if (systemTheme !== currentTheme) {
        toggleTheme()
      }
    } else if (themeId !== currentTheme) {
      toggleTheme()
    }

    // Reset animation state
    setTimeout(() => setIsAnimating(false), 300)
  }

  const containerVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  }

  const buttonVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    },
    hover: { 
      scale: 1.1,
      y: -2,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  }

  const iconVariants = {
    initial: { rotate: -180, scale: 0 },
    animate: { 
      rotate: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    hover: { 
      rotate: 360,
      scale: 1.2,
      transition: { duration: 0.3 }
    }
  }

  const rippleVariants = {
    initial: { scale: 0, opacity: 0.8 },
    animate: { 
      scale: 2, 
      opacity: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <div className="relative">
      <motion.div
        className="flex items-center space-x-2 p-2 bg-surface-elevated rounded-full border border-border shadow-lg backdrop-blur-sm"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        {themes.map((theme, index) => {
          const Icon = theme.icon
          const isActive = theme.id === currentTheme
          
          return (
            <motion.button
              key={theme.id}
              className={`relative p-3 rounded-full transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-transparent text-text-muted hover:text-text-primary hover:bg-surface'
              }`}
              variants={buttonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleThemeChange(theme.id)}
              onMouseEnter={() => setHoveredTheme(theme.id)}
              onMouseLeave={() => setHoveredTheme(null)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Ripple effect */}
              <AnimatePresence>
                {isAnimating && isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30"
                    variants={rippleVariants}
                    initial="initial"
                    animate="animate"
                    exit="initial"
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <motion.div
                variants={iconVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                style={{ color: isActive ? 'white' : theme.color }}
              >
                <Icon size={18} />
              </motion.div>

              {/* Active indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full"
                    initial={{ scale: 0, x: '-50%' }}
                    animate={{ scale: 1, x: '-50%' }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && hoveredTheme && (
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-surface-elevated text-text-primary text-sm rounded-lg shadow-lg border border-border backdrop-blur-sm z-50"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {themes.find(t => t.id === hoveredTheme)?.label}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-surface-elevated border-l border-t border-border rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating particles effect */}
      <AnimatePresence>
        {isAnimating && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full pointer-events-none"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  scale: [0, 1, 0],
                  opacity: [1, 0.8, 0]
                }}
                exit={{
                  scale: 0,
                  opacity: 0
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PremiumThemeSwitcher
















