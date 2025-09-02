import React from 'react'
import { motion } from 'framer-motion'
import { useAnimation } from '../contexts/AnimationContext'

const PremiumLoading = ({ type = 'default', message = 'Loading...' }) => {
  const { reducedMotion } = useAnimation()

  const shimmerVariants = {
    animate: {
      x: ['-100%', '100%'],
      transition: {
        duration: reducedMotion ? 0.5 : 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const pulseVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: reducedMotion ? 0.5 : 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const renderSkeletonCard = () => (
    <div className="bg-surface rounded-card border border-border p-6 space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center space-x-3">
        <motion.div
          className="w-10 h-10 bg-surface-elevated rounded-full overflow-hidden relative"
          variants={pulseVariants}
          animate="animate"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmerVariants}
            animate="animate"
          />
        </motion.div>
        <div className="space-y-2 flex-1">
          <motion.div
            className="h-4 bg-surface-elevated rounded overflow-hidden relative"
            style={{ width: '60%' }}
            variants={pulseVariants}
            animate="animate"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              animate="animate"
            />
          </motion.div>
          <motion.div
            className="h-3 bg-surface-elevated rounded overflow-hidden relative"
            style={{ width: '40%' }}
            variants={pulseVariants}
            animate="animate"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              animate="animate"
            />
          </motion.div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-3">
        <motion.div
          className="h-4 bg-surface-elevated rounded overflow-hidden relative"
          variants={pulseVariants}
          animate="animate"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmerVariants}
            animate="animate"
          />
        </motion.div>
        <motion.div
          className="h-4 bg-surface-elevated rounded overflow-hidden relative"
          style={{ width: '80%' }}
          variants={pulseVariants}
          animate="animate"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmerVariants}
            animate="animate"
          />
        </motion.div>
        <motion.div
          className="h-4 bg-surface-elevated rounded overflow-hidden relative"
          style={{ width: '60%' }}
          variants={pulseVariants}
          animate="animate"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmerVariants}
            animate="animate"
          />
        </motion.div>
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex space-x-2">
          <motion.div
            className="w-16 h-6 bg-surface-elevated rounded-full overflow-hidden relative"
            variants={pulseVariants}
            animate="animate"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              animate="animate"
            />
          </motion.div>
          <motion.div
            className="w-20 h-6 bg-surface-elevated rounded-full overflow-hidden relative"
            variants={pulseVariants}
            animate="animate"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              variants={shimmerVariants}
              animate="animate"
            />
          </motion.div>
        </div>
        <motion.div
          className="w-12 h-4 bg-surface-elevated rounded overflow-hidden relative"
          variants={pulseVariants}
          animate="animate"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmerVariants}
            animate="animate"
          />
        </motion.div>
      </div>
    </div>
  )

  const renderSkeletonList = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="bg-surface rounded-card border border-border p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reducedMotion ? 0.1 : 0.3,
            delay: index * 0.1
          }}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-8 h-8 bg-surface-elevated rounded-full overflow-hidden relative"
              variants={pulseVariants}
              animate="animate"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                variants={shimmerVariants}
                animate="animate"
              />
            </motion.div>
            <div className="flex-1 space-y-2">
              <motion.div
                className="h-4 bg-surface-elevated rounded overflow-hidden relative"
                style={{ width: `${70 + Math.random() * 30}%` }}
                variants={pulseVariants}
                animate="animate"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  variants={shimmerVariants}
                  animate="animate"
                />
              </motion.div>
              <motion.div
                className="h-3 bg-surface-elevated rounded overflow-hidden relative"
                style={{ width: `${40 + Math.random() * 40}%` }}
                variants={pulseVariants}
                animate="animate"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  variants={shimmerVariants}
                  animate="animate"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderSkeletonGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: reducedMotion ? 0.1 : 0.3,
            delay: index * 0.1
          }}
        >
          {renderSkeletonCard()}
        </motion.div>
      ))}
    </div>
  )

  const renderSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{
          duration: reducedMotion ? 0.5 : 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute inset-0 border-4 border-surface-elevated rounded-full" />
        <motion.div
          className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: reducedMotion ? 0.5 : 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
      
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-text-primary font-medium">{message}</p>
        <div className="flex items-center justify-center space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: reducedMotion ? 0.3 : 0.6,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )

  const renderProgressBar = () => (
    <div className="w-full max-w-md mx-auto space-y-4">
      <motion.div
        className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{
            duration: reducedMotion ? 0.5 : 2,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: reducedMotion ? 0.5 : 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      </motion.div>
      
      <motion.p
        className="text-center text-text-secondary text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {message}
      </motion.p>
    </div>
  )

  const renderContent = () => {
    switch (type) {
      case 'card':
        return renderSkeletonCard()
      case 'list':
        return renderSkeletonList()
      case 'grid':
        return renderSkeletonGrid()
      case 'spinner':
        return renderSpinner()
      case 'progress':
        return renderProgressBar()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[200px] p-8">
      {renderContent()}
    </div>
  )
}

export default PremiumLoading
















