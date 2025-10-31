import asyncHandler from 'express-async-handler';
import CheckLog from '../models/CheckLogs.js';

export const getLogsReport = asyncHandler(async (req, res) => {
  const { status, host, visitorName, startDate, endDate } = req.query;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (host) {
    query.host = host;
  }

  if (visitorName) {
    query.visitorName = { $regex: visitorName, $options: 'i' };
  }

  if (startDate) {
    query.checkInTime = { ...query.checkInTime, $gte: new Date(startDate) };
  }

  if (endDate) {
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    query.checkInTime = { ...query.checkInTime, $lte: endOfDay };
  }
  const logs = await CheckLog.find(query)
    .populate('host', 'name email')
    .populate('securityStaff', 'name email')
    .sort({ checkInTime: -1 });

  res.json(logs);
});