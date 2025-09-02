// Enhanced error handler with better categorization and performance optimizations
export const errorHandler = (err, req, res, next) => {
  // Log error with request context for debugging
  const errorContext = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id || 'anonymous'
  };

  console.error('Error occurred:', {
    ...errorContext,
    error: {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });

  // Don't send response if headers already sent
  if (res.headersSent) {
    return next(err);
  }

  // Standardized error response format
  const createErrorResponse = (statusCode, message, details = null) => ({
    success: false,
    error: {
      code: statusCode,
      message,
      timestamp: errorContext.timestamp,
      path: req.originalUrl,
      ...(details && { details })
    }
  });

  // Database errors (Prisma)
  if (err.code) {
    const dbErrorMap = {
      'P2002': { status: 409, message: 'A record with this unique field already exists' },
      'P2025': { status: 404, message: 'Record not found' },
      'P2003': { status: 400, message: 'Foreign key constraint failed' },
      'P2014': { status: 400, message: 'The change you are trying to make would violate the required relation' },
      'P2021': { status: 500, message: 'The table does not exist in the current database' },
      'P2022': { status: 500, message: 'The column does not exist in the current database' }
    };

    const dbError = dbErrorMap[err.code];
    if (dbError) {
      return res.status(dbError.status).json(createErrorResponse(dbError.status, dbError.message));
    }
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const validationErrors = Array.isArray(err.errors) 
      ? err.errors.map(e => ({ field: e.path, message: e.message }))
      : err.errors;

    return res.status(400).json(createErrorResponse(400, 'Validation failed', validationErrors));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(createErrorResponse(401, 'Invalid authentication token'));
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(createErrorResponse(401, 'Authentication token expired'));
  }

  // Rate limiting errors
  if (err.status === 429) {
    return res.status(429).json(createErrorResponse(429, 'Too many requests. Please try again later'));
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json(createErrorResponse(400, 'File size too large'));
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json(createErrorResponse(400, 'Unexpected file field'));
  }

  // Network and timeout errors
  if (err.code === 'ECONNRESET' || err.code === 'ENOTFOUND') {
    return res.status(503).json(createErrorResponse(503, 'Service temporarily unavailable'));
  }

  // Custom application errors
  if (err.isOperational) {
    return res.status(err.statusCode || 400).json(
      createErrorResponse(err.statusCode || 400, err.message)
    );
  }

  // Default error handling
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Internal server error';

  // Don't expose internal errors in production
  const response = createErrorResponse(statusCode, message);
  
  // Add stack trace only in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// Enhanced 404 handler
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 404,
      message: `Route ${req.originalUrl} not found`,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      suggestions: [
        'Check the URL spelling',
        'Verify the HTTP method',
        'Ensure the endpoint exists'
      ]
    }
  });
};

// Custom error class for operational errors
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error wrapper to catch async errors
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Performance monitoring middleware
export const performanceMonitor = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${method} ${originalUrl} took ${duration}ms`);
    }
    
    // Log performance metrics
    console.log(`Request: ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
  });
  
  next();
};


