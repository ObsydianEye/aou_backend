import { Request, Response, NextFunction } from "express";
import BlogModel from "../models/blogs_collection";
import { EventModel } from "../models/events_collection";
import { UserModel } from "../models/user_collection";

// Controller to get dashboard stats
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const currentUser = req.user; // assume populated by JWT middleware

        // if (!currentUser || !["admin", "super_admin", "editor"].includes(currentUser.role)) {
        //     return res.status(403).json({ detail: "Not enough permissions to access dashboard stats." });
        // }

        const [totalBlogs, totalEvents, totalArtists] = await Promise.all([
            BlogModel.countDocuments({}),
            EventModel.countDocuments({}),
            UserModel.countDocuments({ role: "artist" }),
        ]);

        return res.status(200).json({
            totalBlogs,
            totalEvents,
            totalArtists,
        });
    } catch (error) {
        console.error("[Dashboard Stats Error]", error);
        return res.status(500).json({ detail: "Failed to fetch dashboard stats. Please try again later." });
    }
};
