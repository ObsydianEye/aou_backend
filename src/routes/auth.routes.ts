import { Router } from 'express';
import {
    loginUser,
    signupUser
} from '../controllers/auth.controller';

const router = Router();
router.get("/", (req, res) => { res.send("Getting the request") })
router.post('/login', loginUser);
router.post('/signup', signupUser);

export default router;
