import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X, Home, CheckSquare, Settings, BarChart3, Plus, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const actions = [
    { id: 'dashboard', name: 'Go to Dashboard', icon: Home, action: () => navigate('/dashboard'), category: 'Navigation' },
    { id: 'tasks', name: 'View Tasks', icon: CheckSquare, action: () => navigate('/tasks'), category: 'Navigation' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, action: () => navigate('/analytics'), category: 'Navigation' },
    { id: 'settings', name: 'Settings', icon: Settings, action: () => navigate('/settings'), category: 'Navigation' },
    { id: 'new-task', name: 'Create New Task', icon: Plus, action: () => navigate('/tasks?new=true'), category: 'Actions' },
    { id: 'profile', name: 'User Profile', icon: User, action: () => navigate('/profile'), category: 'User' },
    { id: 'logout', name: 'Logout', icon: LogOut, action: () => { logout(); onClose(); }, category: 'User' },
  ];

  const filteredActions = actions.filter(action =>
    action.name.toLowerCase().includes(query.toLowerCase()) ||
    action.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (filteredActions.length > 0) {
      setSelectedIndex(0);
    }
  }, [query]);

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
        e.preventDefault();
          setSelectedIndex(prev => 
          prev < filteredActions.length - 1 ? prev + 1 : 0
        );
        break;
        case 'ArrowUp':
        e.preventDefault();
          setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredActions.length - 1
        );
        break;
        case 'Enter':
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          filteredActions[selectedIndex].action();
          onClose();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const handleActionClick = (action) => {
    action.action();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Command Palette */}
          <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
          <div className="flex items-center px-6 py-4 border-b border-white/20 dark:border-gray-700/20">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Command className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">⌘K</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Command Palette</span>
            </div>
            <button
              onClick={onClose}
              className="ml-auto p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Search Input */}
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search commands, navigate, or perform actions..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
            </div>
                </div>

          {/* Actions List */}
          <div className="max-h-96 overflow-y-auto px-2 pb-4">
            {filteredActions.length > 0 ? (
              <div className="space-y-1">
                {filteredActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    onClick={() => handleActionClick(action)}
                    className={`
                      w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 group
                      ${index === selectedIndex
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                      whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`
                      p-2 rounded-lg mr-3 transition-colors
                      ${index === selectedIndex
                        ? 'bg-primary/20 text-primary'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary'
                      }
                    `}>
                      <action.icon className="w-4 h-4" />
                    </div>
                      <div className="flex-1">
                      <div className="font-medium">{action.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{action.category}</div>
                      </div>
                        {index === selectedIndex && (
                          <motion.div
                        layoutId="selectedIndicator"
                        className="w-1 h-8 bg-primary rounded-full"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-lg font-medium">No commands found</p>
                <p className="text-sm">Try a different search term</p>
                      </div>
              )}
            </div>

            {/* Footer */}
          <div className="px-6 py-3 border-t border-white/20 dark:border-gray-700/20 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-2xl">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
              <span>{filteredActions.length} command{filteredActions.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;
