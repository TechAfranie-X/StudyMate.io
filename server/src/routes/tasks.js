import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validateTaskInput } from '../middleware/validation.js';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

// All task routes require authentication
router.use(authenticateToken);

// GET /api/tasks - Get all tasks for the authenticated user
router.get('/', getTasks);

// GET /api/tasks/:id - Get a specific task by ID
router.get('/:id', getTaskById);

// POST /api/tasks - Create a new task
router.post('/', validateTaskInput, createTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', validateTaskInput, updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', deleteTask);

export default router;



