import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Award, 
  BarChart3, 
  PieChart, 
  Activity,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useNotifications } from '../hooks/useNotifications';
import StatsCard from '../components/StatsCard';

const Analytics = () => {
  const {
    stats,
    productivityStreak,
    weeklyProductivity,
    monthlyProductivity,
    subjectPerformance,
    priorityPerformance,
    timeAnalytics,
    trends,
    insights,
    timeRange,
    updateTimeRange
  } = useAnalytics();

  const { unreadCount, notifications } = useNotifications();
  const [selectedChart, setSelectedChart] = useState('productivity');
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  // Debug logging
  useEffect(() => {
    console.log('Analytics: Component mounted');
  }, []);

  useEffect(() => {
    console.log('Analytics: Stats updated:', stats);
  }, [stats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'alert':
        return <AlertTriangle className="text-red-500" size={20} />;
      case 'info':
        return <Info className="text-blue-500" size={20} />;
      default:
        return <Info className="text-gray-500" size={20} />;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'alert':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  const getInsightTextColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-700 dark:text-green-300';
      case 'warning':
        return 'text-yellow-700 dark:text-yellow-300';
      case 'alert':
        return 'text-red-700 dark:text-red-300';
      case 'info':
        return 'text-blue-700 dark:text-blue-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your productivity, analyze patterns, and get insights to improve performance.
          </p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => updateTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={Target}
          description="Overall task completion"
          change={trends.weekly?.direction === 'up' ? '↗' : '↘'}
          changeType={trends.weekly?.direction === 'up' ? 'positive' : 'negative'}
        />
        <StatsCard
          title="Productivity Streak"
          value={productivityStreak.current}
          icon={Award}
          description={`Longest: ${productivityStreak.longest} days`}
        />
        <StatsCard
          title="Time Logged This Week"
          value={`${Math.round(timeAnalytics.weekly.totalTime / 60)}h`}
          icon={Clock}
          description={`Avg: ${Math.round(timeAnalytics.weekly.averageDailyTime / 60)}h/day`}
        />
        <StatsCard
          title="Active Notifications"
          value={unreadCount}
          icon={Activity}
          description="Unread notifications"
        />
      </motion.div>

      {/* Productivity Streak Visualization */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Productivity Streak
        </h3>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {productivityStreak.current}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {productivityStreak.longest}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</div>
          </div>
          <div className="flex-1">
            <div className="flex space-x-1">
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (29 - i));
                const dateStr = date.toISOString().split('T')[0];
                const hasTask = productivityStreak.dates.includes(dateStr);
                
                return (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm ${
                      hasTask 
                        ? 'bg-green-500' 
                        : i === 29 
                          ? 'bg-blue-500' 
                          : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    title={`${date.toLocaleDateString()}: ${hasTask ? 'Task completed' : 'No tasks'}`}
                  />
                );
              })}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Last 30 days • Green = completed • Blue = today
            </div>
          </div>
        </div>
      </motion.div>

      {/* Weekly Productivity Chart */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Productivity
        </h3>
        <div className="space-y-4">
          {timeAnalytics.daily.map((day, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm font-medium text-gray-600 dark:text-gray-400">
                {day.day}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {day.completedTasks}/{day.totalTasks} tasks
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {Math.round(day.timeLogged / 60)}h
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${day.productivity}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Subject Performance */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Subject Performance
        </h3>
        <div className="space-y-4">
          {subjectPerformance.map((subject, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {subject.subject}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {subject.completedTasks}/{subject.totalTasks} tasks completed
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(subject.completionRate)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(subject.averageTime / 60)}h avg
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Priority Performance */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Priority Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priorityPerformance.map((priority, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`text-2xl font-bold ${
                priority.priority === 'HIGH' ? 'text-red-600 dark:text-red-400' :
                priority.priority === 'MEDIUM' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-green-600 dark:text-green-400'
              }`}>
                {Math.round(priority.completionRate)}%
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {priority.priority} Priority
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {priority.completedTasks}/{priority.totalTasks} completed
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trends */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Trends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trends.weekly && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar size={20} className="text-blue-500" />
                <span className="font-medium text-gray-900 dark:text-white">Weekly Trend</span>
              </div>
              <div className={`text-2xl font-bold ${
                trends.weekly.direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {trends.weekly.direction === 'up' ? '↗' : '↘'} {Math.round(trends.weekly.percentage)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {trends.weekly.direction === 'up' ? 'Improvement' : 'Decline'} from last week
              </div>
            </div>
          )}
          
          {trends.monthly && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 size={20} className="text-green-500" />
                <span className="font-medium text-gray-900 dark:text-white">Monthly Trend</span>
              </div>
              <div className={`text-2xl font-bold ${
                trends.monthly.direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {trends.monthly.direction === 'up' ? '↗' : '↘'} {Math.round(trends.monthly.percentage)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {trends.monthly.direction === 'up' ? 'Improvement' : 'Decline'} from last month
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Lightbulb className="text-yellow-500" size={20} />
          <span>Insights & Recommendations</span>
        </h3>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h4 className={`font-medium ${getInsightTextColor(insight.type)}`}>
                    {insight.title}
                  </h4>
                  <p className={`text-sm mt-1 ${getInsightTextColor(insight.type)}`}>
                    {insight.message}
                  </p>
                  <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                    💡 {insight.suggestion}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {insights.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Lightbulb size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No insights available yet. Keep working on tasks to get personalized recommendations!</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;


