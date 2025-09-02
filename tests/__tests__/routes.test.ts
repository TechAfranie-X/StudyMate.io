import request from 'supertest';
import express from 'express';
import { testPrisma, createTestUser, createTestTask } from './setup.js';
import authRoutes from '../routes/auth.js';
import taskRoutes from '../routes/tasks.js';
import { authenticateToken } from '../middleware/auth.js';

// Mock the auth middleware for testing
jest.mock('../middleware/auth.js', () => ({
  authenticateToken: jest.fn((req, res, next) => next())
}));

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (authenticateToken as jest.Mock).mockImplementation((req, res, next) => next());
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 400 for invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for weak password', async () => {
      const userData = {
        email: 'user@example.com',
        password: '123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 409 for duplicate email', async () => {
      // Create a user first
      await createTestUser('existing@example.com', 'password123');

      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await createTestUser('test@example.com', 'password123');
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', loginData.email);
    });

    it('should return 401 for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 401 for invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user when authenticated', async () => {
      const user = await createTestUser('current@example.com', 'password123');
      
      // Mock the authenticated user
      (authenticateToken as jest.Mock).mockImplementation((req, res, next) => {
        req.user = user;
        next();
      });

      const response = await request(app)
        .get('/api/auth/me')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', user.email);
    });
  });
});

describe('Task Routes', () => {
  let testUser: any;
  let authToken: string;

  beforeEach(async () => {
    testUser = await createTestUser('taskuser@example.com', 'password123');
    authToken = 'mock-jwt-token';
    
    // Mock authentication
    (authenticateToken as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { id: testUser.id, email: testUser.email };
      next();
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks for authenticated user', async () => {
      // Create some test tasks
      await createTestTask(testUser.id, { title: 'Task 1' });
      await createTestTask(testUser.id, { title: 'Task 2' });

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('tasks');
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks).toHaveLength(2);
    });

    it('should return empty array when user has no tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('tasks');
      expect(response.body.tasks).toHaveLength(0);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return task by ID when it belongs to user', async () => {
      const task = await createTestTask(testUser.id, { title: 'Specific Task' });

      const response = await request(app)
        .get(`/api/tasks/${task.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('task');
      expect(response.body.task).toHaveProperty('title', 'Specific Task');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/api/tasks/999999')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('task');
      expect(response.body.task).toHaveProperty('title', taskData.title);
      expect(response.body.task).toHaveProperty('userId', testUser.id);
    });

    it('should return 400 for invalid task data', async () => {
      const taskData = {
        description: 'Task description without title'
        // Missing required title field
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task successfully', async () => {
      const task = await createTestTask(testUser.id, { title: 'Original Title' });
      const updateData = { title: 'Updated Title' };

      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('task');
      expect(response.body.task).toHaveProperty('title', 'Updated Title');
    });

    it('should return 404 for non-existent task', async () => {
      const updateData = { title: 'Updated Title' };

      const response = await request(app)
        .put('/api/tasks/999999')
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete task successfully', async () => {
      const task = await createTestTask(testUser.id, { title: 'Task to Delete' });

      const response = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');

      // Verify task is deleted
      const getResponse = await request(app)
        .get(`/api/tasks/${task.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .delete('/api/tasks/999999')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });
});

