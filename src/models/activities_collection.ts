import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
    action: string;
    description: string;
    performedBy: string;
    timestamp: Date;
}

const ActivitySchema = new Schema<IActivity>(
    {
        action: { type: String, required: true },
        description: { type: String, required: true },
        performedBy: { type: String, required: true },
        timestamp: { type: Date, required: true, default: () => new Date() },
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (_doc, ret) => {
                ret.id = (ret._id as mongoose.Types.ObjectId).toString();
                delete ret._id;
            },
        },
    }
);

export const ActivityModel = mongoose.model<IActivity>('Activity', ActivitySchema);
