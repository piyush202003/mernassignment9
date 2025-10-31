import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// /api/auth/register
router.post('/register', registerUser);

// /api/auth/login
router.post('/login', loginUser);

// /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// /api/auth/reset-password
router.post('/reset-password', resetPassword);

export default router;