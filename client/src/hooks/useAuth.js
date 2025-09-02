import { useAuth as useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const auth = useAuthContext();
  
  const login = async (credentials) => {
    return await auth.login(credentials);
  };

  const register = async (userData) => {
    return await auth.register(userData);
  };

  const logout = () => {
    auth.logout();
  };

  const updateProfile = async (profileData) => {
    return await auth.updateProfile(profileData);
  };

  return {
    // State
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    clearError: auth.clearError,
    clearAuth: auth.clearAuth,
  };
};






