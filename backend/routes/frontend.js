import express from 'express';
import loadCommonData from '../middlewares/loadCommonData.js';
import {
  index,
  articleByCategories,
  singleArticle,
  search,
  author,
  addComment
} from '../controllers/sideController.js';

import { allCategory } from '../controllers/categoryController.js';
import { settings } from '../controllers/userController.js';

const router = express.Router();
router.use(loadCommonData);

// Homepage
router.get('/', index);

// Categories for navbar (frontend only)
router.get('/category', (req, res, next) => {
  req.query.frontend = "true";
  next();
}, allCategory);

// Articles by category
router.get('/category/:name', articleByCategories);

// Single article
router.get('/single/:id', singleArticle);

// Search articles
router.get('/search', search);

// Articles by author
router.get('/author/:name', author);

// Add comment
router.post('/single/:id/comment', addComment);

// Public settings
router.get('/settings', settings);

// 404 handler
router.use((req, res) => res.status(404).json({ message: 'API route not found' }));

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
});

export default router;
