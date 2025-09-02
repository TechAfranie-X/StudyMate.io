import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'primary',
  gradient = 'default',
  delay = 0 
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.querySelector(`[data-stat="${title}"]`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [title])

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        animateCounter()
      }, delay * 100)

      return () => clearTimeout(timer)
    }
  }, [isVisible, value, delay])

  const animateCounter = () => {
    const duration = 1000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)
  }

  const getGradientClass = () => {
    switch (gradient) {
      case 'primary':
        return 'from-primary/10 to-primary/5'
      case 'accent':
        return 'from-accent/10 to-accent/5'
      case 'success':
        return 'from-green-500/10 to-green-400/5'
      case 'warning':
        return 'from-yellow-500/10 to-yellow-400/5'
      case 'error':
        return 'from-red-500/10 to-red-400/5'
      default:
        return 'from-primary/5 to-accent/5'
    }
  }

  const getIconColor = () => {
    switch (color) {
      case 'primary':
        return 'text-primary'
      case 'accent':
        return 'text-accent'
      case 'success':
        return 'text-green-500'
      case 'warning':
        return 'text-yellow-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-primary'
    }
  }

  return (
    <motion.div
      data-stat={title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="stat-card group"
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass()} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Icon */}
      {Icon && (
        <div className={`stat-icon ${getIconColor()}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          className="stat-number"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: (delay * 0.1) + 0.2 }}
        >
          {isVisible ? displayValue.toLocaleString() : '0'}
        </motion.div>
        
        <motion.div
          className="stat-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: (delay * 0.1) + 0.4 }}
        >
          {title}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-5">
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${getGradientClass()}`} />
      </div>
    </motion.div>
  )
}

export default StatCard

















