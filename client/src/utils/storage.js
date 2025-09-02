/**
 * Storage utility for persisting data in localStorage
 * Handles data validation, error recovery, and fallback mechanisms
 */

const STORAGE_KEYS = {
  TASKS: 'studymate_tasks',
  USER_INFO: 'studymate_user_info',
  AUTH_TOKEN: 'studymate_auth_token',
  SERVER_STATUS: 'studymate_server_status',
  LAST_SYNC: 'studymate_last_sync',
  DEMO_MODE: 'studymate_demo_mode'
}

/**
 * Safely get data from localStorage with error handling
 * @param {string} key Storage key
 * @param {any} defaultValue Default value if data is not found or invalid
 * @returns {any} Parsed data or default value
 */
export const getStorageData = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return defaultValue
    
    const parsed = JSON.parse(item)
    return parsed
  } catch (error) {
    console.warn(`Failed to parse localStorage data for key "${key}":`, error)
    // Clean up corrupted data
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error(`Failed to remove corrupted localStorage key "${key}":`, e)
    }
    return defaultValue
  }
}

/**
 * Safely set data in localStorage with error handling
 * @param {string} key Storage key
 * @param {any} data Data to store
 * @returns {boolean} Success status
 */
export const setStorageData = (key, data) => {
  try {
    const serialized = JSON.stringify(data)
    localStorage.setItem(key, serialized)
    return true
  } catch (error) {
    console.error(`Failed to save data to localStorage for key "${key}":`, error)
    return false
  }
}

/**
 * Remove data from localStorage
 * @param {string} key Storage key
 */
export const removeStorageData = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to remove localStorage key "${key}":`, error)
  }
}

/**
 * Clear all StudyMate data from localStorage
 */
export const clearStudyMateData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeStorageData(key)
  })
}

// Task-specific storage functions
export const getStoredTasks = () => {
  return getStorageData(STORAGE_KEYS.TASKS, [])
}

export const setStoredTasks = (tasks) => {
  return setStorageData(STORAGE_KEYS.TASKS, tasks)
}

export const addStoredTask = (task) => {
  const tasks = getStoredTasks()
  const newTask = {
    ...task,
    id: task.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: task.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isLocal: true
  }
  tasks.push(newTask)
  setStoredTasks(tasks)
  return newTask
}

export const updateStoredTask = (taskId, updates) => {
  const tasks = getStoredTasks()
  const index = tasks.findIndex(task => task.id === taskId)
  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    setStoredTasks(tasks)
    return tasks[index]
  }
  return null
}

export const deleteStoredTask = (taskId) => {
  const tasks = getStoredTasks()
  const filteredTasks = tasks.filter(task => task.id !== taskId)
  setStoredTasks(filteredTasks)
  return filteredTasks.length !== tasks.length
}

// User data storage functions
export const getStoredUserInfo = () => {
  return getStorageData(STORAGE_KEYS.USER_INFO, null)
}

export const setStoredUserInfo = (userInfo) => {
  return setStorageData(STORAGE_KEYS.USER_INFO, userInfo)
}

export const getStoredAuthToken = () => {
  return getStorageData(STORAGE_KEYS.AUTH_TOKEN, null)
}

export const setStoredAuthToken = (token) => {
  return setStorageData(STORAGE_KEYS.AUTH_TOKEN, token)
}

// Server status storage functions
export const getStoredServerStatus = () => {
  return getStorageData(STORAGE_KEYS.SERVER_STATUS, { isOnline: false, lastCheck: null })
}

export const setStoredServerStatus = (status) => {
  return setStorageData(STORAGE_KEYS.SERVER_STATUS, {
    ...status,
    lastCheck: new Date().toISOString()
  })
}

export const getLastSyncTime = () => {
  return getStorageData(STORAGE_KEYS.LAST_SYNC, null)
}

export const setLastSyncTime = () => {
  return setStorageData(STORAGE_KEYS.LAST_SYNC, new Date().toISOString())
}

// Demo mode functions
export const isDemoMode = () => {
  return getStorageData(STORAGE_KEYS.DEMO_MODE, false)
}

export const setDemoMode = (enabled) => {
  return setStorageData(STORAGE_KEYS.DEMO_MODE, enabled)
}

// Data sync utilities
export const getUnsyncedTasks = () => {
  const tasks = getStoredTasks()
  return tasks.filter(task => task.isLocal || task.needsSync)
}

export const markTaskSynced = (taskId) => {
  const tasks = getStoredTasks()
  const index = tasks.findIndex(task => task.id === taskId)
  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      isLocal: false,
      needsSync: false
    }
    setStoredTasks(tasks)
  }
}

export const markTaskForSync = (taskId) => {
  const tasks = getStoredTasks()
  const index = tasks.findIndex(task => task.id === taskId)
  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      needsSync: true,
      updatedAt: new Date().toISOString()
    }
    setStoredTasks(tasks)
  }
}














