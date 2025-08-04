import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user_collection';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';


export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }
        
        const user = await UserModel.findOne({ username });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'User account is deactivated' });
        }
        
        user.lastLogin = new Date();
        await user.save();
        console.log(user);

        const token = generateToken({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });

        return res.status(200).json({ success: true, token });
    } catch (err) {
        console.error('Login error:', err);
        next(err); // Let global error middleware handle it
    }
};

export const createNewUser = async (req: Request, res: Response, next: NextFunction) => {
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
            password: hashedPassword,
            role: role || 'editor', // default role
        });

        return res.status(201).json({
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        next(err);
    }
};