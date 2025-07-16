import { Router } from 'express';
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    toggleUserStatus,
} from '../controllers/users.controller';

const router = Router();

router.post('/', createUser);        // Create
router.get('/', getUsers);           // Read All
router.get('/:id', getUserById);     // Read One
router.put('/:id', updateUser);      // Update
router.delete('/:id', deleteUser);   // Delete
router.put('/:user_id/toggle-status', toggleUserStatus);

export default router;
