'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaStop } from 'react-icons/fa';

interface QuestionCardProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  isRecording,
  onToggleRecording,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(answer);
      setAnswer('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="mb-6">
        <span className="text-sm text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
          <motion.div
            className="h-full bg-primary-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={questionNumber}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{question}</h2>

          <div className="space-y-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here or use voice recording..."
              className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none resize-none text-gray-900 placeholder:text-gray-400 bg-white"
              disabled={isRecording}
            />

            <div className="flex justify-between items-center">
              <button
                onClick={onToggleRecording}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {isRecording ? (
                  <>
                    <FaStop />
                    <span>Stop Recording</span>
                  </>
                ) : (
                  <>
                    <FaMicrophone />
                    <span>Start Recording</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || isRecording}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </div>
          </div>

          {isRecording && (
            <motion.div
              className="flex items-center justify-center space-x-2 mt-4 text-red-600"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-3 h-3 bg-red-600 rounded-full" />
              <span className="font-semibold">Recording in progress...</span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
