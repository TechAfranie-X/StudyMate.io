// Simple API test script
const testAPI = async () => {
  try {
    console.log('🧪 Testing StudyMate API...\n');

    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await fetch('http://localhost:5001/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);

    // Test 2: User registration
    console.log('\n2️⃣ Testing user registration...');
    const registerResponse = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'apitest@example.com',
        password: 'testpass123',
        name: 'API Test User'
      })
    });
    const registerData = await registerResponse.json();
    console.log('✅ Registration:', registerData.message);

    // Test 3: User login
    console.log('\n3️⃣ Testing user login...');
    const loginResponse = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'demo@studymate.com',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('✅ Login:', loginData.message);
    
    const token = loginData.data.token;
    console.log('🔑 Token received:', token ? 'Yes' : 'No');

    // Test 4: Get user profile
    console.log('\n4️⃣ Testing user profile...');
    const profileResponse = await fetch('http://localhost:5001/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const profileData = await profileResponse.json();
    console.log('✅ Profile:', profileData.message);

    // Test 5: Get tasks
    console.log('\n5️⃣ Testing get tasks...');
    const tasksResponse = await fetch('http://localhost:5001/api/tasks', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasksData = await tasksResponse.json();
    console.log('✅ Tasks:', `Found ${tasksData.count} tasks`);

    // Test 6: Create task
    console.log('\n6️⃣ Testing create task...');
    const createTaskResponse = await fetch('http://localhost:5001/api/tasks', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'API Test Task',
        description: 'This task was created via API testing',
        subject: 'Testing',
        priority: 'MEDIUM'
      })
    });
    
    if (createTaskResponse.ok) {
      const createTaskData = await createTaskResponse.json();
      console.log('✅ Create task:', createTaskData.message);
    } else {
      const errorData = await createTaskResponse.json();
      console.log('❌ Create task failed:', errorData.message);
      console.log('Status:', createTaskResponse.status);
    }

    console.log('\n🎉 API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testAPI();



