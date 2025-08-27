# Setup Guide - VisionAI Assistant

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Python** (v3.8 or higher)
3. **PostgreSQL** database
4. **OpenAI API Key**

## Step 1: Environment Configuration

### Frontend Environment
Create a file `malaysia-explore-ai/.env`:
```env
VITE_API_URL=http://localhost:5001
VITE_CHAT_URL=http://localhost:5173/chat
```

### Backend Environment
Create a file `backend/.env`:
```env
FLASK_SECRET_KEY=your-super-secret-key-change-this
DATABASE_URL=postgresql://username:password@localhost:5432/visionai_db
OPENAI_API_KEY=your-openai-api-key-here
```

## Step 2: Database Setup

1. Create a PostgreSQL database named `visionai_db`
2. Update the `DATABASE_URL` in `backend/.env` with your database credentials
3. The application will create tables automatically on first run

## Step 3: Install Dependencies

### Backend Dependencies
```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt
```

### Frontend Dependencies
```bash
cd malaysia-explore-ai
npm install
```

## Step 4: Start the Applications

### Option A: Using Startup Scripts

**Windows:**
```bash
start-apps.bat
```

**Linux/Mac:**
```bash
chmod +x start-apps.sh
./start-apps.sh
```

### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
.venv\Scripts\activate  # Windows
# OR
source .venv/bin/activate  # Linux/Mac
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd malaysia-explore-ai
npm run dev
```

## Step 5: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

## Step 6: Test the Application

1. Visit http://localhost:5173
2. Click "Sign Up" to create a new account
3. Fill in the registration form
4. You'll be redirected to the chat interface
5. Start chatting with the AI assistant!

## Troubleshooting

### Common Issues

1. **Port 5001 already in use**
   - Change the port in `backend/app.py` line 129
   - Update `VITE_API_URL` in frontend `.env`

2. **Database connection failed**
   - Verify PostgreSQL is running
   - Check database credentials in `backend/.env`
   - Ensure database exists

3. **CORS errors**
   - Backend CORS is configured for development
   - Check browser console for specific errors

4. **OpenAI API errors**
   - Verify your OpenAI API key is valid
   - Check API key in `backend/.env`

### Verification Steps

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5001/api/health
   ```
   Should return: `{"status": "ok"}`

2. **Frontend Loading:**
   - Open browser developer tools
   - Check for any console errors
   - Verify API calls are working

3. **Database Connection:**
   - Check backend logs for database connection messages
   - Verify tables are created on first run

## Development Notes

- Backend runs in debug mode by default
- Frontend has hot reload enabled
- All API calls are logged in browser console
- Session cookies are used for authentication
- Chat history is stored in the database

## Next Steps

After successful setup:
1. Customize the AI responses in `backend/agent.py`
2. Modify the UI components in `malaysia-explore-ai/src/components/`
3. Add new API endpoints in `backend/app.py`
4. Enhance the chat interface features
