import { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  success,
  icon: Icon,
  rightIcon: RightIcon,
  className = '',
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  
  const inputType = type === 'password' && showPassword ? 'text' : type
  
  const handleFocus = (e) => {
    setIsFocused(true)
    setHasValue(e.target.value.length > 0)
    onFocus?.(e)
  }
  
  const handleBlur = (e) => {
    setIsFocused(false)
    setHasValue(e.target.value.length > 0)
    onBlur?.(e)
  }
  
  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0)
    props.onChange?.(e)
  }
  
  const isActive = isFocused || hasValue
  
  return (
    <div className={`relative ${className}`}>
      {/* Input Container */}
      <motion.div
        className={`
          relative bg-surface border rounded-lg transition-all duration-200
          ${isFocused 
            ? 'border-primary shadow-lg shadow-primary/20' 
            : error 
              ? 'border-red-500' 
              : success 
                ? 'border-green-500' 
                : 'border-border hover:border-text-muted'
          }
        `}
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused 
            ? '0 0 0 3px rgba(99, 102, 241, 0.1)' 
            : '0 0 0 0px rgba(99, 102, 241, 0)'
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Left Icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full px-4 py-3 bg-transparent text-text-primary placeholder-transparent
            focus:outline-none transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${RightIcon || type === 'password' ? 'pr-10' : ''}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        
        {/* Right Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {type === 'password' ? (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </motion.button>
          ) : RightIcon ? (
            <RightIcon className="w-4 h-4 text-text-muted" />
          ) : null}
        </div>
        
        {/* Floating Label */}
        <motion.label
          className={`
            absolute left-4 top-3 text-text-secondary pointer-events-none transition-all duration-200
            ${isActive ? 'text-primary' : ''}
          `}
          animate={{
            y: isActive ? -20 : 0,
            scale: isActive ? 0.85 : 1,
            x: isActive ? (Icon ? -8 : 0) : 0
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {label}
        </motion.label>
      </motion.div>
      
      {/* Validation Messages */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center mt-2 text-sm"
          >
            {error ? (
              <>
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                <span className="text-red-600">{error}</span>
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-green-600">{success}</span>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

Input.displayName = 'Input'

export default Input

















