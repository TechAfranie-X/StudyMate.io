import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, CheckSquare, Settings, X, BarChart3, ChevronLeft,
  User, LogOut, BookOpen, Target, Calendar, Sparkles
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Overview and insights' },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, description: 'Manage your tasks' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, description: 'Progress tracking' },
    { name: 'Advanced Demo', href: '/demo', icon: Sparkles, description: 'Cutting-edge features' },
    { name: 'Study', href: '/study', icon: BookOpen, description: 'Study materials' },
    { name: 'Goals', href: '/goals', icon: Target, description: 'Set and track goals' },
    { name: 'Schedule', href: '/schedule', icon: Calendar, description: 'Calendar view' },
    { name: 'Settings', href: '/settings', icon: Settings, description: 'Preferences' },
  ];

  const isActive = (href) => {
    return location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href));
  };

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div 
        className="hidden lg:flex lg:flex-shrink-0 relative"
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex flex-col h-full">
          {/* Glassmorphism Background */}
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/20" />
          
          <div className="relative flex flex-col h-full z-10">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-white/20 dark:border-gray-700/20">
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.h1 
                    key="logo"
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={contentVariants}
                    className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"
                  >
                    StudyMate
                  </motion.h1>
                )}
              </AnimatePresence>
              
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-200"
              >
                <motion.div
                  animate={{ rotate: isCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </motion.div>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isItemActive = isActive(item.href);
                
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={`
                      group relative flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300
                      ${isItemActive
                        ? 'bg-gradient-to-r from-blue-600/20 to-green-600/20 text-blue-600 border border-blue-600/30'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-white'
                      }
                    `}
                  >
                    {isItemActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-green-600 rounded-r-full"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.div
                          key="content"
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          variants={contentVariants}
                          className="ml-3 min-w-0 flex-1"
                        >
                          <div className="text-sm font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {item.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </NavLink>
                );
              })}
            </nav>

            {/* User Profile Section */}
            <div className="px-3 pb-4 border-t border-white/20 dark:border-gray-700/20 pt-4">
              <AnimatePresence mode="wait">
                {!isCollapsed ? (
                  <motion.div
                    key="expanded-profile"
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={contentVariants}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-white/20 dark:bg-gray-800/20"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                      U
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        User
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        user@example.com
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="collapsed-profile"
                    initial="collapsed"
                    animate="expanded"
                    variants={contentVariants}
                    className="flex justify-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                      U
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <motion.div
        className="fixed inset-y-0 left-0 z-50 w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/20 lg:hidden"
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/20 dark:border-gray-700/20">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              StudyMate
            </h1>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/20 dark:bg-gray-800/20 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-200"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isItemActive = isActive(item.href);
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    group relative flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300
                    ${isItemActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-green-600/20 text-blue-600 border border-blue-600/30'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  {isItemActive && (
                    <motion.div
                      layoutId="mobileActiveIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-green-600 rounded-r-full"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <Icon className="w-5 h-5 mr-3" />
                  <div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </nav>

          <div className="px-3 pb-4 border-t border-white/20 dark:border-gray-700/20 pt-4">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/20 dark:bg-gray-800/20">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-semibold text-sm">
              U
            </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  User
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  user@example.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;

