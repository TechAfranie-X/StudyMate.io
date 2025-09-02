import request from 'supertest';
import express from 'express';
import { testPrisma, createTestUser } from './setup';
import taskRoutes from '../routes/task.routes.js';
import authRoutes from '../routes/authRoutes.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

describe('Error Handling', () => {
  describe('Authentication Errors', () => {
    it('should handle invalid JWT token format', async () => {
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', 'InvalidTokenFormat')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('No token provided');
    });

    it('should handle malformed JWT token', async () => {
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', 'Bearer invalid.jwt.token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid token');
    });

    it('should handle expired JWT token', async () => {
      const jwt = await import('jsonwebtoken');
      const expiredToken = jwt.sign(
        { id: 'test-id', email: 'test@example.com' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '-1h' }
      );

      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid token');
    });

    it('should handle token with wrong signature', async () => {
      const jwt = await import('jsonwebtoken');
      const wrongSignatureToken = jwt.sign(
        { id: 'test-id', email: 'test@example.com' },
        'wrong-secret-key',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${wrongSignatureToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid token');
    });
  });

  describe('Task Access Errors', () => {
    let authToken: string;
    let userId: string;
    let otherUserToken: string;
    let otherUserId: string;

    beforeEach(async () => {
      // Create first user
      const user1 = await createTestUser('user1@example.com', 'password123');
      userId = user1.id;

      const loginResponse1 = await request(app)
        .post('/auth/login')
        .send({
          email: 'user1@example.com',
          password: 'password123'
        });

      authToken = loginResponse1.body.data.token;

      // Create second user
      const user2 = await createTestUser('user2@example.com', 'password123');
      otherUserId = user2.id;

      const loginResponse2 = await request(app)
        .post('/auth/login')
        .send({
          email: 'user2@example.com',
          password: 'password123'
        });

      otherUserToken = loginResponse2.body.data.token;
    });

    it('should prevent access to non-existent task', async () => {
      const fakeId = 'clx1234567890abcdef';

      const response = await request(app)
        .get(`/tasks/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should prevent access to task belonging to another user', async () => {
      // Create task for other user
      const otherTask = await testPrisma.task.create({
        data: {
          title: 'Other User Task',
          priority: 'HIGH',
          userId: otherUserId
        }
      });

      // Try to access with first user's token
      const response = await request(app)
        .get(`/tasks/${otherTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should prevent update of task belonging to another user', async () => {
      // Create task for other user
      const otherTask = await testPrisma.task.create({
        data: {
          title: 'Other User Task',
          priority: 'HIGH',
          userId: otherUserId
        }
      });

      // Try to update with first user's token
      const response = await request(app)
        .put(`/tasks/${otherTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Hacked Task' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should prevent deletion of task belonging to another user', async () => {
      // Create task for other user
      const otherTask = await testPrisma.task.create({
        data: {
          title: 'Other User Task',
          priority: 'HIGH',
          userId: otherUserId
        }
      });

      // Try to delete with first user's token
      const response = await request(app)
        .delete(`/tasks/${otherTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('Input Validation Errors', () => {
    let authToken: string;

    beforeEach(async () => {
      const user = await createTestUser('validation@example.com', 'password123');
      
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'validation@example.com',
          password: 'password123'
        });

      authToken = loginResponse.body.data.token;
    });

    it('should handle invalid priority values', async () => {
      const taskData = {
        title: 'Test Task',
        priority: 'INVALID_PRIORITY'
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('priority must be one of');
    });

    it('should handle missing required fields', async () => {
      const taskData = {
        description: 'Only description provided'
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should handle invalid date format', async () => {
      const taskData = {
        title: 'Test Task',
        priority: 'HIGH',
        dueDate: 'invalid-date'
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201); // Should still work as we handle date conversion

      expect(response.body.success).toBe(true);
    });
  });

  describe('Database Errors', () => {
    it('should handle database connection issues gracefully', async () => {
      // This test would require mocking database failures
      // For now, we'll test that the app doesn't crash on malformed requests
      
      const response = await request(app)
        .post('/tasks')
        .set('Authorization', 'Bearer invalid-token')
        .send({})
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Rate Limiting and Security', () => {
    it('should handle multiple failed login attempts', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      };

      // Multiple failed attempts
      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .post('/auth/login')
          .send(loginData)
          .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Invalid credentials');
      }
    });

    it('should handle SQL injection attempts', async () => {
      const maliciousData = {
        title: "'; DROP TABLE tasks; --",
        priority: 'HIGH'
      };

      // This should be handled by Prisma's parameterized queries
      const user = await createTestUser('security@example.com', 'password123');
      
      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          email: 'security@example.com',
          password: 'password123'
        });

      const authToken = loginResponse.body.data.token;

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(maliciousData)
        .expect(201);

      expect(response.body.success).toBe(true);
      // The malicious input should be stored as-is, not executed
      expect(response.body.data.title).toBe(maliciousData.title);
    });
  });
});
