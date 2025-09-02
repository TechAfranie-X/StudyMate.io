import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskById
} from '../controllers/task.controller.js';

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authMiddleware);

// Task routes using controller functions
router.post('/', createTask);           // Create a new task
router.get('/', getTasks);              // Get all tasks for the logged-in user
router.get('/:id', getTaskById);        // Get a single task by ID
router.put('/:id', updateTask);         // Update a task by ID
router.delete('/:id', deleteTask);      // Delete a task by ID

export default router;
