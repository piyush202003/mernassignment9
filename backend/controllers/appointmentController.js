import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import qrcode from 'qrcode';
import { cloudinary } from '../middleware/uploadMiddleware.js';
import { sendAppointmentEmail } from '../utils/emailService.js';

export const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await User.find({ role: 'employee' }).select('_id name');
  res.json(employees);
});

export const createAppointment = asyncHandler(async (req, res) => {
  const { purpose, host, appointmentTime } = req.body;
  
  const visitorId = req.user._id;
  const visitorName = req.user.name;
  const visitorEmail = req.user.email;

  if (!purpose || !host || !appointmentTime) {
    return res.status(400).json({
      message: 'Please fill out all fields'
    });
  }
  const hostExists = await User.findOne({ _id: host, role: 'employee' });
  if (!hostExists) {
    return res.status(404).json({
      message: 'Selected host (employee) does not exist'
    });
  }

  const appointment = await Appointment.create({
    visitor: visitorId, 
    visitorName,        
    visitorEmail,       
    purpose,
    host,
    appointmentTime,
    status: 'Pending',
  });

  return res.status(201).json(appointment);
});


export const getVisitorAppointments = asyncHandler(async (req, res) => {
  const visitorId = req.user._id;

  const appointments = await Appointment.find({ visitor: visitorId })
    .populate('host', 'name') 
    .sort({ createdAt: -1 }); 

  return res.json(appointments);
});

export const getMyAppointments = asyncHandler(async (req, res) => {
  const employeeId = req.user._id;
  const appointments = await Appointment.find({ host: employeeId }).sort({
    createdAt: -1,
  });
  return res.json(appointments);
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return res.status(404).json({
      message: 'Appointment not found'
    });
  }

  if (appointment.host.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: 'You are not authorized to update this appointment'
    });
  }

  if (status === 'Approved' && !appointment.qrCodeUrl) {
    try {
      const qrDataUrl = await qrcode.toDataURL(appointment._id.toString());
      const uploadResult = await cloudinary.uploader.upload(qrDataUrl, {
        folder: 'visitor-qr-codes',
      });
      appointment.qrCodeUrl = uploadResult.secure_url;
      sendAppointmentEmail(appointment, uploadResult.secure_url);
    } catch (error) {
      console.error('Error during QR/Email generation:', error);
    }
  }

  appointment.status = status;
  const updatedAppointment = await appointment.save();
  return res.json(updatedAppointment);
});