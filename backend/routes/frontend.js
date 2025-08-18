// backend/routes/frontendRoutes.js
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

const router = express.Router();

// Load common data middleware (e.g., settings, categories)
router.use(loadCommonData);

// -------------------- Public Routes --------------------

// Homepage - fetch all news or recent articles
router.get('/', index);

// Articles by category
router.get('/category/:name', articleByCategories);

// Single article by ID
router.get('/single/:id', singleArticle);

// Search articles
router.get('/search', search);

// Articles by author
router.get('/author/:name', author);

// Add comment to an article
router.post('/single/:id/comment', addComment);

// -------------------- Error Handling --------------------

// 404 - API route not found
router.use((req, res, next) => {
  res.status(404).json({ message: 'API route not found' });
});

// 500 - Internal Server Error
router.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Something went wrong', status });
});

export default router;
