import { Schema, model, Document } from "mongoose";

export interface IEvent extends Document {
    title: string;
    date: string; // Keep as string to match your Pydantic model
    location: string;
    description: string;
    highlights?: string;
    images: string[];
    videoHighlight?: string;
    type: "upcoming" | "past";
    createdAt: Date;
    updatedAt?: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        title: { type: String, required: true },
        date: { type: String, required: true }, // Could be Date if you prefer
        location: { type: String, required: true },
        description: { type: String, required: true },
        highlights: { type: String },
        images: { type: [String], default: [] },
        videoHighlight: { type: String },
        type: { type: String, enum: ["upcoming", "past"], default: "upcoming" },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

export default model<IEvent>("Event", EventSchema);
