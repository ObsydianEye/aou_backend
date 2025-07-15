import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export type UserRole = 'super_admin' | 'admin' | 'editor'
export interface IUser extends Document {
    username: string;
    email: string;
    name: string;
    role: UserRole;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    createdBy?: string;
    comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['super_admin', 'admin', 'editor'], default: 'editor' },
    password: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    createdBy: { type: String, default: "Super Admin" },
});

// Add method to compare hashed passwords
UserSchema.methods.comparePassword = function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
};

export const UserModel = mongoose.model<IUser>('User', UserSchema);
