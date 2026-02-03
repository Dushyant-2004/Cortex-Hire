'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBrain, FaRocket, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { candidateApi, interviewApi } from '@/lib/api';
import { authUtils, User } from '@/lib/auth';
import FadeIn from '@/components/ui/FadeIn';

export default function StartInterviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    level: 'mid',
  });

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authUtils.getUser();
    const token = authUtils.getToken();
    console.log('Current user:', currentUser); // Debug log
    console.log('Token exists:', !!token); // Debug log
    
    // User is authenticated if they have a token and email
    if (token && currentUser && currentUser.email) {
      setUser(currentUser);
      setIsAuthenticated(true);
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
      }));
      console.log('User authenticated, form data set'); // Debug log
    } else {
      setIsAuthenticated(false);
      console.log('User not authenticated'); // Debug log
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Debug logs
      console.log('Form Data:', formData);
      console.log('User:', user);
      console.log('Is Authenticated:', isAuthenticated);

      // Ensure we have all required data
      const candidateData = {
        name: formData.name || user?.name || '',
        email: formData.email || user?.email || '',
        phone: formData.phone || '',
        experience: formData.level,
        targetRole: formData.role,
      };

      console.log('Candidate Data to submit:', candidateData);

      // Validate required fields
      if (!candidateData.name || !candidateData.name.trim()) {
        throw new Error('Name is required. Please log in or enter your name.');
      }
      if (!candidateData.email || !candidateData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidateData.email)) {
        throw new Error('Valid email is required. Please log in or enter your email.');
      }
      if (!candidateData.targetRole || !candidateData.targetRole.trim()) {
        throw new Error('Please enter your target role');
      }

      // Create candidate with enhanced retry logic
      let candidateRes;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          candidateRes = await candidateApi.create(candidateData);
          break;
        } catch (err: any) {
          retryCount++;
          if (retryCount >= maxRetries) {
            throw new Error(
              err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED'
                ? 'Cannot connect to server. Please ensure the backend is running on port 5000.'
                : err.response?.data?.message || 'Failed to create candidate profile'
            );
          }
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount - 1)));
        }
      }

      if (!candidateRes?.data?.data?._id) {
        throw new Error('Invalid response from server. Please try again.');
      }

      const candidateId = candidateRes.data.data._id;

      // Create interview with retry
      let interviewRes;
      try {
        interviewRes = await interviewApi.create({
          candidateId,
          role: formData.role,
          level: formData.level,
          questionCount: 5,
        });
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || 'Failed to create interview session'
        );
      }

      if (!interviewRes?.data?.data?._id) {
        throw new Error('Invalid interview response. Please try again.');
      }

      const interviewId = interviewRes.data.data._id;

      // Navigate to interview room
      router.push(`/interview/${interviewId}`);
    } catch (error: any) {
      console.error('Error starting interview:', error);
      
      let errorMessage = 'Failed to start interview. ';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = 'Cannot connect to server. Please make sure the backend is running on port 5000.';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Server is not responding. Please check if the backend server is running.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid data provided. Please check your inputs.';
      } else if (error.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please verify the backend is configured correctly.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <FadeIn direction="down">
          <div className="text-center mb-8">
            <motion.div
              className="flex justify-center mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <FaBrain className="text-6xl text-primary-600" />
              </motion.div>
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-gray-900 mb-2"
            >
              Start Your Interview
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600"
            >
              {isAuthenticated
                ? `Welcome back, ${user?.name}! Just a few more details to begin.`
                : 'Fill in your details to begin your AI-powered mock interview'}
            </motion.p>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setError(null)}
                        className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isAuthenticated && (
                <>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none bg-white text-gray-900 placeholder-gray-400 transition-all"
                      placeholder="John Doe"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none bg-white text-gray-900 placeholder-gray-400 transition-all"
                      placeholder="john@example.com"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none bg-white text-gray-900 placeholder-gray-400 transition-all"
                      placeholder="+1 234 567 8900"
                    />
                  </motion.div>
                </>
              )}

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: isAuthenticated ? 0.6 : 0.9 }}
              >
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Role *
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  required
                  autoComplete="organization-title"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none bg-white text-gray-900 placeholder-gray-400 cursor-text transition-all"
                  placeholder="e.g., Software Engineer, Product Manager"
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: isAuthenticated ? 0.7 : 1.0 }}
              >
                <label htmlFor="level" className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience Level *
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none bg-white text-gray-900 cursor-pointer appearance-none transition-all"
                  style={{ backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                >
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (2-5 years)</option>
                  <option value="senior">Senior Level (5-10 years)</option>
                  <option value="lead">Lead/Principal (10+ years)</option>
                </select>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: isAuthenticated ? 0.8 : 1.1 }}
                className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Setting up your interview...</span>
                  </>
                ) : (
                  <>
                    <FaRocket />
                    <span>Start Interview</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.8}>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6"
          >
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <FaCheckCircle className="text-primary-600 mr-2" />
              What to expect:
            </h3>
            <ul className="space-y-2 text-gray-700">
              {[
                '5 carefully selected questions based on your role and level',
                'Real-time AI analysis of your answers and confidence',
                'Instant feedback with actionable improvement tips',
                'Video recording for your review (optional)',
              ].map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  className="flex items-start"
                >
                  <span className="text-primary-600 mr-2">✓</span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </FadeIn>
      </div>
    </div>
  );
}
