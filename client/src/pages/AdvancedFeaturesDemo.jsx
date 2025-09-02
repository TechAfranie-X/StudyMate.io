import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Sparkles, 
  Trophy, 
  Target, 
  TrendingUp, 
  Star,
  Brain,
  Heart,
  Rocket,
  Crown,
  Flame
} from 'lucide-react';

// Import all our advanced components
import {
  pageTransitions,
  staggerContainer,
  staggerItem,
  bounceSpring,
  ParallaxElement,
  MorphingButton,
  FloatingActionButton,
  AnimatedProgressRing,
  AnimatedCounter,
  AnimatedSkeleton,
  HoverCard
} from '../components/AdvancedAnimations';

import {
  ContextualMenu,
  VoiceCommand,
  SmartSuggestions,
  ProgressiveDisclosure,
  KeyboardShortcuts,
  SmartTaskActions
} from '../components/SmartInteractions';

import {
  InteractiveBarChart,
  RealTimeLineChart,
  AnimatedExport,
  CustomCursor
} from '../components/AdvancedDataViz';

import {
  HighContrastToggle,
  ReducedMotionProvider,
  OptimizedSkeleton,
  OfflineIndicator,
  PerformanceMonitor,
  FocusRing,
  ScreenReaderOnly,
  KeyboardNavigation,
  LazyImage,
  AccessibleErrorBoundary
} from '../components/AccessibilityPerformance';

import {
  AchievementBadge,
  StreakCounter,
  LevelProgressRing,
  AchievementShowcase,
  DailyChallenge
} from '../components/GamificationSystem';

