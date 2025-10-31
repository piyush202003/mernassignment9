import mongoose from 'mongoose';

const checkLogSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    visitorName: {
      type: String,
      required: true,
    },
    securityStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkInTime: {
      type: Date,
      required: true,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['CheckedIn', 'CheckedOut'],
      default: 'CheckedIn',
    },
  },
  {
    timestamps: true,
  }
);

const CheckLog = mongoose.model('CheckLog', checkLogSchema);

export default CheckLog;