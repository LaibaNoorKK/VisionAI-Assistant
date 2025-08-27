# VisionAI Assistant - Full Stack Application

A comprehensive full-stack application with a React/Vite frontend and Flask backend, featuring user authentication and AI-powered chat functionality.

## 🏗️ Architecture

### Frontend (`malaysia-explore-ai/`)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Shadcn/ui components with Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Port**: 5173 (default Vite port)

### Backend (`backend/`)
- **Framework**: Flask
- **Database**: PostgreSQL (via SQLAlchemy)
- **AI Integration**: LangChain with OpenAI
- **CORS**: Enabled for frontend communication
- **Port**: 5001

## 🚀 Quick Start

### Option 1: Using the Startup Scripts

**Windows:**
```bash
start-apps.bat
```

**Linux/Mac:**
```bash
chmod +x start-apps.sh
./start-apps.sh
```

### Option 2: Manual Setup

#### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt
python app.py
```

#### 2. Frontend Setup
```bash
cd malaysia-explore-ai
npm install
npm run dev
```

## 📁 Project Structure

```
VisionAI Assistant/
├── backend/                    # Flask API
│   ├── app.py                 # Main Flask application
│   ├── agent.py               # AI agent logic
│   ├── chat_history.py        # Chat history management
│   ├── requirements.txt       # Python dependencies
│   └── ...
├── malaysia-explore-ai/       # React Frontend
│   ├── src/
│   │   ├── api.js            # API client configuration
│   │   ├── components/
│   │   │   └── VisionAI/     # Main chat interface
│   │   ├── pages/
│   │   │   └── Auth/         # Authentication pages
│   │   └── services/         # API services
│   ├── package.json          # Node.js dependencies
│   └── ...
├── start-apps.bat            # Windows startup script
├── start-apps.sh             # Unix startup script
└── README.md                 # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Chat
- `POST /api/chat` - Send message to AI assistant

### Health Check
- `GET /api/health` - API health status

## 🔐 Environment Variables

### Frontend (Vite)
Create a `.env` file in `malaysia-explore-ai/`:
```env
VITE_API_URL=http://localhost:5001
VITE_CHAT_URL=http://localhost:5173/chat
```

### Backend
Create a `.env` file in `backend/`:
```env
FLASK_SECRET_KEY=your-secret-key
DATABASE_URL=your-postgres-connection-string
OPENAI_API_KEY=your-openai-api-key
```

## 🎯 Features

### User Authentication
- User registration with institute and study details
- Email-based signin
- Session management

### AI Chat Interface
- Real-time chat with AI assistant
- Message history
- Category-based quick questions
- File attachment support (UI ready)
- Chat session management

### Modern UI/UX
- Responsive design
- Dark/light theme support
- Smooth animations
- Loading states
- Error handling

## 🔄 Data Flow

1. **User Registration**: User fills signup form → Backend creates user record → Redirects to chat
2. **User Login**: User enters email → Backend validates → Creates session → Redirects to chat
3. **Chat**: User sends message → Frontend calls API → Backend processes with AI → Returns response → Frontend displays

## 🛠️ Development

### Frontend Development
```bash
cd malaysia-explore-ai
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
python app.py        # Start Flask server (debug mode)
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend: Change port in `app.py` line 129
   - Frontend: Vite will automatically find next available port

2. **Database Connection**
   - Ensure PostgreSQL is running
   - Check database URL in environment variables
   - Verify database schema exists

3. **CORS Issues**
   - Backend CORS is configured for all origins in development
   - Check browser console for CORS errors

4. **API Connection**
   - Verify backend is running on port 5001
   - Check `VITE_API_URL` in frontend environment
   - Test API health endpoint: `http://localhost:5001/api/health`

## 📝 Notes

- The application uses session-based authentication
- Chat history is stored in the database
- AI responses are generated using LangChain and OpenAI
- The frontend is built with modern React patterns and TypeScript
- All API calls are centralized in `src/api.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and development purposes.
