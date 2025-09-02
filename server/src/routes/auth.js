import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateUserInput, validateLoginInput } from '../middleware/validation.js';
import {
  register,
  login,
  getCurrentUser
} from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register - User registration
router.post('/register', validateUserInput, register);

// POST /api/auth/login - User login
router.post('/login', validateLoginInput, login);

// GET /api/auth/me - Get current user (requires authentication)
router.get('/me', authenticateToken, getCurrentUser);

export default router;



