# Authenticated Task Routes

This document describes the new authenticated task routes that require JWT authentication.

## Overview

The new task routes (`/api/tasks-auth`) provide secure CRUD operations for tasks, ensuring that users can only access and modify their own tasks. All routes are protected by JWT authentication middleware.

## ✅ **Completed Setup**

### Database Schema
- ✅ **User Model**: String ID with cuid, email, password, createdAt
- ✅ **Task Model**: String ID with cuid, title, description (optional), dueDate (optional), priority (LOW/MEDIUM/HIGH), createdAt, updatedAt, userId
- ✅ **Relations**: User has many Tasks, Task belongs to User
- ✅ **Database**: SQLite for development (easier setup than PostgreSQL)

### Authentication System
- ✅ **JWT Middleware**: Protects all task routes
- ✅ **Auth Routes**: `/api/auth/register` and `/api/auth/login`
- ✅ **Password Hashing**: bcryptjs for secure password storage

### Task Routes
- ✅ **POST /tasks-auth**: Create new task
- ✅ **GET /tasks-auth**: Get all tasks for authenticated user
- ✅ **PUT /tasks-auth/:id**: Update task (ownership verified)
- ✅ **DELETE /tasks-auth/:id**: Delete task (ownership verified)

## Authentication

### Prerequisites
- JWT token required for all requests
- Token must be included in the `Authorization` header as `Bearer <token>`

### Getting a JWT Token

#### Register a new user:
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login with existing user:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Both endpoints return a JWT token in the response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx1234567890",
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Task Routes

### 1. Create Task
```bash
POST /api/tasks-auth
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Complete Project Documentation",
  "description": "Write comprehensive documentation for the StudyMate project",
  "dueDate": "2024-01-15T23:59:59.000Z",
  "priority": "HIGH"
}
```

**Required fields:**
- `title` (string)
- `priority` (string: "LOW", "MEDIUM", "HIGH")

**Optional fields:**
- `description` (string)
- `dueDate` (ISO date string)

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "clx1234567890",
    "userId": "clx0987654321",
    "title": "Complete Project Documentation",
    "description": "Write comprehensive documentation for the StudyMate project",
    "dueDate": "2024-01-15T23:59:59.000Z",
    "priority": "HIGH",
    "createdAt": "2024-01-08T10:30:00.000Z",
    "updatedAt": "2024-01-08T10:30:00.000Z",
    "user": {
      "id": "clx0987654321",
      "email": "user@example.com"
    }
  }
}
```

### 2. Get All Tasks (for authenticated user)
```bash
GET /api/tasks-auth
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890",
      "userId": "clx0987654321",
      "title": "Complete Project Documentation",
      "description": "Write comprehensive documentation for the StudyMate project",
      "dueDate": "2024-01-15T23:59:59.000Z",
      "priority": "HIGH",
      "createdAt": "2024-01-08T10:30:00.000Z",
      "updatedAt": "2024-01-08T10:30:00.000Z",
      "user": {
        "id": "clx0987654321",
        "email": "user@example.com"
      }
    }
  ],
  "count": 1
}
```

### 3. Update Task
```bash
PUT /api/tasks-auth/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Updated Task Title",
  "priority": "MEDIUM"
}
```

**Optional fields (only include what you want to update):**
- `title` (string)
- `description` (string)
- `dueDate` (ISO date string)
- `priority` (string: "LOW", "MEDIUM", "HIGH")

**Response:**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "clx1234567890",
    "userId": "clx0987654321",
    "title": "Updated Task Title",
    "description": "Write comprehensive documentation for the StudyMate project",
    "dueDate": "2024-01-15T23:59:59.000Z",
    "priority": "MEDIUM",
    "createdAt": "2024-01-08T10:30:00.000Z",
    "updatedAt": "2024-01-08T10:31:00.000Z",
    "user": {
      "id": "clx0987654321",
      "email": "user@example.com"
    }
  }
}
```

### 4. Delete Task
```bash
DELETE /api/tasks-auth/:id
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## Security Features

### User Isolation
- Users can only access their own tasks
- Task ownership is verified on every operation
- JWT token contains user ID which is used for authorization

### Input Validation
- Required fields are validated (title, priority)
- Priority must be one of: "LOW", "MEDIUM", "HIGH"
- Due dates are properly parsed and validated
- Optional fields can be null/undefined

### Error Handling
- 401 Unauthorized: Invalid or missing JWT token
- 403 Forbidden: User doesn't own the task
- 404 Not Found: Task doesn't exist
- 400 Bad Request: Invalid input data

## Database Schema

The Task model has been updated to match your specifications:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  
  // Relations
  tasks Task[]
  
  @@map("users")
}

model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  dueDate     DateTime?
  priority    String    // LOW, MEDIUM, HIGH
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  
  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("tasks")
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup (SQLite)
The database is automatically created when you run the migration:
```bash
npx prisma migrate dev --name add_tasks_model
npx prisma generate
```

### 3. Start the Server
```bash
npm run server:dev
```

### 4. Test the API
```bash
node test-auth-tasks.js
```

## Testing

Use the provided test script to verify the functionality:

```bash
# Install dependencies first
npm install

# Run the test script
node test-auth-tasks.js
```

The test script will:
1. Register/login a test user
2. Create a task
3. Retrieve all tasks
4. Update the task
5. Delete the task
6. Verify all operations work correctly

## File Structure

```
study_mate/
├── prisma/
│   ├── schema.prisma          # Database schema with User and Task models
│   └── dev.db                 # SQLite database file
├── routes/
│   ├── task.routes.ts         # Authenticated task routes
│   ├── authRoutes.js          # Authentication routes
│   └── index.js               # Main routes file
├── controllers/
│   └── authController.js      # Authentication logic
├── middleware/
│   └── authMiddleware.js      # JWT authentication middleware
├── test-auth-tasks.js         # Test script for task routes
└── AUTHENTICATED_TASKS_README.md  # This documentation
```

## ✅ **Migration Status**

The database migration has been successfully completed:
- ✅ Schema updated with new Task model
- ✅ User model updated to use String IDs with cuid
- ✅ Priority field implemented as String (LOW/MEDIUM/HIGH)
- ✅ Optional fields: description, dueDate
- ✅ Automatic timestamps: createdAt, updatedAt
- ✅ User-Task relationship established
- ✅ SQLite database created and migrated
- ✅ Prisma client generated

Your authenticated task routes are now ready to use! 🎉
