import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export class GeminiService {
  private model = genAI ? genAI.getGenerativeModel({ model: 'gemini-pro' }) : null;

  // Analyze confidence from video/audio patterns
  async analyzeConfidence(transcript: string, metadata: any): Promise<any> {
    try {
      if (!this.model) {
        logger.warn('Gemini API key not configured, returning mock confidence analysis');
        return {
          confidenceScore: 75,
          indicators: ['Clear speech', 'Good pacing'],
          concerns: ['Some filler words'],
          suggestions: ['Practice reducing filler words', 'Take brief pauses before answering']
        };
      }
      const prompt = `
        Analyze the confidence level of a candidate based on:
        Transcript: ${transcript}
        Metadata: ${JSON.stringify(metadata)}
        
        Consider:
        - Speech patterns (filler words, pauses)
        - Response time
        - Word choice and clarity
        
        Return JSON with:
        1. confidenceScore: 0-100
        2. indicators: Array of confidence indicators
        3. concerns: Array of confidence concerns
        4. suggestions: How to improve confidence
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      logger.error('Error analyzing confidence:', error);
      throw error;
    }
  }

  // Multi-modal analysis (if using gemini-pro-vision)
  async analyzeVideoFrame(imageData: string): Promise<any> {
    try {
      if (!genAI) {
        logger.warn('Gemini API key not configured, returning mock video analysis');
        return {
          facialExpressions: 'Engaged and attentive',
          bodyLanguage: 'Professional posture',
          engagementLevel: 80,
          professionalAppearance: 85
        };
      }
      
      const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
      
      const prompt = `
        Analyze this video frame from an interview:
        - Facial expressions
        - Body language
        - Engagement level
        - Professional appearance
        
        Return JSON with scores and observations.
      `;

      const result = await visionModel.generateContent([
        prompt,
        { inlineData: { data: imageData, mimeType: 'image/jpeg' } },
      ]);
      
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      logger.error('Error analyzing video frame:', error);
      throw error;
    }
  }

  // Generate follow-up questions
  async generateFollowUpQuestion(
    question: string,
    answer: string
  ): Promise<string> {
    try {
      if (!this.model) {
        logger.warn('Gemini API key not configured, returning generic follow-up');
        return 'Can you elaborate more on that point?';
      }
      
      const prompt = `
        Based on this interview exchange:
        Question: ${question}
        Answer: ${answer}
        
        Generate one insightful follow-up question to dig deeper.
        Return only the question text.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      logger.error('Error generating follow-up question:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
