import React from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Target, TrendingUp, Calendar, CheckSquare } from 'lucide-react';

const EmptyStateCard = ({ 
  title, 
  description, 
  illustration = 'default',
  primaryAction,
  secondaryAction 
}) => {
  const getIllustration = () => {
    switch (illustration) {
      case 'tasks':
        return <CheckSquare className="w-16 h-16 text-accent" />;
      case 'study':
        return <BookOpen className="w-16 h-16 text-accent" />;
      case 'goals':
        return <Target className="w-16 h-16 text-accent" />;
      case 'analytics':
        return <TrendingUp className="w-16 h-16 text-accent" />;
      case 'schedule':
        return <Calendar className="w-16 h-16 text-accent" />;
      default:
        return <Plus className="w-16 h-16 text-accent" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card card-glass bg-gradient-to-br from-background-secondary to-background-tertiary border-border-subtle"
    >
      <div className="card-body text-center py-12">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="w-24 h-24 bg-accent-10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          {getIllustration()}
        </motion.div>
        
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="h3 text-text-primary mb-3"
        >
          {title}
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="text-text-secondary mb-8 max-w-md mx-auto"
        >
          {description}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="btn btn-primary"
            >
              {primaryAction.text}
            </button>
          )}
          
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="btn btn-secondary"
            >
              {secondaryAction.text}
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmptyStateCard;
