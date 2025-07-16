import jwt, { SignOptions } from 'jsonwebtoken';
import envConfig from './envConfig';
const JWT_SECRET = envConfig.JWT_SECRET || "aree";
const JWT_EXPIRES_IN = envConfig.JWT_EXPIRES_IN || "1h";

interface JwtPayload {
    id: any;
    username: string;
    role: 'admin' | 'super_admin' | 'editor';
}

export const generateToken = (payload: JwtPayload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
