'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTrophy, FaChartLine, FaRedo } from 'react-icons/fa';
import { interviewApi } from '@/lib/api';

export default function FeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;

  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await interviewApi.getById(interviewId);
        setInterview(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        alert('Failed to load feedback');
        router.push('/');
      }
    };

    fetchFeedback();
  }, [interviewId]);

  if (loading || !interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating feedback...</p>
        </div>
      </div>
    );
  }

  const { overallScore, feedback } = interview;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent Performance!';
    if (score >= 60) return 'Good Job!';
    return 'Keep Practicing!';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
          <p className="text-gray-600">Here's your detailed performance analysis</p>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center"
        >
          <FaTrophy className="text-5xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {getScoreMessage(overallScore)}
          </h2>
          <div className={`text-7xl font-bold ${getScoreColor(overallScore)} mb-4`}>
            {overallScore}%
          </div>
          <p className="text-gray-600">Overall Performance Score</p>
        </motion.div>

        {/* Detailed Feedback */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
              <FaCheckCircle className="mr-2" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {feedback?.strengths?.map((strength: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Areas of Improvement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center">
              <FaChartLine className="mr-2" />
              Areas to Improve
            </h3>
            <ul className="space-y-2">
              {feedback?.areasOfImprovement?.map((area: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="text-orange-500 mr-2">→</span>
                  <span className="text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Detailed Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Detailed Analysis</h3>
          <p className="text-gray-700 leading-relaxed">{feedback?.detailedFeedback}</p>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl shadow-lg p-8 mb-8 text-white"
        >
          <h3 className="text-xl font-semibold mb-4">Next Steps & Recommendations</h3>
          <ul className="space-y-3">
            {feedback?.recommendations?.map((rec: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">💡</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Answer Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Question-by-Question Breakdown
          </h3>
          <div className="space-y-6">
            {interview.answers.map((answer: any, index: number) => (
              <div key={index} className="border-l-4 border-primary-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Question {index + 1}: {answer.question}
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Quality:</span>
                    <span
                      className={`ml-2 font-bold ${getScoreColor(answer.qualityScore)}`}
                    >
                      {answer.qualityScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Confidence:</span>
                    <span
                      className={`ml-2 font-bold ${getScoreColor(answer.confidenceScore)}`}
                    >
                      {answer.confidenceScore}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Sentiment:</span>
                    <span className="ml-2 font-bold capitalize">
                      {answer.sentiment.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/interview/start')}
            className="flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            <FaRedo />
            <span>Take Another Interview</span>
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2 bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition"
          >
            <FaChartLine />
            <span>View Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
