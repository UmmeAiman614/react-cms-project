// backend/routes/adminRoutes.js
import express from 'express';
import multer from '../middlewares/multer.js';
import {
  loginValidation,
  userValidation,
  userUpdateValidation,
  categoryValidation,
  articleValidation
} from '../middlewares/validation.js';
import isLoggedIn from '../middlewares/isLogggedin.js';
import isAdmin from '../middlewares/isAdmin.js';

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
  deleteArticle,
  getArticleById   // 👈 we’ll add this in controller
} from '../controllers/articleController.js';

import {
  allComments,
  updateCommentStatus,
  deleteComments
} from '../controllers/commentController.js';

const router = express.Router();

// -------------------- Auth Routes --------------------
router.get('/', loginPage);
router.post('/index', loginValidation, adminLogin);
router.get('/logout', logout);

// -------------------- Dashboard & Settings --------------------
router.get('/dashboard', isLoggedIn, dashboard);
router.get('/settings', isLoggedIn, settings);
router.post('/save-settings', isLoggedIn, multer.single('website_logo'), saveSettings);

// -------------------- User CRUD (admin-only) --------------------
router.get('/users', isLoggedIn, isAdmin, allUsers);
router.post('/add-user', isLoggedIn, isAdmin, userValidation, addUser);
router.put('/update-user/:id', isLoggedIn, isAdmin, userUpdateValidation, updateUser);
router.delete('/delete-user/:id', isLoggedIn, isAdmin, deleteUser);

// -------------------- Category CRUD (admin-only) --------------------

router.get('/category', isLoggedIn, allCategory); // ✅ keep open for all logged-in
router.post('/add-category', isLoggedIn, isAdmin, categoryValidation, addCategory);
router.put('/update-category/:id', isLoggedIn, isAdmin, categoryValidation, updateCategory);
router.delete('/delete-category/:id', isLoggedIn, isAdmin, deleteCategory);

// -------------------- Article CRUD --------------------
// ✅ removed isAdmin middleware
router.get('/article', isLoggedIn, allArticle);
router.get('/update-article/:id', isLoggedIn, getArticleById);
router.post('/add-article', isLoggedIn, multer.single('image'), articleValidation, addArticle);
router.put('/update-article/:id', isLoggedIn, multer.single('image'), articleValidation, updateArticle);
router.delete('/delete-article/:id', isLoggedIn, deleteArticle);


// -------------------- Comment Routes --------------------
router.get('/comment', isLoggedIn, allComments);
router.put('/update-comment-status/:id', isLoggedIn, updateCommentStatus);
router.delete('/delete-comment/:id', isLoggedIn, deleteComments);

// -------------------- Error Handling --------------------
router.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Something went wrong' });
});

export default router;
