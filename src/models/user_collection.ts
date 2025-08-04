import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Define user roles
export type UserRole = 'super_admin' | 'admin' | 'editor';

// Define the Mongoose document interface
export interface IUser extends Document {
    fullname: string;
    username: string;
    email: string;
    role: UserRole;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    createdBy?: string;
    comparePassword(candidate: string): Promise<boolean>;
}

// Define the plain User type (without Mongoose methods)
export type User = Omit<IUser, 'comparePassword' | 'save' | 'validate' | '$isDeleted' | '$locals' | '$op'> & {
    _id: string; // Force _id to be string for `req.user`
};

// Mongoose schema
const UserSchema = new Schema<IUser>({
    fullname: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    role: { type: String, enum: ['super_admin', 'admin', 'editor'], default: 'editor' },
    password: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    createdBy: { type: String, default: "Super Admin" },
});

// Password comparison method
UserSchema.methods.comparePassword = function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
};

// Mongoose model
export const UserModel = mongoose.model<IUser>('User', UserSchema);
