import { Request, Response } from 'express';
import Record from '../models/Record';

export const getRecords = async (req: Request, res: Response) => {
  try {
    const userRole = req.header('x-user-role');
    const userId = req.header('x-user-id');

    if (!userRole || !userId) {
      return res.status(401).json({ error: 'Unauthorized. Headers x-user-id and x-user-role are required.' });
    }

    if (userRole === 'Admin') {
      const records = await Record.find().select('-_id -__v');
      return res.json(records);
    } else if (userRole === 'General User') {
      const userRecords = await Record.find({ userId }).select('-_id -__v');
      return res.json(userRecords);
    } else {
      return res.status(403).json({ error: 'Forbidden. Unknown role.' });
    }
  } catch (error) {
    console.error('Fetch records error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
