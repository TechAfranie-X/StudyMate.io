import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTasks } from './useTasks';

export const useAnalytics = () => {
  const { tasks, getTaskStats } = useTasks();
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  // Get basic stats
  const stats = useMemo(() => getTaskStats(), [getTaskStats]);

  // Calculate productivity streak
  const getProductivityStreak = useCallback(() => {
    if (tasks.length === 0) return { current: 0, longest: 0, dates: [] };

    const completedTasks = tasks
      .filter(task => task.status === 'COMPLETED')
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    if (completedTasks.length === 0) return { current: 0, longest: 0, dates: [] };

    const today = new Date();
    const dates = [];
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasTaskOnDate = completedTasks.some(task => {
        const taskDate = new Date(task.updatedAt);
        return taskDate.toDateString() === checkDate.toDateString();
      });

      if (hasTaskOnDate) {
        dates.push(checkDate.toISOString().split('T')[0]);
        if (i === 0) { // Today
          currentStreak = 1;
          tempStreak = 1;
        } else if (i === currentStreak) { // Consecutive days
          currentStreak++;
          tempStreak++;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      current: currentStreak,
      longest: longestStreak,
      dates: dates.sort()
    };
  }, [tasks]);

  // Calculate weekly productivity
  const getWeeklyProductivity = useCallback(() => {
    if (tasks.length === 0) {
      // Return fallback data for new users
      return [
        {
          week: new Date().toISOString().split('T')[0],
          startDate: new Date(),
          endDate: new Date(),
          totalTasks: 3,
          completedTasks: 1,
          completionRate: 33,
          totalTime: 135,
          completedTime: 60,
          productivity: 33
        }
      ];
    }

    const weeks = [];
    const today = new Date();
    
    // Get last 12 weeks
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (today.getDay() + i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekTasks = tasks.filter(task => {
        const taskDate = new Date(task.updatedAt);
        return taskDate >= weekStart && taskDate <= weekEnd;
      });

      const completedTasks = weekTasks.filter(task => task.status === 'COMPLETED');
      const totalTime = weekTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
      const completedTime = completedTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);

      weeks.push({
        week: weekStart.toISOString().split('T')[0],
        startDate: weekStart,
        endDate: weekEnd,
        totalTasks: weekTasks.length,
        completedTasks: completedTasks.length,
        completionRate: weekTasks.length > 0 ? (completedTasks.length / weekTasks.length) * 100 : 0,
        totalTime,
        completedTime,
        productivity: weekTasks.length > 0 ? (completedTasks.length / weekTasks.length) * 100 : 0
      });
    }

    return weeks;
  }, [tasks]);

  // Calculate monthly productivity
  const getMonthlyProductivity = useCallback(() => {
    const months = [];
    const today = new Date();
    
    // Get last 12 months
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

      const monthTasks = tasks.filter(task => {
        const taskDate = new Date(task.updatedAt);
        return taskDate >= monthStart && taskDate <= monthEnd;
      });

      const completedTasks = monthTasks.filter(task => task.status === 'COMPLETED');
      const totalTime = monthTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
      const completedTime = completedTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);

      months.push({
        month: monthStart.toISOString().slice(0, 7),
        startDate: monthStart,
        endDate: monthEnd,
        totalTasks: monthTasks.length,
        completedTasks: completedTasks.length,
        completionRate: monthTasks.length > 0 ? (completedTasks.length / monthTasks.length) * 100 : 0,
        totalTime,
        completedTime,
        productivity: monthTasks.length > 0 ? (completedTasks.length / monthTasks.length) * 100 : 0
      });
    }

    return months;
  }, [tasks]);

  // Calculate subject performance
  const getSubjectPerformance = useCallback(() => {
    const subjects = stats.subjects || [];
    
    return subjects.map(subject => {
      const subjectTasks = tasks.filter(task => task.subject === subject.subject);
      const completedTasks = subjectTasks.filter(task => task.status === 'COMPLETED');
      const totalTime = subjectTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
      const completedTime = completedTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);

      return {
        ...subject,
        completionRate: subjectTasks.length > 0 ? (completedTasks.length / subjectTasks.length) * 100 : 0,
        totalTime,
        completedTime,
        averageTime: subjectTasks.length > 0 ? totalTime / subjectTasks.length : 0,
        productivity: subjectTasks.length > 0 ? (completedTasks.length / subjectTasks.length) * 100 : 0
      };
    }).sort((a, b) => b.productivity - a.productivity);
  }, [tasks, stats.subjects]);

  // Calculate priority performance
  const getPriorityPerformance = useCallback(() => {
    const priorities = ['HIGH', 'MEDIUM', 'LOW'];
    
    return priorities.map(priority => {
      const priorityTasks = tasks.filter(task => task.priority === priority);
      const completedTasks = priorityTasks.filter(task => task.status === 'COMPLETED');
      const totalTime = priorityTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
      const completedTime = completedTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);

      return {
        priority,
        totalTasks: priorityTasks.length,
        completedTasks: completedTasks.length,
        completionRate: priorityTasks.length > 0 ? (completedTasks.length / priorityTasks.length) * 100 : 0,
        totalTime,
        completedTime,
        averageTime: priorityTasks.length > 0 ? totalTime / priorityTasks.length : 0,
        productivity: priorityTasks.length > 0 ? (completedTasks.length / priorityTasks.length) * 100 : 0
      };
    });
  }, [tasks]);

  // Calculate time tracking analytics
  const getTimeAnalytics = useCallback(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekTasks = tasks.filter(task => {
      const taskDate = new Date(task.updatedAt);
      return taskDate >= weekStart && taskDate <= weekEnd;
    });

    const completedWeekTasks = weekTasks.filter(task => task.status === 'COMPLETED');
    
    const dailyTime = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(weekStart);
      dayStart.setDate(weekStart.getDate() + i);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      dayEnd.setHours(0, 0, 0, 0);

      const dayTasks = weekTasks.filter(task => {
        const taskDate = new Date(task.updatedAt);
        return taskDate >= dayStart && taskDate < dayEnd;
      });

      const completedDayTasks = dayTasks.filter(task => task.status === 'COMPLETED');
      const dayTime = completedDayTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);

      dailyTime.push({
        day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dayStart.toISOString().split('T')[0],
        totalTasks: dayTasks.length,
        completedTasks: completedDayTasks.length,
        timeLogged: dayTime,
        productivity: dayTasks.length > 0 ? (completedDayTasks.length / dayTasks.length) * 100 : 0
      });
    }

    return {
      daily: dailyTime,
      weekly: {
        totalTime: completedWeekTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0),
        averageDailyTime: completedWeekTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0) / 7,
        totalTasks: weekTasks.length,
        completedTasks: completedWeekTasks.length
      }
    };
  }, [tasks]);

  // Calculate trends
  const getTrends = useCallback(() => {
    const weeklyData = getWeeklyProductivity();
    const monthlyData = getMonthlyProductivity();

    // Weekly trend
    const weeklyTrend = weeklyData.length >= 2 ? {
      direction: weeklyData[weeklyData.length - 1].productivity > weeklyData[weeklyData.length - 2].productivity ? 'up' : 'down',
      change: Math.abs(weeklyData[weeklyData.length - 1].productivity - weeklyData[weeklyData.length - 2].productivity),
      percentage: weeklyData[weeklyData.length - 2].productivity > 0 
        ? ((weeklyData[weeklyData.length - 1].productivity - weeklyData[weeklyData.length - 2].productivity) / weeklyData[weeklyData.length - 2].productivity) * 100
        : 0
    } : null;

    // Monthly trend
    const monthlyTrend = monthlyData.length >= 2 ? {
      direction: monthlyData[monthlyData.length - 1].productivity > monthlyData[monthlyData.length - 2].productivity ? 'up' : 'down',
      change: Math.abs(monthlyData[monthlyData.length - 1].productivity - monthlyData[monthlyData.length - 2].productivity),
      percentage: monthlyData[monthlyData.length - 2].productivity > 0
        ? ((monthlyData[monthlyData.length - 1].productivity - monthlyData[monthlyData.length - 2].productivity) / monthlyData[monthlyData.length - 2].productivity) * 100
        : 0
    } : null;

    return {
      weekly: weeklyTrend,
      monthly: monthlyTrend
    };
  }, [getWeeklyProductivity, getMonthlyProductivity]);

  // Get insights
  const getInsights = useCallback(() => {
    const insights = [];
    
    // Completion rate insight
    if (stats.completionRate < 50) {
      insights.push({
        type: 'warning',
        title: 'Low Completion Rate',
        message: `Your completion rate is ${stats.completionRate}%. Try breaking down larger tasks into smaller, manageable pieces.`,
        suggestion: 'Consider using the Pomodoro technique or setting smaller milestones.'
      });
    } else if (stats.completionRate > 80) {
      insights.push({
        type: 'success',
        title: 'Excellent Progress!',
        message: `Your completion rate is ${stats.completionRate}%. You're doing amazing!`,
        suggestion: 'Keep up the great work and consider helping others with their tasks.'
      });
    }

    // Overdue tasks insight
    if (stats.dueDate.overdue > 0) {
      insights.push({
        type: 'alert',
        title: 'Overdue Tasks',
        message: `You have ${stats.dueDate.overdue} overdue tasks.`,
        suggestion: 'Review and prioritize these tasks. Consider if any deadlines need adjustment.'
      });
    }

    // Priority balance insight
    const highPriorityCount = stats.priority.high;
    const totalTasks = stats.total;
    if (highPriorityCount > totalTasks * 0.4) {
      insights.push({
        type: 'info',
        title: 'High Priority Overload',
        message: `${highPriorityCount} out of ${totalTasks} tasks are marked as high priority.`,
        suggestion: 'Consider if all tasks truly need high priority. This can help reduce stress and improve focus.'
      });
    }

    // Time management insight
    const timeEfficiency = stats.time.completed / stats.time.estimated;
    if (timeEfficiency < 0.7 && stats.time.estimated > 0) {
      insights.push({
        type: 'info',
        title: 'Time Estimation',
        message: 'You\'re completing tasks faster than estimated.',
        suggestion: 'Great job! Consider adjusting your time estimates to be more realistic.'
      });
    } else if (timeEfficiency > 1.3 && stats.time.estimated > 0) {
      insights.push({
        type: 'warning',
        title: 'Time Management',
        message: 'Tasks are taking longer than estimated.',
        suggestion: 'Consider breaking down complex tasks or adding buffer time to your estimates.'
      });
    }

    return insights;
  }, [stats]);

  // Update time range
  const updateTimeRange = useCallback((range) => {
    setTimeRange(range);
  }, []);

  // Update selected subject
  const updateSelectedSubject = useCallback((subject) => {
    setSelectedSubject(subject);
  }, []);

  return {
    // State
    timeRange,
    selectedSubject,
    
    // Basic stats
    stats,
    
    // Analytics
    productivityStreak: getProductivityStreak(),
    weeklyProductivity: getWeeklyProductivity(),
    monthlyProductivity: getMonthlyProductivity(),
    subjectPerformance: getSubjectPerformance(),
    priorityPerformance: getPriorityPerformance(),
    timeAnalytics: getTimeAnalytics(),
    trends: getTrends(),
    insights: getInsights(),
    
    // Actions
    updateTimeRange,
    updateSelectedSubject,
  };
};


