import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
import { healthAPI } from '../utils/api';

const ServerStatus = () => {
  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);

  const checkServerHealth = async () => {
    try {
      setStatus('checking');
      const response = await healthAPI.check();
      if (response.success) {
        setStatus('connected');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Server health check failed:', error);
      setStatus('disconnected');
    } finally {
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkServerHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkServerHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          text: 'Server Connected',
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      case 'disconnected':
        return {
          icon: <WifiOff className="w-4 h-4 text-red-500" />,
          text: 'Server Disconnected',
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4 text-yellow-500" />,
          text: 'Server Error',
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800'
        };
      default:
        return {
          icon: <Wifi className="w-4 h-4 text-blue-500 animate-pulse" />,
          text: 'Checking Connection...',
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
      {statusInfo.icon}
      <span className={`text-sm font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
      {lastCheck && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {lastCheck.toLocaleTimeString()}
        </span>
      )}
      <button
        onClick={checkServerHealth}
        className="ml-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        title="Check server status"
      >
        ↻
      </button>
    </div>
  );
};

export default ServerStatus;

