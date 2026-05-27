import { Request, Response } from 'express';
import User from '../models/User';

export const login = async (req: Request, res: Response) => {
  try {
    const { id, password, role } = req.body;

    if (!id || !password || !role) {
      return res.status(400).json({ error: 'Missing parameters. User ID, password, and role are required.' });
    }

    const user = await User.findOne({ 
      id: { $regex: new RegExp(`^${id}$`, 'i') }, 
      password, 
      role 
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials or role selection.' });
    }

    const token = `dummy-jwt-token-for-${user.id}-${Date.now()}`;
    
    const userObj = user.toObject();
    const { password: _, _id, __v, ...userWithoutPassword } = userObj as any;

    return res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
