import express, { Request, Response } from 'express';
import Candidate from '../models/Candidate';
import { logger } from '../utils/logger';

const router = express.Router();

// Create candidate
router.post('/', async (req: Request, res: Response) => {
  try {
    logger.info('Creating candidate:', req.body);
    
    // Validate required fields
    const { name, email, targetRole } = req.body;
    if (!name || !email || !targetRole) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: name, email, and targetRole are required' 
      });
    }

    const candidate = await Candidate.create(req.body);
    logger.info('Candidate created successfully:', candidate._id);
    res.status(201).json({ success: true, data: candidate });
  } catch (error: any) {
    logger.error('Error creating candidate:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'A candidate with this email already exists' 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while creating candidate',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
