import { Router, Request, Response } from 'express';
import authRoute from "./auth.routes"
import { } from '../types/express';
import { authenticateToken } from '../middlewares/auth.validator';
import { requireAdmin } from '../middlewares/auth.validator';
import userRoute from "./user.routes"
import activityRoutes from "./activity.routes"
const router = Router();
router.get("/", (req, res) => { res.send("Getting the request") })

router.use("/auth", authRoute);
router.use('/users', authenticateToken, requireAdmin, userRoute)
router.use('/activities', authenticateToken, requireAdmin, activityRoutes)

export default router;
