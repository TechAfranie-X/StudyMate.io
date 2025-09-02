import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'
import connectionManager from '../utils/connectionManager'
import { isDemoMode, setDemoMode } from '../utils/storage'

const ConnectionBanner = () => {
  const [status, setStatus] = useState({
    isOnline: false,
    isChecking: false,
    retryCount: 0,
    lastCheck: null
  })
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const handleStatusChange = (newStatus) => {
      setStatus(newStatus)
      
      // Show banner if offline or in demo mode
      const shouldShow = !newStatus.isOnline || isDemoMode()
      setIsVisible(shouldShow)
    }

    // Subscribe to connection status changes
    connectionManager.addListener(handleStatusChange)

    return () => {
      connectionManager.removeListener(handleStatusChange)
    }
  }, [])

  const handleRetry = async () => {
    console.log('🔄 Manual retry requested')
    await connectionManager.checkConnection(true)
  }

  const handleEnableDemoMode = () => {
    setDemoMode(true)
    connectionManager.enableDemoMode()
    console.log('🎭 Demo mode enabled by user')
  }

  const handleDisableDemoMode = () => {
    setDemoMode(false)
    connectionManager.disableDemoMode()
    console.log('🔄 Demo mode disabled by user')
  }

  const getBannerContent = () => {
    if (isDemoMode()) {
      return {
        icon: <WifiOff className="w-5 h-5" />,
        title: 'Demo Mode Active',
        message: 'Working offline with local data. Server connection unavailable.',
        type: 'warning',
        actions: [
          {
            label: 'Try Server',
            onClick: handleDisableDemoMode,
            variant: 'secondary'
          }
        ]
      }
    }

    if (status.isChecking) {
      return {
        icon: <RefreshCw className="w-5 h-5 animate-spin" />,
        title: 'Checking Connection...',
        message: 'Verifying server connectivity...',
        type: 'info',
        actions: []
      }
    }

    if (!status.isOnline) {
      const retryMessage = status.retryCount > 0 
        ? ` (Attempt ${status.retryCount}/5)`
        : ''

      return {
        icon: <WifiOff className="w-5 h-5" />,
        title: 'Server Unavailable',
        message: `Unable to connect to StudyMate server.${retryMessage}`,
        type: 'error',
        actions: [
          {
            label: 'Retry',
            onClick: handleRetry,
            variant: 'primary'
          },
          {
            label: 'Demo Mode',
            onClick: handleEnableDemoMode,
            variant: 'secondary'
          }
        ]
      }
    }

    return {
      icon: <CheckCircle className="w-5 h-5" />,
      title: 'Connected',
      message: 'Successfully connected to StudyMate server.',
      type: 'success',
      actions: []
    }
  }

  const content = getBannerContent()

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-0 left-0 right-0 z-50 p-4 ${
          content.type === 'error' ? 'bg-red-50 border-b border-red-200' :
          content.type === 'warning' ? 'bg-yellow-50 border-b border-yellow-200' :
          content.type === 'success' ? 'bg-green-50 border-b border-green-200' :
          'bg-blue-50 border-b border-blue-200'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`${
                content.type === 'error' ? 'text-red-600' :
                content.type === 'warning' ? 'text-yellow-600' :
                content.type === 'success' ? 'text-green-600' :
                'text-blue-600'
              }`}>
                {content.icon}
              </div>
              
              <div className="flex-1">
                <h3 className={`text-sm font-medium ${
                  content.type === 'error' ? 'text-red-800' :
                  content.type === 'warning' ? 'text-yellow-800' :
                  content.type === 'success' ? 'text-green-800' :
                  'text-blue-800'
                }`}>
                  {content.title}
                </h3>
                <p className={`text-sm ${
                  content.type === 'error' ? 'text-red-700' :
                  content.type === 'warning' ? 'text-yellow-700' :
                  content.type === 'success' ? 'text-green-700' :
                  'text-blue-700'
                }`}>
                  {content.message}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {content.actions.map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.onClick}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    action.variant === 'primary' 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-white text-red-600 border border-red-300 hover:bg-red-50'
                  }`}
                >
                  {action.label}
                </motion.button>
              ))}
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-gray-200"
            >
              <div className="text-xs text-gray-600 space-y-1">
                <div>Last Check: {status.lastCheck ? new Date(status.lastCheck).toLocaleString() : 'Never'}</div>
                <div>Retry Count: {status.retryCount}/5</div>
                <div>Demo Mode: {isDemoMode() ? 'Enabled' : 'Disabled'}</div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ConnectionBanner









