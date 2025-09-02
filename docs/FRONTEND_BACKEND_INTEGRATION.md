# Frontend-Backend Integration Guide

This document explains how the React frontend connects to the Node.js backend API.

## 🔗 Integration Features

### 1. Dashboard API Status
- **Location**: `/dashboard` page
- **API Call**: `GET http://localhost:5000/`
- **Purpose**: Displays backend connection status
- **Features**:
  - Shows "StudyMate API running" message when connected
  - Displays error message when backend is down
  - Refresh button to retry connection
  - Loading spinner during API calls

### 2. Tasks Data Fetching
- **Location**: `/tasks` page
- **API Call**: `GET http://localhost:5000/api/tasks`
- **Purpose**: Fetches real task data from database
- **Features**:
  - Loads tasks from backend API
  - Fallback to sample data if API fails
  - Loading states and error handling
  - Refresh button to reload data

## 🛠️ API Utility Functions

### `src/utils/api.js`
Centralized API communication functions:

```javascript
// Get API status
const status = await getApiStatus()

// Get all tasks
const tasks = await getTasks()

// Get all users
const users = await getUsers()

// Create new user
const newUser = await createUser({ email, password })

// Create new task
const newTask = await createTask({ title, subject, dueDate, ... })
```

## 🎯 Error Handling

### Graceful Degradation
- **Backend Down**: Shows error message with retry option
- **Network Issues**: Displays user-friendly error messages
- **API Errors**: Logs errors to console and shows fallback UI
- **Loading States**: Spinners and loading indicators during API calls

### Error States
1. **Connection Error**: Red error card with retry button
2. **Loading State**: Spinner with "Connecting..." message
3. **Success State**: Green success card with API message
4. **Fallback Data**: Sample data when API is unavailable

## 🚀 Testing the Integration

### Prerequisites
1. **Backend Running**: `npm run dev` (port 5000)
2. **Frontend Running**: `npm run dev` (port 3000)
3. **Database**: PostgreSQL with migrated schema

### Test Steps

#### 1. Test Dashboard API Status
```bash
# Start backend
npm run dev

# Start frontend (in another terminal)
npm run dev

# Visit http://localhost:3000/dashboard
# Should see "Backend Connected" with "StudyMate API running" message
```

#### 2. Test Tasks Data Fetching
```bash
# Visit http://localhost:3000/tasks
# Should load tasks from backend API
# If no tasks exist, will show "No tasks found" message
```

#### 3. Test Error Handling
```bash
# Stop the backend server
# Refresh the dashboard page
# Should see "Backend Connection Error" message
# Click "Refresh" to retry when backend is back up
```

#### 4. Test API Endpoints Directly
```bash
# Test root endpoint
curl http://localhost:5000/
# Expected: {"message": "StudyMate API running"}

# Test tasks endpoint
curl http://localhost:5000/api/tasks
# Expected: {"success": true, "data": [], "count": 0}

# Test health endpoint
curl http://localhost:5000/health
# Expected: {"status": "healthy", "message": "Database connection is working"}
```

## 📱 User Experience

### Loading States
- **Dashboard**: Shows spinner while checking API status
- **Tasks**: Shows loading spinner while fetching tasks
- **Buttons**: Disabled state with "Refreshing..." text

### Success States
- **Dashboard**: Green success card with API message
- **Tasks**: Displays task list with status indicators
- **Real-time**: Data updates when refresh button is clicked

### Error States
- **Dashboard**: Red error card with helpful message
- **Tasks**: Error message with retry button
- **Fallback**: Sample data shown when API is unavailable

## 🔧 Configuration

### API Base URL
- **Development**: `http://localhost:5000`
- **Production**: Update in `src/utils/api.js`

### CORS Configuration
Backend is configured to allow requests from:
- `http://localhost:3000` (frontend development)
- `http://localhost:3001` (frontend alternative port)

## 🐛 Troubleshooting

### Common Issues

#### 1. CORS Errors
```
Access to fetch at 'http://localhost:5000/' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Ensure backend CORS is configured properly

#### 2. Connection Refused
```
Failed to fetch: TypeError: Failed to fetch
```
**Solution**: Check if backend server is running on port 5000

#### 3. Database Connection Issues
```
Database connection failed
```
**Solution**: Ensure PostgreSQL is running and database exists

### Debug Steps
1. Check backend server status: `curl http://localhost:5000/`
2. Check database connection: `curl http://localhost:5000/health`
3. Check frontend console for error messages
4. Verify environment variables in `.env` file

## 📈 Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration for live data
- **Authentication**: JWT token-based user authentication
- **Offline Support**: Service worker for offline functionality
- **Caching**: React Query for efficient data caching
- **Error Boundaries**: React error boundaries for better error handling

### API Extensions
- **User Authentication**: Login/logout endpoints
- **Task Management**: Full CRUD operations
- **File Upload**: Task attachments and user avatars
- **Search & Filter**: Advanced task filtering
- **Analytics**: Study progress tracking

## 🎉 Success Indicators

The integration is working correctly when:
- ✅ Dashboard shows "Backend Connected" with API message
- ✅ Tasks page loads data from backend (or shows empty state)
- ✅ Error states display helpful messages
- ✅ Refresh buttons work to retry failed requests
- ✅ Loading states show during API calls
- ✅ Fallback data appears when backend is unavailable

