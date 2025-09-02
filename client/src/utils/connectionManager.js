/**
 * Connection Manager for handling server connectivity
 * Implements exponential backoff, proper error handling, and non-blocking notifications
 */

import { getStoredServerStatus, setStoredServerStatus, setDemoMode, isDemoMode } from './storage'

class ConnectionManager {
  constructor() {
    this.isOnline = false
    this.isChecking = false
    this.retryCount = 0
    this.maxRetries = 5
    this.baseDelay = 1000 // 1 second
    this.maxDelay = 30000 // 30 seconds
    this.checkInterval = null
    this.listeners = new Set()
    this.lastCheck = null
    this.connectionTimeout = 5000 // 5 seconds timeout
  }

  /**
   * Add a listener for connection status changes
   * @param {Function} listener Callback function
   */
  addListener(listener) {
    this.listeners.add(listener)
    // Immediately notify with current status
    listener({
      isOnline: this.isOnline,
      isChecking: this.isChecking,
      retryCount: this.retryCount,
      lastCheck: this.lastCheck
    })
  }

  /**
   * Remove a listener
   * @param {Function} listener Callback function
   */
  removeListener(listener) {
    this.listeners.delete(listener)
  }

  /**
   * Notify all listeners of status change
   */
  notifyListeners() {
    const status = {
      isOnline: this.isOnline,
      isChecking: this.isChecking,
      retryCount: this.retryCount,
      lastCheck: this.lastCheck
    }
    
    this.listeners.forEach(listener => {
      try {
        listener(status)
      } catch (error) {
        console.error('Error in connection status listener:', error)
      }
    })
  }

  /**
   * Calculate exponential backoff delay
   * @returns {number} Delay in milliseconds
   */
  getBackoffDelay() {
    const delay = Math.min(
      this.baseDelay * Math.pow(2, this.retryCount),
      this.maxDelay
    )
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay
    return delay + jitter
  }

  /**
   * Test server connection with timeout
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.connectionTimeout)

    try {
      const response = await fetch('/health', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        return data.status === 'ok'
      }
      
      return false
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        console.warn('🔌 Connection test timed out after', this.connectionTimeout, 'ms')
      } else {
        console.warn('🔌 Connection test failed:', error.message)
      }
      
      return false
    }
  }

  /**
   * Check server connection status
   * @param {boolean} force Force check even if already checking
   * @returns {Promise<boolean>} Connection status
   */
  async checkConnection(force = false) {
    if (this.isChecking && !force) {
      return this.isOnline
    }

    this.isChecking = true
    this.lastCheck = new Date().toISOString()
    this.notifyListeners()

    try {
      console.log('🔍 Checking server connection...')
      const isConnected = await this.testConnection()
      
      if (isConnected) {
        // Connection successful
        this.isOnline = true
        this.retryCount = 0
        console.log('✅ Server connection successful')
        
        // If we were in demo mode, offer to sync
        if (isDemoMode()) {
          console.log('🔄 Server reconnected while in demo mode - data sync available')
        }
      } else {
        // Connection failed
        this.isOnline = false
        this.retryCount = Math.min(this.retryCount + 1, this.maxRetries)
        console.warn(`❌ Server connection failed (attempt ${this.retryCount}/${this.maxRetries})`)
        
        // If max retries reached, suggest demo mode
        if (this.retryCount >= this.maxRetries) {
          console.warn('🚨 Max retry attempts reached - suggesting demo mode')
        }
      }

      // Store status in localStorage
      setStoredServerStatus({
        isOnline: this.isOnline,
        retryCount: this.retryCount,
        lastCheck: this.lastCheck
      })

      this.notifyListeners()
      return this.isOnline

    } catch (error) {
      console.error('🔌 Connection check error:', error)
      this.isOnline = false
      this.retryCount = Math.min(this.retryCount + 1, this.maxRetries)
      this.notifyListeners()
      return false
    } finally {
      this.isChecking = false
      this.notifyListeners()
    }
  }

  /**
   * Start periodic connection checking
   * @param {number} interval Check interval in milliseconds (default: 30 seconds)
   */
  startPeriodicChecks(interval = 30000) {
    if (this.checkInterval) {
      this.stopPeriodicChecks()
    }

    console.log(`🔄 Starting periodic connection checks every ${interval}ms`)
    
    // Initial check
    this.checkConnection()
    
    // Set up periodic checks
    this.checkInterval = setInterval(() => {
      this.checkConnection()
    }, interval)
  }

  /**
   * Stop periodic connection checking
   */
  stopPeriodicChecks() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
      console.log('🛑 Stopped periodic connection checks')
    }
  }

  /**
   * Enable demo mode
   */
  enableDemoMode() {
    setDemoMode(true)
    console.log('🎭 Demo mode enabled - using local storage for data')
  }

  /**
   * Disable demo mode
   */
  disableDemoMode() {
    setDemoMode(false)
    console.log('🔄 Demo mode disabled - attempting server connection')
  }

  /**
   * Get current connection status
   * @returns {Object} Connection status object
   */
  getStatus() {
    return {
      isOnline: this.isOnline,
      isChecking: this.isChecking,
      retryCount: this.retryCount,
      maxRetries: this.maxRetries,
      lastCheck: this.lastCheck,
      isDemoMode: isDemoMode()
    }
  }

  /**
   * Initialize connection manager
   */
  async initialize() {
    console.log('🚀 Initializing connection manager...')
    
    // Load stored status
    const storedStatus = getStoredServerStatus()
    this.isOnline = storedStatus.isOnline || false
    this.retryCount = storedStatus.retryCount || 0
    this.lastCheck = storedStatus.lastCheck || null
    
    // Start periodic checks
    this.startPeriodicChecks()
    
    console.log('✅ Connection manager initialized')
  }

  /**
   * Cleanup connection manager
   */
  cleanup() {
    this.stopPeriodicChecks()
    this.listeners.clear()
    console.log('🧹 Connection manager cleaned up')
  }
}

// Create singleton instance
const connectionManager = new ConnectionManager()

export default connectionManager
