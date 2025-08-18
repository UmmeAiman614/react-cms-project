// backend/routes/adminRoutes.js
import User from "../models/User.js"; // 👈 make sure the file name & path matches exactly
import bcrypt from "bcryptjs";
import express from 'express';
import upload from '../middlewares/multer.js';
import isLogggedin from '../middlewares/isLogggedin.js';
import isAdmin from '../middlewares/isAdmin.js';
import { loginValidation, userValidation, userUpdateValidation, categoryValidation, articleValidation } from '../middlewares/validation.js';


import {
  loginPage,
  adminLogin,
  logout,
  dashboard,
  settings,
  saveSettings,
  allUsers,
  addUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

import {
  allCategory,
  addCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

import {
  allArticle,
  addArticle,
  updateArticle,
  deleteArticle
} from '../controllers/articleController.js';

import {
  allComments,
  updateCommentStatus,
  deleteComments
} from '../controllers/commentController.js';

const router = express.Router();

// -------------------- Auth Routes --------------------

// -------------------- Auth Routes --------------------

// Login
router.post('/login', loginValidation, adminLogin);

// Logout
router.post('/logout', isLogggedin, logout);

// Dashboard (example: send stats as JSON)
router.get('/dashboard', isLogggedin, dashboard);

// Settings
router.get('/settings', isLogggedin, isAdmin, settings);
router.post('/save-settings', isLogggedin, isAdmin, upload.single('website_logo'), saveSettings);
// -------------------- Bootstrap Route (no auth) --------------------
// Use this ONLY to create your very first admin
router.post("/create-first-admin", async (req, res) => {
  try {
    const { fullname, username, password } = req.body;

    // Check if an admin already exists
    const existing = await User.findOne({ role: "admin" });
    if (existing) {
      return res
        .status(400)
        .json({ message: "An admin already exists. Please use login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullname,
      username,
      password: hashedPassword,
      role: "admin"
    });

    await user.save();

    res.status(201).json({ message: "First admin created", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// -------------------- User CRUD --------------------
router.get('/users',  allUsers);
router.post('/users',  userValidation, addUser);
router.put('/users/:id', userUpdateValidation, updateUser);
router.delete('/users/:id', deleteUser);

// -------------------- Category CRUD --------------------
router.get('/categories', allCategory);
router.post('/categories', categoryValidation, addCategory);
router.put('/categories/:id', categoryValidation, updateCategory);
router.delete('/categories/:id',  deleteCategory);

// -------------------- Article CRUD --------------------
router.get('/articles', allArticle);
router.post('/articles',  upload.single('image'), articleValidation, addArticle);
router.put('/articles/:id', upload.single('image'), articleValidation, updateArticle);
router.delete('/articles/:id', deleteArticle);


// -------------------- Comment Routes --------------------
router.get('/comments',  allComments);
router.put('/comments/:id/status',  updateCommentStatus);
router.delete('/comments/:id', deleteComments);

// -------------------- Error Handling --------------------
// 404
router.use((req, res, next) => {
  res.status(404).json({ message: 'API route not found' });
});

// 500
router.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Something went wrong' });
});

export default router;
