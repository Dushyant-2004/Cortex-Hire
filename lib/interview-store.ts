import { create } from 'zustand';

interface Interview {
  _id: string;
  candidateId: string;
  role: string;
  level: string;
  status: string;
  questions: any[];
  answers: any[];
  overallScore?: number;
  feedback?: any;
}

interface InterviewState {
  currentInterview: Interview | null;
  currentQuestionIndex: number;
  answers: any[];
  isRecording: boolean;
  
  setInterview: (interview: Interview) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  addAnswer: (answer: any) => void;
  setRecording: (recording: boolean) => void;
  reset: () => void;
}

export const useInterview = create<InterviewState>((set) => ({
  currentInterview: null,
  currentQuestionIndex: 0,
  answers: [],
  isRecording: false,

  setInterview: (interview) => set({ currentInterview: interview }),
  
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),
  
  previousQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
    })),
  
  addAnswer: (answer) =>
    set((state) => ({
      answers: [...state.answers, answer],
    })),
  
  setRecording: (recording) => set({ isRecording: recording }),
  
  reset: () =>
    set({
      currentInterview: null,
      currentQuestionIndex: 0,
      answers: [],
      isRecording: false,
    }),
}));
