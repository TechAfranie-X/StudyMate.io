import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all tasks for a user
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await prisma.task.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task'
    });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, subject, dueDate, estimatedTime, priority, tags, attachments } = req.body;

    console.log('Creating task with data:', {
      userId,
      title,
      description,
      subject,
      dueDate,
      estimatedTime,
      priority,
      tags,
      attachments
    });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        subject,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedTime: estimatedTime ? parseInt(estimatedTime) : null,
        priority: priority ? priority.toUpperCase() : 'MEDIUM',
        status: 'PENDING',
        tags: tags ? JSON.stringify(tags) : JSON.stringify([]),
        attachments: attachments ? JSON.stringify(attachments) : JSON.stringify([]),
        userId
      }
    });

    console.log('Task created successfully:', task);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    console.error('Error creating task:', error);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updateData = req.body;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Handle date conversion
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    // Handle priority conversion
    if (updateData.priority) {
      updateData.priority = updateData.priority.toUpperCase();
    }

    // Handle estimated time conversion
    if (updateData.estimatedTime) {
      updateData.estimatedTime = parseInt(updateData.estimatedTime);
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task'
    });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await prisma.task.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task'
    });
  }
};

