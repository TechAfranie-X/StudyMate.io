import { motion } from 'framer-motion'

const Skeleton = ({ 
  className = '', 
  variant = 'rectangular', 
  width, 
  height,
  lines = 1,
  ...props 
}) => {
  const baseClasses = 'bg-gradient-to-r from-surface-alt via-surface to-surface-alt bg-[length:200%_100%] animate-shimmer rounded'
  
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
    title: 'rounded h-6',
    avatar: 'rounded-full'
  }
  
  const skeletonClasses = `${baseClasses} ${variants[variant]} ${className}`
  
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={skeletonClasses}
            style={{ 
              width: index === lines - 1 ? '60%' : '100%',
              height: height || '1rem'
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    )
  }
  
  return (
    <motion.div
      className={skeletonClasses}
      style={{ width, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    />
  )
}

export default Skeleton

















