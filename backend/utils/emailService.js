import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAppointmentEmail = async (appointment, qrCodeUrl) => {
  try {
    const mailOptions = {
      from: `"VisitorPass" <${process.env.EMAIL_USER}>`,
      to: appointment.visitorEmail,
      subject: 'Your Visitor Pass is Approved!',
      html: `
        <h1>Your Appointment is Confirmed</h1>
        <p>Hello ${appointment.visitorName},</p>
        <p>Your appointment for <strong>${new Date(
          appointment.appointmentTime
        ).toLocaleString()}</strong> has been approved.</p>
        
        <p>Please use the QR code below to check in when you arrive:</p>
        <img src="${qrCodeUrl}" alt="Your QR Code" />
        
        <p>Thank you!</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendVerificationOTPEmail = async (user, otp) => {
  try {
    const mailOptions = {
      from: `"VisitorPass" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your VisitorPass Verification Code',
      html: `
        <h1>Email Verification</h1>
        <p>Hello ${user.name},</p>
        <p>Thank you for registering. Your One-Time Password (OTP) is:</p>
        <h2 style="color: #333; font-size: 24px; letter-spacing: 2px;">${otp}</h2>
        <p>This code will expire in 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification OTP email sent to:', user.email);
  } catch (error) {
    console.error('Error sending verification OTP email:', error);
  }
};

export const sendPasswordResetOTPEmail = async (user, otp) => {
  try {
    const mailOptions = {
      from: `"VisitorPass" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your VisitorPass Password Reset Code',
      html: `
        <h1>Password Reset Request</h1>
        <p>Hello ${user.name},</p>
        <p>We received a request to reset your password. Use the code below:</p>
        <h2 style="color: #333; font-size: 24px; letter-spacing: 2px;">${otp}</h2>
        <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset OTP email sent to:', user.email);
  } catch (error) {
    console.error('Error sending password reset OTP email:', error);
  }
};
