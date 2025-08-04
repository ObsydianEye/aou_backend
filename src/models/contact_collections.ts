import mongoose, { Schema, Document } from "mongoose";

export interface ContactDocument extends Document {
    name: string;
    email: string;
    message: string;
    createdAt: Date;
}

const ContactSchema = new Schema<ContactDocument>(
    {
        name: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            match: /\S+@\S+\.\S+/,
        },
        message: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 1000,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false }, // only createdAt
    }
);

export default mongoose.model<ContactDocument>("Contact", ContactSchema);
