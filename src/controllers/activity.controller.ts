import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { ActivityModel } from "../models/activities_collection";
import { ActivityResponse, Activity } from "../types/activities";

export const getActivities = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
        const search = req.query.search as string | undefined;
        const action = req.query.action as string | undefined;
        const performed_by = req.query.performed_by as string | undefined;
        const current_user = req.user; // From middleware enforcing admin via JWT

        const query: any = {};

        if (search) {
            query.$or = [
                { description: { $regex: search, $options: "i" } },
                { performedBy: { $regex: search, $options: "i" } }
            ];
        }

        if (action && action !== "all") {
            query.action = action;
        }

        if (performed_by && performed_by !== "all") {
            query.performedBy = performed_by;
        }

        const total = await ActivityModel.countDocuments(query);
        const totalPages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;

        const activityDocs = await ActivityModel.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const activities: Activity[] = activityDocs.map(doc => ({
            id: doc._id.toString(),
            action: doc.action,
            description: doc.description,
            performedBy: doc.performedBy,
            timestamp: doc.timestamp.toISOString()
        }));

        const response: ActivityResponse = {
            activities,
            total,
            page,
            limit,
            totalPages
        };

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const clearActivities = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUser = req.user; // populated via admin-auth middleware

        const result = await ActivityModel.deleteMany({});

        const logActivity: Omit<Activity, "id" | "timestamp"> & { timestamp: Date } = {
            action: "activities_cleared",
            description: `Cleared all activity logs (${result.deletedCount} records)`,
            performedBy: currentUser.username,
            timestamp: new Date()
        };

        await ActivityModel.create(logActivity);

        return res.status(200).json({
            message: `Cleared ${result.deletedCount} activity records`
        });
    } catch (error) {
        next(error);
    }
};
