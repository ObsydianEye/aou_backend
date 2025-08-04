import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
    action: string;
    description: string;
    performedBy: string;
    timestamp: Date;
}

const ActivitySchema: Schema = new Schema(
    {
        action: { type: String, required: true },
        description: { type: String, required: true },
        performedBy: { type: String, required: true },
        timestamp: { type: Date, required: true, default: Date.now },
    },
    { timestamps: false } // since we're using explicit `timestamp` field
);

export const ActivityModel = mongoose.model<IActivity>('Activity', ActivitySchema);
