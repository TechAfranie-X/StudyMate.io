import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, XCircle, RefreshCw, Server, Wifi, Database } from 'lucide-react'

const ConnectionDiagnostics = () => {
  const [status, setStatus] = useState({
    backend: 'checking',
    database: 'checking',
    overall: 'checking'
  })
  const [details, setDetails] = useState({})
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    setIsChecking(true)
    const newStatus = { backend: 'checking', database: 'checking', overall: 'checking' }
    const newDetails = {}
    
    setStatus(newStatus)
    setDetails(newDetails)

    try {
      // Check backend connectivity
      console.log('🔍 Checking backend connectivity...')
      const backendStart = Date.now()
      const backendResponse = await fetch('http://localhost:5001/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const backendTime = Date.now() - backendStart
      
      if (backendResponse.ok) {
        newStatus.backend = 'connected'
        newDetails.backend = `Connected in ${backendTime}ms`
        console.log('✅ Backend connected successfully')
      } else {
        newStatus.backend = 'error'
        newDetails.backend = `HTTP ${backendResponse.status}: ${backendResponse.statusText}`
        console.log('❌ Backend connection failed:', backendResponse.status)
      }
    } catch (error) {
      newStatus.backend = 'error'
      newDetails.backend = `Connection failed: ${error.message}`
      console.log('❌ Backend connection error:', error.message)
    }

    try {
      // Check database connectivity (via backend health endpoint)
      console.log('🔍 Checking database connectivity...')
      const dbStart = Date.now()
      const dbResponse = await fetch('http://localhost:5001/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      const dbTime = Date.now() - dbStart
      
      if (dbResponse.ok) {
        const dbData = await dbResponse.json()
        if (dbData.status === 'ok') {
          newStatus.database = 'connected'
          newDetails.database = `Connected in ${dbTime}ms`
          console.log('✅ Database connected successfully')
        } else {
          newStatus.database = 'error'
          newDetails.database = `Database error: ${dbData.message}`
          console.log('❌ Database connection failed:', dbData.message)
        }
      } else {
        newStatus.database = 'error'
        newDetails.database = `HTTP ${dbResponse.status}: ${dbResponse.statusText}`
        console.log('❌ Database connection failed:', dbResponse.status)
      }
    } catch (error) {
      newStatus.database = 'error'
      newDetails.database = `Connection failed: ${error.message}`
      console.log('❌ Database connection error:', error.message)
    }

    // Determine overall status
    if (newStatus.backend === 'connected' && newStatus.database === 'connected') {
      newStatus.overall = 'connected'
    } else if (newStatus.backend === 'error' || newStatus.database === 'error') {
      newStatus.overall = 'error'
    } else {
      newStatus.overall = 'partial'
    }

    setStatus(newStatus)
    setDetails(newDetails)
    setIsChecking(false)
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'checking':
        return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 dark:text-green-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      case 'checking':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'error':
        return 'Connection Failed'
      case 'checking':
        return 'Checking...'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Connection Diagnostics
        </h3>
        <button
          onClick={checkConnection}
          disabled={isChecking}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Checking...' : 'Refresh'}</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <Server className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Overall Status</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">System connectivity</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
            {getStatusIcon(status.overall)}
            <span className={`font-medium ${getStatusColor(status.overall)}`}>
              {getStatusText(status.overall)}
            </span>
              </div>
            </div>

        {/* Backend Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <Wifi className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Backend Server</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">API connectivity</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.backend)}
            <span className={`font-medium ${getStatusColor(status.backend)}`}>
              {getStatusText(status.backend)}
                    </span>
                  </div>
        </div>

        {/* Database Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <Database className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Database</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Data persistence</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status.database)}
            <span className={`font-medium ${getStatusColor(status.database)}`}>
              {getStatusText(status.database)}
                    </span>
                  </div>
                </div>
              </div>

      {/* Connection Details */}
      {(details.backend || details.database) && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Connection Details</h4>
          <div className="space-y-2 text-sm">
            {details.backend && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Backend:</span>
                <span className="text-gray-900 dark:text-white">{details.backend}</span>
                      </div>
                    )}
            {details.database && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Database:</span>
                <span className="text-gray-900 dark:text-white">{details.database}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

      {/* Troubleshooting Tips */}
      {status.overall === 'error' && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Troubleshooting Tips</h4>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            <li>• Make sure the backend server is running (npm run server:dev)</li>
            <li>• Check if the server is running on port 5001</li>
            <li>• Verify the database connection in your .env file</li>
            <li>• Check the server console for error messages</li>
                      </ul>
                </div>
              )}

      {/* Success Message */}
      {status.overall === 'connected' && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 dark:text-green-200 font-medium">
              All systems are connected and working properly!
                          </span>
              </div>
            </div>
      )}
    </div>
  )
}

export default ConnectionDiagnostics
