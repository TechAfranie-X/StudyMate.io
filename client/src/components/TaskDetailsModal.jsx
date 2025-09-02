  import { motion, AnimatePresence } from 'framer-motion'

const TaskDetailsModal = ({ isOpen, onClose, task }) => {
  if (!task) return null

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-accent/10 text-accent border-accent/20'
      case 'in-progress': return 'bg-primary/10 text-primary border-primary/20'
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW': return 'bg-accent/10 text-accent border-accent/20'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid date'
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch (err) {
      return 'Invalid date'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-surface rounded-card shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-surface-elevated">
              <div className="flex items-center justify-between">
                <h2 className="text-h2 font-heading text-text-primary">Task Details</h2>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-elevated rounded-full transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Task Title */}
              <div>
                <h3 className="text-h3 font-heading text-text-primary mb-3">
                  {task.title || 'Untitled Task'}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-small font-medium border ${getStatusColor(task.status)}`}>
                    <span className="capitalize">{task.status?.replace('-', ' ') || 'pending'}</span>
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-small font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority || 'MEDIUM'}
                  </span>
                </div>
              </div>

              {/* Task Description */}
              {task.description && (
                <div>
                  <h4 className="text-small font-medium text-text-secondary mb-3 font-heading">Description</h4>
                  <p className="text-text-primary font-body leading-relaxed bg-surface-elevated rounded-card p-4">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Task Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-small font-medium text-text-secondary font-heading">Due Date</h4>
                  <div className="flex items-center space-x-2 text-text-primary font-body">
                    <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                </div>

                {task.estimatedTime && (
                  <div className="space-y-2">
                    <h4 className="text-small font-medium text-text-secondary font-heading">Estimated Time</h4>
                    <div className="flex items-center space-x-2 text-text-primary font-body">
                      <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{task.estimatedTime} minutes</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-small font-medium text-text-secondary font-heading">Created</h4>
                  <div className="flex items-center space-x-2 text-text-primary font-body">
                    <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatDate(task.createdAt)}</span>
                  </div>
                </div>

                {task.updatedAt && (
                  <div className="space-y-2">
                    <h4 className="text-small font-medium text-text-secondary font-heading">Last Updated</h4>
                    <div className="flex items-center space-x-2 text-text-primary font-body">
                      <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>{formatDate(task.updatedAt)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Task ID */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-small text-text-muted font-body">
                  <span>Task ID: {task.id ? String(task.id).slice(-8) : 'N/A'}</span>
                  <span className="text-xs bg-surface-elevated px-2 py-1 rounded">
                    {task.status === 'completed' ? '✅ Completed' : 
                     task.status === 'in-progress' ? '🔄 In Progress' : 
                     '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border bg-surface-elevated">
              <div className="flex justify-end">
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-text-secondary hover:text-text-primary font-medium transition-all duration-200"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TaskDetailsModal
