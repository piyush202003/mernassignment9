import express from 'express';
import { getMyProfile, sendEmailVerificationOtp, verifyEmailOtp, updateProfilePhoto } from '../controllers/profileController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();
router.use(isAuthenticated);

// /api/profile/me
router.get('/me', getMyProfile);

// /api/profile/send-email-otp
router.post('/send-email-otp', sendEmailVerificationOtp);

// /api/profile/verify-email-otp
router.post('/verify-email-otp', verifyEmailOtp);

// /api/profile/photo
router.put(
  '/photo',
  upload.single('photo'),
  updateProfilePhoto
);

export default router;