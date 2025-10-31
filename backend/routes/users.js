import express from 'express';
import {createUser,getAllUsers,deleteUser,} from '../controllers/userController.js';
import { isAuthenticated, isRole} from '../middleware/authMiddleware.js';


const router = express.Router();

// /api/users
router.get('/', isAuthenticated, isRole('admin'), getAllUsers);

// /api/users
router.post('/', isAuthenticated, isRole('admin'), createUser);

// DELETE /api/users/:id
router.delete('/:id', isAuthenticated, isRole('admin'), deleteUser);

export default router;