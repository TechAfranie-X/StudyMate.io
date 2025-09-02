# Manual Testing Guide - Smart Task Manager MVP

## 🎯 **Overview**
This guide provides step-by-step manual testing instructions for the Smart Task Manager MVP using Postman or Insomnia. The tests cover authentication flow, task management, and error handling scenarios.

## 📋 **Prerequisites**
- Postman or Insomnia installed
- Smart Task Manager server running on `http://localhost:5000`
- Database properly configured and migrated

## 🔧 **Environment Setup**

### **Postman Environment Variables**
Create a new environment with these variables:
```
BASE_URL: http://localhost:5000/api
AUTH_TOKEN: (leave empty initially)
USER_ID: (leave empty initially)
TASK_ID: (leave empty initially)
```

### **Insomnia Environment Variables**
Create a new environment with the same variables as above.

## 🧪 **Test Suite 1: Authentication Flow**

### **1.1 User Registration**

#### **Test: Successful Registration**
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```
- **Expected Response**: 201 Created
- **Response Body**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "clx1234567890",
        "email": "testuser@example.com"
      }
    }
  }
  ```
- **Actions**:
  - Copy the `token` value to `{{AUTH_TOKEN}}`
  - Copy the `user.id` value to `{{USER_ID}}`

#### **Test: Duplicate Email Registration**
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Body** (same as above)
- **Expected Response**: 409 Conflict
- **Response Body**:
  ```json
  {
    "success": false,
    "message": "User with this email already exists"
  }
  ```

#### **Test: Invalid Email Format**
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Body**:
  ```json
  {
    "email": "invalid-email",
    "password": "password123"
  }
  ```
- **Expected Response**: 400 Bad Request

#### **Test: Missing Required Fields**
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/register`
- **Body**:
  ```json
  {
    "email": "test@example.com"
  }
  ```
- **Expected Response**: 400 Bad Request

### **1.2 User Login**

#### **Test: Successful Login**
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Body**:
  ```json
  {
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```
- **Expected Response**: 200 OK
- **Actions**: Update `{{AUTH_TOKEN}}` with the new token

#### **Test: Invalid Credentials**
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Body**:
  ```json
  {
    "email": "testuser@example.com",
    "password": "wrongpassword"
  }
  ```
- **Expected Response**: 401 Unauthorized

#### **Test: Non-existent User**
- **Method**: POST
- **URL**: `{{BASE_URL}}/auth/login`
- **Body**:
  ```json
  {
    "email": "nonexistent@example.com",
    "password": "password123"
  }
  ```
- **Expected Response**: 401 Unauthorized

### **1.3 Token Validation**

#### **Test: Valid Token Access**
- **Method**: GET
- **URL**: `{{BASE_URL}}/tasks`
- **Headers**:
  ```
  Authorization: Bearer {{AUTH_TOKEN}}
  ```
- **Expected Response**: 200 OK

#### **Test: Missing Token**
- **Method**: GET
- **URL**: `{{BASE_URL}}/tasks`
- **Expected Response**: 401 Unauthorized

#### **Test: Invalid Token Format**
- **Method**: GET
- **URL**: `{{BASE_URL}}/tasks`
- **Headers**:
  ```
  Authorization: InvalidToken
  ```
- **Expected Response**: 401 Unauthorized

#### **Test: Malformed Token**
- **Method**: GET
- **URL**: `{{BASE_URL}}/tasks`
- **Headers**:
  ```
  Authorization: Bearer invalid.jwt.token
  ```
- **Expected Response**: 401 Unauthorized

## 🧪 **Test Suite 2: Task Management Flow**

### **2.1 Create Tasks**

#### **Test: Create Task with All Fields**
- **Method**: POST
- **URL**: `{{BASE_URL}}/tasks`
- **Headers**:
  ```
  Authorization: Bearer {{AUTH_TOKEN}}
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "title": "Complete Project Documentation",
    "description": "Write comprehensive documentation for the StudyMate project",
    "dueDate": "2024-01-15T23:59:59.000Z",
    "priority": "HIGH"
  }
  ```
- **Expected Response**: 201 Created
- **Actions**: Copy the `data.id` to `{{TASK_ID}}`

#### **Test: Create Task with Minimal Fields**
- **Method**: POST
- **URL**: `{{BASE_URL}}/tasks`
- **Body**:
  ```json
  {
    "title": "Simple Task",
    "priority": "MEDIUM"
  }
  ```
- **Expected Response**: 201 Created

#### **Test: Create Task with Invalid Priority**
- **Method**: POST
- **URL**: `{{BASE_URL}}/tasks`
- **Body**:
  ```json
  {
    "title": "Invalid Priority Task",
    "priority": "INVALID"
  }
  ```
- **Expected Response**: 400 Bad Request

#### **Test: Create Task Without Authentication**
- **Method**: POST
- **URL**: `{{BASE_URL}}/tasks`
- **Body**:
  ```json
  {
    "title": "Unauthorized Task",
    "priority": "HIGH"
  }
  ```
- **Expected Response**: 401 Unauthorized

### **2.2 Read Tasks**

#### **Test: Get All Tasks**
- **Method**: GET
- **URL**: `{{BASE_URL}}/tasks`
- **Headers**:
  ```
  Authorization: Bearer {{AUTH_TOKEN}}
  ```
- **Expected Response**: 200 OK
- **Response Body**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "clx1234567890",
        "title": "Complete Project Documentation",
        "description": "Write comprehensive documentation...",
        "dueDate": "2024-01-15T23:59:59.000Z",
        "priority": "HIGH",
        "createdAt": "2024-01-08T10:30:00.000Z",
        "updatedAt": "2024-01-08T10:30:00.000Z",
        "userId": "clx0987654321",
        "user": {
          "id": "clx0987654321",
          "email": "testuser@example.com"
        }
      }
    ],
    "count": 1
  }
  ```

