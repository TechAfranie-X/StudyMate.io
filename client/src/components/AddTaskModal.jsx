import { useState } from 'react'
import { createTask } from '../utils/api'
import { motion } from 'framer-motion'
import Input from './ui/Input'
import Button from './ui/Button'

const AddTaskModal = ({ isOpen, onClose, onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    dueDate: '',
    priority: 'MEDIUM',
    status: 'pending'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await createTask({
        title: formData.title,
        description: formData.subject, // Using subject as description
        dueDate: formData.dueDate || null,
        priority: formData.priority,
        status: formData.status
      })

      if (response.success) {
        // Reset form
        setFormData({
          title: '',
          subject: '',
          dueDate: '',
          priority: 'MEDIUM',
          status: 'pending'
        })
        
        // Close modal and refresh tasks
        onClose()
        onTaskAdded()
      } else {
        setError(response.message || 'Failed to create task')
      }
    } catch (err) {
      console.error('Error creating task:', err)
      setError('Failed to create task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        title: '',
        subject: '',
        dueDate: '',
        priority: 'MEDIUM',
        status: 'pending'
      })
      setError('')
      onClose()
    }
  }

  // Get minimum date for date picker (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl border border-border transition-all duration-300 ease-in-out"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white font-heading">
                Add New Task
              </h3>
              <button
                onClick={handleClose}
                disabled={loading}
                className="rounded-full p-1 text-white hover:bg-white/20 transition-colors duration-200 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-red-800 font-medium">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Title Field */}
            <div className="mb-4">
              <Input
                label="Title *"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter task title"
                disabled={loading}
                error={error && !formData.title.trim() ? 'Title is required' : ''}
              />
            </div>

            {/* Subject Field */}
            <div className="mb-4">
                              <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2 font-body">
                Description
              </label>
              <textarea
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200 bg-white resize-none"
                placeholder="Enter task description (optional)"
                disabled={loading}
              />
            </div>

            {/* Due Date Field */}
            <div className="mb-4">
                              <label htmlFor="dueDate" className="block text-sm font-medium text-text-primary mb-2 font-body">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                min={getMinDate()}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200 bg-white"
                disabled={loading}
              />
            </div>

            {/* Priority Field */}
            <div className="mb-4">
                              <label htmlFor="priority" className="block text-sm font-medium text-text-primary mb-2 font-body">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200 bg-white"
                disabled={loading}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Status Field */}
            <div className="mb-6">
                              <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-2 font-body">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200 bg-white"
                disabled={loading}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={!formData.title.trim()}
                className="flex-1"
              >
                Create Task
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AddTaskModal

