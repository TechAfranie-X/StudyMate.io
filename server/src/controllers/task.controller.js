import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const userId = req.user.id; // From JWT payload

    // Validation
    if (!title || !priority) {
      return res.status(400).json({
        success: false,
        message: 'title and priority are required'
      });
    }

    // Validate priority
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'priority must be one of: LOW, MEDIUM, HIGH'
      });
    }

    // Parse due date safely
    const parsedDueDate = dueDate && !isNaN(Date.parse(dueDate))
      ? new Date(dueDate)
      : null;

    // Create task using Prisma
    const newTask = await prisma.task.create({
      data: {
        userId,
        title,
        description,
        dueDate: parsedDueDate,
        priority
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
};

// Get all tasks for the logged-in user
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT payload

    // Get tasks filtered by userId using Prisma
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map priority to status for frontend compatibility
    const tasksWithStatus = tasks.map(task => {
      let status = 'pending'; // default
      switch (task.priority) {
        case 'LOW':
          status = 'completed';
          break;
        case 'MEDIUM':
          status = 'in-progress';
          break;
        case 'HIGH':
          status = 'pending';
          break;
      }
      return {
        ...task,
        status
      };
    });

    res.status(200).json({
      success: true,
      data: tasksWithStatus,
      count: tasksWithStatus.length
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
};

// Update a task (ensure task.userId === loggedInUser.id)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status } = req.body;
    const userId = req.user.id; // From JWT payload

    // First, check if the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to update it'
      });
    }

    // Validate priority if provided
    if (priority) {
      const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({
          success: false,
          message: 'priority must be one of: LOW, MEDIUM, HIGH'
        });
      }
    }

    // Handle status updates by mapping to priority
    let updatedPriority = priority;
    if (status) {
      // Map status to priority for backward compatibility
      switch (status) {
        case 'completed':
          updatedPriority = 'LOW'; // Completed tasks are low priority
          break;
        case 'in-progress':
          updatedPriority = 'MEDIUM'; // In-progress tasks are medium priority
          break;
        case 'pending':
          updatedPriority = 'HIGH'; // Pending tasks are high priority
          break;
        default:
          // Keep existing priority if status is not recognized
          break;
      }
    }

    // Parse due date safely
    const parsedDueDate = (dueDate !== undefined && !isNaN(Date.parse(dueDate)))
      ? new Date(dueDate)
      : (dueDate !== undefined ? null : undefined);

    // Update task using Prisma
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(parsedDueDate !== undefined && { dueDate: parsedDueDate }),
        ...(updatedPriority && { priority: updatedPriority })
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
};

// Delete a task (ensure task.userId === loggedInUser.id)
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From JWT payload

    // First, check if the task exists and belongs to the user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to delete it'
      });
    }

    // Delete task using Prisma
    await prisma.task.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
};

// Get a single task by ID (ensure task.userId === loggedInUser.id)
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From JWT payload

    // Get task filtered by userId using Prisma
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to access it'
      });
    }

    // Map priority to status for frontend compatibility
    let status = 'pending'; // default
    switch (task.priority) {
      case 'LOW':
        status = 'completed';
        break;
      case 'MEDIUM':
        status = 'in-progress';
        break;
      case 'HIGH':
        status = 'pending';
        break;
    }

    const taskWithStatus = {
      ...task,
      status
    };

    res.status(200).json({
      success: true,
      data: taskWithStatus
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
      error: error.message
    });
  }
};
