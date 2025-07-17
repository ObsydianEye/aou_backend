import { Schema, model, Document } from "mongoose";

export interface IBlog extends Document {
    title: string;
    excerpt: string;
    category: string;
    thumbnail: string;
    content: string;
    author: string;
    readTime: string;
    slug: string;
    date: string;
    createdAt: Date;
    updatedAt?: Date;
}

const BlogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true },
        excerpt: { type: String, required: true },
        category: { type: String, required: true },
        thumbnail: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: String, required: true },
        readTime: { type: String, default: "5 min read" },
        slug: { type: String, required: true, unique: true },
        date: { type: String, required: true }, // You might consider using Date type here if appropriate
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

export default model<IBlog>("Blog", BlogSchema);
