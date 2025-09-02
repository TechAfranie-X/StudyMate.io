import jwt from 'jsonwebtoken';

// Function to validate JWT_SECRET environment variable
function validateJWTSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error('❌ CRITICAL ERROR: JWT_SECRET environment variable is not set!');
    console.error('   Please add JWT_SECRET to your .env file');
    console.error('   Example: JWT_SECRET=your-super-secret-key-here');
    process.exit(1);
  }
  return JWT_SECRET;
}

// Get JWT_SECRET (will be validated when first used)
let JWT_SECRET = null;

export const authenticateToken = (req, res, next) => {
  try {
    // Validate JWT_SECRET on first use
    if (!JWT_SECRET) {
      JWT_SECRET = validateJWTSecret();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (jwtError) {
      console.error('🔐 JWT Verification failed:', {
        error: jwtError.message,
        stack: jwtError.stack,
        token: token.substring(0, 20) + '...' // Log first 20 chars for debugging
      });
      
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token',
        error: process.env.NODE_ENV === 'development' ? jwtError.message : undefined
      });
    }
  } catch (error) {
    console.error('🔐 Authentication middleware error:', {
      error: error.message,
      stack: error.stack,
      headers: req.headers,
      url: req.url,
      method: req.method
    });
    
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication service error' 
    });
  }
};

export const generateToken = (userId) => {
  try {
    // Validate JWT_SECRET on first use
    if (!JWT_SECRET) {
      JWT_SECRET = validateJWTSecret();
    }

    if (!userId) {
      throw new Error('User ID is required to generate token');
    }
    
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
    console.log('🔐 Token generated successfully for user:', userId);
    return token;
  } catch (error) {
    console.error('🔐 Token generation failed:', {
      error: error.message,
      stack: error.stack,
      userId: userId
    });
    throw error;
  }
};



