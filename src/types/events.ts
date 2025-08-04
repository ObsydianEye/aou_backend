// types/event.types.ts
import { Document, Types } from 'mongoose';

export interface IEventBase {
    title: string;
    date: string;
    location: string;
    description: string;
    highlights?: string;
    images: string[];
    videoHighlight?: string;
    type: 'upcoming' | 'past' | 'drafted';
}

// Interface for creating events
export interface IEventCreate extends IEventBase { }

// Interface for updating events (all fields optional)
export interface IEventUpdate {
    title?: string;
    date?: string;
    location?: string;
    description?: string;
    highlights?: string;
    images?: string[];
    videoHighlight?: string;
    type?: 'upcoming' | 'past';
}

// Interface for Event document (includes MongoDB fields)
export interface IEvent extends IEventBase {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt?: Date;
}

// Mongoose Document type for Event
export interface IEventDocument extends IEvent, Document {
    _id: Types.ObjectId;
}

// Interface for API responses
export interface IEventResponse {
    events: IEvent[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Interface for client-side (with string _id)
export interface IEventClient extends Omit<IEvent, '_id'> {
    id: string;
    _id: string;
}

export interface IEventResponseClient {
    events: IEventClient[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}