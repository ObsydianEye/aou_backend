import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import ArtistModel from "../models/artist_collection";
import { ArtistUpdate } from "../types/artist";

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
            id: artist._id.toString(),
        }));

        return res.status(200).json({
            data: {
                totalArtists: response.length,
                artists: response,
            },
        });
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

export const updateArtist = async (
    req: Request<{ artist_id: string }, {}, ArtistUpdate>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { artist_id } = req.params;
        const updateData = req.body;
        if (!Types.ObjectId.isValid(artist_id)) {
            return res.status(400).json({ detail: "Invalid artist ID" });
        }

        const cleanedData = Object.fromEntries(
            Object.entries(updateData).filter(([_, v]) => v != null)
        );

        if (Object.keys(cleanedData).length === 0) {
            return res.status(400).json({ detail: "No update data provided" });
        }

        const updated = await ArtistModel.findByIdAndUpdate(
            artist_id,
            { $set: cleanedData },
            { new: true }
        ).lean();

        if (!updated) {
            return res.status(404).json({ detail: "Artist not found" });
        }

        return res.status(200).json({ ...updated, id: updated._id.toString() });
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
