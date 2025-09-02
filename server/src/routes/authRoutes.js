import express from 'express';
import { login, register } from '../controllers/authController.js';

const router = express.Router();

// POST /auth/login - Login user and get JWT token
router.post('/login', login);

// POST /auth/register - Register new user and get JWT token
router.post('/register', register);

export default router;
