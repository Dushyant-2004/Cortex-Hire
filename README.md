# Cortex Hire - AI Interview Platform

A smart AI-powered interviewer that conducts mock interviews and evaluates candidates with real-time feedback, sentiment analysis, and comprehensive performance metrics.

## 🚀 Features

- **Video + Voice Interviews**: Real-time video and audio interviews with WebRTC
- **AI Confidence Analysis**: Advanced AI-powered confidence scoring using Gemini
- **Sentiment Analysis**: Real-time emotion and sentiment detection
- **Answer Quality Scoring**: Comprehensive evaluation of answer quality
- **Auto Feedback**: Instant feedback with actionable improvement tips
- **Performance Dashboard**: Track progress and view interview history
- **Real-time Analytics**: Live confidence, sentiment, and quality metrics

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **WebRTC** - Real-time video/audio communication
- **Socket.io Client** - Real-time bidirectional communication
- **Recharts** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe backend
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.io** - WebSocket server
- **OpenAI API** - GPT-4 for answer analysis and feedback
- **Google Gemini** - Confidence and sentiment analysis
- **Whisper API** - Speech-to-text transcription
- **Winston** - Logging

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **OpenAI API Key** (for GPT-4 and Whisper)
- **Google Gemini API Key** (for advanced AI analysis)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Cortex Hire"
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Configure Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

#### Backend (backend/.env)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/cortex-hire
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
LOG_LEVEL=info
```

### 5. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend/.env

### 6. Get API Keys

**OpenAI API Key:**
1. Go to https://platform.openai.com/
2. Sign up/Login
3. Navigate to API Keys
4. Create new key
5. Add to backend/.env

**Google Gemini API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Create API key
4. Add to backend/.env

## 🚀 Running the Application

### Development Mode

**Option 1: Run Both (Recommended)**
```bash
npm run dev:all
```

**Option 2: Run Separately**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run server
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **WebSocket**: ws://localhost:5000

## 📁 Project Structure

```
Cortex Hire/
├── app/                        # Next.js App Router
│   ├── page.tsx               # Landing page
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Global styles
│   ├── dashboard/             # Dashboard page
│   └── interview/
│       ├── start/             # Start interview page
│       └── [id]/              # Interview room & feedback
├── components/                 # React components
│   ├── VideoPlayer.tsx        # WebRTC video player
│   ├── QuestionCard.tsx       # Question display & answer input
│   └── AnalysisPanel.tsx      # Live AI analysis display
├── lib/                       # Utilities & stores
│   ├── api.ts                 # API client functions
│   ├── webrtc.ts              # WebRTC state management
│   └── interview-store.ts     # Interview state management
├── backend/
│   ├── src/
│   │   ├── server.ts          # Express server setup
│   │   ├── websocket.ts       # Socket.io configuration
│   │   ├── models/            # MongoDB schemas
│   │   │   ├── Candidate.ts
│   │   │   ├── Interview.ts
│   │   │   └── Question.ts
│   │   ├── routes/            # API routes
│   │   │   ├── candidate.routes.ts
│   │   │   ├── interview.routes.ts
│   │   │   └── ai.routes.ts
│   │   ├── services/          # Business logic
│   │   │   ├── ai.service.ts       # OpenAI integration
│   │   │   └── gemini.service.ts   # Gemini integration
│   │   ├── middleware/        # Express middleware
│   │   └── utils/             # Utilities
│   └── package.json
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🔑 Key Features Explained

### 1. Video Interviews
- Real-time video/audio using WebRTC
- Camera and microphone controls
- Peer-to-peer connection for low latency

### 2. AI Analysis
- **Answer Quality**: GPT-4 evaluates answer relevance, clarity, and completeness
- **Sentiment Detection**: Analyzes emotional state and professionalism
- **Confidence Scoring**: Gemini analyzes speech patterns and confidence indicators
- **Real-time Feedback**: Live updates during the interview

### 3. Interview Flow
1. Candidate fills details (name, email, role, level)
2. System generates role-specific questions using AI
3. Interview starts with video/audio setup
4. Candidate answers questions (text or voice)
5. Real-time AI analysis displayed
6. Comprehensive feedback report generated

### 4. Dashboard
- Interview history
- Performance trends
- Average scores
- Improvement tracking

## 🎯 API Endpoints

### Candidates
- `POST /api/candidates` - Create candidate
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `PATCH /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Delete candidate

### Interviews
- `POST /api/interviews` - Create interview
- `GET /api/interviews/:id` - Get interview details
- `PATCH /api/interviews/:id/start` - Start interview
- `POST /api/interviews/:id/answer` - Submit answer
- `PATCH /api/interviews/:id/complete` - Complete interview
- `GET /api/interviews/candidate/:candidateId` - Get candidate's interviews

### AI Services
- `POST /api/ai/transcribe` - Transcribe audio to text
- `POST /api/ai/sentiment` - Analyze sentiment
- `POST /api/ai/confidence` - Analyze confidence
- `POST /api/ai/analyze-answer` - Analyze answer quality
- `POST /api/ai/generate-questions` - Generate interview questions
- `POST /api/ai/analyze-frame` - Analyze video frame

## 🔌 WebSocket Events

### Client → Server
- `join-interview` - Join interview room
- `offer` / `answer` - WebRTC signaling
- `ice-candidate` - WebRTC ICE candidate exchange
- `question-answered` - Answer submitted
- `sentiment-update` - Sentiment data
- `confidence-update` - Confidence data

### Server → Client
- `candidate-joined` - Candidate joined room
- `offer` / `answer` - WebRTC signaling
- `ice-candidate` - ICE candidate
- `answer-received` - Answer received
- `sentiment-updated` - Sentiment updated
- `confidence-updated` - Confidence updated
- `candidate-left` - Candidate left room

## 🎨 Customization

### Modify Questions Generation
Edit `backend/src/services/ai.service.ts` → `generateQuestions()`

### Adjust Scoring Criteria
Edit `backend/src/services/ai.service.ts` → `analyzeAnswerQuality()`

### Change UI Theme
Edit `tailwind.config.ts` → `theme.extend.colors`

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If using Atlas, verify connection string format
mongodb+srv://<username>:<password>@cluster.mongodb.net/cortex-hire
```

### API Key Errors
- Verify API keys are correctly set in backend/.env
- Check API key permissions and quotas
- Ensure no extra spaces in .env file

### WebRTC Issues
- Allow camera/microphone permissions in browser
- Use HTTPS in production for WebRTC
- Check firewall settings

### Port Already in Use
```bash
# Find and kill process on port 3000
npx kill-port 3000

# Find and kill process on port 5000
npx kill-port 5000
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Google Gemini API](https://ai.google.dev/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [WebRTC Guide](https://webrtc.org/getting-started/overview)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ by the Cortex Hire Team

---

**Note**: Remember to replace placeholder API keys with your actual keys before running the application. Never commit real API keys to version control.
# Cortex-Hire
