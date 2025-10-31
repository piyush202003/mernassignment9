import express from 'express';
import { handleScan } from '../controllers/logController.js';
import { isAuthenticated, isRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// /api/logs/scan
router.post( '/scan', isAuthenticated, isRole('security', 'admin'), handleScan );

export default router;