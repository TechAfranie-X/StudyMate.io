import { motion } from 'framer-motion'
import { 
  ClipboardList, 
  CheckCircle, 
  Search, 
  FolderOpen,
  Plus,
  Smile
} from 'lucide-react'

const EmptyState = ({ 
  title = "No items found",
  description = "Get started by creating your first item",
  icon: Icon = ClipboardList,
  action,
  actionText = "Create New",
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: { icon: ClipboardList, color: 'text-text-muted' },
    success: { icon: CheckCircle, color: 'text-green-500' },
    search: { icon: Search, color: 'text-text-muted' },
    folder: { icon: FolderOpen, color: 'text-text-muted' },
    create: { icon: Plus, color: 'text-primary' },
    happy: { icon: Smile, color: 'text-accent' }
  }

  const selectedVariant = variants[variant] || variants.default
  const IconComponent = Icon || selectedVariant.icon

  return (
    <motion.div
      className={`text-center py-12 px-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      <motion.div
        className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-elevated mb-6 ${selectedVariant.color}`}
        animate={{ 
          y: [0, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <IconComponent className="w-8 h-8" />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-text-primary mb-2 font-heading">
          {title}
        </h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          {description}
        </p>

        {/* Action Button */}
        {action && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={action}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <Plus className="w-4 h-4 mr-2" />
              {actionText}
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default EmptyState

















