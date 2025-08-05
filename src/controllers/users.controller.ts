import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId, FilterQuery } from "mongoose"
import { ObjectId as OId } from "mongodb"
import { SimpleUser as User } from '../types/express';
import { UserModel } from "../models/user_collection"
import { users } from '../models/user.store';
import { ActivityModel } from '../models/activities_collection';
import bcrypt from 'bcrypt';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { fullname, email, username, password, role = '' } = req.body;

    if (!fullname || !email || !username || !password) {
      return res.status(400).json({ message: 'Fullname, email, username, and password are required.' });
    }

    const existing = await UserModel.findOne({
      $or: [{ email }, { username }]
    });
    if (existing) {
      return res.status(409).json({ message: 'Email or username already exists.' });
    }

    const allowedRoles = ['super_admin', 'admin', 'editor'];
    const roleToUse = allowedRoles.includes(role) ? role : 'editor';

    const newUser = new UserModel({
      fullname,
      email,
      username,
      password,
      role: roleToUse,
      createdBy: req.user?.name || 'Super Admin'
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        isActive: newUser.isActive,
        lastLogin: newUser.lastLogin,
        createdBy: newUser.createdBy,
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
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
        { fullname: { $regex: search, $options: 'i' } },
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
      fullname: user.fullname,
      username: user.username,
      email: user.email,
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

// export const getUserById = async (req: Request, res: Response) => {
//     try {
//         const rawUser = await UserModel.findById(req.params.id).lean();

//         if (!rawUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Transform _id ➜ id inline
//         const user = {
//             ...rawUser,
//             id: rawUser._id.toString(),
//         };

//         delete (user as any)._id; // Optional: remove _id if not needed

//         res.json(user);
//     } catch (err) {
//         res.status(500).json({ message: 'Internal server error', error: err });
//     }
// };

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { fullname, username, email, role, password, isActive } = req.body;

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if username is being updated and already taken by another user
    if (username && username !== user.username) {
      const existingUser = await UserModel.findOne({ username });
      if (existingUser && existingUser.id.toString() !== userId) {
        return res.status(409).json({ message: 'Username is already taken.' });
      }
      user.username = username;
    }

    // Update only allowed fields if present
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    user.updatedAt = new Date(); // optional: if your schema tracks this

    await user.save();

    return res.status(200).json({
      message: 'User updated successfully.',
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
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

// export const toggleUserStatus = async (req: Request, res: Response) => {
//     try {
//         const userId = req.params.user_id;
//         const currentUser = req.user as User; // Assumes middleware sets req.user

//         // Validate user ID
//         if (!OId.isValid(userId)) {
//             return res.status(400).json({ message: 'Invalid user ID' });
//         }

//         // Find target user in in-memory store
//         const index = users.findIndex(u => u.id === userId);
//         if (index === -1) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const targetUser = users[index];

//         // Prevent status change for super admins
//         if (targetUser.role === 'super_admin') {
//             return res.status(400).json({ message: 'Cannot modify super admin user status' });
//         }

//         // Toggle status
//         const newStatus = !targetUser.isActive;
//         users[index] = {
//             ...targetUser,
//             isActive: newStatus,
//             updatedAt: new Date().toISOString(),
//         };

//         // Log activity to MongoDB
//         await ActivityModel.create({
//             action: 'user_status_changed',
//             description: `${newStatus ? 'Activated' : 'Deactivated'} user: ${targetUser.username || 'Unknown'}`,
//             performedBy: currentUser.username,
//             timestamp: new Date(),
//         });

//         // Return response
//         return res.status(200).json({
//             message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
//         });

//     } catch (err) {
//         console.error('Error toggling user status:', err);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };