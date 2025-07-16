import { Router, Request, Response } from 'express';
import authRoute from "./auth.routes"
import { authMiddleware } from '../middlewares/auth.jwt';
import { requireAdmin } from '../middlewares/auth.validator';
import userRoute from "./user.routes"
const router = Router();
router.get("/", (req, res) => { res.send("Getting the request") })

router.use("/auth", authRoute);
router.use('/users', authMiddleware, requireAdmin, userRoute)

export default router;
