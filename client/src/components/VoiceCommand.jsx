import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, X } from 'lucide-react'
import { useAnimation } from '../contexts/AnimationContext'

const VoiceCommand = ({ onCommand, onClose }) => {
  const { reducedMotion } = useAnimation()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setError('')
      }
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        setTranscript(finalTranscript + interimTranscript)
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setError('Speech recognition error. Please try again.')
        setIsListening(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    } else {
      setError('Speech recognition is not supported in this browser.')
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        setError('Failed to start speech recognition.')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const handleSubmit = async () => {
    if (!transcript.trim()) return
    
    setIsProcessing(true)
    
    try {
      // Process the voice command
      const command = processVoiceCommand(transcript)
      if (command) {
        onCommand(command)
        onClose()
      } else {
        setError('Command not recognized. Please try again.')
      }
    } catch (error) {
      setError('Failed to process command.')
    } finally {
      setIsProcessing(false)
    }
  }

  const processVoiceCommand = (text) => {
    const lowerText = text.toLowerCase()
    
    // Task-related commands
    if (lowerText.includes('new task') || lowerText.includes('create task') || lowerText.includes('add task')) {
      return { type: 'new-task', data: { title: text.replace(/new task|create task|add task/gi, '').trim() } }
    }
    
    if (lowerText.includes('search') || lowerText.includes('find')) {
      return { type: 'search', data: { query: text.replace(/search|find/gi, '').trim() } }
    }
    
    if (lowerText.includes('toggle theme') || lowerText.includes('switch theme')) {
      return { type: 'toggle-theme' }
    }
    
    if (lowerText.includes('export') || lowerText.includes('download')) {
      return { type: 'export-data' }
    }
    
    if (lowerText.includes('settings') || lowerText.includes('preferences')) {
      return { type: 'open-settings' }
    }
    
    if (lowerText.includes('help') || lowerText.includes('assist')) {
      return { type: 'show-help' }
    }
    
    return null
  }

  const waveVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const containerVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  }

  const handleClose = () => {
    console.log('🔒 VoiceCommand close button clicked')
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    onClose()
  }

  const handleBackdropClick = (e) => {
    console.log('🔒 VoiceCommand backdrop clicked')
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={handleBackdropClick}
    >
      <motion.div
        className="bg-surface rounded-card shadow-2xl border border-border max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Voice Command</h2>
          <motion.button
            onClick={handleClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-elevated rounded-full"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Microphone Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {/* Wave animation rings */}
            <AnimatePresence>
              {isListening && (
                <>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      variants={waveVariants}
                      animate="animate"
                      style={{
                        animationDelay: `${i * 0.3}s`
                      }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Microphone button */}
            <motion.button
              onClick={isListening ? stopListening : startListening}
              className={`relative p-6 rounded-full ${
                isListening 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-primary text-white hover:bg-primary-hover'
              } transition-all duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={pulseVariants}
              animate={isListening ? "animate" : "initial"}
            >
              {isListening ? <MicOff size={32} /> : <Mic size={32} />}
            </motion.button>
          </div>

          <p className="mt-4 text-text-secondary">
            {isListening ? 'Listening... Speak now' : 'Click to start voice recognition'}
          </p>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-text-secondary mb-2">Transcript:</h3>
            <div className="bg-surface-elevated rounded-lg p-4 border border-border">
              <p className="text-text-primary">{transcript}</p>
            </div>
          </div>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex space-x-3">
          <motion.button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-text-secondary hover:text-text-primary font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          
          <motion.button
            onClick={handleSubmit}
            disabled={!transcript.trim() || isProcessing}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              transcript.trim() && !isProcessing
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'bg-surface-elevated text-text-muted cursor-not-allowed'
            }`}
            whileHover={transcript.trim() && !isProcessing ? { scale: 1.02 } : {}}
            whileTap={transcript.trim() && !isProcessing ? { scale: 0.98 } : {}}
          >
            {isProcessing ? 'Processing...' : 'Execute Command'}
          </motion.button>
        </div>

        {/* Help text */}
        <div className="mt-6 p-4 bg-surface-elevated rounded-lg">
          <h4 className="text-sm font-medium text-text-secondary mb-2">Voice Commands:</h4>
          <ul className="text-xs text-text-muted space-y-1">
            <li>• "Create new task" - Add a new task</li>
            <li>• "Search tasks" - Find tasks</li>
            <li>• "Toggle theme" - Switch theme</li>
            <li>• "Export data" - Download data</li>
            <li>• "Open settings" - Access settings</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default VoiceCommand
