import request from 'supertest';
import express from 'express';
import { testPrisma, createTestUser, createTestTask } from './setup';
import taskRoutes from '../routes/task.routes.js';
import authRoutes from '../routes/authRoutes.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

describe('Task Management Flow', () => {
  let authToken: string;
  let userId: string;
  let secondUserToken: string;
  let secondUserId: string;

  beforeEach(async () => {
    // Create first user and get token
    const user1 = await createTestUser('user1@example.com', 'password123');
    userId = String(user1.id);

    const loginResponse1 = await request(app)
      .post('/auth/login')
      .send({
        email: 'user1@example.com',
        password: 'password123'
      });

    authToken = loginResponse1.body.data.token;

    // Create second user and get token
    const user2 = await createTestUser('user2@example.com', 'password123');
    secondUserId = String(user2.id);

    const loginResponse2 = await request(app)
      .post('/auth/login')
      .send({
        email: 'user2@example.com',
        password: 'password123'
      });

    secondUserToken = loginResponse2.body.data.token;
  });

  describe('POST /tasks - Create Task', () => {
    it('should create a task successfully', async () => {
      const taskData = {
        title: 'Complete Project Documentation',
        description: 'Write comprehensive documentation',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'HIGH'
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.userId).toBe(userId);
    });

    it('should return 400 for missing title', async () => {
      const taskData = {
        priority: 'HIGH'
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const taskData = {
        title: 'Unauthorized Task',
        priority: 'HIGH'
      };

      const response = await request(app)
        .post('/tasks')
        .send(taskData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /tasks - Get All Tasks', () => {
    beforeEach(async () => {
      await createTestTask(userId, { title: 'User 1 Task 1', priority: 'HIGH' });
      await createTestTask(userId, { title: 'User 1 Task 2', priority: 'MEDIUM' });
      await createTestTask(secondUserId, { title: 'User 2 Task', priority: 'LOW' });
    });

    it('should get all tasks for authenticated user only', async () => {
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/tasks')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /tasks/:id - Update Task', () => {
    let taskId: string;

    beforeEach(async () => {
      const task = await createTestTask(userId, {
        title: 'Original Task',
        priority: 'LOW'
      });
      taskId = String(task.id);
    });

    it('should update task successfully', async () => {
      const updateData = {
        title: 'Updated Task Title',
        priority: 'HIGH'
      };

      const response = await request(app)
        .put(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
    });

    it('should return 404 for task belonging to another user', async () => {
      const otherTask = await createTestTask(secondUserId, {
        title: 'Other User Task',
        priority: 'LOW'
      });

      const response = await request(app)
        .put(`/tasks/${otherTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Unauthorized Update' })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /tasks/:id - Delete Task', () => {
    let taskId: string;

    beforeEach(async () => {
      const task = await createTestTask(userId, {
        title: 'Task to Delete',
        priority: 'MEDIUM'
      });
      taskId = String(task.id);
    });

    it('should delete task successfully', async () => {
      const response = await request(app)
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 for task belonging to another user', async () => {
      const otherTask = await createTestTask(secondUserId, {
        title: 'Other User Task',
        priority: 'LOW'
      });

      const response = await request(app)
        .delete(`/tasks/${otherTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
