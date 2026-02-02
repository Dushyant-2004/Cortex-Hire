import Link from 'next/link';
import { FaVideo, FaBrain, FaChartLine, FaRocket } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <FaBrain className="text-4xl text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-800">Cortex Hire</h1>
          </div>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Interview
            <span className="text-primary-600"> Intelligence</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Conduct realistic mock interviews with AI. Get instant feedback on confidence,
            sentiment, and answer quality to ace your next interview.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/interview/start"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg"
            >
              Start Interview
            </Link>
            <Link
              href="/dashboard"
              className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            icon={<FaVideo />}
            title="Video Interviews"
            description="Real-time video and voice interviews with AI analysis"
          />
          <FeatureCard
            icon={<FaBrain />}
            title="AI Analysis"
            description="Confidence and sentiment tracking powered by advanced AI"
          />
          <FeatureCard
            icon={<FaChartLine />}
            title="Quality Scoring"
            description="Comprehensive answer quality evaluation and metrics"
          />
          <FeatureCard
            icon={<FaRocket />}
            title="Auto Feedback"
            description="Instant improvement tips and personalized suggestions"
          />
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600">10k+</div>
              <div className="text-gray-600 mt-2">Interviews Conducted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">95%</div>
              <div className="text-gray-600 mt-2">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">24/7</div>
              <div className="text-gray-600 mt-2">AI Availability</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
      <div className="text-3xl text-primary-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
