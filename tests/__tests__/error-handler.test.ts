import { errorHandler, notFound, AppError, asyncHandler, performanceMonitor } from '../middleware/errorHandler.js';

// Mock console methods
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Error Handler Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {
      method: 'GET',
      originalUrl: '/api/test',
      get: jest.fn().mockReturnValue('test-user-agent'),
      ip: '127.0.0.1',
      user: { id: 'user123' }
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
      on: jest.fn()
    };

    mockNext = jest.fn();

    // Reset mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
    mockConsoleWarn.mockRestore();
    mockConsoleLog.mockRestore();
  });

  describe('Database Errors', () => {
    it('handles P2002 unique constraint error', () => {
      const error = { code: 'P2002', message: 'Unique constraint failed' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 409,
          message: 'A record with this unique field already exists',
          timestamp: expect.any(String),
          path: '/api/test'
        }
      });
    });

    it('handles P2025 record not found error', () => {
      const error = { code: 'P2025', message: 'Record not found' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 404,
          message: 'Record not found',
          timestamp: expect.any(String),
          path: '/api/test'
        }
      });
    });

    it('handles P2003 foreign key constraint error', () => {
      const error = { code: 'P2003', message: 'Foreign key constraint failed' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 400,
          message: 'Foreign key constraint failed',
          timestamp: expect.any(String),
          path: '/api/test'
        }
      });
    });

    it('handles unknown database error codes', () => {
      const error = { code: 'UNKNOWN_CODE', message: 'Unknown error' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 500,
          message: 'Unknown error',
          timestamp: expect.any(String),
          path: '/api/test'
        }
      });
    });
  });

  describe('Validation Errors', () => {
    it('handles validation errors with array format', () => {
      const error = {
        name: 'ValidationError',
        errors: [
          { path: 'email', message: 'Invalid email format' },
          { path: 'password', message: 'Password too short' }
        ]
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 400,
          message: 'Validation failed',
          timestamp: expect.any(String),
          path: '/api/test',
          details: [
            { field: 'email', message: 'Invalid email format' },
            { field: 'password', message: 'Password too short' }
          ]
        }
      });
    });

    it('handles validation errors with object format', () => {
      const error = {
        name: 'ValidationError',
        errors: { email: 'Invalid email format' }
      };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 400,
          message: 'Validation failed',
          timestamp: expect.any(String),
          path: '/api/test',
          details: { email: 'Invalid email format' }
        }
      });
    });
  });

  describe('JWT Errors', () => {
    it('handles JsonWebTokenError', () => {
      const error = { name: 'JsonWebTokenError', message: 'Invalid token' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 401,
          message: 'Invalid authentication token',
          timestamp: expect.any(String),
          path: '/api/test'
        }
      });
    });

    it('handles TokenExpiredError', () => {
      const error = { name: 'TokenExpiredError', message: 'Token expired' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 401,
          message: 'Authentication token expired',
          timestamp: expect.any(String),
          path: '/api/test'
        }
      });
    });
  });

  describe('File Upload Errors', () => {
    it('handles file size limit error', () => {
      const error = { code: 'LIMIT_FILE_SIZE', message: 'File too large' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 400,
          message: 'File size too large',
          timestamp: expect.any(String),
          path: '/api/test'
        }
      });
    });

    it('handles unexpected file field error', () => {
      const error = { code: 'LIMIT_UNEXPECTED_FILE', message: 'Unexpected file' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 400,
          message: 'Unexpected file field',
          timestamp: expect.any(String),
          path: '/api/test'
        }
      });
    });
  });

  describe('Network Errors', () => {
    it('handles connection reset error', () => {
      const error = { code: 'ECONNRESET', message: 'Connection reset' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(503);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 503,
          message: 'Service temporarily unavailable',
          timestamp: expect.any(String),
          path: '/api/test'
        }
      });
    });

    it('handles host not found error', () => {
      const error = { code: 'ENOTFOUND', message: 'Host not found' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(503);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 503,
          message: 'Service temporarily unavailable',
          timestamp: expect.any(String),
          path: '/api/test'
        }
      });
    });
  });

  describe('Custom Application Errors', () => {
    it('handles operational errors', () => {
      const error = new AppError('Custom error message', 400);
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 400,
          message: 'Custom error message',
          timestamp: expect.any(String),
          path: '/api/test'
        }
      });
    });

    it('handles non-operational errors', () => {
      const error = new AppError('System error', 500, false);
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 500,
          message: 'System error',
          timestamp: expect.any(String),
          path: '/api/test'
        }
      });
    });
  });

  describe('Headers Already Sent', () => {
    it('calls next when headers already sent', () => {
      mockRes.headersSent = true;
      const error = { message: 'Test error' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('Environment-based Error Handling', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('includes stack trace in development', () => {
      process.env.NODE_ENV = 'development';
      const error = { message: 'Test error', stack: 'Error stack trace' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            stack: 'Error stack trace'
          })
        })
      );
    });

    it('hides stack trace in production', () => {
      process.env.NODE_ENV = 'production';
      const error = { message: 'Test error', stack: 'Error stack trace' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.not.objectContaining({
            stack: expect.anything()
          })
        })
      );
    });
  });

  describe('Error Logging', () => {
    it('logs error with context information', () => {
      const error = { message: 'Test error', name: 'TestError' };
      
      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockConsoleError).toHaveBeenCalledWith('Error occurred:', {
        timestamp: expect.any(String),
        method: 'GET',
        url: '/api/test',
        userAgent: 'test-user-agent',
        ip: '127.0.0.1',
        userId: 'user123',
        error: {
          name: 'TestError',
          message: 'Test error',
          code: undefined,
          stack: undefined
        }
      });
    });
  });
});

