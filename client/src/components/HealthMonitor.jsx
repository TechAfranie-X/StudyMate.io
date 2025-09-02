import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, Server, AlertTriangle, CheckCircle, X } from 'lucide-react'
import healthChecker from '../utils/connectionHealthChecker'
import { useAnimation } from '../contexts/AnimationContext'

const HealthMonitor = ({ 
  showDetailed = false, 
  showNotifications = true, 
  className = '' 
}) => {
  const { reducedMotion } = useAnimation()
  const [healthStatus, setHealthStatus] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  useEffect(() => {
    // Get initial status
    setHealthStatus(healthChecker.getHealthStatus())
    setIsOnline(navigator.onLine)

    // Listen for health checker events
    const handleHealthChange = (data) => {
      const newStatus = healthChecker.getHealthStatus()
      setHealthStatus(newStatus)
      
      if (showNotifications) {
        if (newStatus.healthStatus === 'unhealthy') {
          showHealthNotification('Server connection lost', 'error')
        } else if (newStatus.healthStatus === 'healthy') {
          showHealthNotification('Server connection restored', 'success')
        }
      }
    }

    const handleNetworkChange = () => {
      const online = navigator.onLine
      setIsOnline(online)
      
      if (showNotifications) {
        if (online) {
          showHealthNotification('Network connection restored', 'success')
        } else {
          showHealthNotification('Network connection lost', 'error')
        }
      }
    }

    // Add event listeners
    healthChecker.addListener('healthy', handleHealthChange)
    healthChecker.addListener('unhealthy', handleHealthChange)
    healthChecker.addListener('online', handleNetworkChange)
    healthChecker.addListener('offline', handleNetworkChange)
    
    window.addEventListener('online', handleNetworkChange)
    window.addEventListener('offline', handleNetworkChange)

    // Update status periodically
    const interval = setInterval(() => {
      setHealthStatus(healthChecker.getHealthStatus())
    }, 5000)

    return () => {
      healthChecker.removeListener('healthy', handleHealthChange)
      healthChecker.removeListener('unhealthy', handleHealthChange)
      healthChecker.removeListener('online', handleNetworkChange)
      healthChecker.removeListener('offline', handleNetworkChange)
      
      window.removeEventListener('online', handleNetworkChange)
      window.removeEventListener('offline', handleNetworkChange)
      
      clearInterval(interval)
    }
  }, [showNotifications])

  const showHealthNotification = (message, type) => {
    setNotificationMessage(message)
    setShowNotification(true)
    
    setTimeout(() => {
      setShowNotification(false)
    }, 5000)
  }

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4 text-red-500" />
    if (healthStatus?.healthStatus === 'healthy') return <CheckCircle className="w-4 h-4 text-green-500" />
    if (healthStatus?.healthStatus === 'unhealthy') return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    return <Server className="w-4 h-4 text-gray-500" />
  }

  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500'
    if (healthStatus?.healthStatus === 'healthy') return 'text-green-500'
    if (healthStatus?.healthStatus === 'unhealthy') return 'text-yellow-500'
    return 'text-gray-500'
  }

  const getStatusText = () => {
    if (!isOnline) return 'Offline'
    if (healthStatus?.healthStatus === 'healthy') return 'Connected'
    if (healthStatus?.healthStatus === 'unhealthy') return 'Unstable'
    return 'Checking...'
  }

  if (!showDetailed) {
    return (
      <>
        {/* Simple status indicator */}
        <div className={`flex items-center space-x-2 ${className}`}>
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: reducedMotion ? 0.1 : 0.2 }}
              className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm"
            >
              <div className="flex items-center space-x-3">
                {notificationMessage.includes('restored') ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {notificationMessage}
                  </p>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Detailed view
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Connection Status
        </h3>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Network Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-300">Network</span>
          </div>
          <span className={`text-sm font-medium ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Server Health */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Server</span>
          </div>
          <span className={`text-sm font-medium ${
            healthStatus?.healthStatus === 'healthy' ? 'text-green-500' : 
            healthStatus?.healthStatus === 'unhealthy' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {healthStatus?.healthStatus || 'Unknown'}
          </span>
        </div>

        {/* Connection Quality */}
        {healthStatus?.connectionInfo && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-300">Connection Quality</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {healthStatus.connectionInfo.effectiveType || 'Unknown'}
            </span>
          </div>
        )}

        {/* Last Health Check */}
        {healthStatus?.lastHealthCheck && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-300">Last Check</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {new Date(healthStatus.lastHealthCheck).toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Retry Attempts */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <span className="text-sm text-gray-600 dark:text-gray-300">Retry Attempts</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {healthStatus?.retryAttempts || 0}
          </span>
        </div>
      </div>
    </div>
  )
}

export default HealthMonitor














