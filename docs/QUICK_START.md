# StudyMate Backend - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp env.example .env
```
Edit `.env` with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/studymate_db"
PORT=5000
NODE_ENV=development
```

### 3. Set Up Database
```bash
# Create database (if not exists)
createdb studymate_db

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

### 4. Start the Server
```bash
npm run dev
```

### 5. Test the API
```bash
# Test basic endpoints
curl http://localhost:5000/
curl http://localhost:5000/health
curl http://localhost:5000/api

# Create a test user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Create a test task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "title": "Study Math",
    "subject": "Mathematics",
    "dueDate": "2024-12-31T23:59:59Z",
    "estimatedTime": 60
  }'
```

## ✅ Success Indicators

- Server starts without errors
- Database connection successful
- Health endpoint returns `{"status": "healthy"}`
- Can create users and tasks via API

## 🐛 Common Issues

**Database Connection Failed:**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

**Port Already in Use:**
- Change PORT in .env
- Or kill process: `lsof -ti:5000 | xargs kill`

**Migration Errors:**
- Reset database: `npm run db:reset`
- Regenerate client: `npm run db:generate`

## 📚 Full Documentation

See `README.md` for complete documentation and API reference.

