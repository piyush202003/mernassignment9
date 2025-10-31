import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { sendVerificationOTPEmail } from '../utils/emailService.js';
import { cloudinary } from '../middleware/uploadMiddleware.js';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    photoUrl: user.photoUrl || '',
    createdAt: user.createdAt,
  });
});

export const sendEmailVerificationOtp = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.isEmailVerified) {
    return res.status(400).json({
      message: 'This email is already verified'
    });
  }

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  try {
    await sendVerificationOTPEmail(user, otp);
    res.json({ message: 'A new OTP has been sent to your email.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Email could not be sent. Please try again later.'
    });
  }
});
export const verifyEmailOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      message: 'Please enter your OTP'
    });
  }

  const user = await User.findById(req.user._id).select('+otp +otpExpires');

  if (user.isEmailVerified) {
    return res.status(400).json({
      message: 'This email is already verified'
    });
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({
      message: 'Invalid OTP or OTP has expired'
    });
  }
  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  res.json({
    message: 'Email verified successfully!',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    },
  });
});

export const updateProfilePhoto = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      message: 'User not found'
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: "No image file provided"
    });
  }

  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'user-profiles',
      public_id: req.user._id.toString(), 
      overwrite: true,
    });

    user.photoUrl = uploadResult.secure_url;
    await user.save();

    res.json({
      message: 'Profile photo updated successfully',
      photoUrl: user.photoUrl,
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return res.status(500).json({
      message: "Image upload failed. Please try again"
    });
  }
});