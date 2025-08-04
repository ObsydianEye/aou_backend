import { Router } from 'express';
import {
    loginUser,
    createNewUser
} from '../controllers/auth.controller';

const router = Router();
router.post('/login', loginUser);
router.post('/signup', createNewUser);

export default router;
