import { Router } from "express";
const router = Router();
import { getAllArtists, getArtist, createArtist, updateArtist, deleteArtist } from "../controllers/artist.controller"

router.get("/", getAllArtists)
router.get("/:id", getArtist)
router.post("/", createArtist)
router.put("/:id", updateArtist)
router.delete("/:id", deleteArtist)

export default router;