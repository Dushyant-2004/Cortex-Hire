import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Candidate APIs
export const candidateApi = {
  create: (data: any) => api.post('/candidates', data),
  getAll: () => api.get('/candidates'),
  getById: (id: string) => api.get(`/candidates/${id}`),
  update: (id: string, data: any) => api.patch(`/candidates/${id}`, data),
  delete: (id: string) => api.delete(`/candidates/${id}`),
};

// Interview APIs
export const interviewApi = {
  create: (data: any) => api.post('/interviews', data),
  getById: (id: string) => api.get(`/interviews/${id}`),
  start: (id: string) => api.patch(`/interviews/${id}/start`),
  submitAnswer: (id: string, data: any) => api.post(`/interviews/${id}/answer`, data),
  complete: (id: string) => api.patch(`/interviews/${id}/complete`),
  getByCandidateId: (candidateId: string) =>
    api.get(`/interviews/candidate/${candidateId}`),
};

// AI APIs
export const aiApi = {
  transcribe: (audioFile: File) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    return api.post('/ai/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  analyzeSentiment: (text: string) => api.post('/ai/sentiment', { text }),
  analyzeConfidence: (transcript: string, metadata: any) =>
    api.post('/ai/confidence', { transcript, metadata }),
  analyzeAnswer: (question: string, answer: string) =>
    api.post('/ai/analyze-answer', { question, answer }),
  generateQuestions: (role: string, level: string, count?: number) =>
    api.post('/ai/generate-questions', { role, level, count }),
  analyzeFrame: (imageData: string) =>
    api.post('/ai/analyze-frame', { imageData }),
};
