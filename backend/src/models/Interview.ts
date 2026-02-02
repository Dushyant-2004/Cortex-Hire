import mongoose, { Schema, Document } from 'mongoose';

export interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  audioUrl?: string;
  duration: number;
  qualityScore: number;
  sentiment: {
    type: string;
    confidence: number;
    emotions: string[];
  };
  confidenceScore: number;
  timestamp: Date;
}

export interface IInterview extends Document {
  candidateId: mongoose.Types.ObjectId;
  role: string;
  level: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  questions: mongoose.Types.ObjectId[];
  answers: IAnswer[];
  overallScore?: number;
  feedback?: {
    strengths: string[];
    areasOfImprovement: string[];
    detailedFeedback: string;
    recommendations: string[];
  };
  duration: number;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema: Schema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  audioUrl: String,
  duration: {
    type: Number,
    default: 0,
  },
  qualityScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  sentiment: {
    type: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
    },
    confidence: Number,
    emotions: [String],
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const InterviewSchema: Schema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead'],
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    answers: [AnswerSchema],
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    feedback: {
      strengths: [String],
      areasOfImprovement: [String],
      detailedFeedback: String,
      recommendations: [String],
    },
    duration: {
      type: Number,
      default: 0,
    },
    scheduledAt: Date,
    startedAt: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IInterview>('Interview', InterviewSchema);
