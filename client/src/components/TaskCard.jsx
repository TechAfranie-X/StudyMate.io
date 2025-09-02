import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  GripVertical,
  Calendar,
  Tag,
  MoreVertical
} from 'lucide-react'

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onComplete,
  isDemo = false,
  className = ''
}) => {
  const [showActions, setShowActions] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  // Safety check for task object
  if (!task || typeof task !== 'object') {
    return (
      <div className="task-card priority-low p-4 text-center text-text-secondary">
        Invalid task data
      </div>
    )
  }

  const getPriorityColor = (priority) => {
    if (!priority) return 'priority-low'
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return 'priority-high'
      case 'MEDIUM':
        return 'priority-medium'
      case 'LOW':
        return 'priority-low'
      default:
        return 'priority-low'
    }
  }

  const getStatusBadge = (status) => {
    if (!status) return { class: 'pending', text: 'Pending', icon: AlertCircle }
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return { class: 'completed', text: 'Completed', icon: CheckCircle }
      case 'IN_PROGRESS':
        return { class: 'in-progress', text: 'In Progress', icon: Clock }
      case 'PENDING':
        return { class: 'pending', text: 'Pending', icon: CheckCircle }
      default:
        return { class: 'pending', text: 'Pending', icon: AlertCircle }
    }
  }

  const getPriorityText = (priority) => {
    if (!priority) return 'Low Priority'
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return 'High Priority'
      case 'MEDIUM':
        return 'Medium Priority'
      case 'LOW':
        return 'Low Priority'
      default:
        return 'Low Priority'
    }
  }

  const handleComplete = async () => {
    if (onComplete && task.id) {
      setIsCompleting(true)
      await onComplete(task.id)
      setIsCompleting(false)
    }
  }

  const statusInfo = getStatusBadge(task.status)
  const StatusIcon = statusInfo.icon

  return (
    <motion.div
      className={`task-card ${getPriorityColor(task.priority)} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      layout
    >
      {/* Drag Handle */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <GripVertical className="w-4 h-4 text-text-muted cursor-grab" />
      </div>

      <div className="p-4 pl-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-text-primary mb-1 line-clamp-2">
              {task.title || 'Untitled Task'}
            </h3>
            {task.description && (
              <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                {task.description}
              </p>
            )}
          </div>
          
          {/* Status Badge */}
          <div className="flex-shrink-0 ml-3">
            <span className={`status-badge ${statusInfo.class}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Task Details */}
        <div className="space-y-2 mb-4">
          {/* Subject */}
          {task.subject && (
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Tag className="w-4 h-4" />
              <span>{task.subject}</span>
            </div>
          )}
          
          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Calendar className="w-4 h-4" />
              <span>
                Due: {(() => {
                  try {
                    return new Date(task.dueDate).toLocaleDateString()
                  } catch (error) {
                    return 'Invalid date'
                  }
                })()}
              </span>
            </div>
          )}
          
          {/* Estimated Time */}
          {task.estimatedTime && typeof task.estimatedTime === 'number' && (
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Clock className="w-4 h-4" />
              <span>{task.estimatedTime} minutes</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {task.tags && Array.isArray(task.tags) && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-surface-elevated text-text-secondary rounded-full border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Priority Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-text-muted">
              {getPriorityText(task.priority)}
            </span>
          </div>
          
          {/* Demo Badge */}
          {isDemo && (
            <span className="text-xs bg-primary-20 text-primary px-2 py-1 rounded-full">
              Demo
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <AnimatePresence>
          {showActions && !isDemo && (
            <motion.div
              className="absolute inset-0 bg-surface/95 backdrop-blur-sm rounded-md flex items-center justify-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {onEdit && task.id && (
                <motion.button
                  onClick={() => onEdit(task)}
                  className="p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Edit Task"
                >
                  <Edit3 className="w-4 h-4" />
                </motion.button>
              )}
              
              {onComplete && task.status && task.status !== 'COMPLETED' && (
                <motion.button
                  onClick={handleComplete}
                  className="p-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Mark Complete"
                  disabled={isCompleting}
                >
                  <CheckCircle className="w-4 h-4" />
                </motion.button>
              )}
              
              {onDelete && task.id && (
                <motion.button
                  onClick={() => onDelete(task.id)}
                  className="p-2 bg-error text-white rounded-lg hover:bg-error/90 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Animation Overlay */}
        {isCompleting && (
          <motion.div
            className="absolute inset-0 bg-accent/20 rounded-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <CheckCircle className="w-8 h-8 text-accent" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default TaskCard
