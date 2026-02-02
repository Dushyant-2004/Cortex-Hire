import express, { Request, Response } from 'express';
import Candidate from '../models/Candidate';
import { logger } from '../utils/logger';

const router = express.Router();

// Create candidate
router.post('/', async (req: Request, res: Response) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json({ success: true, data: candidate });
  } catch (error: any) {
    logger.error('Error creating candidate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all candidates
router.get('/', async (req: Request, res: Response) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json({ success: true, data: candidates });
  } catch (error: any) {
    logger.error('Error fetching candidates:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get candidate by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.json({ success: true, data: candidate });
  } catch (error: any) {
    logger.error('Error fetching candidate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update candidate
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.json({ success: true, data: candidate });
  } catch (error: any) {
    logger.error('Error updating candidate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete candidate
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (error: any) {
    logger.error('Error deleting candidate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
