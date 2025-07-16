import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId, FilterQuery } from "mongoose"
import { ObjectId as OId } from "mongodb"
import { SimpleUser as User } from '../types/express';
import { UserModel } from "../models/user_collection"
import { users } from '../models/user.store';
import { ActivityModel } from '../models/activities_collection';

export const createUser = (req: Request, res: Response) => {
    try {
        const { name, email, username, role = 'editor' } = req.body;

        // Basic validation
        if (!name || !email || !username) {
            return res.status(400).json({ message: 'Name, email, and username are required.' });
        }

        // Check for duplicate email or username (optional)
        const existingUser = users.find(
            u => u.email === email || u.username === username
        );
        if (existingUser) {
            return res.status(409).json({ message: 'Email or username already exists.' });
        }

        const newUser: User = {
            id: uuidv4(),
            name,
            email,
            username,
            role,
            isActive: true,
            password: '', // assume it's set later or managed via auth service
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        users.push(newUser);

        return res.status(201).json({
            message: 'User created successfully',
            user: newUser,
        });
    } catch (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, role, is_active } = req.query;

        const query: FilterQuery<User> = {};

        if (search && typeof search === 'string') {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
            ];
        }

        if (role && typeof role === 'string') {
            query.role = role;
        }

        if (typeof is_active === 'string') {
            query.isActive = is_active === 'true';
        }

        const userDocs = await UserModel.find(query).sort({ createdAt: -1 });

        const users = userDocs.map(user => ({
            id: (user._id as ObjectId).toString(),
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
        }));

        return res.json(users);
    } catch (err) {
        next(err);
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const rawUser = await UserModel.findById(req.params.id).lean();

        if (!rawUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Transform _id ➜ id inline
        const user = {
            ...rawUser,
            id: rawUser._id.toString(),
        };

        delete (user as any)._id; // Optional: remove _id if not needed

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err });
    }
};

export const updateUser = (req: Request, res: Response) => {
    const index = users.findIndex(u => u.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (!req.body) {
        res.json({ message: "The body is empty... Please fill it" })
    }
    else {
        const { name, email } = req.body;

        // Optional: validate incoming fields
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required.' });
        }

        users[index] = {
            ...users[index],
            name,
            email,
            lastLogin: new Date().toISOString()
        };

        res.json(users[index]);
    }
    // res.send("hehe")
};


export const deleteUser = (req: Request, res: Response) => {
    const userId = req.params.id;

    const index = users.findIndex(u => u.id === userId);

    if (index === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    const [deletedUser] = users.splice(index, 1); // clearer destructuring

    res.status(200).json({
        message: 'User deleted successfully',
        user: deletedUser,
    });
};
export const toggleUserStatus = async (req: Request, res: Response) => {
    try {
        const userId = req.params.user_id;
        const currentUser = req.user as User; // Assumes middleware sets req.user

        // Validate user ID
        if (!OId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Find target user in in-memory store
        const index = users.findIndex(u => u.id === userId);
        if (index === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const targetUser = users[index];

        // Prevent status change for super admins
        if (targetUser.role === 'super_admin') {
            return res.status(400).json({ message: 'Cannot modify super admin user status' });
        }

        // Toggle status
        const newStatus = !targetUser.isActive;
        users[index] = {
            ...targetUser,
            isActive: newStatus,
            updatedAt: new Date().toISOString(),
        };

        // Log activity to MongoDB
        await ActivityModel.create({
            action: 'user_status_changed',
            description: `${newStatus ? 'Activated' : 'Deactivated'} user: ${targetUser.username || 'Unknown'}`,
            performedBy: currentUser.username,
            timestamp: new Date(),
        });

        // Return response
        return res.status(200).json({
            message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
        });

    } catch (err) {
        console.error('Error toggling user status:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};