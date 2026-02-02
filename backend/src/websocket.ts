import { Server, Socket } from 'socket.io';
import { logger } from './utils/logger';

interface InterviewSession {
  candidateId: string;
  interviewId: string;
  socketId: string;
}

const activeSessions = new Map<string, InterviewSession>();

export const setupWebSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Join interview room
    socket.on('join-interview', ({ interviewId, candidateId }) => {
      socket.join(interviewId);
      activeSessions.set(socket.id, { candidateId, interviewId, socketId: socket.id });
      
      socket.to(interviewId).emit('candidate-joined', { candidateId });
      logger.info(`Candidate ${candidateId} joined interview ${interviewId}`);
    });

    // WebRTC signaling
    socket.on('offer', ({ interviewId, offer }) => {
      socket.to(interviewId).emit('offer', offer);
    });

    socket.on('answer', ({ interviewId, answer }) => {
      socket.to(interviewId).emit('answer', answer);
    });

    socket.on('ice-candidate', ({ interviewId, candidate }) => {
      socket.to(interviewId).emit('ice-candidate', candidate);
    });

    // Interview events
    socket.on('question-answered', ({ interviewId, questionId, answer, audioUrl }) => {
      socket.to(interviewId).emit('answer-received', {
        questionId,
        answer,
        audioUrl,
        timestamp: new Date(),
      });
    });

    socket.on('sentiment-update', ({ interviewId, sentiment }) => {
      socket.to(interviewId).emit('sentiment-updated', sentiment);
    });

    socket.on('confidence-update', ({ interviewId, confidence }) => {
      socket.to(interviewId).emit('confidence-updated', confidence);
    });

    // Disconnect
    socket.on('disconnect', () => {
      const session = activeSessions.get(socket.id);
      if (session) {
        socket.to(session.interviewId).emit('candidate-left', {
          candidateId: session.candidateId,
        });
        activeSessions.delete(socket.id);
      }
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
};

export { activeSessions };
