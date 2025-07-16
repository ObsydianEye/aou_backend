import { User } from '../models/user_collection'; // Adjust path as needed

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
interface SimpleUser {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    role: string;
    updatedAt: string;
    isActive: boolean;
    lastLogin: string;
}


export { User, SimpleUser };
