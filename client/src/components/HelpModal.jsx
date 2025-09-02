import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Command, ArrowUp, ArrowDown, ArrowRight, Keyboard } from 'lucide-react'
import { useAnimation } from '../contexts/AnimationContext'

const HelpModal = ({ isOpen, onClose }) => {
  const { reducedMotion } = useAnimation()

  const shortcuts = [
    { key: '⌘K', description: 'Open Command Palette' },
    { key: '⌘T', description: 'Toggle Theme' },
    { key: '⌘M', description: 'Voice Commands' },
    { key: '⌘N', description: 'Create New Task' },
    { key: '⌘F', description: 'Search Tags' },
    { key: '⌘G', description: 'Create New Tag' },
    { key: '⌘E', description: 'Export Data' },
    { key: '⌘,', description: 'Open Settings' },
    { key: '⌘?', description: 'Show Help' },
    { key: 'ESC', description: 'Close modals' }
  ]

  const navigation = [
    { key: '↑↓', description: 'Navigate through options' },
    { key: 'Enter', description: 'Select option' },
    { key: 'ESC', description: 'Cancel or close' }
  ]

  const modalVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: reducedMotion ? 0.1 : 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: reducedMotion ? 0.1 : 0.15 }
    }
  }

  const contentVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20 
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: reducedMotion ? 0.1 : 0.3
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { duration: reducedMotion ? 0.1 : 0.2 }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl bg-surface rounded-card shadow-2xl border border-border"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Keyboard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text-primary font-heading">Keyboard Shortcuts</h2>
                  <p className="text-sm text-text-muted">Master StudyMate with these shortcuts</p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Keyboard Shortcuts */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary font-heading mb-4 flex items-center space-x-2">
                  <Command className="w-5 h-5" />
                  <span>Keyboard Shortcuts</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shortcuts.map((shortcut, index) => (
                    <motion.div
                      key={shortcut.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg"
                    >
                      <span className="text-sm text-text-secondary">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-surface rounded border border-border text-xs font-mono text-text-primary">
                        {shortcut.key}
                      </kbd>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary font-heading mb-4 flex items-center space-x-2">
                  <ArrowUp className="w-5 h-5" />
                  <span>Navigation</span>
                </h3>
                <div className="space-y-3">
                  {navigation.map((nav, index) => (
                    <motion.div
                      key={nav.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index + shortcuts.length) * 0.05 }}
                      className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg"
                    >
                      <span className="text-sm text-text-secondary">{nav.description}</span>
                      <kbd className="px-2 py-1 bg-surface rounded border border-border text-xs font-mono text-text-primary">
                        {nav.key}
                      </kbd>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-primary mb-2">💡 Pro Tips</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Use Command Palette (⌘K) to quickly access any feature</li>
                  <li>• Voice commands work best in quiet environments</li>
                  <li>• Export your data regularly to keep backups</li>
                  <li>• Tags help organize and find tasks quickly</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-surface-elevated">
              <div className="flex items-center justify-between text-sm text-text-muted">
                <span>Press ESC to close</span>
                <span>StudyMate v1.0.0</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default HelpModal














