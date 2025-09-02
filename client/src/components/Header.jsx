import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useAnimation } from '../contexts/AnimationContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Home,
  LayoutDashboard,
  CheckSquare,
  Command,
  Mic,
  Sparkles,
  Terminal
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import CommandPalette from './CommandPalette'
import VoiceCommand from './VoiceCommand'
import HelpModal from './HelpModal'
import ConnectionDiagnostics from './ConnectionDiagnostics'
import HealthMonitor from './HealthMonitor'

const Header = ({ onMenuClick }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { reducedMotion } = useAnimation()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [showVoiceCommand, setShowVoiceCommand] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [profileImage, setProfileImage] = useState(null)
  const headerRef = useRef(null)

  // Breadcrumb mapping
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ name: 'Home', path: '/', icon: Home }]
    
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/')
      const name = segment.charAt(0).toUpperCase() + segment.slice(1)
      
      let icon = null
      if (segment === 'dashboard') icon = LayoutDashboard
      if (segment === 'tasks') icon = CheckSquare
      if (segment === 'settings') icon = Settings
      
      breadcrumbs.push({ name, path, icon })
    })
    
    return breadcrumbs
  }

  const getUserInitials = (email) => {
    if (!email) return 'U'
    return email.charAt(0).toUpperCase()
  }

  const handleLogout = () => {
    logout()
    setUserDropdownOpen(false)
    navigate('/login')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  // Mock notifications
  useEffect(() => {
    setNotifications([
      { id: 1, message: 'Task "Complete project" is due tomorrow', time: '2m ago', read: false },
      { id: 2, message: 'You have 3 pending tasks', time: '1h ago', read: true }
    ])
  }, [])

  // Load profile image from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem('studymate_profile_image')
    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [])

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault()
            setShowCommandPalette(true)
            break
          case 't':
            e.preventDefault()
            toggleTheme()
            break
          case 'm':
            e.preventDefault()
            setShowVoiceCommand(true)
            break
          case 'f':
            e.preventDefault()
            handleCommand({ id: 'search-tags' })
            break
          case 'g':
            e.preventDefault()
            handleCommand({ id: 'create-tag' })
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleTheme])

  const handleCommand = (command) => {
    console.log('🔧 Executing command:', command.id)
    
    switch (command.id) {
      case 'new-task':
        // Navigate to dashboard and open task modal
        navigate('/dashboard')
        // We'll need to trigger the task modal from here
        // For now, just navigate to dashboard
        break
      case 'search-tasks':
        // Focus search input
        setSearchQuery('')
        setIsSearchFocused(true)
        // We'll implement search functionality
        break
      case 'toggle-theme':
        toggleTheme()
        break
      case 'export-data':
        handleExportData()
        break
      case 'settings':
        navigate('/settings')
        break
      case 'search-tags':
        handleSearchTags()
        break
      case 'create-tag':
        handleCreateTag()
        break
      case 'help':
        handleShowHelp()
        break
      default:
        console.warn('Unknown command:', command.id)
    }
  }

  const handleExportData = () => {
    console.log('📊 Exporting data...')
    // Get tasks from localStorage or API
    const tasks = JSON.parse(localStorage.getItem('studymate_tasks') || '[]')
    
    if (tasks.length === 0) {
      alert('No tasks to export')
      return
    }

    // Create CSV content
    const csvContent = [
      ['Title', 'Description', 'Status', 'Priority', 'Due Date', 'Created At'],
      ...tasks.map(task => [
        task.title || '',
        task.description || '',
        task.status || '',
        task.priority || '',
        task.dueDate || '',
        task.createdAt || ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `studymate-tasks-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log('✅ Data exported successfully')
  }

  const handleSearchTags = () => {
    console.log('🏷️ Searching tags...')
    // Get tasks and extract unique tags
    const tasks = JSON.parse(localStorage.getItem('studymate_tasks') || '[]')
    const allTags = new Set()
    
    tasks.forEach(task => {
      if (task.tags && Array.isArray(task.tags)) {
        task.tags.forEach(tag => allTags.add(tag))
      }
    })
    
    const tags = Array.from(allTags)
    
    if (tags.length === 0) {
      alert('No tags found in your tasks')
      return
    }
    
    const tagList = tags.map(tag => `• ${tag}`).join('\n')
    const selectedTag = prompt(`Available tags:\n\n${tagList}\n\nEnter a tag to search for:`)
    
    if (selectedTag && tags.includes(selectedTag)) {
      const filteredTasks = tasks.filter(task => 
        task.tags && task.tags.includes(selectedTag)
      )
      
      if (filteredTasks.length > 0) {
        alert(`Found ${filteredTasks.length} tasks with tag "${selectedTag}":\n\n${
          filteredTasks.map(task => `• ${task.title}`).join('\n')
        }`)
      } else {
        alert(`No tasks found with tag "${selectedTag}"`)
      }
    }
  }

  const handleCreateTag = () => {
    console.log('➕ Creating new tag...')
    const newTag = prompt('Enter the name for your new tag:')
    
    if (newTag && newTag.trim()) {
      // Store the new tag in localStorage
      const existingTags = JSON.parse(localStorage.getItem('studymate_tags') || '[]')
      if (!existingTags.includes(newTag.trim())) {
        existingTags.push(newTag.trim())
        localStorage.setItem('studymate_tags', JSON.stringify(existingTags))
        alert(`Tag "${newTag}" created successfully!`)
      } else {
        alert(`Tag "${newTag}" already exists!`)
      }
    }
  }

  const handleShowHelp = () => {
    console.log('❓ Showing help modal...')
    setShowHelpModal(true)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
    <motion.header
        ref={headerRef}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm"
      style={{
        background: 'rgba(var(--color-surface-rgb), 0.8)',
        backdropFilter: 'blur(20px)',
        transform: reducedMotion ? 'none' : `translateY(${scrollY * 0.1}px)`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button and breadcrumbs */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onMenuClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all duration-200 md:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>

            {/* Breadcrumbs */}
            <nav className="hidden md:flex items-center space-x-2">
              {getBreadcrumbs().map((breadcrumb, index) => {
                const Icon = breadcrumb.icon
                const isLast = index === getBreadcrumbs().length - 1
                
                return (
                  <div key={breadcrumb.path} className="flex items-center">
                    {index > 0 && (
                      <svg className="w-4 h-4 text-text-muted mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => navigate(breadcrumb.path)}
                        className={`
                          flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                          ${isLast 
                            ? 'text-text-primary bg-white/10' 
                            : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                          }
                        `}
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span className="font-medium">{breadcrumb.name}</span>
                      </button>
                    </motion.div>
                  </div>
                )
              })}
            </nav>
          </div>

          {/* Center - Search bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <motion.div
                animate={{
                  scale: isSearchFocused ? 1.02 : 1,
                  boxShadow: isSearchFocused 
                    ? '0 0 0 3px rgba(99, 102, 241, 0.1)' 
                    : '0 0 0 0px rgba(99, 102, 241, 0)'
                }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search tasks, projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                />
              </motion.div>
            </form>
          </div>

                     {/* Right side - Actions */}
           <div className="flex items-center space-x-3">
             {/* Health Monitor */}
             <HealthMonitor 
               showDetailed={false}
               showNotifications={true}
               className="hidden md:flex"
             />
             
             {/* Notifications */}
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all duration-200"
             >
               <Bell className="w-5 h-5" />
               {unreadCount > 0 && (
                 <motion.div
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                 >
                   {unreadCount}
                 </motion.div>
               )}
             </motion.button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Voice Command */}
            <motion.button
              onClick={() => setShowVoiceCommand(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all duration-200"
              title="Voice Commands (⌘M)"
            >
              <Mic className="w-5 h-5" />
            </motion.button>

            {/* Command Palette */}
            <motion.button
              onClick={() => setShowCommandPalette(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all duration-200"
              title="Command Palette (⌘K)"
            >
              <Command className="w-5 h-5" />
            </motion.button>

            {/* User dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 p-2 rounded-lg text-text-primary hover:bg-white/10 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-bold">
                    {getUserInitials(user?.email)}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
                <motion.div
                  animate={{ rotate: userDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                </motion.div>
              </motion.button>

              {/* User dropdown menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 py-2 z-50"
                    style={{
                      background: 'rgba(var(--color-surface-rgb), 0.9)',
                      backdropFilter: 'blur(20px)'
                    }}
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-full flex items-center justify-center overflow-hidden">
                          {profileImage ? (
                            <img 
                              src={profileImage} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-sm font-bold">
                              {getUserInitials(user?.email)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {user?.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-xs text-text-muted">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                        onClick={() => {
                          navigate('/settings')
                          setUserDropdownOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-text-primary hover:text-primary flex items-center space-x-3 transition-colors duration-200"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                        onClick={() => {
                          setShowDiagnostics(true)
                          setUserDropdownOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-text-primary hover:text-green-500 flex items-center space-x-3 transition-colors duration-200"
                      >
                        <Terminal className="w-4 h-4" />
                        <span>Connection Diagnostics</span>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-text-primary hover:text-red-500 flex items-center space-x-3 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for dropdown */}
      <AnimatePresence>
        {userDropdownOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20"
            onClick={() => setUserDropdownOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.header>

    {/* Premium Modals */}
    <CommandPalette
      isOpen={showCommandPalette}
      onClose={() => setShowCommandPalette(false)}
      onCommand={handleCommand}
    />

    <AnimatePresence>
      {showVoiceCommand && (
        <VoiceCommand
          onCommand={handleCommand}
          onClose={() => {
            console.log('🔒 Header: Closing voice command, current state:', showVoiceCommand)
            setShowVoiceCommand(false)
            console.log('🔒 Header: Voice command state after close:', false)
          }}
        />
      )}
    </AnimatePresence>

    <HelpModal
      isOpen={showHelpModal}
      onClose={() => setShowHelpModal(false)}
    />

    <ConnectionDiagnostics
      isOpen={showDiagnostics}
      onClose={() => setShowDiagnostics(false)}
    />
    </>
  )
}

export default Header

