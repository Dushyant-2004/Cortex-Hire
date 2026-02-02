'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaBrain,
  FaChartLine,
  FaTrophy,
  FaCalendar,
  FaPlus,
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { candidateApi, interviewApi } from '@/lib/api';

export default function DashboardPage() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    improvementRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For demo purposes, using a mock candidate ID
        // In production, this would come from authentication
        const candidateId = localStorage.getItem('candidateId') || 'demo-id';
        
        if (candidateId === 'demo-id') {
          // Demo data
          setInterviews([]);
          setStats({
            totalInterviews: 0,
            averageScore: 0,
            improvementRate: 0,
          });
        } else {
          const res = await interviewApi.getByCandidateId(candidateId);
          const interviewData = res.data.data;
          
          setInterviews(interviewData);
          
          const completed = interviewData.filter((i: any) => i.status === 'completed');
          const avgScore =
            completed.reduce((sum: number, i: any) => sum + (i.overallScore || 0), 0) /
            completed.length || 0;
          
          setStats({
            totalInterviews: interviewData.length,
            averageScore: Math.round(avgScore),
            improvementRate: 15, // Mock calculation
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = interviews
    .filter((i) => i.status === 'completed')
    .map((i, index) => ({
      name: `Interview ${index + 1}`,
      score: i.overallScore || 0,
    }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Track your interview performance and progress</p>
          </div>
          <Link
            href="/interview/start"
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            <FaPlus />
            <span>New Interview</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<FaCalendar />}
            title="Total Interviews"
            value={stats.totalInterviews}
            color="blue"
          />
          <StatCard
            icon={<FaTrophy />}
            title="Average Score"
            value={`${stats.averageScore}%`}
            color="yellow"
          />
          <StatCard
            icon={<FaChartLine />}
            title="Improvement Rate"
            value={`+${stats.improvementRate}%`}
            color="green"
          />
        </div>

        {/* Performance Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Performance Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Recent Interviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Recent Interviews
          </h2>
          {interviews.length === 0 ? (
            <div className="text-center py-12">
              <FaBrain className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No interviews yet</p>
              <Link
                href="/interview/start"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Start Your First Interview
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <InterviewCard key={interview._id} interview={interview} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className={`inline-block p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} mb-4`}>
        <div className="text-2xl">{icon}</div>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </motion.div>
  );
}

function InterviewCard({ interview }: { interview: any }) {
  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    scheduled: 'bg-gray-100 text-gray-700',
  };

  return (
    <Link href={interview.status === 'completed' ? `/interview/${interview._id}/feedback` : `/interview/${interview._id}`}>
      <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary-500 transition cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{interview.role}</h3>
            <p className="text-sm text-gray-600 capitalize">{interview.level} Level</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[interview.status as keyof typeof statusColors]
            }`}
          >
            {interview.status}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
          {interview.overallScore && (
            <span className="font-semibold text-primary-600">
              Score: {interview.overallScore}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
