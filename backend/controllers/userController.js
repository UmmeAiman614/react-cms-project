// backend/controllers/userController.js
import User from '../models/User.js';
import Category from '../models/Category.js';
import Setting from '../models/settings.js';
import Article from '../models/News.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();

// -------------------- Auth Routes --------------------

// GET login info
export const loginPage = (req, res) => {
  res.json({ message: 'Admin login route' });
};

// POST login
export const adminLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid username or password" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, fullname: user.fullname, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set token as HttpOnly cookie
   // adminLogin
res.cookie("token", token, {
  httpOnly: true,
  secure: false,       // must be false for localhost HTTP
  sameSite: "lax",     // Lax works for cross-port on localhost
  maxAge: 60 * 60 * 1000
});




    // Send user info (optional, frontend can store in local state)
    res.json({
      message: "Login successful",
      user: { id: user._id, fullname: user.fullname, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET logout
export const logout = (req, res) => {
  res.json({ message: 'Logout route (frontend will handle token removal)' });
};

// GET dashboard stats
export const dashboard = async (req, res) => {
  console.log("➡️ Dashboard request received");
    console.log("Decoded user:", req.user); // check user from middleware
  try {
    let articlesCount;

    if (req.user.role === "author") {
      articlesCount = await Article.countDocuments({ author: req.user.id });
    } else {
      articlesCount = await Article.countDocuments();
    }

    const categoriesCount = await Category.countDocuments();
    const usersCount = await User.countDocuments();

    res.json({
      fullname: req.user.fullname || "",
      role: req.user.role || "",
      articlesCount,
      categoriesCount,
      usersCount,
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    res.status(500).json({ message: error.message });
  }
};




// GET settings
export const settings = async (req, res) => {
  try {
    const settings = await Setting.findOne();
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST save settings
export const saveSettings = async (req, res) => {
  const { website_title, footer_description } = req.body;
  const website_logo = req.file?.filename;

  try {
    const settings = (await Setting.findOne()) || new Setting();
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
    res.json({ message: 'Settings saved successfully', settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- User CRUD --------------------

// GET all users
export const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST add user
export const addUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update user
export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullname, password, role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.fullname = fullname || user.fullname;
    if (password) user.password = password; // hashed in pre-save hook
    user.role = role || user.role;

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const article = await Article.findOne({ author: req.params.id });
    if (article) return res.status(400).json({ message: 'User is associated with articles' });

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
