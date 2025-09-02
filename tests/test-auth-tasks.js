// Test script for authenticated task routes
// Run with: node test-auth-tasks.js

const API_BASE = 'http://localhost:5000/api';

// Test user credentials
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

let authToken = null;

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.message || 'Request failed'}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error.message);
    throw error;
  }
}

// Test functions
async function testRegister() {
  console.log('\n🔐 Testing user registration...');
  try {
    const result = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser)
    });
    
    authToken = result.data.token;
    console.log('✅ Registration successful');
    console.log('Token:', authToken.substring(0, 20) + '...');
    return result;
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('⚠️  User already exists, trying login...');
      return await testLogin();
    }
    throw error;
  }
}

async function testLogin() {
  console.log('\n🔐 Testing user login...');
  try {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(testUser)
    });
    
    authToken = result.data.token;
    console.log('✅ Login successful');
    console.log('Token:', authToken.substring(0, 20) + '...');
    return result;
  } catch (error) {
    throw error;
  }
}

async function testCreateTask() {
  console.log('\n📝 Testing task creation...');
  try {
    const taskData = {
      title: 'Complete Project Documentation',
      description: 'Write comprehensive documentation for the StudyMate project',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      priority: 'HIGH'
    };

    const result = await apiRequest('/tasks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(taskData)
    });
    
    console.log('✅ Task created successfully');
    console.log('Task ID:', result.data.id);
    return result.data;
  } catch (error) {
    throw error;
  }
}

async function testGetTasks() {
  console.log('\n📋 Testing get all tasks...');
  try {
    const result = await apiRequest('/tasks', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ Tasks retrieved successfully');
    console.log('Number of tasks:', result.count);
    return result.data;
  } catch (error) {
    throw error;
  }
}

async function testUpdateTask(taskId) {
  console.log('\n✏️  Testing task update...');
  try {
    const updateData = {
      title: 'Updated: Complete Project Documentation',
      priority: 'MEDIUM'
    };

    const result = await apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(updateData)
    });
    
    console.log('✅ Task updated successfully');
    return result.data;
  } catch (error) {
    throw error;
  }
}

async function testDeleteTask(taskId) {
  console.log('\n🗑️  Testing task deletion...');
  try {
    await apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ Task deleted successfully');
  } catch (error) {
    throw error;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting authenticated task routes tests...\n');
  
  try {
    // Step 1: Register/Login user
    await testRegister();
    
    // Step 2: Create a task
    const createdTask = await testCreateTask();
    
    // Step 3: Get all tasks
    await testGetTasks();
    
    // Step 4: Update the task
    await testUpdateTask(createdTask.id);
    
    // Step 5: Get tasks again to see the update
    await testGetTasks();
    
    // Step 6: Delete the task
    await testDeleteTask(createdTask.id);
    
    // Step 7: Verify deletion
    await testGetTasks();
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests };
