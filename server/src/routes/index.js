import express from 'express';
import taskRoutes from './tasks.js';
import userRoutes from './users.js';
import authRoutes from './auth.js';

const router = express.Router();

// API routes
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'StudyMate API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      users: '/api/users'
    }
  });
});

export default router;
