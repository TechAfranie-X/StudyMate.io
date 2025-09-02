import { createContext, useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const AnimationContext = createContext()

export const useAnimation = () => {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider')
  }
  return context
}

export const AnimationProvider = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [animationQuality, setAnimationQuality] = useState('high')

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleReducedMotionChange = (e) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleReducedMotionChange)

    // Check for high contrast preference
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    setIsHighContrast(contrastQuery.matches)

    const handleContrastChange = (e) => {
      setIsHighContrast(e.matches)
    }

    contrastQuery.addEventListener('change', handleContrastChange)

    // Detect device performance for animation quality
    const detectPerformance = () => {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
      const isLowEnd = navigator.hardwareConcurrency <= 4 || 
                      (connection && connection.effectiveType === 'slow-2g')
      
      setAnimationQuality(isLowEnd ? 'low' : 'high')
    }

    detectPerformance()

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange)
      contrastQuery.removeEventListener('change', handleContrastChange)
    }
  }, [])

  // Animation variants based on preferences
  const getAnimationVariants = (type = 'default') => {
    if (reducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      }
    }

    const variants = {
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      },
      slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      },
      slideIn: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
      },
      scale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
      },
      stagger: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      }
    }

    return variants[type] || variants.fadeIn
  }

  // Stagger animation for lists
  const getStaggerConfig = (delay = 0.05) => {
    if (reducedMotion) {
      return { delayChildren: 0, staggerChildren: 0 }
    }
    
    return {
      delayChildren: delay,
      staggerChildren: animationQuality === 'high' ? 0.05 : 0.1
    }
  }

  // Page transition variants
  const pageVariants = {
    initial: reducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: reducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: reducedMotion ? 0.1 : 0.3
  }

  const value = {
    reducedMotion,
    isHighContrast,
    animationQuality,
    getAnimationVariants,
    getStaggerConfig,
    pageVariants,
    pageTransition
  }

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  )
}

// HOC for animated components
export const withAnimation = (Component, animationType = 'default') => {
  return (props) => {
    const { getAnimationVariants } = useAnimation()
    const variants = getAnimationVariants(animationType)

    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
      >
        <Component {...props} />
      </motion.div>
    )
  }
}
















