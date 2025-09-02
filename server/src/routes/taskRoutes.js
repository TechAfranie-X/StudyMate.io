import express from 'express';
import {
  getAllTasks,
  getTasksByUserId,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus
} from '../controllers/taskController.js';

const router = express.Router();

// GET /api/tasks - Get all tasks
router.get('/', getAllTasks);

// GET /api/tasks/status/:status - Get tasks by status
router.get('/status/:status', getTasksByStatus);

// GET /api/tasks/user/:userId - Get tasks by user ID
router.get('/user/:userId', getTasksByUserId);

// GET /api/tasks/:id - Get task by ID
router.get('/:id', getTaskById);

// POST /api/tasks - Create new task
router.post('/', createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', deleteTask);

export default router;
