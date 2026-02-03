import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { setupWebSocket } from './websocket';
import interviewRoutes from './routes/interview.routes';
import candidateRoutes from './routes/candidate.routes';
import aiRoutes from './routes/ai.routes';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import { logger } from './utils/logger';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/interviews', interviewRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Cortex Hire API is running' });
});

// WebSocket setup
setupWebSocket(io);

// Error handling
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cortex-hire';
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`\n✅ Backend server is ready!`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health\n`);
  });
}).catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export { io };
