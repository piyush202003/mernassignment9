import asyncHandler from 'express-async-handler';
import Visitor from '../models/Visitor.js';
import { cloudinary } from '../middleware/uploadMiddleware.js';

export const createVisitor = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400);
    throw new Error('Please provide name, email, and phone');
  }

  const visitorExists = await Visitor.findOne({ email });

  if (visitorExists) {
    res.status(400);
    throw new Error('A visitor profile with this email already exists');
  }

  let photoUrl = '';
  if (req.file) {
    try {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: 'visitor-photos',
      });

      photoUrl = uploadResult.secure_url;
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      res.status(500);
      throw new Error('Image upload failed. Please try again.');
    }
  }

  const visitor = await Visitor.create({
    name,
    email,
    phone,
    photoUrl,
  });

  res.status(201).json(visitor);
});