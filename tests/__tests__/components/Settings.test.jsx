import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Settings from '../../src/pages/Settings';

// Mock the hooks and context
jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Test bio'
    },
    updateProfile: jest.fn().mockResolvedValue({ success: true }),
    loading: false,
    error: null
  })
}));

jest.mock('../../src/context/ThemeContext', () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: jest.fn()
  })
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Camera: () => <span data-testid="camera-icon">Camera</span>,
  Upload: () => <span data-testid="upload-icon">Upload</span>,
  X: () => <span data-testid="x-icon">X</span>,
  User: () => <span data-testid="user-icon">User</span>,
  Mail: () => <span data-testid="mail-icon">Mail</span>,
  Shield: () => <span data-testid="shield-icon">Shield</span>,
  AlertCircle: () => <span data-testid="alert-icon">Alert</span>
}));

describe('Settings Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders settings page header correctly', () => {
    render(<Settings />);
    
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText(/Manage your StudyMate preferences and account settings/)).toBeInTheDocument();
  });

  it('displays user profile information correctly', () => {
    render(<Settings />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument();
  });

  it('shows user initials when no profile image is set', () => {
    render(<Settings />);
    
    const initialsElement = screen.getByText('T'); // First letter of test@example.com
    expect(initialsElement).toBeInTheDocument();
  });

  it('displays profile image when available', () => {
    const mockImageData = 'data:image/jpeg;base64,mock-image-data';
    localStorage.setItem('studymate_profile_image', mockImageData);
    
    render(<Settings />);
    
    const profileImage = screen.getByAltText('Profile');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', mockImageData);
  });

  it('enables editing mode when Edit Profile button is clicked', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    
    const editButton = screen.getByText('Edit Profile');
    await user.click(editButton);
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    
    // Check that form fields are enabled
    const firstNameInput = screen.getByDisplayValue('John');
    expect(firstNameInput).not.toBeDisabled();
  });

  it('allows editing profile fields in edit mode', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    
    // Enter edit mode
    const editButton = screen.getByText('Edit Profile');
    await user.click(editButton);
    
    // Edit first name
    const firstNameInput = screen.getByDisplayValue('John');
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jane');
    
    expect(firstNameInput).toHaveValue('Jane');
  });

  it('cancels editing and reverts changes', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    
    // Enter edit mode and make changes
    const editButton = screen.getByText('Edit Profile');
    await user.click(editButton);
    
    const firstNameInput = screen.getByDisplayValue('John');
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jane');
    
    // Cancel editing
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    // Check that changes are reverted
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  it('handles profile image upload', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    
    const file = new File(['mock image content'], 'test-image.jpg', { type: 'image/jpeg' });
    
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onload: null,
      result: 'data:image/jpeg;base64,mock-uploaded-image'
    };
    global.FileReader = jest.fn(() => mockFileReader);
    
    // Trigger file upload
    const changePhotoButton = screen.getByText('Change Photo');
    await user.click(changePhotoButton);
    
    // Simulate file selection
    const fileInput = screen.getByDisplayValue('').closest('input');
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Simulate FileReader completion
    mockFileReader.onload({ target: { result: mockFileReader.result } });
    
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('studymate_profile_image', mockFileReader.result);
    });
  });

  it('handles profile image removal', async () => {
    const user = userEvent.setup();
    const mockImageData = 'data:image/jpeg;base64,mock-image-data';
    localStorage.setItem('studymate_profile_image', mockImageData);
    
    render(<Settings />);
    
    const removeButton = screen.getByText('Remove');
    await user.click(removeButton);
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('studymate_profile_image');
  });

  it('displays theme toggle switch', () => {
    render(<Settings />);
    
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByText(/Switch between light and dark themes/)).toBeInTheDocument();
    
    const toggleSwitch = screen.getByRole('button', { name: /dark mode/i });
    expect(toggleSwitch).toBeInTheDocument();
  });

  it('displays account security information', () => {
    render(<Settings />);
    
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Last changed: Never')).toBeInTheDocument();
    expect(screen.getByText('Change')).toBeInTheDocument();
    
    expect(screen.getByText('Account Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('handles email field as read-only', () => {
    render(<Settings />);
    
    const emailInput = screen.getByDisplayValue('test@example.com');
    expect(emailInput).toBeDisabled();
    expect(emailInput).toHaveClass('cursor-not-allowed');
    
    expect(screen.getByText(/Email cannot be changed for security reasons/)).toBeInTheDocument();
  });

  it('validates file upload size limit', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    
    // Create a large file (over 5MB)
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large-image.jpg', { type: 'image/jpeg' });
    
    // Mock alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    // Trigger file upload
    const changePhotoButton = screen.getByText('Change Photo');
    await user.click(changePhotoButton);
    
    // Simulate file selection
    const fileInput = screen.getByDisplayValue('').closest('input');
    fireEvent.change(fileInput, { target: { files: [largeFile] } });
    
    expect(alertSpy).toHaveBeenCalledWith('Image size must be less than 5MB');
    
    alertSpy.mockRestore();
  });

  it('validates file upload type', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    
    // Create a non-image file
    const textFile = new File(['text content'], 'document.txt', { type: 'text/plain' });
    
    // Mock alert
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    // Trigger file upload
    const changePhotoButton = screen.getByText('Change Photo');
    await user.click(changePhotoButton);
    
    // Simulate file selection
    const fileInput = screen.getByDisplayValue('').closest('input');
    fireEvent.change(fileInput, { target: { files: [textFile] } });
    
    expect(alertSpy).toHaveBeenCalledWith('Please select an image file');
    
    alertSpy.mockRestore();
  });

  it('applies dark mode styles correctly', () => {
    // Mock dark mode context
    jest.doMock('../../src/context/ThemeContext', () => ({
      useTheme: () => ({
        isDark: true,
        toggleTheme: jest.fn()
      })
    }));
    
    render(<Settings />);
    
    // Check that dark mode classes are applied
    const mainContainer = screen.getByText('Settings').closest('div');
    expect(mainContainer).toHaveClass('dark:text-white');
  });

  it('handles loading state during profile update', async () => {
    // Mock loading state
    jest.doMock('../../src/hooks/useAuth', () => ({
      useAuth: () => ({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Test bio'
        },
        updateProfile: jest.fn().mockResolvedValue({ success: true }),
        loading: true,
        error: null
      })
    }));
    
    render(<Settings />);
    
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('displays error message when available', () => {
    // Mock error state
    jest.doMock('../../src/hooks/useAuth', () => ({
      useAuth: () => ({
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          bio: 'Test bio'
        },
        updateProfile: jest.fn().mockResolvedValue({ success: true }),
        loading: false,
        error: 'Failed to update profile'
      })
    }));
    
    render(<Settings />);
    
    expect(screen.getByText('Failed to update profile')).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });

  it('handles empty user data gracefully', () => {
    // Mock empty user data
    jest.doMock('../../src/hooks/useAuth', () => ({
      useAuth: () => ({
        user: null,
        updateProfile: jest.fn().mockResolvedValue({ success: true }),
        loading: false,
        error: null
      })
    }));
    
    render(<Settings />);
    
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('No email provided')).toBeInTheDocument();
  });
});
