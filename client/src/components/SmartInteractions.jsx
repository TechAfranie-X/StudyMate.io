import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Star,
  Mic,
  MicOff,
  Sparkles,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

// Contextual Menu Component
export const ContextualMenu = ({ 
  children, 
  items = [], 
  position = "bottom-right",
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.bottom });
    setIsOpen(true);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const positionClasses = {
    "top-left": "bottom-full left-0 mb-2",
    "top-right": "bottom-full right-0 mb-2",
    "bottom-left": "top-full left-0 mt-2",
    "bottom-right": "top-full right-0 mt-2"
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={triggerRef}
        onContextMenu={handleContextMenu}
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className={`absolute z-50 min-w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 ${positionClasses[position]}`}
          >
            {items.map((item, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                disabled={item.disabled}
              >
                {item.icon && <item.icon size={16} />}
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    {item.shortcut}
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Voice Command Component
export const VoiceCommand = ({ onCommand, className = "" }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognitionRef.current.onresult = (event) => {
        const result = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(result);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript && onCommand) {
          onCommand(transcript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, [onCommand, transcript]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <motion.button
      onClick={toggleListening}
      className={`relative p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isListening ? [1, 1.1, 1] : 1,
        rotate: isListening ? [0, 5, -5, 0] : 0
      }}
      transition={{
        duration: 2,
        repeat: isListening ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      
      {/* Animated waves when listening */}
      {isListening && (
        <div className="absolute inset-0 rounded-full">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-white/30"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
};

// Smart Suggestions Component
export const SmartSuggestions = ({ 
  suggestions = [], 
  onSuggestionClick, 
  className = "" 
}) => {
  const [visibleSuggestions, setVisibleSuggestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (suggestions.length > 0) {
      setVisibleSuggestions(suggestions.slice(0, 3));
    }
  }, [suggestions]);

  useEffect(() => {
    if (visibleSuggestions.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % visibleSuggestions.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [visibleSuggestions.length]);

  if (suggestions.length === 0) return null;

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Sparkles className="text-blue-600 dark:text-blue-400" size={20} />
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
          Smart Suggestions
        </h3>
      </div>
      
      <div className="space-y-2">
        {visibleSuggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0.7,
              x: 0,
              scale: index === currentIndex ? 1.02 : 1
            }}
            transition={{
              duration: 0.3,
              delay: index * 0.1
            }}
            className={`p-3 rounded-lg cursor-pointer transition-all ${
              index === currentIndex 
                ? 'bg-white dark:bg-gray-800 shadow-md border border-blue-200 dark:border-blue-700' 
                : 'bg-transparent'
            }`}
            onClick={() => onSuggestionClick(suggestion)}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${
                suggestion.type === 'productivity' ? 'bg-green-100 dark:bg-green-900/20' :
                suggestion.type === 'learning' ? 'bg-blue-100 dark:bg-blue-900/20' :
                'bg-purple-100 dark:bg-purple-900/20'
              }`}>
                {suggestion.type === 'productivity' ? <TrendingUp size={16} className="text-green-600 dark:text-green-400" /> :
                 suggestion.type === 'learning' ? <Target size={16} className="text-blue-600 dark:text-blue-400" /> :
                 <Zap size={16} className="text-purple-600 dark:text-purple-400" />}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {suggestion.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Progressive Disclosure Component
export const ProgressiveDisclosure = ({ 
  title, 
  children, 
  defaultExpanded = false,
  className = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white">{title}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: "easeInOut" },
              opacity: { duration: 0.2 }
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Keyboard Shortcuts Display
export const KeyboardShortcuts = ({ shortcuts = [], className = "" }) => {
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
        Keyboard Shortcuts
      </h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-gray-600 dark:text-gray-400">{shortcut.action}</span>
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">
              {shortcut.keys}
            </kbd>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Smart Task Actions
export const SmartTaskActions = ({ task, onAction, className = "" }) => {
  const getContextualItems = () => {
    const items = [
      {
        label: "Edit Task",
        icon: Edit,
        onClick: () => onAction('edit', task),
        shortcut: "⌘E"
      }
    ];

    if (task.status !== 'COMPLETED') {
      items.push({
        label: "Mark Complete",
        icon: CheckCircle,
        onClick: () => onAction('complete', task),
        shortcut: "⌘C"
      });
    }

    if (task.priority !== 'HIGH') {
      items.push({
        label: "Set High Priority",
        icon: Star,
        onClick: () => onAction('priority', task),
        shortcut: "⌘H"
      });
    }

    items.push({
      label: "Delete Task",
      icon: Trash2,
      onClick: () => onAction('delete', task),
      shortcut: "⌘D"
    });

    return items;
  };

  return (
    <ContextualMenu
      items={getContextualItems()}
      className={className}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <MoreVertical size={16} />
      </motion.button>
    </ContextualMenu>
  );
};

export default {
  ContextualMenu,
  VoiceCommand,
  SmartSuggestions,
  ProgressiveDisclosure,
  KeyboardShortcuts,
  SmartTaskActions
};
