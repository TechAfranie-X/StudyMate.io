import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  change, 
  changeType = 'neutral',
  progress,
  maxValue,
  className = '',
  variant = 'default'
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef(null)

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Animated counter effect
  useEffect(() => {
    if (isVisible && typeof value === 'number') {
      const duration = 1000 // 1 second
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

      return () => clearInterval(timer)
    }
  }, [isVisible, value])

  // Get variant-specific classes
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'stats-card stats-card-primary'
      case 'accent':
        return 'stats-card stats-card-accent'
      case 'success':
        return 'stats-card stats-card-success'
      case 'warning':
        return 'stats-card stats-card-warning'
      default:
        return 'stats-card'
    }
  }

  // Get change indicator styling
  const getChangeStyles = () => {
    if (!change) return {}
    
    switch (changeType) {
      case 'positive':
        return {
          color: 'var(--color-success)',
          icon: '↗'
        }
      case 'negative':
        return {
          color: 'var(--color-error)',
          icon: '↘'
        }
      default:
        return {
          color: 'var(--color-text-secondary)',
          icon: '→'
        }
    }
  }

  const changeStyles = getChangeStyles()

  return (
    <motion.div
      ref={cardRef}
      className={`${getVariantClasses()} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-20 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                {title}
              </h3>
            </div>
          </div>
          
          {change && (
            <div 
              className="flex items-center space-x-1 text-sm font-medium"
              style={{ color: changeStyles.color }}
            >
              <span>{changeStyles.icon}</span>
              <span>{change}</span>
            </div>
          )}
        </div>

        {/* Main Value */}
        <div className="mb-2">
          <div className="text-3xl font-bold text-text-primary animate-count-up">
            {typeof value === 'number' ? displayValue.toLocaleString() : value}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-text-secondary mb-4">
            {description}
          </p>
        )}

        {/* Progress Bar */}
        {progress !== undefined && maxValue && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-text-secondary">
              <span>Progress</span>
              <span>{Math.round((progress / maxValue) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={isVisible ? { width: `${(progress / maxValue) * 100}%` } : { width: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary-5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  )
}

export default StatsCard


