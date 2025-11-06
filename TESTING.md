# Testing Guide

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Automated Tests

### Backend Tests

Run all backend tests:
```bash
cd backend
npm test
```

This runs:
- Service layer tests (user, poll, vote)
- Business layer tests
- API layer tests
- E2E tests

### Test Coverage

The tests cover:
- ✅ User validation and creation
- ✅ Poll validation and creation
- ✅ Vote validation and creation
- ✅ Duplicate vote prevention
- ✅ Results aggregation
- ✅ Full user → poll → vote → results flow

## Manual Testing

### 1. Start Backend Server

```bash
cd backend
npm start
```

Backend will start on `http://localhost:3000`

You should see:
```
HTTP server listening on :3000
```

### 2. Start Frontend Dev Server

In a new terminal:
```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### 3. Test the Application

1. **Open browser**: Navigate to `http://localhost:5173`

2. **Login Flow**:
   - You'll be redirected to `/login`
   - Enter a username (4-12 alphanumeric characters, e.g., `john1234`)
   - Click "Continue"
   - Should redirect to `/dashboard`

3. **Dashboard**:
   - Should show all polls (initially empty)
   - Click "Create New Poll"
   - Fill in:
     - Title: e.g., "Weekend Plans"
     - Options: e.g., "Stay In", "Go Out", "Work Out"
   - Click "Create Poll"
   - Poll should appear in the grid

4. **Voting**:
   - Click on an option button in any poll
   - Should show "You have voted on this poll"
   - Results should update with vote counts
   - Try voting again (should be prevented)

5. **Profile Page**:
   - Click "My Polls" in the header
   - Should show only polls you created
   - Click "Dashboard" to go back

6. **Multiple Users**:
   - Logout
   - Login with a different username
   - Create a poll
   - Vote on polls created by other users
   - Check that you can only vote once per poll

## API Testing (Manual)

### Using curl

#### 1. Login/Create User
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser"}'
```

Response:
```json
{"id":1,"username":"testuser"}
```

#### 2. Create Poll
```bash
curl -X POST http://localhost:3000/api/polls \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Poll","options":["Yes","No"],"createdByUserId":1}'
```

Response:
```json
{"id":1,"title":"Test Poll","options":["Yes","No"],"createdByUserId":1}
```

#### 3. Get All Polls
```bash
curl http://localhost:3000/api/polls
```

#### 4. Get Single Poll
```bash
curl http://localhost:3000/api/polls/1
```

#### 5. Check if User Voted
```bash
curl "http://localhost:3000/api/polls/1/votes?userId=1"
```

Response (not voted):
```json
{"hasVoted":false}
```

Response (voted):
```json
{"hasVoted":true,"vote":{"id":1,"pollId":1,"userId":1,"optionIndex":0}}
```

#### 6. Vote on Poll
```bash
curl -X POST http://localhost:3000/api/polls/1/votes \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"optionIndex":0}'
```

#### 7. Get Poll Results
```bash
curl http://localhost:3000/api/polls/1/results
```

Response:
```json
{"pollId":1,"counts":[1,0],"total":1}
```

#### 8. Get User's Polls
```bash
curl "http://localhost:3000/api/polls?createdByUserId=1"
```

### Using Postman/Insomnia

Import these endpoints:
- `POST /api/users/login`
- `POST /api/polls`
- `GET /api/polls`
- `GET /api/polls/:id`
- `GET /api/polls/:id/votes?userId=:userId`
- `POST /api/polls/:id/votes`
- `GET /api/polls/:id/results`
- `GET /api/polls?createdByUserId=:userId`

## Testing Checklist

### Backend API Endpoints
- [ ] `POST /api/users/login` - creates/returns user
- [ ] `POST /api/polls` - creates poll
- [ ] `GET /api/polls` - lists all polls
- [ ] `GET /api/polls/:id` - gets single poll
- [ ] `GET /api/polls/:id/votes?userId=:userId` - checks if user voted
- [ ] `GET /api/polls/:id/votes` - gets all votes
- [ ] `POST /api/polls/:id/votes` - creates vote
- [ ] `GET /api/polls/:id/results` - gets poll results
- [ ] `GET /api/polls?createdByUserId=:userId` - gets user's polls

### Frontend Features
- [ ] Login page works
- [ ] Dashboard loads all polls
- [ ] Create poll modal works
- [ ] Poll cards display correctly
- [ ] Voting works (one vote per user)
- [ ] Results display correctly
- [ ] Profile page shows user's polls
- [ ] Navigation between pages works
- [ ] Logout works

### Edge Cases
- [ ] Invalid username (too short/long/non-alphanumeric)
- [ ] Invalid poll (too few/many options, invalid title)
- [ ] Duplicate vote prevention
- [ ] Voting on non-existent poll
- [ ] Getting results for non-existent poll
- [ ] Empty polls list
- [ ] User with no polls

## Troubleshooting

### Backend won't start
- Check if port 3000 is already in use
- Run `npm install` to ensure dependencies are installed
- Check for syntax errors in console

### Frontend won't start
- Check if port 5173 is already in use
- Run `npm install` to ensure dependencies are installed
- Check browser console for errors

### API calls failing
- Ensure backend is running on port 3000
- Check CORS settings (should allow all origins)
- Verify API endpoint URLs in `frontend/src/api/client.ts`

### Tests failing
- Run `npm install` in backend directory
- Check that all dependencies are installed
- Review test output for specific error messages

## Quick Test Script

```bash
# Terminal 1: Start backend
cd backend && npm start

# Terminal 2: Start frontend
cd frontend && npm run dev

# Terminal 3: Run tests
cd backend && npm test
```

Then open `http://localhost:5173` in your browser.

