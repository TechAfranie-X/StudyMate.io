import { useState, useEffect, useCallback, useRef } from 'react';
import { useTasks } from './useTasks';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isEnabled, setIsEnabled] = useState('Notification' in window);
  const { tasks, getOverdueTasks, getDueTodayTasks } = useTasks();
  const notificationCheckInterval = useRef(null);

  // Check if browser supports notifications
  useEffect(() => {
    if ('Notification' in window) {
      setIsEnabled(true);
      // Request permission on mount
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Create notification
  const createNotification = useCallback((title, options = {}) => {
    if (!isEnabled || Notification.permission !== 'granted') return;

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: false,
      ...options
    });

    // Add to local notifications list
    const newNotification = {
      id: Date.now(),
      title,
      message: options.body || '',
      type: options.type || 'info',
      timestamp: new Date(),
      read: false,
      ...options
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }, [isEnabled]);

  // Check for due date reminders
  const checkDueDateReminders = useCallback(() => {
    const dueToday = getDueTodayTasks();
    const overdue = getOverdueTasks();

    // Check for tasks due today
    dueToday.forEach(task => {
      if (task.status !== 'COMPLETED') {
        createNotification(
          `Task Due Today: ${task.title}`,
          {
            body: `Your task "${task.title}" is due today. Priority: ${task.priority}`,
            type: 'reminder',
            tag: `due-today-${task.id}`,
            data: { taskId: task.id, type: 'due-today' }
          }
        );
      }
    });

    // Check for overdue tasks
    overdue.forEach(task => {
      createNotification(
        `Task Overdue: ${task.title}`,
        {
          body: `Your task "${task.title}" is overdue! Please complete it soon.`,
          type: 'alert',
          tag: `overdue-${task.id}`,
          data: { taskId: task.id, type: 'overdue' }
        }
      );
    });
  }, [getDueTodayTasks, getOverdueTasks, createNotification]);

  // Task completion achievement
  const showCompletionAchievement = useCallback((task) => {
    const completionCount = tasks.filter(t => t.status === 'COMPLETED').length;
    
    let achievementMessage = '';
    let achievementType = 'success';

    if (completionCount === 1) {
      achievementMessage = '🎉 First task completed! Great start!';
    } else if (completionCount === 5) {
      achievementMessage = '🚀 5 tasks completed! You\'re on fire!';
    } else if (completionCount === 10) {
      achievementMessage = '🏆 10 tasks completed! Amazing progress!';
    } else if (completionCount % 25 === 0) {
      achievementMessage = `🎯 ${completionCount} tasks completed! You\'re unstoppable!`;
    } else {
      achievementMessage = `✅ Task "${task.title}" completed! Keep it up!`;
    }

    createNotification(
      'Task Completed! 🎉',
      {
        body: achievementMessage,
        type: achievementType,
        tag: `completion-${task.id}`,
        data: { taskId: task.id, type: 'completion' }
      }
    );
  }, [tasks, createNotification]);

  // Productivity streak notification
  const checkProductivityStreak = useCallback(() => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentCompletions = tasks.filter(task => 
      task.status === 'COMPLETED' && 
      new Date(task.updatedAt) >= lastWeek
    );

    if (recentCompletions.length >= 5) {
      createNotification(
        '🔥 Productivity Streak!',
        {
          body: `You've completed ${recentCompletions.length} tasks this week! Amazing work!`,
          type: 'achievement',
          tag: 'productivity-streak',
          data: { type: 'productivity-streak' }
        }
      );
    }
  }, [tasks, createNotification]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Clear notification
  const clearNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === notificationId);
      return notification && !notification.read ? Math.max(0, prev - 1) : prev;
    });
  }, [notifications]);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Get notifications by type
  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(notif => notif.type === type);
  }, [notifications]);

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notif => !notif.read);
  }, [notifications]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setIsEnabled(permission === 'granted');
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  // Check notification permission
  const checkPermission = useCallback(() => {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }, []);

  // Set up periodic checks
  useEffect(() => {
    if (isEnabled && Notification.permission === 'granted') {
      // Check every 30 minutes
      notificationCheckInterval.current = setInterval(() => {
        checkDueDateReminders();
        checkProductivityStreak();
      }, 30 * 60 * 1000);

      // Initial check
      checkDueDateReminders();
      checkProductivityStreak();
    }

    return () => {
      if (notificationCheckInterval.current) {
        clearInterval(notificationCheckInterval.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled]); // Remove problematic dependencies to prevent infinite loops

  // Clean up old notifications (older than 7 days)
  useEffect(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    setNotifications(prev => 
      prev.filter(notif => new Date(notif.timestamp) > weekAgo)
    );
  }, []);

  return {
    // State
    notifications,
    unreadCount,
    isEnabled,
    
    // Actions
    createNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    requestPermission,
    
    // Utilities
    checkPermission,
    getNotificationsByType,
    getUnreadNotifications,
    checkDueDateReminders,
    showCompletionAchievement,
    checkProductivityStreak,
  };
};


