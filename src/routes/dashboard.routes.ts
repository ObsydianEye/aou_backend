import { Router } from "express";
import { getDashboardStats } from '../controllers/dasboard.controller'

const router = Router();

router.use('/stats', getDashboardStats)

export default router;