import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const config: any = error.config;
    
    // Log detailed error information
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: config?.url,
      data: error.response?.data,
    });

    // Retry logic for network errors
    if (!config || !config.retry) {
      config.retry = 0;
    }

    const shouldRetry = (
      error.code === 'ECONNABORTED' ||
      error.code === 'ERR_NETWORK' ||
      error.message?.includes('Network Error') ||
      !error.response
    ) && config.retry < 2;

    if (shouldRetry) {
      config.retry += 1;
      console.log(`Retrying request (${config.retry}/2)...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * config.retry));
      return api(config);
    }

    // Enhanced error message
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      error.message = 'Cannot connect to server. Please ensure the backend is running.';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (error.response?.status === 500) {
      error.message = 'Server error. Please try again later.';
    }

    return Promise.reject(error);
  }
);

// Candidate APIs
export const candidateApi = {
  create: (data: any) => api.post('/candidates', data),
  getAll: () => api.get('/candidates'),
  getById: (id: string) => api.get(`/candidates/${id}`),
  getByEmail: (email: string) => api.get(`/candidates/email/${encodeURIComponent(email)}`),
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
