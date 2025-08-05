import { Router } from 'express';
import {
    createUser,
    getUsers,
    // getUserById,
    updateUser,
    deleteUser,
    // toggleUserStatus,
} from '../controllers/users.controller';

const router = Router();

router.get('/', getUsers);
// router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
