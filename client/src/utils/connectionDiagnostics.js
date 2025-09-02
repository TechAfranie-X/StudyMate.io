// StudyMate Connection Diagnostics System
// Comprehensive logging and error handling for server connectivity

const DEBUG_MODE = true;
const CONNECTION_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds

// Enhanced logging system
const logConnection = (type, data) => {
  if (DEBUG_MODE) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      type,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.log(`🔍 [${timestamp}] ${type}:`, logData);
    
    // Store in localStorage for debugging
    const logs = JSON.parse(localStorage.getItem('studymate_connection_logs') || '[]');
    logs.push(logData);
    if (logs.length > 100) logs.shift(); // Keep last 100 logs
    localStorage.setItem('studymate_connection_logs', JSON.stringify(logs));
  }
};

// Enhanced fetch wrapper with comprehensive diagnostics
const apiCall = async (url, options = {}) => {
  const requestId = Math.random().toString(36).substr(2, 9);
  
  logConnection('REQUEST_START', { 
    requestId,
    url, 
    options,
    timestamp: Date.now()
  });
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      logConnection('TIMEOUT', { requestId, url, timeout: CONNECTION_TIMEOUT });
    }, CONNECTION_TIMEOUT);
    
    const startTime = Date.now();
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Request-ID': requestId,
        ...options.headers,
      }
    });
    
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    
    logConnection('RESPONSE_RECEIVED', { 
      requestId,
      status: response.status, 
      statusText: response.statusText,
      duration,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url
    });
    
    if (!response.ok) {
      const errorData = {
        requestId,
        status: response.status,
        statusText: response.statusText,
        url: response.url
      };
      
      logConnection('HTTP_ERROR', errorData);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    logConnection('SUCCESS', { requestId, data, duration });
    return data;
    
  } catch (error) {
    logConnection('ERROR', {
      requestId,
      message: error.message,
      name: error.name,
      stack: error.stack,
      url
    });
    throw error;
  }
};

// Connection health checker
const checkServerHealth = async () => {
  logConnection('HEALTH_CHECK_START', { timestamp: Date.now() });
  
  try {
    const healthResponse = await apiCall('/health');
    logConnection('HEALTH_CHECK_SUCCESS', healthResponse);
    return { isHealthy: true, data: healthResponse };
  } catch (error) {
    logConnection('HEALTH_CHECK_FAILED', { error: error.message });
    return { isHealthy: false, error: error.message };
  }
};

// Retry mechanism with exponential backoff
const apiCallWithRetry = async (url, options = {}, retryCount = 0) => {
  try {
    return await apiCall(url, options);
  } catch (error) {
    if (retryCount >= MAX_RETRIES) {
      logConnection('MAX_RETRIES_REACHED', { url, retryCount, error: error.message });
      throw error;
    }
    
    const delay = RETRY_DELAY * Math.pow(2, retryCount);
    logConnection('RETRY_ATTEMPT', { url, retryCount: retryCount + 1, delay });
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return apiCallWithRetry(url, options, retryCount + 1);
  }
};

// Network status monitor
const monitorNetworkStatus = () => {
  const updateNetworkStatus = () => {
    const isOnline = navigator.onLine;
    logConnection('NETWORK_STATUS', { 
      isOnline, 
      connectionType: navigator.connection?.effectiveType || 'unknown',
      downlink: navigator.connection?.downlink || 'unknown'
    });
  };
  
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  updateNetworkStatus(); // Initial check
};

// Port availability checker
const checkPortAvailability = async (port) => {
  const testUrls = [
    `http://localhost:${port}/health`,
    `http://localhost:${port}/api/tasks`,
    `http://localhost:${port}`
  ];
  
  const results = [];
  
  for (const url of testUrls) {
    try {
      const response = await fetch(url, { 
        method: 'GET',
        mode: 'cors',
        timeout: 5000
      });
      results.push({ url, status: response.status, available: true });
    } catch (error) {
      results.push({ url, error: error.message, available: false });
    }
  }
  
  logConnection('PORT_AVAILABILITY_CHECK', { port, results });
  return results;
};

// Comprehensive connection test
const runConnectionDiagnostics = async () => {
  logConnection('DIAGNOSTICS_START', { timestamp: Date.now() });
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    network: {
      online: navigator.onLine,
      connectionType: navigator.connection?.effectiveType || 'unknown'
    },
    ports: {},
    health: {},
    errors: []
  };
  
  // Check common ports
  const ports = [3000, 3001, 5001, 5173];
  for (const port of ports) {
    diagnostics.ports[port] = await checkPortAvailability(port);
  }
  
  // Check server health
  try {
    diagnostics.health = await checkServerHealth();
  } catch (error) {
    diagnostics.errors.push({ type: 'health_check', error: error.message });
  }
  
  logConnection('DIAGNOSTICS_COMPLETE', diagnostics);
  
  // Store diagnostics for debugging
  localStorage.setItem('studymate_diagnostics', JSON.stringify(diagnostics));
  
  return diagnostics;
};

// Get connection logs for debugging
const getConnectionLogs = () => {
  return JSON.parse(localStorage.getItem('studymate_connection_logs') || '[]');
};

// Clear connection logs
const clearConnectionLogs = () => {
  localStorage.removeItem('studymate_connection_logs');
  localStorage.removeItem('studymate_diagnostics');
};

// Export diagnostic functions
export {
  apiCall,
  apiCallWithRetry,
  checkServerHealth,
  monitorNetworkStatus,
  checkPortAvailability,
  runConnectionDiagnostics,
  getConnectionLogs,
  clearConnectionLogs,
  logConnection
};














