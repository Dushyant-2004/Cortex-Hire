import express, { Request, Response } from 'express';
import multer from 'multer';
import { aiService } from '../services/ai.service';
import { geminiService } from '../services/gemini.service';
import { logger } from '../utils/logger';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


// Transcribe audio
router.post('/transcribe', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio file provided' });
    }

    const transcription = await aiService.transcribeAudio(req.file.buffer);
    res.json({ success: true, data: { transcription } });
  } catch (error: any) {
    logger.error('Error transcribing audio:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Analyze sentiment
router.post('/sentiment', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const sentiment = await aiService.analyzeSentiment(text);
    res.json({ success: true, data: sentiment });
  } catch (error: any) {
    logger.error('Error analyzing sentiment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Analyze confidence
router.post('/confidence', async (req: Request, res: Response) => {
  try {
    const { transcript, metadata } = req.body;
    const confidence = await geminiService.analyzeConfidence(transcript, metadata);
    res.json({ success: true, data: confidence });
  } catch (error: any) {
    logger.error('Error analyzing confidence:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Analyze answer quality
router.post('/analyze-answer', async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;
    const analysis = await aiService.analyzeAnswerQuality(question, answer);
    res.json({ success: true, data: analysis });
  } catch (error: any) {
    logger.error('Error analyzing answer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Generate questions
router.post('/generate-questions', async (req: Request, res: Response) => {
  try {
    const { role, level, count = 5 } = req.body;
    const questions = await aiService.generateQuestions(role, level, count);
    res.json({ success: true, data: questions });
  } catch (error: any) {
    logger.error('Error generating questions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Analyze video frame
router.post('/analyze-frame', async (req: Request, res: Response) => {
  try {
    const { imageData } = req.body;
    const analysis = await geminiService.analyzeVideoFrame(imageData);
    res.json({ success: true, data: analysis });
  } catch (error: any) {
    logger.error('Error analyzing video frame:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
