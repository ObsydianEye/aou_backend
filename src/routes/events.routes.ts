import { Router } from "express";
import { authenticateToken, requireAdmin } from "../middlewares/auth.validator";
import {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} from "../controllers/events.controller"
const router = Router();

router.get("/", getEvents)
router.get("/:id", getEventById)
router.post("/", authenticateToken, requireAdmin, createEvent)
router.put("/:id", authenticateToken, requireAdmin, updateEvent)
router.delete("/:id", authenticateToken, requireAdmin, deleteEvent)

export default router;