import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user_collection';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';


export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await UserModel.findOne({ username });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'User account is deactivated' });
        }

        // Optional: update lastLogin
        user.lastLogin = new Date();
        await user.save();

        const token = generateToken({
            id: user._id,
            username: user.username,
            role: user.role,
        });

        return res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};
export const signupUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password, name, role } = req.body;

        if (!username || !email || !password || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            username,
            email,
            name,
            password: hashedPassword,
            role: role || 'editor', // default role
        });

        const token = generateToken({
            id: newUser._id,
            username: newUser.username,
            role: newUser.role,
        });

        return res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
            },
        });
    } catch (err) {
        next(err);
    }
};