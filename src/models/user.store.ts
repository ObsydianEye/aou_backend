import { UserModel } from './user_collection';
import { SimpleUser as User } from '../types/express';
export let users: User[] = [];

export const loadUsersFromDB = async () => {
    const rawUsers = await UserModel.find().lean();

    users = rawUsers.map((u: any) => ({
        ...u,
        id: u._id.toString(),
        _id: undefined,
    })) as User[];
};