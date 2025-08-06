import { Router } from 'express';
import {
    loginUser,
    createNewUser
} from '../controllers/auth.controller';
import { authenticateToken, requireAdmin } from '../middlewares/auth.validator';

const router = Router();
router.post('/login', loginUser);
router.post('/signup', authenticateToken, requireAdmin, createNewUser);

export default router;
