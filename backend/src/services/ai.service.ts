import OpenAI from 'openai';
import { logger } from '../utils/logger';

// Initialize OpenAI client only if API key is provided
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export class AIService {
  // Analyze answer quality
  async analyzeAnswerQuality(question: string, answer: string): Promise<any> {
    try {
      if (!openai) {
        logger.warn('OpenAI API key not configured, returning mock analysis');
        return {
          score: 75,
          strengths: ['Clear communication', 'Structured response'],
          weaknesses: ['Could provide more details'],
          suggestions: ['Add specific examples', 'Elaborate on technical aspects'],
          relevance: 80,
          clarity: 75,
          completeness: 70
        };
      }
      const prompt = `
        As an expert interviewer, analyze the following interview response:
        
        Question: ${question}
        Answer: ${answer}
        
        Provide a JSON response with:
        1. score (0-100): Overall quality score
        2. strengths: Array of strengths in the answer
        3. weaknesses: Array of weaknesses in the answer
        4. suggestions: Array of improvement suggestions
        5. relevance: How relevant the answer is (0-100)
        6. clarity: How clear the answer is (0-100)
        7. completeness: How complete the answer is (0-100)
      `;

      const client = openai; // Type narrowing
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert interview evaluator. Provide detailed, constructive feedback.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      logger.error('Error analyzing answer quality:', error);
      throw error;
    }
  }

  // Analyze sentiment from text
  async analyzeSentiment(text: string): Promise<any> {
    try {
      if (!openai) {
        logger.warn('OpenAI API key not configured, returning mock sentiment');
        return {
          sentiment: 'positive',
          confidence: 75,
          emotions: ['confident', 'professional'],
          professionalism: 80,
          enthusiasm: 70
        };
      }
      
      const prompt = `
        Analyze the sentiment and emotional state of this interview response:
        "${text}"
        
        Provide a JSON response with:
        1. sentiment: positive/neutral/negative
        2. confidence: 0-100 (how confident the candidate sounds)
        3. emotions: Array of detected emotions
        4. professionalism: 0-100
        5. enthusiasm: 0-100
      `;

      const client = openai; // Type narrowing
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.5,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      logger.error('Error analyzing sentiment:', error);
      throw error;
    }
  }

  // Generate interview questions
  async generateQuestions(
    role: string,
    level: string,
    count: number = 5
  ): Promise<string[]> {
    try {
      if (!openai) {
        logger.warn('OpenAI API key not configured, returning mock questions');
        return [
          `Tell me about your experience with ${role} responsibilities`,
          'Describe a challenging project you worked on and how you overcame obstacles',
          `What technical skills do you bring to this ${role} position?`,
          'How do you handle tight deadlines and competing priorities?',
          'Where do you see yourself in the next 3-5 years?'
        ].slice(0, count);
      }
      
      const prompt = `
        Generate ${count} interview questions for a ${level} ${role} position.
        Questions should be diverse and cover technical skills, problem-solving, and behavioral aspects.
        Return as a JSON array of strings.
      `;

      const client = openai; // Type narrowing
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result.questions || [];
    } catch (error) {
      logger.error('Error generating questions:', error);
      throw error;
    }
  }

  // Speech to text
  async transcribeAudio(audioFile: Buffer): Promise<string> {
    try {
      if (!openai) {
        logger.warn('OpenAI API key not configured, returning mock transcription');
        return 'This is a mock transcription. Please configure OpenAI API key for actual transcription.';
      }
      
      const client = openai; // Type narrowing
      const response = await client.audio.transcriptions.create({
        file: new File([audioFile], 'audio.webm', { type: 'audio/webm' }),
        model: 'whisper-1',
      });

      return response.text;
    } catch (error) {
      logger.error('Error transcribing audio:', error);
      throw error;
    }
  }

  // Generate comprehensive feedback
  async generateFeedback(interviewData: any): Promise<any> {
    try {
      if (!openai) {
        logger.warn('OpenAI API key not configured, returning mock feedback');
        return {
          overallScore: 75,
          strengths: ['Good communication skills', 'Technical knowledge'],
          areasOfImprovement: ['More specific examples needed', 'Elaborate on past experiences'],
          detailedFeedback: 'Overall solid performance with room for improvement in providing specific examples.',
          recommendations: ['Practice STAR method for behavioral questions', 'Prepare more technical examples'],
          nextSteps: ['Review common interview questions', 'Practice with mock interviews']
        };
      }
      
      const prompt = `
        Generate comprehensive interview feedback based on this data:
        ${JSON.stringify(interviewData, null, 2)}
        
        Provide a JSON response with:
        1. overallScore: 0-100
        2. strengths: Array of key strengths
        3. areasOfImprovement: Array of areas to improve
        4. detailedFeedback: Detailed paragraph
        5. recommendations: Array of specific recommendations
        6. nextSteps: Suggested next steps for improvement
      `;

      const client = openai; // Type narrowing
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert career coach providing interview feedback.',
          },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      logger.error('Error generating feedback:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
