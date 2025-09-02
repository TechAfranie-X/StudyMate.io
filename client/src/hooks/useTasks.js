import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { tasksAPI } from '../utils/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'ALL',
    priority: 'ALL',
    subject: 'ALL',
    dueDate: 'ALL',
    tags: []
  });
  const [sortBy, setSortBy] = useState({ field: 'createdAt', order: 'desc' });
  const lastUpdateRef = useRef(Date.now());

  // Enhanced search and filtering
  const getFilteredTasks = useCallback(() => {
    let filtered = tasks.filter(task => task && typeof task === 'object');

    // Text search across multiple fields
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        (task.title || '').toLowerCase().includes(searchTerm) ||
        (task.description || '').toLowerCase().includes(searchTerm) ||
        (task.subject || '').toLowerCase().includes(searchTerm) ||
        (task.tags && Array.isArray(task.tags) && 
         task.tags.some(tag => (tag || '').toLowerCase().includes(searchTerm)))
      );
    }

    // Status filter
    if (filters.status !== 'ALL') {
      filtered = filtered.filter(task => task.status && task.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'ALL') {
      filtered = filtered.filter(task => task.priority && task.priority === filters.priority);
    }

    // Subject filter
    if (filters.subject !== 'ALL') {
      filtered = filtered.filter(task => task.subject && task.subject === filters.subject);
    }

    // Due date filter
    if (filters.dueDate !== 'ALL') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (filters.dueDate) {
        case 'TODAY':
          filtered = filtered.filter(task => {
            if (!task.dueDate) return false;
            try {
              const dueDate = new Date(task.dueDate);
              return dueDate.toDateString() === today.toDateString();
            } catch (error) {
              return false;
            }
          });
          break;
        case 'OVERDUE':
          filtered = filtered.filter(task => {
            if (!task.dueDate) return false;
            try {
              const dueDate = new Date(task.dueDate);
              return dueDate < today && task.status && task.status !== 'COMPLETED';
            } catch (error) {
              return false;
            }
          });
          break;
        case 'THIS_WEEK':
          const endOfWeek = new Date(today);
          endOfWeek.setDate(today.getDate() + 7);
          filtered = filtered.filter(task => {
            if (!task.dueDate) return false;
            try {
              const dueDate = new Date(task.dueDate);
              return dueDate >= today && dueDate <= endOfWeek;
            } catch (error) {
              return false;
            }
          });
          break;
        case 'NEXT_WEEK':
          const startOfNextWeek = new Date(today);
          startOfNextWeek.setDate(today.getDate() + 7);
          const endOfNextWeek = new Date(startOfNextWeek);
          endOfNextWeek.setDate(startOfNextWeek.getDate() + 7);
          filtered = filtered.filter(task => {
            if (!task.dueDate) return false;
            try {
              const dueDate = new Date(task.dueDate);
              return dueDate >= startOfNextWeek && dueDate <= endOfNextWeek;
            } catch (error) {
              return false;
            }
          });
          break;
      }
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(task => 
        task.tags && Array.isArray(task.tags) &&
        filters.tags.some(tag => tag && task.tags.includes(tag))
      );
    }

    return filtered;
  }, [tasks, filters]);

  // Enhanced sorting
  const getSortedTasks = useCallback((taskList) => {
    // Filter out invalid tasks before sorting
    const validTasks = taskList.filter(task => task && typeof task === 'object');
    
    return validTasks.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy.field) {
        case 'title':
          aValue = (a.title || '').toLowerCase();
          bValue = (b.title || '').toLowerCase();
          break;
        case 'status':
          const statusOrder = { 'PENDING': 1, 'IN_PROGRESS': 2, 'COMPLETED': 3 };
          aValue = statusOrder[a.status] || 0;
          bValue = statusOrder[b.status] || 0;
          break;
        case 'priority':
          const priorityOrder = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate) : new Date(0);
          bValue = b.dueDate ? new Date(b.dueDate) : new Date(0);
          break;
        case 'estimatedTime':
          aValue = a.estimatedTime || 0;
          bValue = b.estimatedTime || 0;
          break;
        case 'createdAt':
        default:
          aValue = a.createdAt ? new Date(a.createdAt) : new Date(0);
          bValue = b.createdAt ? new Date(b.createdAt) : new Date(0);
          break;
      }
      
      if (sortBy.order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [sortBy]);

  // Get final filtered and sorted tasks
  const filteredAndSortedTasks = useMemo(() => {
    const filtered = getFilteredTasks();
    return getSortedTasks(filtered);
  }, [getFilteredTasks, getSortedTasks]);

  // Normalize task data to ensure all required properties exist
  const normalizeTask = useCallback((task) => {
    if (!task || typeof task !== 'object') return null;
    
    return {
      id: task.id || `temp-${Date.now()}`,
      title: task.title || 'Untitled Task',
      description: task.description || '',
      subject: task.subject || 'General',
      status: task.status || 'PENDING',
      priority: task.priority || 'LOW',
      dueDate: task.dueDate || null,
      estimatedTime: typeof task.estimatedTime === 'number' ? task.estimatedTime : null,
      tags: Array.isArray(task.tags) ? task.tags : [],
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: task.updatedAt || new Date().toISOString()
    };
  }, []);

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tasksAPI.getTasks();
      
      if (response.success) {
        const normalizedTasks = (response.data || [])
          .map(normalizeTask)
          .filter(Boolean); // Remove any null tasks
        setTasks(normalizedTasks);
        lastUpdateRef.current = Date.now();
      } else {
        throw new Error(response.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [normalizeTask]);

  // Create new task with real-time update
  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tasksAPI.createTask(taskData);
      
      if (response.success) {
        const normalizedTask = normalizeTask(response.data);
        if (normalizedTask) {
          setTasks(prev => [normalizedTask, ...prev]);
          lastUpdateRef.current = Date.now();
          return { success: true, task: normalizedTask };
        } else {
          throw new Error('Failed to normalize created task');
        }
      } else {
        throw new Error(response.message || 'Failed to create task');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to create task';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [normalizeTask]);

  // Update existing task with real-time update
  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tasksAPI.updateTask(taskId, taskData);
      
      if (response.success) {
        const normalizedTask = normalizeTask(response.data);
        if (normalizedTask) {
          setTasks(prev => prev.map(task => 
            task.id === taskId ? normalizedTask : task
          ));
          lastUpdateRef.current = Date.now();
          return { success: true, task: normalizedTask };
        } else {
          throw new Error('Failed to normalize updated task');
        }
      } else {
        throw new Error(response.message || 'Failed to update task');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to update task';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [normalizeTask]);

  // Delete task with real-time update
  const deleteTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tasksAPI.deleteTask(taskId);
      
      if (response.success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        lastUpdateRef.current = Date.now();
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete task');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete task';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get task by ID
  const getTaskById = useCallback(async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tasksAPI.getTaskById(taskId);
      
      if (response.success) {
        const normalizedTask = normalizeTask(response.data);
        if (normalizedTask) {
          return { success: true, task: normalizedTask };
        } else {
          throw new Error('Failed to normalize fetched task');
        }
      } else {
        throw new Error(response.message || 'Failed to fetch task');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch task';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [normalizeTask]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Update sorting
  const updateSorting = useCallback((field, order) => {
    setSortBy({ field, order });
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: 'ALL',
      priority: 'ALL',
      subject: 'ALL',
      dueDate: 'ALL',
      tags: []
    });
  }, []);

  // Task statistics with enhanced metrics
  const getTaskStats = useCallback(() => {
    const validTasks = tasks.filter(task => task && typeof task === 'object');
    const totalTasks = validTasks.length;
    const completedTasks = validTasks.filter(task => task.status === 'COMPLETED').length;
    const inProgressTasks = validTasks.filter(task => task.status === 'IN_PROGRESS').length;
    const pendingTasks = validTasks.filter(task => task.status === 'PENDING').length;
    
    // Priority distribution
    const highPriorityTasks = validTasks.filter(task => task.priority === 'HIGH').length;
    const mediumPriorityTasks = validTasks.filter(task => task.priority === 'MEDIUM').length;
    const lowPriorityTasks = validTasks.filter(task => task.priority === 'LOW').length;
    
    // Time tracking
    const totalEstimatedTime = validTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
    const completedTime = validTasks
      .filter(task => task.status === 'COMPLETED')
      .reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
    
    // Due date analysis
    const overdueTasks = validTasks.filter(task => {
      if (!task.dueDate || task.status === 'COMPLETED') return false;
      try {
        return new Date(task.dueDate) < new Date();
      } catch (error) {
        return false;
      }
    }).length;
    
    const dueTodayTasks = validTasks.filter(task => {
      if (!task.dueDate) return false;
      try {
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === today.toDateString();
      } catch (error) {
        return false;
      }
    }).length;
    
    // Subject distribution
    const subjects = [...new Set(validTasks.map(task => task.subject).filter(Boolean))];
    const subjectDistribution = subjects.map(subject => ({
      subject,
      count: validTasks.filter(task => task.subject === subject).length
    }));
    
    // Tags analysis
    const allTags = validTasks
      .flatMap(task => Array.isArray(task.tags) ? task.tags : [])
      .filter(Boolean);
    const uniqueTags = [...new Set(allTags)];
    const tagDistribution = uniqueTags.map(tag => ({
      tag,
      count: allTags.filter(t => t === tag).length
    }));
    
    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      pending: pendingTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      priority: { high: highPriorityTasks, medium: mediumPriorityTasks, low: lowPriorityTasks },
      time: { estimated: totalEstimatedTime, completed: completedTime, remaining: totalEstimatedTime - completedTime },
      dueDate: { overdue: overdueTasks, dueToday: dueTodayTasks },
      subjects: subjectDistribution,
      tags: tagDistribution,
      lastUpdate: lastUpdateRef.current
    };
  }, [tasks]);

  // Get tasks by status
  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(task => task && task.status === status);
  }, [tasks]);

  // Get tasks by priority
  const getTasksByPriority = useCallback((priority) => {
    return tasks.filter(task => task && task.priority === priority);
  }, [tasks]);

  // Get tasks by subject
  const getTasksBySubject = useCallback((subject) => {
    return tasks.filter(task => task && task.subject === subject);
  }, [tasks]);

  // Get overdue tasks
  const getOverdueTasks = useCallback(() => {
    return tasks.filter(task => {
      if (!task || !task.dueDate || task.status === 'COMPLETED') return false;
      try {
        return new Date(task.dueDate) < new Date();
      } catch (error) {
        return false;
      }
    });
  }, [tasks]);

  // Get due today tasks
  const getDueTodayTasks = useCallback(() => {
    return tasks.filter(task => {
      if (!task || !task.dueDate) return false;
      try {
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        return dueDate.toDateString() === today.toDateString();
      } catch (error) {
        return false;
      }
    });
  }, [tasks]);

  // Get available subjects
  const getAvailableSubjects = useCallback(() => {
    return [...new Set(tasks.filter(task => task && task.subject).map(task => task.subject).filter(Boolean))];
  }, [tasks]);

  // Get available tags
  const getAvailableTags = useCallback(() => {
    const allTags = tasks
      .filter(task => task && typeof task === 'object')
      .flatMap(task => Array.isArray(task.tags) ? task.tags : [])
      .filter(Boolean);
    return [...new Set(allTags)];
  }, [tasks]);

  // Initialize tasks on mount
  useEffect(() => {
    // Set sample data immediately for better UX
    const sampleTasks = [
      {
        id: 'sample-1',
        title: 'Complete StudyMate Setup',
        description: 'Finish setting up your StudyMate account and explore all features',
        subject: 'Getting Started',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: 60,
        tags: ['setup', 'onboarding'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sample-2',
        title: 'Create Your First Task',
        description: 'Add a task to start organizing your study schedule',
        subject: 'Getting Started',
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: 30,
        tags: ['first-task', 'organization'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'sample-3',
        title: 'Explore StudyMate Features',
        description: 'Learn about analytics, task management, and productivity tools',
        subject: 'Getting Started',
        status: 'PENDING',
        priority: 'LOW',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedTime: 45,
        tags: ['learning', 'features'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Set sample data immediately
    setTasks(sampleTasks);
    setLoading(false);

    // Then try to fetch real data
    fetchTasks().catch(err => {
      console.log('Failed to fetch real tasks, using sample data:', err.message);
      // Keep sample data if API fails
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove fetchTasks dependency to prevent infinite loops

  return {
    // State
    tasks,
    filteredAndSortedTasks,
    loading,
    error,
    filters,
    sortBy,
    
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    clearError,
    updateFilters,
    updateSorting,
    resetFilters,
    
    // Utilities
    getTaskStats,
    getTasksByStatus,
    getTasksByPriority,
    getTasksBySubject,
    getOverdueTasks,
    getDueTodayTasks,
    getAvailableSubjects,
    getAvailableTags,
  };
};
