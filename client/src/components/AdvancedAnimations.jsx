import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Advanced page transition variants
export const pageTransitions = {
  initial: { 
    opacity: 0, 
    y: 20, 
    scale: 0.98,
    filter: 'blur(4px)'
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    scale: 0.98,
    filter: 'blur(4px)',
    transition: {
      duration: 0.4,
      ease: [0.55, 0.055, 0.675, 0.19]
    }
  }
};

// Staggered container animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  show: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Physics-based animations
export const bounceSpring = {
  initial: { scale: 0.8, y: 20 },
  animate: { 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15,
      mass: 0.8
    }
  },
  hover: { 
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 20
    }
  }
};

// Parallax scrolling component
export const ParallaxElement = ({ children, speed = 0.5, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Morphing button component
export const MorphingButton = ({ 
  children, 
  onClick, 
  className = "", 
  variant = "primary",
  size = "md" 
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const buttonVariants = {
    initial: { 
      scale: 1,
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    },
    hover: { 
      scale: 1.02,
      borderRadius: "16px",
      boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    },
    pressed: { 
      scale: 0.98,
      borderRadius: "8px",
      boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 20
      }
    }
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    accent: "bg-purple-600 hover:bg-purple-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };

  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="pressed"
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
      className={`${sizeClasses[size]} ${variantClasses[variant]} font-medium rounded-xl transition-colors duration-200 ${className}`}
    >
      {children}
    </motion.button>
  );
};

// Floating action button with physics
export const FloatingActionButton = ({ children, onClick, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const springConfig = {
    type: "spring",
    stiffness: 400,
    damping: 25,
    mass: 0.8
  };

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 ${className}`}
      whileHover={{ 
        scale: 1.1,
        rotate: 5,
        transition: springConfig
      }}
      whileTap={{ 
        scale: 0.9,
        rotate: -5,
        transition: springConfig
      }}
      animate={{
        y: isHovered ? -5 : 0,
        transition: springConfig
      }}
    >
      {children}
    </motion.button>
  );
};

// Animated progress ring
export const AnimatedProgressRing = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = "#3B82F6",
  className = "" 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: 1.5,
            ease: "easeInOut"
          }}
          strokeLinecap="round"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-800 dark:text-white">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

// Animated counter
export const AnimatedCounter = ({ value, duration = 2, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const currentValue = Math.floor(value * progress);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(value);
      }
    };

    updateCounter();
  }, [value, duration]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      {displayValue}
    </motion.span>
  );
};

// Animated loading skeleton
export const AnimatedSkeleton = ({ className = "", lines = 1 }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
          initial={{ opacity: 0.3 }}
          animate={{ 
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Hover card with 3D effect
export const HoverCard = ({ children, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        rotateY: 5,
        rotateX: 5,
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {children}
      {/* Subtle shadow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

export default {
  pageTransitions,
  staggerContainer,
  staggerItem,
  bounceSpring,
  ParallaxElement,
  MorphingButton,
  FloatingActionButton,
  AnimatedProgressRing,
  AnimatedCounter,
  AnimatedSkeleton,
  HoverCard
};

