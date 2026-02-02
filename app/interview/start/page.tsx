'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaBrain, FaRocket } from 'react-icons/fa';
import { candidateApi, interviewApi } from '@/lib/api';

export default function StartInterviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    level: 'mid',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create candidate
      const candidateRes = await candidateApi.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        experience: formData.level,
        targetRole: formData.role,
      });

      const candidateId = candidateRes.data.data._id;

      // Create interview
      const interviewRes = await interviewApi.create({
        candidateId,
        role: formData.role,
        level: formData.level,
        questionCount: 5,
      });

      const interviewId = interviewRes.data.data._id;

      // Navigate to interview room
      router.push(`/interview/${interviewId}`);
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FaBrain className="text-6xl text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Start Your Interview</h1>
          <p className="text-gray-600">
            Fill in your details to begin your AI-powered mock interview
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Role *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
                placeholder="e.g., Software Engineer, Product Manager"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experience Level *
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none"
              >
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (2-5 years)</option>
                <option value="senior">Senior Level (5-10 years)</option>
                <option value="lead">Lead/Principal (10+ years)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Setting up your interview...</span>
              ) : (
                <>
                  <FaRocket />
                  <span>Start Interview</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-3">What to expect:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              5 carefully selected questions based on your role and level
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Real-time AI analysis of your answers and confidence
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Instant feedback with actionable improvement tips
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Video recording for your review (optional)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
