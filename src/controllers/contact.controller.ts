import { Request, Response, NextFunction } from "express";
// import { Types } from "mongoose";
import ContactModel from "../models/contact_collections";

export const submitContactForm = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const submission = req.body;

        const result = await ContactModel.create(submission);

        return res.status(201).json({
            message: "Contact form submitted successfully",
            id: result.id.toString(),
        });
    } catch (error) {
        console.error("[Submit Contact Form Error]", error);
        return res.status(500).json({ detail: "Internal server error" });
    }
};

export const getContactSubmissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const submissions = await ContactModel.find()
            .sort({ createdAt: -1 })
            .lean();

        const response = submissions.map((doc) => ({
            ...doc,
            id: doc._id.toString(),
        }));

        return res.status(200).json(response);
    } catch (error) {
        console.error("[Get Contact Submissions Error]", error);
        return res.status(500).json({ detail: "Internal server error" });
    }
};