describe('Not Found Handler', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = { originalUrl: '/api/nonexistent' };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('returns 404 with helpful information', () => {
    notFound(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 404,
        message: 'Route /api/nonexistent not found',
        timestamp: expect.any(String),
        path: '/api/nonexistent',
        suggestions: [
          'Check the URL spelling',
          'Verify the HTTP method',
          'Ensure the endpoint exists'
        ]
      }
    });
  });
});

describe('AppError Class', () => {
  it('creates operational error by default', () => {
    const error = new AppError('Test message', 400);
    
    expect(error.message).toBe('Test message');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
    expect(error.stack).toBeDefined();
  });

  it('creates non-operational error when specified', () => {
    const error = new AppError('System error', 500, false);
    
    expect(error.isOperational).toBe(false);
  });
});

describe('Async Handler', () => {
  it('wraps async function and catches errors', async () => {
    const mockAsyncFn = jest.fn().mockRejectedValue(new Error('Async error'));
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const wrappedHandler = asyncHandler(mockAsyncFn);
    await wrappedHandler(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it('passes through successful async function', async () => {
    const mockAsyncFn = jest.fn().mockResolvedValue('success');
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const wrappedHandler = asyncHandler(mockAsyncFn);
    await wrappedHandler(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('Performance Monitor', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = { method: 'GET', originalUrl: '/api/test' };
    mockRes = {
      statusCode: 200,
      on: jest.fn()
    };
    mockNext = jest.fn();

    // Mock Date.now for consistent timing
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(1000) // start time
      .mockReturnValueOnce(1500); // end time
  });

  it('monitors request performance', () => {
    performanceMonitor(mockReq, mockRes, mockNext);

    // Simulate response finish
    const finishCallback = mockRes.on.mock.calls.find((call: any) => call[0] === 'finish')[1];
    finishCallback();

    expect(mockConsoleLog).toHaveBeenCalledWith('Request: GET /api/test - 200 - 500ms');
  });

  it('warns about slow requests', () => {
    // Mock a slow request (over 1000ms)
    jest.spyOn(Date, 'now')
      .mockReturnValueOnce(1000) // start time
      .mockReturnValueOnce(2500); // end time (1500ms duration)

    performanceMonitor(mockReq, mockRes, mockNext);

    // Simulate response finish
    const finishCallback = mockRes.on.mock.calls.find((call: any) => call[0] === 'finish')[1];
    finishCallback();

    expect(mockConsoleWarn).toHaveBeenCalledWith('Slow request: GET /api/test took 1500ms');
  });

  it('calls next middleware', () => {
    performanceMonitor(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
