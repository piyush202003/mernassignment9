import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      message: 'User already exists'
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    return res.status(400).json({
      message: "Invalid user data"
    });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    return res.status(401).json({
      message: "Invalid email or password"
    });
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: 'If this email is registered, a password reset OTP has been sent.' });
  }
  const otp = generateOTP();
  user.passwordResetOtp = otp;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendPasswordResetOTPEmail(user, otp);

  return res.json({ message: 'A password reset OTP has been sent to your email.' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      message: 'Please provide email, OTP, and a new password'
    });
  }

  const user = await User.findOne({ email }).select('+passwordResetOtp +passwordResetExpires');

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or OTP"
    });
  }

  if (user.passwordResetOtp !== otp || user.passwordResetExpires < Date.now()) {
    return res.status(400).json({
      message: 'Invalid OTP or OTP has expired'
    });
  }

  user.password = newPassword;
  user.passwordResetOtp = undefined;
  user.passwordResetExpires = undefined;
  
  await user.save();

  res.json({ message: 'Password has been reset successfully. You can now log in.' });
});