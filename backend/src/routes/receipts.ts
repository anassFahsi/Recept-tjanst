import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { getMyReceipts } from '../controllers/receiptsController';

const router = Router();

router.get('/me', requireAuth, getMyReceipts);

export default router;
