// models/event.model.ts
import mongoose, { Schema, Model } from 'mongoose';
import { IEventDocument } from '../types/events';

const EventSchema = new Schema<IEventDocument>({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    date: {
        type: String,
        required: [true, 'Event date is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Event location is required'],
        trim: true,
        maxlength: [300, 'Location cannot exceed 300 characters']
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    highlights: {
        type: String,
        trim: true,
        maxlength: [1000, 'Highlights cannot exceed 1000 characters'],
        default: null,
        validate: {
            validator: function (v: string | null) {
                return v === null || v.trim() === '' || v.length <= 1000;
            },
            message: 'Highlights cannot exceed 1000 characters'
        }
    },
    images: {
        type: [String],
        default: [],
        validate: {
            validator: function (images: string[]) {
                return images.length <= 10; // Limit to 10 images
            },
            message: 'Cannot have more than 10 images per event'
        }
    },
    videoHighlight: {
        type: String,
        trim: true,
        default: null,
        // validate: {
        //     validator: function (url: string) {
        //         if (!url) return true;
        //         const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        //         return urlPattern.test(url);
        //     },
        //     message: 'Please provide a valid URL for video highlight'
        // }
    },
    type: {
        type: String,
        enum: ['upcoming', 'past', 'drafted'],
        default: 'drafted',
        required: true
    },
}, {
    timestamps: true, // This automatically adds createdAt and updatedAt
    versionKey: false, // Removes __v field
});

// Indexes for better query performance
EventSchema.index({ type: 1, date: 1 });
EventSchema.index({ createdAt: -1 });
EventSchema.index({ title: 'text', description: 'text', location: 'text' });

// Static methods
EventSchema.statics.findByType = function (type: 'upcoming' | 'past') {
    return this.find({ type }).sort({ date: type === 'upcoming' ? 1 : -1 });
};

EventSchema.statics.findRecent = function (limit: number = 10) {
    return this.find().sort({ createdAt: -1 }).limit(limit);
};

// Instance methods
EventSchema.methods.markAsPast = function () {
    this.type = 'past';
    this.updatedAt = new Date();
    return this.save();
};

EventSchema.methods.addImage = function (imageUrl: string) {
    if (this.images.length >= 10) {
        throw new Error('Cannot add more than 10 images per event');
    }
    this.images.push(imageUrl);
    return this.save();
};

// Pre-save middleware
EventSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.updatedAt = new Date();
    }
    next();
});

// Create and export the model
const EventModel: Model<IEventDocument> = mongoose.model<IEventDocument>('Event', EventSchema);

export { EventModel };