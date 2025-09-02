// Test script to debug login issues
const API_BASE_URL = 'http://localhost:5000';

async function testLogin() {
  console.log('🔍 Testing login functionality...\n');
  
  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server connection...');
    const statusResponse = await fetch(`${API_BASE_URL}/api`);
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Server is running:', statusData.message);
    } else {
      console.log('❌ Server connection failed');
      return;
    }

    // Test 2: Test login endpoint
    console.log('\n2️⃣ Testing login endpoint...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    console.log('Response status:', loginResponse.status);
    console.log('Response headers:', Object.fromEntries(loginResponse.headers.entries()));

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('Response data:', JSON.stringify(loginData, null, 2));
    } else {
      const errorData = await loginResponse.text();
      console.log('❌ Login failed');
      console.log('Error response:', errorData);
    }

    // Test 3: Test with wrong credentials
    console.log('\n3️⃣ Testing with wrong password...');
    const wrongResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });

    if (wrongResponse.ok) {
      const wrongData = await wrongResponse.json();
      console.log('❌ Wrong password should have failed but succeeded:', wrongData);
    } else {
      const wrongErrorData = await wrongResponse.text();
      console.log('✅ Wrong password correctly rejected');
      console.log('Error response:', wrongErrorData);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

testLogin();











