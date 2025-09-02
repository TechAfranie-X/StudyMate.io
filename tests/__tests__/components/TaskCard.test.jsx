import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from '../../src/components/TaskCard';

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="calendar-icon">Calendar</span>,
  Clock: () => <span data-testid="clock-icon">Clock</span>,
  Tag: () => <span data-testid="tag-icon">Tag</span>,
  Edit: () => <span data-testid="edit-icon">Edit</span>,
  Trash2: () => <span data-testid="trash-icon">Trash</span>,
}));

describe('TaskCard Component', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'This is a test task description',
    priority: 'HIGH',
    status: 'PENDING',
    dueDate: '2024-12-31T23:59:59.000Z',
    estimatedTime: 120, // 2 hours
    subject: 'Mathematics',
    tags: JSON.stringify(['algebra', 'calculus'])
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task description')).toBeInTheDocument();
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
    expect(screen.getByText('algebra')).toBeInTheDocument();
    expect(screen.getByText('calculus')).toBeInTheDocument();
  });

  it('displays priority badge with correct styling', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const priorityBadge = screen.getByText('HIGH');
    expect(priorityBadge).toBeInTheDocument();
    expect(priorityBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('displays status badge with correct styling', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const statusBadge = screen.getByText('PENDING');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('formats due date correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    // The date should be formatted according to locale
    expect(screen.getByText(/12\/31\/2024/)).toBeInTheDocument();
  });

  it('formats time estimate correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('2h 0m')).toBeInTheDocument();
  });

  it('handles missing due date gracefully', () => {
    const taskWithoutDate = { ...mockTask, dueDate: null };
    
    render(
      <TaskCard 
        task={taskWithoutDate} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('No due date')).toBeInTheDocument();
  });

  it('handles missing time estimate gracefully', () => {
    const taskWithoutTime = { ...mockTask, estimatedTime: null };
    
    render(
      <TaskCard 
        task={taskWithoutTime} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('No time estimate')).toBeInTheDocument();
  });

  it('handles missing subject gracefully', () => {
    const taskWithoutSubject = { ...mockTask, subject: null };
    
    render(
      <TaskCard 
        task={taskWithoutSubject} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.queryByTestId('tag-icon')).not.toBeInTheDocument();
  });

  it('handles missing tags gracefully', () => {
    const taskWithoutTags = { ...mockTask, tags: null };
    
    render(
      <TaskCard 
        task={taskWithoutTags} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.queryByText('algebra')).not.toBeInTheDocument();
    expect(screen.queryByText('calculus')).not.toBeInTheDocument();
  });

  it('handles invalid JSON tags gracefully', () => {
    const taskWithInvalidTags = { ...mockTask, tags: 'invalid-json' };
    
    render(
      <TaskCard 
        task={taskWithInvalidTags} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.queryByText('algebra')).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const editButton = screen.getByTitle('Edit task');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByTitle('Delete task');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('applies dark mode styles correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const card = screen.getByText('Test Task').closest('div').parentElement;
    expect(card).toHaveClass('dark:bg-gray-800', 'dark:border-gray-700');
  });

  it('displays different priority colors correctly', () => {
    const priorities = [
      { priority: 'HIGH', expectedClass: 'bg-red-100' },
      { priority: 'MEDIUM', expectedClass: 'bg-yellow-100' },
      { priority: 'LOW', expectedClass: 'bg-green-100' },
      { priority: 'UNKNOWN', expectedClass: 'bg-gray-100' }
    ];

    priorities.forEach(({ priority, expectedClass }) => {
      const taskWithPriority = { ...mockTask, priority };
      
      const { unmount } = render(
        <TaskCard 
          task={taskWithPriority} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      );

      const priorityBadge = screen.getByText(priority);
      expect(priorityBadge).toHaveClass(expectedClass);
      
      unmount();
    });
  });

  it('displays different status colors correctly', () => {
    const statuses = [
      { status: 'COMPLETED', expectedClass: 'bg-green-100' },
      { status: 'IN_PROGRESS', expectedClass: 'bg-blue-100' },
      { status: 'PENDING', expectedClass: 'bg-gray-100' },
      { status: 'UNKNOWN', expectedClass: 'bg-gray-100' }
    ];

    statuses.forEach(({ status, expectedClass }) => {
      const taskWithStatus = { ...mockTask, status };
      
      const { unmount } = render(
        <TaskCard 
          task={taskWithStatus} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      );

      const statusBadge = screen.getByText(status.replace('_', ' '));
      expect(statusBadge).toHaveClass(expectedClass);
      
      unmount();
    });
  });

  it('handles tasks with minimal data', () => {
    const minimalTask = {
      id: '2',
      title: 'Minimal Task'
    };

    render(
      <TaskCard 
        task={minimalTask} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Minimal Task')).toBeInTheDocument();
    expect(screen.queryByText('This is a test task description')).not.toBeInTheDocument();
    expect(screen.queryByText('Mathematics')).not.toBeInTheDocument();
  });
});
