import { Request, Response, NextFunction } from 'express';

// Helper middleware to check Admin role
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const userRole = req.header('x-user-role');
  if (userRole !== 'Admin') {
    return res.status(403).json({ error: 'Forbidden. Administrative credentials required.' });
  }
  next();
};
