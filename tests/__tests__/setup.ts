import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Polyfills for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

if (typeof global.crypto === 'undefined') {
  global.crypto = require('crypto').webcrypto;
}

// Create a test database client
export const testPrisma = new PrismaClient();

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await testPrisma.$connect();
  
  // Clean up any existing test data (with error handling)
  try {
    await testPrisma.task.deleteMany();
  } catch (error) {
    // Table might not exist yet, that's okay
  }
  try {
    await testPrisma.user.deleteMany();
  } catch (error) {
    // Table might not exist yet, that's okay
  }
});

// Global test teardown
afterAll(async () => {
  // Clean up test data (with error handling)
  try {
    await testPrisma.task.deleteMany();
  } catch (error) {
    // Table might not exist, that's okay
  }
  try {
    await testPrisma.user.deleteMany();
  } catch (error) {
    // Table might not exist, that's okay
  }
  
  // Disconnect from database
  await testPrisma.$disconnect();
});

// Clean up after each test
afterEach(async () => {
  try {
    await testPrisma.task.deleteMany();
  } catch (error) {
    // Table might not exist, that's okay
  }
  try {
    await testPrisma.user.deleteMany();
  } catch (error) {
    // Table might not exist, that's okay
  }
});

// Test utilities
export const createTestUser = async (email: string = 'test@example.com', password: string = 'password123') => {
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);
  
  return await testPrisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });
};

export const createTestTask = async (userId: string, taskData: any = {}) => {
  const defaultTask = {
    title: 'Test Task',
    description: 'Test Description',
    priority: 'MEDIUM',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    ...taskData
  };

  return await testPrisma.task.create({
    data: {
      ...defaultTask,
      userId: String(userId)
    }
  });
};
