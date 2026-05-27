import { Router } from 'express';
import { getRecords } from '../controllers/record.controller';
import { delayMiddleware } from '../middleware/delay.middleware';

const router = Router();

// Apply simulated delay middleware to record endpoints
router.use(delayMiddleware);

router.get('/', getRecords);

export default router;
