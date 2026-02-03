import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { email, name }
    });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    res.status(200).json({ 
      message: 'Login successful',
      token: 'dummy_token',
      user: { email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;