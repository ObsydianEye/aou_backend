import { Request, Response } from "express";
import { EventModel } from "../models/events_collection";
import { IEventCreate, IEventResponse, IEventUpdate } from "../types/events";
export const getEvents = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, parseInt(req.query.page as string) || 1);
        const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
        const search = req.query.search as string | undefined;
        const type = req.query.type as string | undefined;

        const query: any = {};

        if (search) {
            query.$text = { $search: search };
        }

        if (type && type !== "all") {
            query.$or = [{ type }];
        }

        const total = await EventModel.countDocuments(query);
        const totalPages = Math.ceil(total / limit);
        const skip = (page - 1) * limit;

        const events = await EventModel.find(query).sort({ date: -1 }).skip(skip).limit(limit);

        const formatted = events.map((event: any) => ({
            ...event.toObject(),
            id: event._id.toString(),
        }));

        const response: IEventResponse = {
            events: formatted,
            total,
            page,
            limit,
            totalPages,
        };
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch events", error: err });
    }
}

export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const event = await EventModel.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event.toObject()
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event',
            error: error.message
        });
    }
}

export const createEvent = async (req: Request, res: Response) => {
    try {
        const eventData: IEventCreate = req.body;
        const newEvent = new EventModel(eventData);
        const savedEvent = await newEvent.save();

        res.status(201).json({
            success: true,
            data: savedEvent.toObject(),
            message: 'Event created successfully'
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: 'Failed to create event',
            error: error.message
        });
    }
}

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData: IEventUpdate = req.body;

        const updatedEvent = await EventModel.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedEvent.toObject(),
            message: 'Event updated successfully'
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: 'Failed to update event',
            error: error.message
        });
    }
}

export const deleteEvent = async (req: Request, res: Response) => {
    console.log("erthgaerg")
    try {
        const { id } = req.params;
        console.log("hsdfgaewrg")
        const deletedEvent = await EventModel.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete event',
            error: error.message
        });
    }
}