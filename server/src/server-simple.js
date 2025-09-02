import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Mock data
const mockTasks = [
  {
    id: 1,
    title: "Complete React Project",
    description: "Finish the premium features implementation",
    status: "in-progress",
    priority: "high",
    dueDate: "2024-01-15",
    estimatedTime: 4,
    progress: 75,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-12T14:30:00Z"
  },
  {
    id: 2,
    title: "Design System Documentation",
    description: "Create comprehensive design system docs",
    status: "pending",
    priority: "medium",
    dueDate: "2024-01-20",
    estimatedTime: 2,
    progress: 0,
    createdAt: "2024-01-11T09:00:00Z",
    updatedAt: "2024-01-11T09:00:00Z"
  },
  {
    id: 3,
    title: "User Testing Session",
    description: "Conduct user testing for premium features",
    status: "completed",
    priority: "high",
    dueDate: "2024-01-08",
    estimatedTime: 3,
    progress: 100,
    createdAt: "2024-01-05T11:00:00Z",
    updatedAt: "2024-01-08T16:00:00Z"
  },
  {
    id: 4,
    title: "Performance Optimization",
    description: "Optimize animations and loading states",
    status: "pending",
    priority: "low",
    dueDate: "2024-01-25",
    estimatedTime: 5,
    progress: 0,
    createdAt: "2024-01-12T08:00:00Z",
    updatedAt: "2024-01-12T08:00:00Z"
  },
  {
    id: 5,
    title: "Accessibility Audit",
    description: "Review and improve accessibility features",
    status: "in-progress",
    priority: "medium",
    dueDate: "2024-01-18",
    estimatedTime: 2,
    progress: 40,
    createdAt: "2024-01-09T13:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z"
  }
];

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: "StudyMate API running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      tasks: "/api/tasks"
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'StudyMate server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({ 
    message: "StudyMate API running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      tasks: "/api/tasks"
    }
  });
});

// Tasks routes (no authentication required for testing)
app.get('/api/tasks', (req, res) => {
  console.log('📋 GET /api/tasks - Returning mock tasks');
  console.log('🔐 Auth header:', req.headers.authorization ? 'Present' : 'Not present');
  res.json({
    success: true,
    data: mockTasks,
    message: 'Tasks retrieved successfully'
  });
});

app.post('/api/tasks', (req, res) => {
  console.log('📝 POST /api/tasks - Creating new task:', req.body);
  const newTask = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockTasks.push(newTask);
  res.status(201).json({
    success: true,
    data: newTask,
    message: 'Task created successfully'
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  console.log('🔄 PUT /api/tasks/:id - Updating task:', taskId, req.body);
  mockTasks[taskIndex] = {
    ...mockTasks[taskIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: mockTasks[taskIndex],
    message: 'Task updated successfully'
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  console.log('🗑️ DELETE /api/tasks/:id - Deleting task:', taskId);
  const deletedTask = mockTasks.splice(taskIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedTask,
    message: 'Task deleted successfully'
  });
});

// Authentication routes (mock for testing)
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 POST /api/auth/login - Mock login');
  console.log('📧 Login attempt for:', req.body.email);
  
  // Simple mock authentication - accept any email/password
  res.json({
    success: true,
    data: {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'user-1',
        email: req.body.email || 'test@example.com',
        name: 'Test User'
      }
    },
    message: 'Login successful'
  });
});

app.post('/api/auth/register', (req, res) => {
  console.log('📝 POST /api/auth/register - Mock registration');
  res.status(201).json({
    success: true,
    data: {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 'user-' + Date.now(),
        email: req.body.email,
        name: req.body.name || 'New User'
      }
    },
    message: 'Registration successful'
  });
});

app.get('/api/auth/me', (req, res) => {
  console.log('👤 GET /api/auth/me - Mock user info');
  res.json({
    success: true,
    data: {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User'
    },
    message: 'User info retrieved'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ Route not found:', req.originalUrl);
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 StudyMate Simple API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔧 This is a simple server for testing frontend-backend communication`);
  console.log(`📋 Mock tasks available at http://localhost:${PORT}/api/tasks`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});
