import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  LineChart,
  Download,
  Mic,
  Command,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAnimation } from '../contexts/AnimationContext'
import PremiumThemeSwitcher from '../components/PremiumThemeSwitcher'
import CommandPalette from '../components/CommandPalette'
import VoiceCommand from '../components/VoiceCommand'
import PremiumDataVisualization from '../components/PremiumDataVisualization'
import PremiumLoading from '../components/PremiumLoading'

const PremiumDemo = () => {
  const { reducedMotion, getAnimationVariants, pageVariants, pageTransition } = useAnimation()
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showVoiceCommand, setShowVoiceCommand] = useState(false)
  const [currentChart, setCurrentChart] = useState('bar')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingType, setLoadingType] = useState('spinner')
  const [showHighContrast, setShowHighContrast] = useState(false)

  // Sample data for visualization
  const sampleData = [
    { category: 'Tasks', value: 24, color: '#6366f1', series: 'Completed' },
    { category: 'Hours', value: 8, color: '#10b981', series: 'Studied' },
    { category: 'Goals', value: 12, color: '#f59e0b', series: 'Achieved' },
    { category: 'Projects', value: 5, color: '#ef4444', series: 'Active' },
    { category: 'Notes', value: 18, color: '#8b5cf6', series: 'Created' }
  ]

  const handleCommand = (command) => {
    console.log('Command executed:', command)
    setShowCommandPalette(false)
  }

  const handleVoiceCommand = (command) => {
    console.log('Voice command:', command)
    setShowVoiceCommand(false)
  }

  const demoLoading = (type) => {
    setLoadingType(type)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 3000)
  }

  const features = [
    {
      icon: Sparkles,
      title: 'Advanced Animations',
      description: 'Smooth page transitions, stagger animations, and physics-based effects',
      demo: () => console.log('Animation demo')
    },
    {
      icon: Zap,
      title: 'Smart Interactions',
      description: 'Contextual menus, keyboard shortcuts, and voice commands',
      demo: () => setShowCommandPalette(true)
    },
    {
      icon: TrendingUp,
      title: 'Data Visualization',
      description: 'Interactive charts with zoom, pan, and export capabilities',
      demo: () => setCurrentChart(currentChart === 'bar' ? 'pie' : currentChart === 'pie' ? 'line' : 'bar')
    },
    {
      icon: Eye,
      title: 'Accessibility',
      description: 'High contrast mode, reduced motion, and focus indicators',
      demo: () => setShowHighContrast(!showHighContrast)
    }
  ]

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="min-h-screen bg-surface"
    >
      {/* Header */}
      <motion.header
        className="bg-surface-elevated border-b border-border p-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Premium Features Demo</h1>
                <p className="text-text-secondary">Experience cutting-edge interactions and animations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <PremiumThemeSwitcher />
              
              <motion.button
                onClick={() => setShowVoiceCommand(true)}
                className="p-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Voice Commands (⌘M)"
              >
                <Mic className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                onClick={() => setShowCommandPalette(true)}
                className="p-3 bg-surface border border-border rounded-lg hover:bg-surface-elevated transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Command Palette (⌘K)"
              >
                <Command className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Feature Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-text-primary mb-6">Premium Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  className="bg-surface-elevated rounded-card border border-border p-6 hover:shadow-lg transition-all duration-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-text-primary">{feature.title}</h3>
                  </div>
                  <p className="text-text-secondary text-sm mb-4">{feature.description}</p>
                  <motion.button
                    onClick={feature.demo}
                    className="text-primary hover:text-primary-hover text-sm font-medium"
                    whileHover={{ x: 4 }}
                  >
                    Try it →
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Data Visualization */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Interactive Data Visualization</h2>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setCurrentChart('bar')}
                className={`p-2 rounded-lg transition-colors ${
                  currentChart === 'bar' 
                    ? 'bg-primary text-white' 
                    : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BarChart3 className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setCurrentChart('pie')}
                className={`p-2 rounded-lg transition-colors ${
                  currentChart === 'pie' 
                    ? 'bg-primary text-white' 
                    : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PieChart className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => setCurrentChart('line')}
                className={`p-2 rounded-lg transition-colors ${
                  currentChart === 'line' 
                    ? 'bg-primary text-white' 
                    : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LineChart className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          <PremiumDataVisualization data={sampleData} type={currentChart} />
        </motion.section>

        {/* Loading Demonstrations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-text-primary mb-6">Loading States</h2>
          
          {isLoading ? (
            <PremiumLoading type={loadingType} message="Loading premium features..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.button
                onClick={() => demoLoading('spinner')}
                className="p-6 bg-surface-elevated rounded-card border border-border hover:shadow-lg transition-all"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-text-primary">Spinner Loading</h3>
                  <p className="text-sm text-text-secondary">Classic loading animation</p>
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => demoLoading('progress')}
                className="p-6 bg-surface-elevated rounded-card border border-border hover:shadow-lg transition-all"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-text-primary">Progress Bar</h3>
                  <p className="text-sm text-text-secondary">Animated progress indicator</p>
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => demoLoading('card')}
                className="p-6 bg-surface-elevated rounded-card border border-border hover:shadow-lg transition-all"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Download className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-text-primary">Skeleton Cards</h3>
                  <p className="text-sm text-text-secondary">Content placeholder loading</p>
                </div>
              </motion.button>
            </div>
          )}
        </motion.section>

        {/* Accessibility Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-xl font-semibold text-text-primary mb-6">Accessibility Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-elevated rounded-card border border-border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-text-primary">High Contrast Mode</h3>
              </div>
              <p className="text-text-secondary text-sm mb-4">
                Enhanced visibility for users with visual impairments. Toggle high contrast mode to see the difference.
              </p>
              <motion.button
                onClick={() => setShowHighContrast(!showHighContrast)}
                className="flex items-center space-x-2 text-primary hover:text-primary-hover"
                whileHover={{ x: 4 }}
              >
                <span>{showHighContrast ? 'Disable' : 'Enable'} High Contrast</span>
                {showHighContrast ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </motion.button>
            </div>
            
            <div className="bg-surface-elevated rounded-card border border-border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-text-primary">Reduced Motion</h3>
              </div>
              <p className="text-text-secondary text-sm mb-4">
                Respects user preferences for reduced motion. Animations are automatically adjusted based on system settings.
              </p>
              <div className="text-sm text-text-muted">
                Current: {reducedMotion ? 'Reduced Motion' : 'Full Motion'}
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Modals */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onCommand={handleCommand}
      />

      <VoiceCommand
        onCommand={handleVoiceCommand}
        onClose={() => setShowVoiceCommand(false)}
      />

      {/* High Contrast Overlay */}
      <AnimatePresence>
        {showHighContrast && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%)',
              backgroundSize: '20px 20px'
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default PremiumDemo
















