const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  // User registration
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  // User login
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },

  // Logout (clear token)
  logout: () => {
    removeAuthToken();
  },
};

// Tasks API calls
export const tasksAPI = {
  // Get all tasks for current user
  getTasks: async () => {
    return await apiRequest('/tasks');
  },

  // Get specific task by ID
  getTaskById: async (id) => {
    return await apiRequest(`/tasks/${id}`);
  },

  // Create new task
  createTask: async (taskData) => {
    return await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // Update existing task
  updateTask: async (id, taskData) => {
    return await apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  // Delete task
  deleteTask: async (id) => {
    return await apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// Users API calls
export const usersAPI = {
  // Get current user profile
  getProfile: async () => {
    return await apiRequest('/users');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return await apiRequest('/users', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return await apiRequest('/users/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },
};

// Health check API call
export const healthAPI = {
  check: async () => {
    return await apiRequest('/health');
  },
};

// User info management functions
export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

export const setUserInfo = (userData) => {
  try {
    localStorage.setItem('userInfo', JSON.stringify(userData));
  } catch (error) {
    console.error('Error setting user info:', error);
  }
};

export const removeUserInfo = () => {
  try {
    localStorage.removeItem('userInfo');
  } catch (error) {
    console.error('Error removing user info:', error);
  }
};

// Export utility functions
export { getAuthToken, setAuthToken, removeAuthToken };


