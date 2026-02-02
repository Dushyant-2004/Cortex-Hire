import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface WebRTCState {
  socket: Socket | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peer: any;
  isConnected: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  
  initializeSocket: (url: string) => void;
  joinInterview: (interviewId: string, candidateId: string) => void;
  setupWebRTC: () => Promise<void>;
  toggleVideo: () => void;
  toggleAudio: () => void;
  disconnect: () => void;
}

export const useWebRTC = create<WebRTCState>((set, get) => ({
  socket: null,
  localStream: null,
  remoteStream: null,
  peer: null,
  isConnected: false,
  isVideoEnabled: true,
  isAudioEnabled: true,

  initializeSocket: (url: string) => {
    const socket = io(url);
    
    socket.on('connect', () => {
      console.log('Socket connected');
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      set({ isConnected: false });
    });

    set({ socket });
  },

  joinInterview: (interviewId: string, candidateId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('join-interview', { interviewId, candidateId });
    }
  },

  setupWebRTC: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      set({ localStream: stream });
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  },

  toggleVideo: () => {
    const { localStream, isVideoEnabled } = get();
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      set({ isVideoEnabled: !isVideoEnabled });
    }
  },

  toggleAudio: () => {
    const { localStream, isAudioEnabled } = get();
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioEnabled;
      });
      set({ isAudioEnabled: !isAudioEnabled });
    }
  },

  disconnect: () => {
    const { socket, localStream, peer } = get();
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (peer) {
      peer.destroy();
    }
    
    if (socket) {
      socket.disconnect();
    }
    
    set({
      socket: null,
      localStream: null,
      remoteStream: null,
      peer: null,
      isConnected: false,
    });
  },
}));
