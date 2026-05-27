import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to simulate network latency in Express endpoints.
 * Example: GET /api/records?delay=2000 delays response by 2 seconds.
 */
export const delayMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const delayParam = req.query.delay;
  
  if (delayParam) {
    const delayMs = parseInt(delayParam as string, 10);
    
    if (!isNaN(delayMs) && delayMs > 0) {
      // Delay response by returning a timeout promise
      setTimeout(() => {
        next();
      }, delayMs);
      return;
    }
  }
  
  next();
};
