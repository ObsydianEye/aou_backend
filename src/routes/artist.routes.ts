import { Router } from "express";
const router = Router();
import { getAllArtists, getArtist, createArtist, updateArtist, deleteArtist } from "../controllers/artist.controller"
import { authenticateToken, requireAdmin } from "../middlewares/auth.validator";

router.get("/", getAllArtists)
router.get("/:id", getArtist)
router.post("/", authenticateToken, requireAdmin, createArtist)
router.put("/:artist_id", authenticateToken, requireAdmin, updateArtist)
router.delete("/:artist_id", authenticateToken, requireAdmin, deleteArtist)

export default router;