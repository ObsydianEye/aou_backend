import mongoose, { Schema, Document, model } from "mongoose";

export interface IArtist extends Document {
    name: string;
    artForm: string;
    bio: string;
    image: string;
    instagram?: string;
    performances: string[];
    type: "performer" | "inspiration";
    createdAt: Date;
}

const ArtistSchema = new Schema<IArtist>(
    {
        name: { type: String, required: true, minlength: 1, maxlength: 100 },
        artForm: { type: String, required: true, minlength: 1, maxlength: 100 },
        bio: { type: String, required: true, minlength: 1, maxlength: 1000 },
        image: { type: String, required: true },
        instagram: { type: String, default: null },
        performances: { type: [String], default: [] },
        type: { type: String, enum: ["performer", "inspiration"], default: "performer" },
        createdAt: { type: Date, default: () => new Date() },
    },
    {
        versionKey: false,
    }
);

const ArtistModel = model<IArtist>("Artist", ArtistSchema);
export default ArtistModel;
