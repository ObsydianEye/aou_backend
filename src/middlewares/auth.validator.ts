import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// import { usersCollection } from './db';
import envConfig from '../utils/envConfig';

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
        const payload = jwt.verify(token, SECRET_KEY) as { sub: string };
        const username = payload.sub;

        // const user = await usersCollection.findOne({ username, isActive: true });
        // if (!user) {
        //     return res.status(401).json({ detail: 'User not found' });
        // }

        // req.user = { ...user, _id: user._id.toString() }; // Attach to request
        next();
    } catch (err) {
        return res.status(401).json({ detail: 'Invalid authentication credentials' });
    }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;
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
