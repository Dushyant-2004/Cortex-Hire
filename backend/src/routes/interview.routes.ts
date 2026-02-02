import express, { Request, Response } from 'express';
import Interview from '../models/Interview';
import Candidate from '../models/Candidate';
import Question from '../models/Question';
import { aiService } from '../services/ai.service';
import { geminiService } from '../services/gemini.service';
import { logger } from '../utils/logger';

const router = express.Router();

// Create new interview
router.post('/', async (req: Request, res: Response) => {
  try {
    const { candidateId, role, level, questionCount = 5 } = req.body;

    // Generate questions
    const generatedQuestions = await aiService.generateQuestions(
      role,
      level,
      questionCount
    );

    // Save questions
    const questionDocs = await Question.insertMany(
      generatedQuestions.map((q) => ({
        question: q,
        category: 'technical',
        difficulty: level === 'entry' ? 'easy' : level === 'mid' ? 'medium' : 'hard',
        tags: [role],
      }))
    );

    const interview = await Interview.create({
      candidateId,
      role,
      level,
      questions: questionDocs.map((q) => q._id),
      status: 'scheduled',
      scheduledAt: new Date(),
    });

    res.status(201).json({ success: true, data: interview });
  } catch (error: any) {
    logger.error('Error creating interview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get interview by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidateId')
      .populate('questions');

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    res.json({ success: true, data: interview });
  } catch (error: any) {
    logger.error('Error fetching interview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start interview
router.patch('/:id/start', async (req: Request, res: Response) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      {
        status: 'in-progress',
        startedAt: new Date(),
      },
      { new: true }
    );

    res.json({ success: true, data: interview });
  } catch (error: any) {
    logger.error('Error starting interview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit answer
router.post('/:id/answer', async (req: Request, res: Response) => {
  try {
    const { questionId, answer, duration } = req.body;

    const interview = await Interview.findById(req.params.id).populate('questions');
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Analyze answer quality
    const qualityAnalysis = await aiService.analyzeAnswerQuality(
      question.question,
      answer
    );

    // Analyze sentiment
    const sentimentAnalysis = await aiService.analyzeSentiment(answer);

    // Analyze confidence
    const confidenceAnalysis = await geminiService.analyzeConfidence(answer, {
      duration,
    });

    interview.answers.push({
      questionId: question._id,
      question: question.question,
      answer,
      duration,
      qualityScore: qualityAnalysis.score,
      sentiment: {
        type: sentimentAnalysis.sentiment,
        confidence: sentimentAnalysis.confidence,
        emotions: sentimentAnalysis.emotions,
      },
      confidenceScore: confidenceAnalysis.confidenceScore,
      timestamp: new Date(),
    } as any);

    await interview.save();

    res.json({
      success: true,
      data: {
        qualityAnalysis,
        sentimentAnalysis,
        confidenceAnalysis,
      },
    });
  } catch (error: any) {
    logger.error('Error submitting answer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Complete interview
router.patch('/:id/complete', async (req: Request, res: Response) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    // Calculate overall score
    const avgScore =
      interview.answers.reduce((sum, a) => sum + a.qualityScore, 0) /
      interview.answers.length;

    // Generate comprehensive feedback
    const feedback = await aiService.generateFeedback({
      role: interview.role,
      level: interview.level,
      answers: interview.answers,
    });

    interview.status = 'completed';
    interview.completedAt = new Date();
    interview.overallScore = avgScore;
    interview.feedback = feedback;
    interview.duration =
      (interview.completedAt.getTime() - interview.startedAt!.getTime()) / 1000;

    await interview.save();

    res.json({ success: true, data: interview });
  } catch (error: any) {
    logger.error('Error completing interview:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all interviews for a candidate
router.get('/candidate/:candidateId', async (req: Request, res: Response) => {
  try {
    const interviews = await Interview.find({
      candidateId: req.params.candidateId,
    })
      .populate('questions')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: interviews });
  } catch (error: any) {
    logger.error('Error fetching candidate interviews:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
