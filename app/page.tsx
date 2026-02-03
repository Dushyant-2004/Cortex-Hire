'use client';

import Link from 'next/link';
import { FaVideo, FaBrain, FaChartLine, FaRocket, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { authUtils, User } from '@/lib/auth';
import TypewriterText from '@/components/ui/TypewriterText';
import FadeIn from '@/components/ui/FadeIn';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(authUtils.getUser());
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-16"
        >
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <FaBrain className="text-4xl text-primary-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800">Cortex Hire</h1>
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <FaUser className="text-primary-600" />
                  <span className="font-medium">{user.name}</span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    authUtils.clearAuth();
                    setUser(null);
                  }}
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link href="/login" className="text-gray-600 hover:text-gray-900 transition">
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/signup"
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </motion.nav>

        <div className="text-center max-w-4xl mx-auto mb-16">
          <FadeIn direction="down" delay={0.2}>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <TypewriterText
                text="AI-Powered Interview"
                speed={80}
                delay={300}
              />
              <br />
              <span className="text-primary-600">
                <TypewriterText
                  text="Intelligence"
                  speed={80}
                  delay={2000}
                />
              </span>
            </h2>
          </FadeIn>
          
          <FadeIn delay={0.5}>
            <p className="text-xl text-gray-600 mb-8">
              Conduct realistic mock interviews with AI. Get instant feedback on confidence,
              sentiment, and answer quality to ace your next interview.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.7}>
            <div className="flex justify-center space-x-4 flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/interview/start"
                  className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg"
                >
                  Start Interview
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/dashboard"
                  className="inline-block bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition"
                >
                  View Dashboard
                </Link>
              </motion.div>
            </div>
          </FadeIn>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { icon: <FaVideo />, title: "Video Interviews", description: "Real-time video and voice interviews with AI analysis", delay: 0 },
            { icon: <FaBrain />, title: "AI Analysis", description: "Confidence and sentiment tracking powered by advanced AI", delay: 0.1 },
            { icon: <FaChartLine />, title: "Quality Scoring", description: "Comprehensive answer quality evaluation and metrics", delay: 0.2 },
            { icon: <FaRocket />, title: "Auto Feedback", description: "Instant improvement tips and personalized suggestions", delay: 0.3 },
          ].map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Stats */}
        <FadeIn delay={0.8}>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { value: "10k+", label: "Interviews Conducted" },
                { value: "95%", label: "Success Rate" },
                { value: "24/7", label: "AI Availability" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 + index * 0.1, type: 'spring' }}
                >
                  <motion.div
                    className="text-4xl font-bold text-primary-600"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-600 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <FadeIn delay={delay}>
      <motion.div
        whileHover={{
          y: -10,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }}
        transition={{ duration: 0.3 }}
        className="bg-white p-6 rounded-xl shadow-lg"
      >
        <motion.div
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.5 }}
          className="text-3xl text-primary-600 mb-4 inline-block"
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </motion.div>
    </FadeIn>
  );
}
