import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    res.status(201).json({ 
      message: 'User registered successfully',
      token: 'dummy_token_' + Date.now(),
      user: { 
        _id: 'user_' + Date.now(),
        email, 
        name,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // In a real app, validate credentials against database
    // For now, return mock user data with name extracted from email
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
    
    res.status(200).json({ 
      message: 'Login successful',
      token: 'dummy_token_' + Date.now(),
      user: { 
        _id: 'user_' + Date.now(),
        email,
        name,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;