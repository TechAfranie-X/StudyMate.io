// Comprehensive authentication test
import http from 'http';

const API_BASE = 'http://localhost:5000';

async function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (body) {
      const bodyString = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testAuth() {
  console.log('🔍 Comprehensive Authentication Test\n');

  try {
    // Test 1: Check server status
    console.log('1️⃣ Testing server status...');
    const statusResponse = await makeRequest('/api');
    console.log(`Status: ${statusResponse.status}`);
    console.log('Response:', statusResponse.data);
    console.log('✅ Server is running\n');

    // Test 2: Test login with correct credentials
    console.log('2️⃣ Testing login with correct credentials...');
    const loginResponse = await makeRequest('/api/auth/login', 'POST', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log(`Status: ${loginResponse.status}`);
    console.log('Response:', JSON.stringify(loginResponse.data, null, 2));
    
    if (loginResponse.status === 200 && loginResponse.data.success) {
      console.log('✅ Login successful!\n');
    } else {
      console.log('❌ Login failed\n');
    }

    // Test 3: Test login with wrong password
    console.log('3️⃣ Testing login with wrong password...');
    const wrongLoginResponse = await makeRequest('/api/auth/login', 'POST', {
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    console.log(`Status: ${wrongLoginResponse.status}`);
    console.log('Response:', JSON.stringify(wrongLoginResponse.data, null, 2));
    
    if (wrongLoginResponse.status === 401) {
      console.log('✅ Wrong password correctly rejected\n');
    } else {
      console.log('❌ Wrong password should have been rejected\n');
    }

    // Test 4: Test signup with new email
    console.log('4️⃣ Testing signup with new email...');
    const signupResponse = await makeRequest('/api/auth/register', 'POST', {
      email: 'newuser@example.com',
      password: 'newpassword123'
    });
    console.log(`Status: ${signupResponse.status}`);
    console.log('Response:', JSON.stringify(signupResponse.data, null, 2));
    
    if (signupResponse.status === 201 && signupResponse.data.success) {
      console.log('✅ Signup successful!\n');
    } else {
      console.log('❌ Signup failed\n');
    }

    // Test 5: Test signup with existing email
    console.log('5️⃣ Testing signup with existing email...');
    const existingSignupResponse = await makeRequest('/api/auth/register', 'POST', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log(`Status: ${existingSignupResponse.status}`);
    console.log('Response:', JSON.stringify(existingSignupResponse.data, null, 2));
    
    if (existingSignupResponse.status === 400) {
      console.log('✅ Existing email correctly rejected\n');
    } else {
      console.log('❌ Existing email should have been rejected\n');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testAuth();











