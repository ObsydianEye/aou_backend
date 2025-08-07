import { Router } from "express";
import { createBlog, deleteBlog, getBlogById, getBlogBySlug, getBlogs, getCategories, updateBlog } from "../controllers/blogs.controller";
import { authenticateToken, requireAdmin } from "../middlewares/auth.validator";

const router = Router();

router.get("/", getBlogs)
router.get("/:blogId", getBlogById)
router.get("/by-slug/:slug", getBlogBySlug)
router.get("/categories/list", getCategories)

router.post("/", authenticateToken, requireAdmin, createBlog)
router.put("/:blogId", authenticateToken, requireAdmin, updateBlog)
router.delete("/:blogId", authenticateToken, requireAdmin, deleteBlog)

export default router;