const AdvancedFeaturesDemo = () => {
  const [activeSection, setActiveSection] = useState('animations');
  const [showPerformance, setShowPerformance] = useState(false);

  // Sample data for charts
  const chartData = [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 78 },
    { label: 'Wed', value: 82 },
    { label: 'Thu', value: 75 },
    { label: 'Fri', value: 90 },
    { label: 'Sat', value: 85 },
    { label: 'Sun', value: 88 }
  ];

  const lineChartData = [
    { label: '9 AM', value: 45 },
    { label: '10 AM', value: 67 },
    { label: '11 AM', value: 89 },
    { label: '12 PM', value: 34 },
    { label: '1 PM', value: 78 },
    { label: '2 PM', value: 92 },
    { label: '3 PM', value: 76 },
    { label: '4 PM', value: 85 }
  ];

  // Sample achievements
  const achievements = [
    {
      id: 1,
      title: 'First Task',
      description: 'Complete your first task',
      icon: Target,
      category: 'productivity',
      isUnlocked: true,
      points: 10
    },
    {
      id: 2,
      title: 'Streak Master',
      description: 'Maintain a 7-day streak',
      icon: Flame,
      category: 'productivity',
      isUnlocked: true,
      points: 50
    },
    {
      id: 3,
      title: 'Quick Learner',
      description: 'Complete 5 tasks in one day',
      icon: Brain,
      category: 'learning',
      isUnlocked: false,
      progress: 60,
      points: 25
    },
    {
      id: 4,
      title: 'Social Butterfly',
      description: 'Share 3 achievements',
      icon: Heart,
      category: 'social',
      isUnlocked: false,
      progress: 0,
      points: 30
    }
  ];

  // Sample daily challenge
  const dailyChallenge = {
    title: 'Complete 3 High Priority Tasks',
    description: 'Focus on what matters most today',
    points: 100
  };

  // Smart suggestions
  const suggestions = [
    {
      id: 1,
      type: 'productivity',
      title: 'Time Block Your Day',
      description: 'Schedule focused work sessions for better productivity'
    },
    {
      id: 2,
      type: 'learning',
      title: 'Review Yesterday\'s Notes',
      description: 'Reinforce learning by reviewing previous material'
    },
    {
      id: 3,
      type: 'productivity',
      title: 'Take a 5-Minute Break',
      description: 'Short breaks improve focus and retention'
    }
  ];

  const sections = [
    { id: 'animations', label: '🎬 Animations', icon: Sparkles },
    { id: 'interactions', label: '🎯 Smart Interactions', icon: Target },
    { id: 'visualization', label: '📊 Data Visualization', icon: TrendingUp },
    { id: 'accessibility', label: '♿ Accessibility', icon: Heart },
    { id: 'gamification', label: '🏆 Gamification', icon: Trophy }
  ];

  const handleVoiceCommand = (command) => {
    console.log('Voice command received:', command);
    // Handle voice commands here
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('Suggestion clicked:', suggestion);
    // Handle suggestion clicks here
  };

  return (
    <ReducedMotionProvider>
      <motion.div
        className="min-h-screen bg-gray-50 dark:bg-gray-900"
        variants={pageTransitions}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Header with Parallax Effect */}
        <ParallaxElement speed={0.3} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h1 
              className="text-5xl font-bold mb-4"
              variants={bounceSpring}
            >
              🚀 Advanced Features Demo
            </motion.h1>
            <motion.p 
              className="text-xl text-blue-100 mb-8"
              variants={bounceSpring}
            >
              Experience the cutting-edge features that make StudyMate extraordinary
            </motion.p>
            
            {/* Navigation Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center space-x-2">
                    <section.icon size={20} />
                    <span>{section.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </ParallaxElement>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-12"
          >
            {/* Animations Section */}
            {activeSection === 'animations' && (
              <motion.div variants={staggerItem}>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  🎬 Advanced Animations & Physics
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Morphing Buttons */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Morphing Buttons
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      <MorphingButton variant="primary">Primary</MorphingButton>
                      <MorphingButton variant="accent">Accent</MorphingButton>
                      <MorphingButton variant="success">Success</MorphingButton>
                      <MorphingButton variant="warning">Warning</MorphingButton>
                    </div>
                  </div>

                  {/* Progress Ring */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Animated Progress Ring
                    </h3>
                    <div className="flex justify-center">
                      <AnimatedProgressRing progress={75} size={120} />
                    </div>
                  </div>

                  {/* Animated Counter */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Animated Counter
                    </h3>
                    <div className="text-center">
                      <AnimatedCounter value={1234} className="text-4xl font-bold text-blue-600" />
                      <p className="text-gray-600 dark:text-gray-400">Total Points</p>
                    </div>
                  </div>

                  {/* Hover Cards */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      3D Hover Effects
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <HoverCard className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                          <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Hover me!</p>
                        </div>
                      </HoverCard>
                      <HoverCard className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-center">
                          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">3D Effect!</p>
                        </div>
                      </HoverCard>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Smart Interactions Section */}
            {activeSection === 'interactions' && (
              <motion.div variants={staggerItem}>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  🎯 Smart Interactions & Contextual Menus
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Voice Commands */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Voice Commands
                    </h3>
                    <div className="flex justify-center">
                      <VoiceCommand onCommand={handleVoiceCommand} />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Click the mic to try voice commands
                    </p>
                  </div>

                  {/* Smart Suggestions */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      AI-Powered Suggestions
                    </h3>
                    <SmartSuggestions
                      suggestions={suggestions}
                      onSuggestionClick={handleSuggestionClick}
                    />
                  </div>

                  {/* Progressive Disclosure */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Progressive Disclosure
                    </h3>
                    <ProgressiveDisclosure title="Advanced Settings" defaultExpanded={false}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Auto-save</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Notifications</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Dark Mode</span>
                          <input type="checkbox" className="toggle" />
                        </div>
                      </div>
                    </ProgressiveDisclosure>
                  </div>

                  {/* Keyboard Shortcuts */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Keyboard Shortcuts
                    </h3>
                    <KeyboardShortcuts
                      shortcuts={[
                        { action: 'Open Command Palette', keys: '⌘K' },
                        { action: 'Create New Task', keys: '⌘N' },
                        { action: 'Save Changes', keys: '⌘S' },
                        { action: 'Toggle Sidebar', keys: '⌘B' }
                      ]}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Data Visualization Section */}
            {activeSection === 'visualization' && (
              <motion.div variants={staggerItem}>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  📊 Advanced Data Visualization
                </h2>
                
                <div className="space-y-8">
                  {/* Interactive Bar Chart */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Interactive Bar Chart with Zoom & Pan
                    </h3>
                    <InteractiveBarChart data={chartData} height={300} />
                  </div>

                  {/* Real-time Line Chart */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Real-time Line Chart
                    </h3>
                    <RealTimeLineChart data={lineChartData} height={300} />
                  </div>

                  {/* Export with Animation */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Animated Export
                    </h3>
                    <AnimatedExport
                      onExport={() => console.log('Export completed!')}
                      format="json"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Accessibility Section */}
            {activeSection === 'accessibility' && (
              <motion.div variants={staggerItem}>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  ♿ Accessibility & Performance
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* High Contrast Toggle */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      High Contrast Mode
                    </h3>
                    <HighContrastToggle />
                  </div>

                  {/* Offline Indicator */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Connection Status
                    </h3>
                    <OfflineIndicator />
                  </div>

                  {/* Loading Skeletons */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Optimized Loading States
                    </h3>
                    <div className="space-y-4">
                      <OptimizedSkeleton type="text" lines={3} />
                      <OptimizedSkeleton type="card" />
                    </div>
                  </div>

                  {/* Performance Monitor */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Performance Metrics
                    </h3>
                    <button
                      onClick={() => setShowPerformance(!showPerformance)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {showPerformance ? 'Hide' : 'Show'} Performance Monitor
                    </button>
                    {showPerformance && <PerformanceMonitor />}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Gamification Section */}
            {activeSection === 'gamification' && (
              <motion.div variants={staggerItem}>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  🏆 Gamification & Achievements
                </h2>
                
                <div className="space-y-8">
                  {/* Level Progress */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Level Progress
                      </h3>
                      <LevelProgressRing
                        level={15}
                        experience={1250}
                        experienceToNext={2000}
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Streak Counter
                      </h3>
                      <StreakCounter currentStreak={12} longestStreak={21} />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Daily Challenge
                      </h3>
                      <DailyChallenge
                        challenge={dailyChallenge}
                        onComplete={(challenge) => console.log('Challenge completed:', challenge)}
                      />
                    </div>
                  </div>

                  {/* Achievement Showcase */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                      Achievement System
                    </h3>
                    <AchievementShowcase achievements={achievements} />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton onClick={() => console.log('FAB clicked!')}>
          <Rocket size={24} />
        </FloatingActionButton>
      </motion.div>
    </ReducedMotionProvider>
  );
};

export default AdvancedFeaturesDemo;
