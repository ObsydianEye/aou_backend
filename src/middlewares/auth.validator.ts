import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import envConfig from '../utils/envConfig';
import { UserModel } from '../models/user_collection';

const SECRET_KEY = envConfig.JWT_SECRET;

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    if (!SECRET_KEY) {
        throw new Error('SECRET_KEY is not defined in environment variables');
    }
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ detail: 'Missing authentication token' });
    }

    try {
        const payload = jwt.verify(token, SECRET_KEY) as {
            id: string;
            username: string;
            role: string;
            iat: number;
            exp: number;
        };
        const username = payload.username;
        console.log(username)
        const user = await UserModel.findOne({ username, isActive: true });
        if (!user) {
            return res.status(401).json({ detail: 'User not found' });
        }
        
        req.user = { ...user.toObject(), _id: user.id.toString() }; // Attach to request
        next();
    } catch (err) {
        return res.status(401).json({ detail: 'Invalid authentication credentials' });
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const role = (req.user as any)?._doc?.role;
    if (!['admin', 'super_admin'].includes(role)) {
        return res.status(403).json({ detail: 'Not enough permissions' });
    }
    next();
};

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'super_admin') {
        return res.status(403).json({ detail: 'Super admin access required' });
    }
    next();
};