#### **Test: Get Single Task**
- **Method**: GET
- **URL**: `{{BASE_URL}}/tasks/{{TASK_ID}}`
- **Headers**:
  ```
  Authorization: Bearer {{AUTH_TOKEN}}
  ```
- **Expected Response**: 200 OK

#### **Test: Get Non-existent Task**
- **Method**: GET
- **URL**: `{{BASE_URL}}/tasks/clx1234567890abcdef`
- **Headers**:
  ```
  Authorization: Bearer {{AUTH_TOKEN}}
  ```
- **Expected Response**: 404 Not Found

### **2.3 Update Tasks**

#### **Test: Update Task Successfully**
- **Method**: PUT
- **URL**: `{{BASE_URL}}/tasks/{{TASK_ID}}`
- **Headers**:
  ```
  Authorization: Bearer {{AUTH_TOKEN}}
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "title": "Updated: Complete Project Documentation",
    "priority": "MEDIUM"
  }
  ```
- **Expected Response**: 200 OK

#### **Test: Update Non-existent Task**
- **Method**: PUT
- **URL**: `{{BASE_URL}}/tasks/clx1234567890abcdef`
- **Body**:
  ```json
  {
    "title": "Updated Task"
  }
  ```
- **Expected Response**: 404 Not Found

#### **Test: Update Task with Invalid Priority**
- **Method**: PUT
- **URL**: `{{BASE_URL}}/tasks/{{TASK_ID}}`
- **Body**:
  ```json
  {
    "priority": "INVALID_PRIORITY"
  }
  ```
- **Expected Response**: 400 Bad Request

### **2.4 Delete Tasks**

#### **Test: Delete Task Successfully**
- **Method**: DELETE
- **URL**: `{{BASE_URL}}/tasks/{{TASK_ID}}`
- **Headers**:
  ```
  Authorization: Bearer {{AUTH_TOKEN}}
  ```
- **Expected Response**: 200 OK

#### **Test: Delete Non-existent Task**
- **Method**: DELETE
- **URL**: `{{BASE_URL}}/tasks/clx1234567890abcdef`
- **Headers**:
  ```
  Authorization: Bearer {{AUTH_TOKEN}}
  ```
- **Expected Response**: 404 Not Found

## 🧪 **Test Suite 3: User Isolation and Security**

### **3.1 Multi-User Testing**

#### **Setup: Create Second User**
1. Register a second user:
   ```json
   {
     "email": "user2@example.com",
     "password": "password123"
   }
   ```
2. Login with second user and save token as `{{AUTH_TOKEN_2}}`

#### **Test: User Isolation - Get Tasks**
1. Create tasks with User 1 (using `{{AUTH_TOKEN}}`)
2. Create tasks with User 2 (using `{{AUTH_TOKEN_2}}`)
3. Get tasks with User 1 - should only see User 1's tasks
4. Get tasks with User 2 - should only see User 2's tasks

#### **Test: Cross-User Access Prevention**
1. Create a task with User 1
2. Try to access/update/delete that task with User 2's token
3. All operations should return 404 Not Found

### **3.2 Security Testing**

#### **Test: SQL Injection Prevention**
- **Method**: POST
- **URL**: `{{BASE_URL}}/tasks`
- **Body**:
  ```json
  {
    "title": "'; DROP TABLE tasks; --",
    "priority": "HIGH"
  }
  ```
- **Expected**: Task should be created with the literal string, not execute SQL

#### **Test: XSS Prevention**
- **Method**: POST
- **URL**: `{{BASE_URL}}/tasks`
- **Body**:
  ```json
  {
    "title": "<script>alert('XSS')</script>",
    "priority": "HIGH"
  }
  ```
- **Expected**: Task should be created with the literal string, not execute script

## 🧪 **Test Suite 4: Error Handling**

### **4.1 Authentication Errors**

#### **Test: Expired Token**
1. Create a token that expires quickly
2. Wait for expiration
3. Try to access protected route
4. Expected: 401 Unauthorized

#### **Test: Wrong Signature Token**
1. Create a token with wrong secret
2. Try to access protected route
3. Expected: 401 Unauthorized

### **4.2 Input Validation**

#### **Test: Missing Required Fields**
- Try creating tasks without title or priority
- Expected: 400 Bad Request

#### **Test: Invalid Date Format**
- Try creating tasks with invalid dueDate
- Expected: Should handle gracefully

#### **Test: Empty Request Body**
- Send empty JSON `{}`
- Expected: 400 Bad Request

### **4.3 Database Errors**

#### **Test: Malformed Requests**
- Send malformed JSON
- Expected: 400 Bad Request

## 📊 **Test Results Tracking**

### **Test Checklist**
- [ ] User registration works
- [ ] User login works
- [ ] Token validation works
- [ ] Task creation works
- [ ] Task retrieval works
- [ ] Task updates work
- [ ] Task deletion works
- [ ] User isolation works
- [ ] Error handling works
- [ ] Security measures work

### **Performance Notes**
- Response times should be under 500ms
- Database operations should be fast
- No memory leaks during testing

## 🚨 **Common Issues and Solutions**

### **Issue: 401 Unauthorized on All Requests**
- **Solution**: Check if token is properly set in environment variables
- **Solution**: Verify token format includes "Bearer " prefix

### **Issue: 404 Not Found on API Routes**
- **Solution**: Verify server is running on correct port
- **Solution**: Check if routes are properly mounted

### **Issue: Database Connection Errors**
- **Solution**: Ensure database is running and migrated
- **Solution**: Check environment variables for database URL

### **Issue: Tests Pass Individually but Fail in Sequence**
- **Solution**: Check if database cleanup is working properly
- **Solution**: Verify test isolation

## 🎯 **Success Criteria**

All tests should pass with:
- ✅ Correct HTTP status codes
- ✅ Proper JSON response format
- ✅ User isolation maintained
- ✅ Security measures working
- ✅ Error handling graceful
- ✅ Performance acceptable

## 📝 **Reporting**

After completing all tests, document:
1. Number of tests passed/failed
2. Any unexpected behaviors
3. Performance observations
4. Security concerns
5. Recommendations for improvements
