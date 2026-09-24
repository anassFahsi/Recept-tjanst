import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { checkout } from '../controllers/checkoutController';

const router = Router();

router.post('/', requireAuth, checkout);

export default router;