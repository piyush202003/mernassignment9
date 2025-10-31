import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    visitorName: {
      type: String,
      required: true,
    },
    visitorEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'CheckedIn', 'CheckedOut'],
      default: 'Pending',
    },
    appointmentTime: {
      type: Date,
      required: true,
    },
    qrCodeUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;