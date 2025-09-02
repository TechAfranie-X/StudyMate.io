import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Crown, 
  Flame, 
  CheckCircle,
  Lock,
  Unlock,
  Users,
  Brain
} from 'lucide-react';

// Achievement Badge Component
export const AchievementBadge = ({ 
  achievement, 
  isUnlocked = false, 
  onUnlock,
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const badgeVariants = {
    locked: { 
      scale: 1, 
      filter: "grayscale(100%)",
      opacity: 0.6
    },
    unlocked: { 
      scale: 1.05, 
      filter: "grayscale(0%)",
      opacity: 1
    },
    hover: { 
      scale: 1.1, 
      rotateY: 15,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15
      }
    }
  };

  const handleUnlock = () => {
    if (!isUnlocked && onUnlock) {
      setShowConfetti(true);
      onUnlock(achievement);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      variants={badgeVariants}
      initial="locked"
      animate={isUnlocked ? "unlocked" : "locked"}
      whileHover={isUnlocked ? "hover" : "locked"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleUnlock}
    >
      {/* Badge Icon */}
      <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border-4 ${
        isUnlocked 
          ? 'border-yellow-400 bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-lg' 
          : 'border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-700'
      }`}>
        {isUnlocked ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {achievement.icon}
          </motion.div>
        ) : (
          <Lock size={32} className="text-gray-400 dark:text-gray-500" />
        )}
      </div>

      {/* Badge Label */}
      <div className="mt-2 text-center">
        <h4 className={`text-sm font-medium ${
          isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {achievement.title}
        </h4>
        <p className={`text-xs ${
          isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
        }`}>
          {achievement.description}
        </p>
      </div>

      {/* Unlock Progress */}
      {!isUnlocked && achievement.progress && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${achievement.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {achievement.progress}% complete
          </p>
        </div>
      )}

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{
                  x: 40,
                  y: 40,
                  opacity: 1,
                  scale: 1
                }}
                animate={{
                  x: 40 + (Math.random() - 0.5) * 100,
                  y: 40 + Math.random() * 100,
                  opacity: 0,
                  scale: 0
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {isHovered && isUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap z-10"
          >
            <div className="text-center">
              <div className="font-medium">{achievement.title}</div>
              <div className="text-gray-300">{achievement.description}</div>
              {achievement.points && (
                <div className="text-yellow-400 font-bold mt-1">
                  +{achievement.points} XP
                </div>
              )}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Streak Counter with Fire Animation
export const StreakCounter = ({ 
  currentStreak, 
  longestStreak, 
  className = "" 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const streakRef = useRef(null);

  useEffect(() => {
    if (currentStreak > 0 && currentStreak % 5 === 0) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }
  }, [currentStreak]);

  const fireVariants = {
    normal: { scale: 1, rotate: 0 },
    burning: { 
      scale: [1, 1.2, 1],
      rotate: [-5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      ref={streakRef}
      className={`relative bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Fire Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl opacity-80" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">🔥 Streak</h3>
          <motion.div
            variants={fireVariants}
            animate={isAnimating ? "burning" : "normal"}
          >
            <Flame size={32} className="text-yellow-300" />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <motion.div
              key={currentStreak}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-4xl font-bold text-yellow-300"
            >
              {currentStreak}
            </motion.div>
            <div className="text-sm text-orange-100">Current</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-300">{longestStreak}</div>
            <div className="text-sm text-orange-100">Longest</div>
          </div>
        </div>

        {/* Streak Milestone */}
        {currentStreak >= 7 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-yellow-400/20 rounded-lg text-center"
          >
            <div className="flex items-center justify-center space-x-2">
              <Crown size={20} className="text-yellow-300" />
              <span className="text-sm font-medium text-yellow-200">
                {currentStreak >= 30 ? '🔥 Legendary Streak!' : 
                 currentStreak >= 21 ? '🔥 Epic Streak!' :
                 currentStreak >= 14 ? '🔥 Amazing Streak!' :
                 '🔥 Great Streak!'}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Particles */}
      <AnimatePresence>
        {isAnimating && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                initial={{
                  x: 50,
                  y: 50,
                  opacity: 1,
                  scale: 1
                }}
                animate={{
                  x: 50 + (Math.random() - 0.5) * 200,
                  y: 50 + Math.random() * -100,
                  opacity: 0,
                  scale: 0
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Progress Ring with Level System
export const LevelProgressRing = ({ 
  level, 
  experience, 
  experienceToNext, 
  className = "" 
}) => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const progress = (experience / experienceToNext) * 100;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const levelUpVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    exit: { scale: 0, opacity: 0, rotate: 180 }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Progress Ring */}
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke="url(#progressGradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 1.5,
              ease: "easeInOut"
            }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={level}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="text-center"
          >
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {level}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Level
            </div>
          </motion.div>
        </div>

        {/* Experience Bar */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32">
          <div className="text-center">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {experience} / {experienceToNext} XP
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            variants={levelUpVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              🎉 LEVEL UP! 🎉
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </div>
  );
};

// Achievement Showcase
export const AchievementShowcase = ({ achievements = [], className = "" }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUnlocked, setShowUnlocked] = useState(true);

  const categories = [
    { id: 'all', label: 'All', icon: Trophy },
    { id: 'productivity', label: 'Productivity', icon: Zap },
    { id: 'learning', label: 'Learning', icon: Brain },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'special', label: 'Special', icon: Star }
  ];

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false;
    if (showUnlocked && !achievement.isUnlocked) return false;
    return true;
  });

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          🏆 Achievements
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowUnlocked(!showUnlocked)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              showUnlocked 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {showUnlocked ? 'Show All' : 'Show Unlocked'}
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={16} />
              <span>{category.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AchievementBadge
              achievement={achievement}
              isUnlocked={achievement.isUnlocked}
              onUnlock={(achievement) => console.log('Achievement unlocked:', achievement)}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500 dark:text-gray-400"
        >
          <Trophy size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No achievements found in this category.</p>
        </motion.div>
      )}
    </div>
  );
};

// Daily Challenge Component
export const DailyChallenge = ({ 
  challenge, 
  onComplete, 
  className = "" 
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (challenge) {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const timeDiff = endOfDay - now;
      setTimeLeft(timeDiff);

      const timer = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1000));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [challenge]);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete?.(challenge);
  };

  if (!challenge) return null;

  return (
    <motion.div
      className={`bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">🎯 Daily Challenge</h3>
        <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
          {formatTime(timeLeft)} left
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">{challenge.title}</h4>
        <p className="text-purple-100">{challenge.description}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target size={20} />
          <span className="text-sm">{challenge.points} XP</span>
        </div>

        {!isCompleted ? (
          <motion.button
            onClick={handleComplete}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Complete Challenge
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2 text-green-200"
          >
            <CheckCircle size={20} />
            <span>Completed!</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default {
  AchievementBadge,
  StreakCounter,
  LevelProgressRing,
  AchievementShowcase,
  DailyChallenge
};
