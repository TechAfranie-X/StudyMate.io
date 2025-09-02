import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, setUserInfo, removeUserInfo } from '../utils/api'

const AuthContext = createContext()

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state from localStorage and validate token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...')
        const storedToken = localStorage.getItem('authToken')
        const storedUser = localStorage.getItem('userInfo')
        
        console.log('📦 Stored token:', storedToken ? 'exists' : 'none')
        console.log('📦 Stored user:', storedUser ? 'exists' : 'none')
        
        if (storedToken && storedUser) {
          console.log('🔍 Validating stored token with backend...')
          // Validate token with backend
          try {
            const userData = JSON.parse(storedUser)
            const response = await authAPI.getCurrentUser()
            
            if (response.success) {
              console.log('✅ Token validation successful')
              setUser(response.data)
              setToken(storedToken)
              setUserInfo(response.data) // Update stored user info
            } else {
              console.log('❌ Token validation failed, clearing stored data')
              // Token is invalid, clear stored data
              localStorage.removeItem('authToken')
              localStorage.removeItem('userInfo')
            }
          } catch (err) {
            console.log('❌ Token validation error:', err.message)
            // Token validation failed, clear stored data
            localStorage.removeItem('authToken')
            localStorage.removeItem('userInfo')
          }
        } else {
          console.log('📭 No stored authentication data found')
        }
      } catch (err) {
        console.error('💥 Error initializing auth:', err)
        setError('Failed to load authentication state')
      } finally {
        console.log('🏁 Authentication initialization complete')
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authAPI.login(credentials)
      
      if (response.success && response.data.token) {
        setUser(response.data.user)
        setToken(response.data.token)
        setUserInfo(response.data.user)
        setError(null)
        return { success: true }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to complete login'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authAPI.register(userData)
      
      if (response.success && response.data.token) {
        setUser(response.data.user)
        setToken(response.data.token)
        setUserInfo(response.data.user)
        setError(null)
        return { success: true }
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to complete registration'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    try {
      setUser(null)
      setToken(null)
      localStorage.removeItem('authToken')
      removeUserInfo()
      setError(null)
    } catch (err) {
      console.error('Error during logout:', err)
      setError('Failed to complete logout')
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      setError(null)
      
      // This would call the backend API to update profile
      // For now, we'll just update local state
      const updatedUser = { ...user, ...profileData }
      setUser(updatedUser)
      setUserInfo(updatedUser)
      
      return { success: true }
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  // Debug function to clear authentication for testing
  const clearAuth = () => {
    console.log('🧹 Clearing authentication for testing...')
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
    removeUserInfo()
    setError(null)
  }

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    clearAuth,
    isAuthenticated: !!token && !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { useAuth, AuthProvider }
