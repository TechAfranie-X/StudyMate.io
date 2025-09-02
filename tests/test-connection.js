// Test script to verify StudyMate frontend-backend communication
import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:5001';
const FRONTEND_URL = 'http://localhost:3000';

async function testBackend() {
  console.log('🧪 Testing backend connectivity...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${BACKEND_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test tasks endpoint
    const tasksResponse = await fetch(`${BACKEND_URL}/api/tasks`);
    const tasksData = await tasksResponse.json();
    console.log('✅ Tasks endpoint:', tasksData.success ? 'Working' : 'Failed');
    console.log(`   Found ${tasksData.data?.length || 0} tasks`);
    
    // Test authentication
    const authResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' })
    });
    const authData = await authResponse.json();
    console.log('✅ Authentication:', authData.success ? 'Working' : 'Failed');
    
    return true;
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    return false;
  }
}

async function testFrontend() {
  console.log('\n🧪 Testing frontend connectivity...');
  
  try {
    const response = await fetch(FRONTEND_URL);
    if (response.ok) {
      console.log('✅ Frontend is accessible');
      return true;
    } else {
      console.log('❌ Frontend returned status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Frontend test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 StudyMate Connection Test\n');
  
  const backendOk = await testBackend();
  const frontendOk = await testFrontend();
  
  console.log('\n📊 Test Results:');
  console.log(`Backend: ${backendOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend: ${frontendOk ? '✅ PASS' : '❌ FAIL'}`);
  
  if (backendOk && frontendOk) {
    console.log('\n🎉 All tests passed! StudyMate is ready to use.');
    console.log('\n📝 Next steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Login with any email/password (mock authentication)');
    console.log('3. Verify tasks are displayed on the dashboard');
    console.log('4. Test creating, editing, and deleting tasks');
  } else {
    console.log('\n⚠️ Some tests failed. Check the server logs above.');
  }
}

runTests().catch(console.error);














