'use client';

import { motion } from 'framer-motion';
import { FaSmile, FaMeh, FaFrown } from 'react-icons/fa';

interface AnalysisPanelProps {
  sentiment?: {
    type: string;
    confidence: number;
    emotions: string[];
  };
  confidenceScore?: number;
  qualityScore?: number;
}

export default function AnalysisPanel({
  sentiment,
  confidenceScore,
  qualityScore,
}: AnalysisPanelProps) {
  const getSentimentIcon = () => {
    if (!sentiment) return <FaMeh className="text-yellow-500" />;
    
    switch (sentiment.type) {
      case 'positive':
        return <FaSmile className="text-green-500" />;
      case 'negative':
        return <FaFrown className="text-red-500" />;
      default:
        return <FaMeh className="text-yellow-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Live Analysis</h3>

      {/* Sentiment */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Sentiment</span>
          <div className="flex items-center space-x-2">
            {getSentimentIcon()}
            <span className="font-medium capitalize">{sentiment?.type || 'Neutral'}</span>
          </div>
        </div>
      </div>

      {/* Confidence Score */}
      {confidenceScore !== undefined && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Confidence</span>
            <span className={`font-bold text-xl ${getScoreColor(confidenceScore)}`}>
              {confidenceScore}%
            </span>
          </div>
          <motion.div
            className="h-3 bg-gray-200 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-primary-600"
              initial={{ width: 0 }}
              animate={{ width: `${confidenceScore}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      )}

      {/* Quality Score */}
      {qualityScore !== undefined && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Answer Quality</span>
            <span className={`font-bold text-xl ${getScoreColor(qualityScore)}`}>
              {qualityScore}%
            </span>
          </div>
          <motion.div
            className="h-3 bg-gray-200 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
              initial={{ width: 0 }}
              animate={{ width: `${qualityScore}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      )}

      {/* Emotions */}
      {sentiment?.emotions && sentiment.emotions.length > 0 && (
        <div className="space-y-2">
          <span className="text-gray-600">Detected Emotions</span>
          <div className="flex flex-wrap gap-2">
            {sentiment.emotions.map((emotion, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {emotion}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
