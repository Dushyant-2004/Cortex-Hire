'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import QuestionCard from '@/components/QuestionCard';
import AnalysisPanel from '@/components/AnalysisPanel';
import { useWebRTC } from '@/lib/webrtc';
import { useInterview } from '@/lib/interview-store';
import { interviewApi, aiApi } from '@/lib/api';

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = params.id as string;

  const {
    localStream,
    isVideoEnabled,
    isAudioEnabled,
    initializeSocket,
    setupWebRTC,
    toggleVideo,
    toggleAudio,
    disconnect,
  } = useWebRTC();

  const {
    currentInterview,
    currentQuestionIndex,
    isRecording,
    setInterview,
    nextQuestion,
    addAnswer,
    setRecording,
  } = useInterview();

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Fetch interview details
        const res = await interviewApi.getById(interviewId);
        setInterview(res.data.data);

        // Start interview
        await interviewApi.start(interviewId);

        // Setup WebRTC
        await setupWebRTC();

        // Initialize socket
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
        initializeSocket(socketUrl);

        setLoading(false);
      } catch (error) {
        console.error('Error initializing interview:', error);
        alert('Failed to load interview');
        router.push('/');
      }
    };

    init();

    return () => {
      disconnect();
    };
  }, [interviewId]);

  const handleAnswer = async (answer: string) => {
    if (!currentInterview) return;

    const currentQuestion = currentInterview.questions[currentQuestionIndex];
    const startTime = Date.now();

    try {
      // Submit answer to backend
      const res = await interviewApi.submitAnswer(interviewId, {
        questionId: currentQuestion._id,
        answer,
        duration: (Date.now() - startTime) / 1000,
      });

      setAnalysis(res.data.data);
      addAnswer({ question: currentQuestion.question, answer, analysis: res.data.data });

      // Move to next question after 3 seconds
      setTimeout(() => {
        if (currentQuestionIndex < currentInterview.questions.length - 1) {
          nextQuestion();
          setAnalysis(null);
        } else {
          // Complete interview
          handleCompleteInterview();
        }
      }, 3000);
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Failed to submit answer');
    }
  };

  const handleCompleteInterview = async () => {
    try {
      await interviewApi.complete(interviewId);
      router.push(`/interview/${interviewId}/feedback`);
    } catch (error) {
      console.error('Error completing interview:', error);
    }
  };

  const handleToggleRecording = () => {
    setRecording(!isRecording);
    // Implement actual recording logic here
  };

  if (loading || !currentInterview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = currentInterview.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Video */}
          <div className="lg:col-span-1 space-y-4">
            <VideoPlayer
              stream={localStream}
              isLocal={true}
              isVideoEnabled={isVideoEnabled}
              isAudioEnabled={isAudioEnabled}
              onToggleVideo={toggleVideo}
              onToggleAudio={toggleAudio}
            />
            <AnalysisPanel
              sentiment={analysis?.sentimentAnalysis}
              confidenceScore={analysis?.confidenceAnalysis?.confidenceScore}
              qualityScore={analysis?.qualityAnalysis?.score}
            />
          </div>

          {/* Right: Question and Controls */}
          <div className="lg:col-span-2">
            <QuestionCard
              question={currentQuestion.question}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={currentInterview.questions.length}
              onAnswer={handleAnswer}
              isRecording={isRecording}
              onToggleRecording={handleToggleRecording}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
