import express from 'express';
import { getLogsReport } from '../controllers/reportController.js';
import { isAuthenticated, isRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// /api/reports/logs
router.get( '/logs', isAuthenticated, isRole('admin'), getLogsReport );

export default router;