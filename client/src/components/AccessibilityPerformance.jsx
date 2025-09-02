import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Wifi, 
  WifiOff, 
  Download, 
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
  Zap,
  Shield
} from 'lucide-react';

// High Contrast Mode Toggle
export const HighContrastToggle = ({ className = "" }) => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('highContrast');
    if (saved) {
      setIsHighContrast(JSON.parse(saved));
    }
  }, []);

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('highContrast', JSON.stringify(newValue));
    
    // Apply high contrast styles
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  return (
    <motion.button
      onClick={toggleHighContrast}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isHighContrast 
          ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
          : 'bg-gray-600 hover:bg-gray-700 text-white'
      } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
    >
      {isHighContrast ? <EyeOff size={20} /> : <Eye size={20} />}
      <span>High Contrast</span>
    </motion.button>
  );
};

// Reduced Motion Support
export const ReducedMotionProvider = ({ children }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply reduced motion styles globally
  useEffect(() => {
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--motion-duration', '0.01s');
      document.documentElement.style.setProperty('--motion-ease', 'linear');
    } else {
      document.documentElement.style.removeProperty('--motion-duration');
      document.documentElement.style.removeProperty('--motion-ease');
    }
  }, [prefersReducedMotion]);

  return (
    <div className={prefersReducedMotion ? 'reduced-motion' : ''}>
      {children}
    </div>
  );
};

// Optimized Loading Skeleton
export const OptimizedSkeleton = ({ 
  type = "text", 
  lines = 1, 
  className = "" 
}) => {
  const skeletonVariants = {
    initial: { opacity: 0.3 },
    animate: { 
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderSkeleton = () => {
    switch (type) {
      case "text":
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
              <motion.div
                key={index}
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                style={{ width: `${Math.random() * 40 + 60}%` }}
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              />
            ))}
          </div>
        );
      
      case "card":
        return (
          <motion.div
            className={`bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
          >
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          </motion.div>
        );
      
      case "avatar":
        return (
          <motion.div
            className={`w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full ${className}`}
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
          />
        );
      
      default:
        return null;
    }
  };

  return renderSkeleton();
};

// Offline Mode Indicator
export const OfflineIndicator = ({ className = "" }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = async () => {
    if (!isOnline) return;
    
    setSyncStatus('syncing');
    try {
      // Simulate sync operation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Download size={16} className="animate-spin" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return isOnline ? <Wifi size={16} /> : <WifiOff size={16} />;
    }
  };

  const getStatusText = () => {
    if (syncStatus === 'syncing') return 'Syncing...';
    if (syncStatus === 'success') return 'Synced!';
    if (syncStatus === 'error') return 'Sync failed';
    return isOnline ? 'Online' : 'Offline';
  };

  const getStatusColor = () => {
    if (syncStatus === 'syncing') return 'text-blue-600';
    if (syncStatus === 'success') return 'text-green-600';
    if (syncStatus === 'error') return 'text-red-600';
    return isOnline ? 'text-green-600' : 'text-red-600';
  };

  return (
    <motion.div
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${
        isOnline 
          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
      } ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      
      {isOnline && syncStatus === 'idle' && (
        <motion.button
          onClick={handleSync}
          className="ml-2 p-1 text-blue-600 hover:text-blue-700 rounded transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Sync data"
        >
          <Upload size={14} />
        </motion.button>
      )}
    </motion.div>
  );
};

// Performance Monitor
export const PerformanceMonitor = ({ className = "" }) => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    loadTime: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const measurePerformance = () => {
      frameCount.current++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current));
        frameCount.current = 0;
        lastTime.current = currentTime;
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memory: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 0
        }));
      }
      
      requestAnimationFrame(measurePerformance);
    };

    const animationId = requestAnimationFrame(measurePerformance);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const measureLoadTime = () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      setMetrics(prev => ({ ...prev, loadTime: Math.round(loadTime) }));
    };

    if (document.readyState === 'complete') {
      measureLoadTime();
    } else {
      window.addEventListener('load', measureLoadTime);
      return () => window.removeEventListener('load', measureLoadTime);
    }
  }, []);

  return (
    <motion.div
      className={`fixed top-4 right-4 z-50 ${className}`}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 100 }}
      onHoverStart={() => setIsVisible(true)}
      onHoverEnd={() => setIsVisible(false)}
    >
      <div className="bg-black/80 text-white rounded-lg p-3 text-xs font-mono">
        <div className="space-y-1">
          <div>FPS: {metrics.fps}</div>
          <div>Memory: {metrics.memory}MB</div>
          <div>Load: {metrics.loadTime}ms</div>
        </div>
      </div>
    </motion.div>
  );
};

// Accessibility Focus Ring
export const FocusRing = ({ children, className = "" }) => {
  return (
    <div className={`focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900 ${className}`}>
      {children}
    </div>
  );
};

// Screen Reader Only Text
export const ScreenReaderOnly = ({ children, className = "" }) => {
  return (
    <span className={`sr-only ${className}`}>
      {children}
    </span>
  );
};

// Keyboard Navigation Helper
export const KeyboardNavigation = ({ children, onKeyDown, className = "" }) => {
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onKeyDown?.('activate', e);
        break;
      case 'ArrowUp':
        e.preventDefault();
        onKeyDown?.('up', e);
        break;
      case 'ArrowDown':
        e.preventDefault();
        onKeyDown?.('down', e);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onKeyDown?.('left', e);
        break;
      case 'ArrowRight':
        e.preventDefault();
        onKeyDown?.('right', e);
        break;
      case 'Escape':
        onKeyDown?.('escape', e);
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`outline-none ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label="Keyboard navigation enabled"
    >
      {children}
    </div>
  );
};

// Lazy Loading Image
export const LazyImage = ({ 
  src, 
  alt, 
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='%23e5e7eb'/%3E%3C/svg%3E",
  className = "" 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      <motion.img
        src={placeholder}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Actual Image */}
      {isInView && (
        <motion.img
          ref={imgRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 1.1 }}
          transition={{ duration: 0.5 }}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
};

// Error Boundary with Accessibility
export const AccessibleErrorBoundary = ({ children, fallback, className = "" }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      setHasError(true);
      setError(error);
      console.error('Error caught by boundary:', error, errorInfo);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return fallback ? fallback(error) : (
      <div className={`p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg ${className}`}>
        <div className="flex items-center space-x-3">
          <AlertCircle className="text-red-500" size={24} />
          <div>
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              Something went wrong
            </h3>
            <p className="text-red-700 dark:text-red-300">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default {
  HighContrastToggle,
  ReducedMotionProvider,
  OptimizedSkeleton,
  OfflineIndicator,
  PerformanceMonitor,
  FocusRing,
  ScreenReaderOnly,
  KeyboardNavigation,
  LazyImage,
  AccessibleErrorBoundary
};

