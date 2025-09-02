// StudyMate Connection Health Checker
// Enhanced health monitoring with retry logic and exponential backoff

import { logConnection } from './connectionDiagnostics.js'

class ConnectionHealthChecker {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
    this.isOnline = navigator.onLine
    this.retryAttempts = 0
    this.maxRetries = 5
    this.retryDelay = 1000
    this.healthCheckInterval = null
    this.lastHealthCheck = null
    this.healthStatus = 'unknown'
    this.listeners = new Set()
    
    // Initialize network monitoring
    this.initializeNetworkMonitoring()
    
    // Start periodic health checks
    this.startPeriodicHealthChecks()
  }
  
  initializeNetworkMonitoring() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true
      logConnection('NETWORK_ONLINE', { timestamp: Date.now() })
      console.log('🌐 Network connection restored')
      this.resetRetryCount()
      this.notifyListeners('online')
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
      logConnection('NETWORK_OFFLINE', { timestamp: Date.now() })
      console.log('📡 Network connection lost')
      this.healthStatus = 'offline'
      this.notifyListeners('offline')
    })
    
    // Monitor connection quality
    if (navigator.connection) {
      navigator.connection.addEventListener('change', () => {
        const connectionInfo = {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt,
          saveData: navigator.connection.saveData
        }
        logConnection('CONNECTION_CHANGE', connectionInfo)
        this.notifyListeners('connectionChange', connectionInfo)
      })
    }
  }
  
  async checkServerHealth() {
    if (!this.isOnline) {
      const error = new Error('No internet connection')
      logConnection('HEALTH_CHECK_FAILED', { error: error.message, reason: 'offline' })
      throw error
    }
    
    const startTime = Date.now()
    logConnection('HEALTH_CHECK_START', { timestamp: startTime })
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'X-Health-Check': 'true'
        }
      })
      
      clearTimeout(timeoutId)
      const duration = Date.now() - startTime
      
      if (response.ok) {
        const healthData = await response.json()
        this.healthStatus = 'healthy'
        this.lastHealthCheck = startTime
        this.resetRetryCount()
        
        const result = { 
          status: 'healthy', 
          timestamp: startTime,
          duration,
          data: healthData
        }
        
        logConnection('HEALTH_CHECK_SUCCESS', result)
        this.notifyListeners('healthy', result)
        
        return result
      }
      
      throw new Error(`Server health check failed: ${response.status} ${response.statusText}`)
      
    } catch (error) {
      const duration = Date.now() - startTime
      this.healthStatus = 'unhealthy'
      
      const errorInfo = {
        error: error.message,
        duration,
        timestamp: startTime,
        retryAttempt: this.retryAttempts + 1
      }
      
      logConnection('HEALTH_CHECK_FAILED', errorInfo)
      this.notifyListeners('unhealthy', errorInfo)
      
      throw error
    }
  }
  
  async retryWithBackoff(apiFunction, ...args) {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logConnection('RETRY_ATTEMPT', { 
          attempt, 
          maxRetries: this.maxRetries,
          function: apiFunction.name || 'unknown'
        })
        
        const result = await apiFunction(...args)
        this.resetRetryCount()
        
        logConnection('RETRY_SUCCESS', { 
          attempt, 
          function: apiFunction.name || 'unknown'
        })
        
        return result
      } catch (error) {
        console.log(`⚠️ Attempt ${attempt}/${this.maxRetries} failed:`, error.message)
        
        if (attempt === this.maxRetries) {
          const finalError = new Error(`All ${this.maxRetries} attempts failed. Last error: ${error.message}`)
          logConnection('RETRY_FAILED', { 
            attempts: this.maxRetries,
            finalError: finalError.message,
            function: apiFunction.name || 'unknown'
          })
          throw finalError
        }
        
        // Exponential backoff with jitter
        const delay = this.calculateBackoffDelay(attempt)
        console.log(`⏳ Retrying in ${delay}ms...`)
        
        logConnection('RETRY_DELAY', { 
          attempt, 
          delay,
          function: apiFunction.name || 'unknown'
        })
        
        await this.sleep(delay)
      }
    }
  }
  
  calculateBackoffDelay(attempt) {
    // Exponential backoff with jitter to prevent thundering herd
    const baseDelay = this.retryDelay * Math.pow(2, attempt - 1)
    const jitter = Math.random() * 0.1 * baseDelay // 10% jitter
    return Math.min(baseDelay + jitter, 30000) // Max 30 seconds
  }
  
  startPeriodicHealthChecks(intervalMs = 30000) {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }
    
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.checkServerHealth()
      } catch (error) {
        // Silent fail for periodic checks - we don't want to spam the console
        console.debug('Periodic health check failed:', error.message)
      }
    }, intervalMs)
    
    logConnection('PERIODIC_HEALTH_STARTED', { intervalMs })
  }
  
  stopPeriodicHealthChecks() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = null
      logConnection('PERIODIC_HEALTH_STOPPED')
    }
  }
  
  // Event listener system
  addListener(event, callback) {
    this.listeners.add({ event, callback })
  }
  
  removeListener(event, callback) {
    for (const listener of this.listeners) {
      if (listener.event === event && listener.callback === callback) {
        this.listeners.delete(listener)
        break
      }
    }
  }
  
  notifyListeners(event, data) {
    for (const listener of this.listeners) {
      if (listener.event === event) {
        try {
          listener.callback(data)
        } catch (error) {
          console.error('Error in health checker listener:', error)
        }
      }
    }
  }
  
  // Enhanced API wrapper with health checks
  async apiCallWithHealthCheck(endpoint, options = {}) {
    // First check if we're online
    if (!this.isOnline) {
      throw new Error('No internet connection available')
    }
    
    // Perform a quick health check before making the API call
    try {
      await this.checkServerHealth()
    } catch (error) {
      console.warn('Health check failed before API call:', error.message)
      // Continue with the API call anyway - the health check might be temporarily down
    }
    
    // Make the actual API call with retry logic
    return this.retryWithBackoff(async () => {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return response.json()
    })
  }
  
  // Get current health status
  getHealthStatus() {
    return {
      isOnline: this.isOnline,
      healthStatus: this.healthStatus,
      lastHealthCheck: this.lastHealthCheck,
      retryAttempts: this.retryAttempts,
      connectionInfo: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      } : null
    }
  }
  
  resetRetryCount() {
    this.retryAttempts = 0
    logConnection('RETRY_COUNT_RESET')
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  // Cleanup method
  destroy() {
    this.stopPeriodicHealthChecks()
    this.listeners.clear()
    logConnection('HEALTH_CHECKER_DESTROYED')
  }
}

// Create a singleton instance
const healthChecker = new ConnectionHealthChecker()

export default healthChecker
export { ConnectionHealthChecker }
