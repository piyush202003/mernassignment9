import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Please provide all fields (name, email, password, role)"
    });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists"
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
    });
  } else {
    return res.status(400).json({
      success: false, 
      message: " Invalid user data"
    });
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  return res.json(users);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: 'User removed successfully' });
  } else {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }
});