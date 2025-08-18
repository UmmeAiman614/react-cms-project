// backend/controllers/userController.js
import userModel from '../models/User.js';
import categoryModel from '../models/Category.js';
import articleModel from '../models/News.js';
import settingModel from '../models/settings.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import createError from '../utils/error-message.js';

dotenv.config();

// Login page (React will handle frontend)
export const loginPage = async (req, res) => {
  res.json({ message: 'Login endpoint. Use POST /admin/login to authenticate.' });
};

// Admin login
export const adminLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username });
    if (!user) return next(createError('Invalid username or password', 401));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(createError('Invalid username or password', 401));

    const jwData = { id: user._id, fullname: user.fullname, role: user.role };
    const token = jwt.sign(jwData, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      maxAge: 60 * 60 * 1000,
      httpOnly: true
    });

    res.json({ message: 'Login successful', token, user: jwData });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

// Dashboard stats
export const dashboard = async (req, res, next) => {
  try {
    let articles;
    if (req.role === 'author') {
      articles = await articleModel.countDocuments({ author: req.id });
    } else {
      articles = await articleModel.countDocuments();
    }
    const categories = await categoryModel.countDocuments();
    const users = await userModel.countDocuments();

    res.json({ articles, categories, users, role: req.role, fullname: req.fullname });
  } catch (error) {
    next(error);
  }
};

// Get settings
export const settings = async (req, res, next) => {
  try {
    const settings = await settingModel.findOne();
    res.json({ settings: settings || {} });
  } catch (error) {
    next(error);
  }
};

// Save/update settings
export const saveSettings = async (req, res, next) => {
  const { website_title, footer_description } = req.body;
  const website_logo = req.file?.filename;

  try {
    const settings = await settingModel.findOne() || new settingModel();
    settings.website_title = website_title;
    settings.footer_description = footer_description;

    if (website_logo) {
      if (settings.website_logo) {
        const logoPath = `./public/uploads/${settings.website_logo}`;
        if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
      }
      settings.website_logo = website_logo;
    }

    await settings.save();
    res.json({ message: 'Settings saved', settings });
  } catch (error) {
    next(error);
  }
};

// Get all users
export const allUsers = async (req, res) => {
  const users = await userModel.find();
  res.json({ users, role: req.role });
};

// Add user
export const addUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await userModel.create(req.body);
    res.status(201).json({ message: 'User added', user });
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullname, password, role } = req.body;
  try {
    const user = await userModel.findById(id);
    if (!user) return next(createError('User not found', 404));

    user.fullname = fullname || user.fullname;
    if (password) user.password = password;
    user.role = role || user.role;

    await user.save();
    res.json({ message: 'User updated', user });
  } catch (error) {
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userModel.findById(id);
    if (!user) return next(createError('User not found', 404));

    const article = await articleModel.findOne({ author: id });
    if (article) return res.status(400).json({ success: false, message: 'User is associated with articles' });

    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
