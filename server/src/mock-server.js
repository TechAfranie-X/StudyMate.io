import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mock server is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: "StudyMate Mock API running" });
});

// Mock API routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Mock API is running',
    timestamp: new Date().toISOString()
  });
});

// Mock tasks data
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

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  // For demo purposes, always authenticate
  req.user = { id: 1, email: 'demo@studymate.com', name: 'Demo User' };
  next();
};

// Tasks endpoints
app.get('/api/tasks', mockAuth, (req, res) => {
  res.json({
    success: true,
    data: mockTasks,
    message: 'Tasks retrieved successfully'
  });
});

app.post('/api/tasks', mockAuth, (req, res) => {
  const newTask = {
    id: mockTasks.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    progress: 0
  };
  mockTasks.push(newTask);
  res.status(201).json({
    success: true,
    data: newTask,
    message: 'Task created successfully'
  });
});

app.put('/api/tasks/:id', mockAuth, (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
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

app.delete('/api/tasks/:id', mockAuth, (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  mockTasks.splice(taskIndex, 1);
  
  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { id: 1, email: 'demo@studymate.com', name: 'Demo User' },
      token: 'mock-jwt-token-for-demo'
    },
    message: 'Login successful'
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { id: 1, email: req.body.email, name: req.body.name },
      token: 'mock-jwt-token-for-demo'
    },
    message: 'Registration successful'
  });
});

app.get('/api/auth/me', mockAuth, (req, res) => {
  res.json({
    success: true,
    data: req.user,
    message: 'User profile retrieved'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 StudyMate Mock API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔧 This is a mock server for testing premium features`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down mock server...');
  process.exit(0);
});
