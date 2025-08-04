import { Router } from 'express';
import {
    getContactSubmissions,
    submitContactForm
} from '../controllers/contact.controller';
const router = Router();
router.get("/", getContactSubmissions)
router.post("/", submitContactForm)

export default router;