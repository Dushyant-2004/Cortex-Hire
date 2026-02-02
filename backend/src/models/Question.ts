import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  question: string;
  category: string;
  difficulty: string;
  tags: string[];
  expectedAnswer?: string;
  evaluationCriteria?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['technical', 'behavioral', 'situational', 'problem-solving'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
    },
    tags: [
      {
        type: String,
      },
    ],
    expectedAnswer: String,
    evaluationCriteria: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuestion>('Question', QuestionSchema);
