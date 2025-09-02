import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

const prisma = new PrismaClient();

// User registration
export const register = async (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      console.error('🚫 Register: Invalid request body format:', {
        body: req.body,
        contentType: req.headers['content-type'],
        url: req.url,
        method: req.method
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid request body format'
      });
    }

    const { email, password, name } = req.body;

    // Additional validation beyond middleware
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      console.error('🚫 Register: Missing or invalid email:', { email, body: req.body });
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      console.error('🚫 Register: Missing or invalid password');
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    console.log('📝 Register: Processing registration for email:', email);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      console.log('🚫 Register: User already exists:', { email });
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('🔒 Register: Password hashed successfully');

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name ? name.trim() : null
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    console.log('✅ Register: User created successfully:', { userId: newUser.id, email: newUser.email });

    // Generate JWT token
    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser,
        token
      }
    });
  } catch (error) {
    console.error('❌ Register: Critical error:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    if (error.code === 'P2000') {
      return res.status(400).json({
        success: false,
        message: 'Data too long for one or more fields'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// User login
export const login = async (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      console.error('🚫 Login: Invalid request body format:', {
        body: req.body,
        contentType: req.headers['content-type'],
        url: req.url,
        method: req.method
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid request body format'
      });
    }

    const { email, password } = req.body;

    // Additional validation beyond middleware
    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      console.error('🚫 Login: Missing or invalid email:', { email, body: req.body });
      return res.status(400).json({
        success: false,
        message: 'Valid email is required'
      });
    }

    if (!password || typeof password !== 'string' || password.trim().length === 0) {
      console.error('🚫 Login: Missing or invalid password');
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    console.log('🔑 Login: Processing login for email:', email);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      console.log('🚫 Login: User not found:', { email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('👤 Login: User found, verifying password');

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('🚫 Login: Invalid password for user:', { email, userId: user.id });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('✅ Login: Password verified successfully for user:', { userId: user.id, email: user.email });

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data (excluding password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      preferences: user.preferences,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });
  } catch (error) {
    console.error('❌ Login: Critical error:', {
      error: error.message,
      stack: error.stack,
      body: req.body,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      success: false,
      message: 'Failed to log in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get current user (for token validation)
export const getCurrentUser = async (req, res) => {
  try {
    // Validate user object from middleware
    if (!req.user || !req.user.userId) {
      console.error('🚫 GetCurrentUser: Missing or invalid user object:', {
        user: req.user,
        headers: req.headers,
        url: req.url,
        method: req.method
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    const userId = req.user.userId;
    console.log('👤 GetCurrentUser: Fetching user data for ID:', userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        preferences: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      console.error('🚫 GetCurrentUser: User not found in database:', { userId });
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('✅ GetCurrentUser: User data retrieved successfully:', { userId, email: user.email });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('❌ GetCurrentUser: Critical error:', {
      error: error.message,
      stack: error.stack,
      user: req.user,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      success: false,
      message: 'Failed to fetch current user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
