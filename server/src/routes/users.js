import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateUserInput } from '../middleware/validation.js';
import {
  getUserProfile,
  updateUserProfile,
  changePassword
} from '../controllers/userController.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

// GET /api/users - Get current user profile
router.get('/', getUserProfile);

// PUT /api/users - Update current user profile
router.put('/', validateUserInput, updateUserProfile);

// PUT /api/users/password - Change password
router.put('/password', changePassword);

export default router;



