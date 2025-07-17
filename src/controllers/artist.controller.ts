import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import ArtistModel from "../models/artist_collection";

export const createArtist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artist = req.body;
        const result = await ArtistModel.create(artist);

        if (!result || !result._id) {
            return res.status(500).json({ detail: "Failed to create artist" });
        }

        const created_artist = result.toObject?.() || result;
        created_artist.id = result._id.toString();

        return res.status(201).json(created_artist);
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({ detail: "Validation error", errors: messages });
        }
        if (error.code === 11000) {
            return res.status(409).json({ detail: "Duplicate entry", key: error.keyValue });
        }
        console.error("[Create Artist Error]", error);
        return res.status(500).json({ detail: "Internal server error" });
    }
};

export const getAllArtists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const type = req.query.type as string | undefined;
        const query: any = {};
        if (type) {
            query.type = type;
        }
        const artists = await ArtistModel.find(query).sort({ createdAt: -1 }).lean();
        const response = artists.map(artist => ({
            ...artist,
            id: artist._id.toString()
        }));
        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const getArtist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artist_id = req.params.artist_id;
        if (!Types.ObjectId.isValid(artist_id)) {
            return res.status(400).json({ detail: "Invalid artist ID" });
        }
        const artist = await ArtistModel.findById(artist_id).lean();
        if (!artist) {
            return res.status(404).json({ detail: "Artist not found" });
        }
        artist.id = artist._id.toString();
        return res.status(200).json(artist);
    } catch (error) {
        next(error);
    }
};

export const updateArtist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artist_id = req.params.artist_id;
        const update_data = req.body;

        if (!Types.ObjectId.isValid(artist_id)) {
            return res.status(400).json({ detail: "Invalid artist ID" });
        }

        const updatePayload = Object.entries(update_data).reduce((acc, [k, v]) => {
            if (v !== undefined && v !== null) acc[k] = v;
            return acc;
        }, {} as Record<string, any>);

        if (Object.keys(updatePayload).length === 0) {
            return res.status(400).json({ detail: "No update data provided" });
        }

        await ArtistModel.updateOne(
            { _id: artist_id },
            { $set: updatePayload }
        );

        const updated_artist = await ArtistModel.findById(artist_id).lean();
        if (!updated_artist) {
            return res.status(404).json({ detail: "Artist not found" });
        }
        updated_artist.id = updated_artist._id.toString();
        return res.status(200).json(updated_artist);
    } catch (error) {
        next(error);
    }
};

export const deleteArtist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const artist_id = req.params.artist_id;
        if (!Types.ObjectId.isValid(artist_id)) {
            return res.status(400).json({ detail: "Invalid artist ID" });
        }
        const result = await ArtistModel.deleteOne({ _id: artist_id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ detail: "Artist not found" });
        }
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};
