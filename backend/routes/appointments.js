import express from 'express';
import { createAppointment, getMyAppointments, updateAppointmentStatus, getAllEmployees, getVisitorAppointments } from '../controllers/appointmentController.js';
import { isAuthenticated, isRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// /api/appointments
router.post('/', isAuthenticated, isRole('visitor'), createAppointment);

// /api/appointments/my-appointments
router.get( '/my-appointments',  isAuthenticated,  isRole('visitor'),  getVisitorAppointments );

// /api/appointments/employees
router.get( '/employees',  isAuthenticated,  isRole('visitor'),  getAllEmployees);

// /api/appointments/my
router.get('/my', isAuthenticated, isRole('employee'), getMyAppointments);

// /api/appointments/:id/status
router.put( '/:id/status',  isAuthenticated,  isRole('employee'),  updateAppointmentStatus );

export default router;