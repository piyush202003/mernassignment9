import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';
import CheckLog from '../models/CheckLogs.js';

export const handleScan = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;
  const securityStaffId = req.user._id;

  if (!appointmentId) {
    return res.status(400).json({
      message: 'No appointment ID provided'
    });
  }

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    return res.status(404).json({
      message: 'Invalid QR Code: Appointment not found'
    });
  }

  if (appointment.status === 'Pending') {
    return res.status(400).json({
      message: 'This pass is not yet approved'
    });
  }
  if (appointment.status === 'Rejected') {
    return res.status(400).json({
      message: 'This pass has been rejected'
    });
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const existingLog = await CheckLog.findOne({
    appointment: appointmentId,
    checkInTime: { $gte: todayStart, $lte: todayEnd },
  });

  if (existingLog) {
    
    if (existingLog.status === 'CheckedIn') {
      existingLog.status = 'CheckedOut';
      existingLog.checkOutTime = new Date();
      await existingLog.save();
      
      appointment.status = 'CheckedOut';
      await appointment.save();
      
      res.json({
        message: 'Check-Out Successful',
        visitorName: appointment.visitorName,
        checkOutTime: existingLog.checkOutTime,
      });

    } else {
      return res.status(400).json({
        message: 'This visitor has already checked out for the day'
      });
    }

  } else {
    const newLog = await CheckLog.create({
      appointment: appointmentId,
      host: appointment.host,
      visitorName: appointment.visitorName,
      securityStaff: securityStaffId,
      checkInTime: new Date(),
      status: 'CheckedIn',
    });
    appointment.status = 'CheckedIn';
    await appointment.save();
    
    res.status(201).json({
      message: 'Check-In Successful',
      visitorName: appointment.visitorName,
      checkInTime: newLog.checkInTime,
    });
  }
});