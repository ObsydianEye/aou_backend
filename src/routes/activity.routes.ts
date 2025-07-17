import { Router } from "express"
import {getActivities, clearActivities} from "../controllers/activity.controller"
const router = Router();

router.get("/", getActivities)
router.delete("/", clearActivities)
export default router;