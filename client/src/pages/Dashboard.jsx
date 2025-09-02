import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, TrendingUp, Plus, AlertCircle, Target, BookOpen, Calendar, Star } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import ServerStatus from '../components/ServerStatus';
import EmptyStateCard from '../components/EmptyStateCard';
import { useTasks } from '../hooks/useTasks';

const Dashboard = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const { 
    tasks, 
    loading, 
    error, 
    createTask, 
    updateTask, 
    deleteTask, 
    getTaskStats 
  } = useTasks();

  // Debug logging
  useEffect(() => {
    console.log('Dashboard: Component mounted');
  }, []);

  useEffect(() => {
    console.log('Dashboard: Tasks updated:', tasks.length);
  }, [tasks]);

  useEffect(() => {
    console.log('Dashboard: Loading state:', loading);
  }, [loading]);

  // Sample data for new users
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
      createdAt: new Date().toISOString()
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
      createdAt: new Date().toISOString()
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
      createdAt: new Date().toISOString()
    }
  ];

  // Check if user has any real tasks
  const hasRealTasks = tasks.length > 0;
  const displayTasks = hasRealTasks ? tasks : sampleTasks;

  useEffect(() => {
    // Hide welcome message after 5 seconds or when user has real tasks
    if (hasRealTasks) {
      setShowWelcome(false);
    } else {
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [hasRealTasks]);

  const handleCreateTask = async (taskData) => {
    const result = await createTask(taskData);
    if (result.success) {
      setShowTaskForm(false);
      setShowWelcome(false); // Hide welcome when user creates a real task
    }
  };

  const handleEditTask = async (taskData) => {
    const result = await updateTask(editingTask.id, taskData);
    if (result.success) {
      setEditingTask(null);
      setShowTaskForm(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const closeTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  // Get task statistics
  const stats = getTaskStats();
  
  const highPriorityTasks = displayTasks.filter(task => task && task.priority === 'HIGH').length;
  const totalEstimatedTime = displayTasks.reduce((sum, task) => sum + (task && task.estimatedTime ? task.estimatedTime : 0), 0);
  const completedTime = displayTasks
    .filter(task => task && task.status === 'COMPLETED')
    .reduce((sum, task) => sum + (task && task.estimatedTime ? task.estimatedTime : 0), 0);

  const recentTasks = displayTasks
    .filter(task => task && typeof task === 'object') // Filter out invalid tasks
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full space-y-6">
      {/* Welcome Message for New Users */}
      {showWelcome && !hasRealTasks && (
        <div className="bg-gradient-to-r from-primary-10 to-accent-10 border border-primary-20 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary-20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Welcome to StudyMate! 🎉
              </h3>
              <p className="text-text-secondary mb-4">
                Get started by creating your first task or explore the sample tasks below to see how StudyMate works.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn btn-primary"
                >
                  Create First Task
                </button>
                <button
                  onClick={() => setShowWelcome(false)}
                  className="btn btn-secondary"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1 text-text-primary">
            Dashboard
          </h1>
          <p className="text-text-secondary mt-2">
            {hasRealTasks 
              ? "Welcome back! Here's an overview of your tasks."
              : "Welcome! Here's what you can do with StudyMate."
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ServerStatus />
          <button
            onClick={() => setShowTaskForm(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-error-10 border border-error-20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-error" size={20} />
            <span className="text-error">{error}</span>
          </div>
          <p className="text-error text-sm mt-2">
            Don't worry! You can still use the sample tasks below to explore StudyMate.
          </p>
        </div>
      )}

      {/* Connection Status */}
      {!hasRealTasks && (
        <div className="bg-warning-10 border border-warning-20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-warning" size={20} />
            <span className="text-warning font-medium">
              Demo Mode
            </span>
          </div>
          <p className="text-warning text-sm mt-2">
            {error 
              ? "Unable to connect to the server. Showing sample data instead."
              : "No tasks found. Showing sample data to help you get started."
            }
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={stats.total || displayTasks.length}
          icon={Target}
          description="All your tasks"
          variant="primary"
          progress={stats.total || displayTasks.length}
          maxValue={Math.max(stats.total || displayTasks.length, 1)}
        />
        <StatsCard
          title="Completed"
          value={stats.completed || displayTasks.filter(t => t.status === 'COMPLETED').length}
          icon={CheckSquare}
          description={`${stats.completionRate || 0}% completion rate`}
          change={`${stats.completionRate || 0}%`}
          changeType="positive"
          variant="success"
          progress={stats.completed || displayTasks.filter(t => t.status === 'COMPLETED').length}
          maxValue={Math.max(stats.total || displayTasks.length, 1)}
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress || displayTasks.filter(t => t.status === 'IN_PROGRESS').length}
          icon={TrendingUp}
          description="Currently working on"
          variant="accent"
          progress={stats.inProgress || displayTasks.filter(t => t.status === 'IN_PROGRESS').length}
          maxValue={Math.max(stats.total || displayTasks.length, 1)}
        />
        <StatsCard
          title="Pending"
          value={stats.pending || displayTasks.filter(t => t.status === 'PENDING').length}
          icon={Clock}
          description="Awaiting action"
          variant="warning"
          progress={stats.pending || displayTasks.filter(t => t.status === 'PENDING').length}
          maxValue={Math.max(stats.total || displayTasks.length, 1)}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card card-glass">
          <div className="card-header">
            <h3 className="h3 text-text-primary">
              Priority Overview
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg">
                <span className="text-text-secondary">High Priority</span>
                <span className="text-error font-semibold text-lg">
                  {highPriorityTasks}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg">
                <span className="text-text-secondary">Total Time</span>
                <span className="text-primary font-semibold text-lg">
                  {Math.round(totalEstimatedTime / 60)}h {totalEstimatedTime % 60}m
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg">
                <span className="text-text-secondary">Completed Time</span>
                <span className="text-accent font-semibold text-lg">
                  {Math.round(completedTime / 60)}h {completedTime % 60}m
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card card-glass">
          <div className="card-header">
            <h3 className="h3 text-text-primary">
              Quick Actions
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <button
                onClick={() => setShowTaskForm(true)}
                className="w-full btn btn-primary text-left justify-start"
              >
                + Create New Task
              </button>
              <button
                onClick={() => window.location.href = '/tasks'}
                className="w-full btn btn-accent text-left justify-start"
              >
                View All Tasks
              </button>
              {!hasRealTasks && (
                <button
                  onClick={() => window.location.href = '/analytics'}
                  className="w-full btn btn-secondary text-left justify-start"
                >
                  Explore Analytics
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card card-elevated">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="h3 text-text-primary">
              {hasRealTasks ? 'Recent Tasks' : 'Sample Tasks'}
            </h3>
            {!hasRealTasks && (
              <span className="text-sm text-text-muted bg-surface-elevated px-2 py-1 rounded-full">
                Demo Data
              </span>
            )}
          </div>
        </div>
        <div className="card-body">
          {recentTasks.length > 0 ? (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={hasRealTasks ? openEditForm : undefined}
                  onDelete={hasRealTasks ? handleDeleteTask : undefined}
                  onComplete={hasRealTasks ? (taskId) => {
                    // Handle task completion
                    console.log('Task completed:', taskId)
                  } : undefined}
                  isDemo={!hasRealTasks}
                />
              ))}
            </div>
          ) : (
            <EmptyStateCard
              title="No tasks yet"
              description="Get started by creating your first task to organize your study schedule"
              illustration="tasks"
              primaryAction={{
                text: "Create Your First Task",
                onClick: () => setShowTaskForm(true)
              }}
              secondaryAction={{
                text: "Learn More",
                onClick: () => window.location.href = '/help'
              }}
            />
          )}
        </div>
      </div>

      {/* Getting Started Guide for New Users */}
      {!hasRealTasks && (
        <div className="card card-glass bg-gradient-to-r from-accent-10 to-accent-20 border-accent-20">
          <div className="card-header">
            <h3 className="h3 text-text-primary">
              Getting Started with StudyMate
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                className="text-center group"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-16 h-16 bg-accent-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Plus className="w-8 h-8 text-accent" />
                </div>
                <h4 className="font-medium text-text-primary mb-2">Create Tasks</h4>
                <p className="text-sm text-text-secondary">
                  Add tasks with titles, descriptions, due dates, and priorities
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center group"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <div className="w-16 h-16 bg-accent-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Calendar className="w-8 h-8 text-accent" />
                </div>
                <h4 className="font-medium text-text-primary mb-2">Organize</h4>
                <p className="text-sm text-text-secondary">
                  Categorize tasks by subject, status, and priority levels
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center group"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-accent-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
                <h4 className="font-medium text-text-primary mb-2">Track Progress</h4>
                <p className="text-sm text-text-secondary">
                  Monitor your productivity with detailed analytics and insights
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleEditTask : handleCreateTask}
          onCancel={closeTaskForm}
          isOpen={showTaskForm}
        />
      )}
    </div>
  );
};

export default Dashboard